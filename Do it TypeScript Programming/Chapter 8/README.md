# 🐤 Chapter 8: 함수 조합의 원리와 응용

## 🦄 함수형 프로그래밍이란?
- 함수형 프로그래밍은 **순수 함수**와 **선언형 프로그래밍**의 토대 위에 함수 조합과 모나드 조합으로 코드를 설계하고 구현하는 기법이다.
- 함수형 프로그래밍의 다음 세 가지 수학 이론에 기반을 두고 있다.

> 1. 람다 수학(ramda calculus): 조합 논리와 카테고리 이론의 토대가 되는 논리 수학
> 2. 조합 논리(combinatory logic): 함수 조합의 이론적 배경
> 3. 카테고리 이론(category theory): 모나드 조합과 고차 타입의 이론적 배경

- 함수형 프로그래밍 언어는 정적 타입(static type), 자동 메모리 관리(automatic memory management), 계산법(evaluation), 타입 추론(type inference), 일등 함수(first-class function)에 기반을 두고, 대수 데이터 타입(algebraic data type), 패턴 매칭(pattern matching), 모나드(monad), 고차 타입(high order type) 등의 고급 기능을 제공한다. 다만, 함수형 언어라고 해서 이러한 기능을 모두 제공하지는 않는다.

## 🦄 제네릭 함수
- 타입 변수 `T`로 표기할 때 이를 제네릭 타입이라고 한다.

### 📚 타입스크립트의 제네릭 함수 구문
- 타입스크립트에서 제네릭 타입은 함수와 인터페이스, 클래스, 타입 별칭에 적용할 수 있으며, 꺽쇠 괄호 `<>`로 타입을 감싼 `<T>`, `<T, Q>`처럼 표현한다.

```ts
function g1<T>(a: T): void {};
function g2<T, Q>(a: T, b: Q): void {};
```

- 제네릭 타입으로 함수를 정의하면 어떤 타입에도 대응할 수 있다. `g1` 함수는 `a` 매개변수가 제네릭 타입으로 지정되었고, `g2` 함수는 `a`와 `b` 매개변수가 각각 다른 제네릭 타입으로 지정되었다.

```ts
// 화살표 함수
const g3 = <T>(a: T): void => {};
const g4 = <T, Q>(a: T, b: Q): void => {};

// 타입 별칭에 제네릭 타입을 적용
type Type1Func<T> = (T) => void
type Type2Func<T, Q> = (T, Q) => void
type Type3Func<T, Q, R> = (T, Q) => R; // T와 Q 타입 값을 입력받아 R 타입 값을 반환
```

### 📚 함수의 역할
- 수학에서 함수는 값 `x`에 수식을 적용해 또 다른 값 `y`를 만드는 역할을 한다.
- 함수를 `f`라고 표기하면 값 `x`, `y`, `f`간의 관계를 다음처럼 표현할 수 있다.

```
x ~> f ~> y
```

- 함수 `f`가 `T` 타입의 `x`값으로 `R` 타입의 `y`값을 만든다고 하면 다음처럼 표현한다.

```
(x: T) ~-> f -> (y: R)
```

- 수학에서는 이런 관계를 일대일 관계라고 하고, 이런 동작을 하는 함수 `f`를 매핑 줄여서 맵이라고 표현한다.
- 타입스크립트 언어로 일대일 맵 함수를 만든다면 타입 `T`인 값을 이용해 타입 `R`인 값을 만들어 주어야 하므로, 함수의 시그니처를 다음처럼 표현할 수 있다.

```ts
type MapFunc<T, R> = (T) => R
```

### 📚 아이덴티티 함수
- 맵 함수에서 가장 단순한 형태는 입력값 `x`를 가공 없이 그대로 반환한다. 즉, 입력과 출력 타입이 같다.
- 함수형 프로그래밍에서 이러한 역할을 하는 함수 이름에는 보통 `identity` 혹은 `I`라는 단어가 포함된다. 앞에서 예로 든 `MapFunc` 타입을 사용해 아이덴티티 함수의 시그니처를 다음처럼 표현할 수 있다.

```ts
type MapFunc<T, R> = (T) => R
type IdentityFunc<T> = MapFunc<T, T>
```

- 이렇게 정의한 제네릭 함수 타입 `IdentityFunc<T>`는 다음과 같은 다양한 함수를 선언할 때 포괄적으로 사용할 수 있다.

```ts
const numberIdentity: IdentityFunc<number> = (x: number): number => x;
const stringIdentity: IdentityFunc<string> = (x: string): string => x;
const arrayIdentity: IdentityFunc<any[]> = (x: any[]): any[] => x;
```

## 🦄 고차 함수와 커리

### 📚 고차 함수란?
- 어떤 함수가 또 다른 함수를 반환할 때 그 함수를 **고차 함수**(high-order function)라고 한다.

```ts
// 함수 시그니처
type FirstOrderFunc<T, R> = (T) => R;
type SecondOrderFunc<T, R> = (T) => FirstOrderFunc<T, R>;
type ThirdOrderFunc<T, R> = (T) => SecondOrderFunc<T, R>;
```

- 이 시그니처를 참조해 실제 함수를 만든다.
- 아래는 함수 호출 연산자를 세 번 연속해서 사용했다. 이를 **커리**라고 한다.

```ts
const add3: ThirdOrderFunc<number, number> =
  (x: number): SecondOrderFunc<number, number> =>
  (y: number): FirstOrderFunc<number, number> =>
  (x: number): number => x + y + z;

console.log(add3(1)(2)(3)); // 6
```

### 📚 부분 적용 함수와 커리
- 만약 위 예에서 `add3(1)`, `add3(1)(2)`처럼 자신의 차수보다 함수 호출 연사자를 덜 사용하면 부분 적용 함수, 짧게 말하면 부분 함수라고 한다.

```ts
const add2: SecondOrderFunc<number, number> = add3(1);
const add1: FirstOrderFunc<number, number> = add2(2);
console.log(
  add1(3),       // 6
  add2(2)(3),    // 6
  add3(1)(2)(3), // 6
);
```

### 📚 클로저
- 고차 함수의 몸통에서 선언되는 변수들은 클로저라는 유효 범위를 가진다. 클로저는 **지속되는 유효 범위**를 의미한다.

```ts
function add(x: number): (number) => number { // 바깥쪽 유효 범위 시작
  return function(y: number): number { // 안쪽 유효 범위 시작
    return x + y; // 클로저 (x는 자유 변수)
  } // 안쪽 유효 범위 끝
}  // 바깥쪽 유효 범위 끝
```

- 이처럼 자유 변수가 있으면 그 변수의 바깥쪽 유효 범위에서 자유 변수의 의미(선언문)를 찾는데, 바깥쪽 유효 범위에서 `x`의 의미(`x: number`)를 알 수 있으므로 코드를 정상적으로 컴파일한다.
- 클로저를 지속되는 유효 범위라고 하는 이유는 다음처럼 `add`함수를 호출하더라도 변수 `x`가 메모리에서 해제되지 않는다.

```ts
const add1 = add(1); // 변수 x 메모리 유지
```

- 자유 변수 x는 다음 코드가 실행되어야 메모리가 해제된다.

```ts
const result = add1(2); // result에 3을 저장 후 변수 x 메모리 해제
```

- 이처럼 고차 함수가 부분 함수가 아닌 **값을 발생해야 비로서 자유 변수의 메모리가 해제되는 유효 범위**를 클로저라고 한다.
- 클로저는 메모라가 해제되지 않고 프로그램이 끝날 때까지 지속될 수도 있다.

```ts
const makeNames = (): () => string => { // 바깥쪽 유효 범위
  const names = ['Jack', 'Jane', 'Smith'];
  let index = 0;

  return (): string => { // 안쪽 유효 범위
    if (index === names.length) {
      index = 0;
    }

    return names[index++];
  }
}

const makeName: () => string = makeNames();

console.log(
  [1, 2, 3, 4, 5, 6].map(n => makeName())
);

// ["Jack", "Jane", "Smith", "Jack", "Jane", "Smith"]
```

## 🦄 함수 조합
- 함수 조합은 작은 기능을 구현한 함수를 여러 번 조합해 더 의미 있는 함수를 만들어 내는 프로그램 설계 기법이다.

```ts
const f = <T>(x: T): string => `f(${x})`;
const g = <T>(x: T): string => `g(${x})`;
const h = <T>(x: T): string => `h(${x})`;
```

### 📚 compose 함수
- `compose` 함수는 가변 인수 스타일로 함수들의 배열을 입력받는다. 그다음 함수들을 조합해 매개변수 `x`를 입력받는 1차 함수를 반환한다.

```ts
const compose = <T, R>(...functions: readonly Function[]): Function => (x: T): (T) => R => {
  const deepCopiedFunctions = [...functions];

  return deepCopiedFunctions.reverse().reduce((value, func) => func(value), x);
}

const composedFGH = compose(h, g, f);
console.log(composedFGH('x')); // h(g(f(x)))
```

- 다음 코드는 `inc` 함수를 `compose`로 세 번 조합함 `composed`란 함수를 만든다.

```ts
const inc = x => x + 1;

const composed = compose(inc, inc, inc);
console.log(composed(1)); // 4
```

### 📚 pipe 함수
- `pipe` 함수는 `compose`와 매개변수들을 해석하는 순서가 반대이므로, 다음 코드는 `reverse`하는 코드가 없다.

```ts
const pipe = <T, R>(...functions: readonly Function[]): Function => (x: T): (T) => R => {
  return functions.reduce((value, func) => func(value), x);
}

const piped = pipe(f, g, h);
console.log(piped('x')); // h(g(f))
```

### 📚 pipe와 compose 함수 분석
- 예를 들어, 함수 f, g, h의 함수 시그니처는 다음처럼 모두 다르다.

```
f: (number) => string
g: (string) => string[]
h: (string[]) => number 
``` 

- 이 경우 제네릭 타입을 적용하기가 힘들다. 따라서 `functions`는 자바스크립트 타입 `Function`들의 배열인 `Function[]`으로 설정한다.

```ts
const pipe = (...functions: Function[])
```

- `pipe` 함수는 `functions` 배열을 조합해 어떤 함수를 반환해야 하므로 반홚 타입은 `Function`으로 설정한다.

```ts
const pipe = (...functions: Function[]): Function
```

- 그런데 `pipe`로 조합된 결과 함수는 애리티가 1이다. 따라서 다음처럼 매개변수 `x`를 입력받은 함수를 작성한다. 그런데 이 내용을 제네릭 타입으로 표현하면 타입 `T`의 값 `x`를 입력받아 `(T) => R` 타입의 함수를 반환하는 것이 된다.

```ts
const pipe = <T, R>(...functions: readonly Function[]): Function => (x: T): (T) => R => {}
```

### 📚 부분 함수와 함수 조합
- 고차 함수의 부분 함수는 함수 조합에 사용될 수 있다.

```ts
const add = x => y => x + y;
const inc = add(1);

const add3 = pipe(
  inc,
  add(2),
);

console.log(add3(1)) // 4
```


### 📚 포인트가 없는 함수
- 다음 `map` 함수는 함수 조합을 고려해 설계한 것으로, `map(f)` 형태의 부분 함수를 만들면 `compose`나 `pipe`에 사용할 수 있다. 이처럼 함수 조합을 고려해 설계한 함수를 **포인트가 없는 함수**라고 한다.

```ts
const map = f => a => a.map(f);

const square = value => value * value;
const squareMap = map(square);

const fourSquare = pipe(
  squareMap,
  squareMap,
);

console.log(fourSquare([3, 4])); // [81, 256]
```

- 이번엔 `reduce`를 사용하는 포인트가 없는 함수를 만든다. 다음 `reduce` 함수는 배열의 `reduce` 함수를 2차 고차 함수 형태로 재구성한 예이다.

```ts
const reduce = (f, initValue) => a => a.reduce(f, initValue);

const sum = (result, value) => result + value;

const sumArray = reduce(sum, 0);

const pitagoras = pipe(
  squareMap,
  sumArray,
  Math.sqrt
);

console.log(pitagoras([3, 4])); // [9, 16] => 25 => 5
```
