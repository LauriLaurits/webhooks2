import { IsNotEmpty, IsString } from 'class-validator';

export class BitbucketRepositoryDto {
  @IsNotEmpty()
  @IsString()
  full_name: string;
}
