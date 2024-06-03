import { Injectable } from '@nestjs/common'
import * as nodemailer from 'nodemailer'
import * as hbs from 'nodemailer-express-handlebars'
import { MailerDto, mailOptionsMaker } from './dto/mailer.dto'

@Injectable()
export class MailerService {
  async sendMail(mail: string, typeMail: MailerDto) {
    console.log(typeMail)
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
    console.log(mailOptions)
    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        throw new Error('An error occured when sending the email')
      } else {
        return { message: 'Email successfully sent.' }
      }
    })
  }
}
