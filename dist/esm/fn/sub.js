import { make, make2, NAN, INFINITY, NEG_INFINITY, ZERO, NEG_ZERO } from '../core/make.js';
import { cmp } from './cmp.js';
import { add } from './add.js';
export function _sub(lhs, rhs) {
    var neg1 = lhs.isNeg();
    var neg2 = rhs.isNeg();
    if (neg1 && neg2) {
        var temp = rhs.clone().setNeg(false);
        rhs = lhs.clone().setNeg(false);
        lhs = temp;
    }
    if (neg1 && !neg2) {
        return add(lhs, rhs.clone().setNeg(true));
    }
    if (!neg1 && neg2) {
        return add(lhs, rhs.clone().setNeg(false));
    }
    var cmpResult = cmp(lhs, rhs);
    if (cmpResult === 0)
        return make(0);
    var retNeg = 0;
    if (cmpResult === -1) {
        var temp = rhs;
        rhs = lhs;
        lhs = temp;
        retNeg = 0 | 128;
    }
    var dp = Math.max(lhs.getDecimalPlaces(), rhs.getDecimalPlaces());
    var len = Math.max(lhs.getIntegerCount(), rhs.getIntegerCount());
    var carry = 0;
    var digits = [];
    for (var i = -dp, maxLen = len; i < maxLen; ++i) {
        var r = lhs.get(i) - (rhs.get(i) + carry);
        carry = 0;
        if (r < 0) {
            digits.push(r + 10);
            carry = 1;
        }
        else {
            digits.push(r);
        }
    }
    digits.reverse();
    var ret = make2(digits, digits.length - dp, retNeg);
    return ret;
}
export function sub(lhs, rhs) {
    if (lhs.isNaN() || rhs.isNaN())
        return NAN;
    var _a = lhs.isInfinity() ? [lhs, rhs] : rhs.isInfinity() ? [rhs, lhs] : [], infinity = _a[0], other = _a[1];
    if (infinity && other) {
        var neg1 = infinity.isNeg();
        var neg2 = other.isNeg();
        if (other.isInfinity()) {
            if (neg1 === neg2)
                return make('NaN');
            return lhs.clone();
        }
        if (infinity === lhs)
            return neg1 ? NEG_INFINITY : INFINITY;
        return neg1 ? INFINITY : NEG_INFINITY;
    }
    if (lhs.isZero()) {
        if (rhs.isZero()) {
            if (lhs.isNeg() && !rhs.isNeg())
                return NEG_ZERO;
            return ZERO;
        }
        return rhs.clone().toggleNeg();
    }
    if (rhs.isZero())
        return lhs.clone();
    if (lhs.isInt() && rhs.isInt() && lhs.getIntegerCount() < 16 && rhs.getIntegerCount() < 16) {
        return make(lhs.toNumber() - rhs.toNumber());
    }
    return _sub(lhs, rhs);
}
//# sourceMappingURL=sub.js.map