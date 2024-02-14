import { Body, Controller, Post, Get, Param } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { MetricService } from './metric.service'
import { AddCountryToUserDto } from './dto/add-country-to-user.dto'

@ApiTags('Metric')
@Controller('metric')
export class MetricController {
  constructor(private readonly metricService: MetricService) { }

  @Post("addCountryToUser")
  async addCountryToUser(@Body() addCountryToUserDto: AddCountryToUserDto) {
    return await this.metricService.addCountry(addCountryToUserDto)
  }
}
