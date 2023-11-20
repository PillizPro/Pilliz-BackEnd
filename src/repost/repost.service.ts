import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { RepostDto } from './dto/repost.dto'

@Injectable()
export class RepostService {
  constructor(private prisma: PrismaService) { }

  async repost(repostDto: RepostDto) {
    // Vérifier si c'est un repost de post ou de commentaire
    const whereClause = repostDto.postId
      ? { userId: repostDto.userId, postId: repostDto.postId }
      : { userId: repostDto.userId, commentId: repostDto.commentId };

    const existingRepost = await this.prisma.repost.findFirst({ where: whereClause });

    if (!existingRepost) {
      // Créer une nouvelle republication
      await this.prisma.repost.create({ data: { ...repostDto } });

      // Mise à jour du compteur de reposts
      if (repostDto.postId) {
        await this.prisma.post.update({
          where: { id: repostDto.postId },
          data: { repostsCount: { increment: 1 } },
        });
      } else if (repostDto.commentId) {
        await this.prisma.comment.update({
          where: { id: repostDto.commentId },
          data: { repostsCount: { increment: 1 } },
        });
      }
    }
  }

  async unrepost(repostDto: RepostDto) {
    // Vérifier si c'est un repost de post ou de commentaire
    const whereClause = repostDto.postId
      ? { userId: repostDto.userId, postId: repostDto.postId }
      : { userId: repostDto.userId, commentId: repostDto.commentId };

    const existingRepost = await this.prisma.repost.findFirst({ where: whereClause });

    if (existingRepost) {
      // Supprimer le repost
      await this.prisma.repost.delete({ where: { id: existingRepost.id } });

      // Mise à jour du compteur de reposts
      if (repostDto.postId) {
        await this.prisma.post.update({
          where: { id: repostDto.postId },
          data: { repostsCount: { decrement: 1 } },
        });
      } else if (repostDto.commentId) {
        await this.prisma.comment.update({
          where: { id: repostDto.commentId },
          data: { repostsCount: { decrement: 1 } },
        });
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
      .filter((postId): postId is string => postId !== null);
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
      .filter((commentId): commentId is string => commentId !== null);
  }
}
