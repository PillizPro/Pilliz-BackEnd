import { Body, Controller, Post, Get, Param } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { MetricService } from './metric.service'
import { AddCountryToUserDto } from './dto/add-country-to-user.dto'
import { AddAppTimeToUserDto } from './dto/add-apptime-to-user.dto'

@ApiTags('Metric')
@Controller('metric')
export class MetricController {
  constructor(private readonly metricService: MetricService) { }

  @Post("addCountryToUser")
  async addCountryToUser(@Body() addCountryToUserDto: AddCountryToUserDto) {
    return await this.metricService.addCountry(addCountryToUserDto)
  }

  @Post("addAppTime")
  async addAppTimeToUser(@Body() addAppTimeToUser: AddAppTimeToUserDto) {
    return await this.metricService.addAppTime(addAppTimeToUser);
  }
}
