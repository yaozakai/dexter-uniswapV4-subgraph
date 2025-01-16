import { Address, BigDecimal, BigInt, dataSource } from '@graphprotocol/graph-ts'

import { NativeTokenDetails } from './nativeTokenDetails'
import { StaticTokenDefinition } from './staticTokenDefinition'

export enum ChainId {
  SEPOLIA = 11155111,
}

// assemblyscript does not support string enums, hence these constants
const SEPOLIA_NETWORK_NAME = 'sepolia'
const UNICHAIN_SEPOLIA_NETWORK_NAME = 'unichain-sepolia'
const ARBITRUM_SEPOLIA_NETWORK_NAME = 'arbitrum-sepolia'
const BASE_SEPOLIA_NETWORK_NAME = 'base-sepolia'

// Note: All token and pool addresses should be lowercased!
export class SubgraphConfig {
  // deployment address
  poolManagerAddress: string

  // the address of a pool where one token is a stablecoin and the other is a
  // token that tracks the price of the native token use this to calculate the
  // price of the native token, so prefer a pool with highest liquidity
  stablecoinWrappedNativePoolId: string

  // true is stablecoin is token0, false if stablecoin is token1
  stablecoinIsToken0: boolean

  // the address of a token that tracks the price of the native token, most of
  // the time, this is a wrapped asset but could also be the native token itself
  // for some chains
  wrappedNativeAddress: string

  // the mimimum liquidity in a pool needed for it to be used to help calculate
  // token prices. for new chains, this should be initialized to ~4000 USD
  minimumNativeLocked: BigDecimal

  // list of stablecoin addresses
  stablecoinAddresses: string[]

  // a token must be in a pool with one of these tokens in order to derive a
  // price (in addition to passing the minimumEthLocked check). This is also
  // used to determine whether volume is tracked or not.
  whitelistTokens: string[]

  // token overrides are used to override RPC calls for the symbol, name, and
  // decimals for tokens. for new chains this is typically empty.
  tokenOverrides: StaticTokenDefinition[]

  // skip the creation of these pools in handlePoolCreated. for new chains this is typically empty.
  poolsToSkip: string[]

  // initialize this list of pools and token addresses on factory creation. for new chains this is typically empty.
  poolMappings: Array<Address[]>

  // native token details for the chain.
  nativeTokenDetails: NativeTokenDetails
}

export function getSubgraphConfig(): SubgraphConfig {
  // Update this value to the corresponding chain you want to deploy
  const selectedNetwork = dataSource.network()

  if (selectedNetwork == SEPOLIA_NETWORK_NAME) {
    return {
      poolManagerAddress: '0xE03A1074c86CFeDd5C142C4F04F1a1536e203543',
      stablecoinWrappedNativePoolId: '0xabdb9820d36431e092c155f7151c4c781f09fb4e1b7894fa918a0aadcac87e16',
      stablecoinIsToken0: true,
      wrappedNativeAddress: '0xfff9976782d46cc05630d1f6ebab18b2324d6b14', // WETH
      minimumNativeLocked: BigDecimal.fromString('1'),
      stablecoinAddresses: [
        '0x1c7d4b196cb0c7b01d743fbc6116a902379c7238', // USDC
        '0xaa8e23fb1079ea71e0a56f48a2aa51851d8433d0', // USDT
      ],
      whitelistTokens: [
        '0x0000000000000000000000000000000000000000', // Native ETH
        '0x1c7d4b196cb0c7b01d743fbc6116a902379c7238', // USDC
        '0xaa8e23fb1079ea71e0a56f48a2aa51851d8433d0', // USDT,
        '0xfff9976782d46cc05630d1f6ebab18b2324d6b14', // WETH
      ],
      tokenOverrides: [],
      poolsToSkip: [],
      poolMappings: [],
      nativeTokenDetails: {
        symbol: 'ETH',
        name: 'Ethereum',
        decimals: BigInt.fromI32(18),
      },
    }
  } else if (selectedNetwork == UNICHAIN_SEPOLIA_NETWORK_NAME) {
    return {
      poolManagerAddress: '0x00b036b58a818b1bc34d502d3fe730db729e62ac',
      stablecoinWrappedNativePoolId: '0x1927686e9757bb312fc499e480536d466c788dcdc86a1b62c82643157f05b603', // https://unichain-sepolia.blockscout.com/tx/0x6461a80bbdd78222097c8f0437952dba852f25c3822df50660e347ccd6436f6f?tab=logs
      stablecoinIsToken0: true,
      wrappedNativeAddress: '0x4200000000000000000000000000000000000006', // WETH
      minimumNativeLocked: BigDecimal.fromString('1'),
      stablecoinAddresses: [
        '0x31d0220469e10c4E71834a79b1f276d740d3768F', // USDC
      ],
      whitelistTokens: [
        '0x0000000000000000000000000000000000000000', // Native ETH
        '0x31d0220469e10c4E71834a79b1f276d740d3768F', // USDC
        '0x4200000000000000000000000000000000000006', // WETH
      ],
      tokenOverrides: [],
      poolsToSkip: [],
      poolMappings: [],
      nativeTokenDetails: {
        symbol: 'ETH',
        name: 'Ethereum',
        decimals: BigInt.fromI32(18),
      },
    }
  } else if (selectedNetwork == ARBITRUM_SEPOLIA_NETWORK_NAME) {
    return {
      poolManagerAddress: '0xFB3e0C6F74eB1a21CC1Da29aeC80D2Dfe6C9a317',
      stablecoinWrappedNativePoolId: '', // no v4 pool exists on arbitrum sepolia yet, this will result in $0 prices
      stablecoinIsToken0: true,
      wrappedNativeAddress: '0x980B62Da83eFf3D4576C647993b0c1D7faf17c73', // WETH
      minimumNativeLocked: BigDecimal.fromString('1'),
      stablecoinAddresses: [
        '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d', // USDC
      ],
      whitelistTokens: [
        '0x0000000000000000000000000000000000000000', // Native ETH
        '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d', // USDC
        '0x980B62Da83eFf3D4576C647993b0c1D7faf17c73', // WETH
      ],
      tokenOverrides: [],
      poolsToSkip: [],
      poolMappings: [],
      nativeTokenDetails: {
        symbol: 'ETH',
        name: 'Ethereum',
        decimals: BigInt.fromI32(18),
      },
    }
  } else if (selectedNetwork == BASE_SEPOLIA_NETWORK_NAME) {
    return {
      poolManagerAddress: '0x05E73354cFDd6745C338b50BcFDfA3Aa6fA03408',
      stablecoinWrappedNativePoolId: '0xCAFE1EC4F71A632F8FC57506C478D0B25B399A9AA003C9BC02C444639578AE46', // https://sepolia.basescan.org/tx/0xa8a8ad7ed9fe1e44ce264f240821a33bfd93a385397b46fd7142deee242be2fa#eventlog
      stablecoinIsToken0: true,
      wrappedNativeAddress: '0x4200000000000000000000000000000000000006', // WETH
      minimumNativeLocked: BigDecimal.fromString('1'),
      stablecoinAddresses: [
        '0x036CbD53842c5426634e7929541eC2318f3dCF7e', // USDC
      ],
      whitelistTokens: [
        '0x0000000000000000000000000000000000000000', // Native ETH
        '0x036CbD53842c5426634e7929541eC2318f3dCF7e', // USDC
        '0x4200000000000000000000000000000000000006', // WETH
      ],
      tokenOverrides: [],
      poolsToSkip: [],
      poolMappings: [],
      nativeTokenDetails: {
        symbol: 'ETH',
        name: 'Ethereum',
        decimals: BigInt.fromI32(18),
      },
    }
  } else {
    throw new Error('Unsupported Network')
  }
}
