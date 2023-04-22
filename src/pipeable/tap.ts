import type { t } from '../core/index.js'
import type { PipeableMaker } from './pipe.js'

export const tap: PipeableMaker = (f: (n: t) => void) => n => (f(n), n)
