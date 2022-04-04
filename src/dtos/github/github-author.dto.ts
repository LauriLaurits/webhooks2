import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class GithubAuthorDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsEmail({
    allow_display_name: true,
  })
  email: string;
}
