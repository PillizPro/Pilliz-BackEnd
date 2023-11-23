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
    console.log(postId);
    return await this.commentService.findCommentsOnPost(postId)
  }




  // @Get('findallpost')
  // async findAllPosts() {
  //   return await this.postService.findAllPosts()
  // }

  // @Get('find20LastsPosts')
  // async find20LastsPosts() {
  //   return await this.postService.find20LastsPosts()
  // }

  // @Get('findPostInfo:id')
  // async findPostById(@Param('id') postId: string) {
  //   return await this.postService.findPostById(postId)
  // }

  // @Get('find20RecentsPosts:date')
  // async find20RecentsPosts(@Param('date') dateString: Date) {
  //   return await this.postService.find20RecentsPosts(dateString);
  // }

  // @Get('find20OlderPosts:date')
  // async find20OlderPosts(@Param('date') dateString: Date) {
  //   return await this.postService.find20OlderPosts(dateString);
  // }
}
