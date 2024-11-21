import { Controller,   Body, Post } from '@nestjs/common';
import { MailerDto } from './dto/mailer.dto'
import { MailerService } from './mailer.service'
import { ValidationEmail } from './dto/mailer.dto'

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post('sendVerificationMail')
  async sendVerificationMail(@Body() mail: string) {
    const emailObject = new ValidationEmail();
    return await this.mailerService.sendMail(mail, emailObject)
  }
}
