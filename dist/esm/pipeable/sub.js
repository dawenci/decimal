import { _ } from './placeholder.js';
import { make } from '../core/index.js';
import { sub as _sub } from '../fn/index.js';
export var sub = function (rhs, __) {
    var partial = make(rhs);
    return __ === _
        ? function (rhs) { return _sub(partial, rhs); }
        : function (lhs) { return _sub(lhs, partial); };
};
//# sourceMappingURL=sub.js.map