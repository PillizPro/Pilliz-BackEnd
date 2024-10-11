import { IsNotEmpty, IsNumber, IsString, IsBoolean, IsArray, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsOptional()
  @IsBoolean()
  isFavourite?: boolean;

  @IsOptional()
  @IsBoolean()
  isPopular?: boolean;

  @IsOptional()
  @IsBoolean()
  isAddedToCart?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ProductTags?: string[]; // Liste optionnelle des tags pour le produit
}
