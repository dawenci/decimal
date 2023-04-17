import { NAN } from '../core/make.js';
import { cmp } from './cmp.js';
import { sub } from './sub.js';
export function mod(lhs, rhs) {
    if (lhs.isNaN() || rhs.isNaN() || lhs.isInfinity())
        return NAN;
    if (rhs.isInfinity())
        return lhs.clone();
    var retNeg = lhs.isNeg();
    var maxDp = Math.max(lhs.getDecimalPlaces(), rhs.getDecimalPlaces());
    lhs = lhs.clone().moveDpp(maxDp).setNeg(false);
    rhs = rhs.clone().moveDpp(maxDp).setNeg(false);
    while (cmp(lhs, rhs) >= 0) {
        var lCount = lhs.getIntegerCount();
        var rCount = rhs.getIntegerCount();
        var pow = lCount - rCount;
        var rhs_up = rhs.clone().moveDpp(pow);
        var cmpResult = cmp(lhs, rhs_up);
        if (cmpResult == -1) {
            rhs_up.moveDpp(-1);
        }
        lhs = sub(lhs, rhs_up);
        if (cmpResult === 0) {
            break;
        }
    }
    return lhs.moveDpp(-maxDp).setNeg(retNeg);
}
//# sourceMappingURL=mod.js.map