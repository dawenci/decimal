export var cmp = function (n1, n2) {
    if (n1.isNaN() || n2.isNaN())
        return 0;
    if (n1.isInfinity()) {
        if (n1.isNeg()) {
            if (n2.isInfinity() && n2.isNeg())
                return 0;
            return -1;
        }
        else {
            if (n2.isInfinity() && !n2.isNeg())
                return 0;
            return 1;
        }
    }
    if (n2.isInfinity()) {
        if (n2.isNeg())
            return 1;
        return -1;
    }
    var neg1 = n1.isNeg();
    var neg2 = n2.isNeg();
    if (!neg1 && neg2)
        return 1;
    if (neg1 && !neg2)
        return -1;
    var int1 = n1._getIntegerCount();
    var int2 = n2._getIntegerCount();
    if (int1 > int2) {
        return neg1 ? -1 : 1;
    }
    else if (int2 > int1) {
        return neg1 ? 1 : -1;
    }
    if (n1._digitCount() < int1 && n2._digitCount() < int2) {
        var len = Math.max(n1._digitCount(), n2._digitCount());
        for (var i = 0; i < len; i += 1) {
            var v1 = n1._getDigit(i);
            var v2 = n2._getDigit(i);
            if (v1 === v2)
                continue;
            var ret = v1 > v2 ? 1 : -1;
            if (neg1)
                ret = (ret * -1);
            return ret;
        }
    }
    for (var i = int1 - 1; i >= 0; i -= 1) {
        var v1 = n1._get(i);
        var v2 = n2._get(i);
        if (v1 === v2)
            continue;
        var ret = v1 > v2 ? 1 : -1;
        if (neg1)
            ret = (ret * -1);
        return ret;
    }
    if (n1.dpp < 0 && n2.dpp < 0) {
        if (n1.dpp > n2.dpp) {
            return neg1 ? -1 : 1;
        }
        else if (n1.dpp < n2.dpp) {
            return neg1 ? 1 : -1;
        }
    }
    var dec = -Math.max(n1._getFractionCount(), n2._getFractionCount());
    var begin = n1.dpp < 0 && n2.dpp < 0 ? -Math.max(n1.dpp, n2.dpp) - 1 : -1;
    for (var i = begin; i >= dec; i -= 1) {
        var v1 = n1._get(i);
        var v2 = n2._get(i);
        if (v1 === v2)
            continue;
        var ret = v1 > v2 ? 1 : -1;
        if (neg1)
            ret = (ret * -1);
        return ret;
    }
    return 0;
};
//# sourceMappingURL=cmp.js.map