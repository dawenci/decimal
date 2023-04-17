# @dawenci/decimal

## API

### Decimal class

Type:


```ts
enum RoundingMode {
  Up = 0,
  Down = 1,
  Ceiling = 2,
  Floor = 3,
  HalfUp = 4,
  HalfDown = 5,
  HalfEven = 6,
  HalfCeiling = 7,
  HalfFloor = 8,
}

class Decimal {
  /**
   * Returns a copy of this Decimal object.
   */
  clone(): Decimal

  /**
   * Integer.
   */
  isInt(): boolean

  /**
   * A **SafeInt** is an integer between `Number.MIN_SAFE_INTEGER` and `Number.MAX_SAFE_INTEGER`.
   */
  isSafeInt(): boolean

  /**
   * Negative.
   */
  isNeg(): boolean

  /**
   * NaN.
   */
  isNaN(): boolean

  /**
   * +/-Infinity.
   */
  isInfinity(): boolean

  /**
   * Equals to `0`.
   */
  isZero(): boolean

  /**
   *  Equals to `1`.
   */
  isOne(): boolean

  /**
   * Set positive and negative symbols.
   */
  setNeg(value: boolean): this

  /**
   * Toogle positive and negative symbols.
   */
  toggleNeg(): this

  /**
   * To JavaScript number.
   */
  toNumber(): number

  /**
   * Returns a string representing the value of this Decimal.
   */
  toString(): string

  /**
   * Returns a string representing the value of this Decimal.
   */
  toPrecision(significantDigits?: number, roundingMode?: RoundingMode): string
}
```

### make instance

```ts
function make(any: string | number): Decimal
```

example:

```ts
import { make } from '@dawenci/num'

;[
  make(0),
  make(1),
  make(3.14),
  make(NaN),
  make(Infinity),
].map(num => num.toString())
// return: ['0', '1', '3.14', 'NaN', 'Infinity']

make('3.14') // 3.14
make('314e-2') // 3.14
make('infinity') // Infinity
make('NaN') // NaN
```

### method

#### Decimal.prototype.toNumber

type

```ts
toNumber(): number
```

get javaScript number value.

example

```ts
make(3.14).toNumber() // 3.14
make(0).toNumber() // 0
make(-0).toNumber() // -0
make(NaN).toNumber() // NaN
make(Infinity).toNumber() // Infinity
make(-Infinity).toNumber() // -Infinity
```

#### Decimal.prototype.toString

type

```ts
toString(): string
```

example

```ts
make(3.14).toString() // '3.14'
make(0).toString() // '0'
make(-0).toString() // '-0'
make(NaN).toString() // 'NaN'
make(Infinity).toNumber() // 'Infinity'
make(-Infinity).toNumber() // '-Infinity'
```

#### Decimal.prototype.toPrecision

type

```
toPrecision(significantDigits?: number, roundingMode?: RoundingMode): string
```

example

```ts
make(3).toPrecision(3) // 3.00
make(3.3).toPrecision(3) // '3.30'
make(3333).toPrecision(3) // '3330'
```

#### Decimal.prototype.setPrecision

type

```
setPrecision(): Decimal
```


#### Decimal.prototype.toggleNeg

type

```ts
toggleNeg(): this
```

example

```ts
make(3.14).toggleNeg().toNumber() // -3.14
```


#### Decimal.prototype.setNeg

type

```ts
setNeg(value: boolean): this
```

example
```ts
make(3.14).setNeg(true).toNumber() // -3.14
```


### Pipeable API

type

```ts
type Pipeable = (rightHandSide: any) => (leftHandSide: Decimal) => Decimal
type Pipe = (any: any, ...fns: ReturnType<Pipeable>[]) => Decimal

const pipe: Pipe
```

example

```ts
import { pipe, add, sub, mul, div } from '@dawenci/num'

pipe(
  1,       // 1
  add(10), // 11
  sub(5),  // 6
  mul(3),  // 18
  div(2)   // 9
).toString()
// output: '9'
```

#### pipeable functions


##### add

`pipe(a, add(b))` means `a + b`.

example

```ts
pipe(0.1, add(0.2)).toNumber() // 0.3
```

##### sub

`pipe(a, sub(b))` means `a - b`

example

```ts
pipe(3, sub(2)).toNumber() // 1
```

##### mul

`pipe(a, mul(b))` means `a * b`

example

```ts
pipe(3, mul(2)).toNumber() // 6
```

##### div

`pipe(a, div(b))` means `a / b`

example

```ts
pipe(3, div(2)).toNumber() // 1.5
```

##### mod

`pipe(a, mod(b))` means `a % b`

example

```ts
pipe(3, mod(2)).toNumber() // 1
```

##### tap

type

```ts
tap(fn: (n: Decimal) => void)
```

example

```ts
pipe(3, n => console.log(n.toNumber())) // print 3
```
