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
export declare enum RoundingMode {
    Up = 0,
    Down = 1,
    Ceiling = 2,
    Floor = 3,
    HalfUp = 4,
    HalfDown = 5,
    HalfEven = 6,
    HalfCeiling = 7,
    HalfFloor = 8
}
export declare class Decimal implements DecimalData {
    digits: number[];
    dpp: number;
    flag: number;
    constructor(digits?: number[], dpp?: number, flag?: number);
    clone(): Decimal;
    getDecimalPlaces(): number;
    getIntegerCount(): number;
    get(index: number): number;
    getPoint(): number;
    toArray(): any[];
    isInt(): boolean;
    isSafeInt(): boolean;
    isNeg(): boolean;
    isNaN(): boolean;
    isInfinity(): boolean;
    isZero(): boolean;
    isOne(): boolean;
    setNeg(v: boolean): this;
    toggleNeg(): this;
    moveDpp(n: number): this;
    toNumber(): number;
    getPrecision(): number;
    setPrecision(significantDigits: number, roundingMode?: RoundingMode): this;
    toPrecision(significantDigits?: number, roundingMode?: RoundingMode): string;
    toString(): string;
}
export type t = Decimal;
