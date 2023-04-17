import { make, make2, NAN, INFINITY, NEG_INFINITY, ZERO, NEG_ZERO } from '../core/make.js';
import { sub } from './sub.js';
export function _add(lhs, rhs) {
    var neg1 = lhs.isNeg();
    var neg2 = rhs.isNeg();
    if (neg1 && !neg2) {
        return sub(rhs, lhs.clone().setNeg(false));
    }
    if (!neg1 && neg2) {
        return sub(lhs, rhs.clone().setNeg(false));
    }
    var dp = Math.max(lhs.getDecimalPlaces(), rhs.getDecimalPlaces());
    var len = Math.max(lhs.getIntegerCount(), rhs.getIntegerCount());
    var carry = 0;
    var digits = [];
    for (var i = -dp, maxLen = len; i < maxLen; ++i) {
        var r = lhs.get(i) + rhs.get(i) + carry;
        carry = 0;
        if (r >= 10) {
            digits.push(r - 10);
            carry = 1;
        }
        else {
            digits.push(r);
        }
    }
    if (carry) {
        digits.push(carry);
    }
    digits.reverse();
    var ret = make2(digits, digits.length - dp, lhs.flag);
    return ret;
}
export function add(lhs, rhs) {
    if (lhs.isNaN() || rhs.isNaN())
        return NAN;
    var _a = lhs.isInfinity() ? [lhs, rhs] : rhs.isInfinity() ? [rhs, lhs] : [], infinity = _a[0], other = _a[1];
    if (infinity && other) {
        var neg1 = infinity.isNeg();
        var neg2 = other.isNeg();
        if (other.isInfinity()) {
            if (neg1 !== neg2)
                return NAN;
        }
        return neg1 ? NEG_INFINITY : INFINITY;
    }
    if (lhs.isZero()) {
        if (rhs.isZero()) {
            if (lhs.isNeg() && rhs.isNeg())
                return NEG_ZERO;
            return ZERO;
        }
        return rhs.clone();
    }
    if (rhs.isZero())
        return lhs.clone();
    if (lhs.isInt() && rhs.isInt() && lhs.getIntegerCount() < 16 && rhs.getIntegerCount() < 16) {
        return make(lhs.toNumber() + rhs.toNumber());
    }
    return _add(lhs, rhs);
}
//# sourceMappingURL=add.js.map