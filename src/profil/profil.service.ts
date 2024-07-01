import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

// Services
import { FollowService } from 'src/follow/follow.service'
import { ImageUploadService } from 'src/image/image-upload.service'
import { DocumentUploadService } from 'src/document/upload-document.service'
import { IdentificationService } from 'src/identification/identification.service'
import { LikeService } from 'src/like/like.service'
import { RepostService } from 'src/repost/repost.service'

// DTO
import { UploadFilesDto } from './dto/upload-files.dto'
import { ChangeProfilImgDto } from './dto/change-profil-img.dto'
import { ChangeBioDto } from './dto/change-bio.dto'

@Injectable()
export class ProfilService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly followService: FollowService,
    private readonly imageService: ImageUploadService,
    private readonly docService: DocumentUploadService,
    private readonly identificationService: IdentificationService,
    private readonly likeService: LikeService,
    private readonly repostService: RepostService
  ) {}

  async changeBio(changeBioDto: ChangeBioDto, userId: string) {
    await this.prisma.users.update({
      where: { id: userId },
      data: { bio: changeBioDto.bio },
    })
  }

  async getBio(userId: string) {
    const user = await this.prisma.users.findFirst({
      where: {
        id: userId,
      },
    })
    return user?.bio
  }

  async getNbPost(userId: string) {
    const userPosts = await this.prisma.post.findMany({
      where: {
        userId: userId,
      },
    })
    return userPosts.length
  }

  async fetchUserInfos(userId: string) {
    try {
      // Récupérer les posts récents originaux
      const userInfos = await this.prisma.users.findMany({
        where: {
          id: userId,
        },
        select: {
          email: true,
          name: true,
        },
      })

      const userBio = await this.getBio(userId)
      const userNbPosts = await this.getNbPost(userId)
      const userNbFollowers = await this.followService.getNbFollowers(userId)
      const userNbFollowings = await this.followService.getNbFollowing(userId)

      const informations = {
        email: userInfos[0]!.email,
        name: userInfos[0]!.name,
        bio: userBio,
        nbPosts: userNbPosts,
        nbFollowers: userNbFollowers,
        nbFollowings: userNbFollowings,
      }

      return informations
    } catch (error) {
      console.error(error)
      throw new Error('An error occurred when getting user infos')
    }
  }

  async changeProfilImage(
    changeProfilImageDto: ChangeProfilImgDto,
    userId: string
  ) {
    const { imgBytes } = changeProfilImageDto

    let imageUrl = ''
    if (imgBytes) {
      imageUrl = await this.imageService.uploadBase64Image(imgBytes)
    }

    await this.prisma.users.update({
      where: { id: userId },
      data: { profilPicture: imageUrl },
    })

    return imageUrl
  }

  async uploadUserDocument(uploadFilesDto: UploadFilesDto, userId: string) {
    const { docName, docBytes, docType } = uploadFilesDto

    let docUrl = ''
    if (docBytes) {
      docUrl = await this.imageService.uploadBase64Files(docBytes, docType)
    }

    return this.docService.uploadUserDocument(userId, docName, docUrl)
  }

  async getUserDocuments(userId: string) {
    return this.docService.getUserDocuments(userId)
  }

  async getUserProfilImg(userId: string) {
    const user = await this.prisma.users.findFirst({
      where: {
        id: userId,
      },
    })
    return user?.profilPicture
  }

  /// Identification

  async getIdentifyingPosts(userId: string) {
    return await this.identificationService.getIdentifyingPosts(userId)
  }

  async getPostOnProfil(userId: string) {
    try {
      const posts = await this.prisma.post.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
        where: {
          userId: userId,
        },
        include: {
          Users: true,
          Tags: true,
        },
      })

      const transformedPosts = posts.map((post) => ({
        userId: post.userId,
        postId: post.id,
        username: post.Users?.name,
        content: post.content,
        imageUrl: post.imageUrl,
        likes: post.likesCount,
        reposts: post.repostsCount,
        comments: post.commentsCount,
        createdAt: post.createdAt,
      }))
      return transformedPosts
    } catch (error) {
      console.error(error)
      throw new Error('An error occurred when getting posts')
    }
  }

  async getCommentOnProfile(userId: string) {
    try {
      const comments = await this.prisma.comment.findMany({
        where: {
          userId: userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          Users: true,
        },
      })

      const transformedComments = await Promise.all(
        comments.map(async (comment) => {
          const repliesCount = await this.prisma.comment.count({
            where: {
              rootCommentId: comment.id,
            },
          })

          const replyUsername = await this.prisma.post.findFirst({
            where: {
              id: comment.postId,
            },
            include: {
              Users: true,
            },
          })

          return {
            userId: comment.userId,
            postId: comment.postId,
            commentId: comment.id, // ID of the comment
            username: comment.Users.name, // User's name
            content: comment.content, // Content of the comment
            likes: comment.likesCount, // Number of likes
            reposts: comment.repostsCount, // Number of reposts
            createdAt: comment.createdAt, // Creation date
            responseNumber: repliesCount,
            replyName: replyUsername?.Users.name,
          }
        })
      )
      return transformedComments
    } catch (error) {
      console.error(error)
      throw new Error('An error occurred when getting comments on te profil.')
    }
  }

  async getLikeOnProfile(userId: string) {
    try {
      const likedCommentsIds =
        await this.likeService.getLikedCommentsByUser(userId)
      const likedPostsIds = await this.likeService.getLikedPostsByUser(userId)

      const likedPosts = await this.prisma.post.findMany({
        where: {
          id: { in: likedPostsIds.map((lp) => lp) },
        },
        include: {
          Users: true,
          Tags: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      const transformedPosts = likedPosts.map((post) => ({
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
        isComment: false,
      }))

      const likedComments = await this.prisma.comment.findMany({
        where: {
          id: { in: likedCommentsIds.map((lc) => lc) },
        },
        include: {
          Users: true,
          Post: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      const transformedComments = await Promise.all(
        likedComments.map(async (comment) => {
          const repliesCount = await this.prisma.comment.count({
            where: {
              rootCommentId: comment.id,
            },
          })

          const replyUsername = await this.prisma.post.findFirst({
            where: {
              id: comment.Post.id,
            },
            include: {
              Users: true,
            },
          })

          return {
            userId: comment.userId,
            postId: comment.postId,
            commentId: comment.id,
            username: comment.Users.name,
            content: comment.content,
            likes: comment.likesCount,
            reposts: comment.repostsCount,
            createdAt: comment.createdAt,
            originalPostId: comment.Post.id,
            responseNumber: repliesCount,
            replyName: replyUsername?.Users.name,
            isComment: true,
          }
        })
      )

      const combinedContent = [...transformedPosts, ...transformedComments]
      combinedContent.sort(
        (a, b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt))
      )

      return combinedContent
    } catch (error) {
      console.error(error)
      throw new Error('An error occurred when getting like on the profil.')
    }
  }

  async getRepostOnProfile(userId: string) {
    try {
      const repostedCommentsIds =
        await this.repostService.getRepostedCommentsByUser(userId)
      const repostedPostsIds =
        await this.repostService.getRepostedPostsByUser(userId)

      const repostedPosts = await this.prisma.post.findMany({
        where: {
          id: { in: repostedPostsIds.map((rp) => rp) },
        },
        include: {
          Users: true,
          Tags: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      const transformedPosts = repostedPosts.map((post) => ({
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
        isComment: false,
      }))

      const repostedComments = await this.prisma.comment.findMany({
        where: {
          id: { in: repostedCommentsIds.map((rc) => rc) },
        },
        include: {
          Users: true,
          Post: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      const transformedComments = await Promise.all(
        repostedComments.map(async (comment) => {
          const repliesCount = await this.prisma.comment.count({
            where: {
              rootCommentId: comment.id,
            },
          })

          const replyUsername = await this.prisma.post.findFirst({
            where: {
              id: comment.Post.id,
            },
            include: {
              Users: true,
            },
          })

          return {
            userId: comment.userId,
            postId: comment.postId,
            commentId: comment.id,
            username: comment.Users.name,
            content: comment.content,
            likes: comment.likesCount,
            reposts: comment.repostsCount,
            createdAt: comment.createdAt,
            originalPostId: comment.Post.id,
            responseNumber: repliesCount,
            replyName: replyUsername?.Users.name,
            isComment: true,
          }
        })
      )

      const combinedContent = [...transformedPosts, ...transformedComments]
      combinedContent.sort(
        (a, b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt))
      )

      return combinedContent
    } catch (error) {
      console.error(error)
      throw new Error('An error occurred when getting like on the profil.')
    }
  }
}
