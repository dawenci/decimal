import { pipe, add, sub, mul, div } from '../../../src/index'

describe('pipeable', () => {
  it('pipeable/...', () => {
    expect(pipe(1, add(10), sub(5), mul(3), div(2)).toString()).toEqual('9')
  })
})
