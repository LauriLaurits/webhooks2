import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BitbucketChangesDto } from './bitbucket-changes.dto';

export class BitbucketPushDto {
  @ValidateNested()
  @Type(() => BitbucketChangesDto)
  changes: BitbucketChangesDto[];
}
