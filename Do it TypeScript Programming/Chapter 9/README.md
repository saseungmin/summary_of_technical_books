# 🐤 Chapter 9: 람다 라이브러리

- 자세한 내용은 책을 참고합시당 (P.199 ~ P.258)

## 🦄 람다 기본 사용법

### 📚 R.range 함수

```ts
import * as R from 'ramda';

console.log(R.range(1, 9 + 1)); // [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

### 📚 R.tap 디버깅용 함수
- `R.tap` 함수는 2차 고차 함수 형태로 현재 값을 파악할 수 있게 해준다.

```ts
import * as R from 'ramda';

const numbers: number[] = R.range(1, 9 + 1);

R.tap(n => console.log(n))(numbers); // [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

### 📚 R.pipe 함수

```ts
import * as R from 'ramda';

const array: number[] = R.range(1, 10);

R.pipe(R.tap(n => console.log(n)))(array); // [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

### 📚 포인트가 없는 함수

```ts
import * as R from 'ramda';

const dump = <T>(array: T[]): T[] => R.pipe(
  R.tap(n => console.log(n))
)(array) as T[]; // 타입 단언 사용

dump(R.range(1, 10)); // [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

### 📚 자동 커리 이해하기

```ts
import * as R from 'ramda';

console.log(
  R.add(1, 2),  // 3
  R.add(1)(2),  // 3
);
```

### 📚 R.curryN 함수
- N개의 매개변수를 가진 1차 함수(first function)를 N개의 커리 매개변수를 가지는 N차 고차 함수로 만들어 준다.

```ts
import * as R from 'ramda';

const sum  = (...numbers: number[]): number =>
  numbers.reduce((result: number, sum: number) => result + sum, 0);

const curriedSum = R.curryN(4, sum);

console.log(
  curriedSum(), // [Function (anonymous)]
  curriedSum(1), // [Function (anonymous)]
  curriedSum(1)(2), // [Function (anonymous)]
  curriedSum(1)(2)(3), // [Function (anonymous)]
  curriedSum(1)(2)(3)(4), // 10
);
```

### 📚 순수 함수
- 람다 라이브러리가 제공하는 함수들은 항상 입력 변수의 상태를 변화시키지 않고 새로운 값을 반환한다.

## 🦄 배열에 담긴 수 다루기

### 📚 선언형 프로그래밍
- 선언형 프로그래밍에서 모든 입력 데이터는 다음처럼 단순 데이터보다배열 형태를 주로 사용한다.

```ts
const value = 1;

const newArray = R.pipe(
  R.map(R.inc)
)([value]) // [2]
```

- `R.pipe` 안에서는 `console.log()`문을 직접 사용할 수 없으므로 반드시 `R.tap` 함수를 사용해야 한다.

### 📚 사칙 연산 함수

```ts
R.add(a: number)(b: number); // a + b
R.subtract(a: number)(b: number); // a - b
R.multiply(a: number)(b: number); // a * b
R.divide(a: number)(b: number); // a / b
```

### 📚 R.addIndex 함수
- `Array.map`은 두 번째 매개변수로 `index`를 제공하지만, `R.map`은 `Array.map`과 다르게 `index` 매개변수를 기본적으로 제공하지 않는다. 따라서 `R.addIndex` 함수를 사용해 `R.map`이 `index`를 제공하는 새로운 함수를 만들어야 한다.

```ts
import * as R from 'ramda';

const addIndex = R.pipe(
  R.addIndex(R.map)(R.add),
  // R.addIndex(R.map)((value: number, index: number) => R.add(value)(index)),
  R.tap(a => console.log(a)) // [1, 3, 5, 7, 9, 11, 13, 15, 17]
);

const newNumbers = addIndex(R.range(1, 9 + 1));
```

### 📚 R.flip 함수
- 람다는 `R.flip`이라는 함수를 제공하는데 `R.flip`은 `R.subtract`와 같은 2차 고차 함수의 매개 변수 순서를 바꿔준다.

```ts
import * as R from 'ramda';

const reverseSubtract = R.flip(R.subtract);

const newArray = R.pipe(
  R.map(reverseSubtract(10)), // value - 10
  R.tap(a => console.log(a)), // [ -9, -8, -7, -6, -5, -4, -3, -2, -1 ]
)(R.range(1, 9 + 1));
```

### 📚 사칙 연산 함수들의 조합

> f(x) = ax<sup>2</sup> + bx + c

```ts
import * as R from 'ramda';

type NumberToNumberFunc = (number) => number;

// 람다를 사용하지 않음
//const f = (a: number, b: number, c: number): NumberToNumberFunc =>
//  (x: number): number => a * x ** 2 + b * x + c;

// 람다 함수 사용
const exp = (N: number) => (x: number) => x ** N;
const square = exp(2);

export const f = (a: number, b: number, c: number): NumberToNumberFunc =>
  (x: number): number => R.add(
    R.add(
      R.multiply(a)(square(x))
    )(R.multiply(b)(x)),
    c
  );
```

## 🦄 서술자와 조건 연산

### 📚 수의 크기를 판단하는 서술자
- 수를 비교해 `true`나 `false`를 반환하는 다음의 서술자들을 제공한다.

```ts
R.lt(a)(b): boolean // a < b 이면 true, a가 b보다 작음
R.lte(a)(b): boolean // a <= b 이면 true, a가 b보다 작거나 같음
R.gt(a)(b): boolean // a > b 이면 true, a가 b보다 큼
R.gte(a)(b): boolean // a >= b 이면 true, a가 b보다 크거나 같음
```

- 배열의 아이템 중 3보다 크거나 같은 수만 선택

```ts
import * as R from 'ramda';

R.pipe(
  R.filter(R.lte(3)),
  R.tap(n => console.log(n)) // [3, 4, 5, 6, 7, 8, 9, 10]
)(R.range(1, 10 + 1));
```

### 📚 R.allPass 로직 함수
- `R.lt`, `R.gt`처럼 `boolean` 타입의 값을 반환하는 함수들은 `R.allPass`와 `R.anyPass`라는 로직 함수를 통해 결합할 수 있다.

```ts
R.allPass(서술자배열) // 배열의 조건을 모두 만족하면 true
R.anyPass(서술자배열) // 배열의 조건을 하나라도 만족하면 true
```

- 다음 예는 `x`가 `min <= x < max` 조건을 만족하는지 `R.allPass` 함수를 사용해 확인한다.

```ts
import * as R from 'ramda';

type NumberToBooleanFunc = (n: number) => boolean;

export const selectRange = (min: number, max: number): NumberToBooleanFunc =>
  R.allPass([
    R.lte(min),
    R.gt(max),
  ]);
```

### 📚 R.not 함수
- 입력값이 `true`이면 `false`를 반환하고 `false`이면 `true`를 반환하는 함수이다.
- 이전에 구현한 `selectRange`와 반대로 작용하는 `notRange`를 구현할 수 있다.

```ts
import * as R from 'ramda';
import { selectRange } from './selectRange';

export const notRange = (min: number, max: number) => 
  R.pipe(selectRange(min, max), R.not);
```

### 📚 R.ifElse 함수
- `R.ifElse` 함수는 세 가지 매개변수를 포함하는데, 첫 번째는 `true/false`를 반환하는 서술자를, 두 번째는 선택자가 `true`를 반환할 때 실행할 함수를 세 번째는 선택자가 `false`를 반환할 때 실행할 함수이다.
- 다음 코드는 1부터 10까지 수에서 중간값 6보다 작은 수는 1씩 감소시키고, 같거나 큰 수는 1씩 증가시키는 것을 구현한 예이다.

```ts
import * as R from 'ramda';

const input: number[] = R.range(1, 10 + 1);
const halfVale = input[input.length / 2]; // 6

const subtractOrAdd = R.pipe(
  R.map(R.ifElse(
    R.lte(halfVale), // 조건 서술자: x => half <= x,
    R.inc, // true 일 때 실행할 함수
    R.dec, // false 일 때 실행할 함수
  )),
  R.tap(a => console.log(a)), // [0, 1, 2, 3, 4, 7, 8, 9, 10, 11]
);

const result = subtractOrAdd(input);
```

## 🦄 문자열 다루기

- 문자열 앞뒤의 백색 문자 자르기

```ts
import * as R from 'ramda';

R.trim('\t hello \n'); // hello
```

- 대소문자 전환

```ts
import * as R from 'ramda';

R.toUpper('Hello'); // HELLO
R.toLower('HELLO'); // hello
```

- 문자열을 배열로 변환과 배열을 문자열로 변환

```ts
import * as R from 'ramda';

const words: string[] = R.split(' ')(`Hello world!, I'm Peter.`);
// ['Hello', 'world!,', "I'm", 'Peter.']

R.join(' ')(words);
// "Hello world!, I'm Peter."
```

## 🦄 chance 패키지로 객체 만들기
- 예제를 따라 해봄. (P.225 ~ P.232)

> src/model directory 참고

## 🦄 렌즈를 활용한 객체의 속성 다루기

### 📚 렌즈란?
- 렌즈는 하스켈 언어의 `Control.Lens` 라이브러리 내용 중 자바스크립트에서 동작할 수 있는 게터와 세터 기능만을 람다 함수로 구현한 것이다. 람다의 렌즈 기능을 활용하면 객체의 속성값을 얻거나 설정하는 등의 작업을 쉽게 할 수 있다.

> 1. `R.lens` 함수로 객체의 특정 속성에 대한 렌즈를 만든다.
> 2. 렌즈를 `R.view` 함수에 적용해 속성값을 얻는다.
> 3. 렌즈를 `R.set` 함수에 적용해 속성값이 바뀐 새로운 객체를 얻는다.
> 4. 렌즈와 속성값을 바꾸는 함수를 `R.over` 함수에 적용해 값이 바뀐 새로운 객체를 얻는다.

### 📚 R.prop과 R.assoc 함수
- `R.prop`는 객체의 특정 속성값을 가져오는 함수로서, 이런 동작을 하는 함수를 **게터**라고 한다.

```ts
import * as R from 'ramda';

import { IPerson, makeRandomIPerson } from "./model/person";

const person: IPerson = makeRandomIPerson();

const name = R.pipe(
  R.prop('name'),
  R.tap(name => console.log(name)), // 랜덤 생성된 이름
)(person);
```

- 객체의 특정 속성값을 변경하려면 `R.assoc` 함수를 사용하는데, 이런 목적으로 사용하는 함수를 **세터**라고 한다.

```ts
import * as R from 'ramda';

import { IPerson, makeRandomIPerson } from './model/person';

const getName = R.pipe(R.prop('name'), R.tap(name => console.log(name)));

const person: IPerson = makeRandomIPerson();
const originalName = getName(person); // 랜덤 생성된 이름

const modifiedPerson = R.assoc('name', 'Seungmin')(person);
const modifiedName = getName(modifiedPerson); // Seungmin
```

### 📚 R.lens 함수
- 렌즈는 다음처럼 `R.lens`, `R.prop`, `R.assoc`의 조합으로 만들 수 있다.

```ts
export const makeLens = (propName: string) => R.lens(R.prop(propName), R.assoc(propName));
```

### 📚 R.view, R.set, R.over 함수
- `R.view`, `R.set`, `R.over` 함수에 렌즈를 적용해서 다음과 같은 게터와 세터 그리고 `setterUsingFunc`과 같은 함수를 만들 수 있다.

```ts
import * as R from 'ramda';

export const makeLens = (propName: string) => 
  R.lens(R.prop(propName), R.assoc(propName));

export const getter = (lens) => R.view(lens);
export const setter = (lens) => <T>(newValue: T) => R.set(lens, newValue);
export const setterUsingFunc = (lens) => <T, R>(func: (T) => R) => R.over(lens, func);
```

- 위 코드를 사용한 `lens.ts`의 함수들을 테스트는 `lens-test.ts`를 참고

### 📚 R.lensPath 함수
- 람다 라이브러리에서는 객체의 중첩 속성을 경로(path)라고 한다. `longitude`처럼 긴 경로의 속성을 렌즈로 만들려면 `R.lensPath` 함수를 사용한다.

```ts
렌즈 = R.lensPath(['location', 'coordinates', 'longitude']);
```

- 이렇게 렌즈를 만들었으면 앞에서 구현한 `lens.ts`의 게터와 세터 그리고 `setterUsingFunc` 함수에 바로 적용할 수 있다.

```ts
import * as R from 'ramda';

import { getter, setter, setterUsingFunc } from './lens';
import { IPerson, makeRandomIPerson } from './model/person';

const longitudeLens = R.lensPath(['location', 'coordinates', 'longitude']);
const getLongitude = getter(longitudeLens);
const setLongitude = setter(longitudeLens);
const setLongitudeUsingFunc = setterUsingFunc(longitudeLens);

const person: IPerson = makeRandomIPerson();

const longitude = getLongitude(person);
const newPerson = setLongitude(0.1234567)(person);
const anotherPerson = setLongitudeUsingFunc(R.add(0.1234567))(person);

console.log(
  longitude, getLongitude(newPerson), getLongitude(anotherPerson),
);
// 91.00362 0.1234567 91.1270767
```

## 🦄 객체 다루기

### 📚 R.toPairs와 R.fromPairs 함수
- `R.toPairs` 함수는 객체의 속성들을 분해해 배열로 만들어준다. 이때 배열의 각 아이템은 `[string, any]` 타입의 튜플이다.

```ts
import * as R from 'ramda';

import { IPerson, makeRandomIPerson } from './model/person';

const person: IPerson = makeRandomIPerson();
const pairs: [string, any][] = R.toPairs(person);

console.log('pairs', pairs);
```

- R.fromPairs 함수는 `[키:값]` 형태의 아이템을 가진 배열을 다시 객체로 만들어 준다.

```ts
import * as R from 'ramda';

import { IPerson, makeRandomIPerson } from './model/person';

const pairs: [string, any][] = R.toPairs(makeRandomIPerson());
const person: IPerson = R.fromPairs(pairs) as IPerson;

console.log('person: ', person);
```

### 📚 R.keys와 R.values 함수
- `R.keys` 함수는 객체의 속성 이름만 추려서 `string[]` 타입 배열로 반환한다.

```ts
import * as R from 'ramda';

import { makeRandomIPerson } from './model/person';

const keys: string[] = R.keys(makeRandomIPerson());

console.log('keys: ', keys); // keys: ['name', 'age', 'title', 'location']
```

- `R.values` 함수는 객체의 속성값만 추려서 `any[]` 타입 배열로 반환한다.

```ts
import * as R from 'ramda';

import { makeRandomIPerson } from './model/person';

const values: any[] = R.values(makeRandomIPerson());

console.log('values: ', values);
```

### 📚 R.zipObj 함수
- `R.zipObj` 함수는 *키 배열*과 *값 배열*이라는 두 가지 매개변수를 결합해 객체로 만들어 준다.

```ts
import * as R from 'ramda';

import { IPerson, makeRandomIPerson } from './model/person';

const originalPerson: IPerson = makeRandomIPerson();
const keys: string[] = R.keys(originalPerson);
const values: any[] = R.values(originalPerson);
const zippedPerson: IPerson = R.zipObj(keys, values) as IPerson;

console.log(
  'originalPerson: ', originalPerson,
  'zippedPerson: ', zippedPerson,
);
```

### 📚 R.mergeLeft와 R.mergeRight 함수
- `R.mergeLeft`와 `R.mergeRight` 함수는 두 개의 객체를 입력받아 두 객체의 속성들을 결합해 새로운 객체를 생성한다.

```ts
새로운객체 = R.mergeLeft(객체1)(객체2); // 속성값이 다를 때 왼쪽 객체의 우선순위가 높음
새로운객체 = R.mergeRight(객체1)(객체2); // 속성값이 다를 때 오른쪽 객체의 우선순위가 높음
```

- 다음 결과는 `left` 쪽의 `name` 속성값이 설정된다.

```ts
import * as R from 'ramda';

const left = { name: 'Jack' };
const right = { name: 'Jane', age: 32 };

const person = R.mergeLeft(left, right);
console.log(person); // { name: 'Jack', age: 32 }
```

### 📚 R.mergeDeepLeft와 R.mergeDeepRight 함수
- `R.mergeLeft`와 `R.mergeRight` 함수는 객체의 속성에 담긴 객체를 바꾸지는 못한다.
- 반면에 이 두 함수들은 아래 예제와 같이 `location`, `coordinates`와 같은 경로의 속성값들도 바꿀 수 있다.

```ts
import * as R from 'ramda';

import { IPerson, makeRandomIPerson } from './model/person';
import { ILocation, makeRandomILocation } from './model/location';
import { ICoordinates, makeRandomICoordinates } from './model/coordinates';

const person: IPerson = makeRandomIPerson();
const location: ILocation = makeRandomILocation();
const coordinates: ICoordinates = makeRandomICoordinates();

const newLocation = R.mergeDeepRight(location, { coordinates });
const newPerson = R.mergeDeepRight(person, { location: newLocation });

console.log('person: ', person);
console.log('newPerson: ', newPerson);
```

## 🦄 배열 다루기

### 📚 R.prepend와 R.append 함수
- `R.prepend`와 `R.append`는 기존 배열의 앞뒤에 새 아이템을 삽입한 새 배열을 만들어 준다.

```ts
import * as R from 'ramda';

const array: number[] = [3, 4];
const newPrependArray = R.prepend(1)(array);

console.log(newPrependArray); // [1, 3, 4]

const newAppendArray = R.append(1)(array);

console.log(newAppendArray); // [3, 4, 1]
```

### 📚 R.flatten 함수
- 배열의 구조가 다음처럼 복잡하게 구성되어 있으면, 이 배열을 대상으로 람다 라이브러리의 기능을 적용하는 것은 어렵다.

```js
[[[1, 1], [1, 2]], [[2, 1], [2, 2]]]
```

- `R.flatten` 함수는 위처럼 복잡한 1차원의 평평한 배열로 바꿔준다.

```ts
import * as R from 'ramda';

const array = [[[1, 1], [1, 2]], [[2, 1], [2, 2]]];

const flattendArray = R.flatten(array);
console.log(flattendArray); // [1, 1, 1, 2, 2, 1, 2, 2]
```

### 📚 R.unnest 함수
- `R.unnest` 함수는 `R.flatten`보다 좀더 정교하게 배열을 가공해준다.

```ts
const array = [[[1, 1], [1, 2]], [[2, 1], [2, 2]]];

const unnestedArray = R.unnest(array);
console.log(unnestedArray); //[[1, 1], [1, 2], [2, 1], [2, 2]]

const twoUnnestedArray = R.pipe(R.unnest, R.unnest)(array);
console.log(twoUnnestedArray); // [1, 1, 1, 2, 2, 1, 2, 2]
```

### 📚 R.sort 함수
- 배열의 타입이 `number[]`라면 `R.sort` 함수를 사용해 배열을 내림차순이나 오름차순으로 정렬할 수 있다.

```ts
import * as R from 'ramda';

const array: number[] = [5, 6, 2, 1, 7, 9, 8, 3, 4];
const sortedArray = R.sort((a: number, b: number): number => a - b)(array);

console.log(sortedArray); // [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

### 📚 R.sortBy 함수
- 배열에 담긴 아이템이 객체라면 특정 속성값에 따라 정렬해야 하는데, 이때 `R.sortBy` 함수를 사용한다.

```ts
import * as R from 'ramda';

import { IPerson, makeRandomIPerson } from './model/person';

const persons: IPerson[] = R.range(1, 4 + 1).map(makeRandomIPerson);
const nameSortedPersons = R.sortBy(R.prop('name'))(persons);
const ageSortedPersons = R.sortBy(R.prop('age'))(persons);
```

### 📚 R.sortWith 함수
- `R.sortBy` 함수는 오름차순 내림차순 정렬을 하지 못하고 항상 오름차순으로만 정렬한다.
- `R.sortWith` 함수는 `R.ascend`, `R.descend` 함수와 함께 사용되어 오름차순, 내림차순 정렬을 할 수 있다.

```ts
import * as R from 'ramda';

import { IPerson, makeRandomIPerson } from './model/person';

const persons: IPerson[] = R.range(1, 4 + 1).map(makeRandomIPerson);
const nameSortedPersons = R.sortWith([
  R.descend(R.prop('name'))
])(persons);
```

## 🦄 조합 논리 이해하기
- 람다 수학의 모든 이론을 컴퓨터 프로그래밍 언어로 표현할 수 없으므로 어떤 제한된 범위에서 람다 수학을 구현하기 위해 조합 논리학이 생겨났다.

### 📚 조합자란?
- 조합 논리학은 조합자(combinator)라는 특별한 형태의 고차 함수들을 결합해 새로운 조합자를 만들어 내는 것이다. 이는 함수형 언어의 컴파일러를 만드는 데 필요한 이론을 검증하고 개발할 때 주로 사용된다.
- 람다 라이브러리에서 몇 가지 유명한 조합자를 제공한다.

|조합자 이름|의미|람다 함수 이름|
|:---:|:---:|:---:|
|I|identity|R.identity|
|K|constant|R.always|
|T|thrush|R.applyTo|
|W|duplication|R.unnest|
|C|flip|R.flip|
|S|substitution|R.ap|

### 📚 R.chain 함수 탐구
- 람다 라이브러리는 `R.chain`이라는 함수를 제공한다. 이 함수는 함수를 매개변수로 받아 동작하는 함수로서, 매개변수가 한 개일 때와 두 개일 때의 동작이 조금 다르다.

```ts
import * as R from 'ramda';

const array = [1, 2, 3];

R.pipe(
  R.chain(n => [n, n]),
  R.tap(n => console.log(n)), // [1, 1, 2, 2, 3, 3]
)(array);

R.pipe(
  R.chain(R.append, R.head),
  R.tap(n => console.log(n)), // [1, 2, 3, 1]
)(array);
```

- `R.chain` 함수는 매개변수가 한 개일 때는 다음 `flatMap` 함수처럼 동작한다.

```ts
import * as R from 'ramda';

const array = [1, 2, 3];

const flatMap = (f) => R.pipe(
  R.map(f),
  R.flatten,
);

R.pipe(
  flatMap(n => [n, n]),
  R.tap(n => console.log(n)), // [1, 1, 2, 2, 3, 3]
)(array);
```

- 매개변수가 두 개일 때는 다음 코드의 `chainTwoFunc` 함수처럼 동작한다.

```ts
import * as R from 'ramda';

const chainTwoFunc = (firstFn, secondFn) => (x) => firstFn(secondFn(x), x);

const array = [1, 2, 3];

R.pipe(
  chainTwoFunc(R.append, R.head), // array => R.append(R.head(array))(array)
  R.tap(n => console.log(n)), // [1, 2, 3, 1]
)(array);
```

### 📚 R.flip 조합자
- `R.flip`함수는 2차 고차 함수의 매개변수 순서를 서로 바꿔주는 역할을 한다.

```ts
// flip 함수처럼 구현되어 있다.
const flip = cb => a => b => cb(b)(a);
```

### 📚 R.identity 조합자
- `R.identity`는 다음처럼 구현된 가장 단순한 조합자이지만, 조합자의 구조상 반드시 함수가 있어야 하는 곳에 위치할 때 그 위력을 발휘한다.

```ts
const identity = x => x;
```

- 앞서 구현한 `flatMap` 함수는 콜백 함수가 한 개 필요하다. 다음 코드는 `flatMap` 함수가 요구하는 콜백 함수에 `R.identity` 조합자를 사용한 예이다. `unnest` 함수는 `R.unnest` 함수와 똑같이 동작한다.

```ts
import * as R from 'ramda';

import { flatMap } from './flatMap';

const unnest = flatMap(R.identity);

const array = [[1], [2], [3]];

R.pipe(
  unnest,
  R.tap(n => console.log(n)), // [1, 2, 3]
)(array);
```

### 📚 R.always 조합자
- `R.always` 조합자는 다음처럼 두 개의 고차 매개변수 중 첫 번째 것을 반환한다.

```ts
const always = x => y => x;
```

- `R.always`는 두 개의 매개변수가 필요한 조합자에 마치 `R.identity`처럼 사용된다. 비록 `R.always`는 항상 첫 번째 매개변수값만 반환하지만, `R.flip(R.always)`는 반대로 항상 두 번째 매개변수값만 반환한다.

```ts
import * as R from 'ramda';

const always = a => b => a;
const flip = cb => a => b => cb(b)(a);

const first = <T>(a: T) => (b: T): T => always(a)(b);
const second = <T>(a: T) => (b: T): T => flip(always)(a)(b);

console.log(first(1)(2), second(1)(2)); // 1 2
```

### 📚 R.applyTo 조합자
- 특별하게 값을 첫 번째 매개변수로, 그리고 이 값을 입력으로 하는 콜백 함수를 두 번째 매개변수로 받아 다음 코드처럼 동작한다.

```ts
const applyTo = value => cb => cb(value);
```

- 다음은 `R.applyTo` 예제이다.

```ts
import * as R from 'ramda';

const T = value => R.pipe(
  R.applyTo(value),
  R.tap(value => console.log(value)),
);

const value100 = T(100);
const sameValue = value100(R.identity); // 100
const add1Value = value100(R.add(1)); // 101
```

### 📚 R.ap 조합자
- `R.ap` 조합자는 콜백 함수들의 배열을 첫 번째 매개변수로, 배열을 두 번째 매개변수로 일벽받는 2차 고차 함수이다.

```ts
const ap = ([콜백 함수]) => 배열 => [콜백함수](배열);
```

- `R.ap`는 콜백 함수가 한 개일 때는 마치 `R.map` 함수처럼 동작한다.

```ts
import * as R from 'ramda';

const callAndAppend = R.pipe(
  R.ap([R.multiply(2)]),
  R.tap(a => console.log(a)),
);

const input = [1, 2, 3];
const result = callAndAppend(input); // [2, 4, 6]
```

- 그런데 콜백 함수가 다음처럼 두 개일 때는 마치 `R.chain(n => [n, n])` 형태로 동작한다.
- `R.ap`는 두 콜백 함수를 적용한 각각의 배열을 만든 다음, 연산이 끝나면 이 배열을 모두 통합해 한 개로 만들어준다.

```ts
import * as R from 'ramda';

const callAndAppend = R.pipe(
  R.ap([R.multiply(2), R.add(10)]),
  R.tap(a => console.log(a)),
);

const input = [1, 2, 3];
const result = callAndAppend(input); // [2, 4, 6, 11, 12, 13]
```

- 다음 코드는 `R.ap` 조합자의 이런 성질을 이용해 `[1, 2, 3]` 배열을 세 번 복제한 뒤 통합한 배열을 만드는 예이다.

```ts
import * as R from 'ramda';

const repeat = (N, cb) => R.range(1, N + 1).map(n => cb);

const callAndAppend = R.pipe(
  R.ap(repeat(3, R.identity)),
  R.tap(a => console.log(a)),
);

const input = [1, 2, 3];
const result = callAndAppend(input); // [1, 2, 3, 1, 2, 3, 1, 2, 3]
```
