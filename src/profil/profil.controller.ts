import { Body, Controller, Post, Get, Param, Injectable } from '@nestjs/common'
import { ChangeBioDto } from './dto/change-bio.dto'
import { ProfilService } from './profil.service'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Change Profil')
@Controller('profil')
export class ProfilController {
  constructor(private readonly profilService: ProfilService) { }

  @Post('changebio')
  async changeBio(@Body() changeBioDto: ChangeBioDto) {
    return await this.profilService.ChangeBio(changeBioDto)
  }
}