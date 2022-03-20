import { Injectable } from '@nestjs/common';
import { ResponseDto } from './dto/response-dto';
import { GithubDataDto } from './dto/github-data.dto';
//TODO data model for bitbucket data

@Injectable()
export class AppService {
  run(data: ResponseDto): any {
    const d = JSON.parse(JSON.stringify(data));
    return d;
    const configuration: GithubDataDto = {
      repositoryName: d.repository.id,
      branchName: d.ref,
      date: d.repository.updated_at,
    }
  }
}
