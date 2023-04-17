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

/**
 * 0 - 6 与 Java 中的 BigDecimal 的 RoundingMode 一致。
 */
export enum RoundingMode {
  /**
   * 负 <- - - 0 - - -> 正
   * ---------------------
   * 精度保留的末位，朝远离 0 的方向进位，即整数往 Infinity 方向，负数往 -Infinity 方向进位。
   * 如 0.333，保留 2 位小数，结果：0.34
   * 如 -0.333，保留 2 位小数，结果：-0.34
   */
  Up = 0,

  /**
   * 负 -> - - 0 - - <- 正
   * ---------------------
   * 直接截断无需进位。
   * 如 0.555，保留 2 位小数，结果：0.55
   */
  Down = 1,

  /**
   * 负 -> - - 0 - - -> 正
   * ---------------------
   * 精度保留的末位，不论正负数，均朝 Infinity 方向进位。即正数远离 0 方向进位，负数直接截断。
   */
  Ceiling = 2,

  /**
   * 负 <- - - 0 - - <- 正
   * ---------------------
   * 精度保留的末位，不论正负数，均朝 -Infinity 方向进位。即负数远离 0 方向进位，正数直接截断。
   */
  Floor = 3,

  /**
   *
   * 正数     ->
   * <- - - half - - ->
   * ------------------
   *
   * 负数     <-
   * <- - - half - - ->
   * ------------------
   *
   * 远离 0 的方向四舍五入。
   */
  HalfUp = 4,

  /**
   * 正数     <-
   * <- - - half - - ->
   * ------------------
   *
   * 负数     ->
   * <- - - half - - ->
   * ------------------
   *
   * 远离 0 的方向五舍六入。
   * 注意：舍去部分的最高位等于 5 的时候，如果舍去部分还有不为零的数，也仍然需要进位。
   */
  HalfDown = 5,

  /**
   * 银行家舍入，舍入位非 5，则四舍六入，否则根据保留的末位是奇数还是偶数，奇进偶舍。
   */
  HalfEven = 6,

  /**
   * 朝 Infinity 方向四舍五入。
   */
  HalfCeiling = 7,

  /**
   * 朝 Infinity 方向五舍六入。
   */
  HalfFloor = 8,
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

// 处理十进制数字，其他进制的需要先转换成十进制后再使用
export class Decimal implements DecimalData {
  constructor(public digits: number[] = [], public dpp = 1, public flag = 0) {}

  /**
   * 获取一份对象深拷贝
   */
  clone(): Decimal {
    return new Decimal(this.digits.slice(), this.dpp, this.flag)
  }

  /** 有多少位有效小数 */
  getDecimalPlaces(): number {
    const n = this.digits.length - this.dpp
    return n > 0 ? n : 0
  }

  /**
   * 有多少位整数
   * 取值大于等于 1（0.x 算 1 个整数 0）
   */
  getIntegerCount(): number {
    return this.dpp > 0 ? this.dpp : 1
  }

  /**
   * 0 为个位数，1 为十位数…
   * -1 为小数第一位，-2 为小数第二位…
   */
  get(index: number): number {
    return this.digits[this.dpp - 1 - index] || 0
  }

  /**
   * 从左往右算，小数点的位置
   */
  getPoint(): number {
    return this.dpp
  }

  /**
   * 获取完整的数字序列
   */
  toArray() {
    const digits = this.digits.slice()

    // 小数点小于等于 0，则前面需要补零，小数点位置大于 digits.length，则需要在后面补零
    if (this.dpp <= 0) {
      return Array(-this.dpp + 1)
        .fill(0)
        .concat(digits)
    }

    if (this.dpp > digits.length) {
      return digits.concat(Array(this.dpp - digits.length).fill(0))
    }

    return digits
  }

  /**
   * 是否整数
   */
  isInt(): boolean {
    return this.getDecimalPlaces() === 0
  }

  /**
   * 是否为 [Number,MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER] 之间的整数
   */
  isSafeInt(): boolean {
    if (!this.isInt()) return false
    const n = this.getIntegerCount()
    if (this.isNeg()) {
      let len = MAX_SAFE_INTEGER_ARR.length
      if (n > len) return false
      if (n < len) return true
      while (len--) {
        if (this.get(len) > MAX_SAFE_INTEGER_ARR[len]) return false
      }
      return true
    } else {
      let len = MIN_SAFE_INTEGER_ARR.length
      if (n > len) return false
      if (n < len) return true
      while (len--) {
        if (this.get(len) > MIN_SAFE_INTEGER_ARR[len]) return false
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
    return !this.digits.length && this.dpp === 1
  }

  /**
   * 是否数字 1
   */
  isOne(): boolean {
    return this.digits.length === 1 && this.digits[0] === 1 && this.dpp === 1
  }

  /**
   * 设置正负值
   */
  setNeg(v: boolean): this {
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
  toggleNeg(): this {
    this.setNeg(!this.isNeg())
    return this
  }

  /**
   * 移动 dpp
   */
  moveDpp(n: number) {
    if (this.digits.length) this.dpp += n
    return this
  }

  /**
   * 转为 JavaScript Number 值（结果无法保证精确）
   */
  toNumber(): number {
    if (this.isNaN()) return NaN
    if (this.isInfinity()) return this.isNeg() ? -Infinity : Infinity
    if (this.isZero()) return this.isNeg() ? -0 : 0

    const digits: any[] = this.toArray()
    // 存在小数点
    if (this.getDecimalPlaces()) {
      if (digits[0] === 0) {
        digits.splice(1, 0, '.')
      } else {
        digits.splice(this.dpp, 0, '.')
      }
    }
    return Number((this.isNeg() ? '-' : '') + digits.join(''))
  }

  /**
   * 获取有效数字数量
   */
  getPrecision(): number {
    const len = this.digits.length
    if (len) return len
    return this.isNaN() || this.isInfinity() ? 0 : 1
  }

  /**
   * 设置有效数字数量
   * 必须是大于等于 1，且小于等于当前的 precision
   */
  setPrecision(significantDigits: number, roundingMode: RoundingMode = RoundingMode.HalfEven): this {
    if (significantDigits < 1) return this

    const len = this.digits.length
    if (len > significantDigits) {
      // 舍弃位，四舍五入等策略时，需要用来做比较
      const n = this.digits[significantDigits]

      this.digits = this.digits.slice(0, significantDigits)

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
          carry = n >= 6 || (n === 5 && this.digits[significantDigits - 1] % 2 === 1)
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
        let i = this.digits.length
        let c = false
        while (i--) {
          c = false
          if (++this.digits[i] < 10) {
            break
          }
          this.digits[i] -= 10
          c = true
        }
        // 最高位也发生了进位
        if (c) {
          this.digits.unshift(1)
          this.moveDpp(1)
        }

        // 移除末尾 0
        let j = this.digits.length
        while (j--) {
          if (this.digits[j] !== 0) break
          this.digits.pop()
        }
      }
    }
    return this
  }

  /**
   * 按照指定 precision 打印结果字符串
   * 与 Js 不一样的是，-0 的负号会保留
   */
  toPrecision(significantDigits?: number, roundingMode?: RoundingMode): string {
    if (significantDigits == null || significantDigits < 1 || this.isNaN() || this.isInfinity()) return this.toString()

    if (this.isZero()) {
      let str = `${this.isNeg() ? '-' : ''}0`
      if (significantDigits > 1) {
        str += '.'
        while (--significantDigits) {
          str += '0'
        }
      }
      return str
    }

    let str = this.clone().setPrecision(significantDigits, roundingMode).toString()

    let len = str.length
    if (str[0] === '-') len -= 1
    if (/^-?0/.test(str)) len -= 1
    const hasPoint = str.indexOf('.') !== -1
    if (hasPoint) len -= 1

    if (len < significantDigits) {
      if (!hasPoint) {
        str += '.'
      }
      while (len++ < significantDigits) {
        // 末尾补零
        str += '0'
      }
    }

    return str
  }

  /**
   * 打印结果字符串
   */
  toString(): string {
    if (this.isNaN()) return 'NaN'
    if (this.isInfinity()) return this.isNeg() ? '-Infinity' : 'Infinity'
    if (this.isZero()) return this.isNeg() ? '-0' : '0'

    const digits: any[] = this.toArray()
    // 存在小数点
    if (this.getDecimalPlaces()) {
      if (digits[0] === 0) {
        digits.splice(1, 0, '.')
      } else {
        digits.splice(this.dpp, 0, '.')
      }
    }
    return (this.isNeg() ? '-' : '') + digits.join('')
  }
}
export type t = Decimal
