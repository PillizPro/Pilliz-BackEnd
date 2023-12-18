import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreatePostDto } from './dto/create-post.dto'
import { DeletePostDto } from './dto/delete-post.dto'
import { PostEntity } from './entities/post.entity'
import { ImageUploadService } from 'src/image/image-upload.service'

@Injectable()
export class PostService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly imageUploadService: ImageUploadService
  ) {}

  async postByUser(createPostDto: CreatePostDto) {
    try {
      const { userId, content, imageBase64 } = createPostDto

      let imageUrl = null
      if (imageBase64) {
        imageUrl = await this.imageUploadService.uploadBase64Image(imageBase64)
      }

      const newPost = await this.prismaService.post.create({
        data: {
          userId,
          content,
          imageUrl, // Utiliser l'URL de l'image Cloudinary
        },
      })

      return new PostEntity(newPost)
    } catch (error) {
      console.error(error)
      throw new Error('An error occurred when creating a post')
    }
  }

  async deletePostById(deletePostDto: DeletePostDto) {
    try {
      await this.prismaService.post.delete({
        where: { id: deletePostDto.postId },
      })
      return { message: 'Post successfully deleted.' }
    } catch (error) {
      console.error(error)
      throw new Error('An error occurred when deleting the post.')
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
        userId: post.userId, // ID du user
        postId: post.id, // ID du post
        username: post.Users.name, // Nom de l'utilisateur
        content: post.content, // Contenu du post
        imageUrl: post.imageUrl, // Image? du post
        likes: post.likesCount, // Nombre de likes
        reposts: post.repostsCount, // Nombre de reposts
        comments: post.commentsCount, // Nombre de commentaires
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
        userId: post.userId,
        postId: post.id,
        username: post.Users.name,
        content: post.content,
        imageUrl: post.imageUrl,
        likes: post.likesCount,
        reposts: post.repostsCount,
        comments: post.commentsCount,
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
      })

      const transformedPosts = posts.map((post) => ({
        userId: post.userId, // ID du user
        postId: post.id, // ID du post
        username: post.Users.name, // Nom de l'utilisateur
        content: post.content, // Contenu du post
        imageUrl: post.imageUrl, // Image? du post
        likes: post.likesCount, // Nombre de likes
        reposts: post.repostsCount, // Nombre de reposts
        comments: post.commentsCount, // Nombre de commentaires
        createdAt: post.createdAt, // Date de création
      }))

      return transformedPosts
    } catch (error) {
      console.error(error)
      throw new Error('An error occurred when getting recents posts')
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
        userId: post.userId, // ID du user
        postId: post.id, // ID du post
        username: post.Users.name, // Nom de l'utilisateur
        content: post.content, // Contenu du post
        imageUrl: post.imageUrl, // Image? du post
        likes: post.likesCount, // Nombre de likes
        reposts: post.repostsCount, // Nombre de reposts
        comments: post.commentsCount, // Nombre de commentaires
        createdAt: post.createdAt, // Date de création
      }))

      return transformedPosts
    } catch (error) {
      console.error(error)
      throw new Error('An error occured when getting posts')
    }
  }

  async find20OlderPosts(lastPostDate: Date) {
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
      })

      const transformedPosts = posts.map((post) => ({
        userId: post.userId,
        postId: post.id, // ID du post
        username: post.Users.name, // Nom de l'utilisateur
        content: post.content, // Contenu du post
        imageUrl: post.imageUrl, // Image? du post
        likes: post.likesCount, // Nombre de likes
        reposts: post.repostsCount, // Nombre de reposts
        comments: post.commentsCount, // Nombre de commentaires
        createdAt: post.createdAt, // Date de création
      }))

      return transformedPosts
    } catch (error) {
      console.error(error)
      throw new Error('An error occurred when getting more posts')
    }
  }
}
