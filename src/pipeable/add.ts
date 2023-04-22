import type { PipeableMaker } from './pipe.js'
import { make } from '../core/index.js'
import { add as _add } from '../fn/index.js'

export const add: PipeableMaker = rhs => {
  const partial = make(rhs)
  return lhs => _add(lhs, partial)
}
