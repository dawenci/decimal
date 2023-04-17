import { make, NAN, INFINITY, NEG_INFINITY, ZERO, NEG_ZERO } from '../core/make.js';
import { cmp } from './cmp.js';
import { add } from './add.js';
import { sub } from './sub.js';
function _div(lhs, rhs, frac_count) {
    var maxDp = Math.max(lhs.getDecimalPlaces(), rhs.getDecimalPlaces());
    var retNeg = lhs.isNeg() !== rhs.isNeg();
    lhs = lhs.clone().moveDpp(maxDp).setNeg(false);
    rhs = rhs.clone().moveDpp(maxDp).setNeg(false);
    var ONE = make(1);
    var ret = make(0);
    while (cmp(lhs, rhs) >= 0) {
        var lCount = lhs.getIntegerCount();
        var rCount = rhs.getIntegerCount();
        var pow = lCount - rCount;
        var rhs_up = rhs.clone().moveDpp(pow);
        var cmpResult = cmp(lhs, rhs_up);
        if (cmpResult == -1) {
            rhs_up.moveDpp(-1);
            pow -= 1;
        }
        lhs = sub(lhs, rhs_up);
        ret = add(ret, ONE.clone().moveDpp(pow));
        if (cmpResult === 0) {
            return ret.setNeg(retNeg);
        }
    }
    var dp = 0;
    while (!lhs.isZero() && frac_count--) {
        --dp;
        lhs.moveDpp(1);
        var n = 0;
        while (cmp(lhs, rhs) >= 0) {
            lhs = sub(lhs, rhs);
            ++n;
        }
        if (n) {
            var m = make(n).moveDpp(dp);
            ret = add(ret, m);
        }
    }
    return ret.setNeg(retNeg);
}
export function div(lhs, rhs, fracCount) {
    if (fracCount === void 0) { fracCount = 50; }
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
    if (rhs.isOne())
        return lhs.clone().setNeg(lhs.isNeg() !== rhs.isNeg());
    return _div(lhs, rhs, fracCount);
}
//# sourceMappingURL=div.js.map