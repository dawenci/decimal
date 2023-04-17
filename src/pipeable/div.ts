import { make } from '../core/make.js'
import { Pipeable } from './pipe.js'
import { div as _div } from '../fn/div.js'

export const div: Pipeable = (rhs: any) => {
  const _rhs = make(rhs)
  return lhs => _div(lhs, _rhs)
}
