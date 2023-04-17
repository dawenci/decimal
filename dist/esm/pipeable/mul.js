import { make } from '../core/make.js';
import { mul as _mul } from '../fn/mul.js';
export var mul = function (rhs) {
    var _rhs = make(rhs);
    return function (lhs) { return _mul(lhs, _rhs); };
};
//# sourceMappingURL=mul.js.map