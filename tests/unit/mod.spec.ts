import { make } from '../../src/core/make'
import { mod } from '../../src/fn/mod'

describe('fn/mod', () => {
  it('mod(NaN)', () => {
    expect(mod(make(NaN), make(NaN)).toString()).toEqual('NaN')
    expect(mod(make(1), make(NaN)).toString()).toEqual('NaN')
    expect(mod(make(NaN), make(1)).toString()).toEqual('NaN')
  })

  it('mod(Infinity)', () => {
    expect(mod(make(Infinity), make(0)).toString()).toEqual('NaN')
    expect(mod(make(-Infinity), make(0)).toString()).toEqual('NaN')
    expect(mod(make(Infinity), make(1)).toString()).toEqual('NaN')
    expect(mod(make(-Infinity), make(1)).toString()).toEqual('NaN')
    expect(mod(make(Infinity), make(-1)).toString()).toEqual('NaN')
    expect(mod(make(-Infinity), make(-1)).toString()).toEqual('NaN')

    expect(mod(make(0), make(Infinity)).toString()).toEqual('0')
    expect(mod(make(-0), make(Infinity)).toString()).toEqual('-0')
    expect(mod(make(1), make(Infinity)).toString()).toEqual('1')
    expect(mod(make(-1), make(Infinity)).toString()).toEqual('-1')
    expect(mod(make(0), make(-Infinity)).toString()).toEqual('0')
    expect(mod(make(-0), make(-Infinity)).toString()).toEqual('-0')
    expect(mod(make(1), make(-Infinity)).toString()).toEqual('1')
    expect(mod(make(-1), make(-Infinity)).toString()).toEqual('-1')
  })

  it('mod(Int)', () => {
    expect(mod(make(1), make(1)).toString()).toEqual('0')
    expect(mod(make(1), make(2)).toString()).toEqual('1')
    expect(mod(make(2), make(1)).toString()).toEqual('0')
    expect(mod(make(3), make(2)).toString()).toEqual('1')
    expect(mod(make(100), make(2)).toString()).toEqual('0')
  })

  it('mod(Float)', () => {
    expect(mod(make(0.1), make(0.2)).toString()).toEqual('0.1')
    expect(mod(make(0.01), make(0.02)).toString()).toEqual('0.01')
    expect(mod(make(0.001), make(0.02)).toString()).toEqual('0.001')

    expect(mod(make(0.2), make(0.1)).toString()).toEqual('0')
    expect(mod(make(0.02), make(0.01)).toString()).toEqual('0')
    expect(mod(make(0.02), make(0.001)).toString()).toEqual('0')

    expect(mod(make(0.3), make(0.2)).toString()).toEqual('0.1')
  })
})
