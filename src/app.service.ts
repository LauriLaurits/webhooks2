import { Injectable, Logger } from '@nestjs/common';
import { TaskRunnerService } from './task-runner.service';
import { ConfigurationDataDto } from './dto/configuration-data.dto';

@Injectable()
export class AppService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private readonly taskRunnerService: TaskRunnerService) {}
  //Getting only needed data
  getDataFromGithub(body): number {
    const data: ConfigurationDataDto = {
      repositoryName: body.repository.name,
      branchName: body.ref.replace('refs/heads/', ''),
      sshUrl: body.repository.ssh_url,
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
    return this.taskRunnerService.addTaskQueue(data);
  }
  //Getting only needed data
  getDataFromBitbucket(body): number {
    const sshUrl = `git@bitbucket.org:${body.repository.full_name}.git`;
    const rawEmail = body.push.changes[0].commits[0].author.raw;
    const email = rawEmail
      .slice(rawEmail.indexOf(' <'), rawEmail.lastIndexOf('>'))
      .replace(' <', '');

    const data: ConfigurationDataDto = {
      repositoryName: body.repository.full_name,
      branchName: body.push.changes[0].old.name,
      sshUrl: sshUrl,
      date: body.push.changes[0].new.target.date,
      actor: {
        displayName: body.actor.display_name,
        username: body.actor.nickname,
        email: email,
        id: body.actor.uuid,
      },
    };
    this.logger.verbose(
      `Getting data from Github username: ${data.actor.username}`,
    );
    return this.taskRunnerService.addTaskQueue(data);
  }
}
