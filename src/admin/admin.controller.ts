import { Body, Controller, Post, Get } from '@nestjs/common'
import { DeleteDto } from './dto/delete.dto'
import { BanningDto } from './dto/banning.dto'
import { AdminService } from './admin.service'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Administration')
@Controller('admin')
export class AdminController {
  constructor(private readonly AdminService: AdminService) { }

  @Post('delete')
  async deleteUser(@Body() deleteDto: DeleteDto) {
    return await this.AdminService.deleteUser(deleteDto)
  }

  @Post('ban')
  async banUser(@Body() banningDto: BanningDto) {
    return await this.AdminService.banUser(banningDto)
  }

  @Post('unban')
  async unbanUser(@Body() banningDto: BanningDto) {
    return await this.AdminService.unbanUser(banningDto)
  }

  @Get('usersList')
  async getAllUsers() {
    return await this.AdminService.getAllUsers();
  }
}