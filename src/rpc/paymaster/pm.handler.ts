import { Injectable } from '@nestjs/common';
import {
  AbiCoder,
  BigNumberish,
  BytesLike,
  ethers,
  hexlify,
  JsonRpcProvider,
  toBeHex,
  Wallet,
  zeroPadValue,
} from 'ethers';
import { AppConfig } from 'src/config/app.config';
import { SimplePaymaster, SimplePaymaster__factory } from './typechain-types';
import { PackedUserOperationStruct } from './typechain-types/contracts/SimplePaymaster';
import { UserOperation } from './pm.type';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymasterHandlers {
  Provider: JsonRpcProvider;
  Bundler: JsonRpcProvider;
  SimplePaymaster: SimplePaymaster;
  PaymasterWallet: Wallet;

  entryPointV7: `0x${string}`[];
  pmPostOpGasLimit: string;
  pmVerificationGasLimit: string;

  validRangeUntil: number;
  validRangedAfter: number;

  chainId: number;
  constructor(private readonly configService: ConfigService) {
    const conf = configService.getOrThrow<AppConfig>('app');
    this.Provider = new ethers.JsonRpcProvider(conf.providerUrl);
    this.Bundler = new ethers.JsonRpcProvider(conf.bundlerUrl);
    this.PaymasterWallet = new ethers.Wallet(conf.pmSignerKey, this.Provider);
    this.SimplePaymaster = SimplePaymaster__factory.connect(conf.paymasterAddress, this.PaymasterWallet);

    this.pmPostOpGasLimit = ethers.toBeHex(conf.pmPostOpGasLimit);
    this.pmVerificationGasLimit = ethers.toBeHex(conf.pmVerificationGasLimit);

    this.validRangeUntil = conf.timeUntil;
    this.validRangedAfter = conf.timeAfter;

    this.entryPointV7 = conf.entryPointAddress;
    this.chainId = conf.chainId;
  }

  async signV7(userOp: UserOperation, entryPoint: string, estimate: boolean, context?: Record<string, any>) {
    const { validUntil, validAfter } = this.getExpiration({
      validUntil: context?.validUntil || undefined,
      validAfter: context?.validAfter || undefined,
    });

    if (!userOp.signature) userOp.signature = '0x';
    if (userOp.factory && userOp.factoryData)
      userOp.initCode = this.hexConcat([userOp.factory, userOp.factoryData ?? '']);
    if (!userOp.initCode) userOp.initCode = '0x';

    const paymaster = await this.SimplePaymaster.getAddress();
    if (estimate) {
      userOp.paymaster = paymaster;
      userOp.paymasterVerificationGasLimit = this.pmVerificationGasLimit;
      userOp.paymasterPostOpGasLimit = this.pmPostOpGasLimit;

      const accountGasLimits = this.packUint(userOp.verificationGasLimit, userOp.callGasLimit);
      const gasFees = this.packUint(userOp.maxPriorityFeePerGas, userOp.maxFeePerGas);

      const packedUserOp: PackedUserOperationStruct = {
        sender: userOp.sender,
        nonce: userOp.nonce,
        initCode: userOp.initCode,
        callData: userOp.callData,
        accountGasLimits: accountGasLimits,
        preVerificationGas: userOp.preVerificationGas,
        gasFees: gasFees,
        paymasterAndData: this.packPaymasterData(paymaster, this.pmVerificationGasLimit, this.pmPostOpGasLimit),
        signature: userOp.signature,
      };
      userOp.paymasterData = await this.encodePaymasterData(validUntil, validAfter, packedUserOp);

      const response = await this.Bundler.send('eth_estimateUserOperationGas', [userOp, entryPoint]);

      // estimated gas
      userOp.verificationGasLimit = response.verificationGasLimit;
      userOp.callGasLimit = response.callGasLimit;
      userOp.preVerificationGas = response.preVerificationGas;
    }

    const accountGasLimits = this.packUint(userOp.verificationGasLimit, userOp.callGasLimit);
    const gasFees = this.packUint(userOp.maxPriorityFeePerGas, userOp.maxFeePerGas);
    const packedUserOp = {
      sender: userOp.sender,
      nonce: userOp.nonce,
      initCode: userOp.initCode,
      callData: userOp.callData,
      accountGasLimits: accountGasLimits,
      preVerificationGas: userOp.preVerificationGas,
      gasFees: gasFees,
      paymasterAndData: this.packPaymasterData(paymaster, this.pmVerificationGasLimit, this.pmPostOpGasLimit),
      signature: userOp.signature,
    };

    const paymasterAndData = await this.encodePaymasterData(validUntil, validAfter, packedUserOp);

    if (estimate) {
      return {
        paymaster: userOp.paymaster,
        paymasterData: paymasterAndData,
        paymasterPostOpGasLimit: this.pmPostOpGasLimit,
        paymasterVerificationGasLimit: this.pmVerificationGasLimit,
      };
    } else {
      return {
        paymaster,
        paymasterData: paymasterAndData,
      };
    }
  }

  packPaymasterData(
    paymaster: string,
    paymasterVerificationGasLimit: BigNumberish,
    postOpGasLimit: BigNumberish,
    paymasterData?: BytesLike,
  ): BytesLike {
    return ethers.concat([
      paymaster,
      this.packUint(paymasterVerificationGasLimit, postOpGasLimit),
      paymasterData ?? '0x',
    ]);
  }

  async encodePaymasterData(validUntil: number, validAfter: number, packedUserOp: PackedUserOperationStruct) {
    const hash = await this.SimplePaymaster.getHash(packedUserOp, validUntil, validAfter);
    const sig = await this.PaymasterWallet.signMessage(ethers.toBeArray(hash));

    const coder = new AbiCoder();
    return this.hexConcat([coder.encode(['uint48', 'uint48'], [validUntil, validAfter]), sig]);
  }

  getExpiration(context?: { validUntil: number; validAfter: number }) {
    const date = new Date();
    const _validUntil = context?.validUntil ? new Date(context.validUntil) : date;
    const _validAfter = context?.validAfter ? new Date(context.validAfter) : date;
    const validUntil = Number((_validUntil.valueOf() / 1000).toFixed(0)) + this.validRangeUntil;
    const validAfter = Number((_validAfter.valueOf() / 1000).toFixed(0)) - this.validRangedAfter;

    return {
      validUntil,
      validAfter,
    };
  }

  isVaildChainId() {}
  isVaildEntryPoint() {}

  packUint(high128: BigNumberish, low128: BigNumberish): string {
    // BigInt로 변환
    const high = BigInt(high128);
    const low = BigInt(low128);

    // (high << 128) + low 계산
    const packed = (high << 128n) + low;

    // hex 변환 + 32바이트 패딩
    const hex = toBeHex(packed);
    return zeroPadValue(hex, 32);
  }

  hexConcat(items: ReadonlyArray<BytesLike>): string {
    let result = '0x';
    items.forEach((item) => {
      result += hexlify(item).substring(2);
    });
    return result;
  }
}
