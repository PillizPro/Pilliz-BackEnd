import { Injectable } from '@nestjs/common'
import { TicketDto } from './dto/ticket.dto'
import { PrismaService } from 'src/prisma/prisma.service'
import { TicketResponseDto } from './dto/response.dto'
import { MailerService } from 'src/mailer/mailer.service'
import { SupportTicketEmail } from 'src/mailer/dto/mailer.dto'

@Injectable()
export class TicketService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailerService: MailerService
  ) {}

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
      const ticket = await this.prismaService.ticket.findUnique({
        where: { id: ticketId },
      })
      if (!ticket) {
        throw new Error('Ticket not found.')
      }
      if (ticket.solved) {
        await this.prismaService.ticket.update({
          where: { id: ticketId },
          data: { solved: false, solvedAt: null },
        })
      } else {
        await this.prismaService.ticket.update({
          where: { id: ticketId },
          data: { solved: true, solvedAt: new Date() },
        })
      }
    } catch (error) {
      console.error(error)
      throw new Error('An error occurred when changing the ticket status.')
    }
    return { message: 'Ticket status successfully changed.' }
  }

  async addResponse(ticketResponse: TicketResponseDto) {
    try {
      const createdReponse = await this.prismaService.ticketResponse.create({
        data: ticketResponse,
      })
      if (createdReponse) {
        const emailObject = new SupportTicketEmail()
        emailObject.response = ticketResponse.response
        const ticket = await this.prismaService.ticket.findUnique({
          where: { id: ticketResponse.ticketId },
        })
        if (!ticket) {
          throw new Error('Ticket not found.')
        }
        this.mailerService.sendMail(ticket.email, emailObject)
      }
    } catch (error) {
      console.error(error)
      throw new Error('An error occurred when adding the response.')
    }
    return { message: 'Response successfully added.' }
  }

  async getAllResponses() {
    return await this.prismaService.ticketResponse.findMany()
  }

  async getALlResponsesByTicketId(ticketId: string) {
    if (!ticketId) {
      throw new Error('Ticket ID is required.')
    }
    return await this.prismaService.ticketResponse.findMany({
      where: { ticketId },
    })
  }
}
