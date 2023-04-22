import { isRoundingMode, RoundingMode } from './rounding.js';
export var Setting = {
    precision: 20,
    rounding: RoundingMode.HalfEven,
    expThresholdPos: 21,
    expThresholdNeg: -7,
};
export function mergeSetting(value) {
    var precision = value.precision, rounding = value.rounding, expThresholdNeg = value.expThresholdNeg, expThresholdPos = value.expThresholdPos;
    if (precision != null && (precision | 0) >= 1) {
        Setting.precision = precision | 0;
    }
    if (isRoundingMode(rounding)) {
        Setting.rounding = rounding;
    }
    if (expThresholdPos != null) {
        Setting.expThresholdPos = expThresholdPos | 0;
    }
    if (expThresholdNeg != null) {
        Setting.expThresholdNeg = expThresholdNeg | 0;
    }
    Object.assign(Setting, value);
}
//# sourceMappingURL=setting.js.map