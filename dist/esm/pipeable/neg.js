import { Decimal, make } from '../core/index.js';
var _neg = function (input, value) {
    var decimal = input instanceof Decimal
        ? input.clone()
        : make(input);
    if (value != null) {
        return decimal._setNeg(value);
    }
    return decimal._toggleNeg();
};
export function neg(input) {
    if (typeof input === 'boolean') {
        return function (input2) {
            return _neg(input2, input);
        };
    }
    return _neg(input);
}
//# sourceMappingURL=neg.js.map