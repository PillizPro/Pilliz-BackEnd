import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreatePostDto {
  @IsNotEmpty()
  readonly userId: string

  @IsNotEmpty()
  readonly content: string

  @IsOptional()
  @IsString()
  readonly imageBase64?: string

  @IsOptional()
  @IsArray()
  readonly tagsList?: Array<string>
}

export class CreateCompanyPostDto {
  @IsNotEmpty()
  readonly userId: string

  @IsNotEmpty()
  readonly content: string

  @IsOptional()
  @IsString()
  readonly imageBase64?: string

  @IsOptional()
  @IsArray()
  readonly tagsList?: Array<string>

  @IsNotEmpty()
  readonly isCompanyOffer: boolean

  @IsNotEmpty()
  readonly companyOfferTitle: string

  @IsNotEmpty()
  readonly companyOfferDiploma: string

  @IsNotEmpty()
  readonly companyOfferSkills: string

  @IsNotEmpty()
  readonly companyOfferContractType: string

  @IsNotEmpty()
  readonly companyOfferContractDuration: string

  @IsNotEmpty()
  readonly companyOfferSalary: string
}
