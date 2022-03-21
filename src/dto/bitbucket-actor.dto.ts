import { IsString, IsOptional } from 'class-validator';

export class BitbucketActorDto {
  @IsString()
  displayName: string;
  @IsString()
  username: string;
  @IsString()
  //@IsEmail()
  @IsOptional()
  email?: string;
  @IsString()
  id: string;
}
