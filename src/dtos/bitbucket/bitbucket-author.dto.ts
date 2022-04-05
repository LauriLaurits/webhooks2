import { IsEmail } from 'class-validator';

export class BitbucketAuthorDto {
  @IsEmail({ allow_display_name: true })
  raw: string;
}
