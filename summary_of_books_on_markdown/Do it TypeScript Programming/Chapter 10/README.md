# 🐤 Chapter 10: 제네릭 타입 이해하기

## 🦄 제네릭 타입 이해하기
- 제네릭 타입은 인터페이스나 클래스, 함수, 타입 별칭 등에 사용할 수 있는 기능으로, 해당 심벌의 타입을 미리 지정하지 않고 다양한 타입에 대응하려고 할 떄 사용한다.

```ts
// 제네릭 인터페이스 구문
interface IValuable<T> {
  value: T;
}

// 제네릭 함수 구분
function identity<T>(arg: T): T { return arg; }

// 제네릭 타입 별치 구문
type IValuable<T> = {
  value: T;
}

// 제네릭 클래스 구문
class Valuable<T> {
  constructor(public value: T) {};
}
```

### 📚 제네릭 사용하기
- 제네릭 인터페이스 `IValuable<T>`를 구현하는 제네릭 클래스는 자신이 가진 타입 변수 `T`를 다음처럼 인터페이스 쪽 제네릭 타입 변수로 넘길 수 있다.

```ts
interface IValuable<T> {
  value: T;
}

class Valuable<T> implements IValuable<T> {
  constructor(public value: T) {}
}

// 제네릭 함수는 다음처럼 자신의 타입 변수 T를 제네릭 인터페이스의 타입 변수 쪽으로 넘기는 형태로 구현할 수 있다.
const printValue = <T>(o: IValuable<T>): void => console.log(o.value);

printValue(new Valuable<number>(1)); // 1
printValue(new Valuable<boolean>(true)); // true
printValue(new Valuable<string>('hello')); // hello
printValue(new Valuable<number[]>([1, 2, 3])); // [1, 2, 3]
```

## 🦄 제네릭 타입 제약
- 제네릭 타입 제약은 타입 변수에 적용할 수 있는 타입의 범위를 한정하는 기능을 한다.
- 타입스크립트에서 제네릭 함수의 타입을 제한하고 싶을 때는 다음 구문을 사용한다.

```ts
<최종타입1 extend 타입1, 최종타입2 extend 타입2>(a: 최종타입1, b: 최종타입2, ...) {}
```

- `printValueT` 함수는 제네릭 타입 제약 구문을 사용해 구현하고 있다.

```ts
const printValueT = <Q, T extends IValuable<Q>>(o: T) => console.log(o.value);

printValueT(new Valuable(1)); // 1
printValueT({ value: true }); //true
```

### 📚 new 타입 제약
- 프로그래밍 분야에서 팩토리 함수는 `new` 연산자를 사용해 객체를 생성하는 기능을 하는 함수를 의미한다.
- 다음 코드에서 `create` 함수의 매개변수 `type`은 실제로는 타입이다. 따라서 `type` 변수의 타입 주석으로 명시한 `T`는 타입의 타입에 해당한다.

```ts
const create = <T>(type: T): T => new type();
```

- 하지만 타입스크립트 컴파일러나느 타입의 타입을 허용하지 않으므로 오류 메시지가 발생한다.
- 그래서 다음과 같이 사용해줄 수 있다.

```ts
const create = <T extends { new(): T }>(type: T): T => new type();

// 더 간결한 문법
const create = <T>(type: new() => T): T => new type();
```

- 결론적으로, `{ new(): T }`와 `new() => T`는 같은 의미다. `new` 연산자를 `type`에 적용하면서 `type`의 생성자 쪽으로 매개변수를 전달해야 할 때 다음처럼 `new(...args)`구문을 사용한다.

```ts
const create = <T>(type: { new(...args): T }, ...args): T => new type(...args);
```

- 다음 코드는 `Point`의 인스턴스를 `{ new(...args): T }` 타입 제약을 설정한 `create` 함수로 생성하는 예이다.

```ts
class Point {
  constructor(public x: number, public y: number) {};
}

[ create(Date), create(Point, 0, 0) ].forEach(s => console.log(s));
// 2020-05-22... Point { x: 0, y: 0 }
```

### 📚 인덱스 타입 제약
- 객체의 일정 속성들만 추려서 좀 더 단순한 객체를 만들어야 할 때가 있다.

```ts
const obj = {
  name: 'Jane',
  age: 22,
  city: 'Seoul',
  country: 'Korea',
}

const pick = (obj, keys) => keys.map(key => ({ [key]: obj[key] }))
  .reduce((result, value) => ({ ...result, ...value }, {}))

// obj 객체에서 name과 age 두 속성만 추출
pick(obj, ['name', 'age']); // { name: 'Jane', age: 22 }
pick(obj, ['nam', 'agge']); // { name: undefined, age: undefined }
```

- 위 예제처럼 오타가 발생하면 엉뚱한 결과가 나온다. 타입스크립트는 이러한 상황을 방지할 목적으로 다음처럼 `keyof T` 형태로 타입 제약을 설정할 수 있게 지원한다. 이것을 **인덱스 타입 제약**이라고 한다.

```ts
<T, K extends keyof T>
```

- `keyof T` 구문으로 타입 `K`가 타입 `T`의 속성 이름이라고 타입 제약을 설정한다.

```ts
const pick = <T, K extends keyof T>(obj: T, keys: K[]) => 
  keys.map(key => ({ [key]: obj[key] }))
    .reduce((result, value) => ({ ...result, ...value }, {}))
```

- 이렇게 하면 컴파일을 해보지도 않고 앞에서 예로 든 `nam`, `agge`와 같은 입력 오류를 코드 작성 시점에 탐지할 수 있다.

## 🦄 대수 데이터 타입
- 타입스크립트에서 대수 데이터 타입은 합집합 타입과 교집합 타입 두 가지 종류가 있다.

### 📚 합집합 타입
- 합집합 타입은 *또는(or)*의 의미인 `|` 기호로 다양한 타입을 연결해서 만든 타입을 말한다.
- 다음 코드에서 변수 `ns`의 타입인 `NumberOrString`은 `number`나 `string` 타입이므로, 1과 같은 수와 `hello`와 같은 문자열을 모두 담을 수 있다.

```ts
type NumberOrString = number | string;
let ns: NumberOrString = 1;
ns = 'hello';
```

### 📚 교집합 타입
- 교집합 타입은 *이고(and)*의 의미인 `&` 기호로 다양한 타입을 연결해서 만든 타입을 말한다.
- 대표적인 예로 두 개의 객체를 통합해서 새로운 객체를 만드는 것이다.

```ts
const mergeObjects = <T, U>(a: T, b: U): T & U => ({ ...a, ...b });

type INameable = { name: string };
type IAgeable = { age: number };

const nameAndAge: INameable & IAgeable = mergeObjects({ name: 'Jack' }, { age: 32 });
console.log(nameAndAge); // { name: 'Jack', age: 32 }
```

### 📚 식별 합집합 구문
- 식별 합집함 구문을 사용하려면 합집합 타입을 구성하는 인터페이스들이 모두 똑같은 이름의 속성을 가지고 있어야 한다.
- 다음 코드에서 `ISquare`, `IRectangle`, `ICircle`은 모두 `tag`라는 이름의 공통 속성이 있다.

```ts
interface ISquare { tag: 'square', size: number }
interface IRectangle { tag: 'rectangle', width: number, height: number }
interface ICircle { tag: 'circle', radius: number }

type IShape = ISquare | IRectangle | ICircle

const calcArea = (shape: IShape): number => {
  switch(shape.tag) {
    case 'square': return shape.size * shape.size;
    case 'rectangle': return shape.width * shape.height;
    case 'circle': return Math.PI * shape.radius * shape.radius;
  }

  return 0;
}
```

## 🦄 타입 가드

- 다음 코드에서 `flyOrSwim` 함수는 매개변수 `o`가 `Bird`이거나 `Fish`이므로 코드 작성이 모호해질 수 있다.
- 즉, 구체적으로 `Bird`인지 `Fish`인지 알야한다.

```ts
class Bird { fly() { console.log("I'm flying."); }}
class Fish { swim() { console.log("I'm swimming."); }}

const flyOrSwim = (o: Bird | Fish): void => {
  // o.fly() ???
}
```

### 📚 타입 가드
- 타입스크립트에서 `instanceof` 연산자는 자바스크립트와 다르게 타입 가드 가능이 있다.
- 여기서 타입 가드는 타입을 변환하지 않은 코드 때문에 프로그램이 비정상적으로 종료되는 상황을 보호해준다는 의미다.

```ts
const flyOrSwim = (o: Bird | Fish): void => {
  if (o instanceof Bird) {
    o.fly();
  } else if (o instanceof Fish) {
    o.swim();
  }
}
```

### 📚 is 연산자를 활용한 사용자 정의 타입 가드 함수 제작
- 타입 가드 기능을 하는 함수를 구현할 수 있다. 이때 함수의 반환 타입 부분에 `is`라는 이름의 연산자를 사용해야 한다.

```ts
const isFlyable = (o: Bird | Fish): o is Bird => {
  return o instanceof Bird;
}

const isSWimmalbe = (o: Bird | Fish): o is Fish => {
  return o instanceof Fish;
}

const swimOfFly = (o: Fish | Bird) => {
  if (isSwimmable(o)) {
    o.swim();
  } else if (isFlyable(o)) {
    o.fly();
  }
}

[new Bird, new Fish].forEach(swimOfFly); // I'm flying. I'm swimming
```

## 🦄 F-바운드 다형성

### 📚 this 타입과 F-바운드 다형성
- 타입스크립트에서 `this` 키워드는 타입으로도 사용된다. 
- `this`가 타입으로 사용되면 객체지향 언어에서 의미하는 다형성 효과가 나는데, 일반적인 다형성과 구분하기 위해 `this` 타입으로 인한 다형성을 **F-바운드 다형성**이라고 한다.

#### 🎈 F-바운드 타입
- F-바운드 타입이란, 자신을 구현하거나 상속하는 서브타입을 포함하는 타입을 말한다.
- 다음 `IAddable<T>`는 `add` 메서드가 내가 아닌 나를 상속하는 타입을 반환하는 F-바운드 타입이다.

```ts
interface IAddable<T> {
  add(value: T): this
}

interface IMultiplyable<T> {
  multiply(value: T): this
}
```

#### 🎈 IValueProvider<T> 인터페이스 구현
- 다음 `Calculator` 클래스는 `IValueProvider<T>` 인터페이스를 구현하고 있다.
- 이 클래스는 `_value` 속성을 `private`으로 만들어 `Calculator`를 사용하는 코드에서 `_value`속성이 아닌 `value()` 메서드로 접근할 수 있게 설계됐다.

```ts
import { IValueProvider } from '../interfaces';

export class Calculator implements IValueProvider<number> {
  constructor(private _value: number = 0) {}
  value(): number { return this._value };
}
```

- 같은 방식으로 다음 `StringComposer` 또한 `IValueProvider<T>`를 구현한다.

```ts
import { IValueProvider } from '../interfaces';

export class StringComposer implements IValueProvider<string> {
  constructor(private _value: string = '') {}
  value(): string { return this._value };
}
```

#### 🎈 IAddable<T>와 IMultiplyable<T> 인터페이스 구현
- `Calculator`의 `add` 메서드는 클래스의 `this`값을 반환하는데, 이는 메서드 체인 기능을 구현하기 위해서이다.

```ts
import { IValueProvider, IAddable } from '../interfaces';

export class Calculator implements IValueProvider<number>, IAddable<number> {
  constructor(private _value: number = 0) {}
  value(): number { return this._value };
  add(value: number): this {
    this._value = this._value + value;
    return this;
  }
}
```

- `IMultiplyable<T>`도 같은 방법으로 `Calculator` 클래스에 구현한다.

```ts
import { IValueProvider, IAddable, IMultiplyable } from '../interfaces';

export class Calculator implements IValueProvider<number>, IAddable<number>, IMultiplyable<number> {
  constructor(private _value: number = 0) {}
  value(): number { return this._value };
  add(value: number): this {
    this._value = this._value + value;
    return this;
  }
  multiply(value: number): this {
    this._value = this._value * value;
    return this;
  }
}
```

- 다음은 `Calculator` 클래스를 테스트하는 코드이다.

```ts
import { Calculator } from '../classes/Calculator';

const value = (new Calculator(1))
  .add(2) // 3
  .add(3) // 6
  .multiply(4) // 24
  .value()

console.log(value); // 24
```

- `StringComposer`도 `Calculator`를 구현한 방식을 그대로 사용해 구현할 수 있다.

```ts
import { IValueProvider, IAddable, IMultiplyable } from '../interfaces';

export class StringComposer implements IValueProvider<string>, IAddable<string>, IMultiplyable<number> {
  constructor(private _value: string = '') {}
  value(): string { return this._value };
  add(value: string): this {
    this._value = this._value.concat(value);
    return this;
  }
  multiply(repeat: number): this {
    const value = this.value();
    for (let index = 0; index < repeat; index++) {
      this.add(value);
    }
    return this;
  }
}

// StringComposer-test.ts
import { StringComposer } from '../classes/StringComposer';

const value = new StringComposer('hello')
  .add(' ') // hello
  .add('world') // hello world
  .add('!') // hello world!
  .multiply(3) // hello world!hello world!hello world!hello world!
  .value();

console.log(value); // hello world!hello world!hello world!hello world!
```

- 반환 타입 `this`는 어떤 때는 `Calculator`가 되기도 하고 어떤 때는 `StringComposer`가 되기도한다.
- 이런 방식으로 동작하는 것을 F-바운드 다형성이라고 한다.

## 🦄 nullable 타입과 프로그램 안전성

### 📚 nullable 타입이란?
- 자바스크립트와 타입스크립트는 `undefined`와 사실상 같은 의미인 `null`이 있다. 타입스크립트에서는 서로 호환된다.
- `undefined`와 `null` 타입을 `nullable` 타입이라고 하며, 코드로는 다음처럼 표현할 수 있다.

```ts
type nullable = undefined | null
const nullable: nullable = undefined;
```

- 이 `nullable` 타입들은 프로그램이 동작할 때 프로그램을 비정상으로 종료시키는 주요원인이 된다.
- 즉, 프로그램의 안전성을 해친다. 함수형 언어들은 이를 방지하기 위해 연산자나 클래스를 제공하기도 한다.

### 📚 옵션 체이닝 연산자
- 변수가 선언만 되었을 뿐 어떤 값으로 초기화되지 않으면 코드를 작성할 때는 문제가 없지만, 실제로 실행하면(런타임) 오류가 발생하면서 프로그램이 비정상으로 종료한다.
- 이런 오류는 안전성을 해치므로 프로그래밍 언어 설계자들은 옵션 체이닝 연산자와 널 병합 연산자를 제공한다.

```ts
interface IPerson {
  name: string
  age?: number
}

let person: IPerson;

console.log(person?.name) // 런타임 오류 없이 정상적으로 실행되며, undefined값이 반환된다.
```

### 📚 널 병합 연산자
- 다음 코드는 옵션 체이닝 연산자와 널 병합 연산자를 한꺼번에 사용하는데, 옵션 체이닝 연산자 부분이 `undefined`가 되면 널 병합 연산자가 동작해 `undefined` 대신 0을 반환한다.

```ts
type ICoordinates = { longitude: number }
type ILocation = { country: string, coords: ICoordinates }
type IPerson = { name: string, location: ILocation }

let person: IPerson;

let longitude = person?.location?.coords?.longitude ?? 0;
console.log(longitude); // 0
```

### 📚 nullable 타입의 함수형 방식 구현
- 타입스크립트 언어로 `Option` 타입을 구현해본다.
- 다음 코드에서 `Option` 클래스는 스칼라에서 사용되는 방식으로 동작한다.

```ts
import { Some } from './Some';
import { None } from './None';

export class Option {
  private constructor() {}
  static Some<T>(value: T) { return new Some<T>(value); }
  static None = new None();
}

export { Some, None };
```

- `Option` 클래스는 생성자가 `private`으로 선언되었으므로, `new` 연산자로 `Option` 클래스의 인스턴스를 만들 수 없다. 
- 즉, `Option` 타입 객체는 다음처럼 `Option.Some(값)` 혹은 `Option.None` 형태로만 생성할 수 있다.
- `Some`과 `None`은 둘 다 `IValuable<T>`와 `IFunctor<T>`라는 인터페이스를 구현하고 있는데, 두 클래스는 각기 다른 이 인터페이스를 구현한다.
- `IValuable`을 구현하는 `Some`과 `None`은 이 `getOrElse` 메서드를 반드시 구현해야 한다.

```ts
export interface IValuable<T> {
  getOrElse(defaultValue: T)
}
```

- 함수형 프로그래밍 언어에서는 `map`이라는 메서드가 있는 타입들을 펑터라고 부른다. 다음은 타입스크립트 언어로 선언한 펑터 인터페이스이다. `Some`과 `None` 클래스는 `IValuable`은 물론 이 `IFunctor` 인터페이스도 구현하고 있으므로, 이 두 클래스는 `getOrElse`와 `map`이라는 이름의 메서드를 제공한다.

```ts
export interface IFunctor<T> {
  map<U>(fn: (value: T) => U)
}
```

#### 🎈 Some 클래스 구현
- `value` 속성은 `private`으로 선언되어 있으므로 `Some` 클래스의 사용자는 항상 `getOrElse` 메서드를 통해 `Some` 클래스에 담긴 값을 얻어야 한다. 또한 `value`값을 변경하려면 항상 `map` 메서드를 사용해야만 한다.

```ts
import { IValuable } from './IValuable';
import { IFunctor } from './IFunctor';

export class Some<T> implements IValuable<T>, IFunctor<T> {
  constructor(private value: T) {}

  getOrElse(defaultValue: T) {
    return this.value ?? defaultValue;
  }
  map<U>(fn: (T) => U) {
    return new Some<U>(fn(this.value));
  }
}
```

#### 🎈 None 클래스 구현
- 다음은 `None` 클래스의 구현 내용이다.

```ts
import { IValuable } from "./IValuable";
import { nullable } from "./nullable";
import { IFunctor } from './IFunctor';

export class None implements IValuable<nullable>, IFunctor<nullable> {
  getOrElse<T>(defaultValue: T | nullable) {
    return defaultValue;
  }
  map<U>(fn: (T) => U) {
    return new None;
  }
}
```

#### 🎈 Some과 None 클래스 사용

```ts
import { Option } from '../option/Option';

let m = Option.Some(1);
let value = m.map((value) => value + 1).getOrElse(1);
console.log(value); // 2

let n = Option.None;
value = n.map((value) => value + 1).getOrElse(0)
console.log(value); // 0
```

### 📚 Option 타입과 예외 처리
- `Option` 타입은 부수 효과가 잇는 불순 함수를 순수 함수로 만드는 데 효과적이다.
- 다음 `parseNumber` 함수는 `parseInt`의 반환값이 `NaN`인지에 따라 `Option.None`이나 `Option.Some` 타입의 값을 반환한다.

```ts
import { IFunctor } from "./IFunctor";
import { IValuable } from "./IValuable";
import { Option } from "./Option";

export const perseNumber = (n: string): IFunctor<number> & IValuable<number> => {
  const value = parseInt(n);
  return isNaN(value) ? Option.None : Option.Some(value);
}
```

- 다음 테스트 코드는 갑싱 정상적으로 변환되면 `map` 메서드가 동작해 4가 출려되지만, 값이 비정상적이면 `getOrElse(0)`가 제공하는 0을 출력한다.

```ts
import { parseNumber } from '../option/parseNumber';

let value = parseNumber('1')
  .map((value) => value + 1) // 2
  .map((value) => value * 2) // 4
  .getOrElse(0);

console.log(value);

value = parseNumber('hello world')
  .map((value) => value + 1) // 콜백 함수가 호출되지 않는다
  .map((value) => value * 2) // 콜백 함수가 호출되지 않는다
  .getOrElse(0); // 0

console.log(value); // 0
```

- 자바스크립트의 `JSON.parse` 함수는 매개변수가 정상적인 JSON 포맷 문자열이 아니면 예외를 발생시킨다.
- 예외를 발생시키는 함수는 부수 효과가 있는 불순 함수이지만, 다음 `parseJson` 함수는 `try/catch` 구문과 `Option`을 활용해 순수 함수가 되었다.

```ts
import { IValuable } from './IValuable';
import { IFunctor } from './IFunctor';
import { Option } from './Option';

export const parseJson = <T>(json: string): IValuable<T> & IFunctor<T> => {
  try {
    const value = JSON.parse(json);
    return Option.Some<T>(value);
  } catch (error) {
    return Option.None;
  }
}
```

- 다음 테스트 코드는 비정상적으로 종료하지 않고 정상적으로 동작한다.

```ts
import { parseJson } from '../option/parseJson';

const json = JSON.stringify({
  name: 'Jack',
  age: 32,
});

let value = parseJson(json).getOrElse({});
console.log(value); // { name: 'Jack', age: 32 }

value = parseJson('hello world').getOrElse({});
console.log(value); // {}
```
