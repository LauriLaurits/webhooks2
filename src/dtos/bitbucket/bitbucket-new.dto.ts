import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BitbucketDateDto } from './bitbucket-date.dto';

export class BitbucketNewDto {
  @ValidateNested()
  @Type(() => BitbucketDateDto)
  target: BitbucketDateDto;
}
