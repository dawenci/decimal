import { RoundingMode } from './rounding.js';
export declare const enum Flag {
    Neg = 128,
    Nan = 1,
    Infinity = 2
}
export interface DecimalData {
    digits: number[];
    dpp: number;
    flag: number;
}
export interface PrintOptions {
    rounding?: RoundingMode;
    expThresholdPos?: number;
    expThresholdNeg?: number;
}
export interface ToPrecisionOptions extends PrintOptions {
    significantDigits?: number;
}
export interface ToExponentialOptions extends PrintOptions {
    fractionDigits?: number;
}
export declare class Decimal implements DecimalData {
    digits: number[];
    dpp: number;
    flag: number;
    constructor(digits?: number[], dpp?: number, flag?: number);
    clone(): Decimal;
    isInt(): boolean;
    isSafeInt(): boolean;
    isNeg(): boolean;
    isNaN(): boolean;
    isInfinity(): boolean;
    isZero(): boolean;
    isOne(): boolean;
    toNumber(): number;
    setPrecision(significantDigits?: number, roundingMode?: RoundingMode): this;
    toPrecision(): string;
    toPrecision(significantDigits: number): string;
    toPrecision(printOptions: ToPrecisionOptions): string;
    toExponential(): string;
    toExponential(fractionDigits: number): string;
    toExponential(printOptions: ToExponentialOptions): string;
    toString(): string;
    _setNeg(v: boolean): this;
    _toggleNeg(): this;
    _moveDpp(n: number): this;
    _getFractionCount(): number;
    _getIntegerCount(): number;
    _indexRange(): [number, number];
    _digitCount(): number;
    _getDigit(index: number): number;
    _setDigit(index: number, value: number): this;
    _sliceDigits(significantDigits: number): this;
    _joinDigits(): string;
    _appendFront(value: number): this;
    _appendBack(value: number): this;
    _popBack(): number | undefined;
    _popFront(): number | undefined;
    _get(index: number): number;
    _getPoint(): number;
}
export type t = Decimal;
