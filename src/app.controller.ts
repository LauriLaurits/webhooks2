import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { GithubPayloadDto } from './dtos/github/github-payload.dto';
import { BitbucketPayloadDto } from './dtos/bitbucket/bitbucket-payload.dto';

@Controller('webhook')
export class AppController {
  private readonly logger = new Logger(this.constructor.name, {
    timestamp: true,
  });

  constructor(private readonly appService: AppService) {}
  @Post('/github')
  webhookGithub(@Body() body: GithubPayloadDto): number {
    this.logger.verbose('Got webhook from Github');
    return this.appService.webhookGithub(body);
  }

  @Post('/bitbucket')
  webhookBitbucket(@Body() body: BitbucketPayloadDto): number {
    this.logger.verbose('Got webhook from Bitbucket');
    return this.appService.webhookBitbucket(body);
  }
}
