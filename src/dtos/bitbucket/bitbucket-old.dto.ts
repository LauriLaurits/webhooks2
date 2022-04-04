import { IsNotEmpty, IsString } from 'class-validator';

export class BitbucketOldDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
