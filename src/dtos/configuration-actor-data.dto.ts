import { IsString } from 'class-validator';

export class ConfigurationActorDataDto {
  @IsString()
  displayName: string;

  @IsString()
  username: string;

  @IsString()
  id: string;
}
