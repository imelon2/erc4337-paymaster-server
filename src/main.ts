import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { AppConfig } from './config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  const configService = app.get(ConfigService);
  const conf = configService.getOrThrow<AppConfig>('app');
  const port = conf.port || 3000;
  const logger = app.get<Logger>(WINSTON_MODULE_PROVIDER);

  logger.info(`Server listening on port ${port}`);
  logger.info(`Server config:`);
  conf.pmSignerKey = '0x#########';
  console.log(JSON.stringify(conf, null, 2));

  await app.listen(port);
}

bootstrap();
