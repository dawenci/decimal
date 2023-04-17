import { Decimal } from './decimal.js';
export declare function make(raw?: unknown): Decimal;
export declare function make2(digits: number[], dpp: number, flag: number): Decimal;
export declare const NAN: Readonly<Decimal>;
export declare const INFINITY: Readonly<Decimal>;
export declare const NEG_INFINITY: Readonly<Decimal>;
export declare const ZERO: Readonly<Decimal>;
export declare const NEG_ZERO: Readonly<Decimal>;
