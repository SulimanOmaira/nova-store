// import {
//   Injectable,
//   NestInterceptor,
//   ExecutionContext,
//   CallHandler,
// } from '@nestjs/common';
// import { I18nContext } from 'nestjs-i18n';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';

// @Injectable()
// export class ResponseInterceptor implements NestInterceptor {
//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     const i18n = I18nContext.current();  // يحصل على سياق اللغة الحالية
// const message = await i18n.t('common.general.success');  // مفتاح الترجمة

//     return next.handle().pipe(
//       map((data) => {
//         // إذا كان الرد أصلاً يحتوي success/message/data لا نعدله
//         if (data && data.success !== undefined) return data;
//     const i18n = I18nContext.current();
//     const message = await i18n.t('common.general.success');

//         return {
//           success: true,
//           message: 'OK',
//           data,
//         };
//       }),
//     );
//   }
// }




import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // إذا كان الرد أصلاً يحتوي success/message/data لا نعدله
        if (data && data.success !== undefined) return data;

        // نحصل على سياق اللغة الحالي (قد يكون undefined)
        const i18n = I18nContext.current();

        // رسالة افتراضية
        let message = 'OK';

        // إذا كان i18n متوفر نستخدم الترجمة
        if (i18n) {
          try {
            message = i18n.t('common.general.success') as string;
          } catch (e) {
            // في حال حدث خطأ بالترجمة، نرجع للـ fallback
            message = 'OK';
          }
        }

        return {
          success: true,
          message,
          data,
        };
      }),
    );
  }
}
