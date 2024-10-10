import { Controller, Get } from '@nestjs/common'
import { TagsService } from './tags.service'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Tags')
@Controller('tag')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get('recoveringAllTags')
  async recoveringTags() {
    return await this.tagsService.recoveringTags()
  }
}
