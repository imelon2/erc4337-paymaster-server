import { Injectable } from '@nestjs/common';
import { MethodRegistry } from './method.registry';
import { Handler } from './method.types';
import { JsonRpcErrorCode, JsonRpcErrorMessage } from '../interfaces/rpc.error';
import { JsonRpcFailureParams } from '../interfaces/rpc.interface';
import { PaymasterHandlers } from '../paymaster/pm.handler';
import { PaymasterDataRequestDTO } from '../paymaster/PaymasterDataRequestDTO';
import { ethers } from 'ethers';

@Injectable()
export class MethodHandlers {
  constructor(
    private readonly registry: MethodRegistry,
    private readonly pm: PaymasterHandlers,
  ) {}

  onModuleInit() {
    this.registry.register('pm_getPaymasterData', this.pm_getPaymasterData);
    this.registry.register('pm_getPaymasterStubData', this.pm_getPaymasterStubData);
    this.registry.register('pm_sponsorUserOperation', this.pm_sponsorUserOperation);
    this.registry.register('pm_getERC20TokenQuotes', this.pm_getERC20TokenQuotes);
  }

  pm_getPaymasterData: Handler<'pm_getPaymasterData'> = async (body) => {
    const { params, id } = body;
    const pmDTO = PaymasterDataRequestDTO.of(params);
    const { userOp, entryPoint, chainId, context } = pmDTO;

    if (!this.pm.entryPointV7.includes(entryPoint)) {
      return {
        code: JsonRpcErrorCode.EntrypointUnsupported,
        message: JsonRpcErrorMessage[JsonRpcErrorCode.EntrypointUnsupported],
        id: id ?? null,
      };
    }

    if (this.pm.chainId !== ethers.toNumber(chainId)) {
      return {
        code: JsonRpcErrorCode.EntrypointUnsupported,
        message: JsonRpcErrorMessage[JsonRpcErrorCode.EntrypointUnsupported],
        id: id ?? null,
      };
    }

    const data = await this.pm.signV7(userOp, entryPoint, false, context);
    return { ...data };
  };

  pm_getPaymasterStubData: Handler<'pm_getPaymasterStubData'> = async (body) => {
    const { params, id } = body;
    const pmDTO = PaymasterDataRequestDTO.of(params);
    const { userOp, entryPoint, chainId, context } = pmDTO;

    if (!this.pm.entryPointV7.includes(entryPoint)) {
      return {
        code: JsonRpcErrorCode.EntrypointUnsupported,
        message: JsonRpcErrorMessage[JsonRpcErrorCode.EntrypointUnsupported],
        id: id ?? null,
      };
    }

    if (this.pm.chainId !== ethers.toNumber(chainId)) {
      return {
        code: JsonRpcErrorCode.EntrypointUnsupported,
        message: JsonRpcErrorMessage[JsonRpcErrorCode.EntrypointUnsupported],
        id: id ?? null,
      };
    }

    const data = await this.pm.signV7(userOp, entryPoint, true, context);
    return { ...data };
  };

  pm_sponsorUserOperation: Handler<'pm_sponsorUserOperation'> = (params): JsonRpcFailureParams => {
    return {
      code: JsonRpcErrorCode.MethodUnsupported,
      message: 'Unsupported pm_sponsorUserOperation received',
      id: params.id ?? null,
    };
  };

  pm_getERC20TokenQuotes: Handler<'pm_getERC20TokenQuotes'> = (params): JsonRpcFailureParams => {
    return {
      code: JsonRpcErrorCode.MethodUnsupported,
      message: 'Unsupported pm_getERC20TokenQuotes received',
      id: params.id ?? null,
    };
  };
}
