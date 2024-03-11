import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { AddCountryToUserDto } from './dto/add-country-to-user.dto'
import { AddAppTimeToUserDto } from './dto/add-apptime-to-user.dto'
import { AddDeviceDetailsDto } from './dto/add-device-details-to-user.dto'
import { AddKeyActivityTimeToUserDto } from './dto/add-key-activity-time-to-user.dto'

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

  async addDeviceDetails(addDeviceDetailsdto: AddDeviceDetailsDto) {
    await this.prisma.users.update({
      where: { id: addDeviceDetailsdto.userId },
      data: {
        deviceRelease: addDeviceDetailsdto.deviceRelease,
        deviceVersion: addDeviceDetailsdto.deviceVersion,
        deviceName: addDeviceDetailsdto.deviceName,
        deviceWidth: addDeviceDetailsdto.deviceWidth,
        deviceHeight: addDeviceDetailsdto.deviceHeight
      }
    })
  }

  async addActivityTimeToFeed(addKeyActivityTimeToUserDto: AddKeyActivityTimeToUserDto) {
    const user = await this.prisma.users.findFirst({
      where: { id: addKeyActivityTimeToUserDto.userId }
    })
    if (user) {
      const newTime = user?.totalFeedTime + addKeyActivityTimeToUserDto.activityTime;
      await this.prisma.users.update({
        where: { id: addKeyActivityTimeToUserDto.userId },
        data: { totalFeedTime: newTime }
      })
    }
  }

  async addActivityTimeToMarket(addKeyActivityTimeToUserDto: AddKeyActivityTimeToUserDto) {
    const user = await this.prisma.users.findFirst({
      where: { id: addKeyActivityTimeToUserDto.userId }
    })
    if (user) {
      const newTime = user?.totalFeedTime + addKeyActivityTimeToUserDto.activityTime;
      await this.prisma.users.update({
        where: { id: addKeyActivityTimeToUserDto.userId },
        data: { totalMarketTime: newTime }
      })
    }
  }

  async addActivityTimeToPro(addKeyActivityTimeToUserDto: AddKeyActivityTimeToUserDto) {
    const user = await this.prisma.users.findFirst({
      where: { id: addKeyActivityTimeToUserDto.userId }
    })
    if (user) {
      const newTime = user?.totalFeedTime + addKeyActivityTimeToUserDto.activityTime;
      await this.prisma.users.update({
        where: { id: addKeyActivityTimeToUserDto.userId },
        data: { totalProTime: newTime }
      })
    }
  }
}
