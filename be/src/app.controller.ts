import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';

import { Response } from 'express';
import { ChatDto } from './dto/chat.dto';

@Controller('/api/chat')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post('/stream-data')
  streamData(@Body() chatDto: ChatDto, @Res() res: Response) {
    this.appService.getCompletion(chatDto, res);
  }
}
