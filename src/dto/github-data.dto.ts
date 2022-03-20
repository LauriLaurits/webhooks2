import { IsString, IsDate, IsObject, IsNotEmptyObject } from 'class-validator';
import { GithubActorDto } from './github-actor.dto';

export class GithubDataDto {
  @IsString()
  repositoryName: string;
  @IsString()
  branchName: string;
  @IsDate()
  date: Date;
  @IsObject()
  @IsNotEmptyObject()
  actor: GithubActorDto;
}
