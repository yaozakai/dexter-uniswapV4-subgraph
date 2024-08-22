
import { BigInt } from '@graphprotocol/graph-ts'

import { MintPosition as MintPositionEvent } from '../types/PositionManager/PositionManager'
import { MintPosition, PoolKey, PositionConfig } from '../types/schema'
import { loadTransaction } from '../utils'

// The subgraph handler must have this signature to be able to handle events,
// however, we invoke a helper in order to inject dependencies for unit tests.
export function handleMintPosition(event: MintPositionEvent): void {
  handleMintPositionHelper(event)
}

export function handleMintPositionHelper(
  event: MintPositionEvent,
): void {
  const tokenId = event.params.tokenId
  const token0 = event.params.config.poolKey.currency0.toHexString()
  const token1 = event.params.config.poolKey.currency1.toHexString()
  const fee = BigInt.fromI32(event.params.config.poolKey.fee)
  const tickSpacing = BigInt.fromI32(event.params.config.poolKey.tickSpacing)
  const hooks = event.params.config.poolKey.hooks.toHexString()
  const tickLower = BigInt.fromI32(event.params.config.tickLower)
  const tickUpper = BigInt.fromI32(event.params.config.tickUpper)

  const poolKey = new PoolKey(`${token0}#${token1}#${fee.toString()}#${tickSpacing.toString()}#${hooks}`)
  poolKey.token0 = token0
  poolKey.token1 = token1
  poolKey.fee = fee
  poolKey.tickSpacing = tickSpacing
  poolKey.hooks = hooks

  const positionConfig = new PositionConfig(tokenId.toString())
  positionConfig.tokenId = tokenId
  positionConfig.poolKey = poolKey.id
  positionConfig.tickLower = tickLower
  positionConfig.tickUpper = tickUpper

  const transaction = loadTransaction(event)
  const mintPosition = new MintPosition(`${transaction.id.toString()}#${event.logIndex.toString()}`)

  mintPosition.tokenId = tokenId
  mintPosition.positionConfig = positionConfig.id
  mintPosition.origin = event.transaction.from.toHexString()
  mintPosition.transaction = transaction.id
  mintPosition.logIndex = event.logIndex
  mintPosition.timestamp = transaction.timestamp

  poolKey.save()
  positionConfig.save()
  mintPosition.save()
}
