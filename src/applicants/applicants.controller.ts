import { Body, Controller, Post, Get, Headers } from '@nestjs/common'
import { ApplyToOfferDto } from './dto'
import { ApplicantService } from './applicants.service'
import { ApiTags } from '@nestjs/swagger'
import { CurrentUserId } from 'src/common/decorators'

@ApiTags('Applicants')
@Controller('applicants')
export class ApplicantsController {
  constructor(private readonly applicantService: ApplicantService) {}

  @Post('apply-to-offer')
  async applyToOffer(
    @Body() applyToOfferDto: ApplyToOfferDto,
    @CurrentUserId() userId: string
  ) {
    return await this.applicantService.applyToOffer(applyToOfferDto, userId)
  }

  @Get('get-applicants-by-offer')
  async getApplicantsByOffer(@Headers('offerId') getApplicantsByOffer: string) {
    return await this.applicantService.getApplicantsByOffer(
      getApplicantsByOffer
    )
  }
}
