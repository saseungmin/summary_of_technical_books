---
sidebar_position: 4
sidebar_label: 3. 타입 추론
---

# 🐤 Chapter 3: 타입 추론

## 🥕 아이템 19. 추론 가능한 타입을 사용해 장황한 코드 방지하기
타입스크립트의 많은 타입 구문은 사실 불필요합니다. 다음과 같이 코드의 모든 변수에 타입을 선언하는 것은 비생산적이며 형편없는 스타일로 여겨집니다.

```ts
let x: number = 12;
```

다음처럼만 해도 충분합니다.

```ts
let x = 12;
```

편집기에서 `x`에 마우스를 올려 보면, 타입이 `number`로 이미 추론되어 있음을 확인할 수 있습니다.   
타입 추론이 된다면 명시적 타입 구문은 필요하지 않습니다. 오히려 방해가 될 뿐입니다.   

타입스크립트는 더 복잡한 객체도 추론할 수 있습니다.

```ts
const person = {
  name: 'Sojourner Truth'.
  born: {
    where: 'Swartekill, NY',
    when: 'c.1797',
  },
  died: {
    where: 'Battle Creek, MI',
    when: 'Nov, 26. 1883',
  }
};
```

타입을 생략하고 다음처럼 작성해도 충분합니다.   

다음 예제처럼 배열의 경우도 객체와 마찬가지입니다. 타입스크립트는 입력을 받아 연산을 하는 함수가 어떤 타입을 반환하는지 정확히 알고 있습니다.

```ts
function square(nums: number[]) {
  return nums.map(x => x * x);
}

const squares = square([1, 2, 3, 4]); // 타입은 number[]
```

타입이 추론되면 리팩터링 역시 용이해집니다. `Product` 타입과 기록을 위한 함수를 가정해 보겠습니다.

```ts
interface Product {
  id: number;
  name: string;
  price: number;
}

function logProduct(product: Product) {
  const id: number = product.id;
  const name: string = product.name;
  const price: number = product.price;
  console.log(id, name, price);
}
```

그런데 `id`에 문자도 들어 있을 수 있음을 나중에 알게 되었다고 가정해 보겠습니다. 그래서 `Product` 내의 `id` 타입을 변경합니다. 그러면 `logProduct` 내의 `id` 변수 선언에 있는 타입과 맞지 않기 때문에 오류가 발생합니다.

```ts
interface Product {
  id: string;
  name: string;
  price: number;
}

function logProduct(product: Product) {
  const id: number = product.id; // ~~ 'string' 형식은 'number' 형식에 할당할 수 없습니다.
  const name: string = product.name;
  const price: number = product.price;
  console.log(id, name, price);
}
```

`logProduct` 함수 내의 명시적 타입 구문이 없었다면, 코드는 아무런 수정 없이도 타입 체커를 통과했을 겁니다. `logProduct`는 비구조화 할당문을 사용해 구현하는 게 낫습니다.   
비구조화 할당문은 모든 지역 변수의 타입이 추론되도록 합니다. 여기에 추가로 명시적 타입 구문을 넣는다면 불필요한 타입 선언으로 인해 코드가 번잡해집니다.

```ts
function logProduct(product: Product) {
  const { id, name, price }: { id: string; name: string; price: number; } = product;
  console.log(id, name, price);
}
```

함수 매개변수에 타입 구문을 생략하는 경우도 간혹 있습니다. 기본값이 있는 경우를 예로 들어 보겠습니다.

```ts
function parseNumber(str: string, base = 10) {
  // ...
}
```

여기서 기본값이 10이기 때문에 `base`의 타입은 `number`로 추론됩니다.   
보통 타입 정보가 있는 라이브러리에서, 콜백 함수의 매개변수 타입은 자동으로 추론됩니다. 다음 예제에서 express HTTP 서버 라이브러리를 사용하는 `request`와 `response`의 타입 선언은 필요하지 않습니다.

```ts
app.get('/health', (request, response) => {
  response.send('OK');
});
```

타입이 추론될 수 있음에도 여전히 타입을 명시하고 싶은 몇 가지 상황이 있습니다. 그중 하나는 객체 리터럴을 정의할 때입니다.

```ts
const elmo: Product = {
  name: 'Tickle Me Elmo',
  id: '048188 627152',
  price: 28.99,
};
```

이런 정의에 타입을 명시하면, 잉여 속성 체크(아이텝 11)가 동작합니다. 잉여 속성 체크는 특히 선택적 속성이 있는 타입의 오타 같은 오류를 잡는 데 효과적입니다. 그리고 변수가 사용되는 순간이 아닌 할당하는 시점에 오류가 표시되도록 해 줍니다.   
만약 타입 구문을 제거한다면 잉여 속성 체크가 동작하지 않고, 객체를 선언한 곳이 아니라 객체가 사용되는 곳에서 타입 오류가 발생합니다.   

마찬가지로 함수의 반환에도 타입을 명시하여 오류를 방지할 수 있습니다. 타입 추론이 가능할지라도 구현상의 오류가 함수를 호출한 곳까지 영향을 미치지 않도록 하기 위해 타입 구문을 명시하는 게 좋습니다.   
주식 시세를 조회하는 함수를 작성했다고 가정해 보겠습니다.

```ts
function getQuote(ticker: string) {
  return fetch(`https://quotes.example.com/?q=${ticker}`)
    .then(response => response.json());
}
```

이미 조회한 종복을 다시 요청하지 않도록 캐시를 추가합니다.

```ts
const cache: { [ticker: string]: number } = {};
function getQuote(ticker: string) {
  if (ticker in cache) {
    return cache[ticker];
  }

  return fetch(`https://quotes.example.com/?q=${ticker}`)
    .then(response => response.json())
    .then(quote => {
      cache[ticker] = quote;
      return quote;
    });
}
```

실행해 보면 오류는 `getQuote` 내부가 아닌 `getQuote`를 호출한 코드에서 발생합니다.   
이때 의도된 반환 타입(`Promise<number>`)을 명시한다면, 정확한 위치에 오류가 표시됩니다.

```ts
const cache: { [ticker: string]: number } = {};
function getQuote(ticker: string): Promise<number> {
  if (ticker in cache) {
    return cache[ticker]; // 에러
  }

  // ...
}
```

반환 타입을 명시하면, 구현상의 오류가 사용자 코드의 오류로 표시되지 않습니다.   
오류의 위치를 제대로 표시해 주는 이점 외에도, 반환 타입을 명시해야 하는 이유가 두 가지 더 있습니다.   
첫 번째는 반환 타입을 명시하면 함수에 대해 더욱 명확하게 알 수 있기 때문입니다. 반환 타입을 명시하려면 구현하기 전에 입력 타입과 출력 타입이 무엇인지 알아야 합니다. 추후에 코드가 조금 변경되어도 그 함수의 시그니처는 쉽게 바꾸지 않습니다. 미리 타입을 명시하는 방법은, 함수를 구현하기 전에 테스트를 먼저 작성하는 테스트 주도 개발(test driven development, TDD)과 비슷합니다. 전체 타입 시그니처를 먼저 작성하면 구현에 맞추어 주먹구구식으로 시그니처가 작성되는 것을 방지하고 제대로 원하는 모양을 얻게 됩니다.   
반환값의 타입을 명시해야 하는 두 번째 이유는 명명된 타입을 사용하기 위해서입니다. 반환 타입을 명시하면 더욱 직관적인 표현이 됩니다. 그리고 반환 값을 별도의 타입으로 정의하면 타입에 대한 주석을 작성할 수 있어서, 더욱 자세한 설명이 가능합니다. 추론된 반환 타입이 복잡해질수록 명명된 타입의 제공하는 이점은 커집니다.

## 🥕 아이템 20. 다른 타입에는 다른 변수 사용하기
자바스크립트에서는 한 변수를 다른 목적을 가지는 다른 타입으로 재사용해도 됩니다.   
반면 타입스크립트에서는 두 가지 오류가 발생합니다.

```ts
let id = "12-34-56";
fetchProduct(id);

id = 123456;
// ~~ '123456' 형식은 'string' 형식에 할당할 수 없습니다.
fetchProductBySerialNumber(id);
```

타입스크립트에서는 "12-34-56"이라는 값을 보고, `id`의 타입을 `string`으로 추론했습니다. `string` 타입에는 `number` 타입을 할당할 수 없기 때문에 오류가 발생합니다.   
여기서 "변수의 값은 바뀔 수 있지만 그 타입은 보통 바뀌지 않는다"는 중요한 관점을 알 수 있습니다. 타입을 바꿀 수 있는 한 가지 방법은 범위를 좁히는 것인데, 새로운 변수값을 포함하도록 확장하는 것이 아니라 타입을 더 작게 제한하는 것입니다.   

`id`의 타입을 바꾸지 않으려면, `string`과 `number`를 모두 포함할 수 있도록 타입을 확장하면 됩니다. `string|number`로 표현하며, 유니온 타입이라고 합니다.

```ts
let id: string | number = "12-34-56";
fetchProduct(id);
id = 123456;
fetchProductBySerialNumber(id);
```

유니온 타입으로 코드가 동작하기는 하겠지만 더 많은 문제가 생길 수 있습니다. `id`를 사용할 때마다 값이 어떤 타입인지 확인해야 하기 때문에 유니온 타입은 `string`이나 `number` 같은 간단한 타입에 비해 다루기 더 어렵습니다. 차라리 별도의 변수를 도입하는 것이 낫습니다.

```ts
const id = "12-34-56";
fetchProduct(id);

const serial = 123456;
fetchProductBySerialNumber(serial);
```

앞의 예제에서 첫 번째 `id`와 재사용한 두 번째 `id`는 서로 관련이 없었습니다. 그냥 변수를 재사용했을 뿐입니다. 변수를 무분별하게 재샤용하면 타입 체커와 사람 모두에게 혼란을 줄 뿐입니다.   
다른 타입에는 별도의 변수를 사용하는 게 바람직한 이유는 다음과 같습니다.
- 서로 관련이 없는 두 개의 값을 분리합니다.
- 변수명을 더 구체적으로 지을 수 있습니다.
- 타입 추론을 향상시키며, 타입 구문이 불필요해집니다.
- 타입이 좀 더 간결해집니다.
- `let` 대신 `const`로 변수를 선언하게 됩니다. `const`로 변수를 선언하면 코드가 간결해지고, 타입 체커가 타입을 추론하기에도 좋습니다.

타입이 바뀌는 변수는 되도록 피해야 하며, 목적이 다른 곳에는 별도의 변수명을 사용해야 합니다.

## 🥕 아이템 21. 타입 넓히기
상수를 사용해서 변수를 초기화할 때 타입을 명시하지 않으면 타입 체커는 타입을 결정해야 합니다. 이 말은 지정된 단일 값을 가지고 할당 가능한 값들의 집합을 유추해야 한다는 뜻입니다. 타입스크립트에서는 이러한 과정을 "넓히기"라고 부릅니다.   

벡터를 다루는 라이브러리를 작성한다고 가정해 보겠습니다. 3D 벡터에 대한 타입과 그 요소들의 값을 얻는 함수를 작성합니다.

```ts
interface Vector3 { x: number; y: number; z: number; }
function getComponent(vector: Vector3, axis: 'x' | 'y' | 'z') {
  return vector[axis];
}
```

`Vector3` 함수를 사용한 다음 코드는 런타임에 오류 없이 실행되지만, 편집기에서는 오류가 표시됩니다.

```ts
let x = 'x';
let vec = { x: 10, y: 20, z: 30 };
getComponent(vec, x); // ~~ 'string' 형식의 인수는 "x" | "y" | "z" 형식의 매개변수에 할당할 수 없습니다.
```

`getComponent` 함수는 두 번째 매개변수에 `"x" | "y" | "z"` 타입을 기대했지만, `x`의 타입은 할당 시점에 넗히기가 동작해서 `string`으로 추론되었습니다. `string` 타입은 `"x" | "y" | "z"` 타입에 할당이 불가능하므로 오류가 된 것입니다.   
타입 넓히기가 진행될 때, 주어진 값으로 추론 가능한 타입이 여러 개이기 때문에 과정이 상당히 모호합니다.   
타입스크립트는 작성자의 의도를 추측합니다. 그러나 타입스크립트가 아무리 영리하더라도 사람의 마음까지 읽을 수는 없고 따라서 추측한 답이 항상 옳을 수도 없습니다.

타입스크립트는 `x`의 타입을 `string`으로 추론할 때, 명확성과 유연성 사이의 균형을 유지하려고 합니다. 일반적인 규칙은 변수가 선언된 후로는 타입이 바뀌지 않아야 하므로, `string|RegExp`나 `string|string[]`이나 `any`보다 `string`을 사용하는 게 낫습니다.   

타입스크립트는 넓히기의 과정을 제어할 수 잇도록 몇 가지 방법을 제공합니다. 넓히기 과정을 제어할 수 있는 첫 번째 방법은 `const`입니다. 만약 `let` 대신 `const`로 변수를 선언하면 더 좁은 타입이 됩니다. 실제로 `const`를 사용하면 앞에서 발생한 오류가 해결됩니다.

```ts
const x = 'x'; // 타입이 "x"
let vec = { x: 10, y: 20, z: 30 };
getComponent(vec, x); // 정상
```

이제 `x`는 재할당될 수 없으므로 타입스크립트는 의심의 여지 없이 더 좁은 타입으로 추론할 수 있습니다. 그리고 문자 리터럴 타입 `x`는 `x|y|z`에 할당 가능하므로 코드가 타입 체커를 통과합니다.   
그러나 `const`는 만능이 아닙니다. 객체와 배열의 경우에는 여전히 문제가 있습니다. 튜플 타입을 추론해야 할지, 요소들을 어떤 타입으로 추론해야 할지 알 수 없습니다. 비슷한 문제가 객체에서도 발생합니다.   

앞에서 언급했듯이 타입스크립트는 명확성과 유연성 사이의 균형을 유지하려고 합니다. 오류를 잡기 위해서는 충분히 구체적으로 타입을 추론해야 하지만, 잘못된 추론을 할 정도로 구체적으로 수행하지는 않습니다. 예를 들어, 1과 같은 값으로 초기화되는 속성을 적당히 `number`의 타입으로 추론합니다.   
타입의 추론의 강도를 직접 제어하려면 타입스크립트의 기본 동작을 재정의해야 합니다. 타입스크립트의 기본 동작을 재정의하는 세 가지 방법이 있습니다.   

첫 번째, 명시적 타입 구문을 제공하는 것입니다.

```ts
const v: { x: 1|3|5 } = {
  x: 1,
}; // 타입이 { x: 1|3|5; }
```

두 번째, 타입 체커에 추가적인 문맥을 제공하는 것입니다.(예를 들어, 함수의 매개변수로 값을 전달) 아이템 26은 타입 추론 과정에서 문맥의 역할에 대한 자세한 내용을 다룹니다.   
세 번째, `const` 단언문을 사용하는 것입니다. `const` 단언문과 변수 선언에 쓰이는 `let`이나 `const`와 혼동해서는 안 됩니다. `const` 단언문은 온전히 타입 공간의 기법입니다. 다음 예제를 통해 각 변수에 추론된 타입의 차이점을 살펴보겠습니다.

```ts
const v1 = {
  x: 1,
  y: 2,
}; // 타입은 { x: number; y: number; }
const v2 = {
  x: 1 as const,
  y: 2,
}; // 타입은 { x: 1; y: number; }
const v3 = {
  x: 1,
  y: 2,
} as const; // 타입은 { readonly x: 1; readonly y: 2; }
```

값 뒤에 `as const`를 작성하면, 타입스크립트는 최대한 좁은 타입으로 추론합니다. `v3`에는 넓히기가 동작하지 않습니다. `v3`이 진짜 상수라면, 주석에 보이는 추론된 타입이 실제로 원하는 형태일 것입니다. 또한 배열을 튜플 타입으로 추론할 때도 `as const`를 사용할 수 있습니다.

```ts
const a1 = [1, 2, 3]; // 타입이 number[]
const a2 = [1, 2, 3] as const; // 타입이 readonly [1, 2, 3]
```

넓히기로 인해 오류가 발생한다고 생각되면, 명시적 타입 구문 또는 `const` 단언문을 추가하는 것을 고려해야 합니다. 단언문으로 인해 추론이 어떻게 변화하는지 편집기에서 주기적으로 타입을 살펴보기 바랍니다.(아이템 6)

## 🥕 아이템 22. 타입 좁히기
타입 좁히기는 타입스크립트가 넓은 타입으로부터 좁은 타입으로 진행하는 과정을 말합니다. 아마도 가장 일반적인 예시는 `null` 체크일 겁니다.

```ts
const el = document.getElementById('foo'); // 타입이 HTMLElement | null
if (el) {
  el // 타입이 HTMLElement
  el.innerHTML = 'Party Time'.blink();
} else {
  el // 타입이 null
  alert('No element #foo');
}
```

타입 체커는 일반적으로 이러한 조건문에서 타입 좁히기를 잘 해내지만, 타입 별칭이 존재한다면 그러지 못할 수도 있습니다. 타입 별칭에 대한 내용은 아이템 24에서 다루겠습니다.   

분기문에서 예외를 던지거나 함수를 반환하여 블록의 나머지 부분에서 변수의 타입을 좁힐 수도 있습니다.

```ts
const el = document.getElementById('foo'); // 타입이 HTMLElement | null
if (!el) throw new Error('Unable to find #foo');
el; // 이제 타입은 HTMLElement
el.innerHTML = 'Party Time'.blink();
```

이 외에도 타입을 좁히는 방법은 많이 있습니다. 다음은 `instanceof`를 사용해서 타입을 좁히는 예제입니다.

```ts
function contains(text: string, search: string | RegExp) {
  if (search instanceof RegExp) {
    search // 타입이 RegExp
    return !!search.exec(text);
  }

  search // 타입이 string
  return text.includes(search);
}
```

속성 체크로도 타입을 좁힐 수 있습니다.

```ts
interface A { a: number }
interface B { b: number }
function pickAB(ab: A | B) {
  if ('a' in ab) {
    ab // 타입이 A
  } else {
    ab // 타입이 B
  }
  ab // 타입이 A | B
}
```

`Array.isArray` 같은 일부 내장 함수로도 타입을 좁힐 수 있습니다.

```ts
function contains(text: string, terms: string|string[]) {
  const termList = Array.isArray(terms) ? terms : [terms];
  termList // 타입이 string[]
  // ...
}
```

타입을 섣불리 판단하는 실수를 저지르기 쉬우므로 다시 한번 꼼꼼히 따져 봐야 합니다.

```ts
function foo(x?: number|string|null) {
  if (!x) {
    x; // 타입이 string | number | null | undefined
  }
}
```

빈 문자열 `''`와 `0` 모두 `false`가 되기 때문에, 타입은 전혀 좁혀지지 않았고 `x`는 여전히 블록 내에서 `string` 또는 `number`가 됩니다.   

타입을 좁히는 또 다른 일반적인 방법은 명시적 '태그'를 붙이는 것입니다.

```ts
interface UploadEvent { type: 'upload'; filename: string; contents: string }
interface DownloadEvent { type: 'download'; filename: string; }
type AppEvent = UploadEvent | DownloadEvent;
function handleEvent(e: AppEvent) {
  switch (e.type) {
    case 'download':
      e // 타입이 DownloadEvent
      break;
    case 'upload':
      e; // 타입이 UploadEvent
      break;
  }
}
```

이 패턴은 '태그된 유니온' 또는 '구별된 유니온'이라고 불리며, 타입스크립트 어디에서나 찾아볼 수 있습니다.   
만약 타입스크립트가 타입을 식별하지 못한다면, 식별을 돕기 위해 커스텀 함수를 도입할 수 있습니다.   

```ts
function isInputElement(el: HTMLElement): el is HTMLInputElement {
  return 'value' in el;
}

function getElementContent(el: HTMLElement) {
  if (isInputElement(el)) {
    el; // 타입이 HTMLInputElement
    return el.value;
  }
  el; // 타입이 HTMLElement
  return el.textContent;
}
```

이러한 기법을 '사용자 정의 타입 가드'라고 합니다. 반환 타입의 `el is HTMLInputElement`는 함수의 반환이 `true`인 경우, 타입 체커에게 매개변수의 타입을 좁힐 수 있다고 알려 줍니다.   
어떤 함수들은 타입 가드를 사용하여 배열과 객체의 타입 좁히기를 할 수 있습니다. 예를 들어, 배열에서 어떤 탐색을 수행할 때 `undefined`가 될 수 있는 타입을 사용할 수 있습니다.

```ts
const jackson5 = ['Jackie', 'Tito', 'Jermaine', 'Marlon', 'Michael'];
const members = ['Janet', 'Michael'].map(
  who => jackson5.find(n => n === who)
); // 타입이 (string | undefined)[]
```

`filter` 함수를 사용해 `undefined`를 걸러 내려고 해도 잘 동작하지 않을 겁니다.

```ts
const members = ['Janet', 'Michael'].map(
  who => jackson5.find(n => n === who)
).filter(who => who !== undefined); // 타입이 (string | undefined)[]
```

이럴 때 타입 가드를 사용하면 타입을 좁힐 수 있습니다.

```ts
function isDefined<T>(x: T | undefined): x is T {
  return x !== undefined;
}
const members = ['Janet', 'Michael'].map(
  who => jackson5.find(n => n === who)
).filter(isDefined); // 타입이 string[]
```

## 🥕 아이템 23. 한꺼번에 객체 생성하기
객체를 생성할 때는 속성을 하나씩 추가하기보다는 여러 속성을 포함해서 한꺼번에 생성해야 타입 추론에 유리합니다.

```ts
interface Point { x: number; y: number; }

const pt: Point = {
  x: 3,
  y: 4,
}
```

작은 객체들을 조합해서 큰 객체를 맏늘어야 하는 경우에도 여러 단계를 거치는 것은 좋지 않은 생각입니다.   
다음과 같이 객체 전개 연산자 `...`를 사용하면 큰 객체를 한꺼번에 만들어 낼 수 있습니다.

```ts
const pt = { x: 3, y: 4 };
const id = { name: 'Pythagoras' };
const namedPoint = { ...pt, ...id };
namedPoint.name; // 정상.
```

객체 전개 연산자를 사용하면 타입 걱정 없이 필드 단위로 객체를 생성할 수도 있습니다. 이때 모든 업데이트마다 새 변수를 사용하여 각각 새로운 타입을 얻도록 하는 게 중요합니다.

```ts
const pt0 = {};
const pt1 = { ...pt0, x: 3 };
const pt: Point = { ...pt1, y: 4 }; // 정상
```

타입에 안전한 방식으로 조건부 속성을 추가하려면, 속성을 추가하지 않는 `null` 또는 `{}`으로 객체 전개를 사용하면 됩니다.

```ts
declare let hasMiddle: boolean;
const firstLast = { first: 'Harry', last: 'Truman' };
const president = { ...firstLast, ...(hasMiddle ? { middle: 'S' } : {})};
```

편집기에서 `president` 심벌에 마우스를 올려 보면, 타입이 선택적 속성을 가진 것으로 추론된다는 것을 확인할 수 있습니다.

```ts
const president: {
  middle?: string;
  first: string;
  last: string;
}
```

전개 연산자로 한꺼번에 여러 속성을 추가할 수도 있습니다.

```ts
declare let hasDates: boolean;
const nameTitle = { name: 'Khufu', title: 'Pharaoh' };
const pharaoh = {
  ...nameTitle,
  ...(hasDates ? { start: -2589, end: -2566 } : {})
};
```

편집기에서 `pharaoh` 심벌에 마우스를 올려 보면, 이제는 타입이 유니온으로 추론됩니다.

```ts
const pharaoh: {
  start: number;
  end: number;
  name: string;
  title: string;
} | {
  name: string;
  title: string;
}
```

`start`와 `end`가 선택적 필드이기를 원했다면 이런 결과가 당황스러울 수 있습니다. 이 타입에서는 `start`를 읽을 수 없습니다.   
이 경우에는 `start`와 `end`가 항상 함께 정의됩니다. 이 점을 고려하면 유니온을 사용하는 게 가능한 값의 집합을 더 정확히 표현할 수 있습니다.(아이템 32) 그런데 유니온보다는 선택적 필드가 다루기에는 더 쉬울 수 있습니다. 선택적 필드 방식으로 표현하려면 다음처럼 헬퍼 함수를 사용하면 됩니다.

```ts
function addOptional<T extends object, U extends object>(
  a: T, b: U | null
): T & Partial<U> {
  return { ...a, ...b };
}

const pharaoh = addOptional(
  nameTitle,
  hasDates ? { start: -2589, end: -2566 } : null
);
pharaoh.start // 정상, 타입이 number | undefined
```

가끔 객체나 배열을 변환해서 새로운 객체나 배열을 생성하고 싶을 수 있습니다. 이런 경우 루프 대신 내장된 함수형 기법 또는 로대시 같은 유틸리티 라이브러리를 사용하는 것이 '한꺼번에 객체 생성하기' 관점에서 보면 옳습니다.

## 🥕 아이템 24. 일관성 있는 별칭 사용하기
별칭을 남발해서 사용하면 제어 흐름을 분석하기 어렵습니다. 모든 언어의 컴파일러 개발자들은 무분별한 별칭 사용으로 골치를 썩고 있습니다. 타입스크립트에서도 마찬가지로 별칭을 신중하게 사용해야 합니다. 그래야 코드를  잘 이해할 수 있고, 오류도 쉽게 찾을 수 있습니다.   

다각형을 표현하는 자료구조를 가정해 보겠습니다.

```ts
interface Coordinate {
  x: number;
  y: number;
}

interface BoundingBox {
  x: [number, number];
  y: [number, number];
}

interface Polygon {
  exterior: Coordinate[];
  holes: Coordinate[][];
  bbox?: BoundingBox;
}
```

`bbox` 속성을 사용하면 어떤 점이 다각형에 포함되는지 빠르게 체크할 수 있습니다.

```ts
function isPointInPolygon(polygon: Polygon, pt: Coordinate) {
  if (polygon.bbox) {
    if (pt.x < polygon.bbox.x[0] || pt.x > polygon.bbox.x[1] || pt.y < polygon.bbox.y[0] || pt.y > polygon.bbox.y[1]) {
      return false;
    }
  }

  // ...
}
```

이 코드는 잘 작동하지만 반복되는 부분이 존재합니다. 특히 `polygon.bbox`는 3줄에 걸쳐 5번이나 등장합니다. 다음 코드는 중복을 줄이기 위해 임시 변수를 뽑아낸 모습입니다.

```ts
function isPointInPolygon(polygon: Polygon, pt: Coordinate) {
  const box = polygon.bbox;
  if (polygon.bbox) {
    if (pt.x < box.x[0] || pt.x > box.x[1] || pt.y < box.y[0] || pt.y > box.y[1]) {
      // error: 객체가 'undefined'일 수 있습니다.
      return false;
    }
  }

  // ...
}
```

(`strictNullChecks`를 활성화했다고 가정했습니다.) 이 코드는 동작하지만 편집기에서 오류로 표시됩니다. 그 이유는 `polygon.bbox`를 별도의 `box`라는 별칭을 만들었고, 첫 번째 예시에서는 잘 동작했던 제어 흐름 분석을 방해했기 때문입니다.   
속성 체크는 `polygon.bbox`의 타입을 정제했지만 `box`는 그렇지 않았기 때문에 오류가 발생했습니다. 이러한 오류는 "별칭은 일관성 있게 사용한다"는 기본 원칙을 지키면 방지할 수 있습니다.   

속성 체크에 `box`를 사용하도록 코드를 바꿔 보겠습니다.

```ts
function isPointInPolygon(polygon: Polygon, pt: Coordinate) {
  const box = polygon.bbox;
  if (box) {
    if (pt.x < box.x[0] || pt.x > box.x[1] || pt.y < box.y[0] || pt.y > box.y[1]) {
      return false;
    }
  }

  // ...
}
```

타입 체커의 문제는 해결되었지만 코드를 읽는 사람에게는 문제가 남아 있습니다. `box`와 `bbox`는 같은 값인데 다른 이름을 사용한 것입니다. 객체 비구조화를 이용하면 보다 간결한 문법으로 일관된 이름을 사용할 수 있습니다. 배열과 중첩된 구조에서도 역시 사용할 수 있습니다.

```ts
function isPointInPolygon(polygon: Polygon, pt: Coordinate) {
  const { bbox } = polygon;
  if (bbox) {
    const { x, y } = bbox;
    if (pt.x < x[0] || pt.x > x[1] || pt.y < y[0] || pt.y > y[1]) {
      return false;
    }
  }

  // ...
}
```

그러나 객체 비구조화를 이용할 때는 두 가지를 주의해야 합니다.
- 전체 `bbox` 속성이 아니라 `x`와 `y`가 선택적 속성인 경우에 속성 체크가 더 필요합니다. 따라서 타입의 경계에 `null` 값을 추가하는 것이 좋습니다.
- `bbox`에는 선택적 속성이 적합했지만 `holes`는 그렇지 않습니다. `holes`가 선택적이라면, 값이 없거나 빈 배열이었을 겁니다. 차이가 없는데 이름을 구별한 것입니다. 빈 배열은 '`holes` 없음'을 나타내는 좋은 방법입니다.

별칭은 타입 체커뿐만 아니라 런타임에도 혼동을 야기할 수 있습니다.

```ts
const { bbox } = polygon;
if (!bbox) {
  calculatePolygonBbox(polygon); // polygon.bbox가 채워집니다.
  // 이제 polygon.bbox와 bbox는 다른 값을 참조합니다!
}
```

타입스크립트의 제어 흐름 분석은 지역 변수에는 꽤 잘 동작합니다. 그러나 객체 속성에는 주의해야 합니다.

```ts
function fn(p: Polygon) { /* ... */ }

polygon.bbox // 타입이 BoundingBox | undefined
if (polygon.bbox) {
  polygon.bbox // 타입이 BoundingBox
  fn(polygon);
  polygon.bbox // 타입이 BoundingBox
}
```

`fn(polygon)` 호출은 `polygon.bbox`를 제거할 가능성이 있으므로 타입을 `BoundingBox | undefined`로 되돌리는 것이 안전할 것입니다. 그러나 함수를 호출할 때마다 속성 체크를 반복해야 하기 때문에 좋지 않습니다. 그래서 타입스크립트는 함수가 타입 정제를 무효화하지 않는다고 가정합니다. 그러나 실제로는 무효화될 가능성이 있습니다. `polygon.bbox`로 사용하는 대신 `bbox` 지역 변수로 뽑아내서 사용하면 `bbox`의 타입은 정확히 유지되지만, `polygon.bbox`의 값과 같게 유지되지 않을 수 있습니다.

## 🥕 아이템 25. 비동기 코드에는 콜백 대신 `async` 함수 사용하기
콜백이 중첩된 코드는 직관적으로 이해하기 어렵습니다. 요청들을 병렬로 실행하거나 오류 상황을 빠져나오고 싶다면 더욱 혼란스러워집니다.   
ES2017에서는 `async`와 `await` 키워드를 도입하여 콜백 지옥을 더욱 간단하게 처리할 수 있게 되었습니다.

```ts
async function fetchPages() {
  const response1 = await fetch(url1);
  const response2 = await fetch(url2);
  const response3 = await fetch(url3);
  // ...
}
```

`await` 키워드는 각각의 프로미스가 처리될 때까지 `fetchPages` 함수의 실행을 멈춥니다. `async` 함수 내에서 `await` 중인 프로미스가 거절되면 예외를 던집니다. 이를 통해 일반적인 `try/catch` 구문을 사용할 수 있습니다.

```ts
async function fetchPages() {
  try {
    const response1 = await fetch(url1);
    const response2 = await fetch(url2);
    const response3 = await fetch(url3);
    // ...
  } catch (e) {
    // ...
  }
}
```

콜백보다는 프로미스나 `async/await`를 사용해야 하는 이유는 다음과 같습니다.

- 콜백보다는 프로미스가 코드를 작성하기 쉽습니다.
- 콜백보다는 프로미스가 타입을 추론하기 쉽습니다.

타입스크립트는 세 가지 `response` 변수 각각의 타입을 `Response`로 추론합니다. 그러나 콜백 스타일로 동일한 코드를 작성하려면 더 많은 코드와 타입 구문이 필요합니다.   
한편 입력된 프로미스들 중 첫 번째가 처리될 때 완료되는 `Promise.race` 도 타입 추론과 잘 맛ㅈ습니다. `Promise.race`를 사용하여 프로미스에 타임아웃을 추가하는 방법은 흔하게 사용되는 패턴입니다.

```ts
function timeout(millis: number): Promise<never> {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject('timeout'), millis);
  });
}

async function fetchWithTimeout(url: string, ms: number) {
  return Promise.race([fetch(url), timeout(ms)]);
}
```

타입 구문이 없어도 `fetchWithTimeout`의 반환 타입은 `Promise<Response>`로 추론됩니다. `Promise.race`의 반환 타입은 입력 타입들의 유니온이고, 이번 경우는 `Promise<Response | never>`가 됩니다. 그러나 `never`와의 유니온은 아무런 효과가 없으므로, 결과가 `Promise<Response>`로 간단해집니다. 프로미스를 사용하면 타입스크립트의 모든 타입 추론이 제대로 동작합니다.   

가끔 프로미스를 직접 생성해야 할 때, 특히 `setTimeout`과 같은 콜백 API를 래핑할 경우가 있습니다. 그러나 선택의 여지가 있다면 일반적으로는 프로미스를 생성하기보다 `async/await`를 사용해야 합니다. 그 이유는 다음 두 가지입니다.

- 일반적으로 더 간결하고 직관적인 코드가 됩니다.
- `async`함수는 항상 프로미스를 반환하도록 강제합니다.

```ts
// function getNumber(): Promise<number>
async function getNumber() {
  return 42;
}
```

`async` 화살표 함수를 만들 수도 있습니다.

```ts
const getNumber = async () => 42; // 타입이 () => Promise<number>
```

프로미스를 직접 생성하면 다음과 같습니다.

```ts
const getNumber = () => Promise.resolve(42); // 타입이 () => Promise<number>
```

함수는 항상 동기 또는 비동기로 실행되어야 하며 절대 혼용해서는 안 됩니다. 콜백이나 프로미스를 사용하면 반(half)동기 코드를 작성할 수 있지만, `async`를 사용하면 항상 비동기 코드를 작성하는 셈입니다.   
`async` 함수에서 프로미스를 반환하면 또 다른 프로미스로 래핑되지 않습니다. 반환 타입은 `Promise<Promise<T>>`가 아닌 `Promise<T>`가 됩니다. 타입스크립트를 사용하면 타입 정보가 명확히 드러나기 때문에 비동기 코드의 개념을 잡는 데 도움이 됩니다.

```ts
// function getJSON(url: string): Promise<any>
async function getJSON(url: string) {
  const response = await fetch(url);
  const jsonPromise = response.json(); // 타입이 Promise<any>
  return jsonPromise;
}
```

## 🥕 아이템 26. 타입 추론에 문맥이 어떻게 사용되는지 이해하기
문맥을 고려해 타입을 추론하면 가끔 이상한 결과가 나옵니다.   

자바스크립트는 코드의 동작과 실행 순서를 바꾸지 않으면서 표현식을 상수로 분리해 낼 수 있습니다. 예를 들어, 다음 두 문장은 동일합니다.

```ts
// 인라인 형태
setLanguage('JavaScript');

// 참조 형태
let language = 'JavaScript';
setLanguage(language);
```

타입스크립트에서는 다음 리팩터링이 여전히 동작합니다.

```ts
function setLanguage(language: string) { /* ... */ }

setLanguage('JavaScript');

let language = 'JavaScript';
setLanguage(language);
```

이제 문자열 타입을 더 특정해서 문자열 리터럴 타입의 유니온으로 바꾼다고 가정해 보겠습니다.

```ts
type Language = 'JavaScript' | 'TypeScript' | 'Python';
function setLanguage(language: Language) { /* ... */ }

setLanguage('JavaScript'); // 정상

let language = 'JavaScript';
setLanguage(language); // string 형식의 인수는 Language 형식의 매개변수에 할당될 수 없습니다.
```

인라인 형태에서 타입스크립트는 함수 선언을 통해 매개변수가 `Language` 타입이어야 한다는 것을 알고 있습니다. 해당 타입에 문자열 리터럴 `JavaScript`는 할당 가능하므로 정상입니다. 그러나 이 값을 변수로 분리해내면, 타입스크립트는 할당 시점에 타입을 추론합니다. 이번 경우는 `string`으로 추론했고, `Language` 타입으로 할당이 불가능하므로 오류가 발생했습니다.   

이런 문제를 해결하는 두 가지 방법이 있습니다. 첫 번째 해법은 타입 선언에서 `language`의 가능한 값을 제한하는 것입니다.

```ts
let language: Language = 'JavaScript';
setLanguage(language); // 정상
```

두 번째 해법은 `language`를 상수로 만드는 것입니다.

```ts
const language = 'JavaScript';
setLanguage(language); // 정상
```

`const`를 사용하여 타입 체커에게 `language`는 변경할 수 없다고 알려 줍니다. 따라서 타입스크립트는 `language`에 대해서 더 정확한 타입인 문자열 리터럴 `JavaScript`로 추론할 수 있습니다.   

그런데 이 과정에서 사용되는 문맥으로부터 값을 분리했습니다. 문맥과 값을 분리하면 추후에 근본적인 문제를 발생시킬 수 있습니다.

### 튜플 사용 시 주의점
이동이 가능한 지도를 보여 주는 프로그램을 작성한다고 생각해 보겠습니다.

```ts
// 매개변수는 (latitude, longitude) 쌍입니다.
function panTo(where: [number, number]) { /* ... */ }

panTo([10, 20]); // 정상

const loc = [10, 20];
panTo(loc); // number[] 형식의 인수는 [number, number] 형식의 매개변수에 할당될 수 없습니다.
```

`any`를 사용하지 않고 오류를 고칠 수 있는 방법을 생각해 보겠습니다. `any` 대신 `const`로 선언하면 된다는 답이 떠오를 수도 있겠지만 `loc`은 이미 `const`로 선언한 상태입니다. 그보다는 타입스크립트가 의도를 정확히 파악할 수 있도록 타입 선언을 제공하는 방법을 시도해 보겠습니다.

```ts
const loc: [number, number] = [10, 20];
panTo(loc); // 정상
```

`any`를 사용하지 않고 오류를 고칠 수 있는 또 다른 방법은 상수 문맥을 제공하는 것입니다. `const`는 단지 값이 가리키는 참조가 변하지 않는 얕은 상수인 반면, `as const`는 그 값이 내부까지 상수라는 사실을 타입스크립트에게 알려 줍니다.

```ts
const loc = [10, 20] as const;
panTo(loc); // readonly [10, 20] 형식은 readonly이며 변경 가능한 형식 [number, number]에 할당할 수 없습니다.
```

편집기에서 `loc`에 마우스를 올려보면, 타입은 이제 `number[]`가 아니라 `readonly[10, 20]`으로 추론됨을 알 수 있습니다. 그런데 안타깞게도 이 추론은 `panTo`의 타입 시그니처는 `where`의 내용이 불변이라고 보장하지 않습니다. 즉, `loc` 매개변수가 `readonly` 타입이므로 동작하지 않습니다.   
따라서 `any`를 사용하지 않고 오류를 고칠 수 있는 최선의 해결책은 `panTo` 함수에 `readonly` 구문을 추가하는 것입니다.

```ts
function panTo(where: readonly [number, number]) { /* ... */ }
const loc = [10, 20] as const;
panTo(loc); // 정상
```

타입 시그니처를 수정할 수 없는 경우라면 타입 구문을 사용해야 합니다.   
`as const`는 문맥 손실과 관련한 문제를 깔끔하게 해결할 수 있지만, 한 가지 단점을 가지고 있습니다. 만약 타입 정의에 실수가 있다면(예를 들어, 튜플에 세 번째 요소를 추가한다면) 오류는 타입 정의가 아니라 호출되는 곳에서 발생한다는 것입니다. 특히 여러 겹 중첩된 객체에서 오류가 발생한다면 근본적인 원인을 파악하기 어렵습니다.

```ts
const loc = [10, 20, 30] as const; // 실제 오류는 여기서 발생합니다.
panTo(loc); // 에러 로그가 여기서 나타납니다.
```

### 객체 사용 시 주의점
문맥에서 값을 분리하는 문제는 무자열 리터럴이나 튜플을 포함하는 큰 객체에서 상수를 뽑아낼 때도 발생합니다.

```ts
type Language = 'JavaScript' | 'TypeScript' | 'Python';
interface GovernedLanguage {
  language: Language;
  organization: string;
}

function complain(language: GovernedLanguage) { /* ... */ }

complain({ language: 'TypeScript', organization: 'Microsoft' }); // 정상

const ts = {
  language: 'TypeScript',
  organization: 'Microsoft',
};

complain(ts); // 에러 발생
```

이 문제는 타입 선언을 추가하거나 상수 단언을 사용해 해결합니다.

### 콜백 사용 시 주의점
콜백을 다른 함수로 전달할 때, 타입스크립트는 콜백의 매개변수 타입을 추론하기 위해 문맥을 사용합니다.

```ts
function callWithRandomNumbers(fn: (n1: number, n2: number) => void) {
  fn(Math.random(), Math.random());
}

callWithRandomNumbers((a, b) => {
  a; // 타입이 number
  b; // 타입이 number
  console.log(a + b);
});
```

`callWithRandomNumbers`의 타입 선언으로 인해 `a`와 `b`의 타입이 `number`로 추론됩니다. 콜백을 상수로 뽑아내면 문맥이 소실되고 `noImplicitAny` 오류가 발생하게 됩니다.

```ts
const fn = (a, b) => {
  // a, b 매개변수에는 암시적으로 any 형식이 표함됩니다.
  console.log(a + b);
}

callWithRandomNumbers(fn);
```

이런 경우는 매개변수에 타입 구문을 추가해서 해결할 수 있습니다.

```ts
const fn = (a: number, b: number) => {
  console.log(a + b);
}
callWithRandomNumbers(fn);
```

또는 가능할 경우 전체 함수 표현식에 타입 선언을 적용하는 것입니다.

## 🥕 아이템 27. 함수형 기법과 라이브러리로 타입 흐름 유지하기
로데시나 람다 같은 라이브러리들의 일부 가능(`map`, `flatMap`, `filter`, `reduce` 등)은 순수 자바스크립트로 구현되어 있습니다. 이러한 기법은 루프를 대체할 수 있기 때문에 자바스크립트에서 유용하게 사용되는데, 타입스크립트와 조합하여 사용하면 더욱 빛을 발합니다. 그 이유는 타입 정보가 그대로 유지되면서 타입 흐름이 계속 전달되도록 하기 때문입니다. 반면에 직접 루프를 구현하면 타입 체크에 대한 관리도 직접 해야 합니다.   
예를 들어, 어떤 CSV 데이터를 파싱한다고 생각해 보겠습니다. 순수 자바스크립트에서는 절차형 프로그래밍 형태로 구현할 수 있습니다.

```ts
const csvData = "...";
const rawRows = csvData.split('/n');
const headers = rawRows[0].split(',');

const rows = rawRows.slice(1).map(rowStr => {
  const row = {};
  rowStr.split(',').forEach((val, j) => {
    row[headers[j]] = val;
  });
  return row;
});
```

함수형 마인드를 조금이라도 가진 자바스크립트 개발자라면 `reduce`를 사용해 행 객체를 만드는 방법을 선호할 수도 있습니다.

```ts
const rows = rawRows.slice(1)
  .map(rowStr => rowStr.split(',')
    .reduce((row, val, i) => (row[headers[i]] = val, row), {}));
```

이 코드는 절차형 코드에 비해 세 줄(약 20개의 글자)을 절약했지만 보는 사람에 따라 더 복잡하게 느껴질 수도 있습니다. 키와 값 배열로 취합해서 객체로 만들어 주는, 로대시의 `zipObject` 함수를 이용하면 코드를 더욱 짧게 만들 수 있습니다.

```ts
import _ from 'lodash';
const rows = rawRows.slice(1)
  .map(rowStr => _.zipObject(headers, rowStr.split(',')));
```

코드가 매우 짧아졌습니다. 그런데 자바스크립트에서는 프로젝트에 서드파티 라이브러리 종속성을 추가할 때 신중해야 합니다. 만약 서드파티 라이브러리 기반으로 코드를 짧게 줄이는 데 시간이 많이 든다면, 서드파티 라이브러리를 사용하지 않는 게 낫기 때문입니다.   

그러나 같은 코드를 타입스크립트로 작성하면 서드파티 라이브러리를 사용하는 것이 무조건 유리합니다. 타입 정보를 참고하며 작업할 수 있기 때문에 서드파티 라이브러리 기반으로 바꾸는 데 시간이 훨씬 단축됩니다.   

데이터의 가공이 정교해질수록 이러한 장점은 더욱 명확해집니다. 예를 들어, 모든 NBA 팀의 선수 명단을 가지고 있다고 가정해 보겠습니다.

```ts
interface BasketballPlayer {
  name: string;
  team: string;
  salary: number;
}

declare const rosters: { [team: string]: BasketballPlayer[] };
```

르프를 사용해 단순 목록을 만들려면 배열에 `concat`을 사용해야 합니다. 다음 코드는 동작이 되지만 타입 체크는 되지 않습니다.

```ts
let allPlayers = [];

for (const players of Object.values(rosters)) {
  allPlayers = allPlayers.concat(players);
  // 'allPlayers' 변수에는 암시적으로 'any[]' 형식이 포함됩니다.
}
```

이 오류를 고치려면 `allPlayers`에 타입 구문을 추가해야 합니다.

```ts
let allPlayers: BasketballPlayer[] = [];
for (const players of Object.values(rosters)) {
  allPlayers = allPlayers.concat(players); // 정상
}
```

그러나 더 나은 해법은 `Array.prototype.flat`을 사용하는 것입니다.

```ts
const allPlayers = Object.values(rosters).flat();
```

`flat` 메서드는 다차원 배열을 평탄화해줍니다. 타입 시그니처는 `T[][] => T[]` 같은 형태입니다. 이 버전이 가장 간결하고 타입 구문도 필요 없습니다. 또한 `allPlayers` 변수가 향후에 변경되지 않도록 `let` 대신 `const`를 사용할 수 있습니다.   

`allPlayers`를 가지고 각 팀별로 연봉 순으로 정렬해서 최고 연봉 선수의 명단을 만든다고 가정해 보겠습니다. 로대시 없는 방법은 다음과 같습니다. 함수형 기법을 쓰지 않은 부분은 타입 구문이 필요합니다.

```ts
const teamToPlayers: {[team: string]: BasketballPlayer[]} = {};
for (const player of allPlayers) {
  const { team } = player;
  teamToPlayers[team] = teamToPlayers[team] || [];
  teamToPlayers[team].push(player);
}

for (const players of Object.values(teamToPlayers)) {
  players.sort((a, b) => b.salary - a.salary);
}

const bestPaid = Object.values(teamToPlayers).map(players => players[0]);
bestPaid.sort((playerA, playerB) => playerB.salary - playerA.salary);
console.log(bestPaid);
```

로데시를 사용해서 동일한 작업을 하는 코드를 구현하면 다음과 같습니다.

```ts
const bestPaid = _(allPlayers)
  .groupBy(player => player.team)
  .mapValues(players => _.maxBy(players, p => p.salary)!)
  .values()
  .sortBy(p => -p.salary)
  .value();
```

길이가 절반으로 줄었고, 보기에도 깔끔하며, `null`이 아님 단언문을 딱 한번만 사용했습니다. 또한 로데시와 언더스코어의 개념인 체인을 사용했기 때문에, 더 자연스러운 순서로 일련의 연산을 작성할 수 있었습니다.   
그런데 내장된 `Array.prototype.map` 대신 `_.map`을 사용하려는 이유는 무엇일까요? 한 가지 이유는 콜백을 전달하는 대신 속성의 이름을 전달할 수 있기 때문입니다.   

내장된 함수형 기법들과 로대시 같은 라이브러리에 타입 정보가 잘 유지되는 것은 우연이 아닙니다. 함수 호출 시 전달된 매개변수 값을 건드리지 않고 매번 새로운 값을 반환함으로써, 새로운 타입으로 안전하게 반환할 수 있습니다.
