import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RpcController } from './rpc.controller';
import { RpcService } from './rpc.service';
import { MethodHandlers } from './methods/method.handlers';
import { MethodRegistry } from './methods/method.registry';
import { PaymasterHandlers } from './paymaster/pm.handler';
import { RpcLoggerMiddleware } from './logger/rpcLogger.middleware';
import { ValidationRpcPipe } from './pipe/validationRpc.pipe';

@Module({
  controllers: [RpcController],
  providers: [RpcService, MethodHandlers, MethodRegistry, PaymasterHandlers, ValidationRpcPipe],
})
export class RpcModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RpcLoggerMiddleware).forRoutes(RpcController);
  }
}
