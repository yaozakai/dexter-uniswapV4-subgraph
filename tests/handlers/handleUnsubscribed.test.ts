import { ethereum } from '@graphprotocol/graph-ts'
import { afterEach, clearStore, describe, test } from 'matchstick-as'

import { handleUnsubscribedHelper } from '../../src/mappings/unsubscribed'
import { Unsubscribed } from '../../src/types/PositionManager/PositionManager'
import {
  assertObjectMatches,
  MOCK_EVENT,
  POSITION_FIXTURE
} from './constants'

class UnsubscribedFixture {
  id: string;
  tokenId: string;
  address: string;
}

const UNSUBSCRIBED_FIXTURE: UnsubscribedFixture = {
  id: MOCK_EVENT.transaction.hash.toHexString() + '-' + MOCK_EVENT.logIndex.toString(),
  tokenId: POSITION_FIXTURE.tokenId.toString(),
  address: MOCK_EVENT.address.toHexString(),
}

const UNSUBSCRIBED_EVENT = new Unsubscribed(
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

describe('handleUnsubscribed', () => {
  afterEach(() => {
    clearStore()
  })

  test('success', () => {
    handleUnsubscribedHelper(UNSUBSCRIBED_EVENT)

    assertObjectMatches('Unsubscribed', UNSUBSCRIBED_FIXTURE.id, [
      ['tokenId', UNSUBSCRIBED_FIXTURE.tokenId],
      ['address', UNSUBSCRIBED_FIXTURE.address],
      ['origin', MOCK_EVENT.transaction.from.toHexString()],
      ['transaction', MOCK_EVENT.transaction.hash.toHexString()],
      ['logIndex', MOCK_EVENT.logIndex.toString()],
      ['timestamp', MOCK_EVENT.block.timestamp.toString()],
      ['position', UNSUBSCRIBED_FIXTURE.tokenId],
    ])
  })
})
