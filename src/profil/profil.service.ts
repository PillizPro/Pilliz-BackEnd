import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { UserFetchInfos } from './dto/other-user-infos.dto'

// Services
import { FollowService } from 'src/follow/follow.service'
import { ImageUploadService } from 'src/image/image-upload.service'
import { DocumentUploadService } from 'src/document/upload-document.service'

// DTO
import { GetFilesDto } from './dto/get-files.dto'
import { UploadFilesDto } from './dto/upload-files.dto'
import { ChangeProfilImgDto } from './dto/change-profil-img.dto'
import { ChangeBioDto } from './dto/change-bio.dto'

@Injectable()
export class ProfilService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly followService: FollowService,
    private readonly imageService: ImageUploadService,
    private readonly docService: DocumentUploadService,
  ) { }


  async changeBio(changeBioDto: ChangeBioDto) {
    await this.prisma.users.update({
      where: { id: changeBioDto.id },
      data: { bio: changeBioDto.bio },
    })
  }

  async getBio(userId: string) {
    const user = await this.prisma.users.findFirst({
      where: {
        id: userId,
      },
    })
    return user?.bio
  }

  async getNbPost(userId: string) {
    const userPosts = await this.prisma.post.findMany({
      where: {
        userId: userId,
      },
    })
    return userPosts.length
  }

  async fetchUserInfos(userFetchInfos: UserFetchInfos) {
    const { userId } = userFetchInfos
    try {
      // Récupérer les posts récents originaux
      const userInfos = await this.prisma.users.findMany({
        where: {
          id: userId,
        },
        select: {
          email: true,
          name: true,
        },
      })

      const userBio = await this.getBio(userId)
      const userNbPosts = await this.getNbPost(userId)
      const userNbFollowers = await this.followService.getNbFollowers(userId)
      const userNbFollowings = await this.followService.getNbFollowing(userId)

      const informations = {
        email: userInfos[0]!.email,
        name: userInfos[0]!.name,
        bio: userBio,
        nbPosts: userNbPosts,
        nbFollowers: userNbFollowers,
        nbFollowings: userNbFollowings,
      }

      return informations
    } catch (error) {
      console.error(error)
      throw new Error('An error occurred when getting user infos')
    }
  }

  async changeProfilImage(changeProfilImageDto: ChangeProfilImgDto) {
    const { id, imgBytes } = changeProfilImageDto

    let imageUrl = ''
    if (imgBytes) {
      imageUrl = await this.imageService.uploadBase64Image(imgBytes)
    }

    await this.prisma.users.update({
      where: { id: id },
      data: { profilPicture: imageUrl },
    })

    return imageUrl;
  }

  async uploadUserDocument(uploadFilesDto: UploadFilesDto) {
    const { userId, docName, docBytes, docType } = uploadFilesDto

    let docUrl = ''
    if (docBytes) {
      docUrl = await this.imageService.uploadBase64Files(docBytes, docType)
    }

    return this.docService.uploadUserDocument(userId, docName, docUrl);
  }

  async getUserDocuments(userId: string) {
    return this.docService.getUserDocuments(userId);
  }

  async getUserProfilImg(userId: string) {
    const user = await this.prisma.users.findFirst({
      where: {
        id: userId,
      },
    })
    return user?.profilPicture
  }
}
