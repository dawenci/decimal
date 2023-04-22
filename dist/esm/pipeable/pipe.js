var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { make } from '../core/index.js';
export function pipe(input) {
    var fns = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        fns[_i - 1] = arguments[_i];
    }
    return _pipe.apply(void 0, __spreadArray([make(input)], fns, false));
}
function _pipe(input) {
    var fns = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        fns[_i - 1] = arguments[_i];
    }
    var result = input;
    for (var i = 0; i < fns.length; i += 1) {
        result = fns[i](result);
    }
    return result;
}
//# sourceMappingURL=pipe.js.map