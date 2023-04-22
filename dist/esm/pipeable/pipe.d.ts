import type { t } from '../core/decimal.js';
export type Pipeable = (decimal: t) => t;
export type PipeableMaker = (...args: any[]) => (leftHandSide: t) => t;
export declare function pipe<Fns extends Unary[] = []>(input: any, ...fns: PipeFns<t, Fns>): PipeOut<import("../core/decimal.js").Decimal, Fns>;
type Unary<I = any, O = any> = (value: I) => O;
type Last<T> = T extends [...any, infer LastItem extends Unary] ? LastItem : never;
type PipeFns<Input, Fns> = Fns extends [infer Head extends Unary, ...infer Tail extends Unary[]] ? [Unary<Input, ReturnType<Head>>, ...PipeFns<ReturnType<Head>, Tail>] : Fns;
type PipeOut<Input, Fns extends Unary[]> = Fns extends [] ? Input : ReturnType<Last<Fns>>;
export {};
