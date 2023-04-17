import type { t } from '../core/decimal.js'
import { Flag } from '../core/decimal.js'
import { make, make2, NAN, INFINITY, NEG_INFINITY, ZERO, NEG_ZERO } from '../core/make.js'
import { cmp } from './cmp.js'
import { add } from './add.js'

export function _sub(lhs: t, rhs: t): t {
  // 处理符号，只需处理（正数减去正数）的形式
  const neg1 = lhs.isNeg()
  const neg2 = rhs.isNeg()
  // (-x)-(-y) -> (y-x)
  if (neg1 && neg2) {
    const temp = rhs.clone().setNeg(false)
    rhs = lhs.clone().setNeg(false)
    lhs = temp
  }
  // (-x)-y -> (-x)+(-y)
  if (neg1 && !neg2) {
    return add(lhs, rhs.clone().setNeg(true))
  }
  // x-(-y) -> (x+y)
  if (!neg1 && neg2) {
    return add(lhs, rhs.clone().setNeg(false))
  }

  // 比较大小
  const cmpResult = cmp(lhs, rhs)
  if (cmpResult === 0) return make(0)

  // 确保 lhs 大于 rhs，否则交换位置，并且最终返回值需要标记为负数
  let retNeg = 0
  if (cmpResult === -1) {
    const temp = rhs
    rhs = lhs
    lhs = temp
    retNeg = 0 | Flag.Neg
  }

  // 计算 lhs、rhs 有多少位小数
  const dp: number = Math.max(lhs.getDecimalPlaces(), rhs.getDecimalPlaces())
  const len = Math.max(lhs.getIntegerCount(), rhs.getIntegerCount())
  // 借位
  let carry = 0
  const digits: number[] = []
  // 逐位相减
  for (let i = -dp, maxLen = len; i < maxLen; ++i) {
    const r = lhs.get(i) - (rhs.get(i) + carry)
    carry = 0
    if (r < 0) {
      digits.push(r + 10)
      carry = 1
    } else {
      digits.push(r)
    }
  }
  digits.reverse()

  const ret = make2(digits, digits.length - dp, retNeg)

  return ret
}
export function sub(lhs: t, rhs: t): t {
  if (lhs.isNaN() || rhs.isNaN()) return NAN

  // 处理 Infinity
  const [infinity, other] = lhs.isInfinity() ? [lhs, rhs] : rhs.isInfinity() ? [rhs, lhs] : []
  if (infinity && other) {
    const neg1 = infinity.isNeg()
    const neg2 = other.isNeg()
    if (other.isInfinity()) {
      if (neg1 === neg2) return make('NaN')
      return lhs.clone()
    }
    if (infinity === lhs) return neg1 ? NEG_INFINITY : INFINITY
    return neg1 ? INFINITY : NEG_INFINITY
  }

  if (lhs.isZero()) {
    if (rhs.isZero()) {
      if (lhs.isNeg() && !rhs.isNeg()) return NEG_ZERO
      return ZERO
    }
    return rhs.clone().toggleNeg()
  }
  if (rhs.isZero()) return lhs.clone()

  // 普通小整数，直接转成原始值运算
  if (lhs.isInt() && rhs.isInt() && lhs.getIntegerCount() < 16 && rhs.getIntegerCount() < 16) {
    return make(lhs.toNumber() - rhs.toNumber())
  }

  return _sub(lhs, rhs)
}
