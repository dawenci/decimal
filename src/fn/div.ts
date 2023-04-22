import type { t } from '../core/index.js'
import { Setting, Decimal } from '../core/index.js'
import { make, NAN, INFINITY, NEG_INFINITY, ZERO, NEG_ZERO } from '../core/make.js'
import { cmp } from './cmp.js'
import { _add } from './add.js'
import { _sub } from './sub.js'

// TODO，提高效率，1. 更好地估商，2. 压位
function _div(lhs: t, rhs: t, precision: number): t {
  // 提前确定结果正负，两个操作数转成正数进行运算
  const retNeg = lhs.isNeg() !== rhs.isNeg()

  // 调整小数点位置，将两个操作数都调整为恰好等于 digits 数组的整数，记录修正数量，最终结果叠加回去
  let retDppOffset = 0
  const lDp = lhs.dpp - lhs._digitCount()
  retDppOffset += lDp
  lhs = lhs.clone()._moveDpp(-lDp)._setNeg(false)
  const rDp = rhs.dpp - rhs._digitCount()
  retDppOffset -= rDp
  rhs = rhs.clone()._moveDpp(-rDp)._setNeg(false)

  const ONE = make(1)
  let ret = make(0)
  const rCount = rhs._getIntegerCount()
  let lCount!: number
  let pow!: number
  let rhs_up!: Decimal
  // console.time('整数')
  while (cmp(lhs, rhs) >= 0) {
    // 减少计算次数，尝试临时放大 rhs，放大到接近 lhs 的大小
    // 1. 尝试放大到位数相同
    if (lCount !== (lCount = lhs._getIntegerCount())) {
      pow = lCount - rCount
      rhs_up = rhs.clone()._moveDpp(pow)
    }
    // 2. 检查是否放大过头，如果是，则回退一位
    const cmpResult = cmp(lhs, rhs_up)
    if (cmpResult == -1) {
      rhs_up._moveDpp(-1)
      pow -= 1
    }

    // lhs 为余数
    lhs = _sub(lhs, rhs_up, Infinity)
    // 商加上 1 * pow(10, 放大的程度)
    ret = _add(ret, ONE.clone()._moveDpp(pow), Infinity)

    // 当前恰好除尽，提前退出
    if (cmpResult === 0) {
      return ret._setNeg(retNeg)._moveDpp(retDppOffset)
    }
  }
  // console.timeEnd('整数')
  // console.time('小数')
  // 开始处理小数部分
  let dpp = 0
  // 多留 1 位小数，以确认舍入情况
  let frac_count = precision + 1
  while (frac_count) {
    // 长除法，从被除数中，拿下来一位放在余数（lhs）后面
    lhs._moveDpp(1)
    // 确定 n 将被加到 ret 中的哪位小数
    --dpp

    // 当前小数位置的结果
    let n = 0
    let cmpResult: 0 | 1 | -1
    while ((cmpResult = cmp(lhs, rhs)) >= 0) {
      lhs = _sub(lhs, rhs, Infinity)
      ++n
      if (cmpResult === 0) break
    }

    // 0 就不用加了
    if (n) {
      const m = make(n)._moveDpp(dpp)
      ret = _add(ret, m, Infinity)
      // 还有多少位小数结果需要计算
      frac_count--
    } else {
      // 开头的零不占用有效位
      if (ret._digitCount()) {
        // 还有多少位小数结果需要计算
        frac_count--
      }
    }

    // 当前恰好除尽，提前退出
    if (cmpResult === 0) {
      // console.timeEnd('小数')
      return ret._setNeg(retNeg)._moveDpp(retDppOffset)
    }
  }
  // console.timeEnd('小数')

  // 当前是达到 precision + 1 位，但仍未除尽，直接返回，
  // 但因为可能指定的 RoundingMode 需要看 precision + 1 之后的数，来判断是否进位，
  // 因此，人工手动再给结果补一位，用于触发进位
  // 注意上面的环节 ret 末尾可能都是 0 而被移除，补之前，先补足有效位长度，再拼接
  let count = ret._digitCount()
  while (count++ < precision) { 
    ret._appendBack(0)
  }
  // 人工手动再补一位触发进位
  ret._appendBack(1)

  return ret._setNeg(retNeg)._moveDpp(retDppOffset)
}

export function div(lhs: t, rhs: t): t {
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

  if (rhs.isOne()) {
    return lhs
      .clone()
      ._setNeg(lhs.isNeg() !== rhs.isNeg())
      .setPrecision()
  }

  return _div(lhs, rhs, Setting.precision).setPrecision()
}
