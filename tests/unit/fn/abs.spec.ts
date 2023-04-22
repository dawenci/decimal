import { make, RoundingMode, Setting, mergeSetting } from '../../../src/core/index'
import { abs } from '../../../src/fn/abs'

describe('fn/abs', () => {
  mergeSetting({ precision: 200 })

  it('abs (NaN)', () => {
    expect(abs(make(NaN)).toString()).toEqual('NaN')
  })

  it('abs (Infinity)', () => {
    expect(abs(make(Infinity)).toString()).toEqual('Infinity')
    expect(abs(make(-Infinity)).toString()).toEqual('Infinity')
  })

  it('abs (Zero)', () => {
    expect(abs(make(0)).toString()).toEqual('0')
    expect(abs(make(-0)).toString()).toEqual('0')
  })

  it('abs (Int)', () => {
    expect(abs(make(1)).toString()).toEqual('1')
    expect(abs(make(-1)).toString()).toEqual('1')
    expect(abs(make('98765432109876543210')).toString()).toEqual('98765432109876543210')
    expect(abs(make('-98765432109876543210')).toString()).toEqual('98765432109876543210')
  })

  it('abs (Float)', () => {
    expect(abs(make(0.1)).toString()).toEqual('0.1')
    expect(abs(make(-0.1)).toString()).toEqual('0.1')
    expect(abs(make('98765432109876543210.9876543210987654321')).toString()).toEqual(
      '98765432109876543210.9876543210987654321'
    )
    expect(abs(make('-98765432109876543210.9876543210987654321')).toString()).toEqual(
      '98765432109876543210.9876543210987654321'
    )
  })
})
