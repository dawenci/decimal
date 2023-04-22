import type { PipeableMaker } from './pipe.js'
import type { Placeholder } from './placeholder.js'
import { _ } from './placeholder.js'
import { make } from '../core/index.js'
import { cmp as _cmp } from '../fn/index.js'

export const cmp: PipeableMaker = (rhs, __?: Placeholder) => {
  const partial = make(rhs)
  return __ === _
    ? rhs => make(_cmp(partial, rhs))
    : lhs => make(_cmp(lhs, partial))
}
