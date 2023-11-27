import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { ChangeBioDto } from './dto/change-bio.dto'

@Injectable()
export class ProfilService {
  constructor(private prisma: PrismaService) { }

  async ChangeBio(changeBioDto: ChangeBioDto) {
    // Mise a jour de la bio avec la nouvelle
    await this.prisma.users.update({
      where: { id: changeBioDto.id },
      data: { bio: changeBioDto.bio },
    })
  }
}