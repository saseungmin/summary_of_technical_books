---
sidebar_position: 8
sidebar_label: 7. 코드를 작성하고 실행하기
---

# 🐤 Chapter 7. 코드를 작성하고 실행하기

## 🥕 아이템 53. 타입스크립트 기능보다는 ECMAScript 기능을 사용하기
타입스크립트가 태동하던 2010년경, 자바스크립트는 결함이 많고 개선해야 할 부분이 많은 언어였습니다. 그리고 클래스, 데코레이터, 모듈 시스템 같은 기능이 없어서 프레임워크나 트랜스파일러로 보완하는 것이 일반적인 모습이었습니다. 그렇기 떄문에 타입스크립트도 초기 버전에는 독립적으로 개발한 클래스, 열거형(enum), 모듈 시스템을 포함시킬 수밖에 없었습니다.   

시간이 흐르며 TC39(자바스크립트를 관장하는 표준 기구)는 부족했던 점들을 대부분 내장 기능으로 추가했습니다. 그러나 자바스크립트에 새로 추가된 기능은 타입스크립트 초기 버전에서 독립적으로 개발했던 기능과 호환성 문제를 발생시켰습니다. 그렇기에 타입스크립트 진영에서는 다음 전략 중 하나를 선택해야 했습니다. 한 가지 전략은 타입스크립트 초기 버전의 형태를 유지하기 위해 자바스크립트 신규 기능을 변형해서 끼워 맞추는 것입니다. 또 다른 전략은 자바스크립트의 신규 기능을 그대로 채택하고 타입스크립트 초기 버전과 호환성을 포기하는 것입니다.   

타입스크립트 팀은 대부분 두 번쨰 전략을 선택했습니다. 결국 TC39는 런타임 기능을 발전시키고, 타입스크립트 팀은 타입 기능만 발전시킨다는 명확한 원칙을 세우고 현재까지 지켜오고 있습니다.   

그런데 이 원칙이 세워지기 전에, 이미 사용되고 있던 몇 가지 기능이 있습니다. 이 기능들은 타입 공간(타입스크립트)과 값 공간(자바스크립트)의 경계를 혼란스럽게 만들기 때문에 사용하지 않는 것이 좋습니다. 여기서는 피해야 하는 기능을 몇 가지 살펴봅니다. 그리고 불가피하게 이 기능을 사용하게 되는 경우 어떤 점에 유의해야 호환성 문제를 일으키지 않는지 알아봅니다.

#### 열거형(enum)
많은 언어에서 몇몇 값의 모음을 나타내기 위해 열거형을 사용합니다. 타입스크립트에서도 열거형을 사용할 수 있습니다.

```ts
enum Flavor {
  VANILLA = 0,
  CHOCOLATE = 1,
  STRAWBERRY = 2,
}

let flavor = Flavor.CHOCOLATE; // 타입이 Flavor

Flavor // 자동완성 추천: VANILLA, CHOCOLATE, STRAWBERRY
Flavor[0] // 값이 "VANILLA"
```

단순히 값을 나열하는 것보다 실수가 적고 명확하기 때문에 일반적으로 열거형을 사용하는 것이 좋습니다. 그러나 타입스크립트의 열거형은 몇 가지 문제가 있습니다. 타입스크립트의 열거형은 다음 목록처럼 상황에 따라 다르게 동작합니다.
- 숫자 열거형(앞 예제의 `Flavor`)에 0, 1, 2 외의 다른 숫자가 할당되면 매우 위험합니다. (이 방법은 원래 비트 플래그 구조를 표현하기 위해 설계되었습니다.)
- 상수 열거형은 보통의 열거형과 달리 런타임에 완전히 제거됩니다. 앞의 예제를 `const enum Flavor`로 바꾸면, 컴파일러는 `Flavor.CHOCOLATE`을 `1`으로 바꿔 버립니다. 이런 결과는 기대하지 않은 것이며, 문자열 열거형과 숫자 열거형과 전혀 다른 동작입니다.
- `preserveConstEnums` 플래그를 설정한 상태의 상수 열거형은 보통의 열거형처럼 런타임 코드에 상수 열거형 정보를 유지합니다.
- 문자열 열거형은 런타임의 타입 안전성과 투명성을 제공합니다. 그러나 타입스크립트의 다른 타입과 달리 구조적 타이핑이 아닌 명목적 타이핑을 사용합니다.

타입스크립트의 일반적인 타입들이 할당 가능성을 체크하기 위해서 구조적 타이핑을 사용하는 반면, 문자열 열거형은 명목적 타이핑을 사용합니다.

> 구조적 타이핑은 구조가 같으면 할당이 허용되는 반면, 명목적 타이핑은 타입의 이름이 같아야 할당이 허용됩니다.

```ts
enum Flavor {
  VANILLA = 'vanilla',
  CHOCOLATE = 'chocolate',
  STRAWBERRY = 'strawberry',
}

let flavor = Flavor.CHOCOLATE; // 타입이 Flavor
    flavor = 'strawberry';
  // ~~~~~ '"strawberry"' 형식은 'Flavor' 형식에 할당할 수 없습니다.ts(2322)
```

명목적 타이핑은 라이브러리를 공개할 때 필요합니다. `Flavor`를 매개변수로 받는 함수를 가정해 봅시다.

```ts
function scoop(flavor: Flavor) { /* ... */ }
```

`Flavor`는 런타임 시점에는 문자열이기 떄문에, 자바스크립트에서 다음처럼 호추할 수 있습니다.

```ts
scoop('vanilla'); // 자바스크립트에서는 정상
```

그러나 타입스크립트에서는 열거형을 임포트하고 문자열 대신 사용해야 합니다.

```ts
import { Flavor } from 'ice-cream';
scoop(Flavor.VANILLA);
```

이처럼 자바스크립트와 타입스크립트에서 동작이 다르기 때문에 문자열 열거형은 사용하지 않는 것이 좋습니다. 열거형 대신 리터럴 타입의 유니온을 사용하면 됩니다.

```ts
type Flavor = 'vanilla' | 'chocolate' | 'strawberry';

let flavor: Flavor = 'chocolate'; // 정상
```

리터럴 타입의 유니온은 열거형만큼 안전하며 자바스크립트와 호환되는 장점이 있습니다. 그리고 편집기에서 열거형처럼 자동완성 기능을 사용할 수 있습니다.

#### 매개변수 속성
일반적으로 클래스를 초기화할 때 속성을 할당하기 위해 생성자의 매개변수를 사용합니다.

```js
class Person {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}
```

타입스크립트는 더 간결한 문법을 제공합니다.

```ts
class Person {
  constructor(public name: string) {}
}
```

그러나 매개변수 속성과 관련된 몇 가지 문제점이 존재합니다.
- 일반적으로 타입스크립트 컴파일은 타입 제거가 이루어지므로 코드가 줄어들지만, 매개변수 속성은 코드가 늘어나는 문법입니다.
- 매개변수 속성이 런타임에는 실제로 사용되지만, 타입스크립트 관점에서는 사용되지 않는 것처럼 보입니다.
- 매개변수 속성과 일반 속성을 섞어서 사용하면 클래스의 설계가 혼란스러워집니다.

```ts
class Person {
  first: string;
  last: string;
  constructor(public name: string) {
    [this.first, this.last] = name.split(' ');
  }
}
```

`Person` 클래스에는 세 가지 속성(`first`, `last`, `name`)이 있지만, `first`와 `last`만 속성에 나열되어 있고 `name`은 매개변수 속성에 있어서 일관성이 없습니다. 구조적 타이핑 특성 때문에 다음 예제처럼 할당할 수 있다는 것을 주의해야 합니다.

```ts
class Person {
  constructor(public name: string) {}
}

const p: Person = { name: 'Jed Bartlet' }; // 정상
```

매개변수 속성은 타입스크립트의 다른 패턴들과 이질적이고, 초급자에게 생소한 문법이라는 것을 기억해야 합니다. 또한 매개변수 속성과 일반 속성을 같이 사용하면 설계가 혼란스러워지기 때문에 한 가지만 사용하는 것이 좋습니다.

#### 네임스페이스와 트리플 슬래시 임포트
ECMAScript 2015 이전에는 자바스크립트에 공식적인 모듈 시스템이 없었습니다. Node.js는 `require`와 `module.exports`를 사용하는 반면, AMD는 `define` 함수와 콜백을 사용했습니다.   
타입스크립트 역시 `module` 키워드와 '트리플 슬래시' 임포트를 사용했습니다. ECMAScript 2015가 공식적으로 모듈 시스템을 도입한 이후, 타입스크립트는 충돌을 피하기 위해 `module`과 같은 기능을 하는 `namespace` 키워드를 추가했습니다.

```ts
namespace foo {
  function bar() {}
}

/// <reference path="other.ts" />
foo.bar();
```

트리플 슬래시 임포트와 `module` 키워드는 호환성을 위해 남아 있을 뿐이며, 이제는 ECMAScript 2015 스타일을 모듈(`import`와 `export`)을 사용해야 합니다.

#### 데코레이터
데코레이터는 클래스, 메서드, 속성에 애너테이션을 붙이거나 기능을 추가하는 데 사용할 수 있습니다. 예를 들어, 클래스의 메서드가 호출될 때마다 로그를 남기려면 `logged` 애너테이션을 정의할 수 있습니다.

```ts
class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }
  @logged
  greet() {
    return "Hello, " + this.greeting;
  }
}
```

데코레이터는 처음에 앵귤러 프레임워크를 지원하기 위해 추가되었으며 `tsconfig.json`에 `experimentalDecorators` 속성을 설정하고 사용해야 합니다. 현재까지도 표준화가 완료되지 않았기 때문에, 사용 중인 데코레이터가 비표준으로 바뀌거나 호환서이 깨질 가능성이 있습니다. 앵귤러를 사용하거나 애너테이션이 필요한 프레임워크를 사용하고 있는 게 아니라면, 데코레이터가 표준이 되기 전에는 타입스크립트에서 데코레이터를 사용하지 않는 게 좋습니다.

## 🥕 아이템 54. 객체를 순회하는 노하우
오류의 원인은 무엇일까요?

```ts
const obj = {
  one: 'uno',
  two: 'dos',
  three: 'tres',
};

for (const k in obj) {
  const v = obj[k];
        //  ~~~~~~ obj에 인덱스 시그니처가 없기 때문에 엘리먼트는 암시적으로 any 타입입니다.
}
```

`k`의 타입이 `string`인 반면, `obj` 객체는 `one`, `two`, `three` 세 개의 키만 존재합니다. `k`와 `obj` 객체의 키 타입이 서로 다르게 추론되어 오류가 발생한 것입니다.

```ts
interface ABC {
  a: string;
  b: string;
  c: number;
}

function foo(abc: ABC) {
  for (const k in abc) { // const k: string
    const v = abc[k];
          //  ~~~~~ 'ABC' 타입에 인덱스 시그니처가 없기 때문에 엘리먼트는 암시적으로 any가 됩니다.
  }
}
```

첫 번쨰 예제와 동일한 오류이빈다. 그러므노 `(let k: keyof ABC)` 같은 선언으로 오류를 제거할 수 있습니다.

```ts
const x = {a: 'a', b: 'b', c: 2, d: new Date()};
foo(x); // 정상
```

`foo` 함수는 `ABC` 타입에 *할당 가능한* 어떠한 값이든 매개변수로 허용하기 때문입니다.   
또한 `keyof` 키워드를 사용한 방법은 또 다른 문제점을 내포하고 있습니다.

```ts
function foo(abc: ABC) {
  let k: keyof ABC;
  for (k in abc) {
    const v = abc[k]; // string | number 타입
  }
}
```

`k`가 `"a" | "b" | "c"` 타입으로 한정되어 문제가 된 것처럼, `v`도 `string | number` 타입으로 한정되어 범위가 너무 좁아 문제가 됩니다.   
골치 아픈 타입 문제 없이, 단지 객체의 키와 값을 순회하고 싶다면 `Object.entries`를 사용하면 됩니다.

```ts
function foo(abc: ABC) {
  for (const [k, v] of Object.entries(abc)) {
    k // string 타입
    v // any 타입
  }
}
```

객체를 다룰 때에는 항상 "프로토타입 오염"의 가능성을 염두해 두어야 합니다. 실제 작업에서는 `Object.prototype`에 순회 가능한 속성을 절대로 추가하면 안됩니다.

## 🥕 아이템 55. DOM 계층 구조 이해하기
타입스크립트에서 DOM 엘리먼트의 계층 구조를 파악하기 용이합니다.   
아래 코드는 타입스크립트에서 수많은 오류가 표시됩니다.

```ts
function handleDrag(eDown: Event) {
  const targetEl = eDown.currentTarget;
  targetEl.classList.add('dragging');

  const dragStart = [eDown.clientX, eDown.clientY];

  const handleUp = (eUp: Event) => {
    targetEl.classList.remove('dragging');
    targetEl.removeEventListener('mouseup', handleUp);

    const dragEnd = [eUp.clientX, eUp.clientY];
    console.lg('dx, dy = ', [0, 1].map(i => dragEnd[i] - dragStart[i]));
  }

  targetEl.addEventListener('mouseup', handleUp);
}

const div = document.getElementById('surface');
div.addEventListener('mousedown', handleDrag);
```

일반적으로 타입 단언문은 지양해야 하지만, DOM 관련해서는 타입스크립보다 우리가 더 정확히 알고 있는 경우이므로 단언문을 사용해도 좋습니다.

```ts
document.getElementById('my-div') as HTMLDivElement;
```

`strictNullChecks`가 설정된 상태라면, `document.getElementById`가 `null`인 경우를 체크해야 합니다. 실제 코드에서 `document.getElementById`가 `null`일 가능성이 있다면 `if` 분기문을 추가해야 합니다.   

아래 예제는 타입스크립트 오류를 해결한 예제입니다.

```ts
function addDragHandler(el: HTMLElement) {
  el.addEventListener('mosuedown', eDown => {
    const dragStart = [eDown.clientX, eDown.clientY];
    const handleUp = (eUp: MouseEvent) => {
      el.classList.remove('dragging');
      el.removeEventListener('mouseup', handleUp);
      const dragEnd = [eUp.clientX, eUp.clientY];
      console.lg('dx, dy = ', [0, 1].map(i => dragEnd[i] - dragStart[i]));
    }
    el.addEventListener('mouseup', handleUp);
  });
}

const div = document.getElementById('surface');
if (div) {
  addDragHandler(div);
}
```

자바스크립트를 사용할 때는 신경 쓰지 않았겠지만, DOM에는 타입 계층 구조가 있습니다. DOM 타입은 타입스크립트에서 중요한 정보이며, 브라우저 관련 프로젝트에서 타입스크립트를 사용할 때 유용합니다.

## 🥕 아이템 56. 정보를 감추는 목적으로 `private` 사용하지 않기

```ts
class Diary {
  private secret = 'cheated on my English test';
}

const diary = new Diary();
diary.secret
//    ~~~~~~ 'secret' 속성은 private이며 'Diary' 클래스 내에서만 접근할 수 있습니다.
```

타입스크립트에는 `public`, `protected`, `private` 같은 접근 제어자는 타입스크립트 키워드이기 떄문에 컴파일 후에는 제거됩니다. 이 타입스크립트 코드를 컴파일하게 되면 다음 예제의 자바스크립트 코드로 변환됩니다.(target=ES2017이 설정된 상태)

```ts
class Diary {
  constructor() {
    this.secret = 'cheated on my English test';
  }
}

const diary = new Diary();
diary.secret;
```

`private` 키워드는 사라졌고 `secret`은 일반적인 속성이므로 접근할 수 있습니다. 타입스크립트의 접근 제어자들은 단지 컴파일 시점에만 오류를 표시해 줄 뿐이며, 언더스코어 관례와 마찬가지로 런타임에는 아무런 효력이 없습니다. 심지어 단언문을 사용하면 타입스크립트 상태에서도 `private` 속성에 접근할 수 있습니다.

```ts
class Diary {
  private secret = 'cheated on my English test';
}

const diary = new Diary();
(diary as any).secret // 정상
```

즉, 정보를 감추기 위해 `private`을 사용하면 안 됩니다.   
자바스크립트에서 정보를 숨기기 위해 가장 효과적인 방법은 클로저를 사용하는 것입니다. 다음 코드처럼 생성자에서 클로저를 만들어 낼 수 있습니다.

```ts
declare function hash(text: string): number;

class PasswordChecker {
  checkPassword: (password: string) => boolean;
  constructor(passwordHash: number) {
    this.checkPassword = (password: string) => {
      return hash(password) === passwordHash;
    }
  }
}

const checker = new PasswordChecker(hash('s3cret'));
checker.checkPassword('s3cret'); // 결과는 true
```

몇 가지 주의사항이 있습니다. `passwordHash`를 생성자 외부에서 접근할 수 없기 때문에, `passwordHash`에 접근해야 하는 메서드 역시 생성자 내부에 정의되어야 합니다. 그리고 메서드 정의가 생성자 내부에 존재하면, 인스턴스를 생성할 때마다 각 메서드의 복사본이 생성되기 때문에 메모리를 낭비하게 된다는 것을 기억해야 합니다. 또한 동일한 클래스로부터 생성된 인스턴스라고 하더라도 서로 비공개 데이터에 접근하는 것이 불가능하기 때문에 철저하게 비공개이면서 동시에 불푠함이 따릅니다.   

또 하나의 선택지로, 현재 표준화가 진행 중인 비공개 필드 기능을 사용할 수도 있습니다. ([책은 진행 중이라고 되어있지만 현재는 표준화 완료](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Classes/Private_class_fields)) 비공개 필드 기능은 접두사로 `#`를 붙여서 타입 체크와 런타임 모두에서 비공개로 만드는 역할을 합니다.

```ts
class PasswordChecker {
  #passwordHash: number;

  constructor(passwordHash: number) {
    this.#passwordHash = passwordHash;
  }

  checkPassword(password: string) {
    return hash(password) === this.#passwordHash;
  }
}

const checker = new PasswordChecker(hash('s3cret'));
checker.checkPassword('secret'); // 결과는 false
checker.checkPassword('s3cret'); // 결과는 true
```

`#passwordHash` 속성은 클래스 외부에서 접근할 수 없습니다. 그러나 클로저 기법과 다르게 클래스 메서드나 동일한 클래스의 개별 인스턴스끼리는 접근이 가능합니다.
