import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { IdentifyUsersDto } from './dto/identify-users.dto'

// Services

@Injectable()
export class IdentificationService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllUserTagWithPattern(pattern: string) {
    const users = await this.prisma.users.findMany({
      where: {
        userTag: {
          startsWith: pattern,
        },
      },
    })

    return users
  }

  async isUserTagExist(userTag: string) {
    const user = await this.prisma.users.findUnique({
      where: { userTag: userTag },
    })

    if (user) return true

    return false
  }

  async identifyUsers(identifyUsersDto: IdentifyUsersDto) {
    const { usersTag } = identifyUsersDto

    if (!(usersTag instanceof Array)) {
      // Prevents DoS. (CodeQL)
      return
    }

    if (usersTag.length === 0) {
      return
    }

    for (let idx = 0; idx < usersTag.length; idx++) {
      const element = usersTag[idx]
      if ((await this.isUserTagExist(element!)) === false) continue

      // Emit Socket afin d'envoyer une notification (j'imagine^^)

      await this.prisma.users.update({
        where: { userTag: element },
        data: { totalIdentifyTime: { increment: 1 } },
      })
    }
  }

  async getIdentifyingPosts(userId: string) {
    try {
      const user = await this.prisma.users.findUnique({ where: { id: userId } })

      if (user?.userTag) {
        const posts = await this.prisma.post.findMany({
          where: {
            content: {
              contains: user?.userTag,
            },
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
      }
    } catch (error) {
      console.error(error)
      throw new Error('An error occured when getting identifying posts')
    }
  }
}
