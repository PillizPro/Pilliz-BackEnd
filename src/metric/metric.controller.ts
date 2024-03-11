import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { MetricService } from './metric.service'
import { AddCountryToUserDto } from './dto/add-country-to-user.dto'
import { AddAppTimeToUserDto } from './dto/add-apptime-to-user.dto'
import { AddDeviceDetailsDto } from './dto/add-device-details-to-user.dto'
import { AddKeyActivityTimeToUserDto } from './dto/add-key-activity-time-to-user.dto'

@ApiTags('Metric')
@Controller('metric')
export class MetricController {
  constructor(private readonly metricService: MetricService) {}

  @Post('addCountryToUser')
  async addCountryToUser(@Body() addCountryToUserDto: AddCountryToUserDto) {
    return await this.metricService.addCountry(addCountryToUserDto)
  }

  @Post('addAppTime')
  async addAppTimeToUser(@Body() addAppTimeToUser: AddAppTimeToUserDto) {
    return await this.metricService.addAppTime(addAppTimeToUser)
  }

  @Post('addDeviceDetails')
  async addDeviceDetailsToUser(
    @Body() addDeviceDetailsToUser: AddDeviceDetailsDto
  ) {
    return await this.metricService.addDeviceDetails(addDeviceDetailsToUser)
  }

  @Post('addFeedTime')
  async addFeedTimeToUser(
    @Body() addKeyActivityTimeToUserDto: AddKeyActivityTimeToUserDto
  ) {
    return await this.metricService.addActivityTimeToFeed(
      addKeyActivityTimeToUserDto
    )
  }

  @Post('addMarketTime')
  async addMarketTimeToUser(
    @Body() addKeyActivityTimeToUserDto: AddKeyActivityTimeToUserDto
  ) {
    return await this.metricService.addActivityTimeToMarket(
      addKeyActivityTimeToUserDto
    )
  }

  @Post('addProTime')
  async addProTimeToUser(
    @Body() addKeyActivityTimeToUserDto: AddKeyActivityTimeToUserDto
  ) {
    return await this.metricService.addActivityTimeToPro(
      addKeyActivityTimeToUserDto
    )
  }
}
