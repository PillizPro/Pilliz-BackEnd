import {
  Body,
  Controller,
  Post,
  Get,
  Headers,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { CreateCompanyOfferDto } from './dto/create-offer.dto'
import { OfferService } from './offer.service'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('OfferPosting')
@Controller('company-offer')
export class CompanyOfferController {
  constructor(private readonly offerService: OfferService) {}

  @Post('companyPosting')
  async companyPostByUser(@Body() createCompanyPostDto: CreateCompanyOfferDto) {
    return await this.offerService.companyPostByUser(createCompanyPostDto)
  }

  @Get('findallOffers')
  async findAllPosts() {
    return await this.offerService.findAllPosts()
  }

  @Get('find20RecentUserOffers')
  async findUserOffers(@Headers('userId') userId: string) {
    return await this.offerService.find20RecentUserOffers(userId)
  }

  @Get('find20MoreRecentOffers')
  async find20MoreRecentOffers(
    @Headers('userId') userId: string,
    @Headers('dateString') dateString: string
  ) {
    return await this.offerService.find20MoreRecentOffers(userId, dateString)
  }

  @Delete('deleteOffer')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOffer(
    @Headers('offerId') offerId: string,
    @Headers('userId') userId: string
  ) {
    return await this.offerService.deleteOffer(offerId, userId)
  }
}
