import { IsDefined, IsOptional } from 'class-validator'

enum MailerType {
  VALIDATION = 'validation',
  RESET = 'reset',
  CONTACT = 'contact',
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
