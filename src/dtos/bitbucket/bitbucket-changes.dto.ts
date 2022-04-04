import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BitbucketOldDto } from './bitbucket-old.dto';
import { BitbucketNewDto } from './bitbucket-new.dto';

export class BitbucketChangesDto {
  @ValidateNested()
  @Type(() => BitbucketOldDto)
  old: BitbucketOldDto;

  @ValidateNested()
  @Type(() => BitbucketNewDto)
  new: BitbucketNewDto;
}
