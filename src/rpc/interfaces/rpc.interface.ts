//@TODO TParams 정의하기

import { ERC7477Method } from "../methods/method.types";

export type JsonRpcVersion = '2.0'; // default protocol

export interface JsonRpcRequest<TParams = Record<string, unknown>> {
  jsonrpc: JsonRpcVersion;
  method: ERC7477Method;
  params?: TParams; // named params만 사용 권장
  id?: string | number | null; // notification이면 생략
}

export interface JsonRpcSuccess<TResult = unknown> {
  jsonrpc: JsonRpcVersion;
  id: string | number | null;
  result: TResult;
}

export interface JsonRpcErrorObject<TData = unknown> {
  code: number; // -32xxx 표준 또는 양수 도메인 코드
  message: string;
  data?: TData; // 검증 오류/추가 맥락
}

export interface JsonRpcFailure<TData = unknown> {
  jsonrpc: JsonRpcVersion;
  id: string | number | null;
  error: JsonRpcErrorObject<TData>;
}

export type JsonRpcResponse<TResult = unknown, TData = unknown> =
  | JsonRpcSuccess<TResult>
  | JsonRpcFailure<TData>;
