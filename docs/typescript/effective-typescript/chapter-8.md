---
sidebar_position: 9
sidebar_label: 8. 타입스크립트로 마이그레이션하기
---

# 🐤 Chapter 8. 타입스크립트로 마이그레이션하기

## 🥕 아이템 58. 모던 자바스크립트로 작성하기

#### ECMAScript 모듈 사용하기
ES2015부터는 임포트와 익스포트를 사용하는 ECMAScript 모듈이 표준이 되었습니다. 만약 마이그레이션 대상인 자바스크립트 코드가 단일 파일이거나 비표준 모듈 시스템을 사용 중이라면 ES 모듈로 전환하는 것이 좋습니다. ES 모듈 시스템은 타입스크립트에서도 잘 동작하며, 모듈 단위로 전환할 수 있게 해 주기 때문에 점진적 마이그레이션이 원활해집니다.

```ts
// a.ts
import * as b from './b';

// b.ts
export const name = 'Module B';
```

#### 프로토타입 대신 클래스 사용하기
마이그레이션하려는 코드에서 단순한 객체를 다룰 때 프로토타입을 사용하고 있다면 클래스로 바꾸는 것이 좋습니다.

```ts
class Person {
  first: string;
  last: string;

  constructor(first: string, last: string) {
    this.first = first;
    this.last = last;
  }

  getName() {
    return this.first + ' ' + this.last;
  }
}

const marie = new Person('Marie', 'Curie');
const personName = marie.getName();
```

#### `var` 대신 `let`/`const` 사용하기
자바스크리븥 `var` 키워드의 스코프 규칙에 문제가 있다는 것은 널리 알려진 사실입니다. `var` 대신 `let`과 `const`를 사용하면 제대로 된 블록 스코프 규칙을 가지며, 개발자들이 일반적으로 기대하는 방식으로 동작합니다.

#### `for(;;)` 대신 `for-of` 또는 배열 메서드 사용하기
모던 자바스크립트에서는 `for-of` 루프가 존재합니다.

```ts
for (const el of array) {
  // ...
}
```

`for-of` 루프는 코드가 짧고 인덱스 변수를 사용하지도 않기 떄문에 실수를 줄일 수 있습니다. 인덱스 변수가 필요한 경우엔 `forEach` 메서드를 사용하면 됩니다.

```ts
array.forEach((ei, i) => {
  // ...
});
```

#### 함수 표현식보다 화살표 함수 사용하기
`this` 키워드는 일반적인 변수들과는 다른 스코프 규칙을 가지기 때문에, 자바스크립트에서 가장 어려운 개념 중 하나입니다. 일반적으로는 `this`가 클래스 인스턴스를 참조하는 것을 기대하지만 다음 예체처럼 예상치 못한 결과가 나오는 경우도 있습니다.

```js
class Foo {
  method() {
    console.log(this);
    [1, 2].forEach(function(i) {
      console.log(this);
    });
  }
}

const f = new Foo();
f.method();
// strict 모드에서 Foo, undefined, undefined를 출력합니다.
// non-strict 모드에서 Foo, window, window (!)를 출력합니다.
```

대신 화살표 함수를 사용하면 상위 스코프의 `this`를 유지할 수 있습니다.

```js
class Foo {
  method() {
    console.log(this);
    [1, 2].forEach(i => {
      console.log(this);
    });
  }
}

const f = new Foo();
f.method();
// 항상 Foo, Foo, Foo를 출력합니다.
```

컴파일러 옵션에 `noImplicitThis`(또는 `strict`)를 설정하면, 타입스크립트가 `this` 바인딩 관련된 오류를 표시해 주므로 설정하는 것이 좋습니다.

#### 단축 객체 표현과 구조 분해 할당 사용하기

```js
const x = 1, y = 2, z = 3;
const pt = { x, y, z };

const obj = {
  onClickLong: function(e) {
    // ...
  }

  onClickCompact(e) {
    // ...
  }
}
```

단축 객체 표현의 반대는 객체 구조 분해입니다.

```js
const { props } = obj;
const { a, b } = props;
```

#### 함수 매개변수 기본값 사용하기
모던 자바스크립트에서는 매개변수에 기본값을 직접 지정할 수 있습니다.

```js
function parseNum(str, base = 10) {
  return parseInt(str, base);
}
```

#### 저수준 프로미스나 콜백 대신 `async/await` 사용하기
`async`와 `await`를 사용하면 코드가 간결해져서 버그나 실수를 방지할 수 있고, 비동기 코드에 타입 정보가 전달되어 타입 추론을 가능하게 한다는 것입니다.

```ts
async function getJSON(url: string) {
  const response = await fetch(url);
  return response.json();
}
```

#### 연관 배열 객체 대신 `Map`과 `Set` 사용하기

```ts
function countWordsMap(text: string) {
  const counts = new Map<string, number>();

  for (const word of text.split(/[\s,.]+/)) {
    count.set(word, 1 + (counts.get(word) || 0));
  }

  return counts;
}
```

#### 타입스크립트에 use strict 넣지 않기
ES5에서는 버그가 될 수 있는 코드 패턴에 오류를 표시해 주는 엄격 모드(strict mode)가 도입되었습니다.

```js
'use strict';
function foo() {
  x = 10; // strict 모드에서는 오류
}
```

타입스크립트에서 수행되는 안전성 검사가 엄격 모드보다 훨씬 더 엄격한 체크를 하기 때문에, 타입스크립트 코드에서 `'use strict'`는 무의미합니다. 타입스크립트 코드에 `'use strict'`를 쓰지 않고, 대신 `alwaysStrict` 설정을 사용해야 합니다.

## 🥕 아이템 59. 타입스크립트 도입 전에 `@ts-check`와 `JSDoc`으로 시험해 보기
`@ts-check` 지시자를 사용하여 타입 체커가 파일을 분석하고, 발견된 오류를 보고하도록 지시합니다. 그러나 `@ts-check` 지시자는 매우 느슨한 수준으로 타입 체크를 수형하는데, 심지어 `noImplicitAny` 설정을 해제한 것보다 헐거운 체크를 수행한다는 점을 주의해야 합니다.

```js
@ts-check
const person = { first: 'Grace', last: 'Hopper' };
2 * person.first
//  ~~~~~~~~~~~~ 산술 연산 오른쪽은 'any', 'number', 'bigint' 또는 열거형 형식이어야 합니다.
```

`@ts-check` 지시자를 사용하면 타입 불일치나 함수의 매개변수 개수 불일치 같은 간단한 오류 외에도, 다음에 소개하는 몇 가지 의미 있는 오류들을 찾아 낼 수 있습니다.

- 선언되지 않은 전역 변수
- 알 수 없는 라이브러리
- DOM 문제
- 부정확한 JSDoc

> P.301 ~ P.306 참고

#### 요약
- 파일 상단에 `// @ts-check`를 추가하면 자바스크립트에서도 타입 체크를 수행할 수 있습니다.
- 전역 선언과 서드파티 라이브러리의 타입 선언을 추가하는 방법을 익힙시다.
- JSDoc 주석을 잘 활용하면 자바스크립트 상태에서도 타입 단언과 타입 추론을 할 수 있습니다.
- JSDoc 주석은 중간 단계이기 때문에 너무 공들일 필요는 없습니다. 최종 목표는 `.ts`로 된 타입스크립트 코드임을 명심합시다.

## 🥕 아이템 60. allowJs로 타입스크립트와 자바스크립트 같이 사용하기
소규모 프로젝트는 한꺼번에 타입스크립트로 전환할 수 있습니다. 그러나 대규모 프로젝트는 한꺼번에 작업하는 것이 불가능하므로 점진적으로 전환할 수 있어야 합니다. 그러려면 마이그레이션 기간 중에 자바스크립트와 타입스크립트가 동시에 동작할 수 있도록 해야 합니다.   

타입스크립트와 자바스크립트가 공종하는 방법의 핵심은 `allowJs` 컴파일러 옵션인데, 타입스크립트 파일과 자바스크립트 파일을 서로 임포트할 수 있게 해줍니다.   

타입 체크와 관련이 없지만, 기존 빌드 과정에 타입스크립트 컴파일러를 추가하기 위해서 `allowJs` 옵션이 필요합니다. 또한 모듈 단위로 타입스크립트로 전환하는 과정에서 테스트를 수행해야 하기 때문에 `allowJs` 옵션이 필요합니다.   

번들러에 타입스크립트가 통합되어 있거나, 플러그인 방식으로 통합이 가능하다면 `allowJs`를 간단히 적용할 수 있습니다.   

기존 자바스크립트 코드에 특별한 규칙이 있다면, 타입스크립트가 생성한 코드가 기존 자바스크립트 코드의 규칙을 따르도록 출력 옵션을 조정해야 할 수도 있습니다.   
타입스크립트로 마이그레이션하는 동시에 빌드와 테스트가 동작하게 하는 것이 힘들기는 하지만, 제대로 된 점진적 마이그레이션을 시작하기 위해 반드시 필요합니다.

## 🥕 아이템 61. 의존성 관계에 따라 모듈 단위로 전환하기
점진적 마이그레이션을 할 때는 모듈 단위로 각개격파하는 것이 이상적입니다. 그런데 한 모듈을 골라서 타입 정보를 추가하면, 해당 모듈이 의존하는 모듈에서 비롯되는 타입 오류가 발생하게 됩니다. 의존성과 관련된 오류 없이 작업하려면, 다른 모듈에 의존하지 않는 최하단 모듈부터 작업을 시작해서 의존성의 최상단에 있는 모듈을 마지막으로 완성해야 합니다.   

프로젝트 내에 존재하는 모듈은 서드파티 라이브러리에 의존하지만 서드파티 라이브러리는 해당 모듈에 의존하지 않기 때문에, 서드파티 라이브러리 타입 정보를 가장 먼저 해결해야 합니다. 일반적으로 `@types` 모듈을 설치하면 됩니다.   

외부 API를 호출하는 경우에도 있기 때문에 외부 API의 타입 정보도 추가해야 합니다. 외부 API의 타입 정보는 특별한 문맥이 없기 때문에 타입스크립트가 추론하기 어렵습니다. 그러므로 API에 대한 사양을 기반으로 타입 정보를 생성해야 합니다.   

마이그레이션할 때는 타입 정보 추가만 하고, 리팩터링을 해서는 안 됩니다. 오래된 프로젝트일수록 개선이 필요한 부분을 자주 마주치켔지만, 당장의 목표는 코드 개선이 아니라 타입스크립트로 전환하는 것임을 명심해야 합니다.

#### 선언되지 않은 클래스 멤버
자바스크립트는 클래스 멤버 변수를 선언할 필요가 없지만, 타입스크립트에서는 명시적으로 선언해야 합니다.

```ts
class Greeting {
  greeting: string;
  name: any;
  constructor(name) {
    this.greeting = 'Hello';
    this.name = name;
  }

  greet() {
    return this.greeting + ' ' + this.name;
  }
}
```

#### 타입이 바뀌는 값
다음 코드는 자바스크립트일 때는 문제가 없지만, 타입스크립트가 되는 순간 오류가 발생합니다.

```ts
const state = {};
state.name = 'New York'; // {} 유형에 name 속성이 없습니다.
state.capital = 'Albany'; // {} 유형에 capital 속성이 없습니다.
```

한꺼번에 객체를 생성하면 간단히 오류를 해결할 수 있습니다. (아이템 23)

```ts
const state = {
  name: 'New York',
  capital: 'Albany',
};
```

한꺼번에 생성하기 곤란한 경우에는 임시 방편으로 타입 단언문을 사용할 수도 있습니다.

```ts
interface State {
  name: string;
  capital: string;
}

const state = {} as State;
state.name = 'New York';
state.capital = 'Albany';
```

당장은 마이그레이션이 중요하기 때문에 타입 단언무을 사용한 것이며, 마이그레이션이 완료된 후에는 아이템 9를 참고하여 문제를 제대로 해결해야 합니다.   

마지막 단계로, 테스트 코드를 타입스크립트로 전환하면 됩니다. 로직 코드가 테스트 코드에 의존하지 않기 때문에, 테스트 코드는 항상 의존성 관계도의 최상단에 위치하며 마이그레이션의 마지막 단계가 되는 것은 자연스러운 일입니다. 그리고 최하단의 모듈부터 타입스크립트로 전환하는 와중에도 테스트 코드는 변경되지 않았고, 테스트를 수행할 수 있었을 겁니다. 마이그레이션 기간 중에 테스트를 수행할 수 있다는 것은 엄청난 이점입니다.

## 🥕 아이템 62. 마이그레이션의 완성을 위헤 `noImplicitAny` 설정하기
`noImplicitAny`가 설정되지 않은 상태에서는 타입 선언에서 비롯되는 실제 오류가 숨어 있기 때문에 마이그레이션이 완료되었다고 할 수 없습니다. `noImplicitAny` 설정을 하지 않으면, 타입 체크는 매우 허술해집니다. 처움에는 `noImplicitAny`를 로컬에만 설정하고 작업하는 것이 좋습니다. 왜냐하면 원격에서는 설정에 변화가 없기 때문에 빌드가 실패하지 않기 때문입니다. 로컬에서만 오류로 인식되기 때문에, 수정한 부분만 커밋할 수 있어서 점진적 마이그레이션이 가능합니다.   
한편, 타입 체커가 발생하는 오류의 개수는 `noImplicitAny`와 관련된 작업의 진척도를 나타내는 지표로 활용할 수 있습니다.
