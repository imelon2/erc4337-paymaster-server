import { JsonRpcFailure } from './rpc.interface';

export enum JsonRpcErrorCode {
  ParseError = -32700,
  InvalidRequest = -32600,
  MethodNotFound = -32601,
  InvalidParams = -32602,
  InternalError = -32603,
  Unauthorized = -32001,
  MethodUnsupported = -32002,
  Forbidden = -32003,
  EntrypointUnsupported = -32004,
  ChainIdUnsupported = -32005,
}

export const JsonRpcErrorMessage: Record<JsonRpcErrorCode, string> = {
  [JsonRpcErrorCode.ParseError]: 'Parse error',
  [JsonRpcErrorCode.InvalidRequest]: 'Invalid JSON-RPC version',
  [JsonRpcErrorCode.MethodNotFound]: 'Method not found',
  [JsonRpcErrorCode.InvalidParams]: 'Invalid params',
  [JsonRpcErrorCode.InternalError]: 'Internal error',
  [JsonRpcErrorCode.Unauthorized]: 'Unauthorized',
  [JsonRpcErrorCode.MethodUnsupported]: 'Unsupported method',
  [JsonRpcErrorCode.Forbidden]: 'Forbidden',
  [JsonRpcErrorCode.EntrypointUnsupported]: 'Unsupported Entrypoint version received',
  [JsonRpcErrorCode.ChainIdUnsupported]: 'Unsupported Chain id received',
};

export class JsonRpcException {
  constructor(readonly params: JsonRpcFailure) {}
}
