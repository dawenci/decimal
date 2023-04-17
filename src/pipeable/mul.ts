import { make } from '../core/make.js'
import { Pipeable } from './pipe.js'
import { mul as _mul } from '../fn/mul.js'

export const mul: Pipeable = (rhs: any) => {
  const _rhs = make(rhs)
  return lhs => _mul(lhs, _rhs)
}
