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
}

export class ValidationEmail implements MailerDto {
  type = MailerType.VALIDATION
  subject = 'Pilliz - Email Verification'
  template = 'verif'
  name!: string
  code!: number
}

export class SupportTicketEmaul implements MailerDto {
  type = MailerType.TICKER_SUPPORT
  subject = 'Pilliz - Support Ticket'
  template = 'ticket-support'
  name!: string
  response!: string
}

export function mailOptionsMaker(mail: string, typeMail: MailerDto): any {
  const mailOptions = {
    from: 'pillizpro@gmail.com',
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
  return mailOptions
}
