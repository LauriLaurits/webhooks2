import { IsString, IsDate, IsObject, IsNotEmptyObject } from 'class-validator';
import { BitbucketActorDto } from './bitbucket-actor.dto';

export class BitbucketDataDto {
  @IsString()
  repositoryName: string;
  @IsString()
  branchName: string;
  @IsDate()
  date: Date;
  @IsObject()
  @IsNotEmptyObject()
  actor: BitbucketActorDto;
}
