import {
  IsDate,
  IsEmail,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { ConfigurationActorDataDto } from './configuration-actor-data.dto';

export class ConfigurationDataDto {
  @IsString()
  repositoryName: string;

  @IsString()
  branchName: string;

  @IsString()
  sshUrl: string;

  @IsDate()
  date: Date;

  @IsOptional()
  @IsEmail({ allow_display_name: true })
  email?: string;

  @IsObject()
  @IsNotEmptyObject()
  actor: ConfigurationActorDataDto;
}
