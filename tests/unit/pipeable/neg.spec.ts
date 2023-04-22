import { pipe, neg } from '../../../src/index'

describe('pipeable', () => {
  it('pipeable/neg', () => {
    expect(pipe(1, neg).toString()).toEqual('-1')
    expect(pipe(-1, neg).toString()).toEqual('1')

    expect(pipe(1, neg(true)).toString()).toEqual('-1')
    expect(pipe(-1, neg(true)).toString()).toEqual('-1')

    expect(pipe(1, neg(false)).toString()).toEqual('1')
    expect(pipe(-1, neg(false)).toString()).toEqual('1')
  })
})
