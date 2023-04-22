import { pipe, t } from '../../../src/index'

describe('pipeable', () => {
  it('pipe()', () => {
    expect(pipe(1, (x: t) => x).toString()).toEqual('1')
  })
})
