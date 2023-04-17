import { make } from '../core/make.js';
import { sub as _sub } from '../fn/sub.js';
export var sub = function (rhs) {
    var _rhs = make(rhs);
    return function (lhs) { return _sub(lhs, _rhs); };
};
//# sourceMappingURL=sub.js.map