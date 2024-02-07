import { Body, Controller, Post, Get, Param } from '@nestjs/common'
import { CreateCommentDto } from './dto/create-comment.dto'
import { ResponseCommentDto } from './dto/response-comment.dto'

import { DeleteCommentResponseDto } from './dto/delete-comment-response.dto'

import { CommentService } from './comment.service'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Commenting')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('commentingOnPost')
  async commentOnPost(@Body() createCommentDto: CreateCommentDto) {
    return await this.commentService.commentOnPost(createCommentDto)
  }

  @Get('findCommentsOnPost:id')
  async findCommentsOnPost(@Param('id') postId: string) {
    return await this.commentService.findCommentsOnPost(postId)
  }

  @Post('respondingOnComment')
  async respondOnComment(@Body() responseCommentDto: ResponseCommentDto) {
    return await this.commentService.respondOnComment(responseCommentDto)
  }

  @Get('findResponsesOnComment:id')
  async findReponsesToComment(@Param('id') commentId: string) {
    return await this.commentService.findReponsesToComment(commentId)
  }

  @Post('deletingCommentOrResponse')
  async deleteCommentOrReponse(
    @Body() deleteCommentOrReponse: DeleteCommentResponseDto
  ) {
    return await this.commentService.deleteCommentOrReponse(
      deleteCommentOrReponse
    )
  }
}
