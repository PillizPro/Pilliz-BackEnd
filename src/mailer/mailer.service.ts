import { Injectable } from '@nestjs/common'
import * as nodemailer from 'nodemailer'
import * as hbs from 'nodemailer-express-handlebars'
import { MailerDto, mailOptionsMaker } from './dto/mailer.dto'
import { UserService } from 'src/user/user.service'
import { ValidationEmail } from 'src/mailer/dto/mailer.dto';

@Injectable()
export class MailerService {
  constructor(private readonly userService: UserService) {}

  async sendVerificationMail(mail: string) {
    const user = await this.userService.findByEmail({ email: mail })

    if (!user) {
      throw new Error('User not found')
    }
    const code = user.codeVerification

    const emailObject = new ValidationEmail();
    emailObject.name = user.name;
    emailObject.code = parseInt(code);
    await this.sendMail(mail, emailObject)
  }

  async sendMail(mail: string, typeMail: MailerDto) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    })

    transporter.use(
      'compile',
      hbs({
        viewEngine: {
          extname: '.handlebars',
          partialsDir: 'src/mailer/template',
          layoutsDir: 'src/mailer/template',
          defaultLayout: '',
        },
        viewPath: 'src/mailer/template',
        extName: '.handlebars',
      })
    )
    
    const mailOptions = mailOptionsMaker(mail, typeMail)

    transporter.sendMail(mailOptions, (err: Error) => {
      if (err) {
        console.error('Error sending email:', err);
        throw new Error('An error occured when sending the email')
      } else {
        return { message: 'Email successfully sent.' }
      }
    })
  }
}
