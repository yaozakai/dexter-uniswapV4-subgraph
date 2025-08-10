import { log } from '@graphprotocol/graph-ts'

/**
 * Enhanced logging utilities for debugging reorg and RPC issues
 */

export function logError(
  context: string,
  error: string,
  blockNumber: string = 'unknown',
  txHash: string = 'unknown',
): void {
  log.error('[ERROR] {} - Block: {} - Tx: {} - Error: {}', [context, blockNumber, txHash, error])
}

export function logWarning(
  context: string,
  message: string,
  blockNumber: string = 'unknown',
  txHash: string = 'unknown',
): void {
  log.warning('[WARNING] {} - Block: {} - Tx: {} - Message: {}', [context, blockNumber, txHash, message])
}

export function logInfo(
  context: string,
  message: string,
  blockNumber: string = 'unknown',
  txHash: string = 'unknown',
): void {
  log.info('[INFO] {} - Block: {} - Tx: {} - Message: {}', [context, blockNumber, txHash, message])
}

export function logReorgWarning(blockHash: string, blockNumber: string, context: string): void {
  log.warning('[REORG_WARNING] Potential reorg detected - Context: {} - Block: {} - Hash: {}', [
    context,
    blockNumber,
    blockHash,
  ])
}

export function logRpcError(method: string, contract: string, blockNumber: string, error: string): void {
  log.error('[RPC_ERROR] Method: {} - Contract: {} - Block: {} - Error: {}', [method, contract, blockNumber, error])
}
