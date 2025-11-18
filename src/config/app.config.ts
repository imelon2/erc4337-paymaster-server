import { cleanEnv, EnvError, makeValidator, num, port, str, url } from 'envalid';
import { isAddress, isHexString } from 'ethers';
import { LEVELS } from 'src/rpc/common/winstonOptions';

export type AppConfig = {
  port: number;
  nodeEnv: string;
  verbosity: LEVELS;
  entryPointAddress: `0x${string}`[];
  paymasterAddress: `0x${string}`;
  chainId: number;
  providerUrl: string;
  bundlerUrl: string;
  timeUntil: number;
  timeAfter: number;
  pmPostOpGasLimit: number;
  pmVerificationGasLimit: number;
  pmSignerKey: `0x${string}`;
};

export type AppConfigKey = keyof AppConfig;

export const address = makeValidator((input: string) => {
  if (!isAddress(input)) throw new EnvError(`Invalid address: "${input as string}"`);
  return input as `0x${string}`;
});

export const addressArray = makeValidator((input: string) => {
  const arr = input
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean);

  if (arr.length === 0) {
    throw new EnvError('Expected at least one address');
  }

  for (const addr of arr) {
    if (!isAddress(addr)) throw new EnvError(`Invalid address in array: "${addr as string}"`);
  }

  return arr as `0x${string}`[];
});

const hex = makeValidator<`0x${string}`>((input: string) => {
  const coerced = isHexString(input);
  if (!coerced) throw new EnvError(`Invalid hex input: "${input}"`);
  return input;
});

const level = makeValidator<LEVELS>((_level: string) => {
  if (_level === undefined) return LEVELS.debug; // default

  const asString = String(_level).toLowerCase();
  if (LEVELS[asString as keyof typeof LEVELS] !== undefined) {
    return LEVELS[asString as keyof typeof LEVELS];
  }

  throw new EnvError(`Invalid VERBOSITY value: ${_level}`);
});

export default (): { app: AppConfig } => {
  const env = cleanEnv(process.env, {
    PORT: port({ default: 3500 }),
    ENTRY_POINT_ADDRESS: addressArray(),
    PAYMASTER_ADDRESS: address(),
    CHAIN_ID: num({ default: 1337 }),
    PROVIDER_URL: url(),
    BUNDLER_URL: url(),
    TIME_RANGE_UNTIL: num({ default: 600 }),
    TIME_RANGE_AFTER: num({ default: 60 }),
    PM_POST_OP_GAS_LIMIT: num({ default: 40000 }),
    PM_VERIFICATION_GAS_LIMIT: num({ default: 30000 }),
    PM_SIGNER_PK: hex(),
    NODE_ENV: str({ choices: ['development'] }),
    VERBOSITY: level({ default: LEVELS.debug }),
  });
  const app = {
    port: env.PORT,
    verbosity: env.VERBOSITY,
    nodeEnv: env.NODE_ENV,
    entryPointAddress: env.ENTRY_POINT_ADDRESS,
    paymasterAddress: env.PAYMASTER_ADDRESS,
    chainId: env.CHAIN_ID,
    providerUrl: env.PROVIDER_URL,
    bundlerUrl: env.BUNDLER_URL,
    timeUntil: env.TIME_RANGE_UNTIL,
    timeAfter: env.TIME_RANGE_AFTER,
    pmPostOpGasLimit: env.PM_POST_OP_GAS_LIMIT,
    pmVerificationGasLimit: env.PM_VERIFICATION_GAS_LIMIT,
    pmSignerKey: env.PM_SIGNER_PK,
  };

  return {
    app,
  };
};
