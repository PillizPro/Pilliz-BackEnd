import { Controller, Body, Post } from '@nestjs/common'
import { MailerService } from './mailer.service'
import { MailerResend } from './dto/mailer.dto'

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post('sendVerificationMail')
  async sendVerificationMail(@Body() mailerDto: MailerResend) {
    return await this.mailerService.sendVerificationMail(mailerDto.email)
  }
}
