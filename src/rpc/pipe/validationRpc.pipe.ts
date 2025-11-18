import { Injectable, PipeTransform } from '@nestjs/common';
import { rpcError } from '../common/rpc-uitls';
import { JsonRpcErrorCode, JsonRpcErrorMessage, JsonRpcException } from '../interfaces/rpc.error';
import { JsonRpcRequest } from '../interfaces/rpc.interface';

/**
 * @dev This pipe validates whether the incoming RPC request body complies with the JSON-RPC 2.0 specification.
 *      If the validation fails, it returns an error message — but even in that case,
 *      the response itself strictly follows the JSON-RPC 2.0 error object format.
 *      see. https://www.jsonrpc.org/specification#batch
 * @batchPolicy
 *      JSON-RPC 2.0 supports batch requests. When processing a batch,
 *      the occurrence of an error in one request does not cause the entire batch to fail.
 *      Each request within the batch is handled independently,
 *      and any invalid requests are returned as compliant JSON-RPC 2.0 error objects.
 *      The pipeline continues its lifecycle, passing valid requests to the next process.
 */
@Injectable()
export class ValidationRpcPipe implements PipeTransform {
  transform(value: JsonRpcRequest | JsonRpcRequest[]) {
    if (Array.isArray(value)) {
      return value.map((v) => this.#_validate(v));
    }

    return this.#_validate(value);
  }

  #_validate(value: JsonRpcRequest): JsonRpcRequest | JsonRpcException {
    const { jsonrpc, method, params, id = null } = value;

    if (jsonrpc !== '2.0') {
      return new JsonRpcException(
        rpcError(JsonRpcErrorCode.InvalidRequest, JsonRpcErrorMessage[JsonRpcErrorCode.InvalidRequest], id),
      );
    }

    if (typeof method !== 'string' || method.trim() === '') {
      return new JsonRpcException(
        rpcError(JsonRpcErrorCode.MethodNotFound, JsonRpcErrorMessage[JsonRpcErrorCode.MethodNotFound], id),
      );
    }

    if (params !== undefined && typeof params !== 'object' && !Array.isArray(params)) {
      return new JsonRpcException(
        rpcError(JsonRpcErrorCode.InvalidParams, JsonRpcErrorMessage[JsonRpcErrorCode.InvalidParams], id),
      );
    }

    return value;
  }
}
