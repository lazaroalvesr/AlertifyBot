import { Module } from '@nestjs/common';
import { StatusService } from './status.service';
import { TwitchService } from '../twitch/twitch.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  exports: [StatusService],
  providers: [StatusService, TwitchService, PrismaService]
})
export class StatusModule { }
