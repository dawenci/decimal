import { make } from '../core/make.js'
import { Pipeable } from './pipe.js'
import { sub as _sub } from '../fn/sub.js'

export const sub: Pipeable = (rhs: any) => {
  const _rhs = make(rhs)
  return lhs => _sub(lhs, _rhs)
}
