import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { TicketService } from './ticket.service'
import { TicketDto } from './dto/ticket.dto'
import { TicketResponseDto } from './dto/response.dto'
import { ApiBearerAuth } from '@nestjs/swagger'
import { CurrentUserId } from 'src/common/decorators'

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @ApiBearerAuth()
  @Get('getAllTickets')
  async getAllTickets() {
    return await this.ticketService.getAllTickets()
  }

  @ApiBearerAuth()
  @Post('createTicket')
  async createTicket(
    @CurrentUserId() userId: string,
    @Body() createTicket: TicketDto
  ) {
    return await this.ticketService.createTicket(createTicket, userId)
  }

  @ApiBearerAuth()
  @Post('changeTicketStatus')
  async changeTicketStatus(@Param('ticketId') ticketId: string) {
    return await this.ticketService.changeTicketStatus(ticketId)
  }

  @ApiBearerAuth()
  @Post('addResponse')
  async addResponse(
    @CurrentUserId() userId: string,
    @Body() ticketResponse: TicketResponseDto
  ) {
    return await this.ticketService.addResponse(ticketResponse, userId)
  }

  @ApiBearerAuth()
  @Get('getAllResponses')
  async getAllResponses() {
    return await this.ticketService.getAllResponses()
  }

  @ApiBearerAuth()
  @Get('getALlResponsesByTicketId/:ticketId')
  async getTicketById(@Param('ticketId') ticketId: string) {
    return await this.ticketService.getALlResponsesByTicketId(ticketId)
  }
}
