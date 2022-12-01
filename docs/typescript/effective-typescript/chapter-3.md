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
