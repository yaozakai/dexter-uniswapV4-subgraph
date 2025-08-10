import { Address, BigInt } from '@graphprotocol/graph-ts'

import { ERC20 } from '../types/PoolManager/ERC20'
import { ERC20NameBytes } from '../types/PoolManager/ERC20NameBytes'
import { ERC20SymbolBytes } from '../types/PoolManager/ERC20SymbolBytes'
import { ADDRESS_ZERO, ZERO_BI } from './constants'
import { isNullEthValue } from './index'
import { logWarning } from './logging'
import { NativeTokenDetails } from './nativeTokenDetails'
import { getStaticDefinition, StaticTokenDefinition } from './staticTokenDefinition'

export function fetchTokenSymbol(
  tokenAddress: Address,
  tokenOverrides: StaticTokenDefinition[],
  nativeTokenDetails: NativeTokenDetails,
): string {
  if (tokenAddress.equals(Address.fromString(ADDRESS_ZERO))) {
    return nativeTokenDetails.symbol
  }
  // try with the static definition
  const staticTokenDefinition = getStaticDefinition(tokenAddress, tokenOverrides)
  if (staticTokenDefinition != null) {
    return staticTokenDefinition.symbol
  }

  const contract = ERC20.bind(tokenAddress)
  const contractSymbolBytes = ERC20SymbolBytes.bind(tokenAddress)

  // try types string and bytes32 for symbol
  let symbolValue = 'unknown'
  const symbolResult = contract.try_symbol()
  if (symbolResult.reverted) {
    const symbolResultBytes = contractSymbolBytes.try_symbol()
    if (!symbolResultBytes.reverted && !isNullEthValue(symbolResultBytes.value.toHexString())) {
      // for broken pairs that have no symbol function exposed
      if (!isNullEthValue(symbolResultBytes.value.toHexString())) {
        symbolValue = symbolResultBytes.value.toString()
      }
    }
  } else {
    symbolValue = symbolResult.value
  }

  return symbolValue
}

export function fetchTokenName(
  tokenAddress: Address,
  tokenOverrides: StaticTokenDefinition[],
  nativeTokenDetails: NativeTokenDetails,
): string {
  if (tokenAddress.equals(Address.fromString(ADDRESS_ZERO))) {
    return nativeTokenDetails.name
  }
  // try with the static definition
  const staticTokenDefinition = getStaticDefinition(tokenAddress, tokenOverrides)
  if (staticTokenDefinition != null) {
    return staticTokenDefinition.name
  }

  const contract = ERC20.bind(tokenAddress)
  const contractNameBytes = ERC20NameBytes.bind(tokenAddress)

  // try types string and bytes32 for name
  let nameValue = 'unknown'
  const nameResult = contract.try_name()
  if (nameResult.reverted) {
    const nameResultBytes = contractNameBytes.try_name()
    if (!nameResultBytes.reverted) {
      // for broken exchanges that have no name function exposed
      if (!isNullEthValue(nameResultBytes.value.toHexString())) {
        nameValue = nameResultBytes.value.toString()
      }
    }
  } else {
    nameValue = nameResult.value
  }

  return nameValue
}

export function fetchTokenTotalSupply(tokenAddress: Address): BigInt {
  if (tokenAddress.equals(Address.fromString(ADDRESS_ZERO))) {
    return ZERO_BI
  }
  const contract = ERC20.bind(tokenAddress)
  let totalSupplyValue = BigInt.zero()

  // Add retry logic and better error handling for reorgs
  const totalSupplyResult = contract.try_totalSupply()
  if (!totalSupplyResult.reverted) {
    totalSupplyValue = totalSupplyResult.value
  } else {
    // Log the error but don't fail the entire indexing process
    logWarning(
      'fetchTokenTotalSupply',
      `Failed to fetch totalSupply for token ${tokenAddress.toHexString()}, likely due to reorg or non-standard token contract`,
    )
    // Return zero if the call fails (commonly due to reorgs or non-standard tokens)
    totalSupplyValue = ZERO_BI
  }
  return totalSupplyValue
}

export function fetchTokenDecimals(
  tokenAddress: Address,
  tokenOverrides: StaticTokenDefinition[],
  nativeTokenDetails: NativeTokenDetails,
): BigInt | null {
  if (tokenAddress.equals(Address.fromString(ADDRESS_ZERO))) {
    return nativeTokenDetails.decimals
  }
  // try with the static definition
  const staticTokenDefinition = getStaticDefinition(tokenAddress, tokenOverrides)
  if (staticTokenDefinition) {
    return staticTokenDefinition.decimals
  }

  const contract = ERC20.bind(tokenAddress)
  // try types uint8 for decimals
  const decimalResult = contract.try_decimals()

  if (!decimalResult.reverted) {
    if (decimalResult.value.lt(BigInt.fromI32(255))) {
      return decimalResult.value
    }
  }

  return null
}
