import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { MetricService } from './metric.service'
import { AddCountryToUserDto } from './dto/add-country-to-user.dto'
import { AddAppTimeToUserDto } from './dto/add-apptime-to-user.dto'
import { AddDeviceDetailsDto } from './dto/add-device-details-to-user.dto'
import { AddKeyActivityTimeToUserDto } from './dto/add-key-activity-time-to-user.dto'
import { CurrentUserId } from 'src/common/decorators'

@ApiTags('Metric')
@Controller('metric')
export class MetricController {
  constructor(private readonly metricService: MetricService) {}

  @Post('addCountryToUser')
  async addCountryToUser(
    @Body() addCountryToUserDto: AddCountryToUserDto,
    @CurrentUserId() userId: string
  ) {
    return await this.metricService.addCountry(addCountryToUserDto, userId)
  }

  @Post('addAppTime')
  async addAppTimeToUser(
    @Body() addAppTimeToUser: AddAppTimeToUserDto,
    @CurrentUserId() userId: string
  ) {
    return await this.metricService.addAppTime(addAppTimeToUser, userId)
  }

  @Post('addDeviceDetails')
  async addDeviceDetailsToUser(
    @Body() addDeviceDetailsToUser: AddDeviceDetailsDto,
    @CurrentUserId() userId: string
  ) {
    return await this.metricService.addDeviceDetails(
      addDeviceDetailsToUser,
      userId
    )
  }

  @Post('addFeedTime')
  async addFeedTimeToUser(
    @Body() addKeyActivityTimeToUserDto: AddKeyActivityTimeToUserDto,
    @CurrentUserId() userId: string
  ) {
    return await this.metricService.addActivityTimeToFeed(
      addKeyActivityTimeToUserDto,
      userId
    )
  }

  @Post('addMarketTime')
  async addMarketTimeToUser(
    @Body() addKeyActivityTimeToUserDto: AddKeyActivityTimeToUserDto,
    @CurrentUserId() userId: string
  ) {
    return await this.metricService.addActivityTimeToMarket(
      addKeyActivityTimeToUserDto,
      userId
    )
  }

  @Post('addProTime')
  async addProTimeToUser(
    @Body() addKeyActivityTimeToUserDto: AddKeyActivityTimeToUserDto,
    @CurrentUserId() userId: string
  ) {
    return await this.metricService.addActivityTimeToPro(
      addKeyActivityTimeToUserDto,
      userId
    )
  }
}
