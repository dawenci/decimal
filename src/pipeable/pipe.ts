import type { t } from '../core/decimal.js'
import { make } from '../core/make.js'

export type Pipeable = (rightHandSide: any) => (leftHandSide: t) => t

export function pipe(num: any, ...fns: ReturnType<Pipeable>[]): t {
  let n = make(num)
  fns = fns.slice().reverse()
  while (fns.length) {
    n = fns.pop()!(n)
  }
  return n
}
