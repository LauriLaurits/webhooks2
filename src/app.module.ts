import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskRunnerService } from './task-runner.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, TaskRunnerService],
})
export class AppModule {}
