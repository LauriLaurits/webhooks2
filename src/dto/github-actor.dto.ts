import { IsString, IsEmail, IsOptional } from 'class-validator';

export class GithubActorDto {
  @IsString()
  displayName: string;
  @IsString()
  username: string;
  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;
}
