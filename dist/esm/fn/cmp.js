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
    var int1 = n1.getIntegerCount();
    var int2 = n2.getIntegerCount();
    if (int1 > int2) {
        return neg1 ? -1 : 1;
    }
    else if (int2 > int1) {
        return neg1 ? 1 : -1;
    }
    for (var i = int1 - 1; i >= 0; i -= 1) {
        var v1 = n1.get(i);
        var v2 = n2.get(i);
        if (v1 === v2)
            continue;
        var ret = v1 > v2 ? 1 : -1;
        if (neg1)
            ret = (ret * -1);
        return ret;
    }
    var dec = -Math.max(n1.getDecimalPlaces(), n2.getDecimalPlaces());
    for (var i = -1; i >= dec; i -= 1) {
        var v1 = n1.get(i);
        var v2 = n2.get(i);
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