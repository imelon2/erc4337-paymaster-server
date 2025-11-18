import * as z from 'zod';
import { UserOperation, UserOperationRequest } from './pm.type';

type PaymasterParams = {
  userOp: UserOperation;
  entryPoint: `0x${string}`;
  chainId: `0x${string}`;
  context: Record<string, any>;
};

export class PaymasterDataRequestDTO {
  userOp: UserOperation;
  entryPoint: `0x${string}`;
  chainId: string;
  context: Record<string, any>;

  constructor() {}

  static of(params: UserOperationRequest) {
    const dto = new PaymasterDataRequestDTO();

    const _params: PaymasterParams = {
      userOp: params[0],
      entryPoint: params[1],
      chainId: params[2],
      context: params[3] || {},
    };

    const { userOp, entryPoint, chainId, context } = PaymasterDataRequestDTO.validation(_params);

    dto.userOp = userOp;
    dto.entryPoint = entryPoint;
    dto.chainId = chainId;
    dto.context = context;
    return dto;
  }

  static validation(params: PaymasterParams) {
    const paramSchema = z.object({
      userOp: z.object({
        callData: z.string().startsWith('0x'),
        callGasLimit: z.string().startsWith('0x'),
        factory: z.string().startsWith('0x').optional(),
        factoryData: z.string().startsWith('0x').optional(),
        maxFeePerGas: z.string().default('0x0'),
        maxPriorityFeePerGas: z.string().default('0x0'),
        nonce: z.string().startsWith('0x'),
        paymaster: z.string().startsWith('0x').optional(),
        paymasterData: z.string().startsWith('0x').optional(),
        paymasterPostOpGasLimit: z.string().startsWith('0x').optional(),
        paymasterVerificationGasLimit: z.string().startsWith('0x').optional(),
        preVerificationGas: z.string().startsWith('0x'),
        sender: z.string().startsWith('0x').length(42),
        signature: z.string().startsWith('0x'),
        verificationGasLimit: z.string().startsWith('0x'),
      }),
      entryPoint: z.string().startsWith('0x'),
      chainId: z.string().startsWith('0x'),
      context: z.object(),
    });

    return paramSchema.parse({
      userOp: params.userOp,
      entryPoint: params.entryPoint,
      chainId: params.chainId,
      context: params.context,
    }) as PaymasterParams;
  }
}
