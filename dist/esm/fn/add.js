import { Setting, make, NAN, INFINITY, NEG_INFINITY, ZERO, NEG_ZERO } from '../core/index.js';
import { make_by_data } from '../core/make.js';
import { _sub } from './sub.js';
export function _add(lhs, rhs, precision) {
    var neg1 = lhs.isNeg();
    var neg2 = rhs.isNeg();
    if (neg1 && !neg2) {
        return _sub(rhs, lhs.clone()._setNeg(false), precision);
    }
    if (!neg1 && neg2) {
        return _sub(lhs, rhs.clone()._setNeg(false), precision);
    }
    var lFracCount = lhs._getFractionCount();
    var rFracCount = rhs._getFractionCount();
    var fracCount = Math.max(lFracCount, rFracCount);
    var lIntCount = lhs._getIntegerCount();
    var rIntCount = rhs._getIntegerCount();
    var begin = -fracCount;
    var end = lIntCount > rIntCount ? lIntCount : rIntCount;
    if (lhs.dpp !== rhs.dpp) {
        var _a = lhs.dpp > rhs.dpp ? [lhs, rhs] : [rhs, lhs], big = _a[0], small = _a[1];
        if (big.dpp - small.dpp >= precision) {
            var d = big.dpp - big._digitCount() - small.dpp;
            if (d >= 0) {
                var ret_1 = big.clone();
                var count = ret_1._digitCount();
                while (count++ < precision) {
                    ret_1._appendBack(0);
                }
                if (d === 0) {
                    ret_1._appendBack(small._getDigit(0));
                    if (small._digitCount() > 1) {
                        ret_1._appendBack(1);
                    }
                }
                else {
                    ret_1._appendBack(1);
                }
                return ret_1;
            }
        }
    }
    var carry = 0;
    var digits = [];
    for (var i = begin; i < end; ++i) {
        var r = lhs._get(i) + rhs._get(i) + carry;
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
    var ret = make_by_data(digits, digits.length - fracCount, lhs.flag);
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
            return lhs.isNeg() && rhs.isNeg() ? NEG_ZERO : ZERO;
        }
        return rhs.clone().setPrecision();
    }
    if (rhs.isZero())
        return lhs.clone().setPrecision();
    if (lhs.isInt() && rhs.isInt() && lhs._getIntegerCount() < 16 && rhs._getIntegerCount() < 16) {
        return make(lhs.toNumber() + rhs.toNumber()).setPrecision();
    }
    return _add(lhs, rhs, Setting.precision).setPrecision();
}
//# sourceMappingURL=add.js.map