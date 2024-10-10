import { Module } from '@nestjs/common'
import { TicketController } from './ticket.controller'
import { TicketService } from './ticket.service'
import { MailerModule } from 'src/mailer/mailer.module'

@Module({
  imports: [MailerModule],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule {}
