import { Module } from '@nestjs/common';
import { RegisterComandsService } from './registerComands.service';
import { CommandsService } from '../commands/commands.service';
import { StatusService } from '../status/status.service';

@Module({
  providers: [RegisterComandsService, CommandsService, StatusService],
  exports: [RegisterComandsService]
})
export class RegisterComandsModule { }