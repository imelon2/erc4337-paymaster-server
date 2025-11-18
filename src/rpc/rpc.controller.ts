import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { RpcService } from './rpc.service';
import { JsonRpcFailure, JsonRpcRequest } from './interfaces/rpc.interface';
import { ValidationRpcPipe } from './pipe/validationRpc.pipe';

@Controller('rpc')
export class RpcController {
  constructor(private readonly rpcService: RpcService) {}

  @Post()
  @UsePipes(ValidationRpcPipe)
  rpc(@Body() body: JsonRpcRequest | JsonRpcFailure | (JsonRpcRequest | JsonRpcFailure)[]) {
    return this.rpcService.handler(body);
  }
}
