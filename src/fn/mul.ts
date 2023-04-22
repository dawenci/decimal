import type { t } from '../core/decimal.js'
import { Flag } from '../core/decimal.js'
import { make, make_by_data, NAN, INFINITY, NEG_INFINITY, ZERO, NEG_ZERO } from '../core/make.js'

// 当前实现，采用简单的暴力竖式模拟，规模大时，考虑使用 Karatsuba, Toom-Cook multiplication 等算法优化
function _mul(lhs: t, rhs: t): t {
  // 结果符号
  const neg1 = lhs.isNeg()
  const neg2 = rhs.isNeg()
  const retNeg = neg1 === neg2 ? 0 : 0 | Flag.Neg

  // 结果的小数位数
  const lFracCount = lhs._getFractionCount()
  const rFracCount = rhs._getFractionCount()
  let retFracCount = lhs._getFractionCount() + rhs._getFractionCount()
  // 末尾是 0，则需要减少小数位
  let move = 0
  if (lFracCount === 0 && (move = lhs.dpp - lhs._digitCount()) > 0) {
    retFracCount -= move
  }
  if (rFracCount === 0 && (move = rhs.dpp - rhs._digitCount()) > 0) {
    retFracCount -= move
  }

  const lLen = lhs._digitCount()
  const rLen = rhs._digitCount()

  // 两数相乘，长度不超过两者长度和
  const digits = Array(lLen + rLen)
  for (let i = 0, l = lLen; i < l; i += 1) {
    for (let j = 0, m = rLen; j < m; j += 1) {
      // 不考虑进位问题，根据竖式的乘法运算，arr1 的第 i 位与 arr2 的第 j 位相乘，结果应该存放在结果的第i+j位上
      // 但因为进位，放在 i+j+1
      const index = i + j + 1
      if (digits[index] == null) digits[index] = 0
      digits[index] += lhs._getDigit(i) * rhs._getDigit(j)
    }
  }
  // 处理进位
  let carry = 0
  let len = digits.length
  while (len-- > 0) {
    const val = (digits[len] || 0) + carry
    digits[len] = val % 10
    carry = Math.floor(val / 10)
  }
  // digits[0] 可能为空、0
  if (!digits[0]) {
    digits.shift()
  }

  const ret = make_by_data(digits, digits.length - retFracCount, retNeg)

  return ret
}
export function mul(lhs: t, rhs: t): t {
  if (lhs.isNaN() || rhs.isNaN()) return NAN

  // 处理 Infinity
  const [infinity, other] = lhs.isInfinity() ? [lhs, rhs] : rhs.isInfinity() ? [rhs, lhs] : []
  if (infinity && other) {
    // +-Infinity * 0 = NaN
    if (other.isZero()) return NAN
    return infinity.isNeg() === other.isNeg() ? INFINITY : NEG_INFINITY
  }

  if (lhs.isZero() || rhs.isZero()) {
    return lhs.isNeg() === rhs.isNeg() ? ZERO : NEG_ZERO
  }

  if (lhs.isOne()) return rhs.clone()._setNeg(lhs.isNeg() !== rhs.isNeg()).setPrecision()
  if (rhs.isOne()) return lhs.clone()._setNeg(lhs.isNeg() !== rhs.isNeg()).setPrecision()

  // 普通小整数，直接转成原始值运算
  if (lhs.isInt() && rhs.isInt() && lhs._getIntegerCount() < 8 && rhs._getIntegerCount() < 8) {
    return make(lhs.toNumber() * rhs.toNumber()).setPrecision()
  }

  return _mul(lhs, rhs).setPrecision()
}
