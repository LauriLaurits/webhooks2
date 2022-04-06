import { IsNotEmpty, IsString } from 'class-validator';

export class GithubRepositoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  ssh_url: string;
}
