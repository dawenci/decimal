import { make } from '../../src/core/make'
import { mul } from '../../src/fn/mul'

describe('fn/mul', () => {
  it('mul (NaN)', () => {
    expect(mul(make(1), make(NaN)).toString()).toEqual('NaN')
    expect(mul(make(NaN), make(1)).toString()).toEqual('NaN')
    expect(mul(make(NaN), make(NaN)).toString()).toEqual('NaN')
  })

  it('mul (Infinity)', () => {
    expect(mul(make(Infinity), make(Infinity)).toString()).toEqual('Infinity')
    expect(mul(make(-Infinity), make(-Infinity)).toString()).toEqual('Infinity')
    expect(mul(make(Infinity), make(-Infinity)).toString()).toEqual('-Infinity')
    expect(mul(make(-Infinity), make(Infinity)).toString()).toEqual('-Infinity')
    expect(mul(make(Infinity), make(1)).toString()).toEqual('Infinity')
    expect(mul(make(-Infinity), make(1)).toString()).toEqual('-Infinity')
    expect(mul(make(1), make(-Infinity)).toString()).toEqual('-Infinity')
    expect(mul(make(1), make(Infinity)).toString()).toEqual('Infinity')
  })

  it('mul (Zero)', () => {
    expect(mul(make(0), make(Infinity)).toString()).toEqual('NaN')
    expect(mul(make(-0), make(Infinity)).toString()).toEqual('NaN')
    expect(mul(make(0), make(-Infinity)).toString()).toEqual('NaN')
    expect(mul(make(-0), make(-Infinity)).toString()).toEqual('NaN')
    expect(mul(make(Infinity), make(0)).toString()).toEqual('NaN')
    expect(mul(make(Infinity), make(-0)).toString()).toEqual('NaN')
    expect(mul(make(-Infinity), make(0)).toString()).toEqual('NaN')
    expect(mul(make(-Infinity), make(-0)).toString()).toEqual('NaN')

    expect(mul(make(0), make(1)).toString()).toEqual('0')
    expect(mul(make(0), make(-1)).toString()).toEqual('-0')
    expect(mul(make(-0), make(1)).toString()).toEqual('-0')
    expect(mul(make(-0), make(-1)).toString()).toEqual('0')
    expect(mul(make(1), make(0)).toString()).toEqual('0')
    expect(mul(make(1), make(-0)).toString()).toEqual('-0')
    expect(mul(make(-1), make(0)).toString()).toEqual('-0')
    expect(mul(make(-1), make(-0)).toString()).toEqual('0')
    expect(mul(make(0), make(0)).toString()).toEqual('0')
    expect(mul(make(-0), make(0)).toString()).toEqual('-0')
    expect(mul(make(0), make(-0)).toString()).toEqual('-0')
    expect(mul(make(-0), make(-0)).toString()).toEqual('0')
  })

  it('mul (One)', () => {
    expect(mul(make(2), make(1)).toString()).toEqual('2')
    expect(mul(make(1), make(2)).toString()).toEqual('2')
    expect(mul(make(-2), make(1)).toString()).toEqual('-2')
    expect(mul(make(1), make(-2)).toString()).toEqual('-2')
    expect(mul(make(2), make(-1)).toString()).toEqual('-2')
    expect(mul(make(-1), make(2)).toString()).toEqual('-2')
    expect(mul(make(-2), make(-1)).toString()).toEqual('2')
    expect(mul(make(-1), make(-2)).toString()).toEqual('2')
  })

  it('mul (Int)', () => {
    expect(mul(make(2), make(2)).toString()).toEqual('4')
    expect(mul(make(222), make(222)).toString()).toEqual('49284')
    expect(mul(make(2222222222), make(2222222222)).toString()).toEqual('4938271603950617284')
    expect(mul(make(-2), make(-2)).toString()).toEqual('4')
    expect(mul(make(-2222222222), make(-2222222222)).toString()).toEqual('4938271603950617284')
    expect(mul(make(2), make(-2)).toString()).toEqual('-4')
    expect(mul(make(2222222222), make(-2222222222)).toString()).toEqual('-4938271603950617284')
    expect(mul(make(-2), make(2)).toString()).toEqual('-4')
    expect(mul(make(-2222222222), make(2222222222)).toString()).toEqual('-4938271603950617284')
  })

  it('mul (Float)', () => {
    expect(mul(make(0.1), make(0.1)).toString()).toEqual('0.01')
    expect(mul(make(2.01), make(2.01)).toString()).toEqual('4.0401')
    expect(mul(make(2222222222.22), make(2222222222.222)).toString()).toEqual('4938271604932839506.17284')
    expect(mul(
      make('22222222222222222222.22222'),
      make('22222222222222222222.22222')).toString()
          ).toEqual('493827160493827160493827061728395061728.3950617284')

    expect(mul(make(-0.1), make(-0.1)).toString()).toEqual('0.01')
    expect(mul(make(-2.01), make(-2.01)).toString()).toEqual('4.0401')
    expect(mul(make(-2222222222.22), make(-2222222222.222)).toString()).toEqual('4938271604932839506.17284')

    expect(mul(make(-0.1), make(0.1)).toString()).toEqual('-0.01')
    expect(mul(make(-2.01), make(2.01)).toString()).toEqual('-4.0401')
    expect(mul(make(-2222222222.22), make(2222222222.222)).toString()).toEqual('-4938271604932839506.17284')

    expect(mul(make(0.1), make(-0.1)).toString()).toEqual('-0.01')
    expect(mul(make(2.01), make(-2.01)).toString()).toEqual('-4.0401')
    expect(mul(make(2222222222.22), make(-2222222222.222)).toString()).toEqual('-4938271604932839506.17284')
  })
})
