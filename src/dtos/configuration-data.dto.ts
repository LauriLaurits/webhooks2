import { IsDate, IsEmail, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ConfigurationDataDto {
  @IsString()
  repositoryName: string;

  @IsString()
  branchName: string;

  @IsString()
  sshUrl: string;

  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsOptional()
  @IsEmail({ allow_display_name: true })
  email?: string;

  @IsString()
  displayName: string;

  @IsString()
  username: string;

  @IsString()
  id: string;
}
