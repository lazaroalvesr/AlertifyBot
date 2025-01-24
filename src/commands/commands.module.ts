import { Module } from '@nestjs/common';
import { CommandsService } from './commands.service';
import { TwitchService } from '../twitch/twitch.service';
import { DeleteAccountService } from '../delete-account/deleteAccount.service';
import { ClearBotMessageService } from '../clear-bot-message/clear-bot-message.service';

@Module({
  exports: [CommandsService],
  providers: [CommandsService, TwitchService, DeleteAccountService, ClearBotMessageService]
})
export class CommandsModule { }
