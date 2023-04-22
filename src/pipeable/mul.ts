import type { PipeableMaker } from './pipe.js'
import { make } from '../core/index.js'
import { mul as _mul } from '../fn/index.js'

export const mul: PipeableMaker = rhs => {
  const partial = make(rhs)
  return lhs => _mul(lhs, partial)
}
