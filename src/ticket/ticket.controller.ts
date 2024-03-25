import { Body, Controller, Get, Post } from '@nestjs/common'
import { TicketService } from './ticket.service'
import { TicketDto } from './dto/ticket.dto'

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get('getAllTickets')
  async getAllTickets() {
    return await this.ticketService.getAllTickets()
  }

  @Post('createTicket')
  async createTicket(@Body() createTicket: TicketDto) {
    return await this.ticketService.createTicket(createTicket)
  }

  @Post('changeTicketStatus')
  async changeTicketStatus(@Body('ticketId') ticketId: string) {
    return await this.ticketService.changeTicketStatus(ticketId)
  }
}
