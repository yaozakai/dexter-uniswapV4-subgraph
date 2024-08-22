import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts'
import { describe, test } from 'matchstick-as'

import { handleMintPositionHelper } from '../../src/mappings/mintPosition'
import { MintPosition } from '../../src/types/PositionManager/PositionManager'
import {
  assertObjectMatches,
  MOCK_EVENT,
  POOL_FEE_TIER_05,
  USDC_MAINNET_FIXTURE,
  WBTC_MAINNET_FIXTURE,
  WETH_MAINNET_FIXTURE
} from './constants'

class PoolKey {
  id: string;
  token0: string;
  token1: string;
  fee: i32;
  tickSpacing: i32;
  hooks: string;
}

class PositionConfig {
  id: string;
  poolKey: PoolKey;
  tickLower: i32;
  tickUpper: i32;
}

class MintPositionFixture {
  id: string;
  tokenId: string;
  positionConfig: PositionConfig;
}

const MINT_POSITION_FIXTURE: MintPositionFixture = {
  id: MOCK_EVENT.transaction.hash.toHexString() + '#' + MOCK_EVENT.logIndex.toString(),
  tokenId: '1',
  positionConfig: {
    id: '1',
    poolKey: {
      id: `${Address.fromString(USDC_MAINNET_FIXTURE.address).toHexString()}#${Address.fromString(WETH_MAINNET_FIXTURE.address).toHexString()}#${POOL_FEE_TIER_05}#${10}#${Address.fromString(WBTC_MAINNET_FIXTURE.address).toHexString()}`,
      token0: USDC_MAINNET_FIXTURE.address,
      token1: WETH_MAINNET_FIXTURE.address,
      fee: POOL_FEE_TIER_05,
      tickSpacing: 10,
      hooks: WBTC_MAINNET_FIXTURE.address
    },
    tickLower: 101,
    tickUpper: 201
  },
}

const poolKeyTupleArray: Array<ethereum.Value> = [
  ethereum.Value.fromAddress(Address.fromString(USDC_MAINNET_FIXTURE.address)),
  ethereum.Value.fromAddress(Address.fromString(WETH_MAINNET_FIXTURE.address)),
  ethereum.Value.fromI32(MINT_POSITION_FIXTURE.positionConfig.poolKey.fee as i32),
  ethereum.Value.fromI32(MINT_POSITION_FIXTURE.positionConfig.poolKey.tickSpacing as i32),
  ethereum.Value.fromAddress(Address.fromString(MINT_POSITION_FIXTURE.positionConfig.poolKey.hooks))
]
const poolKeyTuple = changetype<ethereum.Tuple>(poolKeyTupleArray)

const configTupleArray: Array<ethereum.Value> = [
  ethereum.Value.fromTuple(poolKeyTuple),
  ethereum.Value.fromI32(MINT_POSITION_FIXTURE.positionConfig.tickLower as i32),
  ethereum.Value.fromI32(MINT_POSITION_FIXTURE.positionConfig.tickUpper as i32)
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
    new ethereum.EventParam('tokenId', ethereum.Value.fromUnsignedBigInt(BigInt.fromString(MINT_POSITION_FIXTURE.tokenId))),
    new ethereum.EventParam('config', ethereum.Value.fromTuple(configTuple)),
  ],
  MOCK_EVENT.receipt,
)

describe('handleMintPosition', () => {
  test('success', () => {
    handleMintPositionHelper(MINT_POSITION_EVENT)

    assertObjectMatches('MintPosition', MINT_POSITION_FIXTURE.id, [
      ['tokenId', MINT_POSITION_FIXTURE.tokenId],
      ['origin', MOCK_EVENT.transaction.from.toHexString()],
      ['transaction', MOCK_EVENT.transaction.hash.toHexString()],
      ['logIndex', MOCK_EVENT.logIndex.toString()],
      ['timestamp', MOCK_EVENT.block.timestamp.toString()],
    ])

    assertObjectMatches('PositionConfig', MINT_POSITION_FIXTURE.positionConfig.id, [
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
  })
})
