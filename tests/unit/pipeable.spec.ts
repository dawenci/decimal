import type { t } from '../../src/core/decimal'
import { make, pipe, add, sub, mul, div, mod, precision, tap } from '../../src/index'

describe('pipeable', () => {
  it('pipe()', () => {
    expect(pipe(make(1), x => x).toString()).toEqual('1')
  })

  it('pipeable/add', () => {
    expect(pipe(1, add(1)).toString()).toEqual('2')
  })

  it('pipeable/sub', () => {
    expect(pipe(1, sub(1)).toString()).toEqual('0')
  })

  it('pipeable/mul', () => {
    expect(pipe(1, mul(2)).toString()).toEqual('2')
  })

  it('pipeable/div', () => {
    expect(pipe(2, div(1)).toString()).toEqual('2')
  })

  it('pipeable/mod', () => {
    expect(pipe(1, mod(1)).toString()).toEqual('0')
  })

  it('pipeable/precision', () => {
    expect(pipe(3.33, precision(2)).toString()).toEqual('3.3')
  })

  it('pipeable/tap', () => {
    expect(pipe(1, tap((n: t) => n.moveDpp(1))).toString()).toEqual('10')
  })

  it('pipeable/...', () => {
    expect(pipe(1, add(10), sub(5), mul(3), div(2)).toString()).toEqual('9')
  })
})
