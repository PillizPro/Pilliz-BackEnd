import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
// import { PostEntity } from './entities/post.entity'

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async recoveringTags() {
    const tags = await this.prisma.tags.findMany()
    tags.sort((a, b) => a.name.localeCompare(b.name))
    return tags.map((tag) => tag.name)
  }
}
