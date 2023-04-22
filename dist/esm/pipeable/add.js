import { make } from '../core/index.js';
import { add as _add } from '../fn/index.js';
export var add = function (rhs) {
    var partial = make(rhs);
    return function (lhs) { return _add(lhs, partial); };
};
//# sourceMappingURL=add.js.map