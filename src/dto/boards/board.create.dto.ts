import { IsDateString, IsNumber, IsOptional, IsString, Length } from "class-validator";

export class CreateBoardDto {
  @IsOptional()
  @IsString()
  writer: string;

  @IsString()
  title: string;

  @IsString()
  @Length(1, 50)
  subTitle: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  subContent: string;

  @IsOptional()
  @IsString()
  thumbnail: string;

  @IsString()
  category: string;

  @IsOptional()
  @IsNumber()
  viewCount: number;

  @IsOptional()
  @IsDateString()
  workdate: Date;
}
