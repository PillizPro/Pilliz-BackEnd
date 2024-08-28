import { Body, Controller, Post } from '@nestjs/common'
import {
  CreateCommentDto,
  ResponseCommentDto,
  DeleteCommentResponseDto,
  FetchCommentDto,
  FetchResponsesDto,
} from './dto'
import { CommentService } from './comment.service'
import { ApiTags } from '@nestjs/swagger'
import { CurrentUserId } from 'src/common/decorators'

@ApiTags('Commenting')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('commentingOnPost')
  async commentOnPost(
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUserId() userId: string
  ) {
    return await this.commentService.commentOnPost(createCommentDto, userId)
  }

  @Post('findCommentsOnPost')
  async findCommentsOnPost(
    @Body() fetchCommentDto: FetchCommentDto,
    @CurrentUserId() userId: string
  ) {
    return await this.commentService.findCommentsOnPost(fetchCommentDto, userId)
  }

  @Post('respondingOnComment')
  async respondOnComment(
    @Body() responseCommentDto: ResponseCommentDto,
    @CurrentUserId() userId: string
  ) {
    return await this.commentService.respondOnComment(
      responseCommentDto,
      userId
    )
  }

  @Post('findResponsesOnComment')
  async findReponsesToComment(
    @Body() fetchResponsesDto: FetchResponsesDto,
    @CurrentUserId() userId: string
  ) {
    return await this.commentService.findReponsesToComment(
      fetchResponsesDto,
      userId
    )
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
