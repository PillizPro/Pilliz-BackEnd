import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { TutorialsDto } from './dto/tutorial.dto'
import { FirstConnectionDto } from './dto/firstConnection.dto'

@Injectable()
export class TutorialsService {
  constructor(private readonly prismaService: PrismaService) {}

  // Fonction pour valider si un user a eu sa première connexion et a vu le tutoriel du feed
  async firstConnection(firstConnection: FirstConnectionDto) {
    await this.prismaService.users.update({
      where: { id: firstConnection.userId },
      data: { firstConnection: false, tutorialFeed: true },
    })
  }

  // Fonction pour valider un tutoriel en particulier
  async seenTutorial(tutorialDto: TutorialsDto) {
    const { userId, tutorialName } = tutorialDto

    const valueName = `tutorial${tutorialName}`

    await this.prismaService.users.update({
      where: { id: userId },
      data: { [valueName]: true },
    })
  }
}
