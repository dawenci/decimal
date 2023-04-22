import type { t } from '../core/index.js'
import { Decimal, make } from '../core/index.js'

const _neg = (input: any, value?: boolean) => {
  const decimal = input instanceof Decimal
    ? input.clone()
    : make(input)

  if (value != null) {
    return decimal._setNeg(value)
  }

  return decimal._toggleNeg()
}

export function neg(input: boolean): (input: any) => t
export function neg(input: unknown): t
export function neg(input: any) {
  if (typeof input === 'boolean') {
    return (input2: any) => {
      return _neg(input2, input)
    }
  }
  return _neg(input)
}
