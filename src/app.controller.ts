import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ResponseDto } from './dto/response-dto';

@Controller('webhook')
export class AppController {
  private readonly logger = new Logger(this.constructor.name, {
    timestamp: true,
  });
  constructor(private readonly appService: AppService) {}

  @Post()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post('/github')
  run(@Body() data: ResponseDto): any {
    //Getting all the json data
    this.logger.verbose('Got webhook from Github');
    return this.appService.run(data);
  }
}
