import { IsNotEmpty, IsString } from 'class-validator';

export class BitbucketFullNameDto {
  @IsNotEmpty()
  @IsString()
  full_name: string;
}
