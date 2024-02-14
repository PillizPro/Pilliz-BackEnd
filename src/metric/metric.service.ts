import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { AddCountryToUserDto } from './dto/add-country-to-user.dto'

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
}
