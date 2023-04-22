import { Decimal } from './decimal.js';
var Code;
(function (Code) {
    Code[Code["Neg"] = 45] = "Neg";
    Code[Code["Dot"] = 46] = "Dot";
    Code[Code["Exp"] = 101] = "Exp";
    Code[Code["Plus"] = 43] = "Plus";
    Code[Code["Minus"] = 45] = "Minus";
})(Code || (Code = {}));
function parse(raw) {
    var obj = { flag: 0, dpp: 0, digits: [] };
    if (raw == null || raw !== raw || raw === '') {
        obj.flag |= 1;
        return obj;
    }
    if (raw === 0) {
        return 1 / raw > 0 ? new Decimal([], 1, 0) : new Decimal([], 1, 0 | 128);
    }
    var str = String(raw).replace(/\s+/g, '').toLowerCase();
    if (str[0] === '+')
        str = str.slice(1);
    if (str[0] === '.')
        str = '0' + str;
    var len = str.length;
    if ((len === 8 && str === 'infinity') || (len === 9 && str === '+infinity')) {
        obj.flag |= 2;
        return obj;
    }
    else if (len === 9 && str === '-infinity') {
        obj.flag |= 2;
        obj.flag |= 128;
        return obj;
    }
    var neg = str.charCodeAt(0) === 45;
    var nan = false;
    var hasDp = false;
    var dpp = 0;
    var exp = 0;
    var digits = [];
    var i = neg ? 1 : 0;
    main: while (i < len) {
        var c = str.charCodeAt(i);
        if (c === 48 && !hasDp && digits.length === 0) {
            while (++i < len) {
                var c2 = str.charCodeAt(i);
                if (c2 === 46) {
                    digits.push(0);
                    ++dpp;
                    continue main;
                }
                else if (c2 === 48) {
                    continue;
                }
                else if (c2 === 101) {
                    exp = parseInt(str.slice(i + 1), 10);
                    if (_isNaN(exp)) {
                        nan = true;
                    }
                    else {
                        digits.push(0);
                        ++dpp;
                    }
                    break main;
                }
                else {
                    continue main;
                }
            }
            digits.push(0);
            ++dpp;
            break;
        }
        if (c >= 48 && c <= 57) {
            digits.push(c - 48);
            if (!hasDp)
                ++dpp;
            ++i;
            continue;
        }
        else if (c === 46) {
            if (!hasDp) {
                hasDp = true;
                ++i;
                continue;
            }
            else {
                nan = true;
                break;
            }
        }
        else if (c === 101) {
            exp = parseInt(str.slice(i + 1), 10);
            if (_isNaN(exp)) {
                nan = true;
            }
            break;
        }
        nan = true;
        break;
    }
    if (nan || !digits.length) {
        obj.flag |= 1;
        return obj;
    }
    obj.dpp = dpp;
    obj.digits = digits;
    strip_zeros(obj);
    if (exp && digits.length) {
        obj.dpp += exp;
    }
    if (neg) {
        obj.flag |= 128;
    }
    return obj;
}
function _isNaN(n) {
    return n !== n;
}
function strip_zeros(obj) {
    var j = obj.digits.length;
    while (j--) {
        if (obj.digits[j] !== 0)
            break;
        obj.digits.pop();
    }
    var prefixZeroCount = obj.digits.findIndex(function (n) { return n !== 0; });
    if (prefixZeroCount > 0) {
        obj.digits = obj.digits.slice(prefixZeroCount);
        obj.dpp -= prefixZeroCount;
    }
    return obj;
}
export function make(raw) {
    if (raw instanceof Decimal)
        return raw;
    if (raw == null) {
        return new Decimal();
    }
    var init = parse(raw);
    return new Decimal(init.digits, init.dpp, init.flag);
}
export function make_by_data(digits, dpp, flag) {
    var ret = new Decimal(digits, dpp, flag);
    strip_zeros(ret);
    return ret;
}
export var NAN = Object.freeze(make(NaN));
export var INFINITY = Object.freeze(make(Infinity));
export var NEG_INFINITY = Object.freeze(make(-Infinity));
export var ZERO = Object.freeze(make('0'));
export var NEG_ZERO = Object.freeze(make('-0'));
//# sourceMappingURL=make.js.map