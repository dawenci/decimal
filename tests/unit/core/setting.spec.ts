import { make, mergeSetting } from '../../../src/core/index'

describe('Setting', () => {
  it('mergeSetting()', () => {
    mergeSetting({ expThresholdNeg: -2, expThresholdPos: 2 })
    expect(make('123').toString()).toEqual('1.23e+2')
    expect(make('0.0123').toString()).toEqual('1.23e-2')

    mergeSetting({ expThresholdNeg: -3, expThresholdPos: 3 })
    expect(make('123').toString()).toEqual('123')
    expect(make('0.0123').toString()).toEqual('0.0123')
  })
})
