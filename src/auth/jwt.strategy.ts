import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// export type JwtPayload = { sub: string; role: 'admin' | 'customer' };
import { Role } from './role.enum';
export type JwtPayload = { sub: string; role: Role };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(cfg: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: cfg.get<string>('JWT_ACCESS_SECRET'),
      ignoreExpiration: false,
    });
  }
  async validate(payload: JwtPayload) {
    return { userId: payload.sub, role: payload.role }; 
  }
}
