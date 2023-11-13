import { Body, Controller, Post, Get } from '@nestjs/common'
import { DeleteUserDto } from 'src/user/dto/delete-user.dto'
import { BanningUserDto } from './dto/banning-user.dto'
import { AdminService } from './admin.service'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Administration')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('delete')
  async deleteUser(@Body() deleteUserDto: DeleteUserDto) {
    return await this.adminService.deleteUser(deleteUserDto)
  }

  @Post('ban')
  async banUser(@Body() banningUserDto: BanningUserDto) {
    return await this.adminService.banUser(banningUserDto)
  }

  @Post('unban')
  async unbanUser(@Body() banningUserDto: BanningUserDto) {
    return await this.adminService.unbanUser(banningUserDto)
  }

  @Get('usersList')
  async getAllUsers() {
    return await this.adminService.getAllUsers()
  }
}
