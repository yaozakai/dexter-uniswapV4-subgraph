import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts'
import { afterEach, clearStore, describe, test } from 'matchstick-as'

import { handleMintPositionHelper } from '../../src/mappings/mintPosition'
import { MintPosition } from '../../src/types/PositionManager/PositionManager'
import {
  assertObjectMatches,
  MOCK_EVENT,
  POSITION_CONFIG_FIXTURE,
  POSITION_FIXTURE,
  PositionConfigFixture,
  USDC_MAINNET_FIXTURE,
  WETH_MAINNET_FIXTURE,
} from './constants'

class MintPositionFixture {
  id: string
  tokenId: string
  positionConfig: PositionConfigFixture
}

const MINT_POSITION_FIXTURE: MintPositionFixture = {
  id: MOCK_EVENT.transaction.hash.toHexString() + '-' + MOCK_EVENT.logIndex.toString(),
  tokenId: POSITION_CONFIG_FIXTURE.id,
  positionConfig: POSITION_CONFIG_FIXTURE,
}

const poolKeyTupleArray: Array<ethereum.Value> = [
  ethereum.Value.fromAddress(Address.fromString(USDC_MAINNET_FIXTURE.address)),
  ethereum.Value.fromAddress(Address.fromString(WETH_MAINNET_FIXTURE.address)),
  ethereum.Value.fromI32(MINT_POSITION_FIXTURE.positionConfig.poolKey.fee as i32),
  ethereum.Value.fromI32(MINT_POSITION_FIXTURE.positionConfig.poolKey.tickSpacing as i32),
  ethereum.Value.fromAddress(Address.fromString(MINT_POSITION_FIXTURE.positionConfig.poolKey.hooks)),
]
const poolKeyTuple = changetype<ethereum.Tuple>(poolKeyTupleArray)

const configTupleArray: Array<ethereum.Value> = [
  ethereum.Value.fromTuple(poolKeyTuple),
  ethereum.Value.fromI32(MINT_POSITION_FIXTURE.positionConfig.tickLower as i32),
  ethereum.Value.fromI32(MINT_POSITION_FIXTURE.positionConfig.tickUpper as i32),
]
const configTuple = changetype<ethereum.Tuple>(configTupleArray)

const MINT_POSITION_EVENT = new MintPosition(
  MOCK_EVENT.address,
  MOCK_EVENT.logIndex,
  MOCK_EVENT.transactionLogIndex,
  MOCK_EVENT.logType,
  MOCK_EVENT.block,
  MOCK_EVENT.transaction,
  [
    new ethereum.EventParam(
      'tokenId',
      ethereum.Value.fromUnsignedBigInt(BigInt.fromString(MINT_POSITION_FIXTURE.tokenId)),
    ),
    new ethereum.EventParam('config', ethereum.Value.fromTuple(configTuple)),
  ],
  MOCK_EVENT.receipt,
)

describe('handleMintPosition', () => {
  afterEach(() => {
    clearStore()
  })

  test('success', () => {
    handleMintPositionHelper(MINT_POSITION_EVENT)

    assertObjectMatches('MintPosition', MINT_POSITION_FIXTURE.id, [
      ['tokenId', MINT_POSITION_FIXTURE.tokenId],
      ['position', MINT_POSITION_FIXTURE.tokenId],
      ['positionConfig', MINT_POSITION_FIXTURE.positionConfig.id],
      ['origin', MOCK_EVENT.transaction.from.toHexString()],
      ['transaction', MOCK_EVENT.transaction.hash.toHexString()],
      ['logIndex', MOCK_EVENT.logIndex.toString()],
      ['timestamp', MOCK_EVENT.block.timestamp.toString()],
      ['position', POSITION_FIXTURE.id],
    ])

    assertObjectMatches('PositionConfig', MINT_POSITION_FIXTURE.positionConfig.id, [
      ['poolKey', MINT_POSITION_FIXTURE.positionConfig.poolKey.id],
      ['tokenId', MINT_POSITION_FIXTURE.tokenId],
      ['tickLower', MINT_POSITION_FIXTURE.positionConfig.tickLower.toString()],
      ['tickUpper', MINT_POSITION_FIXTURE.positionConfig.tickUpper.toString()],
    ])

    assertObjectMatches('PoolKey', MINT_POSITION_FIXTURE.positionConfig.poolKey.id, [
      ['token0', MINT_POSITION_FIXTURE.positionConfig.poolKey.token0],
      ['token1', MINT_POSITION_FIXTURE.positionConfig.poolKey.token1],
      ['fee', MINT_POSITION_FIXTURE.positionConfig.poolKey.fee.toString()],
      ['tickSpacing', MINT_POSITION_FIXTURE.positionConfig.poolKey.tickSpacing.toString()],
      ['hooks', Address.fromString(MINT_POSITION_FIXTURE.positionConfig.poolKey.hooks).toHexString()],
    ])

    assertObjectMatches('Position', MINT_POSITION_FIXTURE.tokenId, [
      ['tokenId', MINT_POSITION_FIXTURE.tokenId],
      ['positionConfig', MINT_POSITION_FIXTURE.positionConfig.id],
      ['owner', MOCK_EVENT.transaction.from.toHexString()],
      ['origin', MOCK_EVENT.transaction.from.toHexString()],
    ])
  })
})
