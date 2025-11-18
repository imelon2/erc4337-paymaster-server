import { JsonRpcFailureParams, JsonRpcRequest } from '../interfaces/rpc.interface';
import { UserOperationRequest } from '../paymaster/pm.type';

export type ERC7477Method =
  | 'pm_getPaymasterData'
  | 'pm_getPaymasterStubData'
  | 'pm_sponsorUserOperation'
  | 'pm_getERC20TokenQuotes';

// @TODO DTO
export type MethodMap = {
  pm_getPaymasterData: {
    params: JsonRpcRequest<UserOperationRequest>;
    result: any;
  };
  pm_getPaymasterStubData: {
    params: JsonRpcRequest<UserOperationRequest>;
    result: any;
  };
  pm_sponsorUserOperation: {
    params: JsonRpcRequest;
    result: JsonRpcFailureParams;
  };
  pm_getERC20TokenQuotes: {
    params: JsonRpcRequest;
    result: JsonRpcFailureParams;
  };
};

export type Handler<M extends ERC7477Method> = (
  params: MethodMap[M]['params'] /* ctx: RequestContext */,
) => Promise<MethodMap[M]['result']> | JsonRpcFailureParams;
