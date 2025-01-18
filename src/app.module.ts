import { Module } from '@nestjs/common';
import { BotService } from './bot/bot.service';
import { BotModule } from './bot/bot.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BotModule,
  ],
  controllers: [],
  providers: [BotService, PrismaService],
})
export class AppModule {}
