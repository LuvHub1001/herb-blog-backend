import { IsDateString, IsOptional, IsString, Length } from "class-validator";

export class CreateBoardDto {
  @IsOptional()
  @IsString()
  writer: string;

  @IsString()
  @Length(1, 200)
  title: string;

  @IsString()
  @Length(1, 50)
  subTitle: string;

  @IsString()
  @Length(1, 500000)
  content: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  subContent: string;

  @IsOptional()
  @IsString()
  @Length(0, 2000)
  thumbnail: string;

  @IsString()
  @Length(1, 50)
  category: string;

  @IsOptional()
  @IsDateString()
  workdate: Date;
}
