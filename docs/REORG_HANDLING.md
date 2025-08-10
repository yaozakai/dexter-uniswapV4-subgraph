# Handling Blockchain Reorganizations (Reorgs)

This document explains how to handle the "hash is not currently canonical" error and other reorg-related issues that can occur when indexing blockchain data.

## Understanding the Error

The error you encountered:

```
hash c75bdf0b71bca24dbaf5605ff6274020e4f767a43638f50fb84bdb0aa418baa8 is not currently canonical
```

This occurs when:

1. Your subgraph tries to query a block that was part of a blockchain reorganization
2. The block hash is no longer part of the canonical (main) chain
3. The RPC node can't fulfill requests for data from non-canonical blocks

## Solutions Implemented

### 1. Enhanced Error Handling in Token Utilities

We've updated `src/utils/token.ts` to gracefully handle failed `totalSupply()` calls:

```typescript
export function fetchTokenTotalSupply(tokenAddress: Address): BigInt {
  if (tokenAddress.equals(Address.fromString(ADDRESS_ZERO))) {
    return ZERO_BI
  }
  const contract = ERC20.bind(tokenAddress)
  let totalSupplyValue = BigInt.zero()

  const totalSupplyResult = contract.try_totalSupply()
  if (!totalSupplyResult.reverted) {
    totalSupplyValue = totalSupplyResult.value
  } else {
    // Log warning but continue processing
    logWarning(
      'fetchTokenTotalSupply',
      `Failed to fetch totalSupply for token ${tokenAddress.toHexString()}, likely due to reorg or non-standard token contract`,
    )
    totalSupplyValue = ZERO_BI
  }
  return totalSupplyValue
}
```

### 2. Subgraph Configuration Improvements

Updated `subgraph.yaml` to include:

- `nonFatalErrors`: Already enabled, allows indexing to continue when non-critical errors occur
- `fullTextSearch`: Added for better query capabilities

### 3. Enhanced Logging System

Created `src/utils/logging.ts` with specialized logging functions for debugging reorg issues:

```typescript
logWarning('context', 'message')
logRpcError('method', 'contract', 'blockNumber', 'error')
logReorgWarning('blockHash', 'blockNumber', 'context')
```

### 4. Deployment Scripts with Retry Logic

Created `scripts/deploy-with-retry.js` to handle deployment failures:

```bash
npm run deploy:retry:mainnet
npm run deploy:retry:sepolia
```

## Prevention and Monitoring

### Best Practices

1. **Use `try_` methods**: Always use `contract.try_methodName()` instead of `contract.methodName()` for external calls
2. **Handle reverts gracefully**: Check `result.reverted` before accessing `result.value`
3. **Set reasonable defaults**: Return sensible default values when calls fail
4. **Monitor logs**: Watch for reorg warnings in your subgraph logs

### Monitoring Commands

```bash
# Check subgraph logs
graph logs <your-subgraph-name>

# Build with verbose output
graph build --debug

# Test locally before deploying
npm run test
```

### RPC Endpoint Considerations

- Use reliable RPC providers (Infura, Alchemy, QuickNode)
- Consider using multiple endpoints with failover
- Monitor endpoint health and latency
- Be aware that free tier endpoints may have more reorg-related issues

## Troubleshooting

### When You See This Error Again

1. **Wait and retry**: Reorgs are usually temporary (minutes to hours)
2. **Check the network**: Visit etherscan.io to see if there are network issues
3. **Use the retry deployment script**: `npm run deploy:retry:mainnet`
4. **Monitor the logs**: Look for patterns in the errors

### Emergency Fixes

If your subgraph is completely stuck:

1. **Identify the problematic block range**:

   ```bash
   # Check recent blocks on Etherscan
   # Look for unusual reorg activity
   ```

2. **Consider grafting to a stable block**:

   - Update your `subgraph.yaml` with a grafting configuration
   - Point to a known stable block before the reorg

3. **Contact your RPC provider**: Report persistent canonical hash issues

### Network-Specific Notes

- **Mainnet**: Reorgs are rare but can happen, especially during high network congestion
- **Testnets**: More frequent reorgs, especially on networks with lower hashpower
- **L2s**: Different reorg patterns depending on the rollup mechanism

## Resources

- [The Graph Documentation](https://thegraph.com/docs/)
- [AssemblyScript Documentation](https://www.assemblyscript.org/)
- [Ethereum Block Reorganization](https://ethereum.org/en/developers/docs/consensus-mechanisms/pos/block-proposal/#block-reorganizations)
- [Graph Protocol Discord](https://discord.gg/eM8CA6WA9r)
