import { BigDecimal, BigInt } from '@graphprotocol/graph-ts'

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'

export const ZERO_BI = BigInt.fromI32(0)
export const ONE_BI = BigInt.fromI32(1)
export const ZERO_BD = BigDecimal.fromString('0')
export const ONE_BD = BigDecimal.fromString('1')
export const BI_18 = BigInt.fromI32(18)
export const Q96 = BigInt.fromI32(2).pow(96)
export const MaxUint256 = BigInt.fromString(
  '115792089237316195423570985008687907853269984665640564039457584007913129639935',
)
