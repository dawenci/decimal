import { RoundingMode } from './rounding.js';
export interface ISetting {
    precision: number;
    rounding: RoundingMode;
    expThresholdPos: number;
    expThresholdNeg: number;
}
export declare const Setting: ISetting;
export declare function mergeSetting(value: Partial<ISetting>): void;
