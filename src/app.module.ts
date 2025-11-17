import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ACodStatusModule } from './a-cod-status/a-cod-status.module';
import { ACodLangModule } from './a-cod-lang/a-cod-lang.module';
import { AUserModule } from './a-user/a-user.module';
import { ASessionModule } from './a-session/a-session.module';
import { UCodCityModule } from './u-cod-city/u-cod-city.module';
import { CCustomerModule } from './c-customer/c-customer.module';
import { CSessionModule } from './c-session/c-session.module';
import { 
  I18nModule,
  HeaderResolver,
  AcceptLanguageResolver,
 } from 'nestjs-i18n';
import * as path from 'path';


@Module({
  imports: [
    //   I18nModule.forRoot({
    //   fallbackLanguage: 'en',
    //   loaderOptions: {
    //     path: path.join(__dirname, '/localization/'),
    //     watch: true,
    //   },
    //   resolvers: [
    //     new HeaderResolver(['x-lang']),
    //     AcceptLanguageResolver,

    //   ],
    // }),

        I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '..' , 'localization'),
        watch: true,
      },
      resolvers: [
        AcceptLanguageResolver,
      ],
    }),

    ConfigModule.forRoot({ isGlobal: true }), // يحمّل .env
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'mysql',
        host: cfg.get<string>('DB_HOST'),
        port: cfg.get<number>('DB_PORT'),
        username: cfg.get<string>('DB_USERNAME'),
        password: cfg.get<string>('DB_PASSWORD'),
        database: cfg.get<string>('DB_NAME'),
        charset: 'utf8mb4',
        timezone: 'Z',
        // اجمع الكيانات تلقائياً
        entities: [__dirname + '/**/*.entity.{ts,js}'],
        // لا تفعلها في الإنتاج؛ استخدم الهجرات
        synchronize: false,
        migrations: [__dirname + '/migrations/*.{ts,js}'],
      }),
    }), ACodStatusModule, ACodLangModule, AUserModule, ASessionModule, UCodCityModule, CCustomerModule, CSessionModule,
    // ... Modules (UsersModule, CodesModule, AuthModule, CustomersModule, CitiesModule)
  ],
})
export class AppModule {}
