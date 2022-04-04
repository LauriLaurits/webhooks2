import { IsString, IsEmail, IsOptional } from 'class-validator';

export class ConfigurationActorDataDto {
  @IsString()
  displayName: string;

  @IsString()
  username: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  id: string;
}
