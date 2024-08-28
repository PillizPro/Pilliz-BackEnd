import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import {
  AddCountryToUserDto,
  AddAppTimeToUserDto,
  AddDeviceDetailsDto,
  AddKeyActivityTimeToUserDto,
} from './dto'

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
