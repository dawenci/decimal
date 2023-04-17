import { make, make2, NAN, INFINITY, NEG_INFINITY, ZERO, NEG_ZERO } from '../core/make.js';
function _mul(lhs, rhs) {
    var neg1 = lhs.isNeg();
    var neg2 = rhs.isNeg();
    var retNeg = neg1 === neg2 ? 0 : 0 | 128;
    var retDp = lhs.getDecimalPlaces() + rhs.getDecimalPlaces();
    var arr1 = lhs.digits.slice();
    var arr2 = rhs.digits.slice();
    var digits = Array(arr1.length + arr2.length);
    for (var i = 0, l = arr1.length; i < l; i += 1) {
        for (var j = 0, m = arr2.length; j < m; j += 1) {
            if (digits[i + j + 1]) {
                digits[i + j + 1] += arr1[i] * arr2[j];
            }
            else {
                digits[i + j + 1] = arr1[i] * arr2[j];
            }
        }
    }
    for (var k = digits.length - 1; k > 0; k -= 1) {
        if (digits[k] > 10) {
            digits[k - 1] += Math.floor(digits[k] / 10);
            digits[k] %= 10;
        }
    }
    if (digits[0] == null) {
        digits.shift();
    }
    var ret = make2(digits, digits.length - retDp, retNeg);
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
        return rhs.clone().setNeg(lhs.isNeg() !== rhs.isNeg());
    if (rhs.isOne())
        return lhs.clone().setNeg(lhs.isNeg() !== rhs.isNeg());
    if (lhs.isInt() && rhs.isInt() && lhs.getIntegerCount() < 8 && rhs.getIntegerCount() < 8) {
        return make(lhs.toNumber() * rhs.toNumber());
    }
    return _mul(lhs, rhs);
}
//# sourceMappingURL=mul.js.map