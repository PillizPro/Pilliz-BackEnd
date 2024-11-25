import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import {
  CreatePostDto,
  DeletePostDto,
  RecoverDetailsPostDto,
  RecoverDatePostDto,
  ViewInterractPostDto,
  PostOrCommentTypeDto,
  FavoritePostDto,
  PinnedPostDto,
  PinnedPostUserDto,
} from './dto'
import { PostEntity } from './entities/post.entity'
import { ImageUploadService } from 'src/image/image-upload.service'
import { containsForbiddenWord } from 'src/post/miscellanous/forbidenWords'

@Injectable()
export class PostService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly imageUploadService: ImageUploadService
  ) {}

  async postByUser(createPostDto: CreatePostDto, userId: string) {
    try {
      const { content, imageBase64, tagsList } = createPostDto

      if (containsForbiddenWord(content)) {
        throw new BadRequestException('Content contains forbidden words')
      }

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

        if (tags.includes(null))
          throw new NotFoundException('One or more tags do not exist.')

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
      throw new BadRequestException('An error occurred when creating a post.')
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
      throw new BadRequestException('An error occurred when deleting the post.')
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
        userImgUrl: post.Users?.profilPicture, // Image de profil de l'utilisateur (URL)
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
      throw new BadRequestException('An error occured when getting posts.')
    }
  }

  async findPostById(
    recoverDetailsPostDto: RecoverDetailsPostDto,
    userId: string
  ) {
    const { postId } = recoverDetailsPostDto
    try {
      const currentUser = await this.prismaService.users.findUnique({
        where: { id: userId },
        select: {
          pinnedPostId: true,
        },
      })

      const pinnedPostId = currentUser?.pinnedPostId
      const post = await this.prismaService.post.findUnique({
        where: { id: postId },
        include: {
          Users: true, // Inclure les données de l'utilisateur associé
          Tags: true, // Inclure les données des tags associés
        },
      })

      if (!post) throw new NotFoundException('Post introuvable.')

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

      const favoritePostIds = await this.prismaService.post
        .findMany({
          where: { favoritedBy: { some: { id: userId } } },
          select: { id: true },
        })
        .then((posts) => posts.map((post) => post.id))

      return {
        userId: post.userId,
        postId: post.id,
        username: post.Users.name,
        userImgUrl: post.Users?.profilPicture,
        content: post.content,
        imageUrl: post.imageUrl,
        likes: post.likesCount,
        reposts: post.repostsCount,
        comments: post.commentsCount,
        interractions: post.totalInteractions,
        createdAt: post.createdAt,
        tags: post.Tags.map((tag) => tag.name),
        isRepost: reposters ? true : false,
        reposterUsername: reposters ? reposters.Users.name : null,
        reposterId: reposters ? reposters.userId : null,
        isFavorited: post.id ? favoritePostIds.includes(post.id) : false,
        isPinned: post.id === pinnedPostId,
      }
    } catch (error) {
      console.error(error)
      throw new BadRequestException('An error occurred when getting the post.')
    }
  }

  async find20LastsPosts(userId: string) {
    try {
      const currentUser = await this.prismaService.users.findUnique({
        where: { id: userId },
        select: {
          blockedUsers: true,
          hiddenUsers: true,
          hiddenWords: true,
          pinnedPostId: true,
        },
      })

      const blockedUsers = currentUser?.blockedUsers ?? []
      const hiddenUsers = currentUser?.hiddenUsers ?? []
      const hiddenWords = currentUser?.hiddenWords ?? []
      const pinnedPostId = currentUser?.pinnedPostId

      const allUsers = await this.prismaService.users.findMany({
        select: { id: true, blockedUsers: true },
      })

      const blockerIds = allUsers
        .filter((user) => user.blockedUsers.includes(userId))
        .map((user) => user.id)

      const followeds = await this.prismaService.follows.findMany({
        where: {
          followingId: userId,
          followerId: {
            notIn: [...blockedUsers, ...hiddenUsers, ...blockerIds],
          },
        },
      })

      const reposts = await this.prismaService.repost.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        where: {
          userId: { in: followeds.map((followed) => followed.followerId) },
        },
        include: {
          Post: {
            include: { Users: true, Tags: true },
            where: { confidentiality: 'public' },
          },
          Users: true,
        },
      })

      const repostsPosts = reposts.map((repost) => ({
        ...repost.Post,
        isRepost: true,
        reposterId: repost.userId,
        reposterUsername: repost.Users.name,
      }))

      const posts = await this.prismaService.post.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
        where: {
          userId: { notIn: [...blockedUsers, ...hiddenUsers, ...blockerIds] },
          confidentiality: 'public',
        },
        include: {
          Users: true,
          Tags: true,
        },
      })

      const postsTransformed = posts.map((post) => ({
        ...post,
        isRepost: false,
        reposterUsername: null,
        reposterId: null,
      }))

      const combinedPosts = [...repostsPosts, ...postsTransformed]
      const uniquePosts = combinedPosts.filter(
        (post, index, self) => self.findIndex((p) => p.id === post.id) === index
      )

      const filteredPosts = uniquePosts.filter((post) => {
        return !hiddenWords.some((word) => post.content?.includes(word))
      })

      const favoritePostIds = await this.prismaService.post
        .findMany({
          where: { favoritedBy: { some: { id: userId } } },
          select: { id: true },
        })
        .then((posts) => posts.map((post) => post.id))

      const transformedPosts = filteredPosts.map((post) => ({
        userId: post.userId, // ID du user
        postId: post.id, // ID du post
        username: post.Users?.name, // Nom de l'utilisateur
        userImgUrl: post.Users?.profilPicture, // Image de profil de l'utilisateur (URL)
        content: post.content, // Contenu du post
        imageUrl: post.imageUrl, // Image? du post
        likes: post.likesCount, // Nombre de likes
        reposts: post.repostsCount, // Nombre de reposts
        comments: post.commentsCount, // Nombre de commentaires
        interractions: post.totalInteractions,
        createdAt: post.createdAt, // Date de création
        tags: post.Tags?.map((tag) => tag.name), // Liste des tags associés
        isRepost: post.isRepost, // Est ce que c'est un repost ?
        reposterUsername: post.reposterUsername, // Nom du reposter
        reposterId: post.reposterId, // ID du reposter
        isFavorited: post.id ? favoritePostIds.includes(post.id) : false,
        isPinned: post.id === pinnedPostId,
      }))

      return transformedPosts
    } catch (error) {
      console.error(error)
      throw new BadRequestException('An error occurred when getting posts.')
    }
  }

  async find20RecentsPosts(
    recoverDatePostDto: RecoverDatePostDto,
    userId: string
  ) {
    const { dateString } = recoverDatePostDto
    try {
      const currentUser = await this.prismaService.users.findUnique({
        where: { id: userId },
        select: {
          blockedUsers: true,
          hiddenUsers: true,
          hiddenWords: true,
          pinnedPostId: true,
        },
      })

      const blockedUsers = currentUser?.blockedUsers ?? []
      const hiddenUsers = currentUser?.hiddenUsers ?? []
      const hiddenWords = currentUser?.hiddenWords ?? []
      const pinnedPostId = currentUser?.pinnedPostId

      const allUsers = await this.prismaService.users.findMany({
        select: { id: true, blockedUsers: true },
      })

      const blockerIds = allUsers
        .filter((user) => user.blockedUsers.includes(userId))
        .map((user) => user.id)

      const followeds = await this.prismaService.follows.findMany({
        where: {
          followingId: userId,
          followerId: {
            notIn: [...blockedUsers, ...hiddenUsers, ...blockerIds],
          },
        },
      })

      const reposts = await this.prismaService.repost.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        where: {
          userId: { in: followeds.map((followed) => followed.followerId) },
          createdAt: { gt: new Date(dateString) },
        },
        include: {
          Post: {
            include: { Users: true, Tags: true },
            where: { confidentiality: 'public' },
          },
          Users: true,
        },
      })

      const repostsPosts = reposts.map((repost) => ({
        ...repost.Post,
        isRepost: true,
        reposterId: repost.userId,
        reposterUsername: repost.Users.name,
      }))

      const posts = await this.prismaService.post.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
        where: {
          userId: { notIn: [...blockedUsers, ...hiddenUsers, ...blockerIds] },
          createdAt: { gt: new Date(dateString) },
          confidentiality: 'public',
        },
        include: {
          Users: true,
          Tags: true,
        },
      })

      const postsTransformed = posts.map((post) => ({
        ...post,
        isRepost: false,
        reposterUsername: null,
        reposterId: null,
      }))

      const combinedPosts = [...repostsPosts, ...postsTransformed]
      const uniquePosts = combinedPosts.filter(
        (post, index, self) => self.findIndex((p) => p.id === post.id) === index
      )

      const filteredPosts = uniquePosts.filter((post) => {
        return !hiddenWords.some((word) => post.content?.includes(word))
      })

      const favoritePostIds = await this.prismaService.post
        .findMany({
          where: { favoritedBy: { some: { id: userId } } },
          select: { id: true },
        })
        .then((posts) => posts.map((post) => post.id))

      const transformedPosts = filteredPosts.map((post) => ({
        userId: post.userId, // ID du user
        postId: post.id, // ID du post
        username: post.Users?.name, // Nom de l'utilisateur
        userImgUrl: post.Users?.profilPicture, // Image de profil de l'utilisateur (URL)
        content: post.content, // Contenu du post
        imageUrl: post.imageUrl, // Image? du post
        likes: post.likesCount, // Nombre de likes
        reposts: post.repostsCount, // Nombre de reposts
        comments: post.commentsCount, // Nombre de commentaires
        interractions: post.totalInteractions,
        createdAt: post.createdAt, // Date de création
        tags: post.Tags?.map((tag) => tag.name), // Liste des tags associés
        isRepost: post.isRepost, // Est ce que c'est un repost ?
        reposterUsername: post.reposterUsername, // Nom du reposter
        reposterId: post.reposterId, // ID du reposter
        isFavorited: post.id ? favoritePostIds.includes(post.id) : false,
        isPinned: post.id === pinnedPostId,
      }))

      return transformedPosts
    } catch (error) {
      console.error(error)
      throw new BadRequestException(
        'An error occurred when getting recents posts.'
      )
    }
  }

  async find20OlderPosts(
    recoverDatePostDto: RecoverDatePostDto,
    userId: string
  ) {
    const { dateString } = recoverDatePostDto
    try {
      const currentUser = await this.prismaService.users.findUnique({
        where: { id: userId },
        select: {
          blockedUsers: true,
          hiddenUsers: true,
          hiddenWords: true,
          pinnedPostId: true,
        },
      })

      const blockedUsers = currentUser?.blockedUsers ?? []
      const hiddenUsers = currentUser?.hiddenUsers ?? []
      const hiddenWords = currentUser?.hiddenWords ?? []
      const pinnedPostId = currentUser?.pinnedPostId

      const allUsers = await this.prismaService.users.findMany({
        select: { id: true, blockedUsers: true },
      })

      const blockerIds = allUsers
        .filter((user) => user.blockedUsers.includes(userId))
        .map((user) => user.id)

      const followeds = await this.prismaService.follows.findMany({
        where: {
          followingId: userId,
          followerId: {
            notIn: [...blockedUsers, ...hiddenUsers, ...blockerIds],
          },
        },
      })

      const reposts = await this.prismaService.repost.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        where: {
          userId: { in: followeds.map((followed) => followed.followerId) },
          createdAt: { lt: new Date(dateString) },
        },
        include: {
          Post: {
            include: { Users: true, Tags: true },
            where: { confidentiality: 'public' },
          },
          Users: true,
        },
      })

      const repostsPosts = reposts.map((repost) => ({
        ...repost.Post,
        isRepost: true,
        reposterId: repost.userId,
        reposterUsername: repost.Users.name,
      }))

      const posts = await this.prismaService.post.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
        where: {
          userId: { notIn: [...blockedUsers, ...hiddenUsers, ...blockerIds] },
          createdAt: { lt: new Date(dateString) },
          confidentiality: 'public',
        },
        include: {
          Users: true,
          Tags: true,
        },
      })

      const postsTransformed = posts.map((post) => ({
        ...post,
        isRepost: false,
        reposterUsername: null,
        reposterId: null,
      }))

      const combinedPosts = [...repostsPosts, ...postsTransformed]

      const uniquePosts = combinedPosts.filter(
        (post, index, self) => self.findIndex((p) => p.id === post.id) === index
      )

      const filteredPosts = uniquePosts.filter((post) => {
        return !hiddenWords.some((word) => post.content?.includes(word))
      })

      const favoritePostIds = await this.prismaService.post
        .findMany({
          where: { favoritedBy: { some: { id: userId } } },
          select: { id: true },
        })
        .then((posts) => posts.map((post) => post.id))

      const transformedPosts = filteredPosts.map((post) => ({
        userId: post.userId, // ID du user
        postId: post.id, // ID du post
        username: post.Users?.name, // Nom de l'utilisateur
        userImgUrl: post.Users?.profilPicture, // Image de profil de l'utilisateur (URL)
        content: post.content, // Contenu du post
        imageUrl: post.imageUrl, // Image? du post
        likes: post.likesCount, // Nombre de likes
        reposts: post.repostsCount, // Nombre de reposts
        interractions: post.totalInteractions,
        comments: post.commentsCount, // Nombre de commentaires
        createdAt: post.createdAt, // Date de création
        tags: post.Tags?.map((tag) => tag.name), // Liste des tags associés
        isRepost: post.isRepost, // Est ce que c'est un repost ?
        reposterUsername: post.reposterUsername, // Nom du reposter
        reposterId: post.reposterId, // ID du reposter
        isFavorited: post.id ? favoritePostIds.includes(post.id) : false,
        isPinned: post.id === pinnedPostId,
      }))

      return transformedPosts
    } catch (error) {
      console.error(error)
      throw new BadRequestException(
        'An error occurred when getting more posts.'
      )
    }
  }

  async changePostOrCommentType(postOrCommentType: PostOrCommentTypeDto) {
    try {
      const post = await this.prismaService.post.findUnique({
        where: { id: postOrCommentType.postId },
        select: { confidentiality: true },
      })

      if (post !== null) {
        const newConfidentiality =
          post?.confidentiality === 'public' ? 'private' : 'public'

        await this.prismaService.post.update({
          where: { id: postOrCommentType.postId },
          data: { confidentiality: newConfidentiality },
        })

        return {
          message: 'Post type successfully updated.',
          type: newConfidentiality,
        }
      } else {
        const comment = await this.prismaService.comment.findUnique({
          where: { id: postOrCommentType.postId },
          select: { confidentiality: true },
        })

        const newConfidentiality =
          comment?.confidentiality === 'public' ? 'private' : 'public'

        await this.prismaService.comment.update({
          where: { id: postOrCommentType.postId },
          data: { confidentiality: newConfidentiality },
        })

        return {
          message: 'Comment type successfully updated.',
          type: newConfidentiality,
        }
      }
    } catch (error) {
      console.error(error)
      throw new BadRequestException(
        'An error occurred when updating the post or comment type.'
      )
    }
  }

  async find20LastsPostsFollowed(userId: string) {
    try {
      const currentUser = await this.prismaService.users.findUnique({
        where: { id: userId },
        select: {
          blockedUsers: true,
          hiddenUsers: true,
          hiddenWords: true,
          pinnedPostId: true,
        },
      })

      const blockedUsers = currentUser?.blockedUsers ?? []
      const hiddenUsers = currentUser?.hiddenUsers ?? []
      const hiddenWords = currentUser?.hiddenWords ?? []
      const pinnedPostId = currentUser?.pinnedPostId

      const allUsers = await this.prismaService.users.findMany({
        select: { id: true, blockedUsers: true },
      })

      const blockerIds = allUsers
        .filter((user) => user.blockedUsers.includes(userId))
        .map((user) => user.id)

      const followeds = await this.prismaService.follows.findMany({
        where: {
          followingId: userId,
          followerId: {
            notIn: [...blockedUsers, ...hiddenUsers, ...blockerIds],
          },
        },
        select: {
          followerId: true,
        },
      })

      const followedIds = followeds.map((followed) => followed.followerId)

      const reposts = await this.prismaService.repost.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        where: {
          userId: { in: followedIds },
        },
        include: {
          Post: {
            include: { Users: true, Tags: true },
            where: { confidentiality: 'public' },
          },
          Users: true,
        },
      })

      const repostsPosts = reposts.map((repost) => ({
        ...repost.Post,
        isRepost: true,
        reposterId: repost.userId,
        reposterUsername: repost.Users.name,
      }))

      const posts = await this.prismaService.post.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
        where: {
          userId: { in: followedIds },
          confidentiality: 'public',
        },
        include: {
          Users: true,
          Tags: true,
        },
      })

      const postsTransformed = posts.map((post) => ({
        ...post,
        isRepost: false,
        reposterUsername: null,
        reposterId: null,
      }))

      const combinedPosts = [...repostsPosts, ...postsTransformed]

      const filteredPosts = combinedPosts.filter((post) => {
        return !hiddenWords.some((word) => post.content?.includes(word))
      })

      const favoritePostIds = await this.prismaService.post
        .findMany({
          where: { favoritedBy: { some: { id: userId } } },
          select: { id: true },
        })
        .then((posts) => posts.map((post) => post.id))

      const transformedPosts = filteredPosts.map((post) => ({
        userId: post.userId,
        postId: post.id,
        username: post.Users?.name,
        userImgUrl: post.Users?.profilPicture,
        content: post.content,
        imageUrl: post.imageUrl,
        likes: post.likesCount,
        reposts: post.repostsCount,
        comments: post.commentsCount,
        interractions: post.totalInteractions,
        createdAt: post.createdAt,
        tags: post.Tags?.map((tag) => tag.name),
        isRepost: post.isRepost,
        reposterUsername: post.reposterUsername,
        reposterId: post.reposterId,
        isFavorited: post.id ? favoritePostIds.includes(post.id) : false,
        isPinned: post.id === pinnedPostId,
      }))

      return transformedPosts
    } catch (error) {
      console.error(error)
      throw new BadRequestException('An error occurred when getting posts.')
    }
  }

  async find20RecentsPostsFollowed(
    recoverDatePostDto: RecoverDatePostDto,
    userId: string
  ) {
    const { dateString } = recoverDatePostDto
    try {
      const currentUser = await this.prismaService.users.findUnique({
        where: { id: userId },
        select: {
          blockedUsers: true,
          hiddenUsers: true,
          hiddenWords: true,
          pinnedPostId: true,
        },
      })

      const blockedUsers = currentUser?.blockedUsers ?? []
      const hiddenUsers = currentUser?.hiddenUsers ?? []
      const hiddenWords = currentUser?.hiddenWords ?? []
      const pinnedPostId = currentUser?.pinnedPostId

      const blockerIds = (
        await this.prismaService.users.findMany({
          where: {
            blockedUsers: {
              has: userId,
            },
          },
          select: { id: true },
        })
      ).map((user) => user.id)

      const followedIds = (
        await this.prismaService.follows.findMany({
          where: {
            followingId: userId,
            followerId: {
              notIn: [...blockedUsers, ...hiddenUsers, ...blockerIds],
            },
          },
          select: { followerId: true },
        })
      ).map((followed) => followed.followerId)

      const reposts = await this.prismaService.repost.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        where: {
          userId: { in: followedIds },
          createdAt: { gt: new Date(dateString) },
        },
        include: {
          Post: {
            where: { confidentiality: 'public' },
            include: { Users: true, Tags: true },
          },
          Users: true,
        },
      })

      const repostsPosts = reposts.map((repost) => ({
        ...repost.Post,
        isRepost: true,
        reposterId: repost.userId,
        reposterUsername: repost.Users.name,
      }))

      const posts = await this.prismaService.post.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
        where: {
          userId: { notIn: [...blockedUsers, ...hiddenUsers, ...blockerIds] },
          createdAt: { gt: new Date(dateString) },
          confidentiality: 'public',
        },
        include: { Users: true, Tags: true },
      })

      const postsTransformed = posts.map((post) => ({
        ...post,
        isRepost: false,
        reposterUsername: null,
        reposterId: null,
      }))

      const uniquePosts = [...repostsPosts, ...postsTransformed].filter(
        (post, index, self) => self.findIndex((p) => p.id === post.id) === index
      )

      const filteredPosts = uniquePosts.filter((post) =>
        hiddenWords.every((word) => !post.content?.includes(word))
      )

      const favoritePostIds = await this.prismaService.post
        .findMany({
          where: { favoritedBy: { some: { id: userId } } },
          select: { id: true },
        })
        .then((posts) => posts.map((post) => post.id))

      return filteredPosts.map((post) => ({
        userId: post.userId,
        postId: post.id,
        username: post.Users?.name,
        userImgUrl: post.Users?.profilPicture,
        content: post.content,
        imageUrl: post.imageUrl,
        likes: post.likesCount,
        reposts: post.repostsCount,
        interractions: post.totalInteractions,
        comments: post.commentsCount,
        createdAt: post.createdAt,
        tags: post.Tags?.map((tag) => tag.name),
        isRepost: post.isRepost,
        reposterUsername: post.reposterUsername,
        reposterId: post.reposterId,
        isFavorited: post.id ? favoritePostIds.includes(post.id) : false,
        isPinned: post.id === pinnedPostId,
      }))
    } catch (error) {
      console.error(error)
      throw new BadRequestException(
        'An error occurred when getting recents posts.'
      )
    }
  }

  async find20OlderPostsFollowed(
    recoverDatePostDto: RecoverDatePostDto,
    userId: string
  ) {
    const { dateString } = recoverDatePostDto
    try {
      const currentUser = await this.prismaService.users.findUnique({
        where: { id: userId },
        select: {
          blockedUsers: true,
          hiddenUsers: true,
          hiddenWords: true,
          pinnedPostId: true,
        },
      })

      const blockedUsers = currentUser?.blockedUsers ?? []
      const hiddenUsers = currentUser?.hiddenUsers ?? []
      const hiddenWords = currentUser?.hiddenWords ?? []
      const pinnedPostId = currentUser?.pinnedPostId

      const allUsers = await this.prismaService.users.findMany({
        select: { id: true, blockedUsers: true },
      })

      const blockerIds = allUsers
        .filter((user) => user.blockedUsers.includes(userId))
        .map((user) => user.id)

      const followeds = await this.prismaService.follows.findMany({
        where: {
          followingId: userId,
          followerId: {
            notIn: [...blockedUsers, ...hiddenUsers, ...blockerIds],
          },
        },
      })

      const followedIds = followeds.map((followed) => followed.followerId)

      const reposts = await this.prismaService.repost.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        where: {
          userId: { in: followedIds },
          createdAt: { lt: new Date(dateString) },
        },
        include: {
          Post: {
            include: { Users: true, Tags: true },
            where: { confidentiality: 'public' },
          },
          Users: true,
        },
      })

      const repostsPosts = reposts.map((repost) => ({
        ...repost.Post,
        isRepost: true,
        reposterId: repost.userId,
        reposterUsername: repost.Users.name,
      }))

      const posts = await this.prismaService.post.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
        where: {
          userId: { in: followedIds },
          createdAt: { lt: new Date(dateString) },
          confidentiality: 'public',
        },
        include: {
          Users: true,
          Tags: true,
        },
      })

      const postsTransformed = posts.map((post) => ({
        ...post,
        isRepost: false,
        reposterUsername: null,
        reposterId: null,
      }))

      const combinedPosts = [...repostsPosts, ...postsTransformed]

      const uniquePosts = combinedPosts.filter(
        (post, index, self) => self.findIndex((p) => p.id === post.id) === index
      )

      const filteredPosts = uniquePosts.filter((post) => {
        return !hiddenWords.some((word) => post.content?.includes(word))
      })

      const favoritePostIds = await this.prismaService.post
        .findMany({
          where: { favoritedBy: { some: { id: userId } } },
          select: { id: true },
        })
        .then((posts) => posts.map((post) => post.id))

      const transformedPosts = filteredPosts.map((post) => ({
        userId: post.userId,
        postId: post.id,
        username: post.Users?.name,
        userImgUrl: post.Users?.profilPicture,
        content: post.content,
        imageUrl: post.imageUrl,
        likes: post.likesCount,
        reposts: post.repostsCount,
        interractions: post.totalInteractions,
        comments: post.commentsCount,
        createdAt: post.createdAt,
        tags: post.Tags?.map((tag) => tag.name),
        isRepost: post.isRepost,
        reposterUsername: post.reposterUsername,
        reposterId: post.reposterId,
        isFavorited: post.id ? favoritePostIds.includes(post.id) : false,
        isPinned: post.id === pinnedPostId,
      }))

      return transformedPosts
    } catch (error) {
      console.error(error)
      throw new BadRequestException(
        'An error occurred when getting more posts.'
      )
    }
  }

  async findFavoritePosts(userId: string) {
    try {
      // Récupère les utilisateurs bloqués, cachés, et mots cachés de l'utilisateur actuel
      const currentUser = await this.prismaService.users.findUnique({
        where: { id: userId },
        select: {
          blockedUsers: true,
          hiddenUsers: true,
          hiddenWords: true,
          pinnedPostId: true,
        },
      })

      const blockedUsers = currentUser?.blockedUsers ?? []
      const hiddenUsers = currentUser?.hiddenUsers ?? []
      const hiddenWords = currentUser?.hiddenWords ?? []
      const pinnedPostId = currentUser?.pinnedPostId

      // Identifie les utilisateurs qui ont bloqué l'utilisateur actuel
      const blockerIds = (
        await this.prismaService.users.findMany({
          where: {
            blockedUsers: {
              has: userId,
            },
          },
          select: { id: true },
        })
      ).map((user) => user.id)

      // Récupère les posts favoris de l'utilisateur, en excluant les posts bloqués ou cachés
      const favoritePosts = await this.prismaService.post.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
        where: {
          favoritedBy: { some: { id: userId } },
          userId: { notIn: [...blockedUsers, ...hiddenUsers, ...blockerIds] },
          confidentiality: 'public',
        },
        include: { Users: true, Tags: true },
      })

      const filteredPosts = favoritePosts.filter((post) =>
        hiddenWords.every((word) => !post.content?.includes(word))
      )

      return filteredPosts.map((post) => ({
        userId: post.userId,
        postId: post.id,
        username: post.Users?.name,
        userImgUrl: post.Users?.profilPicture,
        content: post.content,
        imageUrl: post.imageUrl,
        likes: post.likesCount,
        reposts: post.repostsCount,
        interractions: post.totalInteractions,
        comments: post.commentsCount,
        createdAt: post.createdAt,
        tags: post.Tags?.map((tag) => tag.name),
        isRepost: false,
        reposterUsername: null,
        reposterId: null,
        isFavorited: true,
        isPinned: post.id === pinnedPostId,
      }))
    } catch (error) {
      console.error(error)
      throw new BadRequestException(
        'An error occurred when getting favorite posts.'
      )
    }
  }

  async addPostToFavorites(favoritePostDto: FavoritePostDto, userId: string) {
    try {
      await this.prismaService.users.update({
        where: { id: userId },
        data: {
          FavoritePost: {
            connect: { id: favoritePostDto.postId },
          },
        },
      })

      return { message: 'Post added to favorites successfully.' }
    } catch (error) {
      console.error(error)
      throw new BadRequestException(
        'An error occurred while adding to favorites.'
      )
    }
  }

  async removePostFromFavorites(
    favoritePostDto: FavoritePostDto,
    userId: string
  ) {
    try {
      await this.prismaService.users.update({
        where: { id: userId },
        data: {
          FavoritePost: {
            disconnect: { id: favoritePostDto.postId },
          },
        },
      })

      return { message: 'Post removed from favorites successfully.' }
    } catch (error) {
      console.error(error)
      throw new BadRequestException(
        'An error occurred while removing from favorites.'
      )
    }
  }

  async interractViewPost(viewInterractPostDto: ViewInterractPostDto) {
    try {
      await this.prismaService.post.update({
        where: { id: viewInterractPostDto.postId },
        data: { totalInteractions: { increment: 1 } },
      })
    } catch (error) {
      console.error(error)
      throw new BadRequestException(
        'An error occurred when interracting with the post'
      )
    }
  }

  async findPinnedPost(pinnedPostUserDto: PinnedPostUserDto, userId: string) {
    try {
      if (pinnedPostUserDto.userId) {
        userId = pinnedPostUserDto.userId
      }
      const currentUser = await this.prismaService.users.findUnique({
        where: { id: userId },
        select: { pinnedPostId: true },
      })

      const pinnedPostId = currentUser?.pinnedPostId

      if (!pinnedPostId) {
        return null
      }

      const pinnedPost = await this.prismaService.post.findUnique({
        where: { id: pinnedPostId },
        include: { Users: true, Tags: true },
      })

      if (!pinnedPost) {
        return null
      }

      const isFavorited = await this.prismaService.post
        .findMany({
          where: { favoritedBy: { some: { id: userId } } },
          select: { id: true },
        })
        .then((posts) => posts.some((post) => post.id === pinnedPostId))

      return {
        userId: pinnedPost.userId,
        postId: pinnedPost.id,
        username: pinnedPost.Users?.name,
        userImgUrl: pinnedPost.Users?.profilPicture,
        content: pinnedPost.content,
        imageUrl: pinnedPost.imageUrl,
        likes: pinnedPost.likesCount,
        reposts: pinnedPost.repostsCount,
        interractions: pinnedPost.totalInteractions,
        comments: pinnedPost.commentsCount,
        createdAt: pinnedPost.createdAt,
        tags: pinnedPost.Tags?.map((tag) => tag.name),
        isPinned: true,
        isRepost: false,
        reposterUsername: null,
        reposterId: null,
        isFavorited: isFavorited,
      }
    } catch (error) {
      console.error(error)
      throw new BadRequestException(
        'An error occurred when getting the pinned post.'
      )
    }
  }

  async addPostToPinned(pinnedPostDto: PinnedPostDto, userId: string) {
    try {
      await this.prismaService.users.update({
        where: { id: userId },
        data: {
          pinnedPostId: pinnedPostDto.postId,
        },
      })

      return { message: 'Post added to pinned successfully.' }
    } catch (error) {
      console.error(error)
      throw new BadRequestException('An error occurred while adding to pinned.')
    }
  }

  async removePostFromPinned(pinnedPostDto: PinnedPostDto, userId: string) {
    try {
      await this.prismaService.users.update({
        where: { id: userId, pinnedPostId: pinnedPostDto.postId },
        data: {
          pinnedPostId: null,
        },
      })

      return { message: 'Post removed from pinned successfully.' }
    } catch (error) {
      console.error(error)
      throw new BadRequestException(
        'An error occurred while removing from pinned.'
      )
    }
  }
}
