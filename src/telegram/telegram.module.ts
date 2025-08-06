import { Module } from '@nestjs/common';
import { MainHandler } from './main.handler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TelegrafModule } from 'nestjs-telegraf';
import { UserModule } from './modules/user.module';
import { SessionModule } from './modules/session.module';
import { ProfileModule } from './modules/profile.module';
import { PresentersModule } from './modules/presenters.module';
import { SubsidiaryHandlerModule } from './commands/editProfileCase/edit-profile-handlers.module';
import { HandlersModule } from './modules/handlers.module';
import { CommandsModule } from './commands/commands.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      'mongodb://admin:adminpassword@localhost:27017/telegramBotDB?authSource=admin',
    ),
    TelegrafModule.forRoot({
      token: '8037029565:AAE13xSBP2tUhTnUuZ2A7diFL9ZVO6qHUIA',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: Number(configService.get('DB_PORT')),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        synchronize: true,
        entities: [__dirname + '/**/*.entity{.js,.ts}'],
      }),
      inject: [ConfigService],
    }),
    UserModule,
    ProfileModule,
    SessionModule,
    PresentersModule,
    SubsidiaryHandlerModule,
    HandlersModule,
    CommandsModule,
  ],
  providers: [MainHandler],
})
export class TelegramModule {}
