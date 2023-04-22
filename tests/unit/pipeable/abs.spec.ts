import { pipe, abs } from '../../../src/index'

describe('pipeable', () => {
  it('pipeable/abs', () => {
    expect(pipe(-1, abs).toString()).toEqual('1')
  })
})
