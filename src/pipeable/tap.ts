import type { t } from '../core/decimal.js'
import { Pipeable } from './pipe.js'

export const tap: Pipeable = (f: (n: t) => void) => n => (f(n), n)
