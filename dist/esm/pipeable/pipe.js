import { make } from '../core/make.js';
export function pipe(num) {
    var fns = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        fns[_i - 1] = arguments[_i];
    }
    var n = make(num);
    fns = fns.slice().reverse();
    while (fns.length) {
        n = fns.pop()(n);
    }
    return n;
}
//# sourceMappingURL=pipe.js.map