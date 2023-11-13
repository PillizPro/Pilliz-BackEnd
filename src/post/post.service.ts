import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { FindPostDto } from './dto/find-post.dto';


@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) { }


  async postByUser(createPostDto: CreatePostDto) {
    try {
      const { userId, content } = createPostDto;
      const newPost = await this.prisma.post.create({
        data: {
          userId,
          content
        }
      });
      return newPost;
    } catch (error) {
      console.error("Erreur détaillée:", error);
      throw new Error('Erreur lors de la création du post');
    }
  }

  async findAllPosts() {
    try {
      const posts = await this.prisma.post.findMany({
        include: {
          user: true  // Inclure les données de l'utilisateur associé
        }
      });

      // Transformer les données pour ne conserver que les champs souhaités
      const transformedPosts = posts.map(post => ({
        postId: post.id,            // ID du post
        username: post.user.name,  // Nom de l'utilisateur
        content: post.content,     // Contenu du post
        likes: post.likesCount,        // Nombre de likes
        createdAt: post.createdAt  // Date de création

      }));

      return transformedPosts;
    } catch (error) {
      console.error("Erreur détaillée:", error);
      throw new Error('Erreur lors de la récupération des posts');
    }
  }

  async findPostById(postId: string) {
    try {
      const post = await this.prisma.post.findUnique({
        where: { id: postId },
        include: {
          user: true, // Inclure les données de l'utilisateur associé
        },
      });

      if (!post) {
        throw new Error('Post introuvable');
      }

      return {
        postId: post.id,
        username: post.user.name,
        content: post.content,
        likes: post.likesCount,
        createdAt: post.createdAt,
      };
    } catch (error) {
      console.error("Erreur détaillée:", error);
      throw new Error('Erreur lors de la récupération du post');
    }
  }
}