import type { t } from '../core/decimal.js'

export function abs(decimal: t): t {
  return decimal._setNeg(false)
}
