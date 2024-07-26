import { BigInt } from '@graphprotocol/graph-ts'
import { assert, beforeEach, clearStore, describe, test } from 'matchstick-as/assembly/index'

import { ZERO_BI } from '../../../src/utils/constants'
import { getAmount0, getAmount1 } from '../../../src/utils/liquidityMath/liquidityAmounts'

describe('Amount Calculations', () => {
  beforeEach(() => {
    clearStore()
  })

  describe('getAmount0', () => {
    test('returns correct amount when current tick is below lower tick', () => {
      const result = getAmount0(-10, 10, -20, BigInt.fromI32(1000000))
      assert.bigIntEquals(result, BigInt.fromI32(1000))
    })

    test('returns correct amount when current tick is between lower and upper tick', () => {
      const result = getAmount0(-10, 10, 0, BigInt.fromI32(1000000))
      assert.assertTrue(result > ZERO_BI, 'Result should be greater than zero')
      assert.assertTrue(result < BigInt.fromI32(1000000), 'Result should be less than 1000000')
    })

    test('returns zero when current tick is above upper tick', () => {
      const result = getAmount0(-10, 10, 20, BigInt.fromI32(1000000))
      assert.bigIntEquals(result, ZERO_BI)
    })

    test('handles edge case with minimum tick', () => {
      const result = getAmount0(-887272, 0, -887272, BigInt.fromI32(1000000))
      assert.assertTrue(result > ZERO_BI, 'Result should be greater than zero')
    })

    test('handles edge case with maximum tick', () => {
      const result = getAmount0(0, 887272, 887272, BigInt.fromI32(1000000))
      assert.bigIntEquals(result, ZERO_BI)
    })
  })

  describe('getAmount1', () => {
    test('returns zero when current tick is below lower tick', () => {
      const result = getAmount1(-10, 10, -20, BigInt.fromI32(1000000))
      assert.bigIntEquals(result, ZERO_BI)
    })

    test('returns correct amount when current tick is between lower and upper tick', () => {
      const result = getAmount1(-10, 10, 0, BigInt.fromI32(1000000))
      assert.assertTrue(result > ZERO_BI, 'Result should be greater than zero')
      assert.assertTrue(result < BigInt.fromI32(1000000), 'Result should be less than 1000000')
    })

    test('returns correct amount when current tick is above upper tick', () => {
      const result = getAmount1(-10, 10, 20, BigInt.fromI32(1000000))
      assert.bigIntEquals(result, BigInt.fromI32(1000))
    })

    test('handles edge case with minimum tick', () => {
      const result = getAmount1(-887272, 0, -887272, BigInt.fromI32(1000000))
      assert.bigIntEquals(result, ZERO_BI)
    })

    test('handles edge case with maximum tick', () => {
      const result = getAmount1(0, 887272, 887272, BigInt.fromI32(1000000))
      assert.assertTrue(result > ZERO_BI, 'Result should be greater than zero')
    })
  })
})
