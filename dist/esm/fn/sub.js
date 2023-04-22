import { Setting, make, NAN, INFINITY, NEG_INFINITY, ZERO, NEG_ZERO } from '../core/index.js';
import { make_by_data } from '../core/make.js';
import { cmp } from './cmp.js';
import { _add } from './add.js';
export function _sub(lhs, rhs, precision) {
    var neg1 = lhs.isNeg();
    var neg2 = rhs.isNeg();
    if (neg1 && neg2) {
        var temp = rhs.clone()._setNeg(false);
        rhs = lhs.clone()._setNeg(false);
        lhs = temp;
    }
    if (neg1 && !neg2) {
        return _add(lhs, rhs.clone()._setNeg(true), precision);
    }
    if (!neg1 && neg2) {
        return _add(lhs, rhs.clone()._setNeg(false), precision);
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
    var lFracCount = lhs._getFractionCount();
    var rFracCount = rhs._getFractionCount();
    var fracCount = Math.max(lFracCount, rFracCount);
    var lIntCount = lhs._getIntegerCount();
    var begin = -fracCount;
    var end = lIntCount;
    if (lhs.dpp !== rhs.dpp) {
        if (lhs.dpp - rhs.dpp >= precision) {
            var d = lhs.dpp - lhs._digitCount() - rhs.dpp;
            if (d >= 0) {
                var ret_1 = lhs.clone();
                var i = ret_1._digitCount();
                var borrow_1 = 0;
                while (i--) {
                    var v = ret_1._getDigit(i) - (1 + borrow_1);
                    borrow_1 = 0;
                    if (v < 0) {
                        ret_1._setDigit(i, v + 10);
                        borrow_1 = 1;
                        continue;
                    }
                    else {
                        ret_1._setDigit(i, v);
                        break;
                    }
                }
                if (ret_1._getDigit(0) === 0) {
                    ret_1._popFront();
                    ret_1.dpp -= 1;
                }
                var c = Math.min(d, precision - ret_1._digitCount());
                while (c-- > 0) {
                    ret_1._appendBack(9);
                }
                if (d === 0) {
                    if (rhs._digitCount() > 1) {
                        ret_1._appendBack(9 - rhs._getDigit(0));
                        ret_1._appendBack(1);
                    }
                    else {
                        ret_1._appendBack(10 - rhs._getDigit(0));
                    }
                }
                else {
                    ret_1._appendBack(9);
                }
                return ret_1._setNeg(!!retNeg);
            }
        }
    }
    var borrow = 0;
    var digits = [];
    for (var i = begin; i < end; ++i) {
        var r = lhs._get(i) - (rhs._get(i) + borrow);
        borrow = 0;
        if (r < 0) {
            digits.push(r + 10);
            borrow = 1;
        }
        else {
            digits.push(r);
        }
    }
    digits.reverse();
    var ret = make_by_data(digits, digits.length - fracCount, retNeg);
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
        return rhs.clone()._toggleNeg();
    }
    if (rhs.isZero())
        return lhs.clone();
    if (lhs.isInt() && rhs.isInt() && lhs._getIntegerCount() < 16 && rhs._getIntegerCount() < 16) {
        return make(lhs.toNumber() - rhs.toNumber());
    }
    return _sub(lhs, rhs, Setting.precision);
}
//# sourceMappingURL=sub.js.map