import { make } from '../core/make.js';
import { div as _div } from '../fn/div.js';
export var div = function (rhs) {
    var _rhs = make(rhs);
    return function (lhs) { return _div(lhs, _rhs); };
};
//# sourceMappingURL=div.js.map