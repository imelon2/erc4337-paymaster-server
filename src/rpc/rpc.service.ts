import { Injectable } from '@nestjs/common';
import { MethodRegistry } from './methods/method.registry';
import { JsonRpcRequest, JsonRpcFailureParams, JsonRpcFailure } from './interfaces/rpc.interface';
import { JsonRpcErrorCode, JsonRpcErrorMessage, JsonRpcException } from './interfaces/rpc.error';
import { rpcError, rpcReturn } from './common/rpc-uitls';
import { PaymasterHandlers } from './paymaster/pm.handler';
import { ZodError } from 'zod';

@Injectable()
export class RpcService {
  constructor(
    private readonly methods: MethodRegistry,
    private readonly pm: PaymasterHandlers,
  ) {}

  async handler(body: JsonRpcRequest | JsonRpcFailure | (JsonRpcRequest | JsonRpcFailure)[]) {
    if (Array.isArray(body)) {
      return Promise.all(body.map((b) => this.#_handle(b)));
    }
    return await this.#_handle(body);
  }

  async #_handle(body: JsonRpcRequest | JsonRpcFailure) {
    /**
     * @dev If the incoming request does not comply with the JSON-RPC 2.0 specification,
     *       an Error object will be returned from the ValidationRpcPipe.
     */
    if (body instanceof JsonRpcException) {
      return body;
    }

    const req = body as JsonRpcRequest;
    const { method, id } = req;
    const fn = this.methods.get(method);
    if (!fn)
      return rpcError(
        JsonRpcErrorCode.MethodNotFound,
        JsonRpcErrorMessage[JsonRpcErrorCode.MethodNotFound],
        id ?? null,
      );

    try {
      const result = await fn(req);

      if (this.#isFailureParams(result)) {
        return rpcError(result);
      }

      return rpcReturn(result, id);
    } catch (error) {
      if (error instanceof ZodError) {
        return rpcError(
          JsonRpcErrorCode.InvalidParams,
          JsonRpcErrorMessage[JsonRpcErrorCode.InvalidParams],
          id ?? null,
          error,
        );
      }

      return rpcError(
        JsonRpcErrorCode.InternalError,
        JsonRpcErrorMessage[JsonRpcErrorCode.InternalError],
        id ?? null,
        error,
      );
    }
  }

  #isFailureParams(value: unknown): value is JsonRpcFailureParams {
    if (!value || typeof value !== 'object') {
      return false;
    }

    const candidate = value as Partial<JsonRpcFailureParams>;

    return typeof candidate.code === 'number' && typeof candidate.message === 'string' && 'id' in candidate;
  }
}
