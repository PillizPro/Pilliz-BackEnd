import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator'
import { TicketCategory } from '@prisma/client'

export class TicketDto {
  @IsNotEmpty()
  @IsEnum(TicketCategory)
  readonly category: TicketCategory

  @IsNotEmpty()
  readonly description: string
}
