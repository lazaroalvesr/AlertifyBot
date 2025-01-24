import { Module } from '@nestjs/common';
import { ClearBotMessageService } from './clear-bot-message.service';

@Module({
  providers: [ClearBotMessageService]
})
export class ClearBotMessageModule {}
