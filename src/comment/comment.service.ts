import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateCommentDto } from './dto/create-comment.dto'
import { CommentEntity } from './entities/comment.entity'

@Injectable()
export class CommentService {
  constructor(private readonly prismaService: PrismaService) { }

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
          postId: postId
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          Users: true, // Inclure les données de l'utilisateur associé
        },
      });

      const transformedComments = comments.map((comment) => ({
        commentId: comment.id, // ID du commentaire
        username: comment.Users.name, // Nom de l'utilisateur
        content: comment.content, // Contenu du commentaire
        likes: comment.likesCount, // Nombre de likes
        reposts: comment.repostsCount, // Nombre de reposts
        createdAt: comment.createdAt, // Date de création
      }));

      return transformedComments;
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred when getting comments ont this post');
    }
  }

}
