export type ERC7477Method =
  | 'pm_getPaymasterData'
  | 'pm_getPaymasterStubData'
  | 'pm_sponsorUserOperation'
  | 'pm_getERC20TokenQuotes';

// @TODO DTO
export type MethodMap = {
  pm_getPaymasterData: {
    params: any;
    result: any;
  };
  pm_getPaymasterStubData: {
    params: any;
    result: any;
  };
  pm_sponsorUserOperation: {
    params: any;
    result: any;
  };
  pm_getERC20TokenQuotes: {
    params: any;
    result: any;
  };
};

export type Handler<M extends ERC7477Method> = (
  params: MethodMap[M]['params'] /* ctx: RequestContext */,
) => Promise<MethodMap[M]['result']>;
