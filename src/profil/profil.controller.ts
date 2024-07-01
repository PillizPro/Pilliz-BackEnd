import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common'
import { ChangeBioDto } from './dto/change-bio.dto'
import { ProfilService } from './profil.service'
import { ApiTags } from '@nestjs/swagger'

// Dto
import { ChangeProfilImgDto } from './dto/change-profil-img.dto'
import { UploadFilesDto } from './dto/upload-files.dto'
import { CurrentUserId } from 'src/common/decorators'

@ApiTags('Profil')
@Controller('profil')
export class ProfilController {
  constructor(private readonly profilService: ProfilService) {}

  @Post('changeBio')
  async changeBio(
    @Body() changeBioDto: ChangeBioDto,
    @CurrentUserId() userId: string
  ) {
    return await this.profilService.changeBio(changeBioDto, userId)
  }

  @Get('userBio')
  async getUserBio(@CurrentUserId() userId: string) {
    return await this.profilService.getBio(userId)
  }

  @Get('userNbPost')
  async getUserNumbersOfPost(@CurrentUserId() userId: string) {
    return await this.profilService.getNbPost(userId)
  }

  @Get('otherUsersInfos/:userId')
  async fetchUserInfos(@Param('userId', new ParseUUIDPipe()) userId: string) {
    return await this.profilService.fetchUserInfos(userId)
  }

  @Post('changeProfilImg')
  async changeProfilImg(
    @Body() changeProfilImgDto: ChangeProfilImgDto,
    @CurrentUserId() userId: string
  ) {
    return await this.profilService.changeProfilImage(
      changeProfilImgDto,
      userId
    )
  }

  @Get('userProfilImg')
  async getUserProfilImg(@CurrentUserId() userId: string) {
    return await this.profilService.getUserProfilImg(userId)
  }

  @Post('uploadUserDocument')
  async uploadUserDocument(
    @Body() uploadFilesDto: UploadFilesDto,
    @CurrentUserId() userId: string
  ) {
    return await this.profilService.uploadUserDocument(uploadFilesDto, userId)
  }

  @Get('getUserDocuments')
  async getUserDocuments(@CurrentUserId() userId: string) {
    return await this.profilService.getUserDocuments(userId)
  }

  @Get('getIdentifyingPosts/:userId')
  async getIdentifyingPosts(
    @Param('userId', new ParseUUIDPipe()) userId: string
  ) {
    return await this.profilService.getIdentifyingPosts(userId)
  }

  @Get('getPostOnProfil')
  async getPostOnProfil(@CurrentUserId() userId: string) {
    return await this.profilService.getPostOnProfil(userId)
  }

  @Get('getCommentOnProfil')
  async getCommentOnProfile(@CurrentUserId() userId: string) {
    return await this.profilService.getCommentOnProfile(userId)
  }

  @Get('getLikeOnProfil')
  async getLikeOnProfile(@CurrentUserId() userId: string) {
    return await this.profilService.getLikeOnProfile(userId)
  }

  @Get('getRepostOnProfil')
  async getRepostOnProfile(@CurrentUserId() userId: string) {
    return await this.profilService.getRepostOnProfile(userId)
  }
}
