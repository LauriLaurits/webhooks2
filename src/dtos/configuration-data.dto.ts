import {
  IsDate,
  IsEmail,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { ConfigurationActorDataDto } from './configuration-actor-data.dto';
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

  @IsObject()
  @IsNotEmptyObject()
  actor: ConfigurationActorDataDto;
}
