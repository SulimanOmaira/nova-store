import { Module } from '@nestjs/common';
import { ASessionService } from './a-session.service';
import { ASessionController } from './a-session.controller';

@Module({
  controllers: [ASessionController],
  providers: [ASessionService],
})
export class ASessionModule {}
