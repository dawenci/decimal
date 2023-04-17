
const enum Code {
  Neg = 45,
  Dot = 46,
  Exp = 69,
  exp = 101,
  Plus = 43,
  Minus = 45,
}

export class Num {
  neg = false
  nan = false
  infinity = false
  dot = -1
  nums: number[] = []

  constructor(public raw = '') {
    this.parse()
  }

  isNaN() {
    return this.nan
  }

  isInfinity() {
    return this.infinity
  }

  parse() {
    // 统一成 string
    let str: any = String(this.raw).replace(/\s+/g, '')
    const len = str.length

    let nan = false
    let neg = false
    let exponent = -1
    let exponent_neg = false
    let dot = -1

    if (str.charCodeAt(0) === Code.Neg) {
      this.neg = neg = true
    }

    const nums: number[] = []
    let i = 0
    while (i < len) {
      const c = str.charCodeAt(i)

      // 0-9
      if (c >= 48 && c <= 57) {
        nums.push(c - 48)
        ++i
        continue
      }

      // .
      else if (c === Code.Dot) {
        if (!dot) {
          dot = i
          ++i
          continue
        }
        else {
          nan = true
          break
        }
      }

      // e | E
      else if (c === Code.Exp || c === Code.exp) {
        if (exponent === -1) {
          exponent = i
          const next = str.charCodeAt(i + 1)
          // e-n
          if (next === Code.Minus) {
            exponent_neg = true
            ++i
          }
          // e+n
          else if (next === Code.Plus) {
            ++i
          }
          ++i
          continue
        }
        else {
          nan = true
          break
        }
      }

      nan = true
      break
    }

    if (nan || !nums.length) {
      this.nan = true
      return
    }
    this.neg = neg
    this.dot = dot
    this.nums = nums
  }
}
