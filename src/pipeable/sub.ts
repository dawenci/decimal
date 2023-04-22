import type { PipeableMaker } from './pipe.js'
import type { Placeholder } from './placeholder.js'
import { _ } from './placeholder.js'
import { make } from '../core/index.js'
import { sub as _sub } from '../fn/index.js'

export const sub: PipeableMaker = (rhs, __?: Placeholder) => {
  const partial = make(rhs)
  return __ === _
    ? rhs => _sub(partial, rhs)
    : lhs => _sub(lhs, partial)
}
