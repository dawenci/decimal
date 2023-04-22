// https://stackoverflow.com/a/75122162

type LastElement<T> = T extends [...unknown[], infer LastItem] ? LastItem : never

type Operator<A, B> = (value: A) => B
type OperatorA<T> = T extends Operator<infer A, any> ? A : never
type OperatorB<T> = T extends Operator<any, infer B> ? B : never

type PipeOperators<Operators extends unknown[], Input> =
  Operators extends [infer Item, ...infer Tail]
  ? [Operator<Input, OperatorB<Item>>, ...PipeOperators<Tail, OperatorB<Item>>]
  : Operators
type PipeOperatorsOutput<Operators extends unknown[]> = OperatorB<LastElement<Operators>>

function _pipe<Input, Operators extends unknown[]>(...operators: PipeOperators<Operators, Input>): (input: Input) => PipeOperatorsOutput<Operators> {
  return operators as never // Runtime implementation.
}
