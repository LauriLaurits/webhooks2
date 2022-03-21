import { Injectable, Logger } from '@nestjs/common';
import { GithubDataDto } from './dto/github-data.dto';
import { BitbucketDataDto } from './dto/bitbucket-data.dto';
import { TaskRunnerService } from './task-runner.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private readonly taskRunnerService: TaskRunnerService) {}

  getDataForGithub(body): string {
    const data: GithubDataDto = {
      repositoryName: body.repository.name,
      branchName: body.ref.replace('refs/heads/', ''),
      date: body.head_commit.timestamp,
      actor: {
        displayName: body.head_commit.author.name,
        username: body.head_commit.author.username,
        email: body.head_commit.author.email,
        id: body.head_commit.id,
      },
    };
    this.logger.verbose(
      `Getting data from Github username: ${data.actor.username}`,
    );
    return this.taskRunnerService.runTask(data);
  }

  getDataForBitbucket(body): string {
    const data: BitbucketDataDto = {
      repositoryName: body.repository.full_name,
      branchName: body.push.changes[0].old.name,
      date: body.push.changes[0].new.target.date,
      actor: {
        displayName: body.actor.display_name,
        username: body.actor.nickname,
        email: body.push.changes[0].commits[0].author.raw,
        id: body.actor.uuid,
      },
    };
    this.logger.verbose(
      `Getting data from Github username: ${data.actor.username}`,
    );
    return this.taskRunnerService.runTask(data);
  }
}
