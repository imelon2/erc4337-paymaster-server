import { Body, Controller, Get, Post } from '@nestjs/common';
import { RpcService } from './rpc.service';

@Controller('rpc')
export class RpcController {
  constructor(private readonly rpcService: RpcService) {}

  @Post()
  rpc(@Body() body: any) {
    return "hello rpc"
  }
}
