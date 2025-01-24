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

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BotModule,
    RegisterComandsModule,
    CommandsModule,
    DeleteAccountModule
  ],
  controllers: [],
  providers: [BotService, PrismaService, RegisterComandsService, DeleteAccountService],
})
export class AppModule { }
