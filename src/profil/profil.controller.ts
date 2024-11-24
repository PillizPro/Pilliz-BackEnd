import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common'
import {
  ChangeBioDto,
  ChangeProfilImgDto,
  UploadFilesDto,
  DeletedFilesDto,
  OtherUserProfilIdDto,
} from './dto'

import { CurrentUserId } from 'src/common/decorators'
import { ProfilService } from './profil.service'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

@ApiBearerAuth()
@ApiTags('Profil')
@Controller('profil')
export class ProfilController {
  constructor(private readonly profilService: ProfilService) { }

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

  @Get('userNbInterractions')
  async getUserNbInterractions(@CurrentUserId() userId: string) {
    return await this.profilService.getNbInterractions(userId)
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

  @Post('deleteUserDocument')
  async deleteUserDocument(
    @Body() deletedFilesDto: DeletedFilesDto,
    @CurrentUserId() userId: string
  ) {
    return await this.profilService.deleteUserDocument(deletedFilesDto, userId)
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

  @Post('getPostOnProfil')
  async getPostOnProfil(
    @Body() otherUserProfilIdDto: OtherUserProfilIdDto,
    @CurrentUserId() userId: string
  ) {
    return await this.profilService.getPostOnProfil(
      otherUserProfilIdDto,
      userId
    )
  }

  @Post('getCommentOnProfil')
  async getCommentOnProfile(
    @Body() otherUserProfilIdDto: OtherUserProfilIdDto,
    @CurrentUserId() userId: string
  ) {
    return await this.profilService.getCommentOnProfile(
      otherUserProfilIdDto,
      userId
    )
  }

  @Post('getLikeOnProfil')
  async getLikeOnProfile(
    @Body() otherUserProfilIdDto: OtherUserProfilIdDto,
    @CurrentUserId() userId: string
  ) {
    return await this.profilService.getLikeOnProfile(
      otherUserProfilIdDto,
      userId
    )
  }

  @Post('getRepostOnProfil')
  async getRepostOnProfile(
    @Body() otherUserProfilIdDto: OtherUserProfilIdDto,
    @CurrentUserId() userId: string
  ) {
    return await this.profilService.getRepostOnProfile(
      otherUserProfilIdDto,
      userId
    )
  }

  @Post('getPostMediaOnProfil')
  async getPostMediaOnProfil(
    @Body() otherUserProfilIdDto: OtherUserProfilIdDto,
    @CurrentUserId() userId: string
  ) {
    return await this.profilService.getPostMediaOnProfil(
      otherUserProfilIdDto,
      userId
    )
  }

  @Post('getPrivateOnProfil')
  async getPrivateOnProfil(
    @Body() otherUserProfilIdDto: OtherUserProfilIdDto,
    @CurrentUserId() userId: string
  ) {
    return await this.profilService.getPrivateOnProfil(
      otherUserProfilIdDto,
      userId
    )
  }

  @Get('changeAccountType')
  async changeAccountType(@CurrentUserId() userId: string) {
    return await this.profilService.changeAccountType(userId)
  }
}
