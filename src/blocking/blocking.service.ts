import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { BlockUserDto } from './dto/block-user.dto'
import { UnblockUserDto } from './dto/unblock-user.dto'
import { HideUserDto } from './dto/hide-user.dto'
import { UnhideUserDto } from './dto/unhide-user.dto'

@Injectable()
export class BlockingService {
  constructor(private readonly prismaService: PrismaService) {}

  async blockUser(blockUserDto: BlockUserDto, userId: string) {
    try {
      const { userToBlock } = blockUserDto
      const user = await this.prismaService.users.findUnique({
        where: { id: userId },
        select: { blockedUsers: true },
      })

      if (user && !user.blockedUsers.includes(userToBlock)) {
        await this.prismaService.users.update({
          where: { id: userId },
          data: {
            blockedUsers: {
              set: [...user.blockedUsers, userToBlock],
            },
          },
        })
      }
    } catch (error) {
      console.error(error)
      throw new Error('An error occurred when blocking a user.')
    }
  }

  async unblockUser(unblockUserDto: UnblockUserDto, userId: string) {
    try {
      const { userToUnblock } = unblockUserDto

      const user = await this.prismaService.users.findUnique({
        where: { id: userId },
        select: { blockedUsers: true },
      })

      if (user && user.blockedUsers.includes(userToUnblock)) {
        await this.prismaService.users.update({
          where: { id: userId },
          data: {
            blockedUsers: {
              set: user.blockedUsers.filter((id) => id !== userToUnblock),
            },
          },
        })
      }
    } catch (error) {
      console.error(error)
      throw new Error('An error occurred when unblocking a user.')
    }
  }

  async hideUser(hideUserDto: HideUserDto, userId: string) {
    try {
      const { userToHide } = hideUserDto
      const user = await this.prismaService.users.findUnique({
        where: { id: userId },
        select: { hiddenUsers: true },
      })

      if (user && !user.hiddenUsers.includes(userToHide)) {
        await this.prismaService.users.update({
          where: { id: userId },
          data: {
            hiddenUsers: {
              set: [...user.hiddenUsers, userToHide],
            },
          },
        })
      }
    } catch (error) {
      console.error(error)
      throw new Error('An error occurred when hiding a user.')
    }
  }

  async unhideUser(unhideUserDto: UnhideUserDto, userId: string) {
    try {
      const { userToUnhide } = unhideUserDto
      const user = await this.prismaService.users.findUnique({
        where: { id: userId },
        select: { hiddenUsers: true },
      })

      if (user && user.hiddenUsers.includes(userToUnhide)) {
        await this.prismaService.users.update({
          where: { id: userId },
          data: {
            hiddenUsers: {
              set: user.hiddenUsers.filter((id) => id !== userToUnhide),
            },
          },
        })
      }
    } catch (error) {
      console.error(error)
      throw new Error('An error occurred when unhiding a user.')
    }
  }

  async hideWord(wordToHide: string, userId: string) {
    try {
      const user = await this.prismaService.users.findUnique({
        where: { id: userId },
        select: { hiddenWords: true },
      })

      if (user && !user.hiddenWords.includes(wordToHide)) {
        await this.prismaService.users.update({
          where: { id: userId },
          data: {
            hiddenWords: {
              set: [...user.hiddenWords, wordToHide],
            },
          },
        })
      }
    } catch (error) {
      console.error(error)
      throw new Error('An error occurred when hiding a word.')
    }
  }

  async unhideWord(wordToUnhide: string, userId: string) {
    try {
      const user = await this.prismaService.users.findUnique({
        where: { id: userId },
        select: { hiddenWords: true },
      })

      if (user && user.hiddenWords.includes(wordToUnhide)) {
        await this.prismaService.users.update({
          where: { id: userId },
          data: {
            hiddenWords: {
              set: user.hiddenWords.filter((word) => word !== wordToUnhide),
            },
          },
        })
      }
    } catch (error) {
      console.error(error)
      throw new Error('An error occurred when unhiding a word.')
    }
  }

  async findUsersBlocked(userId: string) {
    try {
      return await this.prismaService.users.findUnique({
        where: { id: userId },
        select: { blockedUsers: true },
      })
    } catch (error) {
      console.error(error)
      throw new Error('An error occurred when retrieving blocked users.')
    }
  }

  async findUsersHided(userId: string) {
    try {
      return await this.prismaService.users.findUnique({
        where: { id: userId },
        select: { hiddenUsers: true },
      })
    } catch (error) {
      console.error(error)
      throw new Error('An error occurred when retrieving hidden users.')
    }
  }

  async findWordsHided(userId: string) {
    try {
      return await this.prismaService.users.findUnique({
        where: { id: userId },
        select: { hiddenWords: true },
      })
    } catch (error) {
      console.error(error)
      throw new Error('An error occurred when retrieving hidden words.')
    }
  }

  async findUsersDetailsBlocked(userId: string) {
    try {
      const userWithBlockedIds = await this.prismaService.users.findUnique({
        where: { id: userId },
        select: { blockedUsers: true },
      })

      if (userWithBlockedIds && userWithBlockedIds.blockedUsers.length > 0) {
        const blockedUsersDetails = await this.prismaService.users.findMany({
          where: {
            id: {
              in: userWithBlockedIds.blockedUsers,
            },
          },
          select: {
            id: true,
            name: true,
            profilPicture: true,
          },
        })

        return blockedUsersDetails
      }

      return []
    } catch (error) {
      console.error(error)
      throw new Error('An error occurred when retrieving blocked users.')
    }
  }

  async findUsersDetailsHided(userId: string) {
    try {
      const userWithHidedIds = await this.prismaService.users.findUnique({
        where: { id: userId },
        select: { hiddenUsers: true },
      })

      if (userWithHidedIds && userWithHidedIds.hiddenUsers.length > 0) {
        const hidedUsersDetails = await this.prismaService.users.findMany({
          where: {
            id: {
              in: userWithHidedIds.hiddenUsers,
            },
          },
          select: {
            id: true,
            name: true,
            profilPicture: true,
          },
        })

        return hidedUsersDetails
      }

      return []
    } catch (error) {
      console.error(error)
      throw new Error('An error occurred when retrieving hided users.')
    }
  }
}
