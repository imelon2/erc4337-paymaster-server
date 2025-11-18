import { JsonRpcFailure, JsonRpcFailureParams, JsonRpcSuccess } from '../interfaces/rpc.interface';

export function rpcError(code: number, message: string, id: string | number | null, data?: unknown): JsonRpcFailure;
export function rpcError(param: JsonRpcFailureParams): JsonRpcFailure;
export function rpcError(
  arg1: number | JsonRpcFailureParams,
  arg2?: string,
  arg3?: string | number | null,
  arg4?: unknown,
): JsonRpcFailure {
  if (typeof arg1 === 'object') {
    const { code, message, id = null, data } = arg1;
    return { jsonrpc: '2.0', error: { code, message, data }, id };
  }

  const code = arg1;
  const message = arg2 ?? '';
  const id = arg3 ?? null;
  const data = arg4;

  return { jsonrpc: '2.0', error: { code, message, data }, id };
}

export function rpcReturn(result: unknown, id: string | number | null = null): JsonRpcSuccess {
  return { jsonrpc: '2.0', result, id };
}
