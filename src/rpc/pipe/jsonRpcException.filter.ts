import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response, Request } from 'express';
import { JsonRpcFailure } from '../interfaces/rpc.interface';

@Catch(HttpException)
export class JsonRpcExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    const response = exception.getResponse() as JsonRpcFailure;

    res.status(200).json(response); // JSON-RPC는 HTTP 200 으로 보내는 게 권장
  }
}
