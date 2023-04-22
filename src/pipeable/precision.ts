import type { PipeableMaker } from './pipe.js'
import { RoundingMode } from '../core/index.js'

export const precision: PipeableMaker = (significantDigits: number, roundingMode?: RoundingMode) => {
  return n => n.clone().setPrecision(significantDigits, roundingMode)
}
