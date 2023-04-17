import type { t } from '../core/decimal.js'
import { NAN } from '../core/make.js'
import { cmp } from './cmp.js'
import { sub } from './sub.js'

export function mod(lhs: t, rhs: t): t {
  if (lhs.isNaN() || rhs.isNaN() || lhs.isInfinity()) return NAN
  if (rhs.isInfinity()) return lhs.clone()

  const retNeg = lhs.isNeg()
  const maxDp = Math.max(lhs.getDecimalPlaces(), rhs.getDecimalPlaces())
  lhs = lhs.clone().moveDpp(maxDp).setNeg(false)
  rhs = rhs.clone().moveDpp(maxDp).setNeg(false)
  while (cmp(lhs, rhs) >= 0) {
    // 减少计算次数，尝试临时放大 rhs，放大到接近 lhs 的大小
    const lCount = lhs.getIntegerCount()
    const rCount = rhs.getIntegerCount()
    // 1. 尝试放大到位数相同
    let pow = lCount - rCount
    let rhs_up = rhs.clone().moveDpp(pow)
    // 2. 检查是否放大过头，如果是，则回退一位
    const cmpResult = cmp(lhs, rhs_up)
    if (cmpResult == -1) {
      rhs_up.moveDpp(-1)
    }
    // lhs 为阶段余数
    lhs = sub(lhs, rhs_up)

    // 本次迭代恰好除尽，提前返回
    if (cmpResult === 0) {
      break
    }
  }

  return lhs.moveDpp(-maxDp).setNeg(retNeg)
}
