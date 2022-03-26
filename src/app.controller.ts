import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('webhook')
export class AppController {
  private readonly logger = new Logger(this.constructor.name, {
    timestamp: true,
  });

  constructor(private readonly appService: AppService) {}
  //TODO validation for webhook request
  @Post('/github')
  webhookGithub(@Body() body): number {
    this.logger.verbose('Got webhook from Github');
    return this.appService.webhookGithub(body);
  }

  @Post('/bitbucket')
  webhookBitbucket(@Body() body): number {
    this.logger.verbose('Got webhook from Bitbucket');
    return this.appService.webhookBitbucket(body);
  }
}
