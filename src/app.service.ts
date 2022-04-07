import { Injectable, Logger } from '@nestjs/common';
import { TaskRunnerService } from './task-runner.service';
import { ConfigurationDataDto } from './dtos/configuration-data.dto';
import { GithubPayloadDto } from './dtos/github/github-payload.dto';
import { BitbucketPayloadDto } from './dtos/bitbucket/bitbucket-payload.dto';

@Injectable()
export class AppService {
  private readonly logger = new Logger(this.constructor.name, {
    timestamp: true,
  });

  constructor(private readonly taskRunnerService: TaskRunnerService) {}
  webhookGithub(body: GithubPayloadDto): number {
    const configurationDataDto: ConfigurationDataDto = {
      repositoryName: body.repository.name,
      branchName: body.ref.replace('refs/heads/', ''),
      sshUrl: body.repository.ssh_url,
      date: body.head_commit.timestamp,
      email: body.head_commit.author.email,
      displayName: body.head_commit.author.name,
      username: body.head_commit.author.username,
      id: body.head_commit.id,
    };
    this.logger.verbose(
      `Getting data from Github username: ${configurationDataDto.username}`,
    );
    return this.taskRunnerService.addTaskQueue(configurationDataDto);
  }

  webhookBitbucket(body: BitbucketPayloadDto): number {
    const sshUrl = `git@bitbucket.org:${body.repository.full_name}.git`;

    const configurationDataDto: ConfigurationDataDto = {
      repositoryName: body.repository.full_name,
      branchName: body.push.changes[0].old.name,
      sshUrl: sshUrl,
      date: body.push.changes[0].new.target.date,
      email: body.push.changes[0].commits[0].author.raw,
      displayName: body.actor.display_name,
      username: body.actor.nickname,
      id: body.actor.uuid,
    };

    this.logger.verbose(
      `Getting data from Bitbucket username: ${configurationDataDto.username}`,
    );

    return this.taskRunnerService.addTaskQueue(configurationDataDto);
  }
}
