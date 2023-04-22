import { _ } from './placeholder.js';
import { make } from '../core/index.js';
import { div as div_ } from '../fn/index.js';
export function div(rhs, __) {
    var partial = make(rhs);
    return __ === _
        ? function (rhs) { return div_(partial, rhs); }
        : function (lhs) { return div_(lhs, partial); };
}
//# sourceMappingURL=div.js.map