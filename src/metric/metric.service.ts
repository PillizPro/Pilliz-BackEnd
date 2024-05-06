import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { AddCountryToUserDto } from './dto/add-country-to-user.dto'
import { AddAppTimeToUserDto } from './dto/add-apptime-to-user.dto'
import { AddDeviceDetailsDto } from './dto/add-device-details-to-user.dto'
import { AddKeyActivityTimeToUserDto } from './dto/add-key-activity-time-to-user.dto'

@Injectable()
export class MetricService {
  constructor(private readonly prisma: PrismaService) {}

  async addCountry(addCountryToUserDto: AddCountryToUserDto, userId: string) {
    await this.prisma.users.update({
      where: { id: userId },
      data: { country: addCountryToUserDto.country },
    })
  }

  async addAppTime(addAppTimeToUserDto: AddAppTimeToUserDto, userId: string) {
    const user = await this.prisma.users.findFirst({
      where: { id: userId },
    })
    if (user) {
      const newTime = user?.totalAppTime + addAppTimeToUserDto.appTime
      await this.prisma.users.update({
        where: { id: userId },
        data: { totalAppTime: newTime },
      })
    }
  }

  async addDeviceDetails(
    addDeviceDetailsdto: AddDeviceDetailsDto,
    userId: string
  ) {
    await this.prisma.users.update({
      where: { id: userId },
      data: {
        deviceRelease: addDeviceDetailsdto.deviceRelease,
        deviceVersion: addDeviceDetailsdto.deviceVersion,
        deviceName: addDeviceDetailsdto.deviceName,
        deviceWidth: addDeviceDetailsdto.deviceWidth,
        deviceHeight: addDeviceDetailsdto.deviceHeight,
      },
    })
  }

  async addActivityTimeToFeed(
    addKeyActivityTimeToUserDto: AddKeyActivityTimeToUserDto,
    userId: string
  ) {
    const user = await this.prisma.users.findFirst({
      where: { id: userId },
    })
    if (user) {
      const newTime =
        user?.totalFeedTime + addKeyActivityTimeToUserDto.activityTime
      await this.prisma.users.update({
        where: { id: userId },
        data: { totalFeedTime: newTime },
      })
    }
  }

  async addActivityTimeToMarket(
    addKeyActivityTimeToUserDto: AddKeyActivityTimeToUserDto,
    userId: string
  ) {
    const user = await this.prisma.users.findFirst({
      where: { id: userId },
    })
    if (user) {
      const newTime =
        user?.totalFeedTime + addKeyActivityTimeToUserDto.activityTime
      await this.prisma.users.update({
        where: { id: userId },
        data: { totalMarketTime: newTime },
      })
    }
  }

  async addActivityTimeToPro(
    addKeyActivityTimeToUserDto: AddKeyActivityTimeToUserDto,
    userId: string
  ) {
    const user = await this.prisma.users.findFirst({
      where: { id: userId },
    })
    if (user) {
      const newTime =
        user?.totalFeedTime + addKeyActivityTimeToUserDto.activityTime
      await this.prisma.users.update({
        where: { id: userId },
        data: { totalProTime: newTime },
      })
    }
  }
}
