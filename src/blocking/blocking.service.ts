import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { BlockUserDto } from './dto/block-user.dto'
import { UnblockUserDto } from './dto/unblock-user.dto'
import { HideUserDto } from './dto/hide-user.dto'
import { UnhideUserDto } from './dto/unhide-user.dto'
import { HideWordDto } from './dto/hide-word.dto'
import { UnhideWordDto } from './dto/unhide-word.dto'

@Injectable()
export class BlockingService {
  constructor(private readonly prismaService: PrismaService) {}

  async blockUser(blockUserDto: BlockUserDto) {
    try {
      const { userId, userToBlock } = blockUserDto
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

  async unblockUser(unblockUserDto: UnblockUserDto) {
    try {
      const { userId, userToUnblock } = unblockUserDto

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

  async hideUser(hideUserDto: HideUserDto) {
    try {
      const { userId, userToHide } = hideUserDto
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

  async unhideUser(unhideUserDto: UnhideUserDto) {
    try {
      const { userId, userToUnhide } = unhideUserDto
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

  async hideWord(hideWordDto: HideWordDto) {
    try {
      const { userId, wordToHide } = hideWordDto
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

  async unhideWord(unhideWordDto: UnhideWordDto) {
    try {
      const { userId, wordToUnhide } = unhideWordDto
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
}
