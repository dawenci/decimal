import { isRoundingMode, RoundingMode } from './rounding.js'

export interface ISetting {
  /**
   * 生成 Decimal 对象的函数，
   * 需要将结果按照 rounding 模式舍入到该精度有效数字
   * 
   * 注意：Decimal 构造函数、clone 方法不读取该设置
   */
  precision: number

  /**
   * 舍入模式
   */
  rounding: RoundingMode

  /**
   * toString 时，指数计数法阈值（e+）
   */
  expThresholdPos: number
  
  /**
   * toString 时，指数计数法阈值（e-）
   */
  expThresholdNeg: number
}

export const Setting: ISetting = {
  precision: 20,
  rounding: RoundingMode.HalfEven,
  expThresholdPos: 21,
  expThresholdNeg: -7,
}

export function mergeSetting(value: Partial<ISetting>) {
  const { precision, rounding, expThresholdNeg, expThresholdPos  } = value

  if (precision != null && (precision | 0) >= 1) {
    Setting.precision = precision | 0
  }

  if (isRoundingMode(rounding)) {
    Setting.rounding = rounding
  }

  if (expThresholdPos != null) {
    Setting.expThresholdPos = expThresholdPos | 0
  }

  if (expThresholdNeg != null) {
    Setting.expThresholdNeg = expThresholdNeg | 0
  }

  Object.assign(Setting, value)
}
