import { _ } from './placeholder.js';
import { make } from '../core/index.js';
import { cmp as _cmp } from '../fn/index.js';
export var cmp = function (rhs, __) {
    var partial = make(rhs);
    return __ === _
        ? function (rhs) { return make(_cmp(partial, rhs)); }
        : function (lhs) { return make(_cmp(lhs, partial)); };
};
//# sourceMappingURL=cmp.js.map