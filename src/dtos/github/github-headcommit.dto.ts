import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { GithubAuthorDto } from './github-author.dto';

export class GithubHeadCommitDto {
  @IsNotEmpty()
  @Type(() => Date)
  timestamp: Date;

  @IsNotEmpty()
  @IsString()
  id: string;

  @ValidateNested()
  @Type(() => GithubAuthorDto)
  author: GithubAuthorDto;
}
