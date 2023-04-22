import type { t } from '../core/decimal.js'

export const cmp = (n1: t, n2: t): 0 | 1 | -1 => {
  if (n1.isNaN() || n2.isNaN()) return 0

  if (n1.isInfinity()) {
    if (n1.isNeg()) {
      if (n2.isInfinity() && n2.isNeg()) return 0
      return -1
    } else {
      if (n2.isInfinity() && !n2.isNeg()) return 0
      return 1
    }
  }

  if (n2.isInfinity()) {
    if (n2.isNeg()) return 1
    return -1
  }

  const neg1 = n1.isNeg()
  const neg2 = n2.isNeg()

  if (!neg1 && neg2) return 1
  if (neg1 && !neg2) return -1

  const int1 = n1._getIntegerCount()
  const int2 = n2._getIntegerCount()

  // 整数部分比较数量级
  if (int1 > int2) {
    return neg1 ? -1 : 1
  } else if (int2 > int1) {
    return neg1 ? 1 : -1
  }

  // 整数部分位数相同，从高到低逐位比较

  // n1、n2 整数末尾全部为 0，则只需要比较 digits 部分即可（即 digits 部分全为整数，且最高位是同一数量级）
  if(n1._digitCount() < int1 && n2._digitCount() < int2) {
    const len = Math.max(n1._digitCount(), n2._digitCount())
    for (let i = 0; i < len; i += 1) {
      const v1 = n1._getDigit(i)
      const v2 = n2._getDigit(i)
      if (v1 === v2) continue
      let ret = v1 > v2 ? 1 : (-1 as 0 | 1 | -1)
      if (neg1) ret = (ret * -1) as 0 | 1 | -1
      return ret
    }
  }

  for (let i = int1 - 1; i >= 0; i -= 1) {
    const v1 = n1._get(i)
    const v2 = n2._get(i)
    if (v1 === v2) continue
    let ret = v1 > v2 ? 1 : (-1 as 0 | 1 | -1)
    if (neg1) ret = (ret * -1) as 0 | 1 | -1
    return ret
  }

  // 整数部分相同，比较小数部分

  // 如果两者均为 0 开头的小数，先检查数量级（前面有多少个 0）
  if (n1.dpp < 0 && n2.dpp < 0) {
    if (n1.dpp > n2.dpp) {
      return neg1 ? -1 : 1
    } else if (n1.dpp < n2.dpp) {
      return neg1 ? 1 : -1
    }
  }

  // 小数部分数量级相同，逐位比较
  const dec = -Math.max(n1._getFractionCount(), n2._getFractionCount())
  // 两者均为 0 开头，则跳过相同的 0 部分，否则正常从 -1 开始比较
  const begin = n1.dpp < 0 && n2.dpp < 0 ? -Math.max(n1.dpp, n2.dpp) - 1 : -1
  for (let i = begin; i >= dec; i -= 1) {
    const v1 = n1._get(i)
    const v2 = n2._get(i)
    if (v1 === v2) continue
    let ret = v1 > v2 ? 1 : (-1 as 0 | 1 | -1)
    if (neg1) ret = (ret * -1) as 0 | 1 | -1
    return ret
  }

  return 0
}
