import { Module } from '@nestjs/common';
import { TwitchService } from '../twitch/twitch.service';

@Module({
  providers: [TwitchService], 
  exports: [TwitchService],    
})
export class BotModule {}
