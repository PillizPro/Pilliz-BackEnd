import { Controller, Post, Get, Param } from '@nestjs/common'
import { TutorialsService } from './tutorials.service'
import { ApiTags } from '@nestjs/swagger'
import { CurrentUserId } from 'src/common/decorators'

@ApiTags('Tutorials')
@Controller('tuto')
export class TutorialsController {
  constructor(private readonly tutorialsService: TutorialsService) {}

  @Post('userFirstConnection')
  async firstConnection(@CurrentUserId() userId: string) {
    return await this.tutorialsService.firstConnection(userId)
  }

  @Get('userSeenTutorial/:tutorialName')
  async seenTutorial(
    @Param('tutorialName') tutorialName: string,
    @CurrentUserId() userId: string
  ) {
    return await this.tutorialsService.seenTutorial(tutorialName, userId)
  }
}
