import { Module } from '@nestjs/common'
import { ProfilController } from './profil.controller'
import { ProfilService } from './profil.service'
import { FollowModule } from 'src/follow/follow.module'
import { ImageUploadModule } from 'src/image/image-upload.module'
import { DocumentUploadModule } from 'src/document/upload-document.module'
import { IdentificationModule } from 'src/identification/identification.module'
import { LikeModule } from 'src/like/like.module'
import { RepostModule } from 'src/repost/repost.module'

// imports: [ImageUploadModule], // Ajoutez ImageUploadModule aux imports
@Module({
  imports: [
    FollowModule,
    ImageUploadModule,
    DocumentUploadModule,
    IdentificationModule,
    LikeModule,
    RepostModule,
  ],
  controllers: [ProfilController],
  providers: [ProfilService],
})
export class ProfilModule {}
