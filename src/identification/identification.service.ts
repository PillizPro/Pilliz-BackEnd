import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { contains } from 'class-validator'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { IdentifyUsersDto } from './dto'

// Services

@Injectable()
export class IdentificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2
  ) { }

  async getAllUserTagWithPattern(pattern: string) {
    const users = await this.prisma.users.findMany({
      where: {
        userTag: {
          startsWith: pattern,
        },
      },
    })

    return users.map((str) => str.userTag)
  }

  async formatUserTag(userTag: string) {
    const users = await this.prisma.users.findMany({
      where: {
        userTag: {
          startsWith: userTag,
        },
      },
    })

    if (users.length == 0)
      return ""
    else
      return users.length.toString()
  }

  async isUserTagExist(userTag: string) {
    const user = await this.prisma.users.findUnique({
      where: { userTag: userTag },
    })

    if (user) return true

    return false
  }

  async identifyUsers(identifyUsersDto: IdentifyUsersDto) {
    const { userId, content, usersTag } = identifyUsersDto

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
      var receiver = await this.prisma.users.findUnique({
        where: { userTag: element },
      })

      this.eventEmitter.emit(
        'notifyUser',
        6,
        userId,
        content,
        receiver!.id,
      )

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
      throw new BadRequestException(
        'An error occured when getting identifying posts.'
      )
    }
  }
}
