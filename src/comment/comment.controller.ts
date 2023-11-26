import { Body, Controller, Post, Get, Param } from '@nestjs/common'
import { CreateCommentDto } from './dto/create-comment.dto'
import { CommentService } from './comment.service'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Commenting')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @Post('commentingOnPost')
  async commentOnPost(@Body() createCommentDto: CreateCommentDto) {
    return await this.commentService.commentOnPost(createCommentDto)
  }

  @Get('findCommentsOnPost:id')
  async findCommentsOnPost(@Param('id') postId: string) {
    return await this.commentService.findCommentsOnPost(postId)
  }
}
