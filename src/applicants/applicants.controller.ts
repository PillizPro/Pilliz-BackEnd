import { Body, Controller, Post, Get, Headers } from '@nestjs/common'
import { ApplyToOfferDto, GetApplicantsByOffer } from './dto'
import { ApplicantService } from './applicants.service'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Applicants')
@Controller('applicants')
export class ApplicantsController {
  constructor(private readonly applicantService: ApplicantService) {}

  @Post('apply-to-offer')
  async applyToOffer(@Body() applyToOfferDto: ApplyToOfferDto) {
    return await this.applicantService.applyToOffer(applyToOfferDto)
  }

  @Get('get-applicants-by-offer')
  async getApplicantsByOffer(
    @Headers('offerId') getApplicantsByOffer: GetApplicantsByOffer
  ) {
    return await this.applicantService.getApplicantsByOffer(
      getApplicantsByOffer
    )
  }
}
