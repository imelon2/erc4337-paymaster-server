import { Injectable, PipeTransform } from '@nestjs/common';
import { rpcError } from '../common/rpc-uitls';
import { JsonRpcErrorCode, JsonRpcErrorMessage, JsonRpcException } from '../interfaces/rpc.error';
import { JsonRpcRequest } from '../interfaces/rpc.interface';

/**
 * @dev 이 파이프는 들어오는 RPC 요청 본문이 JSON-RPC 2.0 명세를 준수하는지 여부를 검증합니다..
 *      검증에 실패하더라도, 오류 메시지를 반환할 뿐이며, 그 경우에도 응답은 JSON-RPC 2.0 오류 객체 형식을 엄격하게 따릅니다.
 *      see. https://www.jsonrpc.org/specification#batch
 * @batchPolicy
 *      JSON-RPC 2.0은 배치 요청(batch requests)을 지원합니다.
 *      배치를 처리할 때, 하나의 요청에서 오류가 발생하더라도 전체 배치가 실패하지 않습니다.  배치 내의 각 요청은 독립적으로 처리되며,
 *      유효하지 않은 요청은 JSON-RPC 2.0 오류 객체 형식에 맞춘 응답으로 반환됩니다.
 *      파이프라인은 계속해서 생명주기를 이어가며, 유효한 요청은 다음 프로세스로 전달됩니다.
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
