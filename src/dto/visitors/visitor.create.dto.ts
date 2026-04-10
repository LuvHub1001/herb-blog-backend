import { IsIP, IsOptional } from "class-validator";

export class CreateVisitorDto {
  @IsOptional()
  @IsIP()
  ip: string;
}
