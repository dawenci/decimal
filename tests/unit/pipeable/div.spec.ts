import { RoundingMode } from '../../../src/core/index'
import { pipe, _, div } from '../../../src/index'

describe('pipeable', () => {
  it('pipeable/div', () => {
    expect(pipe(2, div(1)).toString()).toEqual('2')
    expect(pipe(2, div(1, _)).toString()).toEqual('0.5')
  })
})
