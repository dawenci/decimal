import { Num } from '../../src/num'

describe('num', () => {
  it('parse', () => {
    expect(new Num('').isNaN()).toEqual(true)
  })
})
