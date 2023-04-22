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


### Pipeable API

type

```ts
type Pipeable = (decimal: Decimal) => Decimal
type Pipe = (any: any, ...fns: Pipeable[]) => Decimal

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

#### neg

Toogle positive and negative symbols.

example

```ts
pipe(3.14, neg).toNumber() // -3.14
pipe(-3.14, neg).toNumber() // 3.14
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


## change log

### v0.2.0

- 模块导出方式变更，新增导出 fn 下的函数（在 fn 命名空间下）
- 增加 Setting 模块，可以配置全局的 precision、rounding 模式、转换指数计数法的阈值等。
- make 函数支持更多输入
- pipeable 相关类型调整
- 函数 fn/add、fn/sub、fn/mul、fn/div、fn/mod 等返回 Decimal 实例的函数，会对结果应用 precision、rounding
- 函数 fn/div 和 pipeable/div 语义、参数重新设计
- 函数 pipeable/precision 新增 roundingMode 参数
- 新函数 fn/abs 和 pipeable/abs
- 新函数 fn/pi，用来生成指定精度的 π
- 新函数 pipeable/cmp
- 新函数 pipealbe/neg
- 函数 pipeable/sub、pipeable/div、pipeable/mod 支持传入占位符交换两个二元运算操作数的顺序
- Decimal.prototype.toPrecision 方法重新设计（语义更新）
- Decimal.prototype.toString 方法重新设计（语义更新）
- Decimal.prototype.toggleNeg 方法移除
- Decimal.prototype.setNeg 方法移除
