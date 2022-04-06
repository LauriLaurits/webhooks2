import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
  ValidationError,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class CustomValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const object = plainToInstance(metadata.metatype, value);
    const errors = await validate(object);

    if (errors.length === 0) {
      return value;
    }

    throw new HttpException(
      { errors: this.formatErrors(errors) },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }

  // todo based on errors send emails with data
  formatErrors(errors: ValidationError[]) {
    return errors.reduce((acc, error) => {
      //ref
      //acc[error.property] = Object.values(error.constraints);
      //repository.name, repository.ssh_url, head_commit.timestamp, head_commit.id (together not working)
      //acc[error.property] = Object.values(error.children[0].constraints);
      //head_commit:author
      acc[error.property + ':' + error.children[0].children[0].property] =
        Object.values(error.children[0].children[0].constraints);

      console.log('REDUCE', acc);
      //console.log('ERROR', error);
      return acc;
    }, {});
  }
}
