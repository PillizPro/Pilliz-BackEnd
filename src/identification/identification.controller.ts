import { Body, Controller, Post, Get, Param } from '@nestjs/common'
import { IdentificationService } from './identification.service'
import { IdentifyUsersDto } from './dto/identify-users.dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Identification')
@Controller('identification')
export class IdentificationController {
  constructor(private readonly identificationService: IdentificationService) {}

  @Get('getAllUserTagWithPattern/:pattern')
  async getAllUserTagWithPattern(@Param('pattern') pattern: string) {
    return await this.identificationService.getAllUserTagWithPattern(pattern)
  }

  @Get('formatUserTag/:userTag')
  async formatUserTag(@Param('userTag') userTag: string) {
    return await this.identificationService.formatUserTag(userTag)
  }

  @Post('IdentifyUsers')
  async identifyUsers(@Body() identifyUsersDto: IdentifyUsersDto) {
    return await this.identificationService.identifyUsers(identifyUsersDto)
  }
}
