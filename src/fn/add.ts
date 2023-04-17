import type { t } from '../core/decimal.js'
import { make, make2, NAN, INFINITY, NEG_INFINITY, ZERO, NEG_ZERO } from '../core/make.js'
import { sub, _sub } from './sub.js'

export function _add(lhs: t, rhs: t): t {
  // 处理符号
  const neg1 = lhs.isNeg()
  const neg2 = rhs.isNeg()
  // (-x)+y -> (y-x)
  if (neg1 && !neg2) {
    return sub(rhs, lhs.clone().setNeg(false))
  }
  // x+(-y) -> (x-y)
  if (!neg1 && neg2) {
    return sub(lhs, rhs.clone().setNeg(false))
  }

  // 计算 lhs、rhs 有多少位小数
  const dp: number = Math.max(lhs.getDecimalPlaces(), rhs.getDecimalPlaces())
  const len = Math.max(lhs.getIntegerCount(), rhs.getIntegerCount())
  // 进位
  let carry = 0
  const digits: number[] = []
  // 逐位相加
  for (let i = -dp, maxLen = len; i < maxLen; ++i) {
    const r = lhs.get(i) + rhs.get(i) + carry
    carry = 0
    if (r >= 10) {
      digits.push(r - 10)
      carry = 1
    } else {
      digits.push(r)
    }
  }
  if (carry) {
    digits.push(carry)
  }
  digits.reverse()

  const ret = make2(digits, digits.length - dp, lhs.flag)

  return ret
}

export function add(lhs: t, rhs: t): t {
  if (lhs.isNaN() || rhs.isNaN()) return NAN

  // 处理 Infinity
  const [infinity, other] = lhs.isInfinity() ? [lhs, rhs] : rhs.isInfinity() ? [rhs, lhs] : []
  if (infinity && other) {
    const neg1 = infinity.isNeg()
    const neg2 = other.isNeg()
    if (other.isInfinity()) {
      if (neg1 !== neg2) return NAN
    }
    return neg1 ? NEG_INFINITY : INFINITY
  }

  if (lhs.isZero()) {
    if (rhs.isZero()) {
      if (lhs.isNeg() && rhs.isNeg()) return NEG_ZERO
      return ZERO
    }
    return rhs.clone()
  }
  if (rhs.isZero()) return lhs.clone()

  // 普通小整数，直接转成原始值运算
  if (lhs.isInt() && rhs.isInt() && lhs.getIntegerCount() < 16 && rhs.getIntegerCount() < 16) {
    return make(lhs.toNumber() + rhs.toNumber())
  }

  return _add(lhs, rhs)
}
