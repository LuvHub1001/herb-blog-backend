import {
  IsDateString,
  IsOptional,
  IsString,
  Length,
} from "class-validator";

export class UpdateBoardDto {
  @IsOptional()
  @IsString()
  @Length(1, 200)
  title?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  subTitle?: string;

  @IsOptional()
  @IsString()
  @Length(1, 500000)
  content?: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  subContent?: string;

  @IsOptional()
  @IsString()
  @Length(0, 2000)
  thumbnail?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  category?: string;

  @IsOptional()
  @IsDateString()
  workdate?: Date;
}
