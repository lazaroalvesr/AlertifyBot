import { Module } from '@nestjs/common';
import { RegisterComandsService } from './registerComands.service';

@Module({
  providers: [RegisterComandsService],
  exports: [RegisterComandsService]
})
export class RegisterComandsModule { }