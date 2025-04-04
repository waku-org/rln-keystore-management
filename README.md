# Waku Keystore Management

Application to manage Waku RLN keystores.

## Overview

This application provides an interface for managing keystores for Waku's rate-limiting nullifier (RLN) functionality. It integrates with MetaMask for wallet connectivity.

## Features

- Connect to MetaMask wallet with dropdown menu for account details
- Terminal-inspired UI with cyberpunk styling
- View wallet information including address, network, and balance
- Support for Linea Sepolia testnet only
- Keystore management with copy, view, export, and remove functionality
- Token approval for RLN membership registration
- Light/standard RLN implementation toggle


## Linea Sepolia Network

This application is configured to use ONLY the Linea Sepolia testnet. If you don't have Linea Sepolia configured in your MetaMask, the application will help you add it with the following details:

- **Network Name**: Linea Sepolia Testnet
- **RPC URL**: https://rpc.sepolia.linea.build
- **Chain ID**: 59141
- **Currency Symbol**: ETH
- **Block Explorer URL**: https://sepolia.lineascan.build

You can get Linea Sepolia testnet ETH from the [Linea Faucet](https://faucet.goerli.linea.build/).

## RLN Membership Registration

When registering for RLN membership, you'll need to complete two transactions:

1. **Token Approval**: First, you'll need to approve the RLN contract to spend tokens on your behalf. This is a one-time approval.
2. **Membership Registration**: After approval, the actual membership registration transaction will be submitted.

If you encounter an "ERC20: insufficient allowance" error, it means the token approval transaction was not completed successfully. Please try again and make sure to approve the token spending in your wallet.

## TODO
- [ ] add info about using with nwaku/nwaku-compose/waku-simulator
- [ ] fix rate limit fetch