import { IsIP, IsOptional, IsString } from "class-validator";

export class CreateVisitorDto {
  @IsOptional()
  @IsString()
  ip: string;
}
