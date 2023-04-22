import { pipe, _, sub } from '../../../src/index'

describe('pipeable', () => {
  it('pipeable/sub', () => {
    expect(pipe(2, sub(1)).toString()).toEqual('1')
    expect(pipe(1, sub(2, _)).toString()).toEqual('1')
  })
})
