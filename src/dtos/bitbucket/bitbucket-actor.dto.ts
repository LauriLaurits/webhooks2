import { IsString, IsNotEmpty } from 'class-validator';

export class BitbucketActorDto {
  @IsNotEmpty()
  @IsString()
  display_name: string;

  @IsNotEmpty()
  @IsString()
  nickname: string;

  @IsNotEmpty()
  @IsString()
  uuid: string;
}
