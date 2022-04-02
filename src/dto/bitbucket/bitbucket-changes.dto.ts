import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BitbucketBranchNameDto } from './bitbucket-branchname.dto';

export class BitbucketChangesDto {
  @ValidateNested()
  @Type(() => BitbucketBranchNameDto)
  changes: BitbucketBranchNameDto[];
}
