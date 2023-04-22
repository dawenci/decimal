export var precision = function (significantDigits, roundingMode) {
    return function (n) { return n.clone().setPrecision(significantDigits, roundingMode); };
};
//# sourceMappingURL=precision.js.map