import { make } from '../core/make.js'
import { Pipeable } from './pipe.js'
import { add as _add } from '../fn/add.js'

export const add: Pipeable = rhs => {
  const _rhs = make(rhs)
  return lhs => _add(lhs, _rhs)
}
