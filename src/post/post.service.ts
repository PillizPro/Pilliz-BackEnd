import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreatePostDto } from './dto/create-post.dto'
import { PostEntity } from './entities/post.entity'

@Injectable()
export class PostService {
  constructor(private readonly prismaService: PrismaService) { }

  async postByUser(createPostDto: CreatePostDto) {
    try {
      const { userId, content } = createPostDto
      const newPost = await this.prismaService.post.create({
        data: {
          userId,
          content,
        },
      })
      return new PostEntity(newPost)
    } catch (error) {
      console.error(error)
      throw new Error('An error occured when creating a post')
    }
  }

  async findAllPosts() {
    try {
      const posts = await this.prismaService.post.findMany({
        include: {
          Users: true, // Inclure les données de l'utilisateur associé
        },
      })

      const transformedPosts = posts.map((post) => ({
        postId: post.id, // ID du post
        username: post.Users.name, // Nom de l'utilisateur
        content: post.content, // Contenu du post
        likes: post.likesCount, // Nombre de likes
        reposts: post.repostsCount, // Nombre de reposts
        createdAt: post.createdAt, // Date de création
      }))

      return transformedPosts
    } catch (error) {
      console.error(error)
      throw new Error('An error occured when getting posts')
    }
  }

  async findPostById(postId: string) {
    try {
      const post = await this.prismaService.post.findUnique({
        where: { id: postId },
        include: {
          Users: true, // Inclure les données de l'utilisateur associé
        },
      })

      if (!post) {
        throw new Error('Post introuvable')
      }

      return {
        postId: post.id,
        username: post.Users.name,
        content: post.content,
        likes: post.likesCount,
        reposts: post.repostsCount,
        createdAt: post.createdAt,
      }
    } catch (error) {
      console.error(error)
      throw new Error('An error occured when getting the post')
    }
  }

  async find20RecentsPosts(recentPostDate: Date) {
    try {
      const posts = await this.prismaService.post.findMany({
        take: 20,
        where: {
          createdAt: {
            gt: recentPostDate,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          Users: true, // Inclure les données de l'utilisateur associé
        },
      });

      const transformedPosts = posts.map((post) => ({
        postId: post.id, // ID du post
        username: post.Users.name, // Nom de l'utilisateur
        content: post.content, // Contenu du post
        likes: post.likesCount, // Nombre de likes
        reposts: post.repostsCount, // Nombre de reposts
        createdAt: post.createdAt, // Date de création
      }));

      return transformedPosts;
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred when getting recents posts');
    }
  }

  async find20LastsPosts() {
    try {
      const posts = await this.prismaService.post.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
        include: {
          Users: true, // Inclure les données de l'utilisateur associé
        },
      })

      const transformedPosts = posts.map((post) => ({
        postId: post.id, // ID du post
        username: post.Users.name, // Nom de l'utilisateur
        content: post.content, // Contenu du post
        likes: post.likesCount, // Nombre de likes
        reposts: post.repostsCount, // Nombre de reposts
        createdAt: post.createdAt, // Date de création
      }))

      return transformedPosts
    } catch (error) {
      console.error(error)
      throw new Error('An error occured when getting posts')
    }
  }

  async find20MorePosts(lastPostDate: Date) {
    try {
      const posts = await this.prismaService.post.findMany({
        take: 20,
        where: {
          createdAt: {
            lt: lastPostDate,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          Users: true, // Inclure les données de l'utilisateur associé
        },
      });

      const transformedPosts = posts.map((post) => ({
        postId: post.id, // ID du post
        username: post.Users.name, // Nom de l'utilisateur
        content: post.content, // Contenu du post
        likes: post.likesCount, // Nombre de likes
        reposts: post.repostsCount, // Nombre de reposts
        createdAt: post.createdAt, // Date de création
      }));

      return transformedPosts;
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred when getting more posts');
    }
  }
}
