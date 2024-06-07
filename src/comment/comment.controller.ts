import { Body, Controller, Post } from '@nestjs/common'
import { CreateCommentDto } from './dto/create-comment.dto'
import { ResponseCommentDto } from './dto/response-comment.dto'
import { DeleteCommentResponseDto } from './dto/delete-comment-response.dto'
import { FetchCommentDto } from './dto/fetch-comment.dto'
import { FetchResponsesDto } from './dto/fetch-responses.dto'

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

  @Post('findCommentsOnPost')
  async findCommentsOnPost(@Body() fetchCommentDto: FetchCommentDto) {
    return await this.commentService.findCommentsOnPost(fetchCommentDto)
  }

  @Post('respondingOnComment')
  async respondOnComment(@Body() responseCommentDto: ResponseCommentDto) {
    return await this.commentService.respondOnComment(responseCommentDto)
  }

  @Post('findResponsesOnComment')
  async findReponsesToComment(@Body() fetchResponsesDto: FetchResponsesDto) {
    return await this.commentService.findReponsesToComment(fetchResponsesDto)
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
