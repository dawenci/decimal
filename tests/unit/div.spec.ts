import { make } from '../../src/core/make'
import { div } from '../../src/fn/div'

describe('fn/div', () => {
  it('div(NaN)', () => {
    expect(div(make(1), make(NaN)).toString()).toEqual('NaN')
    expect(div(make(NaN), make(1)).toString()).toEqual('NaN')
    expect(div(make(NaN), make(NaN)).toString()).toEqual('NaN')
  })

  it('div(Infinity)', () => {
    expect(div(make(Infinity), make(Infinity)).toString()).toEqual('NaN')
    expect(div(make(-Infinity), make(-Infinity)).toString()).toEqual('NaN')
    expect(div(make(Infinity), make(-Infinity)).toString()).toEqual('NaN')
    expect(div(make(-Infinity), make(Infinity)).toString()).toEqual('NaN')
    expect(div(make(Infinity), make(1)).toString()).toEqual('Infinity')
    expect(div(make(-Infinity), make(1)).toString()).toEqual('-Infinity')
    expect(div(make(1), make(Infinity)).toString()).toEqual('0')
    expect(div(make(1), make(-Infinity)).toString()).toEqual('-0')
  })

  it('div(Zero)', () => {
    expect(div(make(0), make(0)).toString()).toEqual('NaN')
    expect(div(make(-0), make(0)).toString()).toEqual('NaN')
    expect(div(make(0), make(-0)).toString()).toEqual('NaN')
    expect(div(make(-0), make(-0)).toString()).toEqual('NaN')

    expect(div(make(0), make(1)).toString()).toEqual('0')
    expect(div(make(-0), make(1)).toString()).toEqual('-0')
    expect(div(make(0), make(-1)).toString()).toEqual('-0')
    expect(div(make(-0), make(-1)).toString()).toEqual('0')
    expect(div(make(0), make(Infinity)).toString()).toEqual('0')
    expect(div(make(-0), make(Infinity)).toString()).toEqual('-0')
    expect(div(make(0), make(-Infinity)).toString()).toEqual('-0')
    expect(div(make(-0), make(-Infinity)).toString()).toEqual('0')

    expect(div(make(1), make(0)).toString()).toEqual('Infinity')
    expect(div(make(-1), make(0)).toString()).toEqual('-Infinity')
    expect(div(make(1), make(-0)).toString()).toEqual('-Infinity')
    expect(div(make(-1), make(-0)).toString()).toEqual('Infinity')
    expect(div(make(Infinity), make(0)).toString()).toEqual('Infinity')
    expect(div(make(-Infinity), make(0)).toString()).toEqual('-Infinity')
    expect(div(make(Infinity), make(-0)).toString()).toEqual('-Infinity')
    expect(div(make(-Infinity), make(-0)).toString()).toEqual('Infinity')
  })

  it('div(One)', () => {
    expect(div(make(2), make(1)).toString()).toEqual('2')
    expect(div(make(2), make(-1)).toString()).toEqual('-2')
    expect(div(make(2.2), make(1)).toString()).toEqual('2.2')
    expect(div(make(2.2), make(-1)).toString()).toEqual('-2.2')
  })

  it('div(Int)', () => {
    expect(div(make(1), make(1)).toString()).toEqual('1')
    expect(div(make(2), make(1)).toString()).toEqual('2')
    expect(div(make(1), make(2)).toString()).toEqual('0.5')

    expect(div(make(100), make(1)).toString()).toEqual('100')
    expect(div(make(200), make(1)).toString()).toEqual('200')
    expect(div(make(100), make(2)).toString()).toEqual('50')

    expect(div(make(1), make(100)).toString()).toEqual('0.01')
    expect(div(make(2), make(100)).toString()).toEqual('0.02')
    expect(div(make(1), make(200)).toString()).toEqual('0.005')
  })

  it('div(Float)', () => {
    expect(div(make(0.1), make(0.1)).toString()).toEqual('1')
    expect(div(make(0.2), make(0.1)).toString()).toEqual('2')
    expect(div(make(0.1), make(0.2)).toString()).toEqual('0.5')

    expect(div(make(0.01), make(0.1)).toString()).toEqual('0.1')
    expect(div(make(0.001), make(0.1)).toString()).toEqual('0.01')
  })

  it('div(fracCount)', () => {
    expect(div(make(1), make(3), 3).toString()).toEqual('0.333')
    expect(div(make(10), make(3), 3).toString()).toEqual('3.333')
    expect(div(make(100), make(3), 3).toString()).toEqual('33.333')
    expect(div(make(1000), make(3), 3).toString()).toEqual('333.333')
    expect(div(make(10000), make(3), 3).toString()).toEqual('3333.333')
  })
})
