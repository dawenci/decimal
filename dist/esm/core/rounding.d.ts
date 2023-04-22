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
export declare const isRoundingMode: (test: unknown) => test is RoundingMode;
