import { RpcLoggerMiddleware } from './rpcLogger.middleware';

describe('RpcLoggerMiddleware', () => {
  it('should be defined', () => {
    expect(new RpcLoggerMiddleware()).toBeDefined();
  });
});
