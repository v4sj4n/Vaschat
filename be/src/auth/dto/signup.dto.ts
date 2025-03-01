import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class SignUpDto {
  @IsOptional()
  name: string;
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
}
