import {
  Injectable,
  UnauthorizedException,
  ExecutionContext,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // ✅ لو كل شيء تمام → رجّع اليوزر وخليه يكمل
    if (user && !err && !info) {
      return user;
    }

    // 🔎 debug مفيد جدًا بالبداية
    console.log('JWT handleRequest =>', { err, info });

    // 1) التوكن منتهي الصلاحية
    if (info?.name === 'TokenExpiredError') {
      // هذا الكود موجود عندك في errors
      throw new UnauthorizedException('common.errors.EXPIRED_TOKEN');
    }

    // 2) التوكن غير موجود / مفقود
    if (
      info?.message === 'No auth token' ||
      info?.message === 'No auth token specified' ||
      info?.message === 'jwt must be provided'
    ) {
      throw new UnauthorizedException('common.errors.TOKEN_MISSING');
    }

    // 3) التوكن غير صالح (معدل / فاسد / توقيع خاطئ)
    if (info?.name === 'JsonWebTokenError') {
      throw new UnauthorizedException('common.errors.INVALID_TOKEN');
    }

    // 4) أي error غير متوقع من الإستراتيجية نفسها
    if (err) {
      console.error('JWT ERR =>', err);
      throw new UnauthorizedException('common.errors.INVALID_TOKEN');
    }

    // 5) fallback عام → غير مصرح
    throw new UnauthorizedException('common.errors.UNAUTHORIZED');
  }
}
