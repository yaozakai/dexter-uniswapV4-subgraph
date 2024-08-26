import { ethereum } from '@graphprotocol/graph-ts'
import { afterEach, clearStore, describe, test } from 'matchstick-as'

import { handleSubscribedHelper } from '../../src/mappings/subscribed'
import { Subscribed } from '../../src/types/PositionManager/PositionManager'
import {
  assertObjectMatches,
  MOCK_EVENT,
  POSITION_FIXTURE
} from './constants'

class SubscribedFixture {
  id: string;
  tokenId: string;
  address: string;
}

const SUBSCRIBED_FIXTURE: SubscribedFixture = {
  id: MOCK_EVENT.transaction.hash.toHexString() + '-' + MOCK_EVENT.logIndex.toString(),
  tokenId: POSITION_FIXTURE.tokenId.toString(),
  address: MOCK_EVENT.address.toHexString(),
}

const SUBSCRIBED_EVENT = new Subscribed(
  MOCK_EVENT.address,
  MOCK_EVENT.logIndex,
  MOCK_EVENT.transactionLogIndex,
  MOCK_EVENT.logType,
  MOCK_EVENT.block,
  MOCK_EVENT.transaction,
  [
    new ethereum.EventParam('tokenId', ethereum.Value.fromUnsignedBigInt(POSITION_FIXTURE.tokenId)),
    new ethereum.EventParam('subscriber', ethereum.Value.fromAddress(MOCK_EVENT.address)),
  ],
  MOCK_EVENT.receipt,
)

describe('handleSubscribed', () => {
  afterEach(() => {
    clearStore()
  })

  test('success', () => {
    handleSubscribedHelper(SUBSCRIBED_EVENT)

    assertObjectMatches('Subscribed', SUBSCRIBED_FIXTURE.id, [
      ['tokenId', SUBSCRIBED_FIXTURE.tokenId],
      ['address', SUBSCRIBED_FIXTURE.address],
      ['origin', MOCK_EVENT.transaction.from.toHexString()],
      ['transaction', MOCK_EVENT.transaction.hash.toHexString()],
      ['logIndex', MOCK_EVENT.logIndex.toString()],
      ['timestamp', MOCK_EVENT.block.timestamp.toString()],
      ['position', SUBSCRIBED_FIXTURE.tokenId],
    ])
  })
})
