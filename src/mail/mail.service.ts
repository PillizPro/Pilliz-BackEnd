import { Injectable } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(email: string, name: string, token: string) {
    const url = `http://localhost:3000/api/v1/auth/verify?token=${token}&email=${email}`

    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to Pilliz! Confirm your Email',
      template: './confirmation',
      context: {
        name: name,
        url,
      },
    })
  }
}
