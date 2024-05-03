import { Controller, Get, Query } from '@nestjs/common'
import { UserService } from './user.service'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('FindUserBySearch')
@Controller('userInfo')
export class UserController {
  constructor(private readonly findUserbySearchService: UserService) {}

  @Get('userListByName')
  async getUsersBySearch(@Query('user') queryUsername: string) {
    return await this.findUserbySearchService.getUsersBySearch(queryUsername)
  }
}
