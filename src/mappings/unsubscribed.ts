import { Unsubscribed as UnsubscribedEvent } from '../types/PositionManager/PositionManager'
import { Unsubscribed } from '../types/schema'
import { loadTransaction } from '../utils'
import { eventId, positionId } from '../utils/id'

// The subgraph handler must have this signature to be able to handle events,
// however, we invoke a helper in order to inject dependencies for unit tests.
export function handleUnsubscribed(event: UnsubscribedEvent): void {
  handleUnsubscribedHelper(event)
}

export function handleUnsubscribedHelper(event: UnsubscribedEvent): void {
  const unsubscribed = new Unsubscribed(eventId(event.transaction.hash, event.logIndex))

  const transaction = loadTransaction(event)

  unsubscribed.tokenId = event.params.tokenId
  unsubscribed.address = event.params.subscriber.toHexString()
  unsubscribed.origin = event.transaction.from.toHexString()
  unsubscribed.transaction = transaction.id
  unsubscribed.logIndex = event.logIndex
  unsubscribed.timestamp = transaction.timestamp
  unsubscribed.position = positionId(event.params.tokenId)

  unsubscribed.save()
}
