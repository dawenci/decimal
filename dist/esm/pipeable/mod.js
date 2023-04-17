import { make } from '../core/make.js';
import { mod as _mod } from '../fn/mod.js';
export var mod = function (rhs) {
    var _rhs = make(rhs);
    return function (lhs) { return _mod(lhs, _rhs); };
};
//# sourceMappingURL=mod.js.map