import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateCommentDto } from './dto/create-comment.dto'
import { DeleteCommentResponseDto } from './dto/delete-comment-response.dto'
import { ResponseCommentDto } from './dto/response-comment.dto'
import { CommentEntity } from './entities/comment.entity'

@Injectable()
export class CommentService {
  constructor(private readonly prismaService: PrismaService) {}

  async commentOnPost(createCommentDto: CreateCommentDto) {
    try {
      const { postId, userId, content } = createCommentDto
      const newComment = await this.prismaService.comment.create({
        data: {
          postId,
          userId,
          content,
        },
      })

      // Ajoute un commentaire au compteur
      await this.prismaService.post.update({
        where: { id: createCommentDto.postId },
        data: { commentsCount: { increment: 1 } },
      })

      return new CommentEntity(newComment)
    } catch (error) {
      console.error(error)
      throw new Error('An error occured when creating a comment')
    }
  }

  async findCommentsOnPost(postId: string) {
    try {
      const comments = await this.prismaService.comment.findMany({
        where: {
          postId: postId,
          parentId: null,
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          Users: true, // Inclure les données de l'utilisateur associé
        },
      })

      const transformedComments = await Promise.all(
        comments.map(async (comment) => {
          // Ca compte le nombre de réponses pour chaque commentaire
          const repliesCount = await this.prismaService.comment.count({
            where: {
              rootCommentId: comment.id,
            },
          })

          return {
            commentId: comment.id, // ID du commentaire
            username: comment.Users.name, // Nom de l'utilisateur
            content: comment.content, // Contenu du commentaire
            likes: comment.likesCount, // Nombre de likes
            reposts: comment.repostsCount, // Nombre de reposts
            createdAt: comment.createdAt, // Date de création
            responseNumber: repliesCount, // Nombre de réponses
          }
        })
      )

      return transformedComments
    } catch (error) {
      console.error(error)
      throw new Error('An error occurred when getting comments ont this post')
    }
  }

  async respondOnComment(responseCommentDto: ResponseCommentDto) {
    try {
      const { postId, userId, content, parentId } = responseCommentDto
      let rootCommentId = parentId

      // Si c'est une réponse à une autre réponse, on trouve le commentaire racine.
      if (parentId) {
        const parentComment = await this.prismaService.comment.findUnique({
          where: { id: parentId },
          select: { rootCommentId: true },
        })
        // Si le commentaire parent a un rootCommentId, on l'utilise.
        if (parentComment?.rootCommentId) {
          rootCommentId = parentComment.rootCommentId
        }
      }

      const newComment = await this.prismaService.comment.create({
        data: {
          postId,
          userId,
          content,
          parentId,
          rootCommentId,
        },
      })

      return new CommentEntity(newComment)
    } catch (error) {
      console.error(error)
      throw new Error('An error occurred when creating a response')
    }
  }

  async findReponsesToComment(commentId: string) {
    try {
      const responses = await this.prismaService.comment.findMany({
        where: {
          rootCommentId: commentId,
        },
        orderBy: {
          createdAt: 'asc',
        },
        include: {
          Users: true, // Inclure les données de l'utilisateur associé
        },
      })

      const transformedResponses = await Promise.all(
        responses.map(async (responses) => {
          // Compter le nombre de réponses pour chaque réponses
          const repliesCount = await this.prismaService.comment.count({
            where: {
              rootCommentId: responses.id,
            },
          })

          let originalUsername = null
          if (responses.parentId) {
            const originalComment = await this.prismaService.comment.findUnique(
              {
                where: {
                  id: responses.parentId,
                },
                include: {
                  Users: true,
                },
              }
            )
            originalUsername = originalComment?.Users?.name
          }

          return {
            commentId: responses.id, // ID du commentaire
            username: responses.Users.name, // Nom de l'utilisateur
            respondedToThisUser: originalUsername,
            content: responses.content, // Contenu du commentaire
            likes: responses.likesCount, // Nombre de likes
            reposts: responses.repostsCount, // Nombre de reposts
            createdAt: responses.createdAt, // Date de création
            responseNumber: repliesCount, // Nombre de réponses
            rootId: responses.rootCommentId,
            parentId: responses.parentId,
          }
        })
      )

      return transformedResponses
    } catch (error) {
      console.error(error)
      throw new Error('An error occurred when getting comments ont this post')
    }
  }

  async deleteCommentOrReponse(
    deleteCommentOrReponseDto: DeleteCommentResponseDto
  ) {
    try {
      const { commentId } = deleteCommentOrReponseDto

      const responses = await this.prismaService.comment.findMany({
        where: {
          parentId: commentId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          Users: true,
        },
      })

      const responseIds = responses.map((response) => response.id)

      // Supprimer les likes des reponses
      await this.prismaService.like.deleteMany({
        where: { commentId: { in: responseIds } },
      })

      // Supprimer les reposts des reponses
      await this.prismaService.repost.deleteMany({
        where: { commentId: { in: responseIds } },
      })

      // Supprimer les reponses
      await this.prismaService.comment.deleteMany({
        where: { id: { in: responseIds } },
      })

      // Supprimer les reposts du commentaires
      await this.prismaService.repost.deleteMany({
        where: { commentId: commentId },
      })

      // Supprimer les likes du commentaires
      await this.prismaService.like.deleteMany({
        where: { commentId: commentId },
      })

      // Supprimer le commentaire
      await this.prismaService.comment.delete({
        where: { id: commentId },
      })

      return { message: 'Comment and its responses successfully deleted.' }
    } catch (error) {
      console.error(error)
      throw new Error(
        'An error occurred when deleting the comment and its responses.'
      )
    }
  }
}
