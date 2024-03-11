import { Module } from '@nestjs/common'
import { ProfilController } from './profil.controller'
import { ProfilService } from './profil.service'
import { FollowModule } from 'src/follow/follow.module'
import { ImageUploadModule } from 'src/image/image-upload.module'
import { DocumentUploadModule } from 'src/document/upload-document.module'


// imports: [ImageUploadModule], // Ajoutez ImageUploadModule aux imports
@Module({
  imports: [FollowModule, ImageUploadModule, DocumentUploadModule], // Ajoutez ImageUploadModule aux imports
  controllers: [ProfilController],
  providers: [ProfilService],
})
export class ProfilModule { }
