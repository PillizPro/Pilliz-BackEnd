import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { LikePostDto } from './dto/like-post.dto'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export class LikeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async like(likeDto: LikePostDto, userId: string) {
    // Vérifier si c'est un like de post ou de commentaire
    const whereClause = likeDto.postId
      ? { userId: userId, postId: likeDto.postId }
      : { userId: userId, commentId: likeDto.commentId }

    const existingLike = await this.prisma.like.findFirst({
      where: whereClause,
    })

    if (!existingLike) {
      // Créer un nouveau like
      await this.prisma.like.create({ data: { ...likeDto, userId } })

      // Mise à jour du compteur de likes
      if (likeDto.postId) {
        const post = await this.prisma.post.update({
          where: { id: likeDto.postId },
          data: { likesCount: { increment: 1 } },
          include: { Users: true },
        })
        this.eventEmitter.emit(
          'notifyUser',
          1,
          userId,
          post.content,
          post.userId
        )
      } else if (likeDto.commentId) {
        const comment = await this.prisma.comment.update({
          where: { id: likeDto.commentId },
          data: { likesCount: { increment: 1 } },
          include: { Users: true },
        })
        this.eventEmitter.emit(
          'notifyUser',
          2,
          userId,
          comment.content,
          comment.userId
        )
      }
    }
  }

  async unlike(likeDto: LikePostDto, userId: string) {
    // Vérifier si c'est un unlike de post ou de commentaire
    const whereClause = likeDto.postId
      ? { userId: userId, postId: likeDto.postId }
      : { userId: userId, commentId: likeDto.commentId }

    const existingLike = await this.prisma.like.findFirst({
      where: whereClause,
    })

    if (existingLike) {
      // Supprimer le like
      await this.prisma.like.delete({ where: { id: existingLike.id } })

      // Mise à jour du compteur de likes
      if (likeDto.postId) {
        await this.prisma.post.update({
          where: { id: likeDto.postId },
          data: { likesCount: { decrement: 1 } },
        })
      } else if (likeDto.commentId) {
        await this.prisma.comment.update({
          where: { id: likeDto.commentId },
          data: { likesCount: { decrement: 1 } },
        })
      }
    }
  }

  async getLikedPostsByUser(userId: string): Promise<string[]> {
    const likedPosts = await this.prisma.like.findMany({
      where: {
        userId: userId,
      },
      select: {
        postId: true,
      },
    })

    return likedPosts
      .map((like) => like.postId)
      .filter((postId): postId is string => postId !== null)
  }

  async getLikedCommentsByUser(userId: string): Promise<string[]> {
    const likedComments = await this.prisma.like.findMany({
      where: {
        userId: userId,
      },
      select: {
        commentId: true,
      },
    })

    return likedComments
      .map((like) => like.commentId)
      .filter((commentId): commentId is string => commentId !== null)
  }
}
