import type { t } from '../core/decimal.js'
import { make, NAN, INFINITY, NEG_INFINITY, ZERO, NEG_ZERO } from '../core/make.js'
import { cmp } from './cmp.js'
import { add } from './add.js'
import { sub } from './sub.js'

function _div(lhs: t, rhs: t, frac_count: number): t {
  const maxDp = Math.max(lhs.getDecimalPlaces(), rhs.getDecimalPlaces())
  const retNeg = lhs.isNeg() !== rhs.isNeg()
  lhs = lhs.clone().moveDpp(maxDp).setNeg(false)
  rhs = rhs.clone().moveDpp(maxDp).setNeg(false)

  const ONE = make(1)
  let ret = make(0)
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
      pow -= 1
    }
    // lhs 为余数
    lhs = sub(lhs, rhs_up)
    // 商加上 1 * pow(10, 放大的程度)
    ret = add(ret, ONE.clone().moveDpp(pow))

    // 当前恰好除尽，提前退出
    if (cmpResult === 0) {
      return ret.setNeg(retNeg)
    }
  }

  // 开始处理小数部分
  let dp = 0
  while (!lhs.isZero() && frac_count--) {
    --dp
    lhs.moveDpp(1)
    let n = 0
    while (cmp(lhs, rhs) >= 0) {
      lhs = sub(lhs, rhs)
      ++n
    }
    if (n) {
      const m = make(n).moveDpp(dp)
      ret = add(ret, m)
    }
  }

  return ret.setNeg(retNeg)
}
export function div(lhs: t, rhs: t, fracCount = 50): t {
  if (lhs.isNaN() || rhs.isNaN()) return NAN

  const [infinity, other] = lhs.isInfinity() ? [lhs, rhs] : rhs.isInfinity() ? [rhs, lhs] : []
  if (infinity && other) {
    // +-Infinity / +-Infinity = NaN
    if (other.isInfinity()) return NAN
    if (infinity === lhs) {
      return infinity.isNeg() === other.isNeg() ? INFINITY : NEG_INFINITY
    }
    return infinity.isNeg() === other.isNeg() ? ZERO : NEG_ZERO
  }

  if (lhs.isZero()) {
    if (rhs.isZero()) return NAN
    return lhs.isNeg() === rhs.isNeg() ? ZERO : NEG_ZERO
  }
  if (rhs.isZero()) {
    return lhs.isNeg() === rhs.isNeg() ? INFINITY : NEG_INFINITY
  }

  if (rhs.isOne()) return lhs.clone().setNeg(lhs.isNeg() !== rhs.isNeg())

  return _div(lhs, rhs, fracCount)
}
