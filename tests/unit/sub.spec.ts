import { make } from '../../src/core/make'
import { sub } from '../../src/fn/sub'

describe('fn/sub', () => {
  it('sub(NaN)', () => {
    expect(sub(make(1), make(NaN)).toString()).toEqual('NaN')
    expect(sub(make(NaN), make(1)).toString()).toEqual('NaN')
    expect(sub(make(NaN), make(NaN)).toString()).toEqual('NaN')
  })

  it('sub(Infinity)', () => {
    expect(sub(make(Infinity), make(Infinity)).toString()).toEqual('NaN')
    expect(sub(make(-Infinity), make(-Infinity)).toString()).toEqual('NaN')
    expect(sub(make(Infinity), make(-Infinity)).toString()).toEqual('Infinity')
    expect(sub(make(-Infinity), make(Infinity)).toString()).toEqual('-Infinity')
    expect(sub(make(Infinity), make(1)).toString()).toEqual('Infinity')
    expect(sub(make(-Infinity), make(1)).toString()).toEqual('-Infinity')
    expect(sub(make(1), make(-Infinity)).toString()).toEqual('Infinity')
    expect(sub(make(1), make(Infinity)).toString()).toEqual('-Infinity')
  })

  it('sub(Zero)', () => {
    expect(sub(make(0), make(0)).toString()).toEqual('0')
    expect(sub(make(0), make(0)).toString()).toEqual('0')
    expect(sub(make(0), make(-0)).toString()).toEqual('0')
    expect(sub(make(-0), make(0)).toString()).toEqual('-0')
    expect(sub(make(-0), make(-0)).toString()).toEqual('0')
    expect(sub(make(0), make(-1)).toString()).toEqual('1')
    expect(sub(make(0), make(1)).toString()).toEqual('-1')
    expect(sub(make(1), make(0)).toString()).toEqual('1')
    expect(sub(make(-1), make(0)).toString()).toEqual('-1')
  })


  it('sub(Int)', () => {    
    expect(sub(make(1), make(1)).toString()).toEqual('0')
    expect(sub(make(2), make(1)).toString()).toEqual('1')
    expect(sub(make(1), make(2)).toString()).toEqual('-1')
    expect(sub(make(11), make(2)).toString()).toEqual('9')
    expect(sub(make(2), make(11)).toString()).toEqual('-9')
    expect(sub(make(9007199254740990), make(4503599627370495)).toString()).toEqual('4503599627370495')
    expect(sub(make(4503599627370495), make(9007199254740990)).toString()).toEqual('-4503599627370495')

    expect(sub(make(1), make(-1)).toString()).toEqual('2')
    expect(sub(make(1), make(-2)).toString()).toEqual('3')
    expect(sub(make(2), make(-1)).toString()).toEqual('3')
    expect(sub(make(-1), make(1)).toString()).toEqual('-2')
    expect(sub(make(-1), make(2)).toString()).toEqual('-3')
    expect(sub(make(-2), make(1)).toString()).toEqual('-3')
    expect(sub(make(-1), make(-1)).toString()).toEqual('0')
    expect(sub(make(-1), make(-2)).toString()).toEqual('1')
    expect(sub(make(-2), make(-1)).toString()).toEqual('-1')
  })

  it('sub (Float)', () => {
    expect(sub(make(0.2), make(0.1)).toString()).toEqual('0.1')
    expect(sub(make(0.1), make(0.2)).toString()).toEqual('-0.1')
    expect(sub(make(0.01), make(0.2)).toString()).toEqual('-0.19')
    expect(sub(make(0.2), make(0.01)).toString()).toEqual('0.19')
    expect(sub(make(0.1), make(0.02)).toString()).toEqual('0.08')
    expect(sub(make(0.02), make(0.1)).toString()).toEqual('-0.08')

    expect(sub(make(-0.1), make(-0.3)).toString()).toEqual('0.2')
    expect(sub(make(-0.3), make(-0.1)).toString()).toEqual('-0.2')
    expect(sub(make(0.1), make(-0.2)).toString()).toEqual('0.3')
    expect(sub(make(0.2), make(-0.1)).toString()).toEqual('0.3')
    expect(sub(make(-0.1), make(0.2)).toString()).toEqual('-0.3')
    expect(sub(make(-0.2), make(0.1)).toString()).toEqual('-0.3')
  })
})
