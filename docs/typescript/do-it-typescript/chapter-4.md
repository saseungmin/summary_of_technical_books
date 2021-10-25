---
sidebar_position: 5
sidebar_label: 4. 함수와 메서드
---

# 🐤 Chapter 4: 함수와 메서드

## 🦄 함수 선언문

- 자바스크립트에서 함수는 `function` 키워드로 만드는 함수와 `=>` 기호로 만드는 화살표 함수 두 가지 있다.
- 타입스크립트 함수 선언문은 자바스크립트 함수 선언문에서 **매개변수와 함수 반환값에 타입 주석을 붙이는 다음 형태로 구성된다.**

```ts
function add(a: number, b: number): number {
  return a + b;
}

let result = add(1, 2);
```

### 📚 매개변수와 반환값의 타입 주석 생략
- 함수 선언문에서도 매개변수와 반환값에 대한 타입 주석을 생략할 수 있다.
- 다만, 변수 때와는 달리 **함수의 매개변수 타입과 반환 타입을 생략하는 것은 바람직하지 않다.** 왜냐하면, 타입이 생략되어 있으면 함수의 구현 의도를 알기 어렵고 잘못 사용하기 쉽기 때문이다.

### 📚 void 타입
- 값을 반환하지 않는 함수는 반환 타입이 `void`이다.
- `void` 타입은 함수 반환 타입으로만 사용할 수 있다.

```ts
function printMe(name: string, age: number): void {
  console.log(`name: ${name}, age: ${age}`);
}
```

### 📚 함수 시그니처
- 변수에 타입이 있듯이 함수 또한 타입이 있는데, 함수의 타입을 **함수 시그니처**라고 한다.

```
(매개변수1타입, 매개변수2타입[, ...]) => 반환값 타입
```

- 다음 `printMe` 함수는 `string`과 `number` 타입의 매개변수가 두 개 있고 반환 타입이 `void`이다.
- 따라서 함수 시그니처는 `(string, number) => void` 이다.

```ts
let printMe: (string, number) => void = function (name: string, age: number): void {}
```
- 만약 매개변수가 없으면 단순히 `()`로 표현한다. `() => void`는 매개변수도 없고 반환값도 없는 함수 시그니처이다.

### 📚 type 키워드로 타입 별칭 만들기
- 타입스크립트는 `type`이라는 키워드를 제공한다.
- `type` 키워드는 **기존에 존재하는 타입을 단순히 이름만 바꿔서** 사용할 수 있게 해준다.
- 이러한 기능을 **타입 별칭**(**type alias**)이라고 한다.

```ts
type 새로운타입 = 기존타입
```

- `(string, number) => void` 함수 시그니처를 `stringNumberFunc`이라는 이름으로 타입 별칭을 만든다.
- 이 별칭 덕분에 변수 `f`와 `g`에 타입 주석을 더 수월하게 붙일 수 있다.

```ts
type stringNumberFunc = (string, number) => void;
let f: stringNumberFunc = function(a: string, b: number): void {}
let g: stringNumberFunc = function(c: string, d: number): void {}
```

- 함수의 타입, 즉 함수 시그니처를 명시하면 매개변수의 개수나 타입, 반환 타입이 다른 함수를 선언하는 잘못을 미연에 방지할 수 있다.

```ts
// 생략...
let h: stringNumberFunc = function () {}
h(); // 2개의 인수가 필요한데 0개를 가져왔습니다.
```

### 📚 undefined 관련 주의 사항
- `undefined` 타입은 타입스크립트의 타입 계층도에서 모든 타입 중 최하위 타입이다.
- 다음은 `undefined`를 고려하지 않은 예이다.

```ts
interface INameable {
  name: string;
}

function getName(o: INameable) { return o.name; }

let n = getName(undefined); // 오류 발생
console.log(n);
```

- `getName`은 `INameable` 타입의 매개변수를 요구하지만, `undefined` 호출해도 구문 오류가 발생하지 않는다. 
- 즉, `undefined`는 **최하위 타입**이므로 `INameable`을 **상속하는 자식 타입**으로 간주한다.
- 하지만, 코드를 실행하면 오류가 발생한다.
- 다음은 `undefined`를 고려한 예이다.

```ts
interface INameable {
  name: string;
}

function getName(o: INameable) {
  return o != undefined ? o.name : 'unknown name';
}

let n = getName(undefined);
console.log(n); // unknown name
console.log(getName({ name: 'Jack' })); // Jack
```

- 만약 인터페이스에 선택 속성이 있다면 다음과 같이 구현해야 한다.

```ts
interface IAgeable {
  age?: number;
}

function getAge(o: IAgeable) {
  return o != undefined && o.age ? o.age : 0;
}

console.log(getAge(undefined)); // 0
console.log(getAge(null)); // 0
console.log(getAge({ age: 32 })); // 32
```

### 📚 선택적 매개변수

- 함수의 매개변수에도 다음처럼 이름 뒤에 물음표를 붙일 수 있으며, 이를 **선택적 매개변수**라고 한다.

```ts
function fn(arg1: string, arg?: number): void {}
```

- 선택적 매개변수는 다음 코드에서 함수 호출을 모두 가능하게 하고 싶을 때 사용한다.

```ts
function fn(arg1: string, arg?: number) { console.log(`arg: ${arg}`); }

fn('hello', 1); // arg: 1
fn('hello'); // arg: undefined
```

- 선택적 매개변수가 있는 함수의 시그니처는 다음처럼 타입 뒤에 물음표를 붙인다.

```ts
type OptionalArgFunc = (string, number?) => void
```

## 🦄 함수 표현식
  
### 📚 함수는 객체다
- 자바스크립트에서 함수는 `Function` 클래스의 인스턴스이다.
- 다음 코드의 `add`는 함수로서 동작한다는 의미이다.

```ts
let add = new Function('a', 'b', 'return a + b');
let result = add(1, 2);
console.log(result); // 3
```

- `add` 함수는 다음과 같은 형태로도 구현할 수 있다.

```ts
let add2 = function(a, b) { 
  return a + b; 
}

console.log(add2(1, 2)); // 3
```

- 이처럼 함수 선언문에서 함수 이름을 제외한 `function(a, b) { return a + b; }`와 같은 코드를 **함수 표현식**(**function expression**)이라고 한다.

### 📚 일등 함수
- 프로그래밍 언어가 일등 함수(first-class function) 기능을 제공하면 함수형 프로그래밍 언어라고 한다.
- 자바스크립트와 타입스크립트는 일등 함수 기능이 있으므로 함수형 프로그래밍 언어이다.
- **일당 함수란, 함수와 변수를 구분하지 않는다는 의미이다.**
- 예를 들어 다음 코드에서 `f`는 `let` 키워드가 앞에 있으므로 변수이다. `f`는 변수이므로 값을 저장할 수 있다. 변수 `f`에는 `a + b` 형태의 함수 표현식을 저장했다.
- 하지만 `f`는 변수이므로 2행처럼 `a - b` 형태의 함수 표현식도 저장할 수 있다.

```ts
let f = function(a, b) { return a + b; }
f = function(a, b) { return a - b; }
```
- 심벌 `f`가 변수인지 함수인지 사실상 구분할 수 없다. 이것이 변수와 함수를 차별하지 않는다는 의미이다.

### 📚 표현식
- 프로그래밍 언어에서 표현식(expression)이라는 용어는 리터럴, 연산자, 변수, 함수 호출 등이 복합적으로 구성된 코드 형태를 의미한다.
- 예를 들어, `1 + 2`는 1 과 2라는 리터럴과 덧셈 연산자 `+`로 구성된 표현식이다.

### 📚 함수 표현식
- 앞에서 작성한 변수 `f`에는 `function(a, b) { return a + b; }`마치 값처럼 대입하는데, 이 `function(a, b) { return a + b; }` 부분을 함수 표현식이라고 한다.

### 📚 계산법
- 컴파일러는 표현식을 만나면 계산법을 적용해 어떤 값을 만드는데 계산법에는 조급한 계산법과 느긋한(지연) 계산법 두 가지가 있다.
- 컴파일러가 `1 + 2`라는 표현식을 만나면 조급한 계산법을 적용해 3이라는 값을 만들고, 컴파일러가 `function(a, b) { return a + b; }`라는 함수 표현식을 만나면, 심벌 `a`와 `b`가 어떤 값인지 알 수 없어서 느긋한 계산법을 적용해 계산을 보류한다.

### 📚 함수 호출 연산자
- 어떤 변수가 함수 표현식을 담고 있다면, 변수 이름 뒤에 함수 호출 연산자 `()`를 붙여서 호출할 수 있다.

```ts
let functionExpression = function(a, b) { return a + b; }
let value = functionExpression(1, 2); // (1, 2): 함수 호출 연산자
```
- **컴파일러는 함수 호출문을 만나면 지금까지 미뤘던 함수 표현식에 조급한 계산법을 적용해 함수 표현식을 값으로 바꾼다.** ( `return 1 + 2 => return 3` )

### 📚 익명 함수
- 함수 표현식은 사실 대부분 언어에서 언급되는 익명 함수(anonymous function)의 다른 표현이다.

```ts
let value = (function(a, b) {return a + b; })(1, 2) // 3
```
- 다음 코드는 앞의 한 줄까지 코드를 쉽게 분석하고자 세 줄로 나눈 것이다.

```ts
let value = 
(function(a, b) { return a + b })
(1, 2) // 3
```
- 컴파일러는 2행의 **익명 함수 부분에 게으른 계산법을 적용**해 그 상태로 놔두지만, 곧바로 3행의 **함수 호출 연산자를 만나므로** 2행의 함수 몸통에 **조급한 계산법**을 적용해 최종적으로 3이라는 값을 만들어 낸다.

### 📚 const 키워드와 함수 표현식
- 함수 표현식을 담는 변수는 `let` 보다는 `const` 키워드로 선언하는 것이 바람직하다.
- 함수 표현식을 담은 변수를 `const`키워드로 선언하면, 함수 내용이 이후에 절대로 바뀔 수 없다.

```ts
const f = () => {}
```

## 🦄 화살표 함수와 표현식 문
- 화살표 함수의 몸통은 `function` 때와는 다르게 다음처럼 중괄호를 사용할 수도 있고 생략할 수도 있다.

```ts
const arrow1 = (a: number, b: number): number => { return a + b }
const arrow2 = (a: number, b: number): number => a + b;
```

- 중괄호 사용 여부에 따라 타입스크립트 문법이 동작하는 방식이 실행문(execution statement) 방식과 표현식 문(expression statement) 방식으로 달라진다.

### 📚 실행문과 표현식 문
- 다음처럼 변수에 값을 대입하는 것은 대표적인 실행문이다.

```ts
let x
x = 1
```
- 반면에 다음과 같은 코드에서 `x > 10` 부분은 CPU가 평가한 후 `true`나 `false`라는 값으로 결과를 알려주지 않으면 `if`문이 정상적으로 동작할 수 없다.

```ts
let x = 10
if(x > 0)
  x = 1
```

- 그런데 만일 프로그래밍 문법이 다음과 같다면 코드를 작성하기게 번거로워진다.

```js
if(return x > 0)
  x = 1
```

- 즉, 똑같이 CPU에서 실행되는 구문이더라도 x > 0처럼 `return` 키워드 없이 결괏값을 반환하는 실행문이 필요하다. 이를 **표현식 문**이라고 구분해서 부른다.

### 📚 복합 실행문
- 프로그래밍 언어에서 `if`와 같은 구문은 다음처럼 조건을 만족하면 단순히 한 줄의 실행문만을 실행하는 형태로 설계한다.

```js
if(조건식)
  실행문
```

- 이런 설계가 가능한 이유는 복합 실행문이라는 또 다른 형태를 함께 제공하기 때문이다.

```js
if(조건식) {
  실행문1
  실행문2
}
```

- 복합 실행문은 컴파일러로 하여금 여러 실행문을 한 개처럼 인식하게 한다. 따라서 컴파일러는 앞의 형태로 작성된 `if`문은 여전히 한 줄의 실행문으로 인식한다.

### 📚 함수 몸통과 복합 실행문
- `function` 키워드로 만드는 함수는 반드시 몸통을 중괄호로 감싸야 하는데, 여기서 중괄호는 앞서 설명한 복합 실행문을 의미한다.
- 따라서 함수 몸통은 다음처럼 여러 중ㄹ로 구현할 수 있다.

```js
function f() {
  let x = 1, y = 2;
  let result = x + y + 10;
}
```

### 📚 return 키워드
- 실행문은 CPU에서 실행된 결과를 알려주지 않는다.
- 예를 들어, 함수 몸통을 복합 실행문으로 구현한 다음 함수는 `true`나 `false`를 반환하지 않는다.

```ts
function isGreater(a: number, b: number): boolean {
  a > b; // 결과 반환 x
}
```

- 실행문 기반 언어는 이 문제를 해결하려고 `return`이라는 키워드 도입했다.

```ts
function isGreater(a: number, b: number): boolean {
  return a > b; // true or false
}
```

### 📚 표현식 문 스타일의 화살표 함수 구현

- 다음 `function` 스타일 함수 `isGreater`를 호살표 함수로 구현하면 다음과 같다.

```ts
const isGreater = (a: number, b: number): boolean => {
  return a > b;
}
```

- `return`을 생략하고 다음처럼 구현할 수도 있다.

```ts
const isGreater = (a: number, b: number): boolean => a > b;
```

### 📚 표현식과 표현식 문의 차이
- 다음 코드에서 2행에 있는 `a > b` 코드는 C언어에서 표현식이라고 했기 때문에 그 이후에 만들어진 프로그래밍 언어들로 같은 의미로 표현식이라고 생각한다.
- 반면에 표현식 지향 언어 관점에서 3행의 `a > b` 코드는 그 자체가 실행문이다.

```ts
let a = 1, b = 0;
if(a > b) console.log('a is greater than b');
const isGreater = (a: number, b: number): boolean => a > b;
```
- 이 둘을 구분하고자 표현식과 표현식 문으로 구분한 것이다.

## 🦄 일등 함수 살펴보기

### 📚 콜백 함수
- 일등 함수(first-class-function) 기능을 제공하는 언어에서 함수는 함수 표현식이라는 일종의 값이다. 따라서 변수에 담을 수 있다.
- 이 말은 함수 표현식을 매개변수로 받을 수 있다는 것을 의미한다.
- 이처럼 매개변수 형태로 동작하는 함수를 콜백 함수라고 한다.
- 다음 코드는 콜백 함수 사용 예이다.

```ts
// init.ts
export const init = (callback: () => void): void => {
  console.log('default initialization finished.');
  callback();
  console.log('all initialization finished.');
}

// callback.ts
import { init } from "./init";

init(() => console.log('custom initialization finished.'));

// default initialization finished.
// custom initialization finished.
// all initialization finished.
```

### 📚 중첩함수
- 함수형 언어에서 함수는 변수에 담긴 함수 표현식이므로 함수 안에 또 다른 함수를 중첩해서 구현할 수 있다.

```ts
const calc = (value: number, cb: (number) => void): void => {
  let add = (a, b) => a + b;
  function multiply(a, b) {
    return a * b;
  }

  let result = multiply(add(1, 2), value);
  cb(result);
}

calc(30, (result: number) => console.log(`result is ${result}`));
// result is 90
```

### 📚 고차 함수와 클로저, 그리고 부분 함수
- 고차 함수(high-order function)는 **또 다른 함수를 반환하는 함수를 말한다.**
- 함수형 언어에서 함수는 단순히 함수 표현식이라는 값이므로 다른 함수를 반환할 수 있다.
- 다음은 고차 함수의 예이다.

```ts
const add = (a: number): (number) => number => (b: number): number => a + b;
const result = add(1)(2);
console.log(result); // 3
```

- 위 구문을 더 이해하기 쉬운 형태로 다시 구현한 것이다.
- 다음 코드는 `number` 타입의 매개변수를 받아 `number` 타입의 값을 반환하는 함수 시그니처를 `NumberToNumberFunc` 타입으로 정의한다.

```ts
type NumberToNumberFunc = (number) => number
```

- 이제 `NumberToNumberFunc` 타입의 함수를 반환하는 `add`와 같은 함수를 만들 수 있다.

```ts
export const add = (a: number): NumberToNumberFunc => {
  // NumberToNumberFunc 타입의 함수 반환
}
```

- 다음으로 `add`의 반환값을 중첩 함수로 구현할 수 있다.
- `_add`의 몸통을 구현하면 다음처럼 `add`라는 이름의 고차 함수가 완성된다.

```ts
export type NumberToNumberFunc = (number) => number
export const add = (a: number): NumberToNumberFunc => {
  const _add: NumberToNumberFunc = (b: number): number => {
    return a + b; // 클로저
  }
  return _add;
}
```

- `a`는 `_add` 함수의 관점에서만 보면 외부에서 선언된 변수이다.
- 함수형 프로그래밍 언어에서는 다음과 같은 형태를 **클로저(closure)** 라고 한다.
- `NumberToNumberFunc` 타입의 값을 반환하는 함수이므로 다음과 같은 코드를 작성할 수 있다.

```ts
let fn1: NumberToNumberFunc = add(1);
let result = fn1(2);
console.log(result); // 3

console.log(add(1)(2)); // 3
```

- 위와 같이 2차 고차함수인 `add`는 `add(1)(2)` 처럼 함수 호출 연ㄴ산자를 두 개 사용해야만 함수가 아닌 값을 얻을 수 있다.

```js
const multiply = a => b => c => a * b * c;
```
- 만약 3차 고차함수인 경우에 두 개만 붙이면 아직 값이 아닌 함수이다.
- 이것을 부분 애플리케이션 혹은 **부분 적용 함수**(**partially applied function**)라고 한다.

## 🦄 함수 구현 기법

### 📚 매개변수 기본값 지정하기
- 선택적 매개변수는 항상 그 값이 `undefined`로 고정된다.
- 만일, 함수 호출 시 인수를 전달하지 않더라도 매개변수에 어떤 값을 설정하고 싶다면 매개변수의 기본값을 지정할 수 있다.
- 이를 디폴트 매개변수라고 한다.

```ts
export type Person = {
  name: string, age: number
}

export const makePerson = (name: string, age: number = 10): Person => {
  const person = { name, age }; // 단축 구문
  return person;
}

console.log(makePerson('Jack')); // { name: 'Jack', age: 10 }
```

### 📚 객체를 반환하는 화살표 함수 만들기
- 컴파일러가 `{}`를 객체로 해석하게 하려면 다음처럼 객체를 소괄호로 감싸주어야 한다.

```ts
export const makePerson = (name: string, age: number = 10): Person => ({ name, age });
```

### 📚 매개변수에 비구조화 할당문 사용하기
- 함수의 매개변수도 변수의 일종이므로 다음처럼 비구조화 할당문을 적용할 수 있다.

```ts
export type Person = {
  name: string, age: number
}

export const makePerson = ({name, age}: Person): void => 
  console.log(`name: ${name}, age: ${age}`);

console.log(makePerson({ name: 'Jack', age: 10} )); // { name: 'Jack', age: 10 }
```

### 📚 색인 키와 값으로 객체 만들기

```ts
const makeObject = (key, value) => ({ [key]: value });
console.log(makeObject('name', 'Jack')); // { name: 'Jack' }
```

- 타입스크립트에서는 `{ [key]: value }` 형태의 타입을 색인 가능 타입이라고 하며, 다음과 같은 형태로 `key`와 `value`의 타입을 명시한다.

```ts
export type KeyValueType = {
  [key: string]: string
}

export const makeObject = (key: string, value: string): KeyValueType => ({
  [key]: value,
});

console.log(makeObject('name','Jack')); // { name: 'Jack' }
```

## 🦄 클래스 메서드

### 📚 function 함수와 this 키워드
- 타입스크립트의 `function` 키워드로 만든 함수는 `Function`이란 **클래스의 인스턴스, 즉 함수는 객체**라고 했다.
- 객체지향 언어에서 인스턴스는 `this` 키워드를 사용할 수 있다.
- 타입스크립트에서는 `function` 키워드로 만든 함수에 `this` 키워드를 사용할 수 있다.
- 반면에 **화살표 함수에는 `this` 키워드를 사용할 수 없다.**

### 📚 메서드란?
- 타입스크립트에서 메서드는 `function`으로 만든 **함수 표현식을 담고 있는 속성**이다.
- 다음 코드에서 클래스 A는 `value`와 `method`라는 두 개의 속성을 가진다.

```ts
export class A {
  value: number = 1;
  method: () => void = function(): void {
    console.log(`value: ${this.value}`);
  }
}
```

- `value` 속성을 1로 설정했으므로 `this.value`가 1이 되어 `value: 1`이라는 문자열이 출력된다.

```ts
import { A } from "./A";

let a: A = new A;
a.method(); // value: 1
```

### 📚 클래스 메서드 구문
- 앞에서 작성한 클래스 A는 구현하기도 번거롭고 가독성도 떨어진다.
- 타입스크립트는 클래스 속성 중 함수 표현식을 담는 속성은 `function` 키워드를 생략할 수 있게 하는 단축 구문을 제공한다.

```ts
export class B {
  constructor(public value: number = 1) {}
  method(): void {
    console.log(`value: ${this.value}`);
  }
}
```

- B 클래스의 생성자를 통해 전달된 2라는 값이 `value`에 설정되고 `method`가 호출되어 2라는 값이 출력된다.

```ts
import { B } from "./B";

let b: B = new B(2);
b.method(); // value: 2
```

### 📚 정적 메서드

- 클래스의 속성은 `static` 수정자를 속성 앞에 붙여서 정적으로 만들 수 있었다.
- 메서드 또한 속성이므로 이름 앞에 `static` 수정자를 붙여 정적 메서드를 만들 수 있었다.
- 다음 코드는 C와 D라는 두 클래스가 `whoAreYou`라는 같은 이름의 정적 메서드를 구현하고 있다.

```ts
export class C {
  static whoAreYou(): string {
    return `I'm class C`;
  }
}

export class D {
  static whoAreYou(): string {
    return `I'm class D`;
  }
}

console.log(C.whoAreYou()); // I'm class C
console.log(D.whoAreYou()); // I'm class D
```

### 📚 메서드 체인
- 객체의 메서드를 이어서 계속 호출하는 방식의 코드를 작성할 수 있는데 이러한 방식을 **메서드 체인**이라고 한다.
- 타입스크립트로 메서드 체인을 구현하려면 메서드가 항상 `this`를 반환하게 한다.

```ts
export class calculator {
  constructor(public value: number = 0) {}

  add(value: number) {
    this.value += value;
    return this;
  }

  multiply(value: number) {
    this.value *= value;
    return this;
  }
}
```
- 다음과 같이 구현할 수 있다.

```ts
import { Calculator } from "./method-chain";

let calc = new Calculator;
let result = calc.add(1).add(2).multiply(3).multiply(4).value;
console.log(result); // 36
```
