---
sidebar_position: 3
sidebar_label: 2. 타입스크립트의 타입 시스템
---

# 🐤 Chapter 2: 타입스크립트의 타입 시스템

## 🥕 아이템 6. 편집기를 사용하여 타입 시스템 탐색하기
- 편집기에서 타입스크립트 언어 서비스를 적극 활용해야 합니다.
- 편집기를 사용하면 어떻게 타입 시스템이 동작하는지, 그리고 타입스크립트가 어떻게 타입을 추론하는지 개념을 잡을 수 있습니다.
- 타입스크립트가 동작을 어떻게 모델링하는지 알기 위해 타입 선언 파일을 찾아보는 방법을 터득해야 합니다.

## 🥕 아이템 7. 타입이 값들의 집합이라고 생각하기
런타임에 모든 변수는 자바스크립트 세상의 값으로부터 정해지는 각자의 고유한 값을 가집니다. 변수에는 다음처럼 다양한 종류의 값을 할당할 수 있습니다.
- `42`
- `null`
- `undefined`
- `'Canada'`
- `{ animal: 'Whale', weight_lbs: 40_000 }`
- `/regex/`
- `new HTMLButtonElement`
- `(x, y) => x + y`

그러나 코드가 실행되기 전, 즉 타입스크립트가 오류를 체크하는 순간에는 "타입"을 가지고 있습니다. "할당 가능한 값들의 집합"이 타입이라고 생각하면 됩니다. 이 집합은 타입의 "범위"라고 부르기도 합니다.   

가장 작은 집합은 아무 값도 포함하지 않는 공집합이며, 타입스크립트에서는 `never` 타입입니다. `never` 타입으로 선언된 변수의 범위는 공집합이기 때문에 아무런 값도 할당할 수 없습니다.   

그다음으로 작은 집합은 한 가지 값만 포함하는 타입입니다. 이들은 타입스크립트에서 유닛(unit) 타입이라고도 불리는 리터럴 타입입니다.

```ts
type A = 'A';
type B = 'B';
type Twelve = 12;
```

두 개 혹은 세 개로 묶으려면 유니온 타입을 사용합니다. 유니온 타입은 값 집합들의 합집합을 일컫습니다.

```ts
type AB = 'A' | 'B';
type AB12 = 'A' | 'B' | 12;
```

타입이 집합이라는 관점에서 `extends`의 의미는 *~에 할당 가능한*과 비슷하게, *~의 부분 집합*이라는 의미로 받아들일 수 있습니다.

```ts
interface Vector1D { x: number; }
interface Vector2D extends Vector1D { y: number; }
interface Vector3D extends Vector2D { z: number; }
```

`Vector3D`는 `Vector2D`의 서브타입이고 `Vector2D`는 `Vector1D`의 서브타입입니다.   
`extends` 키워드는 제너릭 타입에서 한정자로도 쓰이며, 이 문맥에서는 "~의 부분 집합"을 의미하기도 합니다.

```ts
function getKey<K extends string>(val: any, key: K) {
  // ...
}
```

`string`의 부분 집합 법위를 가지는 어떠한 타입이 됩니다. 이 타입은 `string` 리터럴 타입, `string` 리터럴 타입의 유니온, `string` 자신을 포함합니다.

```ts
getKey({}, 'x'); // 정상, string을 상속
getKey({}, Math.random() < 0.5 ? 'a' : 'b'); // 정상, string을 상속
getKey({}, document.title); // 정상
getKey({}, 12); // ~~~ '12' 형식의 인수는 'string' 형식의 매개변수에 할당될 수 없습니다.
```

타입이 값의 집합이라는 건, 동일한 값의 집합을 가지는 두 타입은 같다는 의미가 됩니다. 두 타입이 의미적으로 다르고 우연히 같은 범위를 가진다고 하더라도, 같은 타입을 두 번 정의할 이유는 없습니다.

## 🥕 아이템 8. 타입 공간과 값 공간의 심벌 구분하기
타입스크립트 심벌은 타입 공간이나 값 공간 중의 한 곳에 존재합니다. 심벌은 이름이 같더라도 속하는 공간에 따라 다른 것을 나타낼 수 있기 때문에 혼란스러울 수 있습니다.

```ts
interface Cylinder {
  radius: number;
  height: number;
}

const Cylinder = (radius: number, height: number) => ({ radius, height });
```

`interface Cylinder`에서 `Cylinder`는 타입으로 쓰입니다. `const Cylinder`에서 `Cylinder`와 이름은 같지만 값으로 쓰이며, 서로 아무런 관련도 없습니다. 상황에 따라서 `Cylinder`는 타입으로 쓰일 수도 있고, 값으로 쓰일 수도 있습니다. 이런 점은 가끔 오류를 야기합니다.   

한 심벌이 타입인지 값인지는 언뜻 봐서 알 수 없습니다. 어떤 형태로 쓰이는지 문맥을 살펴 알아내야 합니다. 많은 타입 코드가 값 코드와 비슷해 보이기 때문에 더더욱 혼란스럽습니다.   

```ts
type T1 = typeof p; // 타입은 Person
type T2 = typeof email; // 타입은 (p: Person, subject: string, body: string) => Response

const v1 = typeof p; // 값은 "object"
const v2 = typeof email; // 값은 "function"
```

타입의 관점에서, `typeof`는 값을 읽어서 타입스크립트 타입을 반환합니다. 타입 공간의 `typeof`는 보다 큰 타입의 일부분으로 사용할 수 있고, `type`구문으로 이름을 붙이는 용도로도 사용할 수 있습니다.   

값의 관점에서 `typeof`는 자바스크립트 런타임의 `typeof` 연산자가 됩니다. 값 공간의 `typeof`는 대상 심벌의 런타임 타입을 가리키는 문자열을 반환하며, 타입스크립트 타입과는 다릅니다. 자바스크립트의 런타임 타입 시스템은 타입스크립트의 정적 타입 시스템보다 훨씬 간단합니다. 타입스크립트 타입의 종류가 무수히 많은 반면, 자바스크립트에는 과거부터 지금까지 단 6개(`string`, `number`, `boolean`, `undefined`, `object`, `function`)의 런타임 타입만이 존재합니다.   

두 공간 사이에서 다른 의미를 가지는 코드 패턴들이 있습니다.
- 값으로 쓰이는 `this`는 자바스크립트의 `this` 키워드입니다. 타입으로 쓰이는 `this`는, 일명 "다형성 `this`"라고 불리는 `this`의 타입스크립트 타입입니다.
- 값에서 `&`와 `|`는 `AND`와 `OR` 비트연산입니다. 타입에서는 인터렉션과 유니온입니다.
- `const`는 새 변수를 선언하지만, `as const`는 리터럴 또는 리터럴 표현식의 추로된 타입을 바꿉니다.
- `extends`는 서브클래스(`class A extends B`) 또는 서브타입(`interface A extends B`) 또는 제너릭 타입 한정자(`Generic<T extends number>`)를 정의할 수 있습니다.
- `in`은 루프 또는 매핑된 타입에 등장합니다.

## 🥕 아이템 9. 타입 단언보다는 타입 선언을 사용하기
타입스크립트에서 변수에 값을 할당하고 타입을 부여하는 방법은 두 가지입니다.

```ts
interface Person { name: string };

const alice: Person = { name: 'Alice' };
const bob = { name: 'Bob' } as Person;
```

첫 번째 `alice: Person`은 변수에 **타입 선언**을 붙여서 그 값이 선언된 타입임을 명시합니다. 두 번째 `as Person`은 **타입 단언**을 수행합니다. 그러면 타입스크립트가 추론한 타입이 있더라도 `Person` 타입으로 간주합니다.   
타입 단언보다 타입 선언을 사용하는 게 낫습니다. 그 이유는 다음 코드에서 확인할 수 있습니다.

```ts
const alice: Person = {}; // ~~~ 'Person' 유형에 필요한 'name' 속성이 '{}' 유형에 없습니다.
const bob = {} as Person; // 오류 없음
```

타입 선언은 할당되는 값이 해당 인터페이스를 만족하는지 검사합니다. 앞의 예제에서는 그러지 못했기 때문에 타입스크립트가 오류를 표시했습니다. 타입 단언은 강제로 타입을 지정했으니 타입 체커에게 오류를 무시하라고 하는 것입니다.   

타입 단언이 꼭 필요한 경우가 아니라면, 안전성 체크도 되는 타입 선언을 사용하는 것이 좋습니다.   

화살표 함수의 타입 선언은 추론된 타입이 모호할 때가 있습니다. 예를 들어, 다음 코드에서 `Person` 인터페이스를 사용하고 싶다고 가정해 보겠습니다.

```ts
const people = ['alice', 'bob', 'jan'].map(name => ({ name }));
// Person[]을 원했지만 결과는  { name: string; }[]
```

다음과 같이 화살표 함수 안에서 타입과 함께 변수를 선언하는 것이 가장 직관적입니다.

```ts
const people = ['alice', 'bob', 'jan'].map(name => {
  const person: Person = { name };
  return person;
}); // 타입은 Person[]
```

코드를 좀 더 간결하게 보이기 위해 변수 대신 화살표 함수의 반환 타입을 선언해 보겠습니다.

```ts
const people = ['alice', 'bob', 'jan'].map((name): Person => ({ name })); // 타입은 Person[]
```

이 코드는 바로 앞의 번잡한 버전과 동일한 체크를 수행합니다. 여기서 소괄호는 매우 중요한 의미를 지닙니다. `name`의 타입이 없고, 반환 타입이 `Person`이라고 명시합니다. 그러나 `(name: Person)`은 `name`의 타입이 `Person`임을 명시하고 반환 타입은 없기 때문에 오류가 발생합니다.   
다음 코드는 최종적으로 원하는 타입을 직접 명시하고, 타입스크립트가 할당문의 유효성을 검사하게 합니다.

```ts
const people: Person[] = ['alice', 'bob', 'jan'].map((name): Person => ({ name })); // 타입은 Person[]
```

그러나 함수 호출 체이닝이 연속된 곳에는 체이닝 시작에서부터 명명된 타입을 가져야 합니다. 그래야 정확한 곳에 오류가 표시됩니다.   

다음으로 타입 단언이 꼭 필요한 경우를 살펴보겠습니다. 타입 단언은 타입 체커가 추론한 타입보다 여러분이 판단하는 타입이 더 정확할 때 의미가 있습니다. 예를 들어, DOM 엘리먼트에 대해서는 타입스크립트보다 여러분이 더 정확히 알고 있을 겁니다.

```ts
document.querySelector('#myButton').addEventListener('click', (e) => {
  e.currentTarget // 타입은 EventTarget
  const button = e.currentTarget as HTMLButtonElement;
  button // 타입은 HTMLButtonElement
});
```

타입스크립트는 DOM에 접근할 수 없기 때문에 `#myButton`이 버튼 엘리먼트인지 알지 못합니다. 그리고 이벤트의 `currentTarget`이 같은 버튼이어야 하는 것도 알지 못합니다. 우리는 타입스크립트가 알지 못하는 정보를 가지고 있기 때문에 여기서는 타입 단언문을 쓰는 것이 타당합니다.

## 🥕 아이템 10. 객체 래퍼 타입 피하기
기본형들은 불변이며 메서드를 가지지 않는다는 점에서 객체와 구분됩니다. 그런데 기본형인 `string`의 경우 메서드를 가지고 있는 것처럼 보입니다. 하지만 사실 `string`의 메서드가 아니며, `string`을 사용할 때 자바스크립트 내부적으로 많은 동작이 일어납니다. `string` 기본형에는 메서드가 없지만, 자바스크립트에는 메서드를 가지는 `String` 객체 타입이 정의되어 있습니다. 자바스크립트는 기본형과 객체 타입을 서로 자유롭게 변환합니다. `string` 기본형에 `charAt` 같은 메서드를 사용할 때, 자바스크립트는 기본형을 `String` 객체로 래핑하고, 메서드를 호출하고, 마지막에 래핑한 객체를 버립니다.   

만약 `String.prototype`을 몽키-패치한다면 앞서 설명한 내부적인 동작들을 관찰할 수 있습니다.

> 몽키-패치란 런타임에 프로그램의 어떤 기능을 수정해서 사용하는 기법을 의미합니다. 자바스크립트에서는 주로 프로토타입을 변경하는 것이 해당합니다.

메서드 내의 `this`는 `string` 기본형이 아닌 `String` 객체 래퍼입니다. `String` 객체를 직접 생성할 수도 있으며, `string` 기본형처럼 동작합니다. 그러나 `string` 기본형과 `String` 객체 래퍼가 항상 동일하게 동작하는 것은 아닙니다. 예를 들어, `String` 객체는 오직 자기 자신하고만 동일합니다.

```js
"hello" === new String("hello"); // false
new String("hello") === new String("hello"); // false
```

## 🥕 아이템 11. 잉여 속성 체크의 한계 인지하기
타입이 명시된 변수에 객체 리터럴을 할당할 때 타입스크립트는 해당 타입의 속성이 있는지, 그리고 '그 외의 속성은 없는지' 확인합니다.

```ts
interface Room {
  numDoors: number;
  ceilingHeightFt: number;
}

const r: Room = {
  numDoors: 1,
  ceilingHeightFt: 10,
  elephant: 'present', // 개체 리터럴은 알려진 속성만 지정할 수 있으며 'Room' 형식에 'elephant'가 없습니다.
}
```

`Room` 타입에 생뚱맞게 `elephant` 속성이 있는 것이 어색하긴 하지만, 구조적 타이핑 관점으로 생각해 보면 오류가 발생하지 않아야 합니다. 임시 변수를 도입해 보면 알 수 있는데, `obj` 객체는 `Room` 타입에 할당이 가능합니다.

```ts
const obj = {
  numDoors: 1,
  ceilingHeightFt: 10,
  elephant: 'present',
};

const r: Room = obj; // 정상
```

`obj` 타입은 `Room` 타입의 부분 집합을 포함하므로, `Room`에 할당 가능하면 타입 체커도 통과합니다.   

앞 두 예제의 차이점을 살펴보겠습니다. 첫 번째 예제에서는, 구조적 타입 시스템에서 발생할 수 있는 중요한 종류의 오류를 잡을 수 있도록 **잉여 속성 체크**라는 과정이 수행되었습니다. 그러나 잉여 속성 체크 역시 조건에 따라 동작하지 않는다는 한계가 있고, 통상적인 할당 가능 검사와 함께 쓰이면 구조적 타이핑이 무엇인지 혼라스러워질 수 있습니다. 잉여 속성 체크가 할당 가능 검사와는 별도의 과정이라는 것을 알아야 타입스크립트 타입 시스템에 대한 개념을 정확히 잡을 수 있습니다.   

잉여 속성 체크는 구조적 타이핑 시스템에서 허용되는 속성 이름의 오타 같은 실수를 잡는 데 효과적인 방법입니다. 잉여 속성 체크는 오류를 찾는 효과적인 방법이지만, 타입스크립트 타입 체커가 수행하는 일반적인 구조적 할당 가능성 체크와 역할이 다릅니다. 할당의 개념을 정확히 알아야 잉여 속성 체크와 일반적인 구조적 할당 가능성 체크를 구분할 수 있습니다.   

잉여 속성 체크에는 한계가 있습니다. 임시 변수를 도입하면 잉여 속성 체크를 건너뛸 수 있다는 점을 기억해야 합니다.

## 🥕 아이템 12. 함수 표현식에 타입 적용하기
자바스크립트에서는 함수 문장과 함수 표현식을 다르게 인식합니다.

```ts
function rollDice1(sides: number): number { /* ... */ } // 문장
const rollDice2 = function(sides: number): number { /* ... */ }; // 표현식
const rollDice3 = (sides: number): number => { /* ... */ }; // 표현식
```

타입스크립트에서는 함수 표현식을 사용하는 것이 좋습니다. 함수의 매개변수부터 반환값까지 전체를 함수 타입으로 선언하여 함수 표현식에 재사용할 수 있다는 장점이 있기 때문입니다.

```ts
type DiceRollFn = (sides: number) => number;
const rollDice: DiceRollFn = sides => { /* ... */ };
```

편집기에서 `sides`에 마우스를 올려 보면, 타입스크릷트에서는 이미 `sides`의 타입을 `number`로 인식하고 있다는 걸 알 수 있습니다. 함수 타입의 선언은 불필요한 코드의 반복을 줄입니다.

```ts
function add(a: number, b: number) { return a + b; }

type BinaryFn = (a: number, b: number) => number;
const add: BinaryFn = (a, b) => a + b;
```

이 예제는 함수 타입 선언을 이용했던 예제보다 타입 구문이 적습니다. 함수 구현부도 분리되어 있어 로직이 보다 분명해집니다. 만약 여러분이 라이브러리를 직접 만들고 있다면, 공통 콜백 함수를 위한 타입 선언을 제공하는 것이 좋습니다.   

함수의 매개변수에 타입 선언을 하는 것보다 함수 표현식 전체 타입을 정의하는 것이 코드도 간결하고 안전합니다. 다른 함수의 시그니처와 동일한 타입을 가지는 새 함수를 작성하거나, 동일한 타입 시그니처를 가지는 여러 개의 함수를 작성할 때는 매개변수의 타입과 반환 타입을 반복해서 작성하지 말고 함수 전체의 타입 선언을 적용해야 합니다.

## 🥕 아이템 13. 타입과 인터페이스의 차이점 알기
타입스크립트에서 명명된 타입을 정의하는 방법은 두 가지가 있습니다.

```ts
type TState = {
  name: string;
  capital: string;
}

interface IState {
  name: string;
  capital: string;
}
```

타입과 인터페이스 사이에 존재하는 차이를 분명하게 알고, 같은 상황에서는 동일한 방법으로 명명된 타입을 정의해 일관성을 유지해야 합니다.   

먼저, 인터페이스 선언과 타입 선언의 비슷한 점에 대해 알아보겠습니다. 명명된 타입은 인터페이스로 정의하든 타입으로 정의하든 상태에는 차이가 없습니다. 만약 `IState`와 `TState`를 추가 속성과 함께 할당한다면 동일한 오류가 발생합니다.   

인덱스 시그니처는 인터페이스와 타입에서 모두 사용할 수 있습니다.

```ts
type TDict = {
  [key: string]: string
};

interface IDict {
  [key: string]: string;
}
```

또한 함수 타입도 인터페이스나 타입으로 정의할 수 있습니다.

```ts
type TFn = (x: number) => string;
interface IFn {
  (x: number): string;
}

const toStrT: TFn = (x) => '' + x;
const toStrT: IFn = (x) => '' + x;
```

타입 별칭과 인터페이스는 모두 제너릭이 가능합니다.

```ts
type TPair<T> = {
  first: T;
  second: T;
}

interface IPair<T> {
  first: T;
  second: T;
}
```

인터페이스는 타입을 확장할 수 있으며, 타입은 인터페이스를 확장할 수 있습니다.

```ts
interface IStateWithPop extends TState {
  population: number;
}

type TStateWithPop = IState & { population: number; };
```

여기서 주의할 점은 인터페이스는 유니온 타입 같은 복잡한 타입을 확장하지 못한다는 것입니다. 복잡한 타입을 확장하고 싶다면 타입과 `&`를 사용해야 합니다.   
한편 클래스를 구현할 때는, 타입과 인터페이스 둘 다 사용할 수 있습니다.

```ts
class StateT implements TState {
  name: string = '';
  capital: string = '';
}

class StateI implements IState {
  name: string = '';
  capital: string = '';
}
```

이제부터는 타입과 인터페이스의 다른 점들을 알아보겠습니다.   

유니온 타입은 있지만 유니온 인터페이스라는 개념은 없습니다.

```ts
type AorB = 'a' | 'b';
```

인터페이스는 타입을 확장할 수 있지만, 유니온은 할 수 없습니다. 그런데 유니온 타입을 확장하는 게 필요할 때가 있습니다.

```ts
type Input = { /* ... */};
type Output = { /* ... */};
interface VariableMap {
  [name: string]: Input | Output;
}
```

또는 유니온 타입에 `name` 속성을 붙인 타입을 만들 수도 있습니다. 다음과 같습니다.

```ts
type NamedVariable = (Input | Output) & { name: string };
```

이 타입은 인터페이스로 표현할 수 없습니다. `type` 키워드는 일반적으로 `interface`보다 쓰임새가 많습니다. `type` 키워드는 유니온이 될 수도 있고, 매핑된 타입 또는 조건부 타입 같은 고급 기능에 활용되기도 합니다.   
튜플과 배열 타입도 `type` 키워드를 이용해 더 간결하게 표현할 수 있습니다.

```ts
type Pair = [number, number];
type StringList = string[];
type NamedNums = [string, ...number[]];
```

인터페이스로도 튜플과 비슷하게 구현할 수 있기는 합니다.

```ts
interface Tuple {
  0: number;
  1: number;
  length: 2;
}
const t: Tuple = [10, 20]; // 정상
```

그러나 인터페이스로 튜플과 비슷하게 구현하면 튜플에서 사용할 수 있는 `concat` 같은 메서드들을 사용할 수 없습니다. 그러므로 튜플은 `type` 키워드로 구현하는 것이 낫습니다.   

반면 인터페이스는 타입에 없는 몇 가지 기능이 있습니다. 그중 하나로 바로 **보강**(**augment**)이 가능하다는 것입니다. 이번 아이템 처음에 등장했던 `State` 예제에 `population` 필드를 추가할 때 보강 기법을 사용할 수 있습니다.

```ts
interface IState {
  name: string;
  capital: string;
}

interface IState {
  population: number;
}

const wyoming: IState = {
  name: 'Wyoming',
  capital: 'Cheyenne',
  population: 500_000
}; // 정상
```

이 예제처럼 속성을 확장하는 것을 **선언 병합**(**declaration merging**)이라고 합니다. 선언 병합은 주로 타입 선언 파일에서 사용됩니다. 따라서 타입 선언 파일을 작성할 때는 선언 병합을 지원하기 위해 반드시 인터페이스를 사용해야 하며 표준을 따라야 합니다. 타입 선언에는 사용자가 채워야 하는 빈틈이 있을 수 있는데, 바로 이 선언 병합이 그렇습니다.   

병합은 선언처럼 일반적인 코드라서 언제든지 가능하다는 것을 알고 있어야합니다. 그러므로 프로퍼티가 추가되는 것을 원하지 않는다면 인터페이스 대신 타입을 사용해야 합니다.   

이번 아이템의 처음 질문으로 돌아가 타입과 인터페이스 중 어느 것을 사용해야 할지 결론을 내려 보겠습니다. 복잡한 타입이라면 고민할 것도 없이 타입 별칭을 사용하면 됩니다. 그러나 타입과 인터페이스, 두 가지 방법으로 모두 표현할 수 있는 간단한 객체 타입이라면 일관성과 보강의 관정에서 고려해 보아야 합니다. 알관되게 인터페이스를 사용하는 코드베이스에서 작업하고 있다면 인터페이스를 사용하고, 일관되게 타입을 사용 중이라면 타입을 사용하면 됩니다.   
아직 스타일이 확립되지 않은 프로젝트라면, 향우에 보강의 가능성이 있을지 생각해 봐야 합니다. 어떤 API에 대한 타입 선언을 작성해야 한다면 인터페이스를 사용하는 게 좋습니다. API가 변경될 때 사용자가 인터페이스를 통해 새로운 필드를 병합할 수 있어 유용하기 때문입니다. 그러나 프로젝트 내부적으로 사용되는 타입에 선언 병합이 발생하는 것은 잘못된 설계입니다. 따라서 이럴 때는 타입을 사용해야 합니다.

## 🥕 아이템 14. 타입 연산과 제너릭 사용으로 반복 줄이기
타입 중복은 코드 중복만큼 많은 문제를 발생시킵니다. 타입에서 중복이 더 흔한 이유 중 하나는 공유된 패턴을 제거하는 메커니즘이 기존 코드에서 하던 것과 비교해 덜 익숙하기 때문입니다. 그러나 타입 간에 매핑하는 방법을 익히면, 타입 정의에서도 DRY의 장점은 적용할 수 있습니다.   
반복을 줄이는 가장 간단한 방법은 타입에 이름을 붙이는 것입니다. 다음 예제의 거리 계산 함수에는 타입이 반복적으로 등장합니다.

```ts
function distance(a: { x: number. y: number }, b: { x: number, y: number }) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}
```

코드를 수정해 타입에 이름을 붙여 보겠습니다.

```ts
interface Point2D {
  x: number;
  y: number;
}

function distance(a: Point2D, b: Point2D) { /* ... */}
```

중복된 타입은 종종 문법에 의해서 가려지기도 합니다. 예를 들어, 몇몇 함수가 같은 타입 시그니처를 공유하고 있다고 해 보겠습니다.

```ts
function get(url: string, opts: Options): Promise<Response> { /* ... */ }
function post(url: string, opts: Options): Promise<Response> { /* ... */ }
```

그러면 해당 시그니처를 명명된 타입으로 분리해 낼 수 있습니다.

```ts
type HTTPFunction = (url: string, opts: Options) => Promise<Response>;
const get: HTTPFunction(url, opts) => { /* ... */ };
const post: HTTPFunction(url, opts) => { /* ... */ };
```

만걍 두 인터페이스가 필드의 부분 집합을 공유한다면, 공통 필드만 골라서 기반 클래스로 분리해 낼 수 있습니다.   
이미 존재하는 타입을 확장하는 경우에, 일반적이지는 않지만 이터섹션 연산자(&)을 쓸 수도 있습니다.

```ts
type PersonWithBirthDate = Person & { birth: Date };
```

이런 기법은 유니온 타입(확장할 수 없는)에 속성을 추가하려고 할 때 특히 유용합니다.   

전체 애플리케이션의 상태를 표현하는 `State`타입과 단지 부분만 표현하는 `TopNavState`가 있는 경우를 살펴보겠습니다.

```ts
interface State {
  userId: string;
  pageTitle: string;
  recentFiles: string[];
  pageContents: string;
}

interface TopNavState {
  userId: string;
  pageTitle: string;
  recentFiles: string[];
}
```

`TopNavState`를 확장하여 `State`를 구성하기보다, `State`의 부분 집합으로 `TopNavState`를 정의하는 것이 바람직해 보입니다. 이 방법이 전체 앱의 상태를 하나의 인터페이스로 유지할 수 있게 해줍니다. `State`를 인덱싱하여 속성의 타입에서 중복을 제거할 수 있습니다.

```ts
type TopNavState = {
  userId: State['userId'];
  pageTitle: State['pageTitle'];
  recentFiles: State['recentFiles'];
}
```

그러나 여전히 반복되는 코드가 존재합니다. 이때 **매핑된 타입**을 사용하면 좀 더 나아집니다.

```ts
type TopNavState = {
  [k in 'userId' | 'pageTitle' | 'recentFiles']: State[k]
};
```

매핑된 타입은 배열의 필드를 루프 도는 것과 같은 방식입니다. 이 패턴은 표준 라이브러리에서도 일반적으로 찾을 수 있으며, `Pick`이라고 합니다.

```ts
type Pick<T, K> = { [k in K]: T[k] };

type TopNavState = Pick<State, 'userId' | 'pageTitle' | 'recentFiles'>;
```

태그된 유니온에서도 다른 형태의 중복이 발생할 수 있습니다. 그런데 단순히 태그를 붙이기 위해서 타입을 사용한다면 어떨지 생각해 보겠습니다.

```ts
interface SaveAction {
  type: 'save';
  // ...
}

interface LoadAction {
  type: 'load';
  // ...
}

type Action = SaveAction | LoadAction;
type ActionType = 'save' | 'load'; // 타입의 반복!
```

`Action` 유니온을 인덱싱하면 타입 반복 없이 `ActionType`은 자동적으로 그 타입을 포합합니다. `ActionType`은 `Pick`을 사용하여 얻게 되는, `type` 속성을 가지는 인터페이스와는 다릅니다.

```ts
type ActionRec = Pick<Action, 'type'>; // { type: "save" | "load" }
```

한편 생성하고 난 다음에 업데이트가 되는 클래스를 정의한다면, `update` 메서드 매개변수의 타입은 생성자와 동일한 매개변수이면서, 타입 대부분의 선택적 필드가 됩니다.

```ts
interface Options {
  width: number;
  height: number;
  color: string;
  label: string;
}

interface OptionsUpdate {
  width?: number;
  height?: number;
  color?: string;
  label?: string;
}

class UIWidget {
  constructor(init: Options) { /* ... */ }
  update(options: OptionsUpdate) { /* ... */ }
}
```

매핑된 타입과 `keyof`를 사용하면 `Options`으로부터 `OptionsUpdate`를 만들 수 있습니다.

```ts
type OptionsUpdate = { [k in keyof Options]?: Options[k] };
```

이 패턴 역시 아주 일반적이며 표준 라이브러리에 Partial이라는 이름으로 포함되어 있습니다.

```ts
class UIWidget {
  constructor(init: Options) { /* ... */ }
  update(options: Partial<Options>) { /* ... */ }
}
```

값의 형태에 해당하는 타입을 정의하고 싶을 때도 있습니다.

```ts
const INIT_OPTIONS = {
  width: 640,
  height: 400,
  color: '#00FF00',
  label: 'VGA',
};

interface Options {
  width: number;
  height: number;
  color: string;
  label: string;
}
```

이런 경우 `typeof`를 사용하면 됩니다.

```ts
type Options = typeof INIT_OPTIONS;
```

이 코드는 자바스크립트의 런타임 연산자 `typeof`를 사용한 것처럼 보이지만, 실제로는 타입스크립트 단계에서 연산되며 훨씬 더 정확하게 타입을 표현합니다. 그런데 값으로부터 타입을 만들어낼 때는 선언의 순서에 주의해야 합니다. 그렇게 해야 타입이 더 명확해지고, 예상하기 어려운 타입 변동을 방지할 수 있습니다.   

함수나 메서드의 반환 값에 명명된 타입을 만들고 싶을 수도 있습니다.

```ts
function getUserInfo(userId: string) {
  // ...
  return {
    userId,
    name,
    age,
    height,
    weight,
    favoriteColor,
  };
}
```

이때는 조건부 타입이 필요합니다. 표준 라이브러리에는 이러한 일반적인 패턴의 제너릭 타입이 정의되어 있습니다.

```ts
type UserInfo = ReturnType<typeof getUserInfo>;
```

제너릭 타입은 타입을 위한 함수와 같습니다. 그리고 함수에는 코드에 대한 DRY 원칙을 지킬 때 유용하게 사용됩니다. 함수에서 매개변수로 매핑할 수 있는 값을 제한하기 위해 타입 시스템을 사용하는 것처럼 제너릭 타입에서 매개변수를 제한할 수 있는 방법이 필요합니다.   

제너릭 타입에서 매개변수를 제한할 수 있는 방법은 `extends`를 사용하는 것입니다. `extends`를 이용하면 제너릭 매개변수가 특정 타입을 확장한다고 선헌할 수 있습니다.

```ts
interface Name {
  first: string;
  last: string;
}

type DancingDuo<T extends Name> = [T, T];

const couple1: DancingDuo<Name> = [
  { first: 'Fred', last: 'Astaire' },
  { first: 'Ginger', last: 'Rogers' }
]; // OK

const couple2: DancingDuo<{ first: string }> = [ // "Name" 타입에 필요한 "last" 속성이 없습니다.
  { first: 'Sonny' },
  { first: 'Cher' },
]
```

`{ first: string }`은 `Name`을 확장하지 않기 때문에 오류가 발생합니다.   

점점 더 추상적인 타입을 다루고 있지만, 원래의 목표를 잊으면 안 됩니다. 원래의 목표는 유효한 프로그램은 통과시키고 무효한 프로그램에는 오류를 발생시키는 것입니다. 값 공간에서와 마찬가지로 반복적인 코드는 타입 공간에서도 좋지 않습니다. 반복하지 않도록 주의해야 합니다.

## 🥕 아이템 15. 동적 데이터에 인덱스 시그니처 사용하기
자바스크립트 객체는 문자열 키를 타입의 값에 관계없이 매핑합니다. 타입스크립트에서는 타입에 **인덱스 시그니처**를 명시하여 유연하게 매핑을 표현할 수 있습니다.

```ts
type Rocket = {
  [property: string]: string
};

const rocket: Rocket = {
  name: 'Falcon 9',
  variant: 'v1.0',
  thrust: '4,940 kN',
}; // 정상
```

`[property: string]: string`이 인덱스 시그니처이며, 다음 세 가지 의미를 담고 있습니다.
- 키의 이름: 키의 위치만 표시하는 용도입니다. 타입 체커에서는 사용하지 않기 때문에 무시할 수 있는 참고 정보라고 생각해도 됩니다.
- 키의 타입: `string`이나 `number` 또는 `symbol`의 조합이어야 하지만, 보통은 `string`을 사용합니다.
- 값의 타입: 어떤 것이든 될 수 있습니다.

이렇게 타입 체크가 수행되면 네 가지 단점이 드러납니다.
- 잘못된 키를 포함해 모든 키를 허용합니다.
- 특정 키가 필요하지 않습니다. `{}`도 유효한 `Rocket`입니다.
- 키마다 다른 타입을 가질 수 없습니다.
- 타입스크립트 언어 서비스는 다음과 같은 경우에 도움이 되지 못합니다. 키는 무엇이든 가능하기 때문에 자동 완성 기능이 동작하지 않습니다.

인덱스 시그니처는 부정확하므로 더 나은 방법을 찾아야 합니다.

```ts
interface Rocket {
  name: string;
  variant: string;
  thrust_kN: number;
}

const falconHeavy: Rocket = {
  name: 'Falcon Heavy',
  variant: 'v1',
  thrust_kN: 15_200,
};
```

인덱스 시그니처는 동적 데이터를 표현할 때 사용합니다.   
어떤 타입에 가능한 필드가 제한되어 있는 경우라면 인덱스 시그니처로 모델링하지 말아야 합니다. 예를 들어 데이터에 A, B, C, D 같은 키가 있지만, 얼마나 많이 있는지 모른다면 선택적 필드 또는 유니온 타입으로 모델링하면 됩니다.   

`string` 타입이 너무 광범위해서 인덱스 시그니처를 사용하는 데 문제가 있다면, 두 가지 다른 대안을 생각해 볼 수 있습니다.   
첫 번째, `Record`를 사용하는 방법이니다. `Record`는 키 타입에 유연성을 제공하는 제너릭 타입입니다. 특히, `string`의 부분 집합을 사용할 수 있습니다.

```ts
type Vec3D = Record<'x' | 'y' | 'z', number>;
// Type Vec3D = {
//   x: number;
//   y: number;
//   z: number;
// }
```

두 번째, 매핑된 타입을 사용하는 방법입니다. 매핑된 타입은 키마다 별도의 타입을 사용하게 해 줍니다.

```ts
type Vec3D = {
  [k in 'x' | 'y' | 'z']: number
};
// Type Vec3D = {
//   x: number;
//   y: number;
//   z: number;
// }

type ABC = {
  [k in 'a' | 'b' | 'c']: k extends 'b' ? string : number
};
// Type ABC = {
//   a: number;
//   b: string;
//   c: number;
// }
```

## 🥕 아이템 16. number 인덱스 시그니처보다는 Array, 튜플, ArrayLike를 사용하기
어떤 길이를 가지는 배열과 비슷한 형태의 튜플을 사용하고 싶다면 타입스크립트에 있는 `ArrayLike` 타입을 사용합니다.

```ts
function checkedAccess<T>(xs: ArrayLike<T>, i: number): T {
  if (i < xs.length) {
    return xs[i];
  }

  throw new Error(`배열의 끝을 지나서 ${i}를 접근하려고 했습니다.`);
}
```

이 예제는 길이와 숫자 인덱스 시그니처만 있습니다. 이런 경우가 실제로는 드물기는 하지만 필요하다면 `ArrayLike`를 사용해야 합니다. 그러나 `ArrayLike`를 사용하더라도 키는 여전히 문자열이라는 점을 잊지 말아야 합니다.

```ts
const tupleLike: ArrayLike<string> = {
  '0': 'A',
  '1': 'B',
  length: 2,
}; // 정상
```

배열은 객체이므로 키는 숫자가 아니라 문자열입니다. 인덱스 시그니처로 사용된 `number` 타입은 버그를 잡기 위한 순수 타입스크립트 코드입니다.   
인덱스 시그니처에 `number`를 사용하기보다 `Array`나 튜플, 또는 `ArrayLike` 타입을 사용하는 것이 좋습니다.

## 🥕 아이템 17. 변경 관련된 오류 방지를 위해 `readonly` 사용하기
`readonly number[]`는 "타입"이고, `number[]`와 구분되는 몇 가지 특징이 있습니다.
- 배열의 요소를 읽을 수 있지만, 쓸 수는 없습니다.
- `length`를 읽을 수 있지만, 바꿀 수는 없습니다.(배열을 변경함)
- 배열을 변경하는 `pop`을 비롯한 다른 메서드를 호출할 수 없습니다.

`number[]`는 `readonly number[]`보다 기능이 많기 때문에, `readonly number[]`의 서브타입이 됩니다. 따라서 변경 가능한 배열을 `readonly` 배열에 할당할 수 있습니다. 하지만 그 반대는 불가능합니다.

```ts
const a: number[] = [1, 2, 3];
const b: readonly number[] = a;
const c: number[] = b; // "readonly number[]" 타입은 "readonly"이므로 변경 가능한 "number[]" 타입엥 할당될 수 없습니다.
```

타입 단언문 없이 `readonly` 접근제어자를 제거할 수 있다면 `readonly`는 쓸모없을 것이므로 여기서 오류가 발생하는 게 이치에 맞습니다.   
매개변수를 `readonly`로 선언하면 다음과 같은 일이 생깁니다.
- 타입스크립트는 매개변수가 함수 내에서 변경이 일어나는지 체크합니다.
- 호출하는 쪽에서는 함수가 매개변수를 변경하지 않는다는 보장을 받게 됩니다.
- 호출하는 쪽에서 함수에 `readonly` 배열을 매개변수로 넣을 수도 있습니다.

자바스크립트에서는(타입스크립트에서도 마찬가지) 명시적으로 언급하지 않는 한, 함수가 매개변수를 변경하지 않는다고 가정합니다. 그러나 이러한 암묵적인 방법은 타입 체크에 문제를 일으킬 수 있습니다. 명시적인 방법을 사용하는 것이 컴파일러와 사람 모두에게 좋습니다.   

만약 함수가 매개변수를 변경하지 않는다면, `readonly`로 선언해야 합니다. 이로 인한 단점을 굳이 찾아보자면 매개변수가 `readonly`로 선언되지 않은 함수를 호출해야 할 경우도 있다는 것입니다. 만약 함수가 매개변수를 변경하지 않고도 제어가 가능하다면 `readonly`로 선언하면 됩니다. 만약 다른 라이브러리에 있는 함수를 호출하는 경우라면, 타입 선언을 바꿀 수 없으므로 타입 단언문을 사용해야 합니다. `readonly`를 사용하면 지역 변수와 관련된 모든 종류의 변경 오류를 방지할 수 있습니다.   

`readonly`는 얕게(shallow) 동작한다는 것에 유의하며 사용해야 합니다. 만약 객체의 `readonly` 배열이 있다면, 그 객체 자체는 `readonly`가 아닙니다.   
비슷한 경우가 `readonly`의 사촌 격이자 객체에 사용되는 `Readonly` 제너릭에도 해당합니다.

```ts
interface Outer {
  inner: {
    x: number;
  }
}

const o: Readonly<Outer> = {
  inner: {
    x: 0
  }
};

o.inner = { x: 1 }; // 읽기 전용 속성이기 때문에 inner에 할당할 수 없습니다.
o.inner.x = 1; // 정상
```

타입 별칭을 만든 다음에 정확히 무슨 일이 일어나는지 편집기에서 살펴볼 수 있습니다.

```ts
type T = Readonly<Outer>;
// Type T = {
//   readonly inner: {
//     x: number;
//   };
// }
```

중요한 점은 `readonly` 접근제어자는 `inner`에 적용되는 것이지 `x`는 아니라는 것입니다. 현재 시점에는 깊은(deep) `readonly` 타입이 기본적으로 지원되지 않지만, 제너릭을 만들면 깊은 `readonly` 타입을 사용할 수 있습니다. 그러나 제너릭은 만들기 까다롭기 때문에 라이브러리를 사용하는 게 낫습니다. 예를 들어 [ts-essentials](https://github.com/ts-essentials/ts-essentials)에 있는 [DeepReadonly](https://github.com/ts-essentials/ts-essentials#Deep-wrapper-types) 제너릭을 사용하면 됩니다.

## 🥕 아이템 18. 매핑된 타입을 사용하여 값을 동기화하기
산점도를 그리기 위한 UI 컴포넌트를 작성한다고 가정해 보겠습니다. 여기에는 디스플레이와 동작을 제어하기 위한 몇 가지 다른 타입의 속성이 포함됩니다.

```ts
interface ScatterProps {
  // The data
  xs: number[];
  ys: number[];

  // Display
  xRange: [number, number];
  yRange: [number, number];
  color: string;

  // Events
  onClick: (x: number, y: number, index: number) => void;
}
```

불필요한 작업을 피하기 위해, 필요할 때만 차트를 다시 그릴 수 있습니다. 데이터나 디스플레이 속성이 변경되면 다시 그려야 하지만, 이벤트 핸들러가 변경되면 다시 그릴 필요가 없습니다. 렌더링할 때마다 이벤트 핸들러 `Prop`이 새 화살표 함수로 설정됩니다.   

최적화를 두 가지 방법으로 구현해 보겠습니다. 다음 예제는 첫 번째 방법입니다.

```ts
function shouldUpdate(oldProps: ScatterProps, newProps: ScatterProps) {
  let k: keyof ScatterProps;

  for (k in oldProps) {
    if (oldProps[k] !== newProps[k]) {
      if (k !== 'onClick') return true;
    }
  }

  return false;
}
```

만약 새로운 속성이 추가되면 `shouldUpdate` 함수는 값이 변경될 때마다 차트를 다시 그릴 것입니다. 이렇게 처리하는 것을 **보수적(conservative) 접근법** 또는 **실패에 닫힌(fail close) 접근법**이라고 합니다. 이 접근법을 이용하면 차트가 정확하지만 너무 자주 그려질 가능성이 있습니다.   

두 번째 최적화 방법은 다음과 같습니다. **실패에 열린 접근법**을 사용했습니다.

```ts
function shouldUpdate(oldProps: ScatterProps, newProps: ScatterProps) {
  return (
    oldProps.xs !== newProps.xs ||
    oldProps.ys !== newProps.ys ||
    oldProps.xRange !== newProps.xRange ||
    oldProps.yRange !== newProps.yRange ||
    oldProps.color !== newProps.color
    // no check for onClick
  )
}
```

이 코드는 차트를 불필요하게 다시 그리는 단점을 해결헀습니다. 하지만 실제로 차트를 다시 그려야 할 경우에 누락되는 일이 생길 수 있습니다. 앞선 두 가지 최적화 방법은 모두 이상적이지 않습니다. 새로운 속성이 추가될 때 직접 `shouldUpdate`를 고치도록 하는 게 낫습니다.   

다음은 타입 체커가 동작하도록 개선한 코드입니다. 핵심은 매핑된 타임과 객체를 사용하는 것입니다.

```ts
const REQUIRES_UPDATE: { [k in keyof ScatterProps]: boolean} = {
  xs: true,
  ys: true,
  xRange: true,
  yRange: true,
  color: true,
  onClick: false,
};

function shouldUpdate(oldProps: ScatterProps, newProps: ScatterProps) {
  let k: keyof ScatterProps;

  for (k in oldProps) {
    if (oldProps[k] !== newProps[k] && REQUIRES_UPDATE[k]) {
      return true;
    }
  }

  return false;
}
```

여기서 우리는 앞에서 다루었던 최적화 예제에서처럼 실패에 열린 방법을 선택할지, 닫힌 방법을 선택할지 정해야 합니다.   
매핑된 타입은 한 객체가 또 다른 객체와 정확히 같은 속성을 가지게 할 때 이상적입니다. 이번 예제처럼 매핑된 타입을 사용해 타입스크립트가 코드에 제약을 강제하도록 할 수 있습니다.
