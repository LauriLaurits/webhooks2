import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DateTime } from 'luxon';
import { ConfigurationDataDto } from './dto/configuration-data.dto';
import { mkdtempSync } from 'fs';
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
    let tmpDirName;
    let tmpDirNew;
    let cloneResult: ExecutionResultDto = null;
    //let getDataFromConfig: ExecutionResultDto = null;
    let switchBranch: ExecutionResultDto = null;

    try {
      tmpDir = mkdtempSync(join(tmpdir(), 'tempDir-'));
      tmpDirNew = tmpDir.replaceAll('\\', '/');
      this.logger.verbose(`Created new tmp directory ${tmpDir}`);
      tmpDirName = tmpDir.slice(tmpDir.lastIndexOf('\\')).replace('\\', '');
      cloneResult = await this.cloneRepository(runConfiguration, tmpDir);
      console.log(`Clone result: ${JSON.stringify(cloneResult)}`);
      // Siiamaani korras
      switchBranch = await this.checkoutBranch(
        runConfiguration,
        tmpDir,
        tmpDirName,
        tmpDirNew,
      );
      console.log(`Switched to : ${JSON.stringify(switchBranch)}`);
      /*getDataFromConfig = await this.getDataFromConfig(
        runConfiguration,
        tmpDir,
      );*/

      /*
      console.log(`COPY Result: ${JSON.stringify(getDataFromConfig)}`);
*/
    } catch (e) {
      this.logger.error(e);
    }
    /*if (existsSync(tmpDir)) {
      rmSync(tmpDir, {
        recursive: true,
      });
      this.logger.verbose(`Deleted tmp directory ${tmpDir}`);
      this.lastTaskStartedAt = null;
    }*/
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
  private async checkoutBranch(
    runConfiguration: ConfigurationDataDto,
    tmpDir: string,
    tmpDirName: string,
    tmpDirNew: string,
  ) {
    this.logger.verbose(`Switched to branch ${runConfiguration.branchName}`);

    this.logger.verbose(`Start:  ${tmpDir}`);
    this.logger.verbose(`Name:  ${tmpDirName}`);
    this.logger.verbose(`New:  ${tmpDirNew}`);
    await this.runCmd('cd', ['']);
    await this.runCmd('cd', [tmpDirNew]);
    this.logger.verbose(`Start git checkout ${runConfiguration.branchName}`);
    await this.runCmd('git', ['checkout', runConfiguration.branchName]);
    this.logger.verbose(`Start console log ${runConfiguration.branchName}`);
    //return require(tmpDir + '/build-config.js');
    console.log(
      'Url: ' +
        tmpDir +
        '/' +
        runConfiguration.repositoryName +
        '/build-config.js',
    );

    return this.runCmd('cp', [
      tmpDir + '/' + runConfiguration.repositoryName + '/build-config.js',
      tmpDir + '/bla.js',
    ]);
  }

  /* private async getDataFromConfig(
    runConfiguration: ConfigurationDataDto,
    tmpDir: string,
  ) {
    this.logger.verbose(`CD into project and get data config`);
    return ;*/
  //return this.runCmd('cp', ['build-config.js', 'copy.js']);
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  /*return require(tmpDir +
      '/' +
      runConfiguration.repositoryName +
      '/build-config.js');*/
}
