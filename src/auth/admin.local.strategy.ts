import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

// يطلب username/password في body
@Injectable()
export class AdminLocalStrategy extends PassportStrategy(Strategy, 'admin-local') {
  constructor(private auth: AuthService) { super({ usernameField: 'UserName'  , passwordField : "Password"}); }
  async validate(username: string, password: string) {
    const admin = await this.auth.validateAdmin(username, password);
    if (!admin) throw new UnauthorizedException("common.errors.INVALID_CREDENTIALS");
    return admin;
  }
}
