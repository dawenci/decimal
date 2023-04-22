import type { Pipeable } from './pipe.js'
import type { RoundingMode } from '../core/index.js'
import type { Placeholder } from './placeholder.js'
import { _ } from './placeholder.js'
import { make } from '../core/index.js'
import { div as div_ } from '../fn/index.js'

export interface DivOptions {
  precision: number
  rounding?: RoundingMode
}

export function div(rhs: any, __?: Placeholder): Pipeable {
  const partial = make(rhs)
  return __ === _
    ? rhs => div_(partial, rhs)
    : lhs => div_(lhs, partial)
}
