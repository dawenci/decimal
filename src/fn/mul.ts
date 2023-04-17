import type { t } from '../core/decimal.js'
import { Flag } from '../core/decimal.js'
import { make, make2, NAN, INFINITY, NEG_INFINITY, ZERO, NEG_ZERO } from '../core/make.js'

// 当前实现，采用简单的暴力竖式模拟，规模大时，考虑使用 Karatsuba, Toom-Cook multiplication 等算法优化
function _mul(lhs: t, rhs: t): t {
  // 结果符号
  const neg1 = lhs.isNeg()
  const neg2 = rhs.isNeg()
  const retNeg = neg1 === neg2 ? 0 : 0 | Flag.Neg

  // 结果的小数位数
  const retDp = lhs.getDecimalPlaces() + rhs.getDecimalPlaces()
  const arr1 = lhs.digits.slice()
  const arr2 = rhs.digits.slice()
  // 两数相乘，长度不超过两者长度和
  const digits = Array(arr1.length + arr2.length)
  for (let i = 0, l = arr1.length; i < l; i += 1) {
    for (let j = 0, m = arr2.length; j < m; j += 1) {
      // 不考虑进位问题，根据竖式的乘法运算，arr1 的第 i 位与 arr2 的第 j 位相乘，结果应该存放在结果的第i+j位上
      // 但因为进位，放在 i+j+1
      if (digits[i + j + 1]) {
        digits[i + j + 1] += arr1[i] * arr2[j]
      } else {
        digits[i + j + 1] = arr1[i] * arr2[j]
      }
    }
  }
  // 处理进位
  for (let k = digits.length - 1; k > 0; k -= 1) {
    if (digits[k] > 10) {
      digits[k - 1] += Math.floor(digits[k] / 10)
      digits[k] %= 10
    }
  }
  // digits[0] 可能为空
  if (digits[0] == null) {
    digits.shift()
  }

  const ret = make2(digits, digits.length - retDp, retNeg)

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

  if (lhs.isOne()) return rhs.clone().setNeg(lhs.isNeg() !== rhs.isNeg())
  if (rhs.isOne()) return lhs.clone().setNeg(lhs.isNeg() !== rhs.isNeg())

  // 普通小整数，直接转成原始值运算
  if (lhs.isInt() && rhs.isInt() && lhs.getIntegerCount() < 8 && rhs.getIntegerCount() < 8) {
    return make(lhs.toNumber() * rhs.toNumber())
  }

  return _mul(lhs, rhs)
}
