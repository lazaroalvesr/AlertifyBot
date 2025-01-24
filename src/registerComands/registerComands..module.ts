import { Module } from '@nestjs/common';
import { RegisterComandsService } from './registerComands.service';
import { CommandsService } from '../commands/commands.service';
import { TwitchService } from '../twitch/twitch.service';
import { DeleteAccountService } from '../delete-account/deleteAccount.service';
import { ClearBotMessageService } from 'src/clear-bot-message/clear-bot-message.service';

@Module({
  providers: [RegisterComandsService, CommandsService, TwitchService, DeleteAccountService, ClearBotMessageService],
  exports: [RegisterComandsService]
})
export class RegisterComandsModule { }