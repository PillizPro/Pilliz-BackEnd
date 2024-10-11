import { Module } from '@nestjs/common'
import { AchievementsController } from './achievements.controller'
import { AchievementsService } from './achievements.service'
import { FollowModule } from 'src/follow/follow.module'
import { ImageUploadModule } from 'src/image/image-upload.module'
import { DocumentUploadModule } from 'src/document/upload-document.module'
import { IdentificationModule } from 'src/identification/identification.module'
import { LikeModule } from 'src/like/like.module'
import { RepostModule } from 'src/repost/repost.module'

@Module({
  imports: [
    FollowModule,
    ImageUploadModule,
    DocumentUploadModule,
    IdentificationModule,
    LikeModule,
    RepostModule,
  ],
  controllers: [AchievementsController],
  providers: [AchievementsService],
})
export class AchievementsModule {}
