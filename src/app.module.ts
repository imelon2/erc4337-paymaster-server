import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RpcModule } from './rpc/rpc.module';

@Module({
  imports: [RpcModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
