import type { t } from '../core/decimal.js'
import { Flag } from '../core/decimal.js'
import { Setting, make, NAN, INFINITY, NEG_INFINITY, ZERO, NEG_ZERO } from '../core/index.js'
import { make_by_data } from '../core/make.js'
import { cmp } from './cmp.js'
import { _add } from './add.js'

export function _sub(lhs: t, rhs: t, precision: number): t {
  // 处理符号，只需处理（正数减去正数）的形式
  const neg1 = lhs.isNeg()
  const neg2 = rhs.isNeg()
  // (-x)-(-y) -> (y-x)
  if (neg1 && neg2) {
    const temp = rhs.clone()._setNeg(false)
    rhs = lhs.clone()._setNeg(false)
    lhs = temp
  }
  // (-x)-y -> (-x)+(-y)
  if (neg1 && !neg2) {
    return _add(lhs, rhs.clone()._setNeg(true), precision)
  }
  // x-(-y) -> (x+y)
  if (!neg1 && neg2) {
    return _add(lhs, rhs.clone()._setNeg(false), precision)
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
  const lFracCount = lhs._getFractionCount()
  const rFracCount = rhs._getFractionCount()
  const fracCount = Math.max(lFracCount, rFracCount)
  const lIntCount = lhs._getIntegerCount()
  const begin = -fracCount
  const end = lIntCount

  // 两个数字，没有重叠的有效位，并且较大那个的尾巴，
  // 距离较小那个的头部的距离超过 precision，
  // 则较大数字的有效位需要被借位 1，precision 范围补 9，舍弃位附近根据较小数的距离，确定值和舍入规则。
  if (lhs.dpp !== rhs.dpp) {
    // 两数距离一个 precision 距离以上
    if (lhs.dpp - rhs.dpp >= precision) {
      // d 表示 lhs 的尾巴，与 rhs 的开头，夹着多少位，>= 0 说明没重叠
      let d = lhs.dpp - lhs._digitCount() - rhs.dpp
      // 两数有效数字位置没重叠
      if (d >= 0) {
        const ret = lhs.clone()

        // 有效位被借 1
        let i = ret._digitCount()
        let borrow = 0
        while (i--) {
          let v = ret._getDigit(i) - (1 + borrow)
          borrow = 0
          if (v < 0) {
            ret._setDigit(i, v + 10)
            borrow = 1
            continue
          } else {
            ret._setDigit(i, v)
            break
          }
        }
        // 最高位变成 0 的话，需要清理并移动小数点
        if (ret._getDigit(0) === 0) {
          ret._popFront()
          ret.dpp -= 1
        }
        // 用 9 从 lhs 尾巴开始填充到 precision 或 rhs 开头
        let c = Math.min(d, precision - ret._digitCount())
        while (c-- > 0) { 
          ret._appendBack(9)
        }

        // 处理舍弃部分
        // 用一些数来代表减去 small 的结果附加到舍弃位的最高位上（用来确保舍入正确）
        // 如果 small 的最高位恰好位于被舍弃的最高位，则
        // 1. 如果 small 只有 1 位，则 append 上借来的 10 - small 的最高位，
        // 2. 如果 small 有超过 1 位，则最高位 append 上借来的 9（后边又被借位了）减去 small 的最高位的结果，再随意拼一个数即可
        if (d === 0) {
          if (rhs._digitCount() > 1) {
            ret._appendBack(9 - rhs._getDigit(0))
            ret._appendBack(1)
          } else {
            ret._appendBack(10 - rhs._getDigit(0))
          }
        }
        // small 距离 big 太远，则拼上 9
        else {
          ret._appendBack(9)
        }
        // 返回（外部会处理舍入）
        return ret._setNeg(!!retNeg)
      }
    }
  }
 
  // 借位
  let borrow = 0
  const digits: number[] = []
  // 逐位相减
  for (let i = begin; i < end; ++i) {
    const r = lhs._get(i) - (rhs._get(i) + borrow)
    borrow = 0
    if (r < 0) {
      digits.push(r + 10)
      borrow = 1
    } else {
      digits.push(r)
    }
  }
  digits.reverse()

  const ret = make_by_data(digits, digits.length - fracCount, retNeg)

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
    return rhs.clone()._toggleNeg()
  }
  if (rhs.isZero()) return lhs.clone()

  // 普通小整数，直接转成原始值运算
  if (lhs.isInt() && rhs.isInt() && lhs._getIntegerCount() < 16 && rhs._getIntegerCount() < 16) {
    return make(lhs.toNumber() - rhs.toNumber())
  }

  return _sub(lhs, rhs, Setting.precision)
}
