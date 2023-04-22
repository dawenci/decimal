import { Setting } from '../core/index.js';
import { make, NAN, INFINITY, NEG_INFINITY, ZERO, NEG_ZERO } from '../core/make.js';
import { cmp } from './cmp.js';
import { _add } from './add.js';
import { _sub } from './sub.js';
function _div(lhs, rhs, precision) {
    var retNeg = lhs.isNeg() !== rhs.isNeg();
    var retDppOffset = 0;
    var lDp = lhs.dpp - lhs._digitCount();
    retDppOffset += lDp;
    lhs = lhs.clone()._moveDpp(-lDp)._setNeg(false);
    var rDp = rhs.dpp - rhs._digitCount();
    retDppOffset -= rDp;
    rhs = rhs.clone()._moveDpp(-rDp)._setNeg(false);
    var ONE = make(1);
    var ret = make(0);
    var rCount = rhs._getIntegerCount();
    var lCount;
    var pow;
    var rhs_up;
    while (cmp(lhs, rhs) >= 0) {
        if (lCount !== (lCount = lhs._getIntegerCount())) {
            pow = lCount - rCount;
            rhs_up = rhs.clone()._moveDpp(pow);
        }
        var cmpResult = cmp(lhs, rhs_up);
        if (cmpResult == -1) {
            rhs_up._moveDpp(-1);
            pow -= 1;
        }
        lhs = _sub(lhs, rhs_up, Infinity);
        ret = _add(ret, ONE.clone()._moveDpp(pow), Infinity);
        if (cmpResult === 0) {
            return ret._setNeg(retNeg)._moveDpp(retDppOffset);
        }
    }
    var dpp = 0;
    var frac_count = precision + 1;
    while (frac_count) {
        lhs._moveDpp(1);
        --dpp;
        var n = 0;
        var cmpResult = void 0;
        while ((cmpResult = cmp(lhs, rhs)) >= 0) {
            lhs = _sub(lhs, rhs, Infinity);
            ++n;
            if (cmpResult === 0)
                break;
        }
        if (n) {
            var m = make(n)._moveDpp(dpp);
            ret = _add(ret, m, Infinity);
            frac_count--;
        }
        else {
            if (ret._digitCount()) {
                frac_count--;
            }
        }
        if (cmpResult === 0) {
            return ret._setNeg(retNeg)._moveDpp(retDppOffset);
        }
    }
    var count = ret._digitCount();
    while (count++ < precision) {
        ret._appendBack(0);
    }
    ret._appendBack(1);
    return ret._setNeg(retNeg)._moveDpp(retDppOffset);
}
export function div(lhs, rhs) {
    if (lhs.isNaN() || rhs.isNaN())
        return NAN;
    var _a = lhs.isInfinity() ? [lhs, rhs] : rhs.isInfinity() ? [rhs, lhs] : [], infinity = _a[0], other = _a[1];
    if (infinity && other) {
        if (other.isInfinity())
            return NAN;
        if (infinity === lhs) {
            return infinity.isNeg() === other.isNeg() ? INFINITY : NEG_INFINITY;
        }
        return infinity.isNeg() === other.isNeg() ? ZERO : NEG_ZERO;
    }
    if (lhs.isZero()) {
        if (rhs.isZero())
            return NAN;
        return lhs.isNeg() === rhs.isNeg() ? ZERO : NEG_ZERO;
    }
    if (rhs.isZero()) {
        return lhs.isNeg() === rhs.isNeg() ? INFINITY : NEG_INFINITY;
    }
    if (rhs.isOne()) {
        return lhs
            .clone()
            ._setNeg(lhs.isNeg() !== rhs.isNeg())
            .setPrecision();
    }
    return _div(lhs, rhs, Setting.precision).setPrecision();
}
//# sourceMappingURL=div.js.map