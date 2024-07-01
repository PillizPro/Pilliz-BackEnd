import { Module } from '@nestjs/common'
import { IdentificationController } from './identification.controller'
import { IdentificationService } from './identification.service'

// imports: [ImageUploadModule], // Ajoutez ImageUploadModule aux imports
@Module({
  controllers: [IdentificationController],
  providers: [IdentificationService],
  exports: [IdentificationService],
})
export class IdentificationModule {}
