import { pipe, mul } from '../../../src/index'

describe('pipeable', () => {
  it('pipeable/mul', () => {
    expect(pipe(1, mul(2)).toString()).toEqual('2')
  })
})
