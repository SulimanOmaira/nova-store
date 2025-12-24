import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AdminLocalStrategy } from './admin.local.strategy';
import { AUser } from 'src/a-user/entities/a-user.entity';
import { ASession } from 'src/a-session/entities/a-session.entity';
import { Customer } from 'src/c-customer/entities/c-customer.entity';
import { CSession } from 'src/c-session/entities/c-session.entity';
import { CustomerLocalStrategy } from './customer-local.strategy';
import { JwtStrategy } from './jwt.strategy';


@Module({
  imports: [
    ConfigModule,
    PassportModule,
    TypeOrmModule.forFeature([AUser, ASession, Customer, CSession]),
    JwtModule.registerAsync({
      inject: [ConfigService],
  useFactory: (cfg: ConfigService) => {
    const raw = cfg.get<string>('JWT_ACCESS_EXPIRES') ?? '15m';
    const expiresIn = /^\d+$/.test(raw) ? Number(raw) : raw as any;
    return {
      secret: cfg.get<string>('JWT_ACCESS_SECRET')!,
      signOptions: { expiresIn },
    };
  },
}),
  ],
  controllers: [AuthController],
  providers: [AuthService, AdminLocalStrategy, CustomerLocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
