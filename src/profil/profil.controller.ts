import { Body, Controller, Post, Get, Param } from '@nestjs/common'
import { ChangeBioDto } from './dto/change-bio.dto'
import { UserFetchInfos } from './dto/other-user-infos.dto'
import { ProfilService } from './profil.service'
import { ApiTags } from '@nestjs/swagger'
import { ChangeProfilImgDto } from './dto/change-profil-img.dto'

@ApiTags('Profil')
@Controller('profil')
export class ProfilController {
  constructor(private readonly profilService: ProfilService) {}

  @Post('changebio')
  async changeBio(@Body() changeBioDto: ChangeBioDto) {
    return await this.profilService.changeBio(changeBioDto)
  }

  @Get('userBio/:userId')
  async getUserBio(@Param('userId') userId: string) {
    return await this.profilService.getBio(userId)
  }

  @Get('userNbPost/:userId')
  async getUserNumbersOfPost(@Param('userId') userId: string) {
    return await this.profilService.getNbPost(userId)
  }

  @Post('otherUsersInfos')
  async fetchUserInfos(@Body() userFetchInfos: UserFetchInfos) {
    return await this.profilService.fetchUserInfos(userFetchInfos)
  }

  @Post('changeProfilImg')
  async changeProfilImg(@Body() changeProfilImgDto: ChangeProfilImgDto) {
    return await this.profilService.changeProfilImage(changeProfilImgDto)
  }

  @Get('userProfilImg/:userId')
  async getUserProfilImg(@Param('userId') userId: string) {
    return await this.profilService.getUserProfilImg(userId)
  }
}
