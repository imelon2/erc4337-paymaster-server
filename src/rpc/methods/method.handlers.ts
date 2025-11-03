import { Injectable } from "@nestjs/common";
import { MethodRegistry } from "./method.registry";
import { Handler } from "./method.types";

@Injectable()
export class MethodHandlers {
  constructor(private readonly registry: MethodRegistry) {}

  onModuleInit() {
    this.registry.register('pm_getPaymasterData', this.pm_getPaymasterData);
    this.registry.register('pm_getPaymasterStubData', this.pm_getPaymasterStubData);
    this.registry.register('pm_sponsorUserOperation', this.pm_sponsorUserOperation);
    this.registry.register('pm_getERC20TokenQuotes', this.pm_getERC20TokenQuotes);
  }

  pm_getPaymasterData: Handler<'pm_getPaymasterData'> = async (
    params
  ): Promise<any> => {
    return { paymasterAndData: '0xpaymaster...' };
  };

  pm_getPaymasterStubData: Handler<'pm_getPaymasterStubData'> = async (
    params
  ): Promise<any> => {
    return { paymasterAndData: '0xstub...' };
  };

  pm_sponsorUserOperation: Handler<'pm_sponsorUserOperation'> = async (
    params
  ): Promise<any> => {
    return { paymasterAndData: '0xsponsored...', sponsorshipId: 'sp_123' };
  };

  pm_getERC20TokenQuotes: Handler<'pm_getERC20TokenQuotes'> = async (
    params
  ): Promise<any> => {
    return { quotes: params.tokens.map(t => ({ token: t, price: '0', updatedAt: Date.now() })) };
  };
}