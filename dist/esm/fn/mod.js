import { NAN, NEG_ZERO, ZERO } from '../core/index.js';
import { cmp } from './cmp.js';
import { _sub } from './sub.js';
export function _mod(lhs, rhs) {
    var retNeg = lhs.isNeg();
    var retDppOffset = rhs._getFractionCount();
    var lhs_copy = lhs.clone()._moveDpp(retDppOffset)._setNeg(false);
    var rhs_copy = rhs.clone()._moveDpp(retDppOffset)._setNeg(false);
    var cmpResult = cmp(lhs_copy, rhs_copy);
    if (cmpResult === 0) {
        return lhs.isNeg() ? NEG_ZERO : ZERO;
    }
    if (cmpResult === -1) {
        return lhs.clone();
    }
    var rCount = rhs_copy._getIntegerCount();
    var lCount;
    var pow;
    var rhs_up;
    do {
        if (lCount !== (lCount = lhs_copy._getIntegerCount())) {
            pow = lCount - rCount;
            rhs_up = rhs_copy.clone()._moveDpp(pow);
        }
        var cmpResult_1 = cmp(lhs_copy, rhs_up);
        if (cmpResult_1 == -1) {
            rhs_up._moveDpp(-1);
            pow -= 1;
        }
        lhs_copy = _sub(lhs_copy, rhs_up, Infinity);
        if (cmpResult_1 === 0) {
            return lhs_copy._setNeg(retNeg)._moveDpp(-retDppOffset);
        }
    } while (cmp(lhs_copy, rhs_copy) >= 0);
    return lhs_copy._setNeg(retNeg)._moveDpp(-retDppOffset);
}
export function mod(lhs, rhs) {
    if (lhs.isNaN() || rhs.isNaN() || lhs.isInfinity() || rhs.isZero())
        return NAN;
    if (lhs.isZero())
        return lhs.clone();
    if (rhs.isInfinity())
        return lhs.clone().setPrecision();
    return _mod(lhs, rhs).setPrecision();
}
//# sourceMappingURL=mod.js.map