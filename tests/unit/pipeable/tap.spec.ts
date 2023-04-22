import type { t } from '../../../src/core/index'
import { pipe, tap } from '../../../src/index'

describe('pipeable', () => {
  it('pipeable/tap', () => {
    expect(
      pipe(
        1,
        tap((n: t) => n._moveDpp(1))
      ).toString()
    ).toEqual('10')
  })
})
