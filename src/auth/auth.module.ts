import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UserModule } from 'src/user/user.module'
import { MailerService } from 'src/mailer/mailer.service'

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, MailerService],
})
export class AuthModule {}
