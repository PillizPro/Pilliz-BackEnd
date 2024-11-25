import { Module } from '@nestjs/common'
import { MailerService } from './mailer.service'
import { MailerController } from './mailer.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [MailerService, UserModule],
  exports: [MailerService],
  imports: [UserModule],
  controllers: [MailerController],
})
export class MailerModule {}
