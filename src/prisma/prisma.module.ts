import { Global, Module } from '@nestjs/common'
import { PrismaService, PrismaServiceForGHA } from './prisma.service'

@Global()
@Module({
  providers: [
    {
      provide: PrismaService,
      useClass:
        process.env.NODE_ENV === 'gha' ? PrismaServiceForGHA : PrismaService,
    },
  ],
  exports: [PrismaService],
})
export class PrismaModule {}
