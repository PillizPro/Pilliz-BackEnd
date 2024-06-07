import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class TutorialsService {
  constructor(private readonly prismaService: PrismaService) {}

  // Fonction pour valider si un user a eu sa première connexion et a vu le tutoriel du feed
  async firstConnection(userId: string) {
    await this.prismaService.users.update({
      where: { id: userId },
      data: { firstConnection: false, tutorialFeed: true },
    })
  }

  // Fonction pour valider un tutoriel en particulier
  async seenTutorial(tutorialName: string, userId: string) {
    const valueName = `tutorial${tutorialName}`

    await this.prismaService.users.update({
      where: { id: userId },
      data: { [valueName]: true },
    })
  }
}
