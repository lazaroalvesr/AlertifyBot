import { Module } from '@nestjs/common';
import { BotService } from './bot/bot.service';
import { BotModule } from './bot/bot.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { ScheduleModule } from '@nestjs/schedule';
import { RegisterComandsService } from './registerComands/registerComands.service';
import { RegisterComandsModule } from './registerComands/registerComands..module';
import { CommandsModule } from './commands/commands.module';
import { DeleteAccountModule } from './delete-account/deleteAccount.module';
import { DeleteAccountService } from './delete-account/deleteAccount.service';
import { ClearBotMessageModule } from './clear-bot-message/clear-bot-message.module';
import { ClearBotMessageService } from './clear-bot-message/clear-bot-message.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BotModule,
    RegisterComandsModule,
    CommandsModule,
    DeleteAccountModule,
    ClearBotMessageModule
  ],
  controllers: [],
  providers: [BotService, PrismaService, RegisterComandsService, DeleteAccountService, ClearBotMessageService],
})
export class AppModule { }
