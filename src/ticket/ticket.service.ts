import { Injectable } from '@nestjs/common'
import { TicketDto } from './dto/ticket.dto'
import { PrismaService } from 'src/prisma/prisma.service'
import { TicketCategory } from '@prisma/client'

@Injectable()
export class TicketService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllTickets() {
    return await this.prismaService.ticket.findMany()
  }

  async createTicket(ticket: TicketDto) {
    try {
      await this.prismaService.ticket.create({
        data: ticket,
      })
    } catch (error) {
      console.error(error)
      throw new Error('An error occurred when creating the ticket.')
    }
    return { message: 'Ticket successfully created.' }
  }

  async changeTicketStatus(ticketId: string) {
    try {
      await this.prismaService.ticket.update({
        where: { id: ticketId },
        data: { solved: true, solvedAt: new Date() },
      })
    } catch (error) {
      console.error(error)
      throw new Error('An error occurred when changing the ticket status.')
    }
    return { message: 'Ticket status successfully changed.' }
  }
}
