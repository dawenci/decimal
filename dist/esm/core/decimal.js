export var Flag;
(function (Flag) {
    Flag[Flag["Neg"] = 128] = "Neg";
    Flag[Flag["Nan"] = 1] = "Nan";
    Flag[Flag["Infinity"] = 2] = "Infinity";
})(Flag || (Flag = {}));
export var RoundingMode;
(function (RoundingMode) {
    RoundingMode[RoundingMode["Up"] = 0] = "Up";
    RoundingMode[RoundingMode["Down"] = 1] = "Down";
    RoundingMode[RoundingMode["Ceiling"] = 2] = "Ceiling";
    RoundingMode[RoundingMode["Floor"] = 3] = "Floor";
    RoundingMode[RoundingMode["HalfUp"] = 4] = "HalfUp";
    RoundingMode[RoundingMode["HalfDown"] = 5] = "HalfDown";
    RoundingMode[RoundingMode["HalfEven"] = 6] = "HalfEven";
    RoundingMode[RoundingMode["HalfCeiling"] = 7] = "HalfCeiling";
    RoundingMode[RoundingMode["HalfFloor"] = 8] = "HalfFloor";
})(RoundingMode || (RoundingMode = {}));
var MAX_SAFE_INTEGER_ARR = String(Number.MAX_SAFE_INTEGER)
    .split('')
    .map(function (n) { return +n; })
    .reverse();
var MIN_SAFE_INTEGER_ARR = String(Number.MIN_SAFE_INTEGER)
    .split('')
    .slice(1)
    .map(function (n) { return +n; })
    .reverse();
var Decimal = (function () {
    function Decimal(digits, dpp, flag) {
        if (digits === void 0) { digits = []; }
        if (dpp === void 0) { dpp = 1; }
        if (flag === void 0) { flag = 0; }
        this.digits = digits;
        this.dpp = dpp;
        this.flag = flag;
    }
    Decimal.prototype.clone = function () {
        return new Decimal(this.digits.slice(), this.dpp, this.flag);
    };
    Decimal.prototype.getDecimalPlaces = function () {
        var n = this.digits.length - this.dpp;
        return n > 0 ? n : 0;
    };
    Decimal.prototype.getIntegerCount = function () {
        return this.dpp > 0 ? this.dpp : 1;
    };
    Decimal.prototype.get = function (index) {
        return this.digits[this.dpp - 1 - index] || 0;
    };
    Decimal.prototype.getPoint = function () {
        return this.dpp;
    };
    Decimal.prototype.toArray = function () {
        var digits = this.digits.slice();
        if (this.dpp <= 0) {
            return Array(-this.dpp + 1)
                .fill(0)
                .concat(digits);
        }
        if (this.dpp > digits.length) {
            return digits.concat(Array(this.dpp - digits.length).fill(0));
        }
        return digits;
    };
    Decimal.prototype.isInt = function () {
        return this.getDecimalPlaces() === 0;
    };
    Decimal.prototype.isSafeInt = function () {
        if (!this.isInt())
            return false;
        var n = this.getIntegerCount();
        if (this.isNeg()) {
            var len = MAX_SAFE_INTEGER_ARR.length;
            if (n > len)
                return false;
            if (n < len)
                return true;
            while (len--) {
                if (this.get(len) > MAX_SAFE_INTEGER_ARR[len])
                    return false;
            }
            return true;
        }
        else {
            var len = MIN_SAFE_INTEGER_ARR.length;
            if (n > len)
                return false;
            if (n < len)
                return true;
            while (len--) {
                if (this.get(len) > MIN_SAFE_INTEGER_ARR[len])
                    return false;
            }
            return true;
        }
    };
    Decimal.prototype.isNeg = function () {
        return !!(this.flag & 128);
    };
    Decimal.prototype.isNaN = function () {
        return !!(this.flag & 1);
    };
    Decimal.prototype.isInfinity = function () {
        return !!(this.flag & 2);
    };
    Decimal.prototype.isZero = function () {
        return !this.digits.length && this.dpp === 1;
    };
    Decimal.prototype.isOne = function () {
        return this.digits.length === 1 && this.digits[0] === 1 && this.dpp === 1;
    };
    Decimal.prototype.setNeg = function (v) {
        if (v) {
            this.flag |= 128;
        }
        else if (this.flag & 128) {
            this.flag ^= 128;
        }
        return this;
    };
    Decimal.prototype.toggleNeg = function () {
        this.setNeg(!this.isNeg());
        return this;
    };
    Decimal.prototype.moveDpp = function (n) {
        if (this.digits.length)
            this.dpp += n;
        return this;
    };
    Decimal.prototype.toNumber = function () {
        if (this.isNaN())
            return NaN;
        if (this.isInfinity())
            return this.isNeg() ? -Infinity : Infinity;
        if (this.isZero())
            return this.isNeg() ? -0 : 0;
        var digits = this.toArray();
        if (this.getDecimalPlaces()) {
            if (digits[0] === 0) {
                digits.splice(1, 0, '.');
            }
            else {
                digits.splice(this.dpp, 0, '.');
            }
        }
        return Number((this.isNeg() ? '-' : '') + digits.join(''));
    };
    Decimal.prototype.getPrecision = function () {
        var len = this.digits.length;
        if (len)
            return len;
        return this.isNaN() || this.isInfinity() ? 0 : 1;
    };
    Decimal.prototype.setPrecision = function (significantDigits, roundingMode) {
        if (roundingMode === void 0) { roundingMode = RoundingMode.HalfEven; }
        if (significantDigits < 1)
            return this;
        var len = this.digits.length;
        if (len > significantDigits) {
            var n = this.digits[significantDigits];
            this.digits = this.digits.slice(0, significantDigits);
            var carry = false;
            switch (roundingMode) {
                case RoundingMode.Up: {
                    carry = true;
                    break;
                }
                case RoundingMode.Down: {
                    break;
                }
                case RoundingMode.Ceiling: {
                    carry = !this.isNeg();
                    break;
                }
                case RoundingMode.Floor: {
                    carry = this.isNeg();
                    break;
                }
                case RoundingMode.HalfUp: {
                    carry = n >= 5;
                    break;
                }
                case RoundingMode.HalfDown: {
                    carry = n >= 6 || (n === 5 && len - significantDigits > 1);
                    break;
                }
                case RoundingMode.HalfEven: {
                    carry = n >= 6 || (n === 5 && this.digits[significantDigits - 1] % 2 === 1);
                    break;
                }
                case RoundingMode.HalfCeiling: {
                    carry = n >= 6 || (n === 5 && (!this.isNeg() || len - significantDigits > 1));
                    break;
                }
                case RoundingMode.HalfFloor: {
                    carry = n >= 6 || (n === 5 && (this.isNeg() || len - significantDigits > 1));
                    break;
                }
            }
            if (carry) {
                var i = this.digits.length;
                var c = false;
                while (i--) {
                    c = false;
                    if (++this.digits[i] < 10) {
                        break;
                    }
                    this.digits[i] -= 10;
                    c = true;
                }
                if (c) {
                    this.digits.unshift(1);
                    this.moveDpp(1);
                }
                var j = this.digits.length;
                while (j--) {
                    if (this.digits[j] !== 0)
                        break;
                    this.digits.pop();
                }
            }
        }
        return this;
    };
    Decimal.prototype.toPrecision = function (significantDigits, roundingMode) {
        if (significantDigits == null || significantDigits < 1 || this.isNaN() || this.isInfinity())
            return this.toString();
        if (this.isZero()) {
            var str_1 = "".concat(this.isNeg() ? '-' : '', "0");
            if (significantDigits > 1) {
                str_1 += '.';
                while (--significantDigits) {
                    str_1 += '0';
                }
            }
            return str_1;
        }
        var str = this.clone().setPrecision(significantDigits, roundingMode).toString();
        var len = str.length;
        if (str[0] === '-')
            len -= 1;
        if (/^-?0/.test(str))
            len -= 1;
        var hasPoint = str.indexOf('.') !== -1;
        if (hasPoint)
            len -= 1;
        if (len < significantDigits) {
            if (!hasPoint) {
                str += '.';
            }
            while (len++ < significantDigits) {
                str += '0';
            }
        }
        return str;
    };
    Decimal.prototype.toString = function () {
        if (this.isNaN())
            return 'NaN';
        if (this.isInfinity())
            return this.isNeg() ? '-Infinity' : 'Infinity';
        if (this.isZero())
            return this.isNeg() ? '-0' : '0';
        var digits = this.toArray();
        if (this.getDecimalPlaces()) {
            if (digits[0] === 0) {
                digits.splice(1, 0, '.');
            }
            else {
                digits.splice(this.dpp, 0, '.');
            }
        }
        return (this.isNeg() ? '-' : '') + digits.join('');
    };
    return Decimal;
}());
export { Decimal };
//# sourceMappingURL=decimal.js.map