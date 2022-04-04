import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { GithubAuthorDto } from './github-author.dto';

export class GithubHeadCommitDto {
  @IsNotEmpty()
  @IsString()
  timestamp: string;

  @IsNotEmpty()
  @IsString()
  id: string;

  @ValidateNested()
  @Type(() => GithubAuthorDto)
  author: GithubAuthorDto;
}
