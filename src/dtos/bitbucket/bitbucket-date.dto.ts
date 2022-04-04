import { IsDate, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class BitbucketDateDto {
  @IsNotEmpty()
  @IsDate({})
  date: Date;
}
