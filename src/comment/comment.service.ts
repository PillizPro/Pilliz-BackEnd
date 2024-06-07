import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateCommentDto } from './dto/create-comment.dto'
import { DeleteCommentResponseDto } from './dto/delete-comment-response.dto'
import { ResponseCommentDto } from './dto/response-comment.dto'
import { FetchCommentDto } from './dto/fetch-comment.dto'
import { FetchResponsesDto } from './dto/fetch-responses.dto'
import { CommentEntity } from './entities/comment.entity'

@Injectable()
export class CommentService {
  constructor(private readonly prismaService: PrismaService) {}

  async commentOnPost(createCommentDto: CreateCommentDto, userId: string) {
    try {
      const { postId, content } = createCommentDto
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

  async findCommentsOnPost(fetchCommentDto: FetchCommentDto, userId: string) {
    try {
      const { postId } = fetchCommentDto

      const currentUser = await this.prismaService.users.findUnique({
        where: { id: userId },
        select: { blockedUsers: true, hiddenUsers: true, hiddenWords: true },
      })

      const blockedUsers = currentUser?.blockedUsers ?? []
      const hiddenUsers = currentUser?.hiddenUsers ?? []
      const hiddenWords = currentUser?.hiddenWords ?? []

      const allUsers = await this.prismaService.users.findMany({
        select: { id: true, blockedUsers: true },
      })

      const blockerIds = allUsers
        .filter((user) => user.blockedUsers.includes(userId))
        .map((user) => user.id)

      const excludedUserIds = [...blockedUsers, ...hiddenUsers, ...blockerIds]

      const comments = await this.prismaService.comment.findMany({
        where: {
          postId: postId,
          parentId: null,
          userId: { notIn: excludedUserIds },
          AND: [
            {
              content: {
                not: {
                  in: hiddenWords,
                },
              },
            },
          ],
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          Users: true,
        },
      })

      const filteredComment = comments.filter((comment) => {
        return !hiddenWords.some((word) => comment.content?.includes(word))
      })

      const transformedComments = await Promise.all(
        filteredComment.map(async (comment) => {
          const repliesCount = await this.prismaService.comment.count({
            where: {
              rootCommentId: comment.id,
            },
          })

          return {
            userId: comment.userId,
            commentId: comment.id, // ID of the comment
            userImgUrl: comment.Users?.profilPicture, // User Profil Picture
            username: comment.Users.name, // User's name
            content: comment.content, // Content of the comment
            likes: comment.likesCount, // Number of likes
            reposts: comment.repostsCount, // Number of reposts
            createdAt: comment.createdAt, // Creation date
            responseNumber: repliesCount, // Number of responses
          }
        })
      )

      return transformedComments
    } catch (error) {
      console.error(error)
      throw new Error('An error occurred when getting comments on this post')
    }
  }

  async respondOnComment(
    responseCommentDto: ResponseCommentDto,
    userId: string
  ) {
    try {
      const { postId, content, parentId } = responseCommentDto
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

  async findReponsesToComment(
    fetchResponsesDto: FetchResponsesDto,
    userId: string
  ) {
    try {
      const { commentId } = fetchResponsesDto

      const currentUser = await this.prismaService.users.findUnique({
        where: { id: userId },
        select: { blockedUsers: true, hiddenUsers: true, hiddenWords: true },
      })

      const blockedUsers = currentUser?.blockedUsers ?? []
      const hiddenUsers = currentUser?.hiddenUsers ?? []
      const hiddenWords = currentUser?.hiddenWords ?? []

      const allUsers = await this.prismaService.users.findMany({
        select: { id: true, blockedUsers: true },
      })

      const blockerIds = allUsers
        .filter((user) => user.blockedUsers.includes(userId))
        .map((user) => user.id)

      const excludedUserIds = [...blockedUsers, ...hiddenUsers, ...blockerIds]

      const responses = await this.prismaService.comment.findMany({
        where: {
          rootCommentId: commentId,
          userId: { notIn: excludedUserIds },
          AND: [
            {
              content: {
                not: {
                  in: hiddenWords,
                },
              },
            },
          ],
        },
        orderBy: {
          createdAt: 'asc',
        },
        include: {
          Users: true,
        },
      })

      const filteredReponse = responses.filter((response) => {
        return !hiddenWords.some((word) => response.content?.includes(word))
      })

      const transformedResponses = await Promise.all(
        filteredReponse.map(async (response) => {
          const repliesCount = await this.prismaService.comment.count({
            where: {
              rootCommentId: response.id,
            },
          })

          let originalUsername = null
          if (response.parentId) {
            const originalComment = await this.prismaService.comment.findUnique(
              {
                where: {
                  id: response.parentId,
                },
                include: {
                  Users: true,
                },
              }
            )
            originalUsername = originalComment?.Users?.name
          }

          return {
            userId: response.userId,
            commentId: response.id, // ID of the comment
            username: response.Users.name, // Name of the user
            respondedToThisUser: originalUsername,
            content: response.content, // Content of the comment
            likes: response.likesCount, // Number of likes
            reposts: response.repostsCount, // Number of reposts
            createdAt: response.createdAt, // Creation date
            responseNumber: repliesCount, // Number of responses
            rootId: response.rootCommentId,
            parentId: response.parentId,
          }
        })
      )

      return transformedResponses
    } catch (error) {
      console.error(error)
      throw new Error('An error occurred when getting comments on this post')
    }
  }

  async deleteCommentOrReponse(
    deleteCommentOrReponseDto: DeleteCommentResponseDto
  ) {
    try {
      const { commentId } = deleteCommentOrReponseDto

      const comment = await this.prismaService.comment.findUnique({
        where: { id: commentId },
      })

      if (!comment) throw new Error('Comment not found')

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

      // Réduit le compteur de commentaire sur le post d'origine
      if (!comment.rootCommentId && !comment.parentId) {
        await this.prismaService.post.update({
          where: { id: comment.postId },
          data: { commentsCount: { decrement: 1 } },
        })
      }

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
