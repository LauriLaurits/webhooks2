import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BitbucketAuthorDto } from './bitbucket-author.dto';

export class BitbucketCommitsDto {
  @ValidateNested()
  @Type(() => BitbucketAuthorDto)
  author: BitbucketAuthorDto;
}
