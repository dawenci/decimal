import { make } from '../core/make.js'
import { Pipeable } from './pipe.js'
import { mod as _mod } from '../fn/mod.js'

export const mod: Pipeable = (rhs: any) => {
  const _rhs = make(rhs)
  return lhs => _mod(lhs, _rhs)
}
