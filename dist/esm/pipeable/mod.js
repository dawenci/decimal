import { _ } from './placeholder.js';
import { make } from '../core/index.js';
import { mod as _mod } from '../fn/index.js';
export var mod = function (rhs, __) {
    var partial = make(rhs);
    return __ === _
        ? function (rhs) { return _mod(partial, rhs); }
        : function (lhs) { return _mod(lhs, partial); };
};
//# sourceMappingURL=mod.js.map