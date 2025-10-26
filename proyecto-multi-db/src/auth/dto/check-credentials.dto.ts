import { IsNotEmpty, IsString } from 'class-validator';

export class CheckCredentialsDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}