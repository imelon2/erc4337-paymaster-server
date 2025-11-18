/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class RpcLoggerMiddleware implements NestMiddleware {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

  use(req: Request, res: Response, next: () => void) {
    const { params, id, method } = req.body;

    this.logger.info(`Served ${method}`, {
      rpcId: id,
      response: JSON.stringify({ sender: params[0].sender, id: id }),
    });
    this.logger.debug(`Served ${method}`, {
      rpcId: id,
      response: JSON.stringify(this.tryParseJSON(req.body)),
    });
    const oldSend = res.send.bind(res);
    let responseBody: unknown;

    res.send = (body: unknown) => {
      responseBody = body;

      return oldSend(body);
    };

    res.on('finish', () => {
      this.logger.debug(`Response ${method}`, {
        rpcId: id,
        response: JSON.stringify(this.tryParseJSON(responseBody)),
      });
    });

    next();
  }

  private tryParseJSON(value: any) {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
}
