import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { GithubRepositoryDto } from './github-repository.dto';
import { GithubHeadCommitDto } from './github-headcommit.dto';

export class GithubPayloadDto {
  @IsNotEmpty()
  @IsString()
  ref: string;

  @ValidateNested({})
  @Type(() => GithubRepositoryDto)
  repository: GithubRepositoryDto;

  @ValidateNested({})
  @Type(() => GithubHeadCommitDto)
  head_commit: GithubHeadCommitDto;
}
