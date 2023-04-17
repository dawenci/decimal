import { make, make2 } from '../../src/core/make'
import { RoundingMode } from '../../src/core/decimal'

describe('make', () => {
  it('default', () => {
    expect(make().toString()).toEqual('0')
    expect(make(undefined).toString()).toEqual('0')
    expect(make(null).toString()).toEqual('0')
  })

  it('.<n>', () => {
    expect(make('.1').toString()).toEqual('0.1')
  })

  it('<n>.<n>.<n>', () => {
    expect(make('1.1.1').toString()).toEqual('NaN')
  })

  it('e<n>e', () => {
    expect(make('1e1e').toString()).toEqual('10')
  })

  it('<n>e+-<NaN>', () => {
    expect(make('1e?').toString()).toEqual('NaN')
    expect(make('1e+?').toString()).toEqual('NaN')
    expect(make('1e-?').toString()).toEqual('NaN')
  })

  it('0<n>', () => {
    expect(make('00').toString()).toEqual('0')
    expect(make('000').toString()).toEqual('0')
    expect(make('01').toString()).toEqual('1')
    expect(make('001').toString()).toEqual('1')

    expect(make('00e1').toString()).toEqual('0')
    expect(make('00e?').toString()).toEqual('NaN')

    expect(make('001e1').toString()).toEqual('10')
    expect(make('001e?').toString()).toEqual('NaN')
  })

  it('make(Num)', () => {
    const n = make(1)
    expect(make(n)).toEqual(n)
  })

  it('make2', () => {
    expect(make2([], 1, 0).toString()).toEqual('0')
    expect(make2([0], 1, 0).toString()).toEqual('0')
    expect(make2([0, 0], 1, 0).toString()).toEqual('0')
  })
})

describe('Num::clone()', () => {
  it('clone', () => {
    expect(make('').clone().toString()).toEqual('NaN')
  })
})

describe('Num::isNaN()', () => {
  it('isNaN', () => {
    expect(make('').isNaN()).toEqual(true)
  })
})

describe('Num::isInfinity()', () => {
  it('isInfinity', () => {
    expect(make('infinity').isInfinity()).toEqual(true)
  })
})

describe('Num::isNeg()', () => {
  it('isNeg', () => {
    expect(make(-Infinity).isNeg()).toEqual(true)
    expect(make('-Infinity').isNeg()).toEqual(true)
    expect(make(-0).isNeg()).toEqual(true)
    expect(make('-0').isNeg()).toEqual(true)
  })
})

describe('Num::isZero()', () => {
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

describe('Num::isOne()', () => {
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

describe('Num::isInt()', () => {
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

describe('Num::isSafeInt()', () => {
  it('Num::isSafeInt', () => {
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

describe('Num::getDecimalPlaces()', () => {
  it('getDecimalPlaces', () => {
    expect(make('0').getDecimalPlaces()).toEqual(0)
    expect(make('-0').getDecimalPlaces()).toEqual(0)
    expect(make('1').getDecimalPlaces()).toEqual(0)
    expect(make('-1').getDecimalPlaces()).toEqual(0)
    expect(make('10').getDecimalPlaces()).toEqual(0)
    expect(make('-10').getDecimalPlaces()).toEqual(0)
    expect(make(Number.MAX_SAFE_INTEGER.toString() + '1').getDecimalPlaces()).toEqual(0)
    expect(make('0.1').getDecimalPlaces()).toEqual(1)
    expect(make('1.1').getDecimalPlaces()).toEqual(1)
    expect(make('0.10').getDecimalPlaces()).toEqual(1)
    expect(make('0.01').getDecimalPlaces()).toEqual(2)
    expect(make('0.010').getDecimalPlaces()).toEqual(2)
  })
})

describe('Num::getIntegerCount()', () => {
  it('getIntegerCount', () => {
    expect(make('0').getIntegerCount()).toEqual(1)
    expect(make('-0').getIntegerCount()).toEqual(1)
    expect(make('1').getIntegerCount()).toEqual(1)
    expect(make('-1').getIntegerCount()).toEqual(1)
    expect(make('0.1').getIntegerCount()).toEqual(1)
    expect(make('1.1').getIntegerCount()).toEqual(1)
    expect(make('0.10').getIntegerCount()).toEqual(1)
    expect(make('0.01').getIntegerCount()).toEqual(1)
    expect(make('0.010').getIntegerCount()).toEqual(1)
    expect(make('10').getIntegerCount()).toEqual(2)
    expect(make('-10').getIntegerCount()).toEqual(2)
    expect(make('10.01').getIntegerCount()).toEqual(2)
    expect(make('-10.01').getIntegerCount()).toEqual(2)
    expect(make(Number.MAX_SAFE_INTEGER.toString() + '1').getIntegerCount()).toEqual(17)
  })
})

describe('Num::get(index)', () => {
  it('123.456', () => {
    const n = make('123.456')
    expect(n.get(0)).toEqual(3)
    expect(n.get(1)).toEqual(2)
    expect(n.get(2)).toEqual(1)
    expect(n.get(3)).toEqual(0)
    expect(n.get(-1)).toEqual(4)
    expect(n.get(-2)).toEqual(5)
    expect(n.get(-3)).toEqual(6)
    expect(n.get(-4)).toEqual(0)
  })
})

describe('Num::getNums() & Num::getDotPosition()', () => {
  it('00 -> nums:[0], dot:1', () => {
    expect(make('00').toArray()).toEqual([0])
    expect(make('00').getPoint()).toEqual(1)
  })

  it('0.0 -> nums:[0], dot:1', () => {
    expect(make('0.0').toArray()).toEqual([0])
    expect(make('0.0').getPoint()).toEqual(1)
  })

  it('00.0 -> nums:[0], dot:1', () => {
    expect(make('00.0').toArray()).toEqual([0])
    expect(make('00.0').getPoint()).toEqual(1)
  })

  it('0.00 -> nums:[0], dot: 1', () => {
    expect(make('0.00').toArray()).toEqual([0])
    expect(make('0.00').getPoint()).toEqual(1)
  })

  it('0eN -> nums:[0], dot: 1', () => {
    expect(make('0e0').toArray()).toEqual([0])
    expect(make('0e0').getPoint()).toEqual(1)
    expect(make('0e1').toArray()).toEqual([0])
    expect(make('0e1').getPoint()).toEqual(1)
    expect(make('0e+1').toArray()).toEqual([0])
    expect(make('0e+1').getPoint()).toEqual(1)
    expect(make('0e-1').toArray()).toEqual([0])
    expect(make('0e-1').getPoint()).toEqual(1)
  })

  it('01 -> nums:[1], dot:1', () => {
    expect(make('01').toArray()).toEqual([1])
    expect(make('01').getPoint()).toEqual(1)
  })

  it('001 -> nums:[1], dot:1', () => {
    expect(make('001').toArray()).toEqual([1])
    expect(make('001').getPoint()).toEqual(1)
  })

  it('10 -> nums[1,0], dot:2', () => {
    expect(make('10').toArray()).toEqual([1, 0])
    expect(make('10').getPoint()).toEqual(2)
  })

  it('0.1 -> nums:[0,1], dot:0', () => {
    expect(make('00.1').toArray()).toEqual([0, 1])
    expect(make('00.1').getPoint()).toEqual(0)
  })

  it('00.1 -> nums:[0,1], dot:0', () => {
    expect(make('00.1').toArray()).toEqual([0, 1])
    expect(make('00.1').getPoint()).toEqual(0)
  })

  it('0.01 -> nums:[0,0,1], dot:-1', () => {
    expect(make('0.01').toArray()).toEqual([0, 0, 1])
    expect(make('0.01').getPoint()).toEqual(-1)
  })

  it('1.1 -> nums:[1,1], dot:1', () => {
    expect(make('1.1').toArray()).toEqual([1, 1])
    expect(make('1.1').getPoint()).toEqual(1)
  })

  it('11e0 -> nums:[1,1], dot:2,', () => {
    expect(make('11e0').toArray()).toEqual([1, 1])
    expect(make('11e0').getPoint()).toEqual(2)
  })

  it('11e1 -> nums:[1,1,0], dot:3,', () => {
    expect(make('11e1').toArray()).toEqual([1, 1, 0])
    expect(make('11e1').getPoint()).toEqual(3)
  })

  it('11e-1 -> nums:[1,1], dot:1,', () => {
    expect(make('11e-1').toArray()).toEqual([1, 1])
    expect(make('11e-1').getPoint()).toEqual(1)
  })

  it('11e-2 -> nums:[0,1,1], dot:1,', () => {
    expect(make('11e-2').toArray()).toEqual([0, 1, 1])
    expect(make('11e-2').getPoint()).toEqual(0)
  })
})

describe('Num::setNeg()', () => {
  it('setNeg(Zero)', () => {
    expect(make(0).setNeg(true).toString()).toEqual('-0')
    expect(make(-0).setNeg(true).toString()).toEqual('-0')
    expect(make(0).setNeg(false).toString()).toEqual('0')
    expect(make(-0).setNeg(false).toString()).toEqual('0')
  })

  it('setNeg(Infinity)', () => {
    expect(make(Infinity).setNeg(true).toString()).toEqual('-Infinity')
    expect(make(-Infinity).setNeg(true).toString()).toEqual('-Infinity')
    expect(make(Infinity).setNeg(false).toString()).toEqual('Infinity')
    expect(make(-Infinity).setNeg(false).toString()).toEqual('Infinity')
  })

  it('setNeg(NaN)', () => {
    expect(make(NaN).setNeg(true).toString()).toEqual('NaN')
    expect(make(NaN).setNeg(false).toString()).toEqual('NaN')
  })

  it('setNeg(Int)', () => {
    expect(make(1).setNeg(true).toString()).toEqual('-1')
    expect(make(-1).setNeg(true).toString()).toEqual('-1')
    expect(make(1).setNeg(false).toString()).toEqual('1')
    expect(make(-1).setNeg(false).toString()).toEqual('1')
  })

  it('setNeg(Float)', () => {
    expect(make(0.1).setNeg(true).toString()).toEqual('-0.1')
    expect(make(-0.1).setNeg(true).toString()).toEqual('-0.1')
    expect(make(0.1).setNeg(false).toString()).toEqual('0.1')
    expect(make(-0.1).setNeg(false).toString()).toEqual('0.1')
  })
})

describe('Num::toggleNeg()', () => {
  it('toggleNeg(Zero)', () => {
    expect(make(0).toggleNeg().toString()).toEqual('-0')
    expect(make(-0).toggleNeg().toString()).toEqual('0')
  })

  it('toggleNeg(Infinity)', () => {
    expect(make(Infinity).toggleNeg().toString()).toEqual('-Infinity')
    expect(make(-Infinity).toggleNeg().toString()).toEqual('Infinity')
  })

  it('toggleNeg(NaN)', () => {
    expect(make(NaN).toggleNeg().toString()).toEqual('NaN')
    expect(make(NaN).toggleNeg().toString()).toEqual('NaN')
  })

  it('toggleNeg(Int)', () => {
    expect(make(1).toggleNeg().toString()).toEqual('-1')
    expect(make(-1).toggleNeg().toString()).toEqual('1')
  })

  it('toggleNeg(Float)', () => {
    expect(make(0.1).toggleNeg().toString()).toEqual('-0.1')
    expect(make(-0.1).toggleNeg().toString()).toEqual('0.1')
  })
})

describe('Num::moveDpp()', () => {
  it('moveDpp(Zero)', () => {
    expect(make(0).moveDpp(0).toString()).toEqual('0')
    expect(make(0).moveDpp(1).toString()).toEqual('0')
    expect(make(0).moveDpp(-1).toString()).toEqual('0')
    expect(make(-0).moveDpp(0).toString()).toEqual('-0')
    expect(make(-0).moveDpp(1).toString()).toEqual('-0')
    expect(make(-0).moveDpp(-1).toString()).toEqual('-0')
  })

  it('moveDpp(Infinity)', () => {
    expect(make(Infinity).moveDpp(0).toString()).toEqual('Infinity')
    expect(make(Infinity).moveDpp(1).toString()).toEqual('Infinity')
    expect(make(Infinity).moveDpp(-1).toString()).toEqual('Infinity')
    expect(make(-Infinity).moveDpp(0).toString()).toEqual('-Infinity')
    expect(make(-Infinity).moveDpp(1).toString()).toEqual('-Infinity')
    expect(make(-Infinity).moveDpp(-1).toString()).toEqual('-Infinity')
  })

  it('moveDpp(NaN)', () => {
    expect(make(NaN).moveDpp(0).toString()).toEqual('NaN')
    expect(make(NaN).moveDpp(1).toString()).toEqual('NaN')
    expect(make(NaN).moveDpp(-1).toString()).toEqual('NaN')
  })

  it('moveDpp(Int)', () => {
    expect(make(1).moveDpp(0).toString()).toEqual('1')
    expect(make(1).moveDpp(1).toString()).toEqual('10')
    expect(make(1).moveDpp(-1).toString()).toEqual('0.1')
    expect(make(-1).moveDpp(0).toString()).toEqual('-1')
    expect(make(-1).moveDpp(1).toString()).toEqual('-10')
    expect(make(-1).moveDpp(-1).toString()).toEqual('-0.1')
  })

  it('moveDpp(Float)', () => {
    expect(make(0.1).moveDpp(0).toString()).toEqual('0.1')
    expect(make(0.1).moveDpp(1).toString()).toEqual('1')
    expect(make(0.1).moveDpp(-1).toString()).toEqual('0.01')
    expect(make(-0.1).moveDpp(0).toString()).toEqual('-0.1')
    expect(make(-0.1).moveDpp(1).toString()).toEqual('-1')
    expect(make(-0.1).moveDpp(-1).toString()).toEqual('-0.01')
  })
})

describe('Num::getPrecision()', () => {
  it('getPrecision(Zero)', () => {
    expect(make(0).getPrecision()).toEqual(1)
    expect(make(-0).getPrecision()).toEqual(1)
  })

  it('getPrecision(Infinity)', () => {
    expect(make(Infinity).getPrecision()).toEqual(0)
    expect(make(-Infinity).getPrecision()).toEqual(0)
  })

  it('getPrecision(NaN)', () => {
    expect(make(NaN).getPrecision()).toEqual(0)
    expect(make(NaN).getPrecision()).toEqual(0)
  })

  it('getPrecision(Int)', () => {
    expect(make(3333).getPrecision()).toEqual(4)
    expect(make(33333).getPrecision()).toEqual(5)
  })

  it('getPrecision(Float)', () => {
    expect(make(0.3).getPrecision()).toEqual(1)
    expect(make(0.33).getPrecision()).toEqual(2)
    expect(make(0.333).getPrecision()).toEqual(3)
    expect(make(0.3333).getPrecision()).toEqual(4)
    expect(make(3.3).getPrecision()).toEqual(2)
    expect(make(3.33).getPrecision()).toEqual(3)
    expect(make(3.333).getPrecision()).toEqual(4)
    expect(make(3.3333).getPrecision()).toEqual(5)
  })
})

describe('Num::setPrecision()', () => {
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

describe('Num::toPrecision()', () => {
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
    expect(make(3333).toPrecision(3)).toEqual('3330')
    expect(make(-3333).toPrecision(3)).toEqual('-3330')

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
})

describe('Num::toString()', () => {
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
})

describe('Num::toNumber()', () => {
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
