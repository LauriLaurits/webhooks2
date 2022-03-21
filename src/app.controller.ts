import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('webhook')
export class AppController {
  private readonly logger = new Logger(this.constructor.name, {
    timestamp: true,
  });
  constructor(private readonly appService: AppService) {}
  @Post('/github')
  getAllDataGithub(@Body() body): string {
    //Getting all the json data
    this.logger.verbose('Got webhook from Github');
    //Parsing to get needed data
    return this.appService.getDataForGithub(body);
  }
  @Post('/bitbucket')
  getAllDataBitbucket(@Body() body): string {
    //Getting all the json data
    this.logger.verbose('Got webhook from Bitbucket');
    //Parsing to get needed data
    return this.appService.getDataForBitbucket(body);
  }
}
