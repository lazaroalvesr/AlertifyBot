import { Module } from '@nestjs/common';
import { CommandsService } from './commands.service';
import { TwitchService } from '../twitch/twitch.service';
import { DeleteAccountService } from '../delete-account/deleteAccount.service';

@Module({
  exports: [CommandsService],
  providers: [CommandsService, TwitchService, DeleteAccountService]
})
export class CommandsModule { }
