import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('webhook')
export class AppController {
  private readonly logger = new Logger(this.constructor.name, {
    timestamp: true,
  });
  constructor(private readonly appService: AppService) {}
  @Post('/github')
  getAllDataGithub(@Body() body): number {
    //Getting all the JSON data
    console.log(body);
    this.logger.verbose('Got webhook from Github');
    return this.appService.getDataFromGithub(body);
  }
  @Post('/bitbucket')
  getAllDataBitbucket(@Body() body): number {
    //Getting all the JSON data
    this.logger.verbose('Got webhook from Bitbucket');
    return this.appService.getDataFromBitbucket(body);
  }
}
