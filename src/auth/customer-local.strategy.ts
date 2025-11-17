import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class CustomerLocalStrategy extends PassportStrategy(Strategy, 'customer-local') {
  constructor(private auth: AuthService) { super({ usernameField: 'UserName' , passwordField: "Password"}); }
  async validate(username: string, password: string) {
    const customer = await this.auth.validateCustomer(username, password);
    if (!customer) throw new UnauthorizedException('common.errors.INVALID_CREDENTIALS');
    return customer;
  }
}
