import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { TicketService } from './ticket.service'
import { TicketDto } from './dto/ticket.dto'
import { TicketResponseDto } from './dto/response.dto'

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

  @Post('changeTicketStatus/:ticketId')
  async changeTicketStatus(@Param('ticketId') ticketId: string) {
    return await this.ticketService.changeTicketStatus(ticketId)
  }

  @Post('addResponse')
  async addResponse(@Body() ticketResponse: TicketResponseDto) {
    return await this.ticketService.addResponse(ticketResponse)
  }

  @Get('getAllResponses')
  async getAllResponses() {
    return await this.ticketService.getAllResponses()
  }

  @Get('getALlResponsesByTicketId/:ticketId')
  async getTicketById(@Param('ticketId') ticketId: string) {
    return await this.ticketService.getALlResponsesByTicketId(ticketId)
  }
}
