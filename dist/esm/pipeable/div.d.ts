import type { Pipeable } from './pipe.js';
import type { RoundingMode } from '../core/index.js';
import type { Placeholder } from './placeholder.js';
export interface DivOptions {
    precision: number;
    rounding?: RoundingMode;
}
export declare function div(rhs: any, __?: Placeholder): Pipeable;
