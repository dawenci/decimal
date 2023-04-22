import type { t } from '../core/decimal.js'
import { make } from '../core/index.js'

export type Pipeable = (decimal: t) => t
export type PipeableMaker = (...args: any[]) => (leftHandSide: t) => t

export function pipe<Fns extends Unary[] = []>(input: any, ...fns: PipeFns<t, Fns>) {
  return _pipe(make(input), ...fns)
}

type Unary<I=any, O=any> = (value: I) => O
type Last<T> = T extends [...any, infer LastItem extends Unary]
  ? LastItem : never

type PipeFns<Input, Fns> = Fns extends [infer Head extends Unary, ...infer Tail extends Unary[]]
  ? [Unary<Input, ReturnType<Head>>, ...PipeFns<ReturnType<Head>, Tail>]
  : Fns

// pipe 最终输出，如果没有传入任何 fn，则返回 input
type PipeOut<Input, Fns extends Unary[]> =
  Fns extends [] ? Input : ReturnType<Last<Fns>>

function _pipe<Input = any, Fns extends Unary[] = []>(
  input: Input,
  ...fns: PipeFns<Input, Fns>
): PipeOut<Input, Fns> {
  let result: any = input
  for (let i = 0; i < fns.length; i += 1) {
    result = fns[i](result)
  }
  return result
}
