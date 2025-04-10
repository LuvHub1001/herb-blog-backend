import { IsDate, IsString, Length } from "class-validator";

export class CreateBoardDto {
  @IsString()
  @Length(1, 100)
  writer: string;

  @IsString()
  title: string;

  @IsString()
  @Length(1, 50)
  subTitle: string;

  @IsString()
  content: string;

  @IsString()
  subContent: string;

  @IsString()
  thumbnail: string;

  @IsString()
  category: string;

  @IsDate()
  workdate: Date;
}
