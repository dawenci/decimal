import type { PipeableMaker } from './pipe.js'
import type { Placeholder } from './placeholder.js'
import { _ } from './placeholder.js'
import { make } from '../core/index.js'
import { mod as _mod } from '../fn/index.js'

export const mod: PipeableMaker = (rhs, __?: Placeholder) => {
  const partial = make(rhs)
  return __ === _
    ? rhs => _mod(partial, rhs)
    : lhs => _mod(lhs, partial)
}
