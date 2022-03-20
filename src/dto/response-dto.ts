import { IsString } from 'class-validator';

export class ResponseDto {
  @IsString()
  data: string;
}
