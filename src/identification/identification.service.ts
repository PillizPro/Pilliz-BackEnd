import { Injectable, Search } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

// Services

@Injectable()
export class IdentificationService {
  constructor(private readonly prisma: PrismaService) { }

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

  async identifyUsers(usersTag: string[]) {
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

      const posts = await this.prisma.post.findMany({
        where: {
          content: {
            contains: user?.userTag
          }
        }
      })

      return posts;
    }

    catch (error) {
      console.error(error)
      throw new Error('An error occured when getting identifying posts')
    }
  }
}