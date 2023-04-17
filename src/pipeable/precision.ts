import { Pipeable } from './pipe.js'

export const precision: Pipeable = (v: number) => {
  return n => n.clone().setPrecision(v)
}
