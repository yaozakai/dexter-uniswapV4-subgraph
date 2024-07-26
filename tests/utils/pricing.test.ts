import { BigDecimal } from '@graphprotocol/graph-ts'
import { assert, describe, test } from 'matchstick-as/assembly/index'

import { calculateAmountUSD } from '../../src/utils/pricing'

describe('Price calculations', () => {
  test('calculateAmountUSD calculates correctly', () => {
    const amount0 = BigDecimal.fromString('100')
    const amount1 = BigDecimal.fromString('200')
    const token0DerivedETH = BigDecimal.fromString('0.1')
    const token1DerivedETH = BigDecimal.fromString('0.2')
    const ethPriceUSD = BigDecimal.fromString('1000')

    const result = calculateAmountUSD(amount0, amount1, token0DerivedETH, token1DerivedETH, ethPriceUSD)

    // Expected result: (100 * 0.1 * 1000) + (200 * 0.2 * 1000) = 10000 + 40000 = 50000
    assert.assertTrue(result.equals(BigDecimal.fromString('50000')), 'Result should be 50000')
  })

  test('calculateAmountUSD handles zero amounts', () => {
    const amount0 = BigDecimal.fromString('0')
    const amount1 = BigDecimal.fromString('0')
    const token0DerivedETH = BigDecimal.fromString('0.1')
    const token1DerivedETH = BigDecimal.fromString('0.2')
    const ethPriceUSD = BigDecimal.fromString('1000')

    const result = calculateAmountUSD(amount0, amount1, token0DerivedETH, token1DerivedETH, ethPriceUSD)

    assert.assertTrue(result.equals(BigDecimal.fromString('0')), 'Result should be 0')
  })

  test('calculateAmountUSD handles very large numbers', () => {
    const amount0 = BigDecimal.fromString('1000000000000000000') // 1e18
    const amount1 = BigDecimal.fromString('2000000000000000000') // 2e18
    const token0DerivedETH = BigDecimal.fromString('0.1')
    const token1DerivedETH = BigDecimal.fromString('0.2')
    const ethPriceUSD = BigDecimal.fromString('1000')

    const result = calculateAmountUSD(amount0, amount1, token0DerivedETH, token1DerivedETH, ethPriceUSD)

    // Expected result: (1e18 * 0.1 * 1000) + (2e18 * 0.2 * 1000) = 1e20 + 4e20 = 5e20
    assert.assertTrue(result.equals(BigDecimal.fromString('500000000000000000000')), 'Result should be 5e20')
  })
})
