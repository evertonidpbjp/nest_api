import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Post } from '@nestjs/common';

@Controller('teste')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('get')
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('post')
  setHello(): string {
    return "Hello Word - Post";
  }
}
