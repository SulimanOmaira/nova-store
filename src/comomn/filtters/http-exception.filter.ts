import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { I18nContext } from 'nestjs-i18n';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    // 👈 هنا نخزن "CODE" وليس نص
    let code = 'INTERNAL_SERVER_ERROR';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res: any = exception.getResponse();

      // Nest أحياناً يرجع:
      // - string
      // - { message: string | string[], error: string, ... }
      if (typeof res === 'string') {
        code = res;
      } else if (Array.isArray(res?.message)) {
        code = res.message[0];
      } else if (typeof res?.message === 'string') {
        code = res.message;
      } else if (typeof res?.error === 'string') {
        code = res.error;
      }
    }
    if (!(exception instanceof HttpException)) {
  console.error('UNHANDLED EXCEPTION =>', exception);
}


    const i18n = I18nContext.current(host);
    let translated = code;

    if (i18n) {
      try {
        // 👈 نبحث عن errors.CODE في ملف الترجمة
        translated = i18n.t(code) as string;
      } catch (e) {
        // لو ما وجد key نرجع الـ code نفسه
        translated = code;
      }
    }

    response.status(status).json({
      success: false,
      message: translated, // النص حسب اللغة
      // code,                // الكود (مفيد للـ Frontend لو حاب يتصرف حسبه)
      data: null,
      // path: request.url,
      // statusCode: status,
    });
  }
}
