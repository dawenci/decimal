import { pipe, _, cmp } from '../../../src/index'

describe('pipeable', () => {
  it('pipeable/cmp', () => {
    expect(pipe(1, cmp(NaN)).toString()).toEqual('0')
    expect(pipe(1, cmp(Infinity)).toString()).toEqual('-1')
    expect(pipe(1, cmp(-Infinity)).toString()).toEqual('1')
    expect(pipe(1, cmp(1)).toString()).toEqual('0')
    expect(pipe(1, cmp(2)).toString()).toEqual('-1')
    expect(pipe(2, cmp(1)).toString()).toEqual('1')
    expect(pipe(1, cmp(2, _)).toString()).toEqual('1')
  })
})
