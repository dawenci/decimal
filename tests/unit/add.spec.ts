import { make } from '../../src/core/make'
import { add } from '../../src/fn/add'

describe('fn/add', () => {
  it('add (NaN)', () => {
    expect(add(make(1), make(NaN)).toString()).toEqual('NaN')
    expect(add(make(NaN), make(1)).toString()).toEqual('NaN')
    expect(add(make(NaN), make(NaN)).toString()).toEqual('NaN')
  })

  it('add (Infinity)', () => {
    expect(add(make(Infinity), make(Infinity)).toString()).toEqual('Infinity')
    expect(add(make(-Infinity), make(-Infinity)).toString()).toEqual('-Infinity')
    expect(add(make(Infinity), make(-Infinity)).toString()).toEqual('NaN')
    expect(add(make(-Infinity), make(Infinity)).toString()).toEqual('NaN')
    expect(add(make(Infinity), make(1)).toString()).toEqual('Infinity')
    expect(add(make(-Infinity), make(1)).toString()).toEqual('-Infinity')
    expect(add(make(1), make(-Infinity)).toString()).toEqual('-Infinity')
    expect(add(make(1), make(Infinity)).toString()).toEqual('Infinity')
  })

  it('add (Zero)', () => {
    expect(add(make(0), make(0)).toString()).toEqual('0')
    expect(add(make(0), make(-0)).toString()).toEqual('0')
    expect(add(make(-0), make(0)).toString()).toEqual('0')
    expect(add(make(-0), make(-0)).toString()).toEqual('-0')

    expect(add(make(1), make(0)).toString()).toEqual('1')
    expect(add(make(-1), make(0)).toString()).toEqual('-1')
    expect(add(make(1), make(-0)).toString()).toEqual('1')
    expect(add(make(-1), make(-0)).toString()).toEqual('-1')
    expect(add(make(0), make(1)).toString()).toEqual('1')
    expect(add(make(-0), make(1)).toString()).toEqual('1')
    expect(add(make(0), make(-1)).toString()).toEqual('-1')
    expect(add(make(-0), make(-1)).toString()).toEqual('-1')
  })

  it('add (Int)', () => {
    expect(add(make(1), make(1)).toString()).toEqual('2')
    expect(add(make(6), make(6)).toString()).toEqual('12')
    expect(add(make(55), make(45)).toString()).toEqual('100')
    expect(add(make(4503599627370495), make(4503599627370495)).toString()).toEqual('9007199254740990')
    expect(add(make(-1), make(-1)).toString()).toEqual('-2')
    expect(add(make(-6), make(-6)).toString()).toEqual('-12')
    expect(add(make(-4503599627370495), make(-4503599627370495)).toString()).toEqual('-9007199254740990')
    expect(add(make(-4503599627370495), make(4503599627370495)).toString()).toEqual('0')
    expect(add(make(4503599627370495), make(-4503599627370495)).toString()).toEqual('0')
    // 测试大数进位
    expect(add(make(5000000000000000), make(5000000000000000)).toString()).toEqual('10000000000000000')
  })

  it('add (Float)', () => {
    expect(add(make(0.1), make(0.2)).toString()).toEqual('0.3')
    expect(add(make(0.01), make(0.2)).toString()).toEqual('0.21')
    expect(add(make(0.1), make(0.02)).toString()).toEqual('0.12')
    expect(add(make(0.55), make(0.45)).toString()).toEqual('1')
    expect(add(make(-0.1), make(-0.2)).toString()).toEqual('-0.3')
    expect(add(make(-0.01), make(-0.2)).toString()).toEqual('-0.21')
    expect(add(make(-0.1), make(-0.02)).toString()).toEqual('-0.12')
  })
})
