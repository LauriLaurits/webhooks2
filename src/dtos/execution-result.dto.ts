import { IsString, IsNumber } from 'class-validator';

export class ExecutionResultDto {
  @IsNumber()
  code: number;

  @IsString()
  stdout: string;

  @IsString()
  stderr: string;
}
