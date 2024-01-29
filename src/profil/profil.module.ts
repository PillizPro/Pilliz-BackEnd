import { Module } from '@nestjs/common'
import { ProfilController } from './profil.controller'
import { ProfilService } from './profil.service'
import { FollowModule } from 'src/follow/follow.module'

@Module({
  imports: [FollowModule], // Ajoutez ImageUploadModule aux imports
  controllers: [ProfilController],
  providers: [ProfilService],
})
export class ProfilModule {}
