import { Injectable, Logger } from '@nestjs/common';
import { GithubDataDto } from './dto/github-data.dto';

@Injectable()
export class TaskRunnerService {
  private readonly logger = new Logger(this.constructor.name);

  constructor() {
    this.logger.verbose('TaskRunner initialized');
  }

  runTask(data: GithubDataDto): any {
    console.log(data);
    return data;
  }
}
