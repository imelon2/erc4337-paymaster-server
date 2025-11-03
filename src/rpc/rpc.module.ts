import { Module } from '@nestjs/common';
import { RpcController } from './rpc.controller';
import { RpcService } from './rpc.service';
import { MethodHandlers } from './methods/method.handlers';
import { MethodRegistry } from './methods/method.registry';

@Module({
  controllers: [RpcController],
  providers: [RpcService, MethodHandlers, MethodRegistry],
})
export class RpcModule {}
