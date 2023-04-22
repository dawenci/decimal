import type { t } from '../core/decimal.js'
import type { RoundingMode } from '../core/index.js'
import { Setting, make, NAN, INFINITY, NEG_INFINITY, ZERO, NEG_ZERO } from '../core/index.js'
import { make_by_data } from '../core/make.js'
import { _sub } from './sub.js'

export function _add(lhs: t, rhs: t, precision: number): t {
  // 处理符号
  const neg1 = lhs.isNeg()
  const neg2 = rhs.isNeg()
  // (-x)+y -> (y-x)
  if (neg1 && !neg2) {
    return _sub(rhs, lhs.clone()._setNeg(false), precision)
  }
  // x+(-y) -> (x-y)
  if (!neg1 && neg2) {
    return _sub(lhs, rhs.clone()._setNeg(false), precision)
  }

  // 计算 lhs、rhs 有多少位小数
  const lFracCount = lhs._getFractionCount()
  const rFracCount = rhs._getFractionCount()
  const fracCount: number = Math.max(lFracCount, rFracCount)
  const lIntCount = lhs._getIntegerCount()
  const rIntCount = rhs._getIntegerCount()
  const begin = -fracCount
  const end = lIntCount > rIntCount ? lIntCount : rIntCount

  // 两个数字，没有重叠的有效位（不会触发进位），并且较大那个的尾巴，
  // 距离较小那个的头部的距离超过 precision，
  // 则较小的那个，可以直接舍掉（需要考虑对舍入规则的影响）
  if (lhs.dpp !== rhs.dpp) {
    const [big, small] = lhs.dpp > rhs.dpp ? [lhs, rhs] : [rhs, lhs]
    // 两数距离一个 precision 距离以上
    if (big.dpp - small.dpp >= precision) {
      // d 表示 big 的尾巴，与 small 的开头，夹着多少位，>= 0 说明没重叠
      let d = big.dpp - big._digitCount() - small.dpp
      if (d >= 0) {
        const ret = big.clone()
        // 处理舍入，较大的数，长度不够的，先用 0 补足
        let count = ret._digitCount()
        while (count++ < precision) { 
          ret._appendBack(0)
        }

        // 用一些数来代表 small 附加到舍弃位的最高位上（用来确保舍入正确）
        // 如果 small 的最高位恰好位于被舍弃的最高位，则 append 上 small 的最高位，如果还存在其他位，再拼上一位随意数字
        if (d === 0) {
          ret._appendBack(small._getDigit(0))
          if (small._digitCount() > 1) {
            ret._appendBack(1)
          }
        }
        // small 距离 big 太原，则拼上任意数字，代表还有数以正确触发舍入即可
        else {
          ret._appendBack(1)
        }
        // 返回（外部会处理舍入）
        return ret
      }
    }
  }

  // 进位
  let carry = 0
  const digits: number[] = []
  // 逐位相加
  for (let i = begin; i < end!; ++i) {
    const r = lhs._get(i) + rhs._get(i) + carry
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

  const ret = make_by_data(digits, digits.length - fracCount, lhs.flag)

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
      return lhs.isNeg() && rhs.isNeg() ? NEG_ZERO : ZERO
    }
    return rhs.clone().setPrecision()
  }
  if (rhs.isZero()) return lhs.clone().setPrecision()

  // 普通小整数，直接转成原始值运算
  if (lhs.isInt() && rhs.isInt() && lhs._getIntegerCount() < 16 && rhs._getIntegerCount() < 16) {
    return make(lhs.toNumber() + rhs.toNumber()).setPrecision()
  }

  return _add(lhs, rhs, Setting.precision).setPrecision()
}
