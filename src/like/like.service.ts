import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LikePostDto } from './dto/like-post.dto';

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService) { }

  async likePost(likePostDto: LikePostDto) {
    // Vérifier si l'utilisateur a déjà liké le post
    const existingLike = await this.prisma.like.findFirst({
      where: {
        userId: likePostDto.userId,
        postId: likePostDto.postId,
      },
    });

    if (!existingLike) {
      // Si l'utilisateur n'a pas déjà liké, créer un nouveau like
      await this.prisma.like.create({
        data: {
          userId: likePostDto.userId,
          postId: likePostDto.postId,
        },
      });

      // Augmenter le compteur de likes du post
      await this.prisma.post.update({
        where: { id: likePostDto.postId },
        data: { likesCount: { increment: 1 } },
      });
    }
  }

  async unlikePost(likePostDto: LikePostDto) {
    // Vérifier si l'utilisateur a déjà liké le post
    const existingLike = await this.prisma.like.findFirst({
      where: {
        userId: likePostDto.userId,
        postId: likePostDto.postId,
      },
    });

    if (existingLike) {
      // Si l'utilisateur a déjà liké, supprimer le like
      await this.prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });

      // Diminuer le compteur de likes du post
      await this.prisma.post.update({
        where: { id: likePostDto.postId },
        data: { likesCount: { decrement: 1 } },
      });
    }
  }

  async hasUserLikedPost(userId: string, postId: string): Promise<boolean> {
    const existingLike = await this.prisma.like.findFirst({
      where: {
        userId: userId,
        postId: postId,
      },
    });

    return !!existingLike;
  }

  async getLikedPostsByUser(userId: string): Promise<string[]> {
    const likedPosts = await this.prisma.like.findMany({
      where: {
        userId: userId,
      },
      select: {
        postId: true,
      },
    });

    return likedPosts.map(like => like.postId);
  }

}