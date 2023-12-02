import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { ChangeBioDto } from './dto/change-bio.dto'

@Injectable()
export class ProfilService {
  constructor(private prisma: PrismaService) { }

  async changeBio(changeBioDto: ChangeBioDto) {
    await this.prisma.users.update({
      where: { id: changeBioDto.id },
      data: { bio: changeBioDto.bio },
    })
  }

  async getBio(userId: string) {
    const user = await this.prisma.users.findFirst({
      where: {
        id: userId,
      }
    })
    return user?.bio
  }

  async getNbPost(userId: string) {
    const userPosts = await this.prisma.post.findMany({
      where: {
        userId: userId,
      }
    })
    return userPosts.length;
  }
}