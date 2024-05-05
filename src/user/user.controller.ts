import { Controller, Get, Query } from '@nestjs/common'
import { UserService } from './user.service'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('userListByName')
  async getUsersBySearch(@Query('user') queryUsername: string) {
    return await this.userService.getUsersBySearch(queryUsername)
  }
}
