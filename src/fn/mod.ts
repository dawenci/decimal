import type { t } from '../core/decimal.js'
import { Setting, NAN, NEG_ZERO, ZERO } from '../core/index.js'
import { cmp } from './cmp.js'
import { _sub } from './sub.js'

export function _mod(lhs: t, rhs: t): t {
  // 结果符号
  const retNeg = lhs.isNeg()

  // 减少指数，以 rhs 为准
  const retDppOffset = rhs._getFractionCount()
  let lhs_copy = lhs.clone()._moveDpp(retDppOffset)._setNeg(false)
  let rhs_copy = rhs.clone()._moveDpp(retDppOffset)._setNeg(false)

  const cmpResult = cmp(lhs_copy, rhs_copy)

  if (cmpResult === 0) {
    return lhs.isNeg() ? NEG_ZERO : ZERO
  }

  if (cmpResult === -1) {
    return lhs.clone()
  }

  const rCount = rhs_copy._getIntegerCount()
  let lCount!: number
  let pow!: number
  let rhs_up!: t

  do {
    // 减少计算次数，尝试临时放大 rhs，放大到接近 lhs 的大小
    // 1. 尝试放大到位数相同
    if (lCount !== (lCount = lhs_copy._getIntegerCount())) {
      pow = lCount - rCount
      rhs_up = rhs_copy.clone()._moveDpp(pow)
    }
    // 2. 检查是否放大过头，如果是，则回退一位
    const cmpResult = cmp(lhs_copy, rhs_up)
    if (cmpResult == -1) {
      rhs_up._moveDpp(-1)
      pow -= 1
    }

    // lhs 为余数
    lhs_copy = _sub(lhs_copy, rhs_up, Infinity)

    // 当前恰好除尽，提前退出
    if (cmpResult === 0) {
      return lhs_copy._setNeg(retNeg)._moveDpp(-retDppOffset)
    }
  } while (cmp(lhs_copy, rhs_copy) >= 0) 

  return lhs_copy._setNeg(retNeg)._moveDpp(-retDppOffset)
}

export function mod(lhs: t, rhs: t): t {
  if (lhs.isNaN() || rhs.isNaN() || lhs.isInfinity() || rhs.isZero()) return NAN

  if (lhs.isZero()) return lhs.clone()

  if (rhs.isInfinity()) return lhs.clone().setPrecision()

  return _mod(lhs, rhs).setPrecision()
}
