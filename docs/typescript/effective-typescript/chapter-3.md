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
