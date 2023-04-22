import { make, make_by_data, NAN, INFINITY, NEG_INFINITY, ZERO, NEG_ZERO } from '../core/make.js';
function _mul(lhs, rhs) {
    var neg1 = lhs.isNeg();
    var neg2 = rhs.isNeg();
    var retNeg = neg1 === neg2 ? 0 : 0 | 128;
    var lFracCount = lhs._getFractionCount();
    var rFracCount = rhs._getFractionCount();
    var retFracCount = lhs._getFractionCount() + rhs._getFractionCount();
    var move = 0;
    if (lFracCount === 0 && (move = lhs.dpp - lhs._digitCount()) > 0) {
        retFracCount -= move;
    }
    if (rFracCount === 0 && (move = rhs.dpp - rhs._digitCount()) > 0) {
        retFracCount -= move;
    }
    var lLen = lhs._digitCount();
    var rLen = rhs._digitCount();
    var digits = Array(lLen + rLen);
    for (var i = 0, l = lLen; i < l; i += 1) {
        for (var j = 0, m = rLen; j < m; j += 1) {
            var index = i + j + 1;
            if (digits[index] == null)
                digits[index] = 0;
            digits[index] += lhs._getDigit(i) * rhs._getDigit(j);
        }
    }
    var carry = 0;
    var len = digits.length;
    while (len-- > 0) {
        var val = (digits[len] || 0) + carry;
        digits[len] = val % 10;
        carry = Math.floor(val / 10);
    }
    if (!digits[0]) {
        digits.shift();
    }
    var ret = make_by_data(digits, digits.length - retFracCount, retNeg);
    return ret;
}
export function mul(lhs, rhs) {
    if (lhs.isNaN() || rhs.isNaN())
        return NAN;
    var _a = lhs.isInfinity() ? [lhs, rhs] : rhs.isInfinity() ? [rhs, lhs] : [], infinity = _a[0], other = _a[1];
    if (infinity && other) {
        if (other.isZero())
            return NAN;
        return infinity.isNeg() === other.isNeg() ? INFINITY : NEG_INFINITY;
    }
    if (lhs.isZero() || rhs.isZero()) {
        return lhs.isNeg() === rhs.isNeg() ? ZERO : NEG_ZERO;
    }
    if (lhs.isOne())
        return rhs.clone()._setNeg(lhs.isNeg() !== rhs.isNeg()).setPrecision();
    if (rhs.isOne())
        return lhs.clone()._setNeg(lhs.isNeg() !== rhs.isNeg()).setPrecision();
    if (lhs.isInt() && rhs.isInt() && lhs._getIntegerCount() < 8 && rhs._getIntegerCount() < 8) {
        return make(lhs.toNumber() * rhs.toNumber()).setPrecision();
    }
    return _mul(lhs, rhs).setPrecision();
}
//# sourceMappingURL=mul.js.map