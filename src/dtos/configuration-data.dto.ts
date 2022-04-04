import { IsDate, IsNotEmptyObject, IsObject, IsString } from 'class-validator';
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

  @IsObject()
  @IsNotEmptyObject()
  actor: ConfigurationActorDataDto;
}
