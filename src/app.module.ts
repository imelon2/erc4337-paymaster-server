import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RpcModule } from './rpc/rpc.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/app.config';
import { WinstonModule } from 'nest-winston';
import { createLoggerOptions, LEVELS } from './rpc/common/winstonOptions';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      load: [appConfig],
    }),
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const verbosity = configService.get<LEVELS>('app.verbosity', LEVELS.debug);
        return createLoggerOptions(verbosity);
      },
    }),
    RpcModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
