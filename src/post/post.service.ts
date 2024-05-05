import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreatePostDto, CreateCompanyPostDto } from './dto/create-post.dto'
import { DeletePostDto } from './dto/delete-post.dto'
import { RecoverPostDto } from './dto/recover-post.dto'
import { RecoverDetailsPostDto } from './dto/recover-details-post.dto'
import { RecoverDatePostDto } from './dto/recover-date-post.dto'
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
      const { userId, content, imageBase64, tagsList } = createPostDto

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

      if (tagsList) {
        const tags = await Promise.all(
          tagsList.map((tagName) =>
            this.prismaService.tags.findUnique({
              where: { name: tagName },
            })
          )
        )

        if (tags.includes(null)) {
          throw new Error('One or more tags do not exist')
        }

        await this.prismaService.post.update({
          where: { id: newPost.id },
          data: {
            Tags: {
              connect: tagsList.map((tag) => ({
                name: tag,
              })),
            },
          },
        })
      }

      return new PostEntity(newPost)
    } catch (error) {
      console.error(error)
      throw new Error('An error occurred when creating a post')
    }
  }

  async companyPostByUser(createCompanyPostDto: CreateCompanyPostDto) {
    try {
      const { imageBase64, tagsList } = createCompanyPostDto

      let imageUrl = null
      if (imageBase64) {
        imageUrl = await this.imageUploadService.uploadBase64Image(imageBase64)
      }

      const newPost = await this.prismaService.post.create({
        data: {
          imageUrl, // Utiliser l'URL de l'image Cloudinary
          ...createCompanyPostDto,
        },
      })

      if (tagsList) {
        const tags = await Promise.all(
          tagsList.map((tagName) =>
            this.prismaService.tags.findUnique({
              where: { name: tagName },
            })
          )
        )

        if (tags.includes(null)) {
          throw new Error('One or more tags do not exist')
        }

        await this.prismaService.post.update({
          where: { id: newPost.id },
          data: {
            Tags: {
              connect: tagsList.map((tag) => ({
                name: tag,
              })),
            },
          },
        })
      }

      return new PostEntity(newPost)
    } catch (error) {
      console.error(error)
      throw new Error('An error occurred when creating a post')
    }
  }

  async deletePostById(deletePostDto: DeletePostDto) {
    try {
      // Récupére tous les IDs des commentaires liés au post
      const comments = await this.prismaService.comment.findMany({
        where: { postId: deletePostDto.postId },
        select: { id: true },
      })
      const commentIds = comments.map((comment) => comment.id)

      // Supprimer les likes des commentaires
      await this.prismaService.like.deleteMany({
        where: { commentId: { in: commentIds } },
      })

      // Supprimer les reposts des commentaires
      await this.prismaService.repost.deleteMany({
        where: { commentId: { in: commentIds } },
      })

      // Supprimer les commentaires eux-mêmes
      await this.prismaService.comment.deleteMany({
        where: { postId: deletePostDto.postId },
      })

      // Supprimer les reposts du post
      await this.prismaService.repost.deleteMany({
        where: { postId: deletePostDto.postId },
      })

      // Supprimer les likes du post
      await this.prismaService.like.deleteMany({
        where: { postId: deletePostDto.postId },
      })

      // Supprimer le post
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
          Tags: true, // Inclure les données des tags associés
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
        tags: post.Tags.map((tag) => tag.name),
      }))

      return transformedPosts
    } catch (error) {
      console.error(error)
      throw new Error('An error occured when getting posts')
    }
  }

  async findPostById(recoverDetailsPostDto: RecoverDetailsPostDto) {
    const { userId, postId } = recoverDetailsPostDto
    try {
      const post = await this.prismaService.post.findUnique({
        where: { id: postId },
        include: {
          Users: true, // Inclure les données de l'utilisateur associé
          Tags: true, // Inclure les données des tags associés
        },
      })

      if (!post) {
        throw new Error('Post introuvable')
      }

      const followeds = await this.prismaService.follows.findMany({
        where: {
          followingId: userId,
        },
      })

      const reposters = await this.prismaService.repost.findFirst({
        orderBy: { createdAt: 'desc' },
        where: {
          userId: { in: followeds.map((followed) => followed.followerId) },
          postId: postId,
        },
        include: {
          Users: true,
        }, // Inclure les détails du post
      })

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
        tags: post.Tags.map((tag) => tag.name),
        isRepost: reposters ? true : false,
        reposterUsername: reposters ? reposters.Users.name : null,
        reposterId: reposters ? reposters.userId : null,
      }
    } catch (error) {
      console.error(error)
      throw new Error('An error occurred when getting the post')
    }
  }

  async find20LastsPosts(recoverPostDto: RecoverPostDto) {
    const { userId } = recoverPostDto
    try {
      const followeds = await this.prismaService.follows.findMany({
        where: {
          followingId: userId,
        },
      })

      // Récupérer les reposts des utilisateurs suivis
      const reposts = await this.prismaService.repost.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        where: {
          userId: { in: followeds.map((followed) => followed.followerId) },
        },
        include: {
          Post: { include: { Users: true, Tags: true } },
          Users: true,
        }, // Inclure les détails du post
      })

      // Récupérer les posts originaux associés aux reposts
      const repostsPosts = reposts.map((repost) => ({
        ...repost.Post,
        isRepost: true,
        reposterdId: repost.userId,
        reposterUsername: repost.Users.name,
      }))

      const posts = await this.prismaService.post.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
        include: {
          Users: true, // Inclure les données de l'utilisateur associé
          Tags: true,
        },
      })

      const postsTransformed = posts.map((post) => ({
        ...post,
        isRepost: false,
        reposterUsername: null,
        reposterdId: null,
      }))

      const combinedPosts = [...repostsPosts, ...postsTransformed]

      // si un repost est associé à un post original, on ne garde que le repost
      const uniquePosts = combinedPosts.filter(
        (post, index, self) => self.findIndex((p) => p.id === post.id) === index
      )

      const transformedPosts = uniquePosts.map((post) => ({
        userId: post.userId, // ID du user
        postId: post.id, // ID du post
        username: post.Users?.name, // Nom de l'utilisateur
        content: post.content, // Contenu du post
        imageUrl: post.imageUrl, // Image? du post
        likes: post.likesCount, // Nombre de likes
        reposts: post.repostsCount, // Nombre de reposts
        comments: post.commentsCount, // Nombre de commentaires
        createdAt: post.createdAt, // Date de création
        tags: post.Tags?.map((tag) => tag.name), // Liste des tags associés
        isRepost: post.isRepost, // Est ce que c'est un repost ?
        reposterUsername: post.reposterUsername, // Nom du reposter
        reposterdId: post.reposterdId, // ID du reposter
      }))

      return transformedPosts
    } catch (error) {
      console.error(error)
      throw new Error('An error occured when getting posts')
    }
  }

  async find20RecentsPosts(recoverDatePostDto: RecoverDatePostDto) {
    const { userId, dateString } = recoverDatePostDto
    try {
      const followeds = await this.prismaService.follows.findMany({
        where: {
          followingId: userId,
        },
      })

      const reposts = await this.prismaService.repost.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        where: {
          userId: { in: followeds.map((followed) => followed.followerId) },
          createdAt: {
            gt: dateString,
          },
        },
        include: {
          Post: { include: { Users: true, Tags: true } },
          Users: true,
        },
      })

      const repostsPosts = reposts.map((repost) => ({
        ...repost.Post,
        isRepost: true,
        reposterdId: repost.userId,
        reposterUsername: repost.Users.name,
      }))

      // Récupérer les posts récents originaux
      const posts = await this.prismaService.post.findMany({
        take: 20,
        where: {
          createdAt: {
            gt: dateString,
          },
        },
        orderBy: { createdAt: 'desc' },
        include: {
          Users: true,
          Tags: true,
        },
      })

      const postsTransformed = posts.map((post) => ({
        ...post,
        isRepost: false,
        reposterUsername: null,
        reposterdId: null,
      }))

      const combinedPosts = [...repostsPosts, ...postsTransformed]

      const uniquePosts = combinedPosts.filter(
        (post, index, self) => self.findIndex((p) => p.id === post.id) === index
      )

      const transformedPosts = uniquePosts.map((post) => ({
        userId: post.userId, // ID du user
        postId: post.id, // ID du post
        username: post.Users?.name, // Nom de l'utilisateur
        content: post.content, // Contenu du post
        imageUrl: post.imageUrl, // Image? du post
        likes: post.likesCount, // Nombre de likes
        reposts: post.repostsCount, // Nombre de reposts
        comments: post.commentsCount, // Nombre de commentaires
        createdAt: post.createdAt, // Date de création
        tags: post.Tags?.map((tag) => tag.name), // Liste des tags associés
        isRepost: post.isRepost, // Est ce que c'est un repost ?
        reposterUsername: post.reposterUsername, // Nom du reposter
        reposterdId: post.reposterdId, // ID du reposter
      }))

      return transformedPosts
    } catch (error) {
      console.error(error)
      throw new Error('An error occurred when getting recents posts')
    }
  }

  async find20OlderPosts(recoverDatePostDto: RecoverDatePostDto) {
    const { userId, dateString } = recoverDatePostDto
    try {
      const followeds = await this.prismaService.follows.findMany({
        where: {
          followingId: userId,
        },
      })

      const reposts = await this.prismaService.repost.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        where: {
          userId: { in: followeds.map((followed) => followed.followerId) },
          createdAt: {
            lt: dateString,
          },
        },
        include: {
          Post: { include: { Users: true, Tags: true } },
          Users: true,
        },
      })

      const repostsPosts = reposts.map((repost) => ({
        ...repost.Post,
        isRepost: true,
        reposterdId: repost.userId,
        reposterUsername: repost.Users.name,
      }))

      // Récupérer les posts récents originaux
      const posts = await this.prismaService.post.findMany({
        take: 20,
        where: {
          createdAt: {
            lt: dateString,
          },
        },
        orderBy: { createdAt: 'desc' },
        include: {
          Users: true,
          Tags: true,
        },
      })

      const postsTransformed = posts.map((post) => ({
        ...post,
        isRepost: false,
        reposterUsername: null,
        reposterdId: null,
      }))

      const combinedPosts = [...repostsPosts, ...postsTransformed]

      const uniquePosts = combinedPosts.filter(
        (post, index, self) => self.findIndex((p) => p.id === post.id) === index
      )

      const transformedPosts = uniquePosts.map((post) => ({
        userId: post.userId, // ID du user
        postId: post.id, // ID du post
        username: post.Users?.name, // Nom de l'utilisateur
        content: post.content, // Contenu du post
        imageUrl: post.imageUrl, // Image? du post
        likes: post.likesCount, // Nombre de likes
        reposts: post.repostsCount, // Nombre de reposts
        comments: post.commentsCount, // Nombre de commentaires
        createdAt: post.createdAt, // Date de création
        tags: post.Tags?.map((tag) => tag.name), // Liste des tags associés
        isRepost: post.isRepost, // Est ce que c'est un repost ?
        reposterUsername: post.reposterUsername, // Nom du reposter
        reposterdId: post.reposterdId, // ID du reposter
      }))

      return transformedPosts
    } catch (error) {
      console.error(error)
      throw new Error('An error occurred when getting more posts')
    }
  }
}
