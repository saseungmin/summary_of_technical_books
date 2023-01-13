---
sidebar_position: 6
sidebar_label: 5. any 다루기
---

# 🐤 Chapter 5. any 다루기

## 🥕 아이템 38. `any` 타입은 가능한 한 좁은 범위에서만 사용하기

```ts
function processBar(b: Bar) { /* ... */ }

function f() {
  const x = expressionReturnFoo();
  processBar(x);
  //         ~ 'Foo' 형식의 인수는 'Bar' 형식의 매개변수에 할당될 수 없습니다.
}
```

문맥상으로 `x`라는 변수가 동시에 `Foo` 타입과 `Bar` 타입에 할당 가능하다면, 오류를 제거하는 방법은 두 가지입니다.

```ts
function f1() {
  const x: any = expressionReturnFoo(); // 이렇게 하지 맙시다.
  processBar(x);
}

function f2() {
  const x = expressionReturnFoo();
  processBar(x as any); // 이게 낫습니다.
}
```

두 가지 해결책 중에서 `f1`에 사용된 `x: any`보다 `f2`에 사용된 `x as any` 형태가 권장됩니다. 그 이유는 `any` 타입이 `processBar` 함수의 매개변수에서만 사용된 표현식이므로 다른 코드에는 영향을 미치지 않기 때문입니다.   

비슷한 관점에서, 타입스크립트가 함수의 반환 타입을 추론할 수 있는 경우에도 함수의 반환 타입을 명시하는 것이 좋습니다. 함수의 반환 타입을 명시하면 `any` 타입의 함수 바깥으로 영향을 미치는 것을 방지할 수 있습니다.   

`f1`은 오류를 제거하기 위해 `x`를 `any` 타입으로 선언했습니다. 한편 `f2`는 오류를 제거하기 위해 `x`가 사용되는 곳에 `as any` 단언문을 사용했습니다. 여기서 `@ts-ignore`를 사용하면 `any`를 사용하지 않고 오류를 제거할 수 있습니다.   

```ts
function f1() {
  const x = expressionReturnFoo();
  // @ts-ignore
  processBar(x);
  return x;
}
```

그러나 근본적인 원인을 해결한 것이 아니기 때문에 다른 곳에서 더 큰 문제가 발생할 수도 있습니다. 타입 체커가 알려 주는 오류는 문제가 될 가능성이 높은 부분이므로 근본적인 원인을 찾아 적극적으로 대처하는 것이 바람직합니다.   
이번에는 객체와 관련한 `any`의 사용법을 살펴보겠습니다. 어떤 큰 객체 안의 한 개 속성이 타입 오류를 가지는 상황을 예로 들어 보겠습니다.

```ts
const config: Config = {
  a: 1,
  b: 2,
  c: {
    key: value
  // ~~ 'foo' 속성이 'Foo' 타입에 필요하지만 'Bar' 타입에는 없습니다.
  }
};
```

단순히 생각하면 `config` 객체 전체를 `as any`로 선언해서 오류를 제거할 수 있습니다.

```ts
const config: Config = {
  a: 1,
  b: 2,
  c: {
    key: value
  }
} as any; // 이렇게 하지 맙시다!
```

객체 전체를 `any`로 단언하면 다른 속성들 역시 타입 체크가 되지 않는 부작용이 생깁니다. 그러므로 다음 코드처럼 최소한의 범위에서만 `any`를 사용하는 것이 좋습니다.

```ts
const config: Config = {
  a: 1,
  b: 2,
  c: {
    key: value as any
  }
};
```

## 🥕 아이템 39. `any`를 구체적으로 변형해서 사용하기
`any`는 자바스크립트에서 표현할 수 있는 모든 값을 아우르는 매우 큰 범위의 타입입니다. `any` 타입에는 모든 숫자, 문자열, 배열, 객체, 정규식, 함수, 클래스, DOM 엘리먼트는 물론 `null`과 `undefined`까지도 포함됩니다.   
반대로 말하면, 일반적인 상황에서는 `any`보다 더 구체적으로 표현할 수 있는 타입이 존재할 가능성이 높기 때문에 더 구체적인 타입을 찾아 타입 안전성을 높이도록 해야 합니다.   

예를 들어, `any` 타입의 값을 그대로 정규식이나 함수에 넣는 것은 권장되지 않습니다.

```ts
function getLengthBad(array: any) { // 이렇게 하지 맙시다!
  return array.length;
}

function getLength(array: any[]) {
  return array:length;
}
```

앞의 예제에서 `any`를 사용하는 `getLengthBad`보다는 `any[]`를 사용하는 `getLength`가 더 좋은 함수입니다. 그 이유는 세 가지입니다.
- 함수 내의 `array.length` 타입이 체크됩니다.
- 함수의 반환 타입이 `any` 대신 `number`로 추론됩니다.
- 함수 호출될 때 매개변수가 배열인지 체크합니다.

그리고 함수의 매개변수가 객체이긴 하지만 값을 알 수 없다면 `{[key: string]: any}`처럼 선언하면 됩니다.

```ts
function hasTwelveLetterKey(o: {[key: string]: any}) {
  for (const key in o) {
    if (key.length === 12) {
      return true;
    }
  }
  return false;
}
```

앞의 예제처럼 함수의 매개변수가 객체지만 값을 알 수 없다면 모든 비기본형 타입을 포함하는 `object` 타입을 사용할 수도 있습니다. `object`타입은 객체의 키를 열거할 수는 있지만 속성에 접근할 수 없다는 점에서 `{[key: string]: any}`와 약간 다릅니다.   

함수의 타입에서도 단순히 `any`를 사용해서는 안 됩니다. 최소한으로나마 구체화할 수 있는 세 가지 방법이 있습니다.

```ts
type Fn0 = () => any; // 매개변수 없이 호출 가능한 모든 함수
type Fn1 = (arg: any) => any; // 매개변수 1개
type FnN = (...args: any[]) => any; // 모든 개수의 매개변수 "Function" 타입과 동일합니다.
```

앞의 예제에 등장한 세 가지 함수 타입 모두 `any`보다는 구체적입니다. 마지막 줄을 잘 살펴보면 `...args`의 타입을 `any[]`로 선언했습니다. `any`로 선언해도 동작하지만 `any[]`로 선언하면 배열 형태ㅐ라는 것을 알 수 있어 더 구체적입니다.

```ts
const numArgsBad = (...args: any) => args.length; // any를 반환합니다.
const numArgsGood = (...args: any[]) => args.length; // number를 반환합니다.
```

## 🥕 아이템 40. 함수 안으로 타입 단언문 감추기
함수 내부에는 타입 단언을 사용하고 함수 외부로 드러나는 타입 정의를 정확히 명시하는 정도로 끝내는 게 낫습니다. 프로젝트 전반에 위험한 타입 단언문이 드러나 있는 것보다, 제대로 타입이 정의된 함수 안으로 타입 단언문을 감추는 것이 더 좋은 설계입니다.   

예를 들어, 어떤 함수가 자신의 마지막 호출을 캐시하도록 만든다고 가정해보겠습니다.

```ts
declare function cacheLast<T extends Function>(fn: T): T;

declare function shallowEqual(a: any, b: any): boolean;
function cacheLast<T extends Function>(fn: T): T {
  let lastArgs: any[]|null = null;
  let lastResult: any;

  return function(...args: any[]) {
    //   ~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // '(...args: any[]) => any' 형식은 'T' 형식에 할당할 수 없습니다.
    if (!lastArgs || !shallowEqual(lastArgs, args)) {
      lastResult = fn(...args);
      lastArgs = args;
    }

    return lastResult;
  };
}
```

타입스크립트는 반환문에 있는 함수와 원본 함수 `T`타입이 어떤 관련이 있는지 알지 못하기 때문에 오류가 발생했습니다. 그러나 결과적으로 원본 함수 `T` 타입과 동일한 매개변수로 호출되고 반환값 역시 예상한 결과가 되기 때문에, 타입 단언문을 추가해서 오류를 제거하는 것이 큰 문제가 되지는 않습니다.

```ts
function cacheLast<T extends Function>(fn: T): T {
  let lastArgs: any[]|null = null;
  let lastResult: any;

  return function(...args: any[]) {
    if (!lastArgs || !shallowEqual(lastArgs, args)) {
      lastResult = fn(...args);
      lastArgs = args;
    }

    return lastResult;
  } as unknown as T;
}
```

실제로 함수를 실행해 보면 잘 동작합니다.

```ts
declare function shallowObjectEqual<T extends object>(a: T, b: T): boolean;
declare function shallowEqual(a: any, b: any): boolean;
function shallowObjectEqual<T extends object>(a: T, b: T): boolean {
  for (const [k, aVal] of Object.entries(a)) {
    if (!(k in b) || aVal !== b[k]) { // '{}' 형식에 인덱스 시그니처가 없으므로 요소에 암시적으로 'any' 형식이 있습니다.
      return false;
    }
  }
  return Object.keys(a).length === Object.keys(b).length;
}
```

`if` 구문의 `k in b` 체크로 `b` 객체에 `k`속성이 있다는 것을 확인했지만 `b[k]` 부분에서 오류가 발생하는 것이 이상합니다. 어쨌든 실제 오류가 아니라는 것을 알고 있기 때문에 `any`로 단언하는 수밖에 없습니다.

```ts
function shallowObjectEqual<T extends object>(a: T, b: T): boolean {
  for (const [k, aVal] of Object.entries(a)) {
    if (!(k in b) || aVal !== (b as any)[k]) {
      return false;
    }
  }
  return Object.keys(a).length === Object.keys(b).length;
}
```

`b as any` 타입 단언문은 안전하며(`k in b` 체크를 했으므로), 결국 정확한 타입으로 정의되고 제대로 구현된 함수가 됩니다. 객체가 같은지 체크하기 위해 객체 순회와 단언문이 코드에 직접 들어가는 것보다, 앞의 코드처럼 별도의 함수로 분리해 내는 것이 훨씬 좋은 설계입니다.

## 🥕 아이템 41. `any`의 진화를 이해하기

```ts
function range(start: number, limit: number) {
  const out = []; // 타입이 any[]
  for (let i = start; i < limit; i++) {
    out.push(i); // out의 타입이 any[]
  }
  return out; // 반환 타입이 number[]로 추론됨.
}
```

`out`의 타입은 `any[]`로 선언되었지만 `number` 타입의 값을 넣는 순간부터 타입은 `number[]`로 진화합니다.   
타입의 진화는 타입 좁히기(아이템 22)와 다릅니다. 배열에 다양한 타입의 요소를 넣으면 배열의 타입이 확장되며 진화합니다.

```ts
const result = []; // 타입이 any[]
result.push('a');
result // 타입이 string[]
result.push(1);
result // 타입이 (string | number)[]
```

또한 조건문에서는 분기에 따라 타입이 변할 수도 있습니다.

```ts
let val; // 타입이 any
if (Math.random() < 0.5) {
  val = /hello/;
  val // 타입이 ReqExp
} else {
  val = 12;
  val // 타입이 number
}
val // 타입이 number | RegExp
```

변수의 초깃값이 `null`인 경우에도 `any`의 진화가 일어납니다. 보통은 `try/catch` 블록 안ㅇ네서 변수를 할당하는 경우에 나타납니다.

```ts
let val = null // 타입이 any
try {
  somethingDangerous()
  val = 12;
  val // 타입이 number
} catch (e) {
  console.log('alas!');
}
val // 타입이 number | null
```

`any` 타입의 진화는 `noImplicitAny`가 설정된 상태에서 변수의 타입이 암시적 `any`인 경우에만 일어납니다. 그러나 명시적으로 `any`를 선언하면 타입이 그대로 유지됩니다.   

`any`가 진화하는 방식은 일반적인 변수가 추론되는 원리와 동일합니다. 예를 들어, 진화한 배열의 타입이 `(string|number)[]`라면, 원래 `number[]` 타입이어야하지만 실수로 `string`이 섞여서 잘못 진화한 것일 수 있습니다. 타입을 안전하게 지키기 위해서는 암시적 `any`를 진화시키는 방법보다 명시적 타입 구문을 시용하는 것이 더 좋은 설계입니다.

## 🥕 아이템 42. 모르는 타입의 값에는 `any` 대신 `unknown`을 사용하기
먼저 함수의 반환값과 관련된 `unknown`을 알아보겠습니다.

```ts
function parseYAML(yaml: string): any {
  // ...
}
```

함수에서 반환 타입으로 `any`를 사용하는 것은 좋지 않은 설계입니다.   
대신 `parseYAML`를 호출한 곳에서 반환값을 원하는 타입으로 할당하는 것이 이상적입니다. 그러나 함수의 반환값에 타입 선언을 강제할 수 없기 떄문에, 호출한 곳에서 타입 선언을 생략하게 되면 사용되는 곳 마다 타입 오류가 발생하게 됩니다.

```ts
const book = parseYAML(`
  name: Jane Eyre
  author: Charlotte Bronte
`);

alert(book.title); // 오류 없음, 런타임에 "undefined" 경고
book('read'); // 오류 없음, 런타임에 "TypeError: book은 함수가 아닙니다" 예외 발생
```

대신 `parseYAML`이 `unknown` 타입을 반환하게 만드는 것이 더 안전합니다.

```ts
function safeParseYAML(yaml: string): unknown {
  return parseYAML(yaml);
}

const book = safeParseYAML(`
  name: The Tenant of Wildfell Hall
  author: Anne Brnote
`);

alert(book.title); // 개체가 'unknown' 형식입니다.
book('read'); // 객체가 'unknown' 형식입니다.
```

`unknown` 타입을 이해하기 위해서는 할당 가능성의 관점에서 `any`를 생각해 볼 필요가 있습니다. `any`가 강력하면서도 위험한 이유는 다음 두 가지 특징으로부터 비롯됩니다.

- 어떠한 타입이든 `any`타입에 할당 가능하다.
- `any` 타입은 어떠한 타입으로도 할당 가능하다. (`never` 타입은 제외)

타입 체커는 집합 기반이기 때문에 `any`를 사용하면 타입 체커가 무용지물이 된다는 것을 중의해야 합니다.   

`unknown`은 `any` 대신 쓸 수 있는 타입 시스템에 부합하는 타입입니다. `unknown` 타입은 앞에서 언급한 `any`의 첫 번째 속성을 만족하지만, 두 번째 속성(`unknown`은 오직 `unknown`과 `any`에만 할당 가능)은 만족하지 않습니다. 반면 `never` 타입은 `unknown`과 정반대입니다.   
첫 번째 속성(어떤 타입도 `never`에 할당할 수 없음)은 만족하지 않지만, 두 번째 속성(어떠한 타입으로도 할당 가능)은 만족합니다.   

`unknown` 타입인 채로 값을 사용하면 오류가 발생합니다. `unknown`인 값에 함수 호출을 하거나 연산을 하려고 해도 마찬가지입니다. `unknown` 상태로 사용하려고 하면 오류가 발생하기 때문에, 적절한 타입으로 변환하도록 강제할 수 있습니다.

```ts
const book = safeParseYAML(`
  name: The Tenant of Wildfell Hall
  author: Anne Brnote
`) as Book;

alert(book.title); // 'Book' 형식에 'title' 속성이 없습니다.
book('read'); // 이 식은 호출할 수 없습니다.
```

함수의 반환 타입인 `unknown` 그대로 값을 사용할 수 없기 때문에 `Book`으로 타입 단언을 해야 합니다. 애초에 반환값을 `Book`이라고 기대하며 함수를 호출하기 때문에 단언문은 문제가 되지 않습니다. 그리고 `Book` 타입 기준으로 타입 체크가 되기 때문에, `unknown` 타입 기준으로 오류를 표시했던 예제보다 오류 정보가 더 정확합니다.   

다음으로 변수 선언과 관련된 `unknown`을 알아보겠습니다. 어떠한 값이 있지만 그 타입을 모르는 경우에 `unknown`을 사용합니다.

```ts
interface Feature {
  id?: string | number;
  geometry: Geometry;
  properties: unknown; // JSON 직렬화가 가능한 모든 것을 담는 잡동사니 주머니 같은 존재로 예상할 수 없기 때문에 unknown 사용
}
```

타입 단언문에 `unknown`에서 원하는 타입으로 변환하는 유일한 방법은 아닙니다. `instanceof`를 체크한 후 `unknown`에서 원하는 타입으로 변환할 수 있습니다.

```ts
function processValue(val: unknown) {
  if (val instanceof Date) {
    val // 타입이 Date
  }
}
```

또한 사용자 정의 타입 가드도 `unknown`에서 원하는 타입으로 변환할 수 있습니다.

```ts
function isBook(val: unknown): val is Book {
  return (
    typeof(val) === 'object' && val !== null && 'name' in val && 'author' in val
  );
}

function processValue(val: unkown) {
  if (isBook(val)) {
    val; // 타입이 Book
  }
}
```

가끔 `unknown` 대신 제너릭 매개변수가 사용되는 경우도 있습니다. 제너릭을 사용하기 위해 다음 코드처럼 `safeParseYAML` 함수를 선언할 수 있습니다.

```ts
function safeParseYAML<T>(yaml: string): T {
  return parsYAML(yaml);
}
```

그러나 앞의 코드는 일반적으로 타입스크립트에서 좋지 않은 스타일입니다.   
제너릭을 사용한 스타일은 타입 단언문과 달라 보이지만 기능적으로는 동일합니다. 제너릭보다는 `unknown`을 반환하고 사용자가 직접 단언문을 사용하거나 원하는 대로 타입을 좁히도록 강제하는 것이 좋습니다.   

다음으로 단언문과 관련된 `unknown`을 알아보겠습니다. 이중 단언문에서 `any` 대신 `unknown`을 사용할 수도 있습니다.

```ts
declare const foo: Foo;
let barAny = foo as any as Bar;
let barUnk = foo as unknown as Bar;
```

`barAny`와 `barUnk`는 기능적으로 동일하지만, 나중에 두 개의 단언문을 분리하는 리팩터링을 한다면 `unknown` 형태가 더 안전합니다. `any`의 경우에는 분리되는 순간 그 영향력이 전염병처럼 퍼지게 됩니다. 그러나 `unknown`의 경우는 분리되는 즉시 오류를 발생하게 되므로 더 안전합니다.   

마지막으로 `unknown`과 유사하지만 조금 다른 타입들도 알아보겠습니다. `object` 또는 `{}`를 사용하는 방법 역시 `unknown`만큼 범위가 넓은 타입이지만, `unknown`보다는 범위가 약가 좁습니다.
- `{}` 타입은 `null`과 `undefined`를 제외한 모든 값을 포함합니다.
- `object` 타입은 모든 비기본형 타입으로 이루어집니다. 여기에는 `true`또는 `12` 또는 `"foo"`가 포함되지 않지만 객체와 배열은 포함됩니다.

`unknown` 타입이 도입되기 전에는 `{}`가 더 일반적으로 사용되었지만, 최근에는 `{}`를 사용하는 경우가 꽤 드뭅니다. 정말로 `null`과 `undefined`가 불가능하다고 판단되는 경우에만 `unknown` 대신 `{}`를 사용하면 됩니다.

## 🥕 아이템 43. 몽키 패치보다는 안전한 타입을 사용하기
자바스크립트의 가장 유명한 특징 중 하나는, 객체와 클래스에 임의의 속성을 추가할 수 있을 만큼 유연하다는 것입니다.

```js
window.monkey = 'Tamarin';
document.monkey = 'Howler';
```

위 예처럼 `window` 또는 DOM 노드에 데이터를 추가한다고 가정해 보겠습니다. 그러면 그 데이터는 기본적으로 전역 변수가 됩니다. 전역 변수를 사용하면 은연중에 프로그램 내에서 서로 멀리 떨어진 부분들 간에 의존성을 만들게 됩니다.   
타입스크립트까지 더하면 또 다른 문제가 발생합니다. 타입 체커는 `Document`와 `HTMLElement`의 내장 속성에 대해서는 알고 있지만, 임의로 추가한 속성에 대해서는 알지 못합니다.

```ts
document.monkey = 'Tamarin';
      // ~~~~~~  'Document' 유형에 'monkey' 속성이 없습니다.
```

이 오류를 해결하는 가장 간단한 방법은 `any` 단언문을 사용하는 것입니다.

```ts
(document as any).monkey = 'Tamarin'; // 정상
```

하지만 `any`를 사용함으로써 타입 안전성을 상실하고, 언어 서비스를 사용할 수 없게 된다는 것입니다.   

최선의 해결책은 `document` 또는 DOM으로부터 데이터를 분리하는 것입니다.   
분리할 수 없는 경우, 두 가치 차선책이 존재합니다.   

첫 번째, `interface`의 특수 기능 중 하나인 보강(augmentation)을 사용하는 것입니다.

```ts
interface Document {
  // 몽키 패치의 속(genus) 또는 종(species)
  monkey: string;
}

document.monkey = 'Tamarin'; // 정상
```

보강을 사용한 방법이 `any`보다 나은 점은 다음과 같습니다.
- 타입이 더 안전합니다. 타입 체커는 오타나 잘못된 타입의 할당을 오류로 표시합니다.
- 속성에 주석을 붙일 수 있습니다.
- 속성에 자동완성을 사용할 수 있습니다.
- 몽키 패치가 어떤 부분에 적용되었는지 정확한 기록이 남습니다.

그리고 모듈의 관점에서, 제대로 동작하게 하려면 `global` 선언을 추가해야 합니다.

```ts
export {};
declare global {
  interface Document {
    // 몽키 패치의 속(genus) 또는 종(species)
    monkey: string;
  }
}

document.monkey = 'Tamarin'; // 정상
```

보강을 사용할 때 주의해야 할 점은 모듈 영역과 관련이 있습니다. 보강은 전역적으로 적용되기 떄문에, 코드의 다른 부분이나 라이브러리로부터 분리할 수 없습니다. 그리고 애플리케이션이 실행되는 동안 속성을 할당하면 실행 시점에서 보강을 적용할 방법이 없습니다.   

두 번째, 더 구체적인 타입 단언문을 사용하는 것입니다.

```ts
interface MonkeyDocument extends Document {
  // 몽키 패치의 속(genus) 또는 종(species)
  monkey: string;
}
(document as MonkeyDocument).monkey = 'Macaque';
```

`MonkeyDocument`는 `Document`를 확장하기 때문에 타입 단언문은 정상이며 할당문의 타입은 안전합니다. 또한 `Document`타입을 건드리지 않고 별도로 확장하는 새로운 타입을 도입했기 때문에 모듈 영역 문제도 해결할 수 있습니다. 따라서 몽키 패치된 속성을 참조하는 경우에만 단언문을 사용하거나 새로운 변수를 도입하면 됩니다. 그러나 몽키패치를 남용해서는 안 되며 궁극적으로 더 잘 설계된 구조로 리팩터링하는 것이 좋습니다.

## 🥕 아이템 44. 타입 커버리지를 추적하여 타입 안전성 유지하기
`noImplicitAny`를 설정하고 모든 암시적 `any` 대신 명시적 타입 구문을 추가해도 `any` 타입과 관련된 문제들로부터 안전하다고 할 수 없습니다. `any` 타입은 여전히 프로그램 내에 존재할 수 있는 두 가지 경우가 있습니다.

- 명시적 `any` 타입
아이템 38과 아이템 39의 내용에 따라 `any` 타입의 범위를 좁히고 구체적으로 만들어도 여전히 `any` 타입입니다.

- 서드파티 타입 선언
이 경우에는 `@types` 선언 파일로부터 `any` 타입이 전파되기 때문에 특별히 조심해야 합니다. `noImplicitAny`를 설정하고 절대 `any`를 사용하지 않았다 하더라도 여전히 `any` 타입은 코드 전반에 영향을 미칩니다.

`any` 타입은 타입 안전성과 생산성에 부정적인 영향을 미칠 수 있으므로, 프로젝트에서 `any`의 개수를 추적하는 것이 좋습니다. npm의 [type-cover-age](https://github.com/plantain-00/type-coverage) 패키지를 활용하여 `any`를 추적할 수 있는 몇 가지 방법이 있습니다.

```bash
$ npx type-coverage
```

### 요약
- `noImplicitAny`가 설정되어 있어도, 명시적 `any` 또는 서드파티 타입 선언(`@types`)을 통해 `any` 타입은 코드 내에 여전히 존재할 수 있다는 점을 주의해야 합니다.
- 작성한 프로그램의 타입이 얼마나 잘 선언되었는지 추적해야 합니다. 추적함으로써 `any`의 사용을 줄여 나갈 수 있고 타입 안전성을 꾸준히 높일 수 있습니다.
