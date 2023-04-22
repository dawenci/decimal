import { make } from '../core/index.js';
import { mul as _mul } from '../fn/index.js';
export var mul = function (rhs) {
    var partial = make(rhs);
    return function (lhs) { return _mul(lhs, partial); };
};
//# sourceMappingURL=mul.js.map