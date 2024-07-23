import { BigInt, ByteArray } from '@graphprotocol/graph-ts'
import { MaxUint256, ONE_BI, Q96, ZERO_BI } from './constants'

// https://github.com/Uniswap/sdks/blob/92b765bdf2759e5e6639a01728a96df81efbaa2b/sdks/v3-sdk/src/utils/tickMath.ts

function mulShift(val: BigInt, mul: BigInt): BigInt {
    return val.times(mul).rightShift(128)
}
export abstract class TickMath {
  /**
   * Cannot be constructed.
   */
  private constructor() {}

  /**
   * The minimum tick that can be used on any pool.
   */
  public static MIN_TICK: number = -887272
  /**
   * The maximum tick that can be used on any pool.
   */
  public static MAX_TICK: number = -TickMath.MIN_TICK

  /**
   * The sqrt ratio corresponding to the minimum tick that could be used on any pool.
   */
  public static MIN_SQRT_RATIO: BigInt = BigInt.fromString('4295128739')
  /**
   * The sqrt ratio corresponding to the maximum tick that could be used on any pool.
   */
  public static MAX_SQRT_RATIO: BigInt = BigInt.fromString('1461446703485210103287273052203988822378723970342')

  /**
   * Returns the sqrt ratio as a Q64.96 for the given tick. The sqrt ratio is computed as sqrt(1.0001)^tick
   * @param tick the tick for which to compute the sqrt ratio
   */
  public static getSqrtRatioAtTick(tick: i32): BigInt {
        if (tick < TickMath.MIN_TICK || tick > TickMath.MAX_TICK) {
            throw new Error('TICK')
        }
        const absTick: i32 = tick < 0 ? -tick : tick

        let ratio: BigInt =
        (absTick & 0x1) != 0
        ? BigInt.fromString('340265354078544963557816517032075149313')
        : BigInt.fromString('340282366920938463463374607431768211456')
        if ((absTick & 0x2) != 0) ratio = mulShift(ratio, BigInt.fromString('340248342086729790484326174814286782778'))
        if ((absTick & 0x4) != 0) ratio = mulShift(ratio, BigInt.fromString('340214320654664324051920982716015181260'))
        if ((absTick & 0x8) != 0) ratio = mulShift(ratio, BigInt.fromString('340146287995602323631171512101879684304'))
        if ((absTick & 0x10) != 0) ratio = mulShift(ratio, BigInt.fromString('340010263488231146823593991679159461444'))
        if ((absTick & 0x20) != 0) ratio = mulShift(ratio, BigInt.fromString('339738377640345403697157401104375502016'))
        if ((absTick & 0x40) != 0) ratio = mulShift(ratio, BigInt.fromString('339195258003219555707034227454543997025'))
        if ((absTick & 0x80) != 0) ratio = mulShift(ratio, BigInt.fromString('338111622100601834656805679988414885971'))
        if ((absTick & 0x100) != 0) ratio = mulShift(ratio, BigInt.fromString('335954724994790223023589805789778977700'))
        if ((absTick & 0x200) != 0) ratio = mulShift(ratio, BigInt.fromString('331682121138379247127172139078559817300'))
        if ((absTick & 0x400) != 0) ratio = mulShift(ratio, BigInt.fromString('323299236684853023288211250268160618739'))
        if ((absTick & 0x800) != 0) ratio = mulShift(ratio, BigInt.fromString('307163716377032989948697243942600083929'))
        if ((absTick & 0x1000) != 0) ratio = mulShift(ratio, BigInt.fromString('277268403626896220162999269216087595045'))
        if ((absTick & 0x2000) != 0) ratio = mulShift(ratio, BigInt.fromString('225923453940442621947126027127485391333'))
        if ((absTick & 0x4000) != 0) ratio = mulShift(ratio, BigInt.fromString('149997214084966997727330242082538205943'))
        if ((absTick & 0x8000) != 0) ratio = mulShift(ratio, BigInt.fromString('66119101136024775622716233608466517926'))
        if ((absTick & 0x10000) != 0) ratio = mulShift(ratio, BigInt.fromString('12847376061809297530290974190478138313'))
        if ((absTick & 0x20000) != 0) ratio = mulShift(ratio, BigInt.fromString('485053260817066172746253684029974020'))
        if ((absTick & 0x40000) != 0) ratio = mulShift(ratio, BigInt.fromString('691415978906521570653435304214168'))
        if ((absTick & 0x80000) != 0) ratio = mulShift(ratio, BigInt.fromString('1404880482679654955896180642'))
        if (tick > 0) ratio = MaxUint256.div(ratio)

        if (tick > 0) {
            ratio = MaxUint256.div(ratio);
            }
        return ratio.rightShift(32).plus(
            ratio.mod(BigInt.fromI32(2).pow(32)).gt(BigInt.zero()) 
                ? BigInt.fromI32(1) 
                : BigInt.zero()
            ) 
    }
}
