
import { BigInt } from '@graphprotocol/graph-ts'

import { MintPosition as MintPositionEvent } from '../types/PositionManager/PositionManager'
import { MintPosition, PoolKey, Position, PositionConfig } from '../types/schema'
import { loadTransaction } from '../utils'
import { eventId, poolKeyId, positionId } from '../utils/id'

// The subgraph handler must have this signature to be able to handle events,
// however, we invoke a helper in order to inject dependencies for unit tests.
export function handleMintPosition(event: MintPositionEvent): void {
  handleMintPositionHelper(event)
}

export function handleMintPositionHelper(
  event: MintPositionEvent,
): void {
  const tokenId = event.params.tokenId
  const token0 = event.params.config.poolKey.currency0
  const token1 = event.params.config.poolKey.currency1
  const fee = BigInt.fromI32(event.params.config.poolKey.fee)
  const tickSpacing = BigInt.fromI32(event.params.config.poolKey.tickSpacing)
  const hooks = event.params.config.poolKey.hooks
  const tickLower = BigInt.fromI32(event.params.config.tickLower)
  const tickUpper = BigInt.fromI32(event.params.config.tickUpper)

  const poolKey = new PoolKey(poolKeyId(token0, token1, fee, tickSpacing, hooks))
  poolKey.token0 = token0.toHexString()
  poolKey.token1 = token1.toHexString()
  poolKey.fee = fee
  poolKey.tickSpacing = tickSpacing
  poolKey.hooks = hooks.toHexString()

  const positionConfig = new PositionConfig(positionId(tokenId))
  positionConfig.tokenId = tokenId
  positionConfig.poolKey = poolKey.id
  positionConfig.tickLower = tickLower
  positionConfig.tickUpper = tickUpper

  const position = new Position(positionId(tokenId))
  position.tokenId = tokenId
  position.positionConfig = positionConfig.id
  position.owner = event.transaction.from.toHexString()
  position.origin = event.transaction.from.toHexString()

  const transaction = loadTransaction(event)
  const mintPosition = new MintPosition(eventId(event.transaction.hash, event.logIndex))

  mintPosition.tokenId = tokenId
  mintPosition.positionConfig = positionConfig.id
  mintPosition.origin = event.transaction.from.toHexString()
  mintPosition.transaction = transaction.id
  mintPosition.logIndex = event.logIndex
  mintPosition.timestamp = transaction.timestamp
  mintPosition.position = position.id

  poolKey.save()
  positionConfig.save()
  position.save()
  mintPosition.save()
}
