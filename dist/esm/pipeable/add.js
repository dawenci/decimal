import { make } from '../core/make.js';
import { add as _add } from '../fn/add.js';
export var add = function (rhs) {
    var _rhs = make(rhs);
    return function (lhs) { return _add(lhs, _rhs); };
};
//# sourceMappingURL=add.js.map