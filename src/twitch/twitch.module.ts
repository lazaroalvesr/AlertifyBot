import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TwitchService } from './twitch.service';

@Module({
  imports: [ConfigModule],
  providers: [TwitchService],
  exports: [TwitchService]
})
export class TwitchModule {}