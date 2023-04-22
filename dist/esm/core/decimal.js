import { RoundingMode } from './rounding.js';
import { Setting } from './setting.js';
export var Flag;
(function (Flag) {
    Flag[Flag["Neg"] = 128] = "Neg";
    Flag[Flag["Nan"] = 1] = "Nan";
    Flag[Flag["Infinity"] = 2] = "Infinity";
})(Flag || (Flag = {}));
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
    Decimal.prototype.isInt = function () {
        return this._getFractionCount() === 0;
    };
    Decimal.prototype.isSafeInt = function () {
        if (!this.isInt())
            return false;
        var n = this._getIntegerCount();
        if (this.isNeg()) {
            var len = MAX_SAFE_INTEGER_ARR.length;
            if (n > len)
                return false;
            if (n < len)
                return true;
            while (len--) {
                if (this._get(len) > MAX_SAFE_INTEGER_ARR[len])
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
                if (this._get(len) > MIN_SAFE_INTEGER_ARR[len])
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
        return this.dpp === 1 && this._digitCount() === 0;
    };
    Decimal.prototype.isOne = function () {
        return this.dpp === 1 && this._digitCount() === 1 && this._get(0) === 1;
    };
    Decimal.prototype.toNumber = function () {
        if (this.isNaN())
            return NaN;
        if (this.isInfinity())
            return this.isNeg() ? -Infinity : Infinity;
        if (this.isZero())
            return this.isNeg() ? -0 : 0;
        return +this.toString();
    };
    Decimal.prototype.setPrecision = function (significantDigits, roundingMode) {
        if (significantDigits == null)
            significantDigits = Setting.precision;
        if (roundingMode == null)
            roundingMode = Setting.rounding;
        if (significantDigits < 1)
            return this;
        var len = this._digitCount();
        if (len > significantDigits) {
            var n = this._getDigit(significantDigits);
            this._sliceDigits(significantDigits);
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
                    carry = n >= 6 || (n === 5 && (len - significantDigits > 1 || this._getDigit(significantDigits - 1) % 2 === 1));
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
                var i_1 = this._digitCount();
                var c = false;
                while (i_1--) {
                    c = false;
                    var new_val = this._getDigit(i_1) + 1;
                    if (new_val < 10) {
                        this._setDigit(i_1, new_val);
                        break;
                    }
                    this._setDigit(i_1, new_val - 10);
                    c = true;
                }
                if (c) {
                    this._appendFront(1);
                    this._moveDpp(1);
                }
                var j = this._digitCount();
                while (j--) {
                    if (this._getDigit(j) !== 0)
                        break;
                    this._popBack();
                }
            }
            var i = this._digitCount();
            while (i--) {
                if (this._getDigit(i) === 0) {
                    this._popBack();
                    continue;
                }
                break;
            }
        }
        return this;
    };
    Decimal.prototype.toPrecision = function (arg) {
        var _a;
        if (this.isNaN())
            return 'NaN';
        if (this.isInfinity())
            return this.isNeg() ? '-Infinity' : 'Infinity';
        if (this.isZero()) {
            var sd_1 = typeof arg === 'number' ? arg : 1;
            var str = "".concat(this.isNeg() ? '-' : '', "0");
            if (sd_1 > 1)
                str += '.' + _repeat('0', sd_1 - 1);
            return str;
        }
        var sd;
        var opt;
        if (typeof arg === 'number') {
            sd = arg;
            opt = {};
        }
        else if (arg) {
            opt = arg;
            sd = (_a = opt.significantDigits) !== null && _a !== void 0 ? _a : this._digitCount();
        }
        else {
            sd = this._digitCount();
            opt = {};
        }
        if (sd < 1) {
            sd = this._digitCount() || 1;
        }
        var decimal = this.clone().setPrecision(sd, opt.rounding);
        return _print(decimal, opt.expThresholdPos, opt.expThresholdNeg, sd);
    };
    Decimal.prototype.toExponential = function (arg) {
        if (this.isNaN())
            return 'NaN';
        if (this.isInfinity())
            return this.isNeg() ? '-Infinity' : 'Infinity';
        var fd;
        var opt;
        if (typeof arg === 'number') {
            fd = arg;
            opt = {};
        }
        else if (arg) {
            opt = arg;
            fd = opt.fractionDigits;
        }
        else {
            opt = {};
        }
        if (this.isZero()) {
            var str = "".concat(this.isNeg() ? '-' : '', "0");
            if (fd)
                str += '.' + _repeat('0', fd);
            str += 'e+0';
            return str;
        }
        var decimal = fd != null ? this.clone().setPrecision(fd + 1, opt.rounding) : this;
        return _printExp(decimal, fd ? fd + 1 : void 0);
    };
    Decimal.prototype.toString = function () {
        if (this.isNaN())
            return 'NaN';
        if (this.isInfinity())
            return this.isNeg() ? '-Infinity' : 'Infinity';
        if (this.isZero())
            return this.isNeg() ? '-0' : '0';
        var decimal = this.clone().setPrecision(Setting.precision, Setting.rounding);
        return _print(decimal, Setting.expThresholdPos, Setting.expThresholdNeg, void 0);
    };
    Decimal.prototype._setNeg = function (v) {
        if (v) {
            this.flag |= 128;
        }
        else if (this.flag & 128) {
            this.flag ^= 128;
        }
        return this;
    };
    Decimal.prototype._toggleNeg = function () {
        this._setNeg(!this.isNeg());
        return this;
    };
    Decimal.prototype._moveDpp = function (n) {
        if (this._digitCount())
            this.dpp += n;
        return this;
    };
    Decimal.prototype._getFractionCount = function () {
        var n = this._digitCount() - this.dpp;
        return n > 0 ? n : 0;
    };
    Decimal.prototype._getIntegerCount = function () {
        return this.dpp > 0 ? this.dpp : 1;
    };
    Decimal.prototype._indexRange = function () {
        var begin = -this._getFractionCount();
        var end = this._getIntegerCount() - 1;
        return [begin, end];
    };
    Decimal.prototype._digitCount = function () {
        return this.digits.length;
    };
    Decimal.prototype._getDigit = function (index) {
        var _a;
        return (_a = this.digits[index]) !== null && _a !== void 0 ? _a : 0;
    };
    Decimal.prototype._setDigit = function (index, value) {
        this.digits[index] = value;
        return this;
    };
    Decimal.prototype._sliceDigits = function (significantDigits) {
        this.digits.length = significantDigits;
        return this;
    };
    Decimal.prototype._joinDigits = function () {
        return this.digits.join('');
    };
    Decimal.prototype._appendFront = function (value) {
        this.digits.unshift(value);
        return this;
    };
    Decimal.prototype._appendBack = function (value) {
        this.digits.push(value);
        return this;
    };
    Decimal.prototype._popBack = function () {
        return this.digits.pop();
    };
    Decimal.prototype._popFront = function () {
        return this.digits.shift();
    };
    Decimal.prototype._get = function (index) {
        return this._getDigit(this.dpp - 1 - index);
    };
    Decimal.prototype._getPoint = function () {
        return this.dpp;
    };
    return Decimal;
}());
export { Decimal };
function _print(decimal, expThresholdPos, expThresholdNeg, significantDigits) {
    var str = decimal.isNeg() ? '-' : '';
    var expThreshold = decimal.dpp <= 0 ? expThresholdNeg !== null && expThresholdNeg !== void 0 ? expThresholdNeg : Setting.expThresholdNeg : expThresholdPos !== null && expThresholdPos !== void 0 ? expThresholdPos : Setting.expThresholdPos;
    var digitCount = decimal._digitCount();
    var dpp = decimal.dpp;
    if (dpp <= 0 && (dpp - 1) <= expThreshold) {
        return _printExp(decimal, significantDigits);
    }
    if (dpp >= 1 && dpp - 1 >= expThreshold || (significantDigits && decimal._getIntegerCount() > significantDigits)) {
        return _printExp(decimal, significantDigits);
    }
    if (dpp <= 0) {
        str += '0.' + _repeat('0', -dpp);
        str += decimal._joinDigits();
        if (significantDigits) {
            str += _repeat('0', significantDigits - digitCount);
        }
        return str;
    }
    if (significantDigits) {
        var i = -1;
        while (++i < significantDigits) {
            if (dpp === i)
                str += '.';
            str += decimal._getDigit(i);
        }
    }
    else {
        var _a = decimal._indexRange(), begin = _a[0], end = _a[1];
        var i = end + 1;
        while (--i >= 0) {
            str += decimal._get(i);
        }
        if (begin < 0) {
            str += '.';
            var i_2 = 0;
            while (i_2-- > begin) {
                str += decimal._get(i_2);
            }
        }
    }
    return str;
}
function _printExp(decimal, significantDigits) {
    var str = (decimal.isNeg() ? '-' : '') + decimal._getDigit(0);
    if (significantDigits) {
        if (significantDigits > 1) {
            str += '.';
            var i = 0;
            while (++i < significantDigits) {
                str += decimal._getDigit(i);
            }
        }
    }
    else {
        var digitCount = decimal._digitCount();
        if (digitCount > 1) {
            str += '.';
            var i = 0;
            while (++i < digitCount) {
                str += decimal._getDigit(i);
            }
        }
    }
    str += (decimal.dpp <= 0 ? 'e' : 'e+') + String(decimal.dpp - 1);
    return str;
}
function _repeat(str, n) {
    if (n < 1)
        return '';
    var ret = str;
    while (--n)
        ret += str;
    return ret;
}
//# sourceMappingURL=decimal.js.map