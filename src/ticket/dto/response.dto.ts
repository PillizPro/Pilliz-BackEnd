import { IsString, IsNotEmpty } from 'class-validator'

export class TicketResponseDto {
  @IsNotEmpty()
  @IsString()
  ticketId: string
  @IsNotEmpty()
  @IsString()
  response: string
}
