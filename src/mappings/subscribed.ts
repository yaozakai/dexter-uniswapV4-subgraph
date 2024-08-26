import { Subscribed as SubscribedEvent } from '../types/PositionManager/PositionManager'
import { Subscribed } from '../types/schema'
import { loadTransaction } from '../utils'
import { eventId, positionId } from '../utils/id'

// The subgraph handler must have this signature to be able to handle events,
// however, we invoke a helper in order to inject dependencies for unit tests.
export function handleSubscribed(event: SubscribedEvent): void {
  handleSubscribedHelper(event)
}

export function handleSubscribedHelper(event: SubscribedEvent): void {
  const subscribed = new Subscribed(eventId(event.transaction.hash, event.logIndex))

  const transaction = loadTransaction(event)

  subscribed.tokenId = event.params.tokenId
  subscribed.address = event.params.subscriber.toHexString()
  subscribed.origin = event.transaction.from.toHexString()
  subscribed.transaction = transaction.id
  subscribed.logIndex = event.logIndex
  subscribed.timestamp = transaction.timestamp
  subscribed.position = positionId(event.params.tokenId)

  subscribed.save()
}
