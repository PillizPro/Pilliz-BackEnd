import { IsDefined, IsOptional } from 'class-validator'

enum MailerType {
  VALIDATION = 'validation',
  TICKER_SUPPORT = 'ticket_support',
}

export class MailerDto {
  @IsDefined()
  readonly type!: MailerType

  @IsDefined()
  readonly subject!: string

  @IsDefined()
  readonly template!: string

  @IsOptional()
  readonly name?: string

  @IsOptional()
  readonly code?: number

  @IsOptional()
  readonly response?: string
}

export class MailerResend {
  @IsDefined()
  readonly email!: string
}

export class ValidationEmail implements MailerDto {
  type = MailerType.VALIDATION
  subject = 'Pilliz - Email Verification'
  template = 'verif'
  name!: string
  code!: number
}

export class SupportTicketEmail implements MailerDto {
  type = MailerType.TICKER_SUPPORT
  subject = 'Pilliz - Support Ticket'
  template = 'ticket-support'
  response!: string
}

export function mailOptionsMaker(mail: string, typeMail: MailerDto): any {
  const mailOptions = {
    from: 'tiktoktest531@gmail.com',
    to: mail,
    template: typeMail.template,
    subject: typeMail.subject,
    context: {},
  }

  if (typeMail.type === MailerType.VALIDATION) {
    mailOptions.context = {
      name: typeMail.name,
      code: typeMail.code,
    }
  }

  if (typeMail.type === MailerType.TICKER_SUPPORT) {
    mailOptions.context = {
      response: typeMail.response,
    }
  }

  return mailOptions
}
