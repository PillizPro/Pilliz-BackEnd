import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { RepostDto } from './dto/repost.dto'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export class RepostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async repost(repostDto: RepostDto, userId: string) {
    // Vérifier si c'est un repost de post ou de commentaire
    const whereClause = repostDto.postId
      ? { userId: userId, postId: repostDto.postId }
      : { userId: userId, commentId: repostDto.commentId }

    const existingRepost = await this.prisma.repost.findFirst({
      where: whereClause,
    })

    if (!existingRepost) {
      // Créer une nouvelle republication
      await this.prisma.repost.create({ data: { ...repostDto, userId } })

      // Mise à jour du compteur de reposts
      if (repostDto.postId) {
        const post = await this.prisma.post.update({
          where: { id: repostDto.postId },
          data: { repostsCount: { increment: 1 } },
        })
        this.eventEmitter.emit(
          'notifyUser',
          4,
          userId,
          post.content,
          post.userId
        )
      } else if (repostDto.commentId) {
        const comment = await this.prisma.comment.update({
          where: { id: repostDto.commentId },
          data: { repostsCount: { increment: 1 } },
        })
        this.eventEmitter.emit(
          'notifyUser',
          5,
          userId,
          comment.content,
          comment.userId
        )
      }
    }
  }

  async unrepost(repostDto: RepostDto, userId: string) {
    // Vérifier si c'est un repost de post ou de commentaire
    const whereClause = repostDto.postId
      ? { userId: userId, postId: repostDto.postId }
      : { userId: userId, commentId: repostDto.commentId }

    const existingRepost = await this.prisma.repost.findFirst({
      where: whereClause,
    })

    if (existingRepost) {
      // Supprimer le repost
      await this.prisma.repost.delete({ where: { id: existingRepost.id } })

      // Mise à jour du compteur de reposts
      if (repostDto.postId) {
        await this.prisma.post.update({
          where: { id: repostDto.postId },
          data: { repostsCount: { decrement: 1 } },
        })
      } else if (repostDto.commentId) {
        await this.prisma.comment.update({
          where: { id: repostDto.commentId },
          data: { repostsCount: { decrement: 1 } },
        })
      }
    }
  }

  async getRepostedPostsByUser(userId: string): Promise<string[]> {
    const repostedPosts = await this.prisma.repost.findMany({
      where: {
        userId: userId,
      },
      select: {
        postId: true,
      },
    })

    return repostedPosts
      .map((repost) => repost.postId)
      .filter((postId): postId is string => postId !== null)
  }

  async getRepostedCommentsByUser(userId: string): Promise<string[]> {
    const repostedComments = await this.prisma.repost.findMany({
      where: {
        userId: userId,
      },
      select: {
        commentId: true,
      },
    })

    // Filtrer les valeurs nulles et renvoyer seulement les string
    return repostedComments
      .map((repost) => repost.commentId)
      .filter((commentId): commentId is string => commentId !== null)
  }
}
