import { Module } from '@nestjs/common'
import { ProfilController } from './profil.controller'
import { ProfilService } from './profil.service'
import { FollowModule } from 'src/follow/follow.module'
import { ImageUploadModule } from 'src/image/image-upload.module'
import { DocumentUploadModule } from 'src/document/upload-document.module'
import { IdentificationModule } from 'src/identification/identification.module'

// imports: [ImageUploadModule], // Ajoutez ImageUploadModule aux imports
@Module({
  imports: [
    FollowModule,
    ImageUploadModule,
    DocumentUploadModule,
    IdentificationModule,
  ],
  controllers: [ProfilController],
  providers: [ProfilService],
})
export class ProfilModule {}
