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
  private readonly logger = new Logger(this.constructor.name, {
    timestamp: true,
  });
  private readonly queue: ConfigurationDataDto[] = [];
  private lastTaskStartedAt: DateTime = null;
  private runningProcess: ChildProcessWithoutNullStreams;

  constructor() {
    this.logger.verbose('TaskRunner initialized');
  }

  addTaskQueue(runConfiguration: ConfigurationDataDto): number {
    this.logger.verbose(
      `Added task to queue with configuration: ${JSON.stringify(
        runConfiguration,
      )}`,
    );
    return this.queue.push(runConfiguration);
  }

  @Cron('*/1 * * * * *') // for testing
  async handleCron() {
    if (this.queue.length === 0) {
      return;
    }

    if (this.lastTaskStartedAt !== null) {
      this.logger.verbose(
        `Task already in progress. Can't run another ${this.lastTaskStartedAt.toISO()} . Queue length:  ${
          this.queue.length
        }`,
      );
      return;
    }

    if (this.queue.length !== 0) {
      await this.runTask(this.queue.shift());
    }
  }

  private async runTask(runConfiguration: ConfigurationDataDto) {
    this.lastTaskStartedAt = DateTime.now();
    this.logger.verbose(
      `Started to run task with configuration: ${JSON.stringify(
        runConfiguration,
      )}`,
    );

    let tmpDir;
    let cloneResult: ExecutionResultDto = null;
    let switchBranch: ExecutionResultDto = null;
    let buildConfig;
    //TODO checks if /build-config.js is there if not clean tmpDir
    try {
      tmpDir = this.makeTemporaryDirectory();
      cloneResult = await this.cloneRepository(runConfiguration, tmpDir);
      switchBranch = await this.checkoutBranch(runConfiguration, tmpDir);
      buildConfig = this.getBuildConfig(tmpDir);
      //TODO execute build commands
      console.log('BuildConfig clientName: ' + buildConfig.clientName);
      console.log('BuildConfig projectName: ' + buildConfig.projectName);
      console.log('BuildConfig BuildDirectory: ' + buildConfig.buildDirectory);
      console.log(
        'BuildConfig NpmBuildCommand: ' + buildConfig.npmBuildCommand,
      );
      console.log(
        'BuildConfig branchesToFollow: ' + buildConfig.branchesToFollow,
      );
      console.log(`Clone result: ${JSON.stringify(cloneResult)}`);
      console.log(`Switched to : ${JSON.stringify(switchBranch)}`);
    } catch (e) {
      this.logger.error(e);
    }
    //TODO Delete tempDir

    // Delete tmp directory after use
    // Import existsSync, rmSync
    /* if (existsSync(tmpDir)) {
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

  makeTemporaryDirectory() {
    return mkdtempSync(join(tmpdir(), 'tempDir-'));
  }

  private async cloneRepository(
    runConfiguration: ConfigurationDataDto,
    tmpDir: string,
  ) {
    this.logger.verbose(`Cloned from URL:  ${runConfiguration.sshUrl}`);
    return this.runCmd('git', ['clone', runConfiguration.sshUrl, tmpDir]);
  }

  private async checkoutBranch(
    runConfiguration: ConfigurationDataDto,
    tmpDir: string,
  ) {
    this.logger.verbose(`Switched to branch: ${runConfiguration.branchName}`);
    return this.runCmd('git', ['checkout', runConfiguration.branchName], {
      cwd: tmpDir,
    });
  }
  getBuildConfig(tmpDir) {
    return require(tmpDir + '/build-config.js');
  }
}
