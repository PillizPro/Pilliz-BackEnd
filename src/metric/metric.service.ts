import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { AddCountryToUserDto } from './dto/add-country-to-user.dto'
import { AddAppTimeToUserDto } from './dto/add-apptime-to-user.dto'

@Injectable()
export class MetricService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async addCountry(addCountryToUserDto: AddCountryToUserDto) {
    await this.prisma.users.update({
      where: { id: addCountryToUserDto.userId },
      data: { country: addCountryToUserDto.country },
    })
  }

  async addAppTime(addAppTimeToUserDto: AddAppTimeToUserDto) {
    const user = await this.prisma.users.findFirst({
      where: { id: addAppTimeToUserDto.userId }
    })
    if (user) {
      const newTime = user?.totalAppTime + addAppTimeToUserDto.appTime;
      await this.prisma.users.update({
        where: { id: addAppTimeToUserDto.userId },
        data: { totalAppTime: newTime }
      })
    }
  }
}
