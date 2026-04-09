import { IsString, Length } from "class-validator";

export class LoginDto {
  @IsString()
  @Length(1, 50)
  id: string;

  @IsString()
  @Length(1, 100)
  password: string;
}
