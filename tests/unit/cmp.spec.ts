import { make } from '../../src/core/make'
import { cmp } from '../../src/fn/cmp'

describe('fn/cmp', () => {
  it('cmp(NaN)', () => {
    expect(cmp(make(NaN), make(NaN))).toEqual(0)
    expect(cmp(make(NaN), make(1))).toEqual(0)
    expect(cmp(make(1), make(NaN))).toEqual(0)
  })

  it('cmp(infinity)', () => {
    expect(cmp(make(Infinity), make(Infinity))).toEqual(0)
    expect(cmp(make(-Infinity), make(-Infinity))).toEqual(0)
    expect(cmp(make(Infinity), make(-Infinity))).toEqual(1)
    expect(cmp(make(Infinity), make(1))).toEqual(1)
    expect(cmp(make(-Infinity), make(Infinity))).toEqual(-1)
    expect(cmp(make(1), make(Infinity))).toEqual(-1)
    expect(cmp(make(1), make(-Infinity))).toEqual(1)
  })

  it('cmp(+, +)', () => {
    expect(cmp(make(1), make(1))).toEqual(0)
    expect(cmp(make(2), make(1))).toEqual(1)
    expect(cmp(make(1), make(2))).toEqual(-1)

    expect(cmp(make(11), make(11))).toEqual(0)
    expect(cmp(make(12), make(11))).toEqual(1)
    expect(cmp(make(11), make(12))).toEqual(-1)

    expect(cmp(make(10), make(1))).toEqual(1)
    expect(cmp(make(1), make(10))).toEqual(-1)

    expect(cmp(make(0.001), make(0.001))).toEqual(0)
    expect(cmp(make(0.002), make(0.001))).toEqual(1)
    expect(cmp(make(0.001), make(0.002))).toEqual(-1)
  })

  it('cmp(+, -)', () => {
    expect(cmp(make(1), make(-1))).toEqual(1)
    expect(cmp(make(2), make(-1))).toEqual(1)
    expect(cmp(make(1), make(-2))).toEqual(1)
  })

  it('cmp(-, +)', () => {
    expect(cmp(make(-1), make(1))).toEqual(-1)
    expect(cmp(make(-2), make(1))).toEqual(-1)
    expect(cmp(make(-1), make(2))).toEqual(-1)
  })

  it('cmp(-, -)', () => {
    expect(cmp(make(-1), make(-1))).toEqual(0)
    expect(cmp(make(-2), make(-1))).toEqual(-1)
    expect(cmp(make(-1), make(-2))).toEqual(1)

    expect(cmp(make(-11), make(-11))).toEqual(0)
    expect(cmp(make(-12), make(-11))).toEqual(-1)
    expect(cmp(make(-11), make(-12))).toEqual(1)

    expect(cmp(make(-10), make(-1))).toEqual(-1)
    expect(cmp(make(-1), make(-10))).toEqual(1)

    expect(cmp(make(-0.001), make(-0.001))).toEqual(0)
    expect(cmp(make(-0.002), make(-0.001))).toEqual(-1)
    expect(cmp(make(-0.001), make(-0.002))).toEqual(1)
  })
})
