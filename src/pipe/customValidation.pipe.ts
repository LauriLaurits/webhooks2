import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class CustomValidationPipe implements PipeTransform {
  private readonly logger = new Logger(this.constructor.name, {
    timestamp: true,
  });
  async transform(value: any, metadata: ArgumentMetadata) {
    const object = plainToInstance(metadata.metatype, value);
    const errors = await validate(object);

    if (errors.length === 0) {
      return value;
    }
    //todo send email if payload fails
    this.logger.error(`Errors in payload`);
    throw new HttpException({ errors }, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
