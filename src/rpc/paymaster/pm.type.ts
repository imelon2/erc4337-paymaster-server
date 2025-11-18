/* eslint-disable prettier/prettier */
export type UserOperationRequest = [
  UserOperation,         // userUp
  `0x${string}`,         // entrypoint address
  `0x${string}`,         // chain id
  Record<string, any>?,  // context
];

export type UserOperation = {
  callData: string;
  callGasLimit: string;
  factory?: string;
  factoryData?: string;
  initCode?:string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  nonce: string;
  paymaster?: string;
  paymasterData?: string;
  paymasterPostOpGasLimit?: string;
  paymasterVerificationGasLimit?: string;
  preVerificationGas: string;
  sender: string;
  signature: string;
  verificationGasLimit: string;
};
