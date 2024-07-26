import { Address, BigDecimal, dataSource } from '@graphprotocol/graph-ts'

import { StaticTokenDefinition } from './staticTokenDefinition'

export enum ChainId {
  SEPOLIA = 11155111,
}

// assemblyscript does not support string enums, hence these constants
const SEPOLIA_NETWORK_NAME = 'sepolia'

// Note: All token and pool addresses should be lowercased!
export class SubgraphConfig {
  // deployment address
  // e.g. https://docs.uniswap.org/contracts/v3/reference/deployments/ethereum-deployments
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
}

export function getSubgraphConfig(): SubgraphConfig {
  // Update this value to the corresponding chain you want to deploy
  const selectedNetwork = dataSource.network()

  if (selectedNetwork == SEPOLIA_NETWORK_NAME) {
    return {
      poolManagerAddress: '0xc021A7Deb4a939fd7E661a0669faB5ac7Ba2D5d6',
      stablecoinWrappedNativePoolId: '0xa40318dea5fabf21971f683f641b54d6d7d86f5b083cd6f0af9332c5c7a9ec06', // todo(matteen): use sepolia WETH/USDC pool
      stablecoinIsToken0: true,
      wrappedNativeAddress: '0xc268035619873d85461525f5fdb792dd95982161', // todo(matteen): use sepolia WETH
      minimumNativeLocked: BigDecimal.fromString('20'),
      stablecoinAddresses: [
        '0xbe2a7f5acecdc293bf34445a0021f229dd2edd49', // USDC
      ],
      whitelistTokens: [
        '0xc268035619873d85461525f5fdb792dd95982161', // todo(matteen): use sepolia WETH
        '0xbe2a7f5acecdc293bf34445a0021f229dd2edd49', // USDC
      ],
      tokenOverrides: [],
      poolsToSkip: [],
      poolMappings: [],
    }
  } else {
    throw new Error('Unsupported Network')
  }
}
