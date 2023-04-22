import { RoundingMode } from './rounding.js'
import { Setting, mergeSetting } from './setting.js'

export const enum Flag {
  Neg = 0b10000000,
  Nan = 0b00000001,
  Infinity = 0b00000010,
}

export interface DecimalData {
  /**
   * 存储有效数字
   * 为空时，如果 dpp 为 1，代表 +-0，否则应该为 NaN 或 +-Infinity
   */
  digits: number[]

  /**
   * decimal point position
   *
   * 存储小数点位置，
   * 1. 小于零时，表示 (0.[n个0]小数) 这种整数部分为 0 的小数，并且在有效数字前补零，例如：
   *   1.1 {digits:[ ], dpp:-1} -> 0.00 -> 0
   *   1.2 {digits:[1], dpp:-1} -> 0.01
   *   1.2 {digits:[11], dpp:-1} -> 0.011
   * 2. 等于零时，表示 (0.小数) 这种整数部分为 0 的小数，例如：
   *   2.1 {digits:[ ], dpp: 0} -> 0.0 -> 0
   *   2.2 {digits:[1], dpp: 0} -> 0.1
   *   2.3 {digits:[11], dpp: 0} -> 0.11
   * 3. 大于 0，小于有效数字长度时，表示普通的 (整数.小数) 两部分的数字：
   *   3.1 {digits:[11], dpp: 1} -> 1.1
   *   3.2 {digits:[1111], dpp: 2} -> 11.11
   * 4. 等于有效数字数量时，表示等于有效数字的整数：
   *   4.1 {digits:[111], dpp: 3} -> 111
   * 5. 大于有效数字数量时，表示 (整数[n个0]) 形式的整数，即效数字后面需要补零，例如：
   *   5.1 {digits:[ ], dpp: 1} -> 00 -> 0
   *   5.2 {digits:[1], dpp: 2} -> 10
   *   5.2 {digits:[1], dpp: 3} -> 100
   */
  dpp: number

  /**
   * 存储 正负、NaN、Infinity 等信息
   */
  flag: number
}

export interface PrintOptions {
  rounding?: RoundingMode
  expThresholdPos?: number
  expThresholdNeg?: number
}

export interface ToPrecisionOptions extends PrintOptions {
  significantDigits?: number
}

export interface ToExponentialOptions extends PrintOptions {
  fractionDigits?: number
}

const MAX_SAFE_INTEGER_ARR = String(Number.MAX_SAFE_INTEGER)
  .split('')
  .map(n => +n)
  .reverse()
const MIN_SAFE_INTEGER_ARR = String(Number.MIN_SAFE_INTEGER)
  .split('')
  .slice(1)
  .map(n => +n)
  .reverse()

// TODO，数据结构优化，改成压位存储
// 处理十进制数字，其他进制的需要先转换成十进制后再使用
export class Decimal implements DecimalData {
  constructor(public digits: number[] = [], public dpp = 1, public flag = 0) {

  }

  /**
   * 获取一份对象深拷贝
   */
  clone(): Decimal {
    return new Decimal(this.digits.slice(), this.dpp, this.flag)
  }

  /**
   * 是否整数
   */
  isInt(): boolean {
    return this._getFractionCount() === 0
  }

  /**
   * 是否为 [Number,MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER] 之间的整数
   */
  isSafeInt(): boolean {
    if (!this.isInt()) return false
    const n = this._getIntegerCount()
    if (this.isNeg()) {
      let len = MAX_SAFE_INTEGER_ARR.length
      if (n > len) return false
      if (n < len) return true
      while (len--) {
        if (this._get(len) > MAX_SAFE_INTEGER_ARR[len]) return false
      }
      return true
    } else {
      let len = MIN_SAFE_INTEGER_ARR.length
      if (n > len) return false
      if (n < len) return true
      while (len--) {
        if (this._get(len) > MIN_SAFE_INTEGER_ARR[len]) return false
      }
      return true
    }
  }

  /**
   * 是否负数
   */
  isNeg(): boolean {
    return !!(this.flag & Flag.Neg)
  }

  /**
   * 是否 NaN
   */
  isNaN(): boolean {
    return !!(this.flag & Flag.Nan)
  }

  /**
   * 是否 +-Infinity
   */
  isInfinity(): boolean {
    return !!(this.flag & Flag.Infinity)
  }

  /**
   * 是否数字 +-0
   */
  isZero(): boolean {
    return this.dpp === 1 && this._digitCount() === 0
  }

  /**
   * 是否数字 1
   */
  isOne(): boolean {
    return this.dpp === 1 && this._digitCount() === 1 && this._get(0) === 1
  }

  /**
   * 转为 JavaScript Number 值（结果无法保证精确）
   */
  toNumber(): number {
    if (this.isNaN()) return NaN
    if (this.isInfinity()) return this.isNeg() ? -Infinity : Infinity
    if (this.isZero()) return this.isNeg() ? -0 : 0
    return +this.toString()
  }

  /**
   * 设置有效数字数量
   * 必须是大于等于 1，且小于等于当前的 precision
   */
  setPrecision(significantDigits?: number, roundingMode?: RoundingMode): this {
    if (significantDigits == null) significantDigits = Setting.precision
    if (roundingMode == null) roundingMode = Setting.rounding

    if (significantDigits < 1) return this

    const len = this._digitCount()
    if (len > significantDigits) {
      // 舍弃位，四舍五入等策略时，需要用来做比较
      const n = this._getDigit(significantDigits)

      this._sliceDigits(significantDigits)

      let carry = false
      switch (roundingMode) {
        case RoundingMode.Up: {
          carry = true
          break
        }
        case RoundingMode.Down: {
          break
        }
        case RoundingMode.Ceiling: {
          carry = !this.isNeg()
          break
        }
        case RoundingMode.Floor: {
          carry = this.isNeg()
          break
        }
        case RoundingMode.HalfUp: {
          carry = n >= 5
          break
        }
        case RoundingMode.HalfDown: {
          carry = n >= 6 || (n === 5 && len - significantDigits > 1)
          break
        }
        case RoundingMode.HalfEven: {
          carry = n >= 6 || (n === 5 && (len - significantDigits > 1 || this._getDigit(significantDigits - 1) % 2 === 1))
          break
        }
        case RoundingMode.HalfCeiling: {
          carry = n >= 6 || (n === 5 && (!this.isNeg() || len - significantDigits > 1))
          break
        }

        case RoundingMode.HalfFloor: {
          carry = n >= 6 || (n === 5 && (this.isNeg() || len - significantDigits > 1))
          break
        }
      }

      // 需要进位
      if (carry) {
        let i = this._digitCount()
        let c = false
        while (i--) {
          c = false
          const new_val = this._getDigit(i) + 1
          if (new_val < 10) {
            this._setDigit(i, new_val)
            break
          }
          this._setDigit(i, new_val - 10)
          c = true
        }
        // 最高位也发生了进位
        if (c) {
          this._appendFront(1)
          this._moveDpp(1)
        }

        // 移除末尾 0
        let j = this._digitCount()
        while (j--) {
          if (this._getDigit(j) !== 0) break
          this._popBack()
        }
      }

      // 处理完毕后，digits 末尾可能存在 0，清理无效 0
      let i = this._digitCount()
      while (i--) {
        if (this._getDigit(i) === 0) {
          this._popBack()
          continue
        }
        break
      }
    }
    return this
  }

  /**
   * 按照指定 precision 打印结果字符串
   * 注意：与 Number.prototype.toPrecision 不一样的地方是，该方法区分正负 0
   */
  toPrecision(): string
  toPrecision(significantDigits: number): string
  toPrecision(printOptions: ToPrecisionOptions): string
  toPrecision(arg?: number | ToPrecisionOptions): string {
    if (this.isNaN()) return 'NaN'
    if (this.isInfinity()) return this.isNeg() ? '-Infinity' : 'Infinity'
    if (this.isZero()) {
      let sd = typeof arg === 'number' ? arg : 1
      let str = `${this.isNeg() ? '-' : ''}0`
      if (sd > 1) str += '.' + _repeat('0', sd - 1)
      return str
    }

    let sd: number
    let opt: ToPrecisionOptions
    if (typeof arg === 'number') {
      sd = arg
      opt = {}
    } else if (arg) {
      opt = arg as ToPrecisionOptions
      sd = opt.significantDigits ?? this._digitCount()
    } else {
      sd = this._digitCount()
      opt = {}
    }

    if (sd < 1) {
      sd = this._digitCount() || 1
    }

    const decimal = this.clone().setPrecision(sd, opt.rounding)

    return _print(
      decimal,
      opt.expThresholdPos,
      opt.expThresholdNeg,
      sd,
    )
  }

  /**
   * 注意：与 Number.prototype.toExponential 不一样的地方是，该方法区分正负 0
   */
  toExponential(): string
  toExponential(fractionDigits: number): string
  toExponential(printOptions: ToExponentialOptions): string
  toExponential(arg?: number | ToExponentialOptions): string {
    if (this.isNaN()) return 'NaN'
    if (this.isInfinity()) return this.isNeg() ? '-Infinity' : 'Infinity'
    let fd: number | undefined
    let opt: ToExponentialOptions
    if (typeof arg === 'number') {
      fd = arg
      opt = {}
    } else if (arg) {
      opt = arg as ToExponentialOptions
      fd = opt.fractionDigits
    } else {
      opt = {}
    }

    if (this.isZero()) {
      let str = `${this.isNeg() ? '-' : ''}0`
      if (fd) str += '.' + _repeat('0', fd)
      str += 'e+0'
      return str
    }

    const decimal = fd != null ? this.clone().setPrecision(fd + 1, opt.rounding) : this
    return _printExp(decimal, fd ? fd + 1 : void 0)
  }

  /**
   * 打印结果字符串
   * 注意：与 Number.prototype.toString 不一样的地方是，该方法区分正负 0
   */
  toString(): string {
    if (this.isNaN()) return 'NaN'
    if (this.isInfinity()) return this.isNeg() ? '-Infinity' : 'Infinity'
    if (this.isZero()) return this.isNeg() ? '-0' : '0'

    // TODO, 是否需要？
    const decimal = this.clone().setPrecision(Setting.precision, Setting.rounding)
    return _print(
      decimal,
      Setting.expThresholdPos,
      Setting.expThresholdNeg,
      void 0
    )
  }

  /**
   * 设置正负值
   */
  _setNeg(v: boolean): this {
    if (v) {
      this.flag |= Flag.Neg
    } else if (this.flag & Flag.Neg) {
      this.flag ^= Flag.Neg
    }
    return this
  }

  /**
   * 反转正负数
   */
  _toggleNeg(): this {
    this._setNeg(!this.isNeg())
    return this
  }

  /**
   * 移动 dpp
   */
  _moveDpp(n: number) {
    if (this._digitCount()) this.dpp += n
    return this
  }

  /** 有多少位有效小数 */
  _getFractionCount(): number {
    const n = this._digitCount() - this.dpp
    return n > 0 ? n : 0
  }

  /**
   * 有多少位整数
   * 取值大于等于 1（0.x 算 1 个整数 0）
   */
  _getIntegerCount(): number {
    return this.dpp > 0 ? this.dpp : 1
  }

  _indexRange(): [number, number] {
    const begin = -this._getFractionCount()
    const end = this._getIntegerCount() - 1
    return [begin, end]
  }

  _digitCount(): number {
    return this.digits.length
  }

  _getDigit(index: number) {
    return this.digits[index] ?? 0
  }

  _setDigit(index: number, value: number) {
    this.digits[index] = value
    return this
  }

  _sliceDigits(significantDigits: number) {
    this.digits.length = significantDigits
    return this
  }
  
  _joinDigits(): string {
    return this.digits.join('')
  }

  _appendFront(value: number) {
    this.digits.unshift(value)
    return this
  }

  _appendBack(value: number) {
    this.digits.push(value)
    return this
  }

  _popBack() {
    return this.digits.pop()
  }

  _popFront() {
    return this.digits.shift()
  }

  /**
   * 0 为个位数，1 为十位数…
   * -1 为小数第一位，-2 为小数第二位…
   */
  _get(index: number): number {
    return this._getDigit(this.dpp - 1 - index)
  }

  /**
   * 从左往右算，小数点的位置
   */
  _getPoint(): number {
    return this.dpp
  }
}

export type t = Decimal

function _print(
  decimal: Decimal,
  expThresholdPos?: number,
  expThresholdNeg?: number,
  significantDigits?: number
): string {
  let str = decimal.isNeg() ? '-' : ''
  const expThreshold = decimal.dpp <= 0 ? expThresholdNeg ?? Setting.expThresholdNeg : expThresholdPos ?? Setting.expThresholdPos
  const digitCount = decimal._digitCount()
  const dpp = decimal.dpp

  // 1. 包含达到阈值的前置 0 的小数
  // -> n.n...e-n...，如 0.1 -> 1e-1, 0.01 -> 1e-2
  // 注意：dpp 从 0 开始代表小数，而 expThreshold 从 -1 开始
  if (dpp <= 0 && (dpp - 1) <= expThreshold) {
    return _printExp(decimal, significantDigits)
  }

  // 2. 
  // 2.1 包含达到阈值位数的整数
  // 2.2 或者如果指定了精度，且整数部分长度超过精度，需要裁剪并用指数形式展示
  // -> n.n...e+n...
  if (dpp >= 1 && dpp - 1 >= expThreshold || (significantDigits && decimal._getIntegerCount() > significantDigits)) {
    return _printExp(decimal, significantDigits)
  }

  // 3. 小数
  if (dpp <= 0) {
    str += '0.' + _repeat('0', -dpp)
    // decimal 传入前已经裁剪好 digits，直接拼接即可
    str += decimal._joinDigits()
    // 如果指定了 significantDigits，则如果长度不够，末尾使用 0 来补足
    if (significantDigits) {
      str += _repeat('0', significantDigits - digitCount)
    }
    return str
  }

  // 4. 整数或者同时包含整数、小数
  if (significantDigits) {
    let i = -1
    while (++i < significantDigits) {
      if (dpp === i) str += '.'
      str += decimal._getDigit(i)
    }
  } else {
    const [begin, end] = decimal._indexRange()
    let i = end + 1
    while (--i >= 0) {
      str += decimal._get(i)
    }
    if (begin < 0) {
      str += '.'
      let i = 0
      while (i-- > begin) {
        str += decimal._get(i)
      }
    }
  }

  return str
}

function _printExp(
  decimal: Decimal,
  significantDigits?: number
): string {
  let str = (decimal.isNeg() ? '-' : '') + decimal._getDigit(0)

  // 明确指定了 significantDigits（如 toPrecision 场景），则小数点后，保留足够的位数（不够用 0 补）
  if (significantDigits) {
    if (significantDigits > 1) {
      str += '.'
      let i = 0
      while (++i < significantDigits) {
        str += decimal._getDigit(i)
      }
    }
  }

  // 没有指定 significantDigits（如 toString 场景），则有多少拼多少
  else {
    const digitCount = decimal._digitCount()
    if (digitCount > 1) {
      str += '.'
      let i = 0
      while (++i < digitCount) {
        str += decimal._getDigit(i)
      }
    }
  }

  str += (decimal.dpp <= 0 ? 'e' : 'e+') + String(decimal.dpp - 1)

  return str
}

function _repeat(str: string, n: number): string {
  if (n < 1) return ''
  let ret = str
  while (--n) ret += str
  return ret
}
