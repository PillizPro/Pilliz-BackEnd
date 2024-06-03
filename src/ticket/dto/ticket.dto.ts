import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator'
import { TicketCategory } from '@prisma/client'

export class TicketDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string

  @IsNotEmpty()
  @IsEnum(TicketCategory)
  readonly category: TicketCategory

  @IsNotEmpty()
  readonly description: string

  @IsNotEmpty()
  readonly userId: string
}
