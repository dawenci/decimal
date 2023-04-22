import { Decimal, DecimalData, Flag } from './decimal.js'

const enum Code {
  Neg = 45,
  Dot = 46,
  Exp = 101,
  Plus = 43,
  Minus = 45,
}

function parse(raw: any): DecimalData {
  const obj: DecimalData = { flag: 0, dpp: 0, digits: [] }

  if (raw == null || raw !== raw || raw === '') {
    obj.flag |= Flag.Nan
    return obj
  }

  // 特殊处理负零
  if (raw === 0) {
    return 1 / raw > 0 ? new Decimal([], 1, 0) : new Decimal([], 1, 0 | Flag.Neg)
  }

  // 统一成 string
  let str = String(raw).replace(/\s+/g, '').toLowerCase()
  if (str[0] === '+') str = str.slice(1)
  if (str[0] === '.') str = '0' + str
  const len = str.length

  if ((len === 8 && str === 'infinity') || (len === 9 && str === '+infinity')) {
    obj.flag |= Flag.Infinity
    return obj
  } else if (len === 9 && str === '-infinity') {
    obj.flag |= Flag.Infinity
    obj.flag |= Flag.Neg
    return obj
  }

  const neg = str.charCodeAt(0) === Code.Neg
  let nan = false
  let hasDp = false
  let dpp = 0
  let exp = 0

  const digits: number[] = []

  let i = neg ? 1 : 0
  main: while (i < len) {
    const c = str.charCodeAt(i)

    // 第一个数字为 0 时
    if (c === 48 && !hasDp && digits.length === 0) {
      while (++i < len) {
        const c2 = str.charCodeAt(i)

        // 遇到小数点，保留一个 0,退回外层循环
        if (c2 === Code.Dot) {
          digits.push(0)
          ++dpp
          continue main
        }
        // 0 后连续出现的 0, 忽略
        else if (c2 === 48) {
          continue
        }
        // 遇到 exp
        else if (c2 === Code.Exp) {
          exp = parseInt(str.slice(i + 1), 10)
          if (_isNaN(exp)) {
            nan = true
          } else {
            // 0 的指数无论是多少，结果都是 0，保留一个 0
            digits.push(0)
            ++dpp
          }
          // 退出外层循环
          break main
        }
        // 遇到其他字符，退出外层循环，抛掉所有 0
        else {
          continue main
        }
      }
      // 解析结束，输入本身就是单个 0
      digits.push(0)
      ++dpp
      break
    }

    // 0-9
    if (c >= 48 && c <= 57) {
      digits.push(c - 48)
      if (!hasDp) ++dpp
      ++i
      continue
    }

    // .
    else if (c === Code.Dot) {
      if (!hasDp) {
        hasDp = true
        ++i
        continue
      }
      // 多个小数点，非法
      else {
        nan = true
        break
      }
    }

    // e
    else if (c === Code.Exp) {
      exp = parseInt(str.slice(i + 1), 10)
      if (_isNaN(exp)) {
        nan = true
      }
      break
    }

    nan = true
    break
  }

  if (nan || !digits.length) {
    obj.flag |= Flag.Nan
    return obj
  }

  obj.dpp = dpp
  obj.digits = digits
  strip_zeros(obj)

  // 根据指数移动小数点
  if (exp && digits.length) {
    obj.dpp += exp
  }

  if (neg) {
    obj.flag |= Flag.Neg
  }

  return obj
}

function _isNaN(n: any) {
  return n !== n
}

// 处理 digits，只保留有效数字，移除前后的 0（使用时，通过小数点位置就可以反向推算出数字）
function strip_zeros(obj: DecimalData) {
  // strip trailing zeros
  let j = obj.digits.length
  while (j--) {
    if (obj.digits[j] !== 0) break
    obj.digits.pop()
  }
  // strip leading zeros
  const prefixZeroCount = obj.digits.findIndex(n => n !== 0)
  if (prefixZeroCount > 0) {
    obj.digits = obj.digits.slice(prefixZeroCount)
    obj.dpp -= prefixZeroCount
  }
  return obj
}

export function make(raw?: unknown): Decimal {
  if (raw instanceof Decimal) return raw
  if (raw == null) {
    return new Decimal()
  }
  const init = parse(raw)
  return new Decimal(init.digits, init.dpp, init.flag)
}

export function make_by_data(digits: number[], dpp: number, flag: number): Decimal {
  const ret = new Decimal(digits, dpp, flag)
  strip_zeros(ret)
  return ret
}

// TODO hex
// export function of_hex(str: string): Decimal

// TODO binary
// export function of_binary(str: string): Decimal

export const NAN = Object.freeze(make(NaN))
export const INFINITY = Object.freeze(make(Infinity))
export const NEG_INFINITY = Object.freeze(make(-Infinity))
export const ZERO = Object.freeze(make('0'))
export const NEG_ZERO = Object.freeze(make('-0'))
