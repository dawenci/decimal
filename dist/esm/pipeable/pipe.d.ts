import type { t } from '../core/decimal.js';
export type Pipeable = (rightHandSide: any) => (leftHandSide: t) => t;
export declare function pipe(num: any, ...fns: ReturnType<Pipeable>[]): t;
