# ERC4337 paymaster server
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)

This repository provides a reference implementation of a simple paymaster server based on the VerifyingPaymaster.sol smart contract from [eth-infinitism’s account-abstraction](https://github.com/eth-infinitism/account-abstraction/tree/v0.7.0) project. The server is designed to sponsor gas fees for users in an ERC-4337 account abstraction flow by verifying off-chain signatures, following the same logic as the on-chain [`VerifyingPaymaster.sol`](https://github.com/eth-infinitism/account-abstraction/blob/v0.7.0/contracts/samples/VerifyingPaymaster.sol).

The server’s API interface is built according to the **[ERC-7677 Paymaster Web Service Capability standard](https://eips.ethereum.org/EIPS/eip-7677)**, enabling seamless integration with ERC-4337 wallets and bundlers. This project serves as a practical starting point for building and testing custom paymaster logic and sponsorship flows in modern Ethereum dApps.


> [!IMPORTANT]
> This server only supports the `pm_getPaymasterData` and `pm_getPaymasterStubData` APIs.
> It does not support payments using ERC20 tokens.

## Quick start: Simple ERC-4337 Pacakge
<div align="center">

<img src="./asset/package.png" width="65%">

</div>
<br/>

To run a Paymaster, you must have the full infrastructure in place — **EntryPoint, Bundler, and a Smart Wallet**, along with a **script** capable of interacting with the Smart Wallet.
The [simple-erc4337-package](https://github.com/imelon2/simple-erc4337-package) provides a one-command setup that launches this entire stack locally. We recommend using this package to run and experiment with the Paymaster server demo.

> This package includes a [Dockerfile](https://github.com/imelon2/simple-erc4337-package/blob/main/simplePaymasterServer/Dockerfile) that clones the project's GitHub repository inside the Docker VM and starts the server automatically.

## Run Custom Paymaster
1. Set the values shown in `.env.example` as environmental variables. To copy it into a `.env` file:

    ```
    cp .env.example .env
    ```

2. You'll still need to edit some variables, i.e., `PM_SIGNER_PK`, `BUNDLER_URL`, `PROVIDER_URL`, `PAYMASTER_ADDRESS`.
    ```
    BUNDLER_URL=http://127.0.0.1:3000
    PROVIDER_URL=http://127.0.0.1:8545

    PAYMASTER_ADDRESS=
    PM_SIGNER_PK=

    ```

3. run deploy script
    ```
    npm run start:dev
    ```

</br>

# SDK Compatibility
[![Ethereum](https://img.shields.io/badge/Ethereum-3C3C3D?logo=ethereum&logoColor=white)](#)
[![Viem](https://custom-icon-badges.demolab.com/badge/Viem-FFC517?logo=viem-dark)](#)

This server is designed to be fully compatible with [**viem/account-abstraction**](https://viem.sh/account-abstraction) and the SimpleSmartAccount from **[permissionless/accounts](https://docs.pimlico.io/references/permissionless/)**. 
