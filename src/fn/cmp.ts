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

  const int1 = n1.getIntegerCount()
  const int2 = n2.getIntegerCount()

  // 整数部分比较数量级
  if (int1 > int2) {
    return neg1 ? -1 : 1
  } else if (int2 > int1) {
    return neg1 ? 1 : -1
  }

  // 整数部分位数相同，从高到低逐位比较
  for (let i = int1 - 1; i >= 0; i -= 1) {
    const v1 = n1.get(i)
    const v2 = n2.get(i)
    if (v1 === v2) continue
    let ret = v1 > v2 ? 1 : (-1 as 0 | 1 | -1)
    if (neg1) ret = (ret * -1) as 0 | 1 | -1
    return ret
  }

  // 整数部分相同，比较小数部分
  const dec = -Math.max(n1.getDecimalPlaces(), n2.getDecimalPlaces())
  for (let i = -1; i >= dec; i -= 1) {
    const v1 = n1.get(i)
    const v2 = n2.get(i)
    if (v1 === v2) continue
    let ret = v1 > v2 ? 1 : (-1 as 0 | 1 | -1)
    if (neg1) ret = (ret * -1) as 0 | 1 | -1
    return ret
  }

  return 0
}
