import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreatePostDto } from './dto/create-post.dto'
import { PostEntity } from './entities/post.entity'

@Injectable()
export class PostService {
  constructor(private readonly prismaService: PrismaService) {}

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
      throw new Error('An error occured when creating a post')
    }
  }

  async findAllPosts() {
    try {
      const posts = await this.prismaService.post.findMany({
        include: {
          user: true, // Inclure les données de l'utilisateur associé
        },
      })

      // Transformer les données pour ne conserver que les champs souhaités
      const transformedPosts = posts.map((post) => ({
        postId: post.id, // ID du post
        username: post.user.name, // Nom de l'utilisateur
        content: post.content, // Contenu du post
        likes: post.likesCount, // Nombre de likes
        createdAt: post.createdAt, // Date de création
      }))

      return transformedPosts
    } catch (error) {
      throw new Error('An error occured when getting posts')
    }
  }

  async findPostById(postId: string) {
    try {
      const post = await this.prismaService.post.findUnique({
        where: { id: postId },
        include: {
          user: true, // Inclure les données de l'utilisateur associé
        },
      })

      if (!post) {
        throw new Error('Post introuvable')
      }

      return {
        postId: post.id,
        username: post.user.name,
        content: post.content,
        likes: post.likesCount,
        createdAt: post.createdAt,
      }
    } catch (error) {
      throw new Error('An error occured when getting the post')
    }
  }
}
