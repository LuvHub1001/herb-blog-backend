import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from "class-validator";

export class UpdateBoardDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  writer?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  subTitle?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  subContent?: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsNumber()
  viewCount?: number;

  @IsOptional()
  @IsDate()
  workdate?: Date;
}
