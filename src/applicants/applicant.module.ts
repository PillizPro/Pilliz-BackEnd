import { Module } from '@nestjs/common'
import { ApplicantsController } from './applicants.controller'
import { ApplicantService } from './applicants.service'

@Module({
  controllers: [ApplicantsController],
  providers: [ApplicantService],
})
export class ApplicantModule {}
