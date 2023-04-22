export var RoundingMode;
(function (RoundingMode) {
    RoundingMode[RoundingMode["Up"] = 0] = "Up";
    RoundingMode[RoundingMode["Down"] = 1] = "Down";
    RoundingMode[RoundingMode["Ceiling"] = 2] = "Ceiling";
    RoundingMode[RoundingMode["Floor"] = 3] = "Floor";
    RoundingMode[RoundingMode["HalfUp"] = 4] = "HalfUp";
    RoundingMode[RoundingMode["HalfDown"] = 5] = "HalfDown";
    RoundingMode[RoundingMode["HalfEven"] = 6] = "HalfEven";
    RoundingMode[RoundingMode["HalfCeiling"] = 7] = "HalfCeiling";
    RoundingMode[RoundingMode["HalfFloor"] = 8] = "HalfFloor";
})(RoundingMode || (RoundingMode = {}));
export var isRoundingMode = function (test) {
    return !!RoundingMode[test];
};
//# sourceMappingURL=rounding.js.map