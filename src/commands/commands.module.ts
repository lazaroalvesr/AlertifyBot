import { Module } from '@nestjs/common';
import { CommandsService } from './commands.service';
import { StatusService } from '../status/status.service';

@Module({
  exports: [CommandsService],
  providers: [CommandsService, StatusService]
})
export class CommandsModule {}
