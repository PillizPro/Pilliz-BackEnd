import { Injectable } from '@nestjs/common'
import { SignalementDto } from './dto/signalement.dto'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class SignalementService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllSignalement() {
    return await this.prismaService.signalement.findMany()
  }

  async getAllUserSignalement(userId: string) {
    return await this.prismaService.signalement.findMany({
      where: { userId },
    })
  }

  async createSignalement(signalement: SignalementDto, userId: string) {
    try {
      await this.prismaService.signalement.create({
        data: {
          userId: userId,
          category: signalement.category,
          description: signalement.description,
        },
      })
    } catch (error) {
      console.error(error)
      throw new Error('An error occurred when creating the signalement.')
    }
    return { message: 'Signalement successfully created.' }
  }

  async changeSignalementStatus(signalementId: string) {
    try {
      const signalement = await this.prismaService.signalement.findUnique({
        where: { id: signalementId },
      })
      if (!signalement) {
        throw new Error('signalement not found.')
      }
      if (signalement.solved) {
        await this.prismaService.signalement.update({
          where: { id: signalementId },
          data: { solved: false, solvedAt: null },
        })
      } else {
        await this.prismaService.signalement.update({
          where: { id: signalementId },
          data: { solved: true, solvedAt: new Date() },
        })
      }
    } catch (error) {
      throw new Error('An error occurred when changing the signalement status.')
    }
    return { message: 'signalement status successfully changed.' }
  }
}
