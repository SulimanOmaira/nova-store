import { Module } from '@nestjs/common';
import { CSessionService } from './c-session.service';
import { CSessionController } from './c-session.controller';

@Module({
  controllers: [CSessionController],
  providers: [CSessionService],
})
export class CSessionModule {}
