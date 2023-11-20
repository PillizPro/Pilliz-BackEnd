import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { RepostDto } from './dto/repost.dto'

@Injectable()
export class RepostService {
  constructor(private prisma: PrismaService) { }

  async repostPost(repostDto: RepostDto) {
    // Vérifier si l'utilisateur a déjà republier le post
    const existingRepost = await this.prisma.repost.findFirst({
      where: {
        userId: repostDto.userId,
        postId: repostDto.postId,
      },
    })

    if (!existingRepost) {
      // Si l'utilisateur n'a pas déjà republier, créer une nouvelle republication
      await this.prisma.repost.create({
        data: {
          userId: repostDto.userId,
          postId: repostDto.postId,
        },
      })

      // Augmenter le compteur de republication du post
      await this.prisma.post.update({
        where: { id: repostDto.postId },
        data: { repostsCount: { increment: 1 } },
      })
    }
  }

  async unrepostPost(repostDto: RepostDto) {
    // Vérifier si l'utilisateur a déjà republier le post
    const existingRepost = await this.prisma.repost.findFirst({
      where: {
        userId: repostDto.userId,
        postId: repostDto.postId,
      },
    })

    if (existingRepost) {
      // Si l'utilisateur a déjà republier, supprimer le repost
      await this.prisma.repost.delete({
        where: {
          id: existingRepost.id,
        },
      })

      // Diminuer le compteur de reposts du post
      await this.prisma.post.update({
        where: { id: repostDto.postId },
        data: { repostsCount: { decrement: 1 } },
      })
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

    return repostedPosts.map((repost) => repost.postId)
  }
}
