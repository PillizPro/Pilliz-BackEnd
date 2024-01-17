import { Controller, Post, Body } from '@nestjs/common'
import { TutorialsService } from './tutorials.service'
import { ApiTags } from '@nestjs/swagger'
import { TutorialsDto } from './dto/tutorial.dto'
import { FirstConnectionDto } from './dto/firstConnection.dto'

@ApiTags('Tutorials')
@Controller('tuto')
export class TutorialsController {
  constructor(private readonly tutorialsService: TutorialsService) {}

  @Post('userFirstConnection')
  async firstConnection(@Body() firstConnection: FirstConnectionDto) {
    return await this.tutorialsService.firstConnection(firstConnection)
  }

  @Post('userSeenTutorial')
  async seenTutorial(@Body() tutorialDto: TutorialsDto) {
    return await this.tutorialsService.seenTutorial(tutorialDto)
  }
}
