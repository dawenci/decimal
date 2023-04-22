import { RoundingMode } from '../../../src/core/index'
import { pipe, precision } from '../../../src/index'

describe('pipeable', () => {
  it('pipeable/precision', () => {
    expect(pipe(3.33, precision(2)).toString()).toEqual('3.3')
    expect(pipe(3.33, precision(2, RoundingMode.Up)).toString()).toEqual('3.4')
  })
})
