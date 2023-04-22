import { pipe, add } from '../../../src/index'

describe('pipeable', () => {
  it('pipeable/add', () => {
    expect(pipe(1, add(1)).toString()).toEqual('2')
  })
})
