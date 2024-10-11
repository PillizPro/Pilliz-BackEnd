import { Controller, Get } from '@nestjs/common'

import { CurrentUserId } from 'src/common/decorators'
import { AchievementsService } from './achievements.service'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

@ApiBearerAuth()
@ApiTags('Achievements')
@Controller('achievements')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Get('checkLikesAchievements')
  async checkLikesAchievements(@CurrentUserId() userId: string) {
    return await this.achievementsService.checkLikesAchievements(userId)
  }

  @Get('checkRepostsAchievements')
  async checkRepostsAchievements(@CurrentUserId() userId: string) {
    return await this.achievementsService.checkRepostsAchievements(userId)
  }

  @Get('checkInterractionsAchievements')
  async checkInterractionsAchievements(@CurrentUserId() userId: string) {
    return await this.achievementsService.checkInterractionsAchievements(userId)
  }

  @Get('recoverAllAchievements')
  async recoverAllAchievements(@CurrentUserId() userId: string) {
    return await this.achievementsService.recoverAllAchievements(userId)
  }
}
