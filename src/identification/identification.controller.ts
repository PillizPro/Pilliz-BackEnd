import { Body, Controller, Post, Get, Param } from '@nestjs/common'
import { IdentificationService } from './identification.service'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Identification')
@Controller('identification')
export class IdentificationController {
  constructor(private readonly identificationService: IdentificationService) {}

  @Get('getAllUserTagWithPattern/:pattern')
  async getAllUserTagWithPattern(@Param('pattern') pattern: string) {
    return await this.identificationService.getAllUserTagWithPattern(pattern)
  }

  @Post('IdentifyUsers')
  async identifyUsers(@Body() usersTag: string[]) {
    return await this.identificationService.identifyUsers(usersTag)
  }
}
