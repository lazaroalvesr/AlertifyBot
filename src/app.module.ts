import { Module } from '@nestjs/common';
import { BotService } from './bot/bot.service';
import { BotModule } from './bot/bot.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { ScheduleModule } from '@nestjs/schedule';
import { RegisterComandsService } from './registerComands/registerComands.service';
import { RegisterComandsModule } from './registerComands/registerComands..module';
import { StatusModule } from './status/status.module';
import { CommandsModule } from './commands/commands.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BotModule,
    RegisterComandsModule,
    StatusModule,
    CommandsModule
  ],
  controllers: [],
  providers: [BotService, PrismaService, RegisterComandsService],
})
export class AppModule { }
