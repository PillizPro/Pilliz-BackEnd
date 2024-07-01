import { IsNotEmpty, IsString, IsOptional, IsArray } from 'class-validator'

export class CreateCompanyOfferDto {
  @IsNotEmpty()
  @IsString()
  readonly content: string

  @IsOptional()
  @IsArray()
  readonly tagsList?: Array<string>

  @IsNotEmpty()
  @IsString()
  readonly companyOfferTitle: string

  @IsNotEmpty()
  @IsString()
  readonly companyOfferDiploma: string

  @IsNotEmpty()
  @IsString()
  readonly companyOfferSkills: string

  @IsNotEmpty()
  @IsString()
  readonly companyOfferContractType: string

  @IsNotEmpty()
  @IsString()
  readonly companyOfferContractDuration: string

  @IsNotEmpty()
  @IsString()
  readonly companyOfferSalary: string
}
