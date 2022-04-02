import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class BitbucketOldDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class BitbucketBranchNameDto {
  @ValidateNested()
  @Type(() => BitbucketOldDto)
  old: BitbucketOldDto;
}
