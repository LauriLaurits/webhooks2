import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { GithubPayloadDto } from './dto/github/github-payload.dto';
import { BitbucketPayloadDto } from './dto/bitbucket/bitbucket-payload.dto';

@Controller('webhook')
export class AppController {
  private readonly logger = new Logger(this.constructor.name, {
    timestamp: true,
  });

  constructor(private readonly appService: AppService) {}
  //TODO validation for webhook request
  @Post('/github')
  webhookGithub(@Body() body: GithubPayloadDto): number {
    this.logger.verbose('Got webhook from Github');
    return this.appService.webhookGithub(body);
  }

  @Post('/bitbucket')
  webhookBitbucket(@Body() body: BitbucketPayloadDto): number {
    this.logger.verbose('Got webhook from Bitbucket');
    console.log(body);
    return 0;
    //return this.appService.webhookBitbucket(body);
  }
}
