import type { t } from '../core/decimal.js'
import { abs as _abs } from '../fn/index.js'

export const abs = (decimal: t) => {
  return _abs(decimal)
}
