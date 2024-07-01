import { Module } from '@nestjs/common'
import { RepostController } from './repost.controller'
import { RepostService } from './repost.service'

@Module({
  controllers: [RepostController],
  providers: [RepostService],
  exports: [RepostService],
})
export class RepostModule {}
