import { Module } from '@nestjs/common';
import { DeleteAccountService } from './deleteAccount.service';

@Module({
  providers: [DeleteAccountService]
})
export class DeleteAccountModule {}
