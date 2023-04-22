import { pipe, _, mod } from '../../../src/index'

describe('pipeable', () => {
  it('pipeable/mod', () => {
    expect(pipe(2, mod(1)).toString()).toEqual('0')
    expect(pipe(2, mod(1, _)).toString()).toEqual('1')
  })
})
