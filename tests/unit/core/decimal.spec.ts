import { make, RoundingMode, Setting, mergeSetting } from '../../../src/core/index'

describe('Decimal.prototype.clone()', () => {
  it('clone', () => {
    expect(make('').clone().toString()).toEqual('NaN')
  })
})

describe('Decimal.prototype.isNaN()', () => {
  it('isNaN', () => {
    expect(make('').isNaN()).toEqual(true)
  })
})

describe('Decimal.prototype.isInfinity()', () => {
  it('isInfinity', () => {
    expect(make('infinity').isInfinity()).toEqual(true)
  })
})

describe('Decimal.prototype.isNeg()', () => {
  it('isNeg', () => {
    expect(make(-Infinity).isNeg()).toEqual(true)
    expect(make('-Infinity').isNeg()).toEqual(true)
    expect(make(-0).isNeg()).toEqual(true)
    expect(make('-0').isNeg()).toEqual(true)
  })
})

describe('Decimal.prototype.isZero()', () => {
  it('isZero', () => {
    expect(make('0').isZero()).toEqual(true)
    expect(make('-0').isZero()).toEqual(true)
    expect(make('10').isZero()).toEqual(false)
    expect(make('0.1').isZero()).toEqual(false)
    expect(make('NaN').isZero()).toEqual(false)
    expect(make('Infinity').isZero()).toEqual(false)
    expect(make('-Infinity').isZero()).toEqual(false)
  })
})

describe('Decimal.prototype.isOne()', () => {
  it('isOne', () => {
    expect(make('1').isOne()).toEqual(true)
    expect(make('-1').isOne()).toEqual(true)
    expect(make('10').isOne()).toEqual(false)
    expect(make('0.1').isOne()).toEqual(false)
    expect(make('NaN').isOne()).toEqual(false)
    expect(make('Infinity').isOne()).toEqual(false)
    expect(make('-Infinity').isOne()).toEqual(false)
  })
})

describe('Decimal.prototype.isInt()', () => {
  it('isInt', () => {
    expect(make('0').isInt()).toEqual(true)
    expect(make('-0').isInt()).toEqual(true)
    expect(make('1').isInt()).toEqual(true)
    expect(make('-1').isInt()).toEqual(true)
    expect(make('10').isInt()).toEqual(true)
    expect(make('-10').isInt()).toEqual(true)
    expect(make(Number.MAX_SAFE_INTEGER.toString() + '1').isInt()).toEqual(true)
    expect(make('0.1').isInt()).toEqual(false)
    expect(make('1.1').isInt()).toEqual(false)
  })
})

describe('Decimal.prototype.isSafeInt()', () => {
  it('Decimal.prototype.isSafeInt', () => {
    expect(make('0.1').isSafeInt()).toEqual(false)
    expect(make('0').isSafeInt()).toEqual(true)
    expect(make('-0').isSafeInt()).toEqual(true)
    expect(make(Number.MAX_SAFE_INTEGER.toString()).isSafeInt()).toEqual(true)
    expect(make(Number.MIN_SAFE_INTEGER.toString()).isSafeInt()).toEqual(true)
    expect(make(Number.MAX_SAFE_INTEGER.toString() + '1').isSafeInt()).toEqual(false)
    expect(make(Number.MIN_SAFE_INTEGER.toString() + '1').isSafeInt()).toEqual(false)
    expect(make(Number.MAX_SAFE_INTEGER.toString().slice(0, -1) + '9').isSafeInt()).toEqual(false)
    expect(make(Number.MIN_SAFE_INTEGER.toString().slice(0, -1) + '9').isSafeInt()).toEqual(false)
  })
})

describe('Decimal.prototype._getFractionCount()', () => {
  it('_getFractionCount', () => {
    expect(make('0')._getFractionCount()).toEqual(0)
    expect(make('-0')._getFractionCount()).toEqual(0)
    expect(make('1')._getFractionCount()).toEqual(0)
    expect(make('-1')._getFractionCount()).toEqual(0)
    expect(make('10')._getFractionCount()).toEqual(0)
    expect(make('-10')._getFractionCount()).toEqual(0)
    expect(make(Number.MAX_SAFE_INTEGER.toString() + '1')._getFractionCount()).toEqual(0)
    expect(make('0.1')._getFractionCount()).toEqual(1)
    expect(make('1.1')._getFractionCount()).toEqual(1)
    expect(make('0.10')._getFractionCount()).toEqual(1)
    expect(make('0.01')._getFractionCount()).toEqual(2)
    expect(make('0.010')._getFractionCount()).toEqual(2)
  })
})

describe('Decimal.prototype._getIntegerCount()', () => {
  it('_getIntegerCount', () => {
    expect(make('0')._getIntegerCount()).toEqual(1)
    expect(make('-0')._getIntegerCount()).toEqual(1)
    expect(make('1')._getIntegerCount()).toEqual(1)
    expect(make('-1')._getIntegerCount()).toEqual(1)
    expect(make('0.1')._getIntegerCount()).toEqual(1)
    expect(make('1.1')._getIntegerCount()).toEqual(1)
    expect(make('0.10')._getIntegerCount()).toEqual(1)
    expect(make('0.01')._getIntegerCount()).toEqual(1)
    expect(make('0.010')._getIntegerCount()).toEqual(1)
    expect(make('10')._getIntegerCount()).toEqual(2)
    expect(make('-10')._getIntegerCount()).toEqual(2)
    expect(make('10.01')._getIntegerCount()).toEqual(2)
    expect(make('-10.01')._getIntegerCount()).toEqual(2)
    expect(make(Number.MAX_SAFE_INTEGER.toString() + '1')._getIntegerCount()).toEqual(17)
  })
})

describe('Decimal.prototype._get(index)', () => {
  it('123.456', () => {
    const n = make('123.456')
    expect(n._get(0)).toEqual(3)
    expect(n._get(1)).toEqual(2)
    expect(n._get(2)).toEqual(1)
    expect(n._get(3)).toEqual(0)
    expect(n._get(-1)).toEqual(4)
    expect(n._get(-2)).toEqual(5)
    expect(n._get(-3)).toEqual(6)
    expect(n._get(-4)).toEqual(0)
  })
})

describe('Decimal.prototype.getDotPosition()', () => {
  it('00, dot:1', () => {
    expect(make('00')._getPoint()).toEqual(1)
  })

  it('0.0, dot:1', () => {
    expect(make('0.0')._getPoint()).toEqual(1)
  })

  it('00.0, dot:1', () => {
    expect(make('00.0')._getPoint()).toEqual(1)
  })

  it('0.00, dot: 1', () => {
    expect(make('0.00')._getPoint()).toEqual(1)
  })

  it('0eN, dot: 1', () => {
    expect(make('0e0')._getPoint()).toEqual(1)
    expect(make('0e1')._getPoint()).toEqual(1)
    expect(make('0e+1')._getPoint()).toEqual(1)
    expect(make('0e-1')._getPoint()).toEqual(1)
  })

  it('01, dot:1', () => {
    expect(make('01')._getPoint()).toEqual(1)
  })

  it('001, dot:1', () => {
    expect(make('001')._getPoint()).toEqual(1)
  })

  it('10, dot:2', () => {
    expect(make('10')._getPoint()).toEqual(2)
  })

  it('0.1, dot:0', () => {
    expect(make('00.1')._getPoint()).toEqual(0)
  })

  it('00.1, dot:0', () => {
    expect(make('00.1')._getPoint()).toEqual(0)
  })

  it('0.01, dot:-1', () => {
    expect(make('0.01')._getPoint()).toEqual(-1)
  })

  it('1.1, dot:1', () => {
    expect(make('1.1')._getPoint()).toEqual(1)
  })

  it('11e0, dot:2,', () => {
    expect(make('11e0')._getPoint()).toEqual(2)
  })

  it('11e1, dot:3,', () => {
    expect(make('11e1')._getPoint()).toEqual(3)
  })

  it('11e-1, dot:1,', () => {
    expect(make('11e-1')._getPoint()).toEqual(1)
  })

  it('11e-2, dot:1,', () => {
    expect(make('11e-2')._getPoint()).toEqual(0)
  })
})

describe('Decimal.prototype._setNeg()', () => {
  it('_setNeg(Zero)', () => {
    expect(make(0)._setNeg(true).toString()).toEqual('-0')
    expect(make(-0)._setNeg(true).toString()).toEqual('-0')
    expect(make(0)._setNeg(false).toString()).toEqual('0')
    expect(make(-0)._setNeg(false).toString()).toEqual('0')
  })

  it('_setNeg(Infinity)', () => {
    expect(make(Infinity)._setNeg(true).toString()).toEqual('-Infinity')
    expect(make(-Infinity)._setNeg(true).toString()).toEqual('-Infinity')
    expect(make(Infinity)._setNeg(false).toString()).toEqual('Infinity')
    expect(make(-Infinity)._setNeg(false).toString()).toEqual('Infinity')
  })

  it('_setNeg(NaN)', () => {
    expect(make(NaN)._setNeg(true).toString()).toEqual('NaN')
    expect(make(NaN)._setNeg(false).toString()).toEqual('NaN')
  })

  it('_setNeg(Int)', () => {
    expect(make(1)._setNeg(true).toString()).toEqual('-1')
    expect(make(-1)._setNeg(true).toString()).toEqual('-1')
    expect(make(1)._setNeg(false).toString()).toEqual('1')
    expect(make(-1)._setNeg(false).toString()).toEqual('1')
  })

  it('_setNeg(Float)', () => {
    expect(make(0.1)._setNeg(true).toString()).toEqual('-0.1')
    expect(make(-0.1)._setNeg(true).toString()).toEqual('-0.1')
    expect(make(0.1)._setNeg(false).toString()).toEqual('0.1')
    expect(make(-0.1)._setNeg(false).toString()).toEqual('0.1')
  })
})

describe('Decimal.prototype._toggleNeg()', () => {
  it('_toggleNeg(Zero)', () => {
    expect(make(0)._toggleNeg().toString()).toEqual('-0')
    expect(make(-0)._toggleNeg().toString()).toEqual('0')
  })

  it('_toggleNeg(Infinity)', () => {
    expect(make(Infinity)._toggleNeg().toString()).toEqual('-Infinity')
    expect(make(-Infinity)._toggleNeg().toString()).toEqual('Infinity')
  })

  it('_toggleNeg(NaN)', () => {
    expect(make(NaN)._toggleNeg().toString()).toEqual('NaN')
    expect(make(NaN)._toggleNeg().toString()).toEqual('NaN')
  })

  it('_toggleNeg(Int)', () => {
    expect(make(1)._toggleNeg().toString()).toEqual('-1')
    expect(make(-1)._toggleNeg().toString()).toEqual('1')
  })

  it('_toggleNeg(Float)', () => {
    expect(make(0.1)._toggleNeg().toString()).toEqual('-0.1')
    expect(make(-0.1)._toggleNeg().toString()).toEqual('0.1')
  })
})

describe('Decimal.prototype.moveDpp()', () => {
  it('moveDpp(Zero)', () => {
    expect(make(0)._moveDpp(0).toString()).toEqual('0')
    expect(make(0)._moveDpp(1).toString()).toEqual('0')
    expect(make(0)._moveDpp(-1).toString()).toEqual('0')
    expect(make(-0)._moveDpp(0).toString()).toEqual('-0')
    expect(make(-0)._moveDpp(1).toString()).toEqual('-0')
    expect(make(-0)._moveDpp(-1).toString()).toEqual('-0')
  })

  it('moveDpp(Infinity)', () => {
    expect(make(Infinity)._moveDpp(0).toString()).toEqual('Infinity')
    expect(make(Infinity)._moveDpp(1).toString()).toEqual('Infinity')
    expect(make(Infinity)._moveDpp(-1).toString()).toEqual('Infinity')
    expect(make(-Infinity)._moveDpp(0).toString()).toEqual('-Infinity')
    expect(make(-Infinity)._moveDpp(1).toString()).toEqual('-Infinity')
    expect(make(-Infinity)._moveDpp(-1).toString()).toEqual('-Infinity')
  })

  it('moveDpp(NaN)', () => {
    expect(make(NaN)._moveDpp(0).toString()).toEqual('NaN')
    expect(make(NaN)._moveDpp(1).toString()).toEqual('NaN')
    expect(make(NaN)._moveDpp(-1).toString()).toEqual('NaN')
  })

  it('moveDpp(Int)', () => {
    expect(make(1)._moveDpp(0).toString()).toEqual('1')
    expect(make(1)._moveDpp(1).toString()).toEqual('10')
    expect(make(1)._moveDpp(-1).toString()).toEqual('0.1')
    expect(make(-1)._moveDpp(0).toString()).toEqual('-1')
    expect(make(-1)._moveDpp(1).toString()).toEqual('-10')
    expect(make(-1)._moveDpp(-1).toString()).toEqual('-0.1')
  })

  it('moveDpp(Float)', () => {
    expect(make(0.1)._moveDpp(0).toString()).toEqual('0.1')
    expect(make(0.1)._moveDpp(1).toString()).toEqual('1')
    expect(make(0.1)._moveDpp(-1).toString()).toEqual('0.01')
    expect(make(-0.1)._moveDpp(0).toString()).toEqual('-0.1')
    expect(make(-0.1)._moveDpp(1).toString()).toEqual('-1')
    expect(make(-0.1)._moveDpp(-1).toString()).toEqual('-0.01')
  })
})

describe('Decimal.prototype.setPrecision()', () => {
  it('setPrecision(, RoundingMode.Up)', () => {
    expect(make(0.1101).setPrecision(2, RoundingMode.Up).toString()).toEqual('0.12')
    expect(make(-0.1101).setPrecision(2, RoundingMode.Up).toString()).toEqual('-0.12')

    expect(make(0.1901).setPrecision(2, RoundingMode.Up).toString()).toEqual('0.2')
    expect(make(-0.1901).setPrecision(2, RoundingMode.Up).toString()).toEqual('-0.2')

    expect(make(0.9901).setPrecision(2, RoundingMode.Up).toString()).toEqual('1')
    expect(make(-0.9901).setPrecision(2, RoundingMode.Up).toString()).toEqual('-1')

    expect(make(0.1111).setPrecision(2, RoundingMode.Up).toString()).toEqual('0.12')
    expect(make(-0.1111).setPrecision(2, RoundingMode.Up).toString()).toEqual('-0.12')
  })

  it('setPrecision(, RoundingMode.Down)', () => {
    expect(make(0.9999).setPrecision(2, RoundingMode.Down).toString()).toEqual('0.99')
    expect(make(-0.9999).setPrecision(2, RoundingMode.Down).toString()).toEqual('-0.99')
  })

  it('setPrecision(, RoundingMode.Ceiling)', () => {
    expect(make(0.1101).setPrecision(2, RoundingMode.Ceiling).toString()).toEqual('0.12')
    expect(make(-0.1101).setPrecision(2, RoundingMode.Ceiling).toString()).toEqual('-0.11')

    expect(make(0.1901).setPrecision(2, RoundingMode.Ceiling).toString()).toEqual('0.2')
    expect(make(-0.1901).setPrecision(2, RoundingMode.Ceiling).toString()).toEqual('-0.19')

    expect(make(0.9901).setPrecision(2, RoundingMode.Ceiling).toString()).toEqual('1')
    expect(make(-0.9901).setPrecision(2, RoundingMode.Ceiling).toString()).toEqual('-0.99')

    expect(make(0.1111).setPrecision(2, RoundingMode.Ceiling).toString()).toEqual('0.12')
    expect(make(-0.1111).setPrecision(2, RoundingMode.Ceiling).toString()).toEqual('-0.11')
  })

  it('setPrecision(, RoundingMode.Floor)', () => {
    expect(make(0.1101).setPrecision(2, RoundingMode.Floor).toString()).toEqual('0.11')
    expect(make(-0.1101).setPrecision(2, RoundingMode.Floor).toString()).toEqual('-0.12')

    expect(make(0.1901).setPrecision(2, RoundingMode.Floor).toString()).toEqual('0.19')
    expect(make(-0.1901).setPrecision(2, RoundingMode.Floor).toString()).toEqual('-0.2')

    expect(make(0.9901).setPrecision(2, RoundingMode.Floor).toString()).toEqual('0.99')
    expect(make(-0.9901).setPrecision(2, RoundingMode.Floor).toString()).toEqual('-1')

    expect(make(0.1111).setPrecision(2, RoundingMode.Floor).toString()).toEqual('0.11')
    expect(make(-0.1111).setPrecision(2, RoundingMode.Floor).toString()).toEqual('-0.12')
  })

  it('setPrecision(, RoundingMode.HalfUp)', () => {
    expect(make(0.4444).setPrecision(2, RoundingMode.HalfUp).toString()).toEqual('0.44')
    expect(make(-0.4444).setPrecision(2, RoundingMode.HalfUp).toString()).toEqual('-0.44')

    expect(make(0.4454).setPrecision(2, RoundingMode.HalfUp).toString()).toEqual('0.45')
    expect(make(-0.4454).setPrecision(2, RoundingMode.HalfUp).toString()).toEqual('-0.45')
  })

  it('setPrecision(, RoundingMode.HalfDown)', () => {
    expect(make(0.556).setPrecision(2, RoundingMode.HalfDown).toString()).toEqual('0.56')
    expect(make(-0.556).setPrecision(2, RoundingMode.HalfDown).toString()).toEqual('-0.56')

    expect(make(0.555).setPrecision(2, RoundingMode.HalfDown).toString()).toEqual('0.55')
    expect(make(-0.555).setPrecision(2, RoundingMode.HalfDown).toString()).toEqual('-0.55')

    expect(make(0.5551).setPrecision(2, RoundingMode.HalfDown).toString()).toEqual('0.56')
    expect(make(-0.5551).setPrecision(2, RoundingMode.HalfDown).toString()).toEqual('-0.56')

    expect(make(0.554).setPrecision(2, RoundingMode.HalfDown).toString()).toEqual('0.55')
    expect(make(-0.554).setPrecision(2, RoundingMode.HalfDown).toString()).toEqual('-0.55')
  })

  it('setPrecision(, RoundingMode.HalfEven)', () => {
    expect(make(0.556).setPrecision(2, RoundingMode.HalfEven).toString()).toEqual('0.56')
    expect(make(-0.556).setPrecision(2, RoundingMode.HalfEven).toString()).toEqual('-0.56')

    expect(make(0.515).setPrecision(2, RoundingMode.HalfEven).toString()).toEqual('0.52')
    expect(make(-0.515).setPrecision(2, RoundingMode.HalfEven).toString()).toEqual('-0.52')

    expect(make(0.525).setPrecision(2, RoundingMode.HalfEven).toString()).toEqual('0.52')
    expect(make(-0.525).setPrecision(2, RoundingMode.HalfEven).toString()).toEqual('-0.52')

    expect(make(0.554).setPrecision(2, RoundingMode.HalfEven).toString()).toEqual('0.55')
    expect(make(-0.554).setPrecision(2, RoundingMode.HalfEven).toString()).toEqual('-0.55')
  })

  it('setPrecision(, RoundingMode.HalfCeiling)', () => {
    expect(make(0.556).setPrecision(2, RoundingMode.HalfCeiling).toString()).toEqual('0.56')
    expect(make(-0.556).setPrecision(2, RoundingMode.HalfCeiling).toString()).toEqual('-0.56')

    expect(make(0.555).setPrecision(2, RoundingMode.HalfCeiling).toString()).toEqual('0.56')
    expect(make(-0.555).setPrecision(2, RoundingMode.HalfCeiling).toString()).toEqual('-0.55')

    expect(make(0.5551).setPrecision(2, RoundingMode.HalfCeiling).toString()).toEqual('0.56')
    expect(make(-0.5551).setPrecision(2, RoundingMode.HalfCeiling).toString()).toEqual('-0.56')

    expect(make(0.554).setPrecision(2, RoundingMode.HalfCeiling).toString()).toEqual('0.55')
    expect(make(-0.554).setPrecision(2, RoundingMode.HalfCeiling).toString()).toEqual('-0.55')
  })

  it('setPrecision(, RoundingMode.HalfFloor)', () => {
    expect(make(0.556).setPrecision(2, RoundingMode.HalfFloor).toString()).toEqual('0.56')
    expect(make(-0.556).setPrecision(2, RoundingMode.HalfFloor).toString()).toEqual('-0.56')

    expect(make(0.555).setPrecision(2, RoundingMode.HalfFloor).toString()).toEqual('0.55')
    expect(make(-0.555).setPrecision(2, RoundingMode.HalfFloor).toString()).toEqual('-0.56')

    expect(make(0.5551).setPrecision(2, RoundingMode.HalfFloor).toString()).toEqual('0.56')
    expect(make(-0.5551).setPrecision(2, RoundingMode.HalfFloor).toString()).toEqual('-0.56')

    expect(make(0.554).setPrecision(2, RoundingMode.HalfFloor).toString()).toEqual('0.55')
    expect(make(-0.554).setPrecision(2, RoundingMode.HalfFloor).toString()).toEqual('-0.55')
  })

  it('setPrecision(Zero)', () => {
    expect(make(3.333).setPrecision(0).toString()).toEqual('3.333')
  })

  it('setPrecision(Infinity)', () => {
    expect(make(Infinity).setPrecision(3).toString()).toEqual('Infinity')
    expect(make(-Infinity).setPrecision(3).toString()).toEqual('-Infinity')
  })

  it('setPrecision(NaN)', () => {
    expect(make(NaN).setPrecision(3).toString()).toEqual('NaN')
    expect(make(NaN).setPrecision(3).toString()).toEqual('NaN')
  })

  it('setPrecision(Int)', () => {
    expect(make(0).setPrecision(3).toString()).toEqual('0')
    expect(make(-0).setPrecision(3).toString()).toEqual('-0')
    expect(make(3333).setPrecision(3).toString()).toEqual('3330')
    expect(make(33333).setPrecision(3).toString()).toEqual('33300')
  })

  it('setPrecision(Float)', () => {
    expect(make(0.3).setPrecision(3).toString()).toEqual('0.3')
    expect(make(0.33).setPrecision(3).toString()).toEqual('0.33')
    expect(make(0.333).setPrecision(3).toString()).toEqual('0.333')
    expect(make(0.3333).setPrecision(3).toString()).toEqual('0.333')
    expect(make(3.3).setPrecision(3).toString()).toEqual('3.3')
    expect(make(3.33).setPrecision(3).toString()).toEqual('3.33')
    expect(make(3.333).setPrecision(3).toString()).toEqual('3.33')
    expect(make(3.3333).setPrecision(3).toString()).toEqual('3.33')
  })
})

describe('Decimal.prototype.toPrecision()', () => {
  it('toPrecision(<=0 Or Null Or Undefined)', () => {
    expect(make(1).toPrecision(0)).toEqual('1')
    expect(make(1).toPrecision(-1)).toEqual('1')

    expect(make(3.333).toPrecision(-1)).toEqual('3.333')
    expect(make(3.333).toPrecision(0)).toEqual('3.333')

    expect(make(-3.333).toPrecision(-1)).toEqual('-3.333')
    expect(make(-3.333).toPrecision(0)).toEqual('-3.333')

    expect(make(-3.333).toPrecision()).toEqual('-3.333')
  })

  it('toPrecision(NaN)', () => {
    expect(make(NaN).toPrecision()).toEqual('NaN')
    expect(make(NaN).toPrecision()).toEqual('NaN')
  })

  it('toPrecision(Infinity)', () => {
    expect(make(Infinity).toPrecision(3)).toEqual('Infinity')
    expect(make(-Infinity).toPrecision(3)).toEqual('-Infinity')
  })

  it('toPrecision(Zero)', () => {
    expect(make(0).toPrecision(3)).toEqual('0.00')
    expect(make(-0).toPrecision(3)).toEqual('-0.00')
  })

  it('toPrecision(Int)', () => {
    expect(make(3333).toPrecision(3)).toEqual('3.33e+3')
    expect(make(-3333).toPrecision(3)).toEqual('-3.33e+3')

    expect(make(3333).toPrecision(5)).toEqual('3333.0')
    expect(make(-3333).toPrecision(5)).toEqual('-3333.0')
  })

  it('toPrecision(Float)', () => {
    expect(make(0.3).toPrecision(3)).toEqual('0.300')
    expect(make(0.33).toPrecision(3)).toEqual('0.330')
    expect(make(0.333).toPrecision(3)).toEqual('0.333')
    expect(make(0.3333).toPrecision(3)).toEqual('0.333')
    expect(make(3.3).toPrecision(3)).toEqual('3.30')
    expect(make(3.33).toPrecision(3)).toEqual('3.33')
    expect(make(3.333).toPrecision(3)).toEqual('3.33')
    expect(make(3.3333).toPrecision(3)).toEqual('3.33')

    expect(make(-0.3).toPrecision(3)).toEqual('-0.300')
    expect(make(-0.33).toPrecision(3)).toEqual('-0.330')
    expect(make(-0.333).toPrecision(3)).toEqual('-0.333')
    expect(make(-0.3333).toPrecision(3)).toEqual('-0.333')
    expect(make(-3.3).toPrecision(3)).toEqual('-3.30')
    expect(make(-3.33).toPrecision(3)).toEqual('-3.33')
    expect(make(-3.333).toPrecision(3)).toEqual('-3.33')
    expect(make(-3.3333).toPrecision(3)).toEqual('-3.33')
  })

  it('toPrecision(Decimal.js)', () => {
    expect(make('1.2345e+27').toPrecision({ significantDigits: 1, rounding: RoundingMode.HalfUp })).toEqual('1e+27')
    expect(make('1.2345e+27').toPrecision({ significantDigits: 2, rounding: RoundingMode.HalfUp })).toEqual('1.2e+27')
    expect(make('1.2345e+27').toPrecision({ significantDigits: 3, rounding: RoundingMode.HalfUp })).toEqual('1.23e+27')
    expect(make('1.2345e+27').toPrecision({ significantDigits: 4, rounding: RoundingMode.HalfUp })).toEqual('1.235e+27')
    expect(make('1.2345e+27').toPrecision({ significantDigits: 5, rounding: RoundingMode.HalfUp })).toEqual('1.2345e+27')
    expect(make('1.2345e+27').toPrecision({ significantDigits: 6, rounding: RoundingMode.HalfUp })).toEqual('1.23450e+27')
    expect(make('1.2345e+27').toPrecision({ significantDigits: 7, rounding: RoundingMode.HalfUp })).toEqual('1.234500e+27')

    expect(make(7).toPrecision({ significantDigits: 1, rounding: RoundingMode.HalfUp })).toEqual('7')
    expect(make(7).toPrecision({ significantDigits: 2, rounding: RoundingMode.HalfUp })).toEqual('7.0')
    expect(make(7).toPrecision({ significantDigits: 3, rounding: RoundingMode.HalfUp })).toEqual('7.00')
    expect(make(-7).toPrecision({ significantDigits: 1, rounding: RoundingMode.HalfUp })).toEqual('-7')
    expect(make(-7).toPrecision({ significantDigits: 2, rounding: RoundingMode.HalfUp })).toEqual('-7.0')
    expect(make(-7).toPrecision({ significantDigits: 3, rounding: RoundingMode.HalfUp })).toEqual('-7.00')
    expect(make(91).toPrecision({ significantDigits: 1, rounding: RoundingMode.HalfUp })).toEqual('9e+1')
    expect(make(91).toPrecision({ significantDigits: 2, rounding: RoundingMode.HalfUp })).toEqual('91')
    expect(make(91).toPrecision({ significantDigits: 3, rounding: RoundingMode.HalfUp })).toEqual('91.0')
    expect(make(91).toPrecision({ significantDigits: 4, rounding: RoundingMode.HalfUp })).toEqual('91.00')
    expect(make(-91).toPrecision({ significantDigits: 1, rounding: RoundingMode.HalfUp })).toEqual('-9e+1')
    expect(make(-91).toPrecision({ significantDigits: 2, rounding: RoundingMode.HalfUp })).toEqual('-91')
    expect(make(-91).toPrecision({ significantDigits: 3, rounding: RoundingMode.HalfUp })).toEqual('-91.0')
    expect(make(-91).toPrecision({ significantDigits: 4, rounding: RoundingMode.HalfUp })).toEqual('-91.00')
    expect(make(91.1234).toPrecision({ significantDigits: 1, rounding: RoundingMode.HalfUp })).toEqual('9e+1')
    expect(make(91.1234).toPrecision({ significantDigits: 2, rounding: RoundingMode.HalfUp })).toEqual('91')
    expect(make(91.1234).toPrecision({ significantDigits: 3, rounding: RoundingMode.HalfUp })).toEqual('91.1')
    expect(make(91.1234).toPrecision({ significantDigits: 4, rounding: RoundingMode.HalfUp })).toEqual('91.12')
    expect(make(91.1234).toPrecision({ significantDigits: 5, rounding: RoundingMode.HalfUp })).toEqual('91.123')
    expect(make(91.1234).toPrecision({ significantDigits: 6, rounding: RoundingMode.HalfUp })).toEqual('91.1234')
    expect(make(91.1234).toPrecision({ significantDigits: 7, rounding: RoundingMode.HalfUp })).toEqual('91.12340')
    expect(make(91.1234).toPrecision({ significantDigits: 8, rounding: RoundingMode.HalfUp })).toEqual('91.123400')
    expect(make(-91.1234).toPrecision({ significantDigits: 1, rounding: RoundingMode.HalfUp })).toEqual('-9e+1')
    expect(make(-91.1234).toPrecision({ significantDigits: 2, rounding: RoundingMode.HalfUp })).toEqual('-91')
    expect(make(-91.1234).toPrecision({ significantDigits: 3, rounding: RoundingMode.HalfUp })).toEqual('-91.1')
    expect(make(-91.1234).toPrecision({ significantDigits: 4, rounding: RoundingMode.HalfUp })).toEqual('-91.12')
    expect(make(-91.1234).toPrecision({ significantDigits: 5, rounding: RoundingMode.HalfUp })).toEqual('-91.123')
    expect(make(-91.1234).toPrecision({ significantDigits: 6, rounding: RoundingMode.HalfUp })).toEqual('-91.1234')
    expect(make(-91.1234).toPrecision({ significantDigits: 7, rounding: RoundingMode.HalfUp })).toEqual('-91.12340')
    expect(make(-91.1234).toPrecision({ significantDigits: 8, rounding: RoundingMode.HalfUp })).toEqual('-91.123400')

    expect(make(0.000000555).toPrecision({ significantDigits: 15, rounding: RoundingMode.HalfUp })).toEqual('5.55000000000000e-7')
    expect(make(-0.000000555).toPrecision({ significantDigits: 15, rounding: RoundingMode.HalfUp })).toEqual('-5.55000000000000e-7')
    expect(make(-.0000000012345).toPrecision({ significantDigits: 2, rounding: RoundingMode.HalfUp })).toEqual('-1.2e-9')
    expect(make(-.000000012345).toPrecision({ significantDigits: 2, rounding: RoundingMode.HalfUp })).toEqual('-1.2e-8')
    expect(make(-.00000012345).toPrecision({ significantDigits: 2, rounding: RoundingMode.HalfUp })).toEqual('-1.2e-7')
    expect(make(123456789).toPrecision({ significantDigits: 1, rounding: RoundingMode.HalfUp })).toEqual('1e+8')
    expect(make(123456789).toPrecision({ significantDigits: 9, rounding: RoundingMode.HalfUp })).toEqual('123456789')
    expect(make(123456789).toPrecision({ significantDigits: 8, rounding: RoundingMode.HalfUp })).toEqual('1.2345679e+8')
    expect(make(123456789).toPrecision({ significantDigits: 7, rounding: RoundingMode.HalfUp })).toEqual('1.234568e+8')
    expect(make(-123456789).toPrecision({ significantDigits: 7, rounding: RoundingMode.HalfUp })).toEqual('-1.234568e+8')

    expect(make(-.0000012345).toPrecision({ significantDigits: 2, rounding: RoundingMode.HalfUp })).toEqual('-0.0000012')
    expect(make(-.000012345).toPrecision({ significantDigits: 2, rounding: RoundingMode.HalfUp })).toEqual('-0.000012')
    expect(make(-.00012345).toPrecision({ significantDigits: 2, rounding: RoundingMode.HalfUp })).toEqual('-0.00012')
    expect(make(-.0012345).toPrecision({ significantDigits: 2, rounding: RoundingMode.HalfUp })).toEqual('-0.0012')
    expect(make(-.012345).toPrecision({ significantDigits: 2, rounding: RoundingMode.HalfUp })).toEqual('-0.012')
    expect(make(-.12345).toPrecision({ significantDigits: 2, rounding: RoundingMode.HalfUp })).toEqual('-0.12')
    expect(make(-1.2345).toPrecision({ significantDigits: 2, rounding: RoundingMode.HalfUp })).toEqual('-1.2')
    expect(make(-12.345).toPrecision({ significantDigits: 2, rounding: RoundingMode.HalfUp })).toEqual('-12')
    expect(make(-123.45).toPrecision({ significantDigits: 2, rounding: RoundingMode.HalfUp })).toEqual('-1.2e+2')
    expect(make(-1234.5).toPrecision({ significantDigits: 2, rounding: RoundingMode.HalfUp })).toEqual('-1.2e+3')
    expect(make(-12345).toPrecision({ significantDigits: 2, rounding: RoundingMode.HalfUp })).toEqual('-1.2e+4')
    expect(make(-12345.67).toPrecision({ significantDigits: 4, rounding: RoundingMode.HalfUp })).toEqual('-1.235e+4')
    expect(make(-12344.67).toPrecision({ significantDigits: 4, rounding: RoundingMode.HalfUp })).toEqual('-1.234e+4')

    expect(make(1.25).toPrecision({ significantDigits: 2, rounding: RoundingMode.HalfUp })).toEqual('1.3')
    expect(make(1.35).toPrecision({ significantDigits: 2, rounding: RoundingMode.HalfUp })).toEqual('1.4')

    expect(make(9631.01).toPrecision({ significantDigits: 1, rounding: RoundingMode.HalfUp })).toEqual('1e+4')
    expect(make(9950095.87).toPrecision({ significantDigits: 2, rounding: RoundingMode.HalfUp })).toEqual('1.0e+7')
    expect(make('9.856839969').toPrecision({ significantDigits: 1, rounding: RoundingMode.HalfUp })).toEqual('1e+1')
    expect(make('97.504').toPrecision({ significantDigits: 1, rounding: RoundingMode.HalfUp })).toEqual('1e+2')
    expect(make(97802.6).toPrecision({ significantDigits: 1, rounding: RoundingMode.HalfUp })).toEqual('1e+5')
    expect(make(9.9617).toPrecision({ significantDigits: 1, rounding: RoundingMode.HalfUp })).toEqual('1e+1')
    expect(make(989.2).toPrecision({ significantDigits: 1, rounding: RoundingMode.HalfUp })).toEqual('1e+3')
    expect(make(99576).toPrecision({ significantDigits: 2, rounding: RoundingMode.HalfUp })).toEqual('1.0e+5')
    expect(make('96236483.87').toPrecision({ significantDigits: 1, rounding: RoundingMode.HalfUp })).toEqual('1e+8')

    expect(make('-0.00001').toPrecision({ significantDigits: 1, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('-0.00001')
    expect(make('-0.00009').toPrecision({ significantDigits: 8, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('-0.000090000000')
    expect(make('-0.0000007').toPrecision({ significantDigits: 1, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('-7e-7')
    expect(make('68.931683406184761912218250317').toPrecision({ significantDigits: 15, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('68.9316834061848')
    expect(make('7860101808970473167417935916.60087069').toPrecision({ significantDigits: 17, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('7.8601018089704732e+27')
    expect(make('0.0000000000321445885399803244067719798337437062').toPrecision({ significantDigits: 42, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('3.21445885399803244067719798337437062000000e-11')
    expect(make('-8171786349835057630612358814.162756977984').toPrecision({ significantDigits: 37, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('-8171786349835057630612358814.162756978')
    expect(make('3340.903970019817086594869184429527413533291595472085').toPrecision({ significantDigits: 11, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('3340.9039701')
    expect(make('-7269097658095414435895.916118111573974542730031306').toPrecision({ significantDigits: 50, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('-7269097658095414435895.9161181115739745427300313060')
    expect(make('0.00000632206077863').toPrecision({ significantDigits: 6, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('0.00000632207')
    expect(make('573').toPrecision({ significantDigits: 1, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('6e+2')
    expect(make('0.000000738').toPrecision({ significantDigits: 2, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('7.4e-7')
    expect(make('-0.0000005031560306227217140253964236911907612837').toPrecision({ significantDigits: 7, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('-5.031561e-7')
    expect(make('-429050053964').toPrecision({ significantDigits: 4, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('-4.291e+11')
    expect(make('85131637').toPrecision({ significantDigits: 4, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('8.514e+7')
    expect(make('-0.000000003326783057540398442677461').toPrecision({ significantDigits: 2, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('-3.4e-9')
    expect(make('0.00000000000000000006940429596272251146200868514973032594273').toPrecision({ significantDigits: 17, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('6.9404295962722512e-20')
    expect(make('-828376248340605120247.15155295013990774586360178257303370779').toPrecision({ significantDigits: 32, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('-828376248340605120247.15155295014')
    expect(make('-7982750.6677764682946015520272838914918899297118139169410659').toPrecision({ significantDigits: 5, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('-7.9828e+6')
    expect(make('0.007126103937225425278801997738').toPrecision({ significantDigits: 24, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('0.00712610393722542527880200')
    expect(make('-56242').toPrecision({ significantDigits: 2, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('-5.7e+4')
    expect(make('-8928855203945443164.755136735230293536124112124').toPrecision({ significantDigits: 37, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('-8928855203945443164.755136735230293537')
    expect(make('5218572327.98424443372003772604597054153304').toPrecision({ significantDigits: 12, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('5218572327.99')
    expect(make('71707870535238750871516796339.59678962573869890935').toPrecision({ significantDigits: 31, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('71707870535238750871516796339.60')
    expect(make('88817462.71379822206524285939115943006583441400005007918').toPrecision({ significantDigits: 24, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('88817462.7137982220652429')
    expect(make('0.000000003').toPrecision({ significantDigits: 6, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('3.00000e-9')
    expect(make('-6.05291095813493573191').toPrecision({ significantDigits: 4, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('-6.053')
    expect(make('65163082867698740076').toPrecision({ significantDigits: 12, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('6.51630828677e+19')
    expect(make('2483202135696501.60187898870193199949004966876115645').toPrecision({ significantDigits: 24, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('2483202135696501.60187899')
    expect(make('0.000000000107650515680635692286894826641576642261').toPrecision({ significantDigits: 5, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('1.0766e-10')
    expect(make('642724503819056076.659397077514269963295024012414').toPrecision({ significantDigits: 42, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('642724503819056076.659397077514269963295025')
    expect(make('-7119169102619893823635.32141854354').toPrecision({ significantDigits: 5, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('-7.1192e+21')
    expect(make('-0.000000067174812556406388291019461146732616998258').toPrecision({ significantDigits: 31, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('-6.717481255640638829101946114674e-8')
    expect(make('-12.4197645179995365323309894').toPrecision({ significantDigits: 10, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('-12.41976452')
    expect(make('-0.00000000000000065292587801264491162499546440178399210241129').toPrecision({ significantDigits: 46, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('-6.529258780126449116249954644017839921024112900e-16')
    expect(make('-441838').toPrecision({ significantDigits: 7, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('-441838.0')
    expect(make('0.000000011282852935929493101783925259749957192').toPrecision({ significantDigits: 16, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('1.128285293592950e-8')
    expect(make('-86548567').toPrecision({ significantDigits: 7, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('-8.654857e+7')
    expect(make('0.00000038883293855303994672627854769926811949').toPrecision({ significantDigits: 17, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('3.8883293855303995e-7')
    expect(make('0.00000000000032587').toPrecision({ significantDigits: 9, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('3.25870000e-13')
    expect(make('3701031.59037494113').toPrecision({ significantDigits: 4, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('3.702e+6')
    expect(make('-3580077435.93682917449675702508371046631533').toPrecision({ significantDigits: 36, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('-3580077435.93682917449675702508371047')
    expect(make('-7.4').toPrecision({ significantDigits: 4, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('-7.400')
    expect(make('109519523263844229810.067657779734413280795410968892638').toPrecision({ significantDigits: 24, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('109519523263844229810.068')
    expect(make('-509247322311590671954830.8684766061855').toPrecision({ significantDigits: 35, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('-509247322311590671954830.86847660619')
    expect(make('0.00000000075518638430980800496570562671727889997').toPrecision({ significantDigits: 35, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('7.5518638430980800496570562671727890e-10')
    expect(make('-5056721600639122835615986051.4688319428182').toPrecision({ significantDigits: 43, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('-5056721600639122835615986051.468831942818200')
    expect(make('-0.000000000000000179614686112555178588617182925146').toPrecision({ significantDigits: 43, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('-1.796146861125551785886171829251460000000000e-16')
    expect(make('599').toPrecision({ significantDigits: 2, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('6.0e+2')
    expect(make('0.00000000000000076199293').toPrecision({ significantDigits: 7, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('7.619930e-16')
    expect(make('834668.237012103815961019258574789273273342').toPrecision({ significantDigits: 25, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('834668.2370121038159610193')
    expect(make('-392251395952329649490767912.240768552138247705202732').toPrecision({ significantDigits: 24, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('-3.92251395952329649490768e+26')
    expect(make('-47504099413385554632166.50972492550706').toPrecision({ significantDigits: 27, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('-47504099413385554632166.5098')

    expect(make('-1336106841').toPrecision({ significantDigits: 2, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('-1.4e+9')
    expect(make('-2244450.2134814273335262397290334104071203538487453309626146').toPrecision({ significantDigits: 23, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('-2244450.2134814273335263')
    expect(make('873625255363763952428129881990.679929486040461455296118489').toPrecision({ significantDigits: 3, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('8.74e+29')
    expect(make('-1.8545354973317961318592328878502252820666161607740183').toPrecision({ significantDigits: 30, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('-1.85453549733179613185923288786')
    expect(make('431.71506519265522010949747887049').toPrecision({ significantDigits: 13, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('431.7150651927')
    expect(make('-8606297211156287.5252002375256362382564355963505470716151').toPrecision({ significantDigits: 30, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('-8606297211156287.52520023752564')
    expect(make('-8463488970828351722405003.220603').toPrecision({ significantDigits: 11, rounding: RoundingMode.Up, expThresholdPos: 40 })).toEqual('-8.4634889709e+24')
  
    expect(make('-844789036.52397268892').toPrecision({ significantDigits: 16, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('-844789036.5239726')
    expect(make('-5056.206290127678787491852732096790643060542').toPrecision({ significantDigits: 42, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('-5056.20629012767878749185273209679064306054')
    expect(make('-0.32875191313148737635018598702989525').toPrecision({ significantDigits: 37, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('-0.3287519131314873763501859870298952500')
    expect(make('-60729764').toPrecision({ significantDigits: 8, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('-60729764')
    expect(make('-0.00000000000007622481594531380999826456196664586').toPrecision({ significantDigits: 4, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('-7.622e-14')
    expect(make('-4686402261639729535.7363244924747488').toPrecision({ significantDigits: 31, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('-4686402261639729535.736324492474')
    expect(make('-2').toPrecision({ significantDigits: 2, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('-2.0')
    expect(make('-13801188035233586637950193108.135925743814734511256495').toPrecision({ significantDigits: 55, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('-13801188035233586637950193108.13592574381473451125649500')
    expect(make('0.00008073275871498397993').toPrecision({ significantDigits: 24, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('0.0000807327587149839799300000')
    expect(make('-0.00000006').toPrecision({ significantDigits: 7, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('-6.000000e-8')
    expect(make('-383574993535').toPrecision({ significantDigits: 9, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('-3.83574993e+11')
    expect(make('0.000000000000076987').toPrecision({ significantDigits: 17, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('7.6987000000000000e-14')
    expect(make('80928866804.6112050947427973864826014844575374353').toPrecision({ significantDigits: 27, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('80928866804.6112050947427973')
    expect(make('-0.0073014067221009206110062377503733').toPrecision({ significantDigits: 6, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('-0.00730140')
    expect(make('2721047738841604910360884862459.4086993273252009015').toPrecision({ significantDigits: 27, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('2.72104773884160491036088486e+30')
    expect(make('30087807819177335941398228.1424107931203').toPrecision({ significantDigits: 19, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('3.008780781917733594e+25')
    expect(make('-0.00000000000000000013152892077961366915825014697229779786776').toPrecision({ significantDigits: 60, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('-1.31528920779613669158250146972297797867760000000000000000000e-19')
    expect(make('-858982311008.257025719798657844609315293821').toPrecision({ significantDigits: 2, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('-8.5e+11')
    expect(make('-0.0000000000036312827608449878').toPrecision({ significantDigits: 5, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('-3.6312e-12')
    expect(make('-0.006').toPrecision({ significantDigits: 5, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('-0.0060000')
    expect(make('-465727983501322687372765').toPrecision({ significantDigits: 6, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('-4.65727e+23')
    expect(make('-0.000003323316666280366035430077076052').toPrecision({ significantDigits: 18, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('-0.00000332331666628036603')
    expect(make('0.00000003533702791135712510338001418872124').toPrecision({ significantDigits: 7, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('3.533702e-8')
    expect(make('-0.0434').toPrecision({ significantDigits: 4, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('-0.04340')
    expect(make('-597340.2785660690868585878522362354706741').toPrecision({ significantDigits: 36, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('-597340.278566069086858587852236235470')
    expect(make('0.00000006').toPrecision({ significantDigits: 4, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('6.000e-8')
    expect(make('-0.00000000000000000036243233591127762966338166').toPrecision({ significantDigits: 19, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('-3.624323359112776296e-19')
    expect(make('-3731378568692042924197.15400334142251496795634388').toPrecision({ significantDigits: 25, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('-3731378568692042924197.154')
    expect(make('-68249040894032065692.62771690318493').toPrecision({ significantDigits: 22, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('-68249040894032065692.62')
    expect(make('8786096722661914.89732851188880184891692993684242690315').toPrecision({ significantDigits: 24, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('8786096722661914.89732851')
    expect(make('-0.00000000000184133215362813472644863729').toPrecision({ significantDigits: 38, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('-1.8413321536281347264486372900000000000e-12')
    expect(make('0.0000000040395827543504045').toPrecision({ significantDigits: 2, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('4.0e-9')
    expect(make('-29427119846374896').toPrecision({ significantDigits: 5, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('-2.9427e+16')
    expect(make('-917760614.45404359204911454').toPrecision({ significantDigits: 10, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('-917760614.4')
    expect(make('89427').toPrecision({ significantDigits: 1, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('8e+4')
    expect(make('0.0000092032398813435695382866726').toPrecision({ significantDigits: 27, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('0.00000920323988134356953828667260')
    expect(make('82068995955708118').toPrecision({ significantDigits: 2, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('8.2e+16')
    expect(make('335195944828445911672446409.3379497158141').toPrecision({ significantDigits: 12, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('3.35195944828e+26')
    expect(make('-0.00000000389774891030223957363124620581272897758735065471').toPrecision({ significantDigits: 12, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('-3.89774891030e-9')
    expect(make('-4').toPrecision({ significantDigits: 1, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('-4')
    expect(make('8').toPrecision({ significantDigits: 1, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('8')
    expect(make('0.000000000141172955693912934219137966').toPrecision({ significantDigits: 33, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('1.41172955693912934219137966000000e-10')
    expect(make('92148111958857').toPrecision({ significantDigits: 6, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('9.21481e+13')
    expect(make('-0.0000000000000000058599759784328539').toPrecision({ significantDigits: 16, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('-5.859975978432853e-18')
    expect(make('-72').toPrecision({ significantDigits: 3, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('-72.0')
    expect(make('3785098751297.89299119509940797071574729867819252140059').toPrecision({ significantDigits: 38, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('3785098751297.8929911950994079707157472')
    expect(make('43893416753778361.297703358127215475077814').toPrecision({ significantDigits: 3, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('4.38e+16')
    expect(make('-33110.2909623520267070846514').toPrecision({ significantDigits: 10, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('-33110.29096')
    expect(make('-74.3830525178488270772048643629212191403649548392158614').toPrecision({ significantDigits: 43, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('-74.38305251784882707720486436292121914036495')
    expect(make('5805164734299168659.6173113885173384955443').toPrecision({ significantDigits: 3, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('5.80e+18')
    expect(make('-1.719875889271327133154458155573493605566221534').toPrecision({ significantDigits: 16, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('-1.719875889271327')
    expect(make('113.672129563441659725876055771857758675550104070419635029').toPrecision({ significantDigits: 12, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('113.672129563')
    expect(make('-77950052814622081084397.91853869253589242574').toPrecision({ significantDigits: 24, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('-77950052814622081084397.9')
    expect(make('4531069852787151785292512309.2901993579425172826443679877').toPrecision({ significantDigits: 9, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('4.53106985e+27')
    expect(make('45285.2460896131694164407978407142422013937').toPrecision({ significantDigits: 32, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('45285.246089613169416440797840714')
    expect(make('307760226411464.73332680798632996332324381779707').toPrecision({ significantDigits: 31, rounding: RoundingMode.Down, expThresholdPos: 40 })).toEqual('307760226411464.7333268079863299')

    expect(make('-0.0300921721159558').toPrecision({ significantDigits: 3, rounding: RoundingMode.Ceiling, expThresholdPos: 40 })).toEqual('-0.0300')
    expect(make('65317841202.2094985937177227348012464402154').toPrecision({ significantDigits: 34, rounding: RoundingMode.Ceiling, expThresholdPos: 40 })).toEqual('65317841202.20949859371772273480125')
    expect(make('-892315754952021994731329589682.1894180393920044085713').toPrecision({ significantDigits: 14, rounding: RoundingMode.Ceiling, expThresholdPos: 40 })).toEqual('-8.9231575495202e+29')
    expect(make('-0.0000000280756792028583066').toPrecision({ significantDigits: 11, rounding: RoundingMode.Ceiling, expThresholdPos: 40 })).toEqual('-2.8075679202e-8')
    expect(make('9714558552').toPrecision({ significantDigits: 6, rounding: RoundingMode.Ceiling, expThresholdPos: 40 })).toEqual('9.71456e+9')
    expect(make('0.00000000029514099281').toPrecision({ significantDigits: 11, rounding: RoundingMode.Ceiling, expThresholdPos: 40 })).toEqual('2.9514099281e-10')
    expect(make('-124459985101107').toPrecision({ significantDigits: 6, rounding: RoundingMode.Ceiling, expThresholdPos: 40 })).toEqual('-1.24459e+14')
    expect(make('0.0000734657394154607815562372').toPrecision({ significantDigits: 30, rounding: RoundingMode.Ceiling, expThresholdPos: 40 })).toEqual('0.0000734657394154607815562372000000')
    expect(make('1787195303539715').toPrecision({ significantDigits: 15, rounding: RoundingMode.Ceiling, expThresholdPos: 40 })).toEqual('1.78719530353972e+15')
    expect(make('-2861102528').toPrecision({ significantDigits: 2, rounding: RoundingMode.Ceiling, expThresholdPos: 40 })).toEqual('-2.8e+9')
    expect(make('-0.00000000874480375581').toPrecision({ significantDigits: 15, rounding: RoundingMode.Ceiling, expThresholdPos: 40 })).toEqual('-8.74480375581000e-9')
    expect(make('-1792404726015427380.248150830448457643618022').toPrecision({ significantDigits: 43, rounding: RoundingMode.Ceiling, expThresholdPos: 40 })).toEqual('-1792404726015427380.248150830448457643618022')
    expect(make('-678437320202616518.22201579122092864').toPrecision({ significantDigits: 34, rounding: RoundingMode.Ceiling, expThresholdPos: 40 })).toEqual('-678437320202616518.2220157912209286')
    expect(make('-0.000000019373049152157802208097998096558936746196727718').toPrecision({ significantDigits: 46, rounding: RoundingMode.Ceiling, expThresholdPos: 40 })).toEqual('-1.937304915215780220809799809655893674619672771e-8')
    expect(make('824172.15863347130174103086069960571').toPrecision({ significantDigits: 26, rounding: RoundingMode.Ceiling, expThresholdPos: 40 })).toEqual('824172.15863347130174103087')
    expect(make('0.00000000190040714061724').toPrecision({ significantDigits: 18, rounding: RoundingMode.Ceiling, expThresholdPos: 40 })).toEqual('1.90040714061724000e-9')
    expect(make('-1634488249956745498.58311123049258868631623840423306').toPrecision({ significantDigits: 24, rounding: RoundingMode.Ceiling, expThresholdPos: 40 })).toEqual('-1634488249956745498.58311')
    expect(make('0.0000019600923098540334001755857361187871270117098').toPrecision({ significantDigits: 47, rounding: RoundingMode.Ceiling, expThresholdPos: 40 })).toEqual('0.0000019600923098540334001755857361187871270117098000')
    expect(make('83829').toPrecision({ significantDigits: 4, rounding: RoundingMode.Ceiling, expThresholdPos: 40 })).toEqual('8.383e+4')
    expect(make('284330612033786406376718').toPrecision({ significantDigits: 19, rounding: RoundingMode.Ceiling, expThresholdPos: 40 })).toEqual('2.843306120337864064e+23')
    expect(make('1862340943682995.08270612464203237562317928642459').toPrecision({ significantDigits: 6, rounding: RoundingMode.Ceiling, expThresholdPos: 40 })).toEqual('1.86235e+15')
    expect(make('-23195312138083').toPrecision({ significantDigits: 3, rounding: RoundingMode.Ceiling, expThresholdPos: 40 })).toEqual('-2.31e+13')
    expect(make('5450236028274773541895.65198933808968167192289601277').toPrecision({ significantDigits: 7, rounding: RoundingMode.Ceiling, expThresholdPos: 40 })).toEqual('5.450237e+21')
    expect(make('-0.00897641974940807545386111786545972434475187220274239581167').toPrecision({ significantDigits: 31, rounding: RoundingMode.Ceiling, expThresholdPos: 40 })).toEqual('-0.008976419749408075453861117865459')
    expect(make('-761181660548661030.25539542029').toPrecision({ significantDigits: 20, rounding: RoundingMode.Ceiling, expThresholdPos: 40 })).toEqual('-761181660548661030.25')
    expect(make('-1844205.936199580689273072905714475263817').toPrecision({ significantDigits: 15, rounding: RoundingMode.Ceiling, expThresholdPos: 40 })).toEqual('-1844205.93619958')
    expect(make('4842.77906784902805070438222238898372327092242428134814721').toPrecision({ significantDigits: 42, rounding: RoundingMode.Ceiling, expThresholdPos: 40 })).toEqual('4842.77906784902805070438222238898372327093')
    expect(make('-416119895344562950350397179').toPrecision({ significantDigits: 25, rounding: RoundingMode.Ceiling, expThresholdPos: 40 })).toEqual('-4.161198953445629503503971e+26')
    expect(make('10836').toPrecision({ significantDigits: 4, rounding: RoundingMode.Ceiling, expThresholdPos: 40 })).toEqual('1.084e+4')
    expect(make('0.0000000871081704218174598654542083').toPrecision({ significantDigits: 30, rounding: RoundingMode.Ceiling, expThresholdPos: 40 })).toEqual('8.71081704218174598654542083000e-8')
    expect(make('7913968291641940848703040206324645237.8515176490912667096').toPrecision({ significantDigits: 8, rounding: RoundingMode.Ceiling, expThresholdPos: 40 })).toEqual('7.9139683e+36')
    expect(make('-0.000008').toPrecision({ significantDigits: 1, rounding: RoundingMode.Ceiling, expThresholdPos: 40 })).toEqual('-0.000008')
    expect(make('83660085624983922907621996804192921.3992927').toPrecision({ significantDigits: 11, rounding: RoundingMode.Ceiling, expThresholdPos: 40 })).toEqual('8.3660085625e+34')
    expect(make('0.000006980263007423150706324065130475391').toPrecision({ significantDigits: 10, rounding: RoundingMode.Ceiling, expThresholdPos: 40 })).toEqual('0.000006980263008')
    expect(make('-31348084528321454060964445534333629317.69561497283830023').toPrecision({ significantDigits: 55, rounding: RoundingMode.Ceiling, expThresholdPos: 40 })).toEqual('-31348084528321454060964445534333629317.69561497283830023')
    expect(make('-2417953792643886.3485495754363678888681996409674308643').toPrecision({ significantDigits: 53, rounding: RoundingMode.Ceiling, expThresholdPos: 40 })).toEqual('-2417953792643886.3485495754363678888681996409674308643')
    expect(make('3982592').toPrecision({ significantDigits: 2, rounding: RoundingMode.Ceiling, expThresholdPos: 40 })).toEqual('4.0e+6')
    expect(make('-2092315.0150297222').toPrecision({ significantDigits: 19, rounding: RoundingMode.Ceiling, expThresholdPos: 40 })).toEqual('-2092315.015029722200')
    expect(make('-364992136844916.909223894931280218350055327754935').toPrecision({ significantDigits: 22, rounding: RoundingMode.Ceiling, expThresholdPos: 40 })).toEqual('-364992136844916.9092238')
    expect(make('8333642861002789136219873').toPrecision({ significantDigits: 3, rounding: RoundingMode.Ceiling, expThresholdPos: 40 })).toEqual('8.34e+24')
    expect(make('760088371794122.3380234188299740029832128019574765416').toPrecision({ significantDigits: 14, rounding: RoundingMode.Ceiling, expThresholdPos: 40 })).toEqual('7.6008837179413e+14')
    expect(make('-6655726127').toPrecision({ significantDigits: 11, rounding: RoundingMode.Ceiling, expThresholdPos: 40 })).toEqual('-6655726127.0')
    expect(make('-172186735288586033321621121024.11240623').toPrecision({ significantDigits: 11, rounding: RoundingMode.Ceiling, expThresholdPos: 40 })).toEqual('-1.7218673528e+29')
    expect(make('-33197729862068219255677464974').toPrecision({ significantDigits: 3, rounding: RoundingMode.Ceiling, expThresholdPos: 40 })).toEqual('-3.31e+28')
    expect(make('-483519132605694848658321267839.23575134378118945659616358').toPrecision({ significantDigits: 10, rounding: RoundingMode.Ceiling, expThresholdPos: 40 })).toEqual('-4.835191326e+29')
    expect(make('7.24882150443803').toPrecision({ significantDigits: 2, rounding: RoundingMode.Ceiling, expThresholdPos: 40 })).toEqual('7.3')
    expect(make('-89186640077683569.4070614276736450982125609').toPrecision({ significantDigits: 29, rounding: RoundingMode.Ceiling, expThresholdPos: 40 })).toEqual('-89186640077683569.407061427673')
    expect(make('-49379651041268.548293').toPrecision({ significantDigits: 15, rounding: RoundingMode.Ceiling, expThresholdPos: 40 })).toEqual('-49379651041268.5')
    expect(make('-7685054.17489171951660508194254495141726065698575306365447451').toPrecision({ significantDigits: 21, rounding: RoundingMode.Ceiling, expThresholdPos: 40 })).toEqual('-7685054.17489171951660')


    expect(make('-39449414270333.925852213834759031494508489474').toPrecision({ significantDigits: 26, rounding: RoundingMode.Floor, expThresholdPos: 40 })).toEqual('-39449414270333.925852213835')
    expect(make('-7.50437989975503711836768').toPrecision({ significantDigits: 12, rounding: RoundingMode.Floor, expThresholdPos: 40 })).toEqual('-7.50437989976')
    expect(make('-0.00000430397576').toPrecision({ significantDigits: 16, rounding: RoundingMode.Floor, expThresholdPos: 40 })).toEqual('-0.000004303975760000000')
    expect(make('-16040233916257241895.9765063397398857').toPrecision({ significantDigits: 34, rounding: RoundingMode.Floor, expThresholdPos: 40 })).toEqual('-16040233916257241895.97650633973989')
    expect(make('-7438.9287248601393818639176907606').toPrecision({ significantDigits: 20, rounding: RoundingMode.Floor, expThresholdPos: 40 })).toEqual('-7438.9287248601393819')
    expect(make('0.000000985746558429876825600458537705318327799').toPrecision({ significantDigits: 13, rounding: RoundingMode.Floor, expThresholdPos: 40 })).toEqual('9.857465584298e-7')
    expect(make('532637.90959835472848504665779583159203905641996').toPrecision({ significantDigits: 37, rounding: RoundingMode.Floor, expThresholdPos: 40 })).toEqual('532637.9095983547284850466577958315920')
    expect(make('-1404166952915258058306475434520.7856110230505157').toPrecision({ significantDigits: 12, rounding: RoundingMode.Floor, expThresholdPos: 40 })).toEqual('-1.40416695292e+30')
    expect(make('60346876.6670832429026869255506808488').toPrecision({ significantDigits: 36, rounding: RoundingMode.Floor, expThresholdPos: 40 })).toEqual('60346876.6670832429026869255506808488')
    expect(make('-252466132238128405832984').toPrecision({ significantDigits: 9, rounding: RoundingMode.Floor, expThresholdPos: 40 })).toEqual('-2.52466133e+23')
    expect(make('55').toPrecision({ significantDigits: 2, rounding: RoundingMode.Floor, expThresholdPos: 40 })).toEqual('55')
    expect(make('-63075151.9624657765163257922531779394931714').toPrecision({ significantDigits: 41, rounding: RoundingMode.Floor, expThresholdPos: 40 })).toEqual('-63075151.962465776516325792253177939493172')
    expect(make('741146113404361548.543142388').toPrecision({ significantDigits: 7, rounding: RoundingMode.Floor, expThresholdPos: 40 })).toEqual('7.411461e+17')
    expect(make('-58835755359067474972692072494278983.6314961114191480012916').toPrecision({ significantDigits: 36, rounding: RoundingMode.Floor, expThresholdPos: 40 })).toEqual('-58835755359067474972692072494278983.7')
    expect(make('-333').toPrecision({ significantDigits: 3, rounding: RoundingMode.Floor, expThresholdPos: 40 })).toEqual('-333')
    expect(make('72470760481059').toPrecision({ significantDigits: 6, rounding: RoundingMode.Floor, expThresholdPos: 40 })).toEqual('7.24707e+13')
    expect(make('39232618.151351544223399576553545438981252').toPrecision({ significantDigits: 36, rounding: RoundingMode.Floor, expThresholdPos: 40 })).toEqual('39232618.1513515442233995765535454389')
    expect(make('-357994').toPrecision({ significantDigits: 1, rounding: RoundingMode.Floor, expThresholdPos: 40 })).toEqual('-4e+5')
    expect(make('-18904.11335233460016293296574557643545512393801643609213933').toPrecision({ significantDigits: 3, rounding: RoundingMode.Floor, expThresholdPos: 40 })).toEqual('-1.90e+4')
    expect(make('-6585152111956929.9243094771233289848761842728287629').toPrecision({ significantDigits: 52, rounding: RoundingMode.Floor, expThresholdPos: 40 })).toEqual('-6585152111956929.924309477123328984876184272828762900')
    expect(make('0.0000004505328').toPrecision({ significantDigits: 4, rounding: RoundingMode.Floor, expThresholdPos: 40 })).toEqual('4.505e-7')
    expect(make('-24125965461845662271').toPrecision({ significantDigits: 14, rounding: RoundingMode.Floor, expThresholdPos: 40 })).toEqual('-2.4125965461846e+19')
    expect(make('4826731373891127996812671510065700.871947701').toPrecision({ significantDigits: 9, rounding: RoundingMode.Floor, expThresholdPos: 40 })).toEqual('4.82673137e+33')
    expect(make('-6621278.1120573461544975284970826524341806671316100080257485').toPrecision({ significantDigits: 8, rounding: RoundingMode.Floor, expThresholdPos: 40 })).toEqual('-6621278.2')
    expect(make('-0.00000018015392869565386634525164264799463344376205007391').toPrecision({ significantDigits: 56, rounding: RoundingMode.Floor, expThresholdPos: 40 })).toEqual('-1.8015392869565386634525164264799463344376205007391000000e-7')
    expect(make('-0.00026465463574439280006655492609887592672292239588307259').toPrecision({ significantDigits: 35, rounding: RoundingMode.Floor, expThresholdPos: 40 })).toEqual('-0.00026465463574439280006655492609887593')
    expect(make('4.8781522898830009076096556452567').toPrecision({ significantDigits: 18, rounding: RoundingMode.Floor, expThresholdPos: 40 })).toEqual('4.87815228988300090')
    expect(make('-511071171995240827790778012016163902').toPrecision({ significantDigits: 32, rounding: RoundingMode.Floor, expThresholdPos: 40 })).toEqual('-5.1107117199524082779077801201617e+35')
    expect(make('147342425157068905574.390834406').toPrecision({ significantDigits: 20, rounding: RoundingMode.Floor, expThresholdPos: 40 })).toEqual('1.4734242515706890557e+20')
    expect(make('-4019325091848890817268596991.8152').toPrecision({ significantDigits: 34, rounding: RoundingMode.Floor, expThresholdPos: 40 })).toEqual('-4019325091848890817268596991.815200')
    expect(make('384715413967421').toPrecision({ significantDigits: 2, rounding: RoundingMode.Floor, expThresholdPos: 40 })).toEqual('3.8e+14')
    expect(make('7483444.498791364040133403947480439118040376737700653').toPrecision({ significantDigits: 9, rounding: RoundingMode.Floor, expThresholdPos: 40 })).toEqual('7483444.49')
    expect(make('-594538312.625485172379').toPrecision({ significantDigits: 13, rounding: RoundingMode.Floor, expThresholdPos: 40 })).toEqual('-594538312.6255')
    expect(make('0.00753').toPrecision({ significantDigits: 6, rounding: RoundingMode.Floor, expThresholdPos: 40 })).toEqual('0.00753000')
    expect(make('81440148247675.27449603492606125135884').toPrecision({ significantDigits: 11, rounding: RoundingMode.Floor, expThresholdPos: 40 })).toEqual('8.1440148247e+13')
    expect(make('8444003009300239495556').toPrecision({ significantDigits: 13, rounding: RoundingMode.Floor, expThresholdPos: 40 })).toEqual('8.444003009300e+21')
    expect(make('2308.1529840912558574923966042774800185916972327325289261').toPrecision({ significantDigits: 53, rounding: RoundingMode.Floor, expThresholdPos: 40 })).toEqual('2308.1529840912558574923966042774800185916972327325289')
    expect(make('2674.698673623').toPrecision({ significantDigits: 3, rounding: RoundingMode.Floor, expThresholdPos: 40 })).toEqual('2.67e+3')
    expect(make('-2828191361802874708546255368471.80800005766').toPrecision({ significantDigits: 27, rounding: RoundingMode.Floor, expThresholdPos: 40 })).toEqual('-2.82819136180287470854625537e+30')
    expect(make('518250411').toPrecision({ significantDigits: 9, rounding: RoundingMode.Floor, expThresholdPos: 40 })).toEqual('518250411')
    expect(make('32661.9135347256259375001777960775509').toPrecision({ significantDigits: 2, rounding: RoundingMode.Floor, expThresholdPos: 40 })).toEqual('3.2e+4')
    expect(make('29.153476022164169919735054013077734177').toPrecision({ significantDigits: 22, rounding: RoundingMode.Floor, expThresholdPos: 40 })).toEqual('29.15347602216416991973')
    expect(make('-4611285536613066107912600830385').toPrecision({ significantDigits: 19, rounding: RoundingMode.Floor, expThresholdPos: 40 })).toEqual('-4.611285536613066108e+30')
    expect(make('-51774110.070514498902397536020716707114309435632036586').toPrecision({ significantDigits: 48, rounding: RoundingMode.Floor, expThresholdPos: 40 })).toEqual('-51774110.0705144989023975360207167071143094356321')
    expect(make('-11969053.9052').toPrecision({ significantDigits: 10, rounding: RoundingMode.Floor, expThresholdPos: 40 })).toEqual('-11969053.91')
    expect(make('687378946204028.408158998985701430935094').toPrecision({ significantDigits: 30, rounding: RoundingMode.Floor, expThresholdPos: 40 })).toEqual('687378946204028.408158998985701')
    expect(make('42.4523909443358871476552683504968536100051').toPrecision({ significantDigits: 5, rounding: RoundingMode.Floor, expThresholdPos: 40 })).toEqual('42.452')
    expect(make('-22771061110217019663705702.44170142085171219649140996').toPrecision({ significantDigits: 40, rounding: RoundingMode.Floor, expThresholdPos: 40 })).toEqual('-22771061110217019663705702.44170142085172')
    expect(make('-1470.6403099740161675122356986295857257144815364').toPrecision({ significantDigits: 34, rounding: RoundingMode.Floor, expThresholdPos: 40 })).toEqual('-1470.640309974016167512235698629586')
    expect(make('-1110227398804733429555663947.06619').toPrecision({ significantDigits: 7, rounding: RoundingMode.Floor, expThresholdPos: 40 })).toEqual('-1.110228e+27')
    expect(make('-648982371105405071851661301').toPrecision({ significantDigits: 11, rounding: RoundingMode.Floor, expThresholdPos: 40 })).toEqual('-6.4898237111e+26')
    expect(make('-4641197449469148.658850361201902222').toPrecision({ significantDigits: 31, rounding: RoundingMode.Floor, expThresholdPos: 40 })).toEqual('-4641197449469148.658850361201903')

    expect(make('79053003797878062.6454954').toPrecision({ significantDigits: 13, rounding: RoundingMode.HalfUp, expThresholdPos: 40 })).toEqual('7.905300379788e+16')
    expect(make('-0.00000000000068349').toPrecision({ significantDigits: 12, rounding: RoundingMode.HalfUp, expThresholdPos: 40 })).toEqual('-6.83490000000e-13')
    expect(make('-62760641815.690849736612012010742308663').toPrecision({ significantDigits: 28, rounding: RoundingMode.HalfUp, expThresholdPos: 40 })).toEqual('-62760641815.69084973661201201')
    expect(make('0.000704496313').toPrecision({ significantDigits: 3, rounding: RoundingMode.HalfUp, expThresholdPos: 40 })).toEqual('0.000704')
    expect(make('82926865286287.88523573683428608303107210630792996432').toPrecision({ significantDigits: 51, rounding: RoundingMode.HalfUp, expThresholdPos: 40 })).toEqual('82926865286287.8852357368342860830310721063079299643')
    expect(make('-0.00032388272393900301214220090248744799603424908').toPrecision({ significantDigits: 29, rounding: RoundingMode.HalfUp, expThresholdPos: 40 })).toEqual('-0.00032388272393900301214220090249')
    expect(make('8621641486938.4837308885005093571508566552428700982454').toPrecision({ significantDigits: 2, rounding: RoundingMode.HalfUp, expThresholdPos: 40 })).toEqual('8.6e+12')
    expect(make('2').toPrecision({ significantDigits: 1, rounding: RoundingMode.HalfUp, expThresholdPos: 40 })).toEqual('2')
    expect(make('146414401170525590746.047955203899370771105088').toPrecision({ significantDigits: 20, rounding: RoundingMode.HalfUp, expThresholdPos: 40 })).toEqual('1.4641440117052559075e+20')
    expect(make('3511.925583').toPrecision({ significantDigits: 10, rounding: RoundingMode.HalfUp, expThresholdPos: 40 })).toEqual('3511.925583')
    expect(make('2861824.253079699095727765750377038689').toPrecision({ significantDigits: 22, rounding: RoundingMode.HalfUp, expThresholdPos: 40 })).toEqual('2861824.253079699095728')
    expect(make('-39400977564.548924098664431671700066962').toPrecision({ significantDigits: 10, rounding: RoundingMode.HalfUp, expThresholdPos: 40 })).toEqual('-3.940097756e+10')
    expect(make('-888').toPrecision({ significantDigits: 3, rounding: RoundingMode.HalfUp, expThresholdPos: 40 })).toEqual('-888')
    expect(make('-0.00030210612521372498814172125610432438685').toPrecision({ significantDigits: 30, rounding: RoundingMode.HalfUp, expThresholdPos: 40 })).toEqual('-0.000302106125213724988141721256104')
    expect(make('6943.480455255531561580965042850266831249032130818358478956').toPrecision({ significantDigits: 32, rounding: RoundingMode.HalfUp, expThresholdPos: 40 })).toEqual('6943.4804552555315615809650428503')
    expect(make('3365678.3397481381125085749').toPrecision({ significantDigits: 7, rounding: RoundingMode.HalfUp, expThresholdPos: 40 })).toEqual('3365678')
    expect(make('-53943374313769567458.386865325').toPrecision({ significantDigits: 11, rounding: RoundingMode.HalfUp, expThresholdPos: 40 })).toEqual('-5.3943374314e+19')
    expect(make('-6.6788050922551015054225285214704948993825429849797925563674').toPrecision({ significantDigits: 51, rounding: RoundingMode.HalfUp, expThresholdPos: 40 })).toEqual('-6.67880509225510150542252852147049489938254298497979')
    expect(make('1364240644139816224.60228356028').toPrecision({ significantDigits: 6, rounding: RoundingMode.HalfUp, expThresholdPos: 40 })).toEqual('1.36424e+18')
    expect(make('141023647795041672538410.84935693266374259666015274447').toPrecision({ significantDigits: 19, rounding: RoundingMode.HalfUp, expThresholdPos: 40 })).toEqual('1.410236477950416725e+23')
    expect(make('-802.81776500697712984253334522').toPrecision({ significantDigits: 9, rounding: RoundingMode.HalfUp, expThresholdPos: 40 })).toEqual('-802.817765')
    expect(make('-5.27621072242469066889626007535503721885096').toPrecision({ significantDigits: 40, rounding: RoundingMode.HalfUp, expThresholdPos: 40 })).toEqual('-5.276210722424690668896260075355037218851')
    expect(make('-0.0008742095689707877849902027926289294748756775668387').toPrecision({ significantDigits: 15, rounding: RoundingMode.HalfUp, expThresholdPos: 40 })).toEqual('-0.000874209568970788')
    expect(make('0.09205383316200189249855864903410820435666385119723209239').toPrecision({ significantDigits: 14, rounding: RoundingMode.HalfUp, expThresholdPos: 40 })).toEqual('0.092053833162002')
    expect(make('0.0000000000000706562983181282092835675843980510112').toPrecision({ significantDigits: 17, rounding: RoundingMode.HalfUp, expThresholdPos: 40 })).toEqual('7.0656298318128209e-14')
    expect(make('-8665115168521166587').toPrecision({ significantDigits: 18, rounding: RoundingMode.HalfUp, expThresholdPos: 40 })).toEqual('-8.66511516852116659e+18')
    expect(make('33490648463534229842937.79268276945692333064632966129475').toPrecision({ significantDigits: 11, rounding: RoundingMode.HalfUp, expThresholdPos: 40 })).toEqual('3.3490648464e+22')
    expect(make('-39041587174692569176.827407061541838942655371389185').toPrecision({ significantDigits: 37, rounding: RoundingMode.HalfUp, expThresholdPos: 40 })).toEqual('-39041587174692569176.82740706154183894')
    expect(make('-3834').toPrecision({ significantDigits: 5, rounding: RoundingMode.HalfUp, expThresholdPos: 40 })).toEqual('-3834.0')
    expect(make('-0.00891238264481441877626863').toPrecision({ significantDigits: 25, rounding: RoundingMode.HalfUp, expThresholdPos: 40 })).toEqual('-0.008912382644814418776268630')
    expect(make('-206119').toPrecision({ significantDigits: 2, rounding: RoundingMode.HalfUp, expThresholdPos: 40 })).toEqual('-2.1e+5')
    expect(make('0.000000048334').toPrecision({ significantDigits: 12, rounding: RoundingMode.HalfUp, expThresholdPos: 40 })).toEqual('4.83340000000e-8')
    expect(make('0.000000000000000000318519653367523052').toPrecision({ significantDigits: 31, rounding: RoundingMode.HalfUp, expThresholdPos: 40 })).toEqual('3.185196533675230520000000000000e-19')
    expect(make('0.000000000000000060431217298488095562718496137220939447806').toPrecision({ significantDigits: 56, rounding: RoundingMode.HalfUp, expThresholdPos: 40 })).toEqual('6.0431217298488095562718496137220939447806000000000000000e-17')
    expect(make('-786589693451258754942279859.3834').toPrecision({ significantDigits: 1, rounding: RoundingMode.HalfUp, expThresholdPos: 40 })).toEqual('-8e+26')
    expect(make('-26').toPrecision({ significantDigits: 3, rounding: RoundingMode.HalfUp, expThresholdPos: 40 })).toEqual('-26.0')
    expect(make('-846222672789.2087639320702375427266333530942524245').toPrecision({ significantDigits: 10, rounding: RoundingMode.HalfUp, expThresholdPos: 40 })).toEqual('-8.462226728e+11')
    expect(make('-0.0000004019666978288041783154210868').toPrecision({ significantDigits: 1, rounding: RoundingMode.HalfUp, expThresholdPos: 40 })).toEqual('-4e-7')
    expect(make('-315609.775843992').toPrecision({ significantDigits: 15, rounding: RoundingMode.HalfUp, expThresholdPos: 40 })).toEqual('-315609.775843992')
    expect(make('-3318880945').toPrecision({ significantDigits: 4, rounding: RoundingMode.HalfUp, expThresholdPos: 40 })).toEqual('-3.319e+9')
    expect(make('-6.2847').toPrecision({ significantDigits: 1, rounding: RoundingMode.HalfUp, expThresholdPos: 40 })).toEqual('-6')

    expect(make('-1408003897645960.648499616456').toPrecision({ significantDigits: 28, rounding: RoundingMode.HalfDown, expThresholdPos: 40 })).toEqual('-1408003897645960.648499616456')
    expect(make('-1').toPrecision({ significantDigits: 2, rounding: RoundingMode.HalfDown, expThresholdPos: 40 })).toEqual('-1.0')
    expect(make('-827860423543649').toPrecision({ significantDigits: 3, rounding: RoundingMode.HalfDown, expThresholdPos: 40 })).toEqual('-8.28e+14')
    expect(make('0.00054398953021585321711560388889590290139888').toPrecision({ significantDigits: 29, rounding: RoundingMode.HalfDown, expThresholdPos: 40 })).toEqual('0.00054398953021585321711560388890')
    expect(make('-0.000000004408792').toPrecision({ significantDigits: 4, rounding: RoundingMode.HalfDown, expThresholdPos: 40 })).toEqual('-4.409e-9')
    expect(make('0.0000000004').toPrecision({ significantDigits: 5, rounding: RoundingMode.HalfDown, expThresholdPos: 40 })).toEqual('4.0000e-10')
    expect(make('34001779327925905').toPrecision({ significantDigits: 3, rounding: RoundingMode.HalfDown, expThresholdPos: 40 })).toEqual('3.40e+16')
    expect(make('-90332622851356543193546536340366547').toPrecision({ significantDigits: 3, rounding: RoundingMode.HalfDown, expThresholdPos: 40 })).toEqual('-9.03e+34')
    expect(make('-45320100856429143.39155209710530673318222777').toPrecision({ significantDigits: 5, rounding: RoundingMode.HalfDown, expThresholdPos: 40 })).toEqual('-4.5320e+16')
    expect(make('3618328715720583671291544414202').toPrecision({ significantDigits: 4, rounding: RoundingMode.HalfDown, expThresholdPos: 40 })).toEqual('3.618e+30')
    expect(make('-1003.61139687804673322250551').toPrecision({ significantDigits: 9, rounding: RoundingMode.HalfDown, expThresholdPos: 40 })).toEqual('-1003.61140')
    expect(make('-8139415035028632370.38736602659835').toPrecision({ significantDigits: 24, rounding: RoundingMode.HalfDown, expThresholdPos: 40 })).toEqual('-8139415035028632370.38737')
    expect(make('83198058').toPrecision({ significantDigits: 1, rounding: RoundingMode.HalfDown, expThresholdPos: 40 })).toEqual('8e+7')
    expect(make('-799491603856548').toPrecision({ significantDigits: 6, rounding: RoundingMode.HalfDown, expThresholdPos: 40 })).toEqual('-7.99492e+14')
    expect(make('444').toPrecision({ significantDigits: 3, rounding: RoundingMode.HalfDown, expThresholdPos: 40 })).toEqual('444')
    expect(make('0.0000061325826693823067791292255878336353793864046451956723').toPrecision({ significantDigits: 12, rounding: RoundingMode.HalfDown, expThresholdPos: 40 })).toEqual('0.00000613258266938')
    expect(make('-554696279951718746537611.26040029508470430208572833137315').toPrecision({ significantDigits: 29, rounding: RoundingMode.HalfDown, expThresholdPos: 40 })).toEqual('-554696279951718746537611.26040')
    expect(make('446.189185820662709163412845035853873').toPrecision({ significantDigits: 3, rounding: RoundingMode.HalfDown, expThresholdPos: 40 })).toEqual('446')
    expect(make('22873128187827109553471831451.06623850866672688842662473').toPrecision({ significantDigits: 40, rounding: RoundingMode.HalfDown, expThresholdPos: 40 })).toEqual('22873128187827109553471831451.06623850867')
    expect(make('880389').toPrecision({ significantDigits: 1, rounding: RoundingMode.HalfDown, expThresholdPos: 40 })).toEqual('9e+5')
    expect(make('-67516118890844443.625641').toPrecision({ significantDigits: 14, rounding: RoundingMode.HalfDown, expThresholdPos: 40 })).toEqual('-6.7516118890844e+16')
    expect(make('-0.36107158435820101656696353075596201902674001080619510849').toPrecision({ significantDigits: 14, rounding: RoundingMode.HalfDown, expThresholdPos: 40 })).toEqual('-0.36107158435820')
    expect(make('8.958386374640407364828679985365339921820421370157246').toPrecision({ significantDigits: 19, rounding: RoundingMode.HalfDown, expThresholdPos: 40 })).toEqual('8.958386374640407365')
    expect(make('257').toPrecision({ significantDigits: 1, rounding: RoundingMode.HalfDown, expThresholdPos: 40 })).toEqual('3e+2')
    expect(make('-1904659739878060478.113131137688927604413210083841').toPrecision({ significantDigits: 13, rounding: RoundingMode.HalfDown, expThresholdPos: 40 })).toEqual('-1.904659739878e+18')
    expect(make('-0.00006271421732891589577305487292334').toPrecision({ significantDigits: 6, rounding: RoundingMode.HalfDown, expThresholdPos: 40 })).toEqual('-0.0000627142')
    expect(make('331054103').toPrecision({ significantDigits: 7, rounding: RoundingMode.HalfDown, expThresholdPos: 40 })).toEqual('3.310541e+8')
    expect(make('-179388600781592577147651.2641684828762234473').toPrecision({ significantDigits: 7, rounding: RoundingMode.HalfDown, expThresholdPos: 40 })).toEqual('-1.793886e+23')
    expect(make('0.00046').toPrecision({ significantDigits: 4, rounding: RoundingMode.HalfDown, expThresholdPos: 40 })).toEqual('0.0004600')
    expect(make('-2906505321975413509885').toPrecision({ significantDigits: 2, rounding: RoundingMode.HalfDown, expThresholdPos: 40 })).toEqual('-2.9e+21')
    expect(make('86415.9473950557683374').toPrecision({ significantDigits: 13, rounding: RoundingMode.HalfDown, expThresholdPos: 40 })).toEqual('86415.94739506')
    expect(make('6.7304135909152').toPrecision({ significantDigits: 7, rounding: RoundingMode.HalfDown, expThresholdPos: 40 })).toEqual('6.730414')
    expect(make('-503236749968584').toPrecision({ significantDigits: 7, rounding: RoundingMode.HalfDown, expThresholdPos: 40 })).toEqual('-5.032367e+14')
    expect(make('-502416820138682162877178622610283').toPrecision({ significantDigits: 23, rounding: RoundingMode.HalfDown, expThresholdPos: 40 })).toEqual('-5.0241682013868216287718e+32')
    expect(make('-0.0552606118984074172116684879479087').toPrecision({ significantDigits: 33, rounding: RoundingMode.HalfDown, expThresholdPos: 40 })).toEqual('-0.0552606118984074172116684879479087')
    expect(make('91017414629852252476380368766.47117955844005').toPrecision({ significantDigits: 32, rounding: RoundingMode.HalfDown, expThresholdPos: 40 })).toEqual('91017414629852252476380368766.471')
    expect(make('28586.32124747000107561236523943').toPrecision({ significantDigits: 16, rounding: RoundingMode.HalfDown, expThresholdPos: 40 })).toEqual('28586.32124747000')
    expect(make('0.0000019356655453225341951305040536808235510260170838860718').toPrecision({ significantDigits: 22, rounding: RoundingMode.HalfDown, expThresholdPos: 40 })).toEqual('0.000001935665545322534195131')
    expect(make('7.803563246406851025').toPrecision({ significantDigits: 2, rounding: RoundingMode.HalfDown, expThresholdPos: 40 })).toEqual('7.8')
    expect(make('-489914223627882382434323457.50920109688497974624541155867073').toPrecision({ significantDigits: 24, rounding: RoundingMode.HalfDown, expThresholdPos: 40 })).toEqual('-4.89914223627882382434323e+26')
    expect(make('384718796891211107').toPrecision({ significantDigits: 18, rounding: RoundingMode.HalfDown, expThresholdPos: 40 })).toEqual('384718796891211107')
    expect(make('42510.7400230989797123019438399853496258').toPrecision({ significantDigits: 25, rounding: RoundingMode.HalfDown, expThresholdPos: 40 })).toEqual('42510.74002309897971230194')
    expect(make('-738804895894').toPrecision({ significantDigits: 4, rounding: RoundingMode.HalfDown, expThresholdPos: 40 })).toEqual('-7.388e+11')
    expect(make('-0.0000005').toPrecision({ significantDigits: 8, rounding: RoundingMode.HalfDown, expThresholdPos: 40 })).toEqual('-5.0000000e-7')
    expect(make('42334337596496149636254.4926162509306406461').toPrecision({ significantDigits: 23, rounding: RoundingMode.HalfDown, expThresholdPos: 40 })).toEqual('42334337596496149636254')
    expect(make('-7246374971.34279698356').toPrecision({ significantDigits: 1, rounding: RoundingMode.HalfDown, expThresholdPos: 40 })).toEqual('-7e+9')
    expect(make('71516263932998764871838469072.280115355524').toPrecision({ significantDigits: 29, rounding: RoundingMode.HalfDown, expThresholdPos: 40 })).toEqual('71516263932998764871838469072')
    expect(make('71257489.59952274151690076187021820922744').toPrecision({ significantDigits: 36, rounding: RoundingMode.HalfDown, expThresholdPos: 40 })).toEqual('71257489.5995227415169007618702182092')
    expect(make('268492834.77041').toPrecision({ significantDigits: 9, rounding: RoundingMode.HalfDown, expThresholdPos: 40 })).toEqual('268492835')
    expect(make('50325.551277778107847798801525').toPrecision({ significantDigits: 26, rounding: RoundingMode.HalfDown, expThresholdPos: 40 })).toEqual('50325.551277778107847798802')
    expect(make('-528930398665449048343281311623.69686').toPrecision({ significantDigits: 10, rounding: RoundingMode.HalfDown, expThresholdPos: 40 })).toEqual('-5.289303987e+29')

    expect(make('0.08').toPrecision({ significantDigits: 4, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('0.08000')
    expect(make('-4513243388120382069815.8508153058993058875').toPrecision({ significantDigits: 5, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('-4.5132e+21')
    expect(make('-73549.2594630551663822238').toPrecision({ significantDigits: 5, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('-73549')
    expect(make('127586800472892289589088296800.6').toPrecision({ significantDigits: 25, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('1.275868004728922895890883e+29')
    expect(make('-0.0003715444034899460421534099962225699').toPrecision({ significantDigits: 37, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('-0.0003715444034899460421534099962225699000')
    expect(make('-6962556526511822306135536').toPrecision({ significantDigits: 11, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('-6.9625565265e+24')
    expect(make('16758370364138.915293525076269061228714877').toPrecision({ significantDigits: 12, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('1.67583703641e+13')
    expect(make('-173594.950640855535151767073139475349181096310921699').toPrecision({ significantDigits: 50, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('-173594.95064085553515176707313947534918109631092170')
    expect(make('-69503965525000308384.151383').toPrecision({ significantDigits: 11, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('-6.9503965525e+19')
    expect(make('441122486054080817112').toPrecision({ significantDigits: 7, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('4.411225e+20')
    expect(make('24670440647835969376423717700462.39').toPrecision({ significantDigits: 28, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('2.467044064783596937642371770e+31')
    expect(make('3971189754948164565361634.8039734590476326224193520402091769').toPrecision({ significantDigits: 20, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('3.9711897549481645654e+24')
    expect(make('-1475761320868963235919.64499841336073105746686372924161').toPrecision({ significantDigits: 14, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('-1.4757613208690e+21')
    expect(make('91683083887068.61911461351134520171343337804061135').toPrecision({ significantDigits: 21, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('91683083887068.6191146')
    expect(make('-7923074181102822.5778').toPrecision({ significantDigits: 19, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('-7923074181102822.578')
    expect(make('-0.000000068').toPrecision({ significantDigits: 4, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('-6.800e-8')
    expect(make('-0.00000000025795467108146').toPrecision({ significantDigits: 21, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('-2.57954671081460000000e-10')
    expect(make('0.000000005535291197169667611325365189624523452').toPrecision({ significantDigits: 11, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('5.5352911972e-9')
    expect(make('604883577').toPrecision({ significantDigits: 8, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('6.0488358e+8')
    expect(make('-0.00000000757553501363609536678641245355').toPrecision({ significantDigits: 10, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('-7.575535014e-9')
    expect(make('0.00000000075470679605789002306444877998602723').toPrecision({ significantDigits: 25, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('7.547067960578900230644488e-10')
    expect(make('-3645614567625.4').toPrecision({ significantDigits: 12, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('-3.64561456763e+12')
    expect(make('0.0000009').toPrecision({ significantDigits: 2, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('9.0e-7')
    expect(make('687').toPrecision({ significantDigits: 1, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('7e+2')
    expect(make('517277827334839.8174848543680868015165926618').toPrecision({ significantDigits: 31, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('517277827334839.8174848543680868')
    expect(make('655.46270361324473194').toPrecision({ significantDigits: 1, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('7e+2')
    expect(make('1632131488313153.497374248234935731568').toPrecision({ significantDigits: 36, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('1632131488313153.49737424823493573157')
    expect(make('274068317992.5998880719845028748169734442394151076').toPrecision({ significantDigits: 40, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('274068317992.5998880719845028748169734442')
    expect(make('-0.00000000706025531009734073').toPrecision({ significantDigits: 4, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('-7.060e-9')
    expect(make('0.0044439457493').toPrecision({ significantDigits: 4, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('0.004444')
    expect(make('72482770689153111154104782082.022764082943227214833851').toPrecision({ significantDigits: 32, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('72482770689153111154104782082.023')
    expect(make('5913069403607279420613864.152').toPrecision({ significantDigits: 20, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('5.9130694036072794206e+24')
    expect(make('843384561300245347961437.96592523791').toPrecision({ significantDigits: 27, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('843384561300245347961437.966')
    expect(make('0.000003519882128251').toPrecision({ significantDigits: 20, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('0.0000035198821282510000000')
    expect(make('-0.00000000100371560130267706870096885251').toPrecision({ significantDigits: 24, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('-1.00371560130267706870097e-9')
    expect(make('17504218.49703016415913667026121376499').toPrecision({ significantDigits: 15, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('17504218.4970302')
    expect(make('-0.000000005169058703').toPrecision({ significantDigits: 1, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('-5e-9')
    expect(make('69228032455').toPrecision({ significantDigits: 10, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('6.922803246e+10')
    expect(make('-16').toPrecision({ significantDigits: 2, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('-16')
    expect(make('-13551475134681927071279391508441439066206.58705380600075').toPrecision({ significantDigits: 28, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('-1.355147513468192707127939151e+40')
    expect(make('81670324.1197758695212865075629796973196504241126').toPrecision({ significantDigits: 18, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('81670324.1197758695')
    expect(make('0.00004797485174640366805332660647').toPrecision({ significantDigits: 1, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('0.00005')
    expect(make('-0.0000000004864397594461335282648538530108953965681345').toPrecision({ significantDigits: 10, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('-4.864397594e-10')
    expect(make('47694105.23125322528167211284521303').toPrecision({ significantDigits: 15, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('47694105.2312532')
    expect(make('-496210618135432953927871636.779236').toPrecision({ significantDigits: 10, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('-4.962106181e+26')
    expect(make('12800030559497062236641930592334626609.7332').toPrecision({ significantDigits: 23, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('1.2800030559497062236642e+37')
    expect(make('-574830783.6689168903917696583746514637433390929').toPrecision({ significantDigits: 10, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('-574830783.7')
    expect(make('5969.43108619905746956015212970904111744101').toPrecision({ significantDigits: 19, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('5969.431086199057470')
    expect(make('-4814.32904953003285').toPrecision({ significantDigits: 2, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('-4.8e+3')
    expect(make('42973001760252134').toPrecision({ significantDigits: 4, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('4.297e+16')
    expect(make('-5762846.590152347665179652381407653797146356303622218259885').toPrecision({ significantDigits: 5, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('-5.7628e+6')
    expect(make('904864662232032.16061240181031792729165740314293194205879163').toPrecision({ significantDigits: 48, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('904864662232032.160612401810317927291657403142932')
    expect(make('798923115068265241915.537619430376605').toPrecision({ significantDigits: 5, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('7.9892e+20')
    expect(make('-8.97759349384000643427096282979').toPrecision({ significantDigits: 18, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('-8.97759349384000643')
    expect(make('12.345e1').toPrecision({ significantDigits: 5, rounding: RoundingMode.HalfEven, expThresholdPos: 40 })).toEqual('123.45')
  })
})

describe('Decimal.prototype.toString()', () => {
  it('toString()', () => {
    expect(make('0').toString()).toEqual('0')
    expect(make('-0').toString()).toEqual('-0')
    expect(make('infinity').toString()).toEqual('Infinity')
    expect(make('-infinity').toString()).toEqual('-Infinity')
    expect(make('1').toString()).toEqual('1')
    expect(make('10').toString()).toEqual('10')
    expect(make('110').toString()).toEqual('110')
    expect(make('-1').toString()).toEqual('-1')
    expect(make('-10').toString()).toEqual('-10')
    expect(make('-110').toString()).toEqual('-110')
    expect(make('0.1').toString()).toEqual('0.1')
    expect(make('0.01').toString()).toEqual('0.01')
    expect(make('1.1').toString()).toEqual('1.1')
  })

  it('toString(Decimal.js)', () => {
    mergeSetting({ precision: 200, rounding: RoundingMode.HalfUp, expThresholdNeg: -9e15, expThresholdPos: 9e15 })

    function t(expected: string, n: any) {
      expect(make(n).toString()).toEqual(expected)
    }

    t('0', 0);
    t('0', '0');
    t('NaN', NaN);
    t('NaN', 'NaN');
    t('Infinity', 1/0);
    t('Infinity', 'Infinity');
    t('1', 1);
    t('9', 9);
    t('90', 90);
    t('90.12', 90.12);
    t('0.1', 0.1);
    t('0.01', 0.01);
    t('0.0123', 0.0123);
    t('111111111111111111111',   '111111111111111111111');
    t('1111111111111111111111',  '1111111111111111111111');
    t('11111111111111111111111', '11111111111111111111111');
    t('0.00001', 0.00001);
    t('0.000001', 0.000001);

    t('-Infinity', -1/0);
    t('-Infinity', '-Infinity');
    t('-1', -1);
    t('-9', -9);
    t('-90', -90);
    t('-90.12', -90.12);
    t('-0.1', -0.1);
    t('-0.01', -0.01);
    t('-0.0123', -0.0123);
    t('-111111111111111111111',  '-111111111111111111111');
    t('-1111111111111111111111', '-1111111111111111111111');
    t('-11111111111111111111111', '-11111111111111111111111');
    t('-0.00001', -0.00001);
    t('-0.000001', -0.000001);

    mergeSetting({ expThresholdNeg: 0, expThresholdPos: 0 })

    t('1e-7', 0.0000001);
    t('1.2e-7', 0.00000012);
    t('1.23e-7', 0.000000123);
    t('1e-8', 0.00000001);
    t('1.2e-8', 0.000000012);
    t('1.23e-8', 0.0000000123);
    t('-1e-7', -0.0000001);
    t('-1.2e-7', -0.00000012);
    t('-1.23e-7', -0.000000123);
    t('-1e-8', -0.00000001);
    t('-1.2e-8', -0.000000012);
    t('-1.23e-8', -0.0000000123);
  
    t('5.73447902457635174479825134e+14', '573447902457635.174479825134');
    t('1.07688e+1', '10.7688');
    t('3.171194102379077141557759899307946350455841e+27', '3171194102379077141557759899.307946350455841');
    t('4.924353466898191177698653319742594890634579e+37', '49243534668981911776986533197425948906.34579');
    t('6.85558243926569397328633907445409866949445343654692955e+18', '6855582439265693973.28633907445409866949445343654692955');
    t('2.1320000803e+7', '21320000.803');
    t('5.0878741e+4', '50878.741');
    t('5.1932898288391e+8', '519328982.88391');
    t('5.690616778176956027307884725933410349604387915634524e+49', '56906167781769560273078847259334103496043879156345.24');
    t('3.25099780528575457273246693147645e+15', '3250997805285754.572732466931476450');
    t('2.5811494197573291905990947355226e+13', '25811494197573.291905990947355226');
    t('5.60372259169833930471746454125e+13', '56037225916983.3930471746454125');
    t('1.2615810663732236602461593613783e+7', '12615810.663732236602461593613783');
    t('1.4654366449266911507705477499035407722184965108377032e+11', '146543664492.66911507705477499035407722184965108377032');
    t('6.4986735507448912857131832908423940757e+38', '649867355074489128571318329084239407570.0');
    t('1.1e+2', '110.0');
    t('3.6146989180120676857245474944e+3', '3614.6989180120676857245474944');
    t('9.928654762302286149994896625074e+4', '99286.54762302286149994896625074');
    t('3.46424170787806074650506079e+3', '3464.24170787806074650506079');
    t('1.25934313355319666474752550204680303068865719647e+33', '1259343133553196664747525502046803.03068865719647');
    t('1.23014105337660651106978059198916100450966081493207e+27', '1230141053376606511069780591.98916100450966081493207');
    t('1.386164712267169624993434287237e+23', '138616471226716962499343.4287237');
    t('2.66076369930322488334961932e+3', '2660.76369930322488334961932');
    t('9.37582568e+4', '93758.2568');
    t('1.39853642894726883996875746770529e+28', '13985364289472688399687574677.0529');
    t('3.19099e+5', '319099.0');
    t('3.04557106798789396303998723e+19', '30455710679878939630.3998723');
    t('1.3024612569115368830867934222004329653604418e+9', '1302461256.9115368830867934222004329653604418');
    t('2.358787483447172786e+5', '235878.7483447172786');
    t('5.10614446965318674547416709785208086304398889160563e+28', '51061444696531867454741670978.5208086304398889160563');
    t('1.46685947134456101512731611558e+23', '146685947134456101512731.6115580');
    t('3.69960105771344554151928256518906564810300119e+25', '36996010577134455415192825.6518906564810300119');
    t('2.68683153074628e+10', '26868315307.4628');
    t('2.35656504568492312232737219553793859212e+15', '2356565045684923.12232737219553793859212');
    t('7.753292442361215e+14', '775329244236121.5');
    t('1.272818730367215461852227991200704e+21', '1272818730367215461852.227991200704');
    t('1.13900700292988027871648046839423153789e+7', '11390070.0292988027871648046839423153789');
    t('1.4546654966819402705e+14', '145466549668194.02705');
    t('3.05345735395805567424714891401667575466462830113819e+48', '3053457353958055674247148914016675754664628301138.19');
    t('5.1218945854639324441304933666460587e+2', '512.18945854639324441304933666460587');
    t('9.95299900896e+5', '995299.9008960');
    t('4.016e+1', '40.16');
    t('1.86570326e+7', '18657032.6');
    t('1.3381001727e+5', '133810.01727');
    t('2.639841700687441886800225725227e+12', '2639841700687.441886800225725227');
    t('2.8945e+2', '289.45');
    t('1.559806666149836070330006415033e+24', '1559806666149836070330006.415033');
    t('3.14984566145310751826289711761375061645611777700983e+3', '3149.84566145310751826289711761375061645611777700983');
    t('3.0940691333892283249774116223987e+5', '309406.91333892283249774116223987');
    t('6.572766274013360381079275191108732606370177179594282e+5', '657276.6274013360381079275191108732606370177179594282');
    t('1.470126973337024e+6', '1470126.973337024');
    t('5.6499e+2', '564.99');
    t('2.8416297367859233303497847667971781197616950846e+28', '28416297367859233303497847667.971781197616950846');
    t('2.1364951568189836563102481625533538320051163977e+41', '213649515681898365631024816255335383200511.63977');
    t('8.76108618687537137080904679797e+19', '87610861868753713708.0904679797');
    t('6.27683573474251182408654509953633505286e+6', '6276835.73474251182408654509953633505286');
    t('9.034542832410912578330021146413119399e+28', '90345428324109125783300211464.13119399');
    t('7.026094393430852002585511641212897686956090955e+39', '7026094393430852002585511641212897686956.090955');
    t('1.8812221093491505758565988678062e+11', '188122210934.91505758565988678062');
    t('9.435538492497050138580201734902181057468044875e+43', '94355384924970501385802017349021810574680448.75');
    t('5.36793419620790391866461e+20', '536793419620790391866.461');
    t('2.315089265590404012562599592854156357726817712e+26', '231508926559040401256259959.2854156357726817712');
    t('7.499170741828885273030006066196546588710962e+17', '749917074182888527.3030006066196546588710962');
    t('3.3962128305986e+5', '339621.28305986');
    t('8.17980456510031304e+9', '8179804565.10031304');
    t('4.394575876858124185382e+13', '43945758768581.24185382');
    t('7.881617323629751701107428e+9', '7881617323.629751701107428');
    t('9.85209894663520857685703881781194082356123765e+39', '9852098946635208576857038817811940823561.23765');
    t('6.849329685e+5', '684932.9685');
    t('2.8262252277815736355279617243060700437627773361e+7', '28262252.277815736355279617243060700437627773361');
    t('1.503736721902e+9', '1503736721.902');
    t('2.65213505469049775997232325076980590625670234690917845e+41', '265213505469049775997232325076980590625670.234690917845');
    t('4.23752645959719196604760963802412828187442060555521e+2', '423.752645959719196604760963802412828187442060555521');
    t('9.023159535576504097005203913521871601640521009e+36', '9023159535576504097005203913521871601.640521009');
    t('4.69339457186380276410136272120035011198438772754725e+14', '469339457186380.276410136272120035011198438772754725');
    t('1.2819429130391792511503973184804508867728894e+6', '1281942.9130391792511503973184804508867728894');
    t('1.9778e+3', '1977.8');
    t('2.456680359828937628024631306792185367572610021e+43', '24566803598289376280246313067921853675726100.21');
    t('5.25389225018085571689046925802871155628e+1', '52.5389225018085571689046925802871155628');
    t('1.733700532107e+8', '173370053.2107');
    t('1.9561099921e+5', '195610.99921');
    t('3.3409e+2', '334.09');
    t('3.20634106832106387482375790792609337383007782520694e+24', '3206341068321063874823757.90792609337383007782520694');
    t('1.46347126003930100207988814e+20', '146347126003930100207.98881400');
    t('2.717780449744210117995586561524987067807146882e+43', '27177804497442101179955865615249870678071468.82');
    t('2.86757572635270377540170639151e+22', '28675757263527037754017.0639151');
    t('1.3488325541508602487577920722101277063863557818e+14', '134883255415086.02487577920722101277063863557818');
    t('1.96013732736436392e+13', '19601373273643.6392');
    t('4.798185890466e+2', '479.8185890466');
    t('1.696622337138949329874242519485119916519994150606e+39', '1696622337138949329874242519485119916519.994150606');
    t('5.50000572984970761183142593570950897913860587074643e+13', '55000057298497.0761183142593570950897913860587074643');
    t('4.9e+1', '49');
    t('2.353405108244768666141e+9', '2353405108.2447686661410');
    t('5.54113012e+1', '55.411301200');
    t('1.639709023131e+11', '163970902313.1');
    t('2.15324060127001207725970506357881e+19', '21532406012700120772.5970506357881');
    t('2.373532121822929762731612214095513784533409e+29', '237353212182292976273161221409.5513784533409');
    t('4.5883026736677354807679611737881799804e+16', '45883026736677354.807679611737881799804');
    t('2.5996714820346689325468319633061e+21', '2599671482034668932546.8319633061');
    t('8.22641928e+6', '8226419.280');
    t('2.56006014528479284199702229871263269e+20', '256006014528479284199.702229871263269');
    t('4.301260132991159779386275268219519443685e+24', '4301260132991159779386275.268219519443685');
    t('1.052721790360165649330888881e+22', '10527217903601656493308.88881');
    t('1.341206836e+5', '134120.6836');
    t('1.293696083809745995580141432072678134217648017629e+25', '12936960838097459955801414.32072678134217648017629');
    t('9.81886611183e+9', '9818866111.83');
    t('1.3e+1', '13');
    t('2.185212134168411755342025405260683400574952243371e+1', '21.8521213416841175534202540526068340057495224337100');
    t('5.09812942277266e+1', '50.9812942277266');
    t('1.15841228150473459450904593187073359993e+37', '11584122815047345945090459318707335999.3');
    t('2.946408e+1', '29.46408');
    t('7.8843253757257e+6', '7884325.3757257');
    t('4.149829532631829e+7', '41498295.32631829');
    t('9.76844406944663415436782518894675931581135161845733e+46', '97684440694466341543678251889467593158113516184.5733');
    t('1.320634109357604978481e+7', '13206341.09357604978481');
    t('1.2300117044692162331376535732386421937e+8', '123001170.44692162331376535732386421937');
    t('1.79343822239530391558796001578394154846951511735e+42', '1793438222395303915587960015783941548469515.11735');
    t('3.46227335968923941657647562338569e+7', '34622733.5968923941657647562338569');
    t('3.6081901133629252234652167e+18', '3608190113362925223.4652167');
    t('3.41769614577210353834283168068494e+24', '3417696145772103538342831.68068494');
    t('1.036693895e+8', '103669389.5');
    t('9.840862048026534392868878603161623504069221701e+27', '9840862048026534392868878603.161623504069221701');
    t('2.56437211238605e+10', '25643721123.86050');
    t('2.645333616435501e+6', '2645333.616435501');
    t('3.75834254646606787747061360998e+1', '37.5834254646606787747061360998');
    t('1.21582101247e+6', '1215821.01247');
    t('5.43e+1', '54.3');
    t('3.1461380403028457753654142032015e+27', '3146138040302845775365414203.2015');
    t('2.73039e+4', '27303.9');
    t('3.349112077000398203735762417e+25', '33491120770003982037357624.170');
    t('2.293912475527946909960963698602754526495697363e+31', '22939124755279469099609636986027.54526495697363');
    t('7.800578368e+8', '780057836.8');
    t('3.503304265046835170500513083432983735273e+28', '35033042650468351705005130834.32983735273');
    t('6.521027589563589728e+9', '6521027589.563589728');
    t('1.26604818273232e+3', '1266.04818273232');
    t('4.5844253800756959854340115e+7', '45844253.800756959854340115');
    t('2.5103887704609158215979351198183e+20', '251038877046091582159.79351198183');
    t('6.5170765018089001398157674630438543e+17', '651707650180890013.98157674630438543');
    t('7.85679659655762637941070216699747e+18', '7856796596557626379.41070216699747');
    t('6.55113755834849587145e+18', '6551137558348495871.45');
    t('1.37856413555592382324487860882977704999616e+32', '137856413555592382324487860882977.704999616');
    t('7.51530486314140193e+5', '751530.486314140193');
    t('1.3712642461229590011e+7', '13712642.4612295900110');
    t('8.945222111405724e+2', '894.5222111405724');
    t('1.74501389497524149414213254563953197394499747444317e+44', '174501389497524149414213254563953197394499747.444317');
    t('7.1583294041845987824307132e+11', '715832940418.45987824307132');
    t('1.282007923703783860923747442697572540049e+13', '12820079237037.83860923747442697572540049');
    t('5.660625174793381639446229222e+11', '566062517479.3381639446229222');
    t('2.094745267e+4', '20947.45267');
    t('8.4497877437844686621097450218313191175e+13', '84497877437844.6866210974502183131911750');
    t('1.707217105197425488000493702652714920318758323999364e+23', '170721710519742548800049.3702652714920318758323999364');
    t('2.5487434814078948112667918801256335353406914111636153e+36', '2548743481407894811266791880125633535.3406914111636153');
    t('7.975944255792483246376368330364e+8', '797594425.5792483246376368330364');
    t('1.1038710051127692465453332862048e+20', '110387100511276924654.53332862048');
    t('2.0214122542287381656860062564183697682e+13', '20214122542287.381656860062564183697682');
    t('7.853012025112e+4', '78530.12025112');
    t('7.97061651146928e+3', '7970.61651146928');
    t('1.5712956919727392305361179349388e+10', '15712956919.727392305361179349388');
    t('8.2480059e+3', '8248.0059');
    t('2.71929146422591231877279340940781443961397491e+19', '27192914642259123187.7279340940781443961397491');
    t('2.131e+2', '213.10');
    t('5.53443299017925367e+6', '5534432.99017925367');
    t('9.0599636453e+8', '905996364.53');
    t('3.50691916034642635201767965866239485795145676493e+28', '35069191603464263520176796586.6239485795145676493');
    t('1.20268235416561427028396813141142129291e+18', '1202682354165614270.283968131411421292910');
    t('4.8878729e+4', '48878.7290');
    t('9.04344910891e+4', '90434.4910891');
    t('3.87232843764031e+2', '387.232843764031');
    t('2.246212201353343e+11', '224621220135.33430');
    t('4.92916234816086643529027167741689023e+4', '49291.6234816086643529027167741689023');
    t('2.1773818234639052045922630496e+22', '21773818234639052045922.630496');
    t('2.700762078698436846755198719005e+28', '27007620786984368467551987190.05');
    t('3.04897901998664513240359358574664525651334171e+36', '3048979019986645132403593585746645256.51334171');
    t('3.807300704307638993582e+18', '3807300704307638993.582');
    t('7.9846840795076707340124614425632613353204e+3', '7984.6840795076707340124614425632613353204');
    t('6.69918558928e+4', '66991.8558928');
    t('5.11e+1', '51.1');
    t('1.8e+1', '18');
    t('2.629676971e+2', '262.9676971');
    t('6.8402048967767212280354493672372347369800788279670097e+39', '6840204896776721228035449367237234736980.0788279670097');
    t('4.684145127602661593941009299096573092581e+21', '4684145127602661593941.009299096573092581');
    t('1.3010133600355313564757759338788842e+18', '1301013360035531356.4757759338788842');
    t('1.58527974113934732993372979240170059e+30', '1585279741139347329933729792401.70059');
    t('1.8249338722142728063286e+2', '182.49338722142728063286');
    t('2.0337546838170082473539926326926478252219475e+29', '203375468381700824735399263269.26478252219475');
    t('4.626173e+3', '4626.173');
    t('3.13977842e+6', '3139778.42');
    t('4.4046554138751e+10', '44046554138.751');
    t('2.27133088062335544441002965096e+25', '22713308806233554444100296.5096');
    t('1.72895143e+4', '17289.5143');
    t('2.59665963383099309886519729836757e+20', '259665963383099309886.5197298367570');
    t('5.42804375404301025317704270939778493719619031067122726e+24', '5428043754043010253177042.70939778493719619031067122726');
    t('4.0526054186532354119711729303068171063825508e+2', '405.26054186532354119711729303068171063825508');
    t('1.26960267394273418410687782475849e+9', '1269602673.94273418410687782475849');
    t('5.657206212494798707700546288522044895183104747814298e+7', '56572062.12494798707700546288522044895183104747814298');
    t('4.80834664047405196104320584899449259286e+21', '4808346640474051961043.20584899449259286');
    t('5.6639294733687553228095e+12', '5663929473368.7553228095');
    t('3.08469899797006019074738182718775120203832280411e+44', '308469899797006019074738182718775120203832280.4110');
    t('6.7324018330891115163882850963905830707247414517739e+20', '673240183308911151638.82850963905830707247414517739');
    t('7.8e+1', '78');
    t('3.7511576e+4', '37511.576');
    t('4.9744737445922007872559411117007e+20', '497447374459220078725.59411117007');
    t('1.4264855114407053894401398660016825255242638071603e+2', '142.64855114407053894401398660016825255242638071603');
    t('1.7972e+1', '17.972');
    t('1.08223075909551421423442320791403363148864e+12', '1082230759095.51421423442320791403363148864');
    t('1.27992032328728568e+16', '12799203232872856.8');
    t('3.23410998756876789482263723951851692122375679e+9', '3234109987.56876789482263723951851692122375679');
    t('8.309058187826413886051933894555524364e+5', '830905.8187826413886051933894555524364');
    t('5.9126904485324084868266487306831291316268437628598e+40', '59126904485324084868266487306831291316268.437628598');
    t('3.579918283412251816470339246643e+16', '35799182834122518.16470339246643');
    t('8.292403288e+1', '82.92403288');
    t('7.39431e+2', '739.431');
    t('3.880259e+2', '388.0259');
    t('8.356612898392420429137009991722851e+18', '8356612898392420429.137009991722851');
    t('5.395903069e+4', '53959.03069');
    t('2.084656696443025813e+12', '2084656696443.025813');
    t('7.54671420639507228408101673007042651462774881888e+46', '75467142063950722840810167300704265146277488188.8');
    t('6.9e+1', '69');
    t('8.921e+2', '892.10');
    t('2.51196408e+4', '25119.6408');
    t('4.2502325992166027236666111862782e+15', '4250232599216602.7236666111862782');
    t('1.48181688637265610577148846528720697801886e+17', '148181688637265610.577148846528720697801886');
    t('4.346905625146927213132990652e+22', '43469056251469272131329.90652');
    t('2.47731675267438120023934691987e+15', '2477316752674381.20023934691987');
    t('3.37487366652276710575333974697197457e+9', '3374873666.52276710575333974697197457');
    t('9.83004944893186643985967600066862369294062e+17', '983004944893186643.985967600066862369294062');
    t('4.24581658127100743607231740518633563667839856744e+26', '424581658127100743607231740.518633563667839856744');
    t('3.14222253457223322124561584676953981561133e+2', '314.222253457223322124561584676953981561133');
    t('1.1553833141891499623566322265502695096447390786748e+48', '1155383314189149962356632226550269509644739078674.8');
    t('5.2811e+1', '52.811');
    t('9.925202445922857021945001443270353221818473047344e+2', '992.5202445922857021945001443270353221818473047344');
    t('1.5758941e+4', '15758.9410');
    t('6.6630010328564980059488916358767e+30', '6663001032856498005948891635876.7');
    t('1.49898377473153728100588907982263779724221092732531e+44', '149898377473153728100588907982263779724221092.732531');
    t('4.175238908185616536855e+20', '417523890818561653685.5');
    t('1.192838736272799853174021036238e+21', '1192838736272799853174.021036238');
    t('1.145038e+3', '1145.038');
    t('4.0973786626728889384598402998014750474268e+9', '4097378662.6728889384598402998014750474268');
    t('5.5038104e+4', '55038.104');
    t('6.83895535917805849194871290958068199407518e+2', '683.895535917805849194871290958068199407518');
    t('6.277714976103425712837719e+22', '62777149761034257128377.1900');
    t('1.37376909692642287134486582232200547809845780076e+26', '137376909692642287134486582.232200547809845780076');
    t('7.0255659498942180908195e+16', '70255659498942180.908195');
    t('1.36758412477e+6', '1367584.12477');
    t('2.8993016541323392639291954727329719281958174e+23', '289930165413233926392919.54727329719281958174');
    t('5.39870374073212675286058196342904027304008232e+40', '53987037407321267528605819634290402730400.8232');
    t('6.4507160654825e+9', '6450716065.4825');
    t('1.21664e+3', '1216.64');
    t('7.2960499529336221198242592384915903149558006256202995e+17', '729604995293362211.98242592384915903149558006256202995');
    t('7.20020305957519743064e+3', '7200.203059575197430640');
    t('1.85115423780064073715032545790701546649748120114e+27', '1851154237800640737150325457.90701546649748120114');
    t('1.25021250836778893386687012660759710902e+21', '1250212508367788933866.87012660759710902');
    t('2.3323707491301665555664068537483355865980611e+25', '23323707491301665555664068.5374833558659806110');
    t('2.5088131581298507401113299236e+4', '25088.131581298507401113299236');
    t('9.612326850563943155774866e+17', '961232685056394315.5774866');
    t('1.54114517176248297154289225338049499367447824e+22', '15411451717624829715428.9225338049499367447824');
    t('4.04698305476309533783897e+21', '4046983054763095337838.97');
    t('2.620876536774240989563272117908814902188002596311e+24', '2620876536774240989563272.117908814902188002596311');
    t('1.7290754650750439926458970782158e+10', '17290754650.750439926458970782158');
    t('8.570789332248e+6', '8570789.332248');
    t('1.21e+1', '12.1');
    t('9.749134061639126502181192178140679940393318673720443e+45', '9749134061639126502181192178140679940393318673.720443');
    t('1.26878e+5', '126878.0');
    t('1.2391599841950849289559651456348e+9', '1239159984.1950849289559651456348');
    t('1.72220118427662724614289256133342842086e+22', '17222011842766272461428.9256133342842086');
    t('1.512063585971680294584184272035496e+15', '1512063585971680.294584184272035496');
  })
})

describe('Decimal.prototype.toExponential', () => {
  it('Decimal.js', () => {
    let rounding = RoundingMode.HalfUp

    function t(expected: string, n: any, dp?: any) {
      expect(make(n).toExponential({ fractionDigits: dp, rounding })).toEqual(expected)
    }
  
    t('1e+0', 1);
    t('1.1e+1', 11);
    t('1.12e+2', 112);
  
    t('1e+0', 1, 0);
    t('1e+1', 11, 0);
    t('1e+2', 112, 0);
    t('1.0e+0', 1, 1);
    t('1.1e+1', 11, 1);
    t('1.1e+2', 112, 1);
    t('1.00e+0', 1, 2);
    t('1.10e+1', 11, 2);
    t('1.12e+2', 112, 2);
    t('1.000e+0', 1, 3);
    t('1.100e+1', 11, 3);
    t('1.120e+2', 112, 3);
    t('1e-1', 0.1);
    t('1.1e-1', 0.11);
    t('1.12e-1', 0.112);
    t('1e-1', 0.1, 0);
    t('1e-1', 0.11, 0);
    t('1e-1', 0.112, 0);
    t('1.0e-1', 0.1, 1);
    t('1.1e-1', 0.11, 1);
    t('1.1e-1', 0.112, 1);
    t('1.00e-1', 0.1, 2);
    t('1.10e-1', 0.11, 2);
    t('1.12e-1', 0.112, 2);
    t('1.000e-1', 0.1, 3);
    t('1.100e-1', 0.11, 3);
    t('1.120e-1', 0.112, 3);
  
    t('-1e+0', -1);
    t('-1.1e+1', -11);
    t('-1.12e+2', -112);
    t('-1e+0', -1, 0);
    t('-1e+1', -11, 0);
    t('-1e+2', -112, 0);
    t('-1.0e+0', -1, 1);
    t('-1.1e+1', -11, 1);
    t('-1.1e+2', -112, 1);
    t('-1.00e+0', -1, 2);
    t('-1.10e+1', -11, 2);
    t('-1.12e+2', -112, 2);
    t('-1.000e+0', -1, 3);
    t('-1.100e+1', -11, 3);
    t('-1.120e+2', -112, 3);
    t('-1e-1', -0.1);
    t('-1.1e-1', -0.11);
    t('-1.12e-1', -0.112);
    t('-1e-1', -0.1, 0);
    t('-1e-1', -0.11, 0);
    t('-1e-1', -0.112, 0);
    t('-1.0e-1', -0.1, 1);
    t('-1.1e-1', -0.11, 1);
    t('-1.1e-1', -0.112, 1);
    t('-1.00e-1', -0.1, 2);
    t('-1.10e-1', -0.11, 2);
    t('-1.12e-1', -0.112, 2);
    t('-1.000e-1', -0.1, 3);
    t('-1.100e-1', -0.11, 3);
    t('-1.120e-1', -0.112, 3);
  
    t('NaN', NaN);
    t('NaN', -NaN, 2);
    t('Infinity', Infinity);
    t('Infinity', Infinity, 10);
    t('-Infinity', -Infinity, 0);
    t('-Infinity', -Infinity, 1);
    t('0e+0', 0);
    t('-0e+0', -0);
    t('-5.0e-1', -0.5, 1);
    t('0.00e+0', 0, 2);
    t('1e+1', 11.2356, 0);
    t('1.1236e+1', 11.2356, 4);
    t('1.1236e-4', 0.000112356, 4);
    t('-1.1236e-4', -0.000112356, 4);
    t('1.12356e-4', 0.000112356);
    t('-1.12356e-4', -0.000112356);
  
    t('1.00e+0', 0.99976, 2);
    t('1.00e+2', 99.9979, 2);
    t('1.00e+5', '99991.27839', 2);
    t('1.000e+2', '99.999', 3);
    t('1.000e+7', '9999512.8', 3);
    t('1.00e+9', '999702726', 2);
    t('1.000e+3', '999.964717', 3);


    rounding = 0;

  t('1e-8', '0.00000001');
  t('1.00000000001e+3', '1000.00000001');
  t('-5.3453435435e+8', '-53453.435435E4');
  t('-8.8254658100092746334967191957167916942544e+17', '-882546581000927463.34967191957167916942543286', 40);
  t('-4.794121828559674450610889008537305783490457e-9', '-0.00000000479412182855967445061088900853730578349045628396662493370334888944406719979291547717079', 42);
  t('3.6149e+33', '3614844933096444884855774574994631.0106397808', 4);
  t('5.582954000000000e-12', '0.000000000005582954', 15);
  t('-3.88740271991885914774802363151163005925700000000000000000e-24', '-0.000000000000000000000003887402719918859147748023631511630059257', 56);
  t('-6.87079645872437277236913190316306435274902613151676421e-20', '-0.00000000000000000006870796458724372772369131903163064352749026131516764202733298056929060151437', 53);
  t('3.8181874087278104533737313621586530711155405443818235503358935045749888900678e+35', '381818740872781045337373136215865307.11155405443818235503358935045749888900677769535371296063', 76);
  t('-7.11375441247784115059912118586189732891550e+20', '-711375441247784115059.91211858618973289154952986', 41);
  t('6.5783e+24', '6578282366667302135641813.7249573246362582', 4);
  t('6.000000000000000000000e-20', '0.00000000000000000006', 21);
  t('-5.3799672107777e+13', '-53799672107777', 13);
  t('-6.949e-23', '-0.00000000000000000000006948849870723', 3);
  t('-8.073585184316705309757817e+25', '-80735851843167053097578169.623098209399637950843019109979317', 24);
  t('-4.2956483e-12', '-0.0000000000042956482047751', 7);
  t('-6.1162155721951440801240154580459651167830311633e+15', '-6116215572195144.0801240154580459651167830311633', 46);
  t('-7.263265230767e-21', '-0.000000000000000000007263265230766073544739', 12);
  t('-2.3013406115701776345891815e+18', '-2301340611570177634.5891814408272260224632', 25);
  t('-6.0299793663e+30', '-6029979366232747481609455093247.705001183386474', 10);
  t('-2.97544304967e+21', '-2975443049668038511693.75547178021412', 11);
  t('-4.1471192639160032e+10', '-41471192639.1600315953295208128538183546', 16);
  t('-3.61201776785294987e+27', '-3612017767852949869824542721.1595027189', 17);
  t('-6.9983494044506115115e+17', '-699834940445061151.14676', 19);
  t('-1.4580700323629245038287e+20', '-145807003236292450382.86958174', 22);
  t('-8.54e+10', '-85390930743', 2);
  t('-2.715269856970717e+19', '-27152698569707163435', 15);
  t('-5.67681004e+20', '-567681003999187989540.627303416332508226276308449233', 8);
  t('-2.06809e+27', '-2068085084336615438842661921.06985539576218546524301', 5);
  t('-2.92273061370427012250925e+14', '-292273061370427.0122509240087955481845060858420928631', 23);
  t('-4.3355e-17', '-0.0000000000000000433542', 4);
  t('-3.491610942584e+21', '-3491610942583064798345', 12);
  t('-8.701944635985129980360621e+16', '-87019446359851299.8036062002728328', 24);
  t('-4.9e-10', '-0.000000000486409475991', 1);
  t('-4.82125e+19', '-48212433366063403866', 5);
  t('-7.95593941e-20', '-0.000000000000000000079559394098236', 8);
  t('-2.00563e-10', '-0.0000000002005622924388', 5);
  t('-6.9777057921142634382521825e+16', '-69777057921142634.3825218243275152606161149381', 25);
  t('-8.42591e+14', '-842590769172062', 5);
  t('-6.35123264409e+27', '-6351232644080754054285724566', 11);
  t('-5.508835492577586495894259979e-28', '-0.00000000000000000000000000055088354925775864958942599785412', 27);
  t('-2.667451876e+12', '-2667451875964', 9);
  t('-6.6444610474323616283e+26', '-664446104743236162820999716', 19);
  t('-2.419775049243e+12', '-2419775049242.726', 12);
  t('-5.32e-18', '-0.000000000000000005319', 2);
  t('-8.63030355223e-26', '-0.000000000000000000000000086303035522286938593814060049934', 11);
  t('-2.5046920981956385048538613818080285657602718e+17', '-250469209819563850.48538613818080285657602717018', 43);

  rounding = 1;

  t('-0e+0', '-0.0E-0');
  t('-2.856376815219143184897347685012382222462687620998915470135915e+6', '-2856376.815219143184897347685012382222462687620998915470135915511363444', 60);
  t('7.75700e-24', '0.000000000000000000000007757', 5);
  t('7.0e-1', '0.7', 1);
  t('5.2109749078977455423107465583658126e+37', '52109749078977455423107465583658126637', 34);
  t('3.631093819552528994444977110063007461579154042777868294000e-29', '0.00000000000000000000000000003631093819552528994444977110063007461579154042777868294', 57);
  t('-9.893937860425888e+8', '-989393786.042588804219191', 15);
  t('8.7978043622607467e+42', '8797804362260746751563912625017414439944006.5804807', 16);
  t('-4.6561702764394602621e-7', '-0.000000465617027643946026213823955447791862428108248596086901464075785390015', 19);
  t('-2.542770482242902215596924884302407e+8', '-254277048.224290221559692488430240765024783', 33);
  t('2.70000000e-8', '0.000000027', 8);
  t('-8.0291821891769794408790934252924453237e+16', '-80291821891769794.408790934252924453237503615825249362166', 37);
  t('-8.05295923004057358545854771e-16', '-0.0000000000000008052959230040573585458547716514262', 26);
  t('-2.786758e-21', '-0.00000000000000000000278675879025858093817787290334306', 6);
  t('-8.0160835624737225803853824687641777660406527e+20', '-801608356247372258038.538246876417776604065270622886204812876', 43);
  t('-7.2849054887999144694619191770897589e+27', '-7284905488799914469461919177.08975892527524', 34);
  t('-7.586e-17', '-0.00000000000000007586908', 3);
  t('-5.9508150933636580674249602941673984254864e+20', '-595081509336365806742.496029416739842548642249', 40);
  t('-3.526911897e-18', '-0.000000000000000003526911897770082481187', 9);
  t('-5.774e-22', '-0.0000000000000000000005774729035676859', 3);
  t('-6.4700957007714124190210074e-13', '-0.00000000000064700957007714124190210074383', 25);
  t('-5.610492e+21', '-5610492566512449795573', 6);
  t('-6.015e+23', '-601556443593022914280678', 3);
  t('-6.0673361553344e+11', '-606733615533.448288878', 13);
  t('-3.1e+26', '-315617199368461055533962323.071668327669249', 1);
  t('-9.1391079512104562032343e+24', '-9139107951210456203234346', 22);
  t('-2.0441e+21', '-2044198307917443182711', 4);
  t('-8.21283723216249535240085606500821783973097233e+23', '-821283723216249535240085.606500821783973097233814324', 44);
  t('-6.375e+14', '-637540984314799.4', 3);
  t('-2.17797482005219478530856429744726e+29', '-217797482005219478530856429744.7268928676963181', 32);
  t('-3.9547e+11', '-395476721391', 4);
  t('-6.8927e+21', '-6892798573971046301111', 4);
  t('-6.33842141402916538926e-12', '-0.000000000006338421414029165389261335065112712777', 20);
  t('-4.5727e-30', '-0.000000000000000000000000000004572725511159166', 4);
  t('-7.8847457779026882221249217577974e-17', '-0.000000000000000078847457779026882221249217577974', 31);
  t('-2.64916231640264927e+12', '-2649162316402.649271824', 17);
  t('-1.73604404e+28', '-17360440496948254515028685124.37795415803082546457797184294', 8);
  t('-8.680224985623e+16', '-86802249856236148.11694273469092873', 12);
  t('-4.3e-19', '-0.00000000000000000043859841576346037715462713764211635', 1);
  t('-7.68867535389098159141717105e-11', '-0.000000000076886753538909815914171710501337139', 26);
  t('-5.24325038611090505928389422325001606e+21', '-5243250386110905059283.894223250016067979080420266', 35);
  t('-1.38e-21', '-0.0000000000000000000013874592057586367688528204069850262406', 2);
  t('-7.308601949094508589445770582074109410615037e+24', '-7308601949094508589445770.5820741094106150373221910779', 42);
  t('-3.2638e+13', '-32638405387645.3309565877781780222317335852159983', 4);
  t('-3.55454737448094719019291183206515059962378e+22', '-35545473744809471901929.118320651505996237856336054914', 41);
  t('-5.3906242252792e-11', '-0.00000000005390624225279268530907215395611', 13);
  t('-8.86760873811213105078e+15', '-8867608738112131.050787', 20);
  t('-4.78129254835567e-23', '-0.00000000000000000000004781292548355671480462711435866243551', 14);
  t('-6.4694208834502691835879021438795583630205e-19', '-0.00000000000000000064694208834502691835879021438795583630205', 40);

  rounding = 2;

  t('0e+0', '0E0000000000');
  t('-0e+0', '-0E01');
  t('-0.00e+0', '-0E00000000001', 2);
  t('3.0465655253692145345165166442116e-14', '0.0000000000000304656552536921453451651664421156', 31);
  t('9.0573943842008592406279608542923313381394286641978907203396551e+22', '90573943842008592406279.60854292331338139428664197890720339655043720040907662489784', 61);
  t('-1.17181502970008783734855040984899000e-1', '-0.117181502970008783734855040984899', 35);
  t('-5.28860565e-16', '-0.00000000000000052886056528317233012115396784629214632', 8);
  t('6.4114675970838738000e-18', '0.0000000000000000064114675970838738', 19);
  t('8.00000000000000000000e-20', '0.00000000000000000008', 20);
  t('2.74000064578288771723078597711103520450391668117802304078152085625023633681179e+24', '2740000645782887717230785.977111035204503916681178023040781520856250236336811781347278', 77);
  t('8.1936742669491704846805837777816457628e-16', '0.00000000000000081936742669491704846805837777816457628', 37);
  t('-7.2157448e+14', '-721574484716710.00141299844961546', 7);
  t('-5.321807464703650000000e-15', '-0.00000000000000532180746470365', 21);
  t('-4.449e+27', '-4449471658582621135143349142.228707647170080816912435271162', 3);
  t('-4.922915821313919623758e+19', '-49229158213139196237.584', 21);
  t('-6.996668225774098e-14', '-0.000000000000069966682257740984029052', 15);
  t('-8.6856039174822133942616012424795168e+11', '-868560391748.2213394261601242479516861829472792', 34);
  t('-8.461e+21', '-8461810373307862460504', 3);
  t('-3.898716627703194625824411967e+25', '-38987166277031946258244119.67718', 27);
  t('-2.821935496755e+26', '-282193549675582402670759843.23655', 12);
  t('-3.49e-22', '-0.0000000000000000000003491662482987', 2);
  t('-3.362111778576231615366457333e-14', '-0.0000000000000336211177857623161536645733316587527475522615', 27);
  t('-5.9933e-13', '-0.00000000000059933412636903331', 4);
  t('-2.77927721e+29', '-277927721100404435781172100113.4136636412460458083951', 8);
  t('-1.876833722329e-10', '-0.0000000001876833722329987477942', 12);
  t('-6.5e+14', '-653341175209856', 1);
  t('-8.627291840173867961e+14', '-862729184017386.7961', 18);
  t('-3.9137457165597668391301218029e-11', '-0.00000000003913745716559766839130121802935022889', 28);
  t('-8.95e+10', '-89532775488', 2);
  t('-2.1395541875015568986238e-17', '-0.000000000000000021395541875015568986238771696', 22);
  t('-4.98575853353890809143399546448630559732119628e-12', '-0.00000000000498575853353890809143399546448630559732119628509', 44);
  t('-8.99e+16', '-89989591559494822', 2);
  t('-3.49346327e+22', '-34934632714180035424463', 8);
  t('-3.5699537605753905457597e-14', '-0.00000000000003569953760575390545759785014980652333323889116', 22);
  t('-2.9892536880349975618286e+12', '-2989253688034.9975618286212199904979534461637613', 22);
  t('-3.04383919217904949618e+10', '-30438391921.790494961888803732171', 20);
  t('-8.232411544e+17', '-823241154405701456', 9);
  t('-5.809151226990464016815e-16', '-0.00000000000000058091512269904640168152354', 21);
  t('-8.522042397326932431e+13', '-85220423973269.324312660179132118', 18);
  t('-7.5210942e-22', '-0.000000000000000000000752109428925015', 7);
  t('-5.2018321449543e+23', '-520183214495439298725191.09', 13);
  t('-6.04084045453711395629268198016245611021901815e+21', '-6040840454537113956292.68198016245611021901815486929628647', 44);
  t('-1.495478178996755138125934544343674798e-13', '-0.00000000000014954781789967551381259345443436747983317353423', 36);
  t('-6.881484497510733524151245220630282259985306546537e+16', '-68814844975107335.241512452206302822599853065465371507616758', 48);
  t('-4.7121389019956e-14', '-0.00000000000004712138901995619', 13);

  rounding = 3;

  t('-9.99999999000000009e+8', '-999999999.000000009e-0');
  t('-3.99764422903251220452704763278376060858663250289320247532595e+24', '-3997644229032512204527047.63278376060858663250289320247532594416986984981431156065660613', 59);
  t('5.534083545686157907280686578717428772e+12', '5534083545686.157907280686578717428772', 36);
  t('5.00000000e-9', '0.000000005', 8);
  t('-4.08363116583051e+14', '-408363116583051', 14);
  t('9.278230415634296945273818e+19', '92782304156342969452.738186255580532649103987374718221928871873054827841260470670536425', 24);
  t('-1.08732508998603085454662e-12', '-0.000000000001087325089986030854546619968259691229662152159029641023997866843605032534351388775075', 23);
  t('3.5288804517377606688698e+32', '352888045173776066886981811418233.218955856086', 22);
  t('4.32188781438877554e+16', '43218878143887755.42593887518334667202', 17);
  t('-8.15e+2', '-815', 2);
  t('1.515077312590223222678749527e+18', '1515077312590223222.678749527895871363186918977679783240817218232896076765321818445939718165', 27);
  t('-8.0538186421664536509917032729912932814374102e+20', '-805381864216645365099.17032729912932814374101821', 43);
  t('-3.4367097301002099047381e+14', '-343670973010020.990473804391071456587732173', 22);
  t('-5.3421e-12', '-0.0000000000053420288504', 4);
  t('-2.6320052e+23', '-263200517731973006983184.60341959097016190770542276', 7);
  t('-4.5e-11', '-0.000000000044673422483', 1);
  t('-7.232463101115829118145025733451801e-17', '-0.00000000000000007232463101115829118145025733451800457178', 33);
  t('-1.18320100044154762448545914170978206041022039e+22', '-11832010004415476244854.5914170978206041022038489', 44);
  t('-7.745237371276392645711e+21', '-7745237371276392645710.0521930569226728841707200771', 21);
  t('-4.431559500053255695643e-10', '-0.000000000443155950005325569564213010993378905', 21);
  t('-2.5e-24', '-0.000000000000000000000002443', 1);
  t('-5.005027028439023958391203127005503621542e-11', '-0.0000000000500502702843902395839120312700550362154137', 39);
  t('-6.453525377934213334367e-22', '-0.00000000000000000000064535253779342133343665123283565', 21);
  t('-4.5594370326121718626850982373529e+13', '-45594370326121.71862685098237352845979966987', 31);
  t('-1.709e+16', '-17088248121660259', 3);
  t('-3.9047581533864713e+16', '-39047581533864712.6574405', 16);
  t('-2.08804202e-17', '-0.000000000000000020880420127397564274443250271135', 8);
  t('-6.801694635944774655689008216925036e+15', '-6801694635944774.65568900821692503508025', 33);
  t('-8.7691286374104240967931800593734e+19', '-87691286374104240967.93180059373367907299683816381677816389', 31);
  t('-2.802257731715238453e-29', '-0.000000000000000000000000000028022577317152384526775320012', 18);
  t('-4.4705e+22', '-44704405768781565005877.813010169083', 4);
  t('-4.17374908496486449232e-10', '-0.00000000041737490849648644923105632500267064', 20);
  t('-2.2707e-10', '-0.00000000022706134122862417334386435', 4);
  t('-2.85432e-24', '-0.0000000000000000000000028543100839983854161', 5);
  t('-5.79188949e+12', '-5791889489461.643555240257', 8);
  t('-7.46e+15', '-7459701910718662.03421293892346992893463534702', 2);
  t('-1.0535086280629e+25', '-10535086280628995915087428.2423609320023833125322801559606', 13);
  t('-2.9074412651647188367106e+30', '-2907441265164718836710598468491.31550321772', 22);
  t('-5.010945976711327691649e+27', '-5010945976711327691648509517.2305', 21);
  t('-8.8633960213386533e-20', '-0.0000000000000000000886339602133865324283362544', 16);
  t('-3.1891844834898211661452730714015664837805e+19', '-31891844834898211661.45273071401566483780434051217', 40);
  t('-5.083380976014365533843229882526437e+28', '-50833809760143655338432298825.264367948359', 33);
  t('-6.8e-16', '-0.000000000000000678534987604148025611184', 1);
  t('-7.9e+30', '-7838656097386639584904346062976.9346038436', 1);
  t('-6.30535781e+20', '-630535780834495012856', 8);
  t('-9.663e-30', '-0.00000000000000000000000000000966289400023904753107633012', 3);
  t('-2.315198482309e+12', '-2315198482308.7361348', 12);
  t('-8.158235289416e+18', '-8158235289415958939', 12);
  t('-4.1618890517404316933699206360639988582832624525e+23', '-416188905174043169336992.063606399885828326245241437', 46);
  t('-5.97550716981833990839441709632e+21', '-5975507169818339908394.41709631281058258352209', 29);
  t('-6.3372e-18', '-0.000000000000000006337122571683959413228', 4);
  t('-8.9189088e+18', '-8918908714500548003.38400978696756078013348', 7);

  rounding = 4;

  t('-5.002239116605888927178702930656e-39', '-0.00000000000000000000000000000000000000500223911660588892717870293065633642', 30);
  t('-8.52292947230244775435e+29', '-852292947230244775434968241532.494643593912804433318745222587246680109833509655450267792446', 20);
  t('-6.1169514510867e+10', '-61169514510.8673382', 13);
  t('-8.05745763527307676170759722175169266017831695215e+48', '-8057457635273076761707597221751692660178316952146', 47);
  t('-4.923572102098e+10', '-49235721020.9847017846898652687600227388412980598816', 12);
  t('-7.981341661715027117746906076515945e+41', '-798134166171502711774690607651594491039629', 33);
  t('-8.00e-3', '-0.008', 2);
  t('8.517466793430899278197016892000000000000e-15', '0.000000000000008517466793430899278197016892', 39);
  t('-3.032293512e+0', '-3.0322935124071923328711934463341802038', 9);
  t('-2.60682904403489305678908771323995810138267385200000000e-20', '-0.00000000000000000002606829044034893056789087713239958101382673852', 53);
  t('-3.935816927273980e+20', '-393581692727398036652.850960055902271', 15);
  t('-8.5902152501051e+29', '-859021525010507210136559039003.689834129033952321238', 13);
  t('-7.24491e-30', '-0.00000000000000000000000000000724490826045045451271534', 5);
  t('-8.4948070285349193974989221504919380656715136165603325e+24', '-8494807028534919397498922.15049193806567151361656033246', 52);
  t('-6.3295239596e-17', '-0.00000000000000006329523959626011114164', 10);
  t('-3.1725692353e+30', '-3172569235260846783669130724638.711', 10);
  t('-4.065727077e+11', '-406572707673.336570352310681187663765', 9);
  t('-6.82883869249998075574247223155497e+18', '-6828838692499980755.7424722315549682855987375899188309581152', 32);
  t('-2.56144400427045214943786338e+24', '-2561444004270452149437863.38354535663028539', 26);
  t('-4.97637439956044400125498868e+23', '-497637439956044400125498.8682100590602459937304614141772', 26);
  t('-4.307891929198702822746534506143e+29', '-430789192919870282274653450614.349564081', 30);
  t('-8.55e-27', '-0.00000000000000000000000000855367295711812079', 2);
  t('-7.906e+11', '-790612526329.410459220189562', 3);
  t('-3.1841363e-22', '-0.00000000000000000000031841363', 7);
  t('-6.2068049304845006e+20', '-620680493048450055389.3227069760888437941041', 16);
  t('-8.4809476e+18', '-8480947614295114807.320148688', 7);
  t('-2.287988570734255855e+23', '-228798857073425585542366.399034916953775', 18);
  t('-8.148647139762925073276164486240320698e+21', '-8148647139762925073276.1644862403206980851079', 36);
  t('-6.87643138785664756e-12', '-0.0000000000068764313878566475604352570287089535238582267443', 17);
  t('-3.709587e+18', '-3709586618852569033.55141868', 6);
  t('-6.8086794224e+28', '-68086794224433270564431694468.814537646575833889824621540849', 10);
  t('-4.966301085179e+19', '-49663010851788946007', 12);
  t('-5.34439184068052811184219234494114e+26', '-534439184068052811184219234.494113670484623394', 32);
  t('-2.798732412e+16', '-27987324119455299', 9);
  t('-1.554430791885961957e+15', '-1554430791885961.956863404519493346081223', 18);
  t('-6.90619083822075003978e+24', '-6906190838220750039778836.289105048686876596', 20);
  t('-1.108034176809770578315e+12', '-1108034176809.7705783154', 21);
  t('-1.43e+22', '-14266566332440117777110.63461224926682073525873105', 2);
  t('-9.15e+13', '-91477543307040.916791223', 2);
  t('-1.1001e+26', '-110010856476508992391958436.9355559264588205214557001854', 4);
  t('-1.2e+16', '-12148027447349021', 1);
  t('-4.4e+13', '-44268551660889.40880208546489742632181832780494', 1);
  t('-8.62058920338555484081691e+19', '-86205892033855548408.169086865949596390775', 23);
  t('-5.2e-13', '-0.00000000000051876025261394172', 1);
  t('-4.88063953404884862027221562057786242658496407473e-11', '-0.0000000000488063953404884862027221562057786242658496407473', 47);
  t('-5.255e+18', '-5254530327311322805.9528217', 3);
  t('-6.4630488003995117e-11', '-0.0000000000646304880039951167486', 16);
  t('-8.638990742871e-16', '-0.0000000000000008638990742870608', 12);
  t('-1.57817750020560815944470062e+12', '-1578177500205.60815944470062002898187', 26);
  t('-3.6558384593093900422637e-27', '-0.00000000000000000000000000365583845930939004226367940618', 22);

  rounding = 5;

  t('4.95474614815842e+38', '495474614815842191683004449862568813538.573064401156', 14);
  t('-8.9667567079038139e+16', '-89667567079038139', 16);
  t('-7.0e+2', '-703', 1);
  t('-2.6249e+33', '-2624861185343559570287214983819906', 4);
  t('-6.510119186347371697501169416839709631422185436811698613000000000000000000000000000000e-31', '-0.0000000000000000000000000000006510119186347371697501169416839709631422185436811698613', 84);
  t('7.73e+3', '7729', 2);
  t('1.4393781011009257793117531801549e+4', '14393.781011009257793117531801548751', 31);
  t('8.4e+6', '8404542', 1);
  t('8.471284625267663009248667391059202502589207637435209861233007389000000000000000e-35', '0.00000000000000000000000000000000008471284625267663009248667391059202502589207637435209861233007389', 78);
  t('-5.26079297227015e+31', '-52607929722701509263909039511536.9266822991', 14);
  t('-4.63550600857003551411914120562163394e+15', '-4635506008570035.51411914120562163394396594237358863897062', 35);
  t('-7.8219563406482338767189100434751303552919130625101491e+27', '-7821956340648233876718910043.4751303552919130625101491', 52);
  t('-6.977184098e+17', '-697718409782854734', 9);
  t('-8.1e+15', '-8092701222454628.9934935902179330839653799891168', 1);
  t('-3.872944373744596915691884729973e+15', '-3872944373744596.91569188472997336351132980366520033057011287', 30);
  t('-1.389676e+11', '-138967565295.146055555208419143848718279114979831585', 6);
  t('-2.218316993130903882223e+19', '-22183169931309038822.22612', 21);
  t('-3.370809304e-25', '-0.000000000000000000000000337080930401566', 9);
  t('-6.1503e+19', '-61503417721509415792.24703', 4);
  t('-3.13657134e-22', '-0.00000000000000000000031365713378439345', 8);
  t('-1.9e-10', '-0.000000000187981', 1);
  t('-2.596508353714425677970049724e+28', '-25965083537144256779700497237.5841327343962292316215149169', 27);
  t('-4.151454545748277604112308101174917062e+11', '-415145454574.827760411230810117491706171981266892178', 36);
  t('-1.3e-18', '-0.000000000000000001319061308619561567664259803361817', 1);
  t('-1.5294854487046553159e+24', '-1529485448704655315921667', 19);
  t('-1.9365487654708143765583400538310103350799e-13', '-0.000000000000193654876547081437655834005383101033507988', 40);
  t('-3.88128259276357427027515474e+25', '-38812825927635742702751547.353', 26);
  t('-5.64525474904155517374289736218e-11', '-0.00000000005645254749041555173742897362182099811344', 29);
  t('-8.94963385755006409131430087734467745e+22', '-89496338575500640913143.0087734467744538', 35);
  t('-3.7551731901764025e+17', '-375517319017640249', 16);
  t('-7.601921e-16', '-0.00000000000000076019214974360137746140339586742455753', 6);
  t('-6.93501087055e+20', '-693501087055377288564', 11);
  t('-1.283656440009563e+24', '-1283656440009563292695670.575360580373829197017512', 15);
  t('-4.9556506e+13', '-49556505932168.7211084603', 7);
  t('-8.133584588946e+26', '-813358458894586332533196788.490201803951456991010654609646', 12);
  t('-3.824207296e+22', '-38242072955850210158724', 9);
  t('-4.2168087e-12', '-0.00000000000421680868317080291', 7);
  t('-7.152812829e+15', '-7152812829336253.782723153403637377960530795', 9);
  t('-8.0469635248612874571e+16', '-80469635248612874.5712104436', 19);
  t('-2.726549954018643349550392804e+11', '-272654995401.8643349550392803783934819148125595437353472547', 27);
  t('-2.477986360297097033217143e+30', '-2477986360297097033217143442370.539404', 24);
  t('-2.7620555408e+15', '-2762055540757162', 10);
  t('-5.044e+10', '-50436788962', 3);
  t('-1.51176171306898543927009427965761639e+17', '-151176171306898543.9270094279657616389483779413616294465635', 35);
  t('-1.77876313221062362e+17', '-177876313221062362.01', 17);
  t('-4.28033364715744300662536e+13', '-42803336471574.430066253616', 23);
  t('-6.053e-13', '-0.00000000000060527568964627046163209582', 3);
  t('-3.9447068214322315685949701607748761e+16', '-39447068214322315.685949701607748760885392781169754754427622', 34);
  t('-4.76203665586552028e+15', '-4762036655865520.285', 17);
  t('-7.442141482296791204320219247230530359e+24', '-7442141482296791204320219.2472305303585223494415', 36);

  rounding = 6;

  t('-4.3502707501164e+36', '-4350270750116411997402439304498892819', 13);
  t('9.5e-21', '0.0000000000000000000094520280724178734152', 1);
  t('1.39631186750554172785676012693418617250072200744214625994656047727270672248243741907e+34', '13963118675055417278567601269341861.725007220074421462599465604772727067224824374190703237660781', 83);
  t('5.9446570e-26', '0.00000000000000000000000005944657036540768164877637239177740419063920648', 7);
  t('7.00000e-12', '0.000000000007', 5);
  t('-2.87e+14', '-287060740776209.3950381715', 2);
  t('3.411740542875509329e+24', '3411740542875509328514044', 18);
  t('-6.20235112738687046118395830000000000000000000000e-29', '-0.000000000000000000000000000062023511273868704611839583', 47);
  t('2.94349130121570276626863135396717336528655493e+19', '29434913012157027662.686313539671733652865549279174', 44);
  t('4.01255076512828067130306533670644537832e-10', '0.000000000401255076512828067130306533670644537831678294548', 38);
  t('-5.4277306444432e+11', '-542773064444.317654960431120452254700391693837992', 13);
  t('-4.355706886680889557797360814402e+30', '-4355706886680889557797360814401.536556745674646509159280626', 30);
  t('-1.29e-15', '-0.00000000000000128978312277001609181774216296380783932', 2);
  t('-1.0588973816292989769e+25', '-10588973816292989768709129.1767038708798755780352204', 19);
  t('-3.210569596e+10', '-32105695962.8803639621', 9);
  t('-7.18504270173744681360682714959e+28', '-71850427017374468136068271495.87', 29);
  t('-4.615682142828269066227773895179987062919e+20', '-461568214282826906622.7773895179987062919071922', 39);
  t('-1.3864477517287155526073e+13', '-13864477517287.15552607265', 22);
  t('-6.793120028e+13', '-67931200280922.72252141789646787475433427482', 9);
  t('-8.075e-18', '-0.000000000000000008074975073002274636799975', 3);
  t('-8.360228691054180854419062530687032074820667001e+24', '-8360228691054180854419062.530687032074820667001120752628', 45);
  t('-3.0763956760417194035216e-12', '-0.000000000003076395676041719403521594', 22);
  t('-2.5288383e+25', '-25288383009460922631988717.84659997837058450749', 7);
  t('-4.554185192e+29', '-455418519247311560996997520087.98189', 9);
  t('-9.135175372324138467397264e+11', '-913517537232.413846739726417', 24);
  t('-8.257259383044471855222900534859251889332388855848e-10', '-0.0000000008257259383044471855222900534859251889332388855848', 48);
  t('-7.651597268450922707e-13', '-0.000000000000765159726845092270720405167100094', 18);
  t('-8.952011763950994514e+26', '-895201176395099451377549961.34870447', 18);
  t('-2.7395479569618982298152060567357e-10', '-0.00000000027395479569618982298152060567357', 31);
  t('-1.31151451700453378841431e+24', '-1311514517004533788414313', 23);
  t('-5.915297930316863891e-10', '-0.0000000005915297930316863890707686339684395', 18);
  t('-1.449e-27', '-0.0000000000000000000000000014487033279693402845128265141859', 3);
  t('-3.7e+10', '-36919550406.826974442743517918128', 1);
  t('-3.945347688940382499631779106638865e+13', '-39453476889403.824996317791066388653', 33);
  t('-8.547704e-29', '-0.0000000000000000000000000000854770378842608635356', 6);
  t('-3.76e+25', '-37618296325402619735777629.467812385256281737441412', 2);
  t('-8.031066086398624e+28', '-80310660863986235667567286452', 15);
  t('-4.038276256088135496e-17', '-0.000000000000000040382762560881354955896694823328777602811', 18);
  t('-1.77173574740860868e+25', '-17717357474086086837250852', 17);
  t('-1.421967649e+21', '-1421967648805122645888', 9);
  t('-4.7e+11', '-469485715327', 1);
  t('-7.372223291560455075681748682810527006883e+16', '-73722232915604550.75681748682810527006882666313809409', 39);
  t('-8.9539396357e+14', '-895393963565598', 10);
  t('-8.14646103854802172250414801405e+10', '-81464610385.48021722504148014045579178726', 29);
  t('-1.2053415734425581e+12', '-1205341573442.5581371841633131879', 16);
  t('-8.35214176861046133596101313170854966756043001e+28', '-83521417686104613359610131317.0854966756043001041619492', 44);

  rounding = 4;

  t('-2.033619450856645241153977e+0', '-2.03361945085664524115397653636144859', 24);
  t('1.130e+8', '112955590.0430616', 3);
  t('-2.1366468193419876852426155614364269e+10', '-21366468193.419876852426155614364269', 34);
  t('5.82086615659566151529e+7', '58208661.56595661515285734890860077163', 20);
  t('9.1615809372817426111208e+6', '9161580.937281742611120838868847823478250167882379624', 22);
  t('3.8976506901061164197e+1', '38.97650690106116419699490320634490920742414', 19);
  t('9.0994914931570087194607344641722310104e+6', '9099491.4931570087194607344641722310103895224905', 37);
  t('6.06e+5', '605633', 2);
  t('2.6999974790473705518992117e+1', '26.9999747904737055189921170044987', 25);
  t('6.7108801361722e+6', '6710880.136172156342982663450743452', 13);
  t('-8.0e+0', '-8', 1);
  t('3.000e-2', '0.03', 3);
  t('-4.7e+2', '-469', 1);
  t('-6.3000e+0', '-6.3', 4);
  t('-5.4e+2', '-542', 1);
  t('-5.2000e+0', '-5.2', 4);
  t('-9.00000e-2', '-0.09', 5);
  t('-3.1000e-1', '-0.31', 4);
  t('-4.4e+2', '-436', 1);
  t('-3.00e+0', '-3', 2);
  t('-5.00e-2', '-0.05', 2);
  t('1.00e-2', '0.01', 2);


  t('1.23e+2', '123');
  t('1e+2', '123', 0);
  t('1e+2', '123', -0);

  })
})

describe('Decimal.prototype.toNumber()', () => {
  it('toNumber(NaN)', () => {
    expect(make(NaN).toNumber()).toEqual(NaN)
  })

  it('toNumber(Infinity)', () => {
    expect(make(Infinity).toNumber()).toEqual(Infinity)
    expect(make(-Infinity).toNumber()).toEqual(-Infinity)
  })

  it('toNumber(Int)', () => {
    expect(make('0').toNumber()).toEqual(0)
    expect(make('-0').toNumber()).toEqual(-0)
    expect(make('1').toNumber()).toEqual(1)
    expect(make('10').toNumber()).toEqual(10)
    expect(make('110').toNumber()).toEqual(110)
    expect(make('-1').toNumber()).toEqual(-1)
    expect(make('-10').toNumber()).toEqual(-10)
    expect(make('-110').toNumber()).toEqual(-110)
  })

  it('toNumber(Float)', () => {
    expect(make('0.1').toNumber()).toEqual(0.1)
    expect(make('0.01').toNumber()).toEqual(0.01)
    expect(make('1.1').toNumber()).toEqual(1.1)
  })
})
