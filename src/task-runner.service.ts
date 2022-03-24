import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DateTime } from 'luxon';
import { ConfigurationDataDto } from './dto/configuration-data.dto';
import { existsSync, mkdtempSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import {
  ChildProcessWithoutNullStreams,
  spawn,
  SpawnOptionsWithoutStdio,
} from 'child_process';
import { ExecutionResultDto } from './dto/execution-result.dto';

@Injectable()
export class TaskRunnerService {
  private readonly logger = new Logger(this.constructor.name);
  private readonly queue: ConfigurationDataDto[] = [];
  private lastTaskStartedAt: DateTime = null;
  private runningProcess: ChildProcessWithoutNullStreams;

  constructor() {
    this.logger.verbose('TaskRunner initialized');
  }

  //Adds task to queue
  addTaskQueue(runConfiguration: ConfigurationDataDto): number {
    console.log('AddTaskQueue json: ' + JSON.stringify(runConfiguration));
    return this.queue.push(runConfiguration);
  }

  // CRON after every X minutes checks if there is something in the queue. If Yes then starts runTask().
  @Cron('* * * * *')
  async handleCron() {
    // If queue is empty do nothing.
    if (this.queue.length === 0) {
      //console.log(`Queue length:  ${this.queue.length}`);
      return;
    }
    if (this.lastTaskStartedAt !== null) {
      this.logger.verbose(
        `Task already in progress. Cant run another ${this.lastTaskStartedAt.toISO()} . Queue length:  ${
          this.queue.length
        }`,
      );
      return;
    }
    //If there is something in queue and another task is not running start another task.
    if (this.queue.length !== 0) {
      await this.runTask(this.queue.shift());
    }
  }

  private async runTask(runConfiguration: ConfigurationDataDto) {
    this.lastTaskStartedAt = DateTime.now();
    this.logger.verbose(
      `Started runTask() with configuration: ${JSON.stringify(
        runConfiguration,
      )}`,
    );
    // Created empty directory to "AppData\Local\Temp\*"
    let tmpDir;
    let cloneResult: ExecutionResultDto = null;

    try {
      tmpDir = mkdtempSync(join(tmpdir(), 'tempDir-'));
      this.logger.verbose(`Created new tmp directory ${tmpDir}`);
      cloneResult = await this.cloneRepository(runConfiguration, tmpDir);
      //console.log(`${tmpDir.name}/build-config.js`);

      console.log(`Clone result: ${JSON.stringify(cloneResult)}`);
    } catch (e) {
      this.logger.error(e);
    }
    if (existsSync(tmpDir)) {
      rmSync(tmpDir, {
        recursive: true,
      });
      this.logger.verbose(`Deleted tmp directory ${tmpDir}`);
      this.lastTaskStartedAt = null;
    }
  }

  private async runCmd(
    cmd: string,
    args: string[],
    options: SpawnOptionsWithoutStdio = {},
  ): Promise<ExecutionResultDto> {
    return new Promise((resolve, reject) => {
      this.runningProcess = spawn(cmd, args, options);
      let stdout = '';
      this.runningProcess.stdout.on(
        'data',
        (data) => (stdout += data.toString()),
      );

      let stderr = '';
      this.runningProcess.stderr.on(
        'data',
        (data) => (stderr += data.toString()),
      );
      this.runningProcess.on('exit', (code) => {
        if (code !== 0) {
          return reject({
            stdout,
            stderr,
            code,
          });
        }
        resolve({
          stdout,
          stderr,
          code,
        });
      });
    });
  }
  //Clone Repository to temp folder
  private async cloneRepository(
    runConfiguration: ConfigurationDataDto,
    tmpDir: string,
  ) {
    console.log(`Clone Url:  ${runConfiguration.sshUrl}`);
    return this.runCmd('git', ['clone', runConfiguration.sshUrl, tmpDir]);
  }
}
