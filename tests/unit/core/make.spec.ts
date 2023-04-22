import { make, make_by_data } from '../../../src/core/make'

describe('make', () => {
  it('default', () => {
    expect(make().toString()).toEqual('0')
    expect(make(undefined).toString()).toEqual('0')
    expect(make(null).toString()).toEqual('0')
  })

  it('.<n>', () => {
    expect(make('.1').toString()).toEqual('0.1')
  })

  it('multiple dot', () => {
    expect(make('1.1.1').toString()).toEqual('NaN')
    expect(make('1..1').toString()).toEqual('NaN')
    expect(make('..11').toString()).toEqual('NaN')
  })

  it('e<n>e', () => {
    expect(make('1e1e').toString()).toEqual('10')
  })

  it('<n>e+-<NaN>', () => {
    expect(make('1e?').toString()).toEqual('NaN')
    expect(make('1e+?').toString()).toEqual('NaN')
    expect(make('1e-?').toString()).toEqual('NaN')
  })

  it('0<n>', () => {
    expect(make('00').toString()).toEqual('0')
    expect(make('000').toString()).toEqual('0')
    expect(make('01').toString()).toEqual('1')
    expect(make('001').toString()).toEqual('1')

    expect(make('01.').toString()).toEqual('1')
    expect(make('01.0').toString()).toEqual('1')
    expect(make('01.01').toString()).toEqual('1.01')

    expect(make('00e1').toString()).toEqual('0')
    expect(make('00e?').toString()).toEqual('NaN')

    expect(make('001e1').toString()).toEqual('10')
    expect(make('001e?').toString()).toEqual('NaN')
  })

  it('make(Num)', () => {
    const n = make(1)
    expect(make(n)).toEqual(n)
  })

  it('make(string)', () => {
    expect(make('-1.0000').toString()).toEqual('-1')
    expect(make('1.0000').toString()).toEqual('1')
    expect(make('1.00000000').toString()).toEqual('1')
    expect(make('-1.000000000000000000000000').toString()).toEqual('-1')
    expect(make('+1.000000000000000000000000').toString()).toEqual('1')
  })

  it('make_by_data', () => {
    expect(make_by_data([], 1, 0).toString()).toEqual('0')
    expect(make_by_data([0], 1, 0).toString()).toEqual('0')
    expect(make_by_data([0, 0], 1, 0).toString()).toEqual('0')
  })
})
