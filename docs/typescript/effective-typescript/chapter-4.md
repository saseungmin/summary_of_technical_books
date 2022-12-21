---
sidebar_position: 5
sidebar_label: 4. 타입 설계
---

# 🐤 Chapter 4: 타입 설계

## 🥕 아이템 28. 유효한 상태만 표현하는 타입을 지향하기
효과적으로 타입을 설계하려면, 유효한 상태만 표현할 수 있는 타입을 만들어 내는 것이 가장 중요합니다.   

웹 애플리케이션을 만든다고 가정해 보겠습니다. 애플리케이션에서 페이지를 선택하면, 페이지의 내용을 로드하고 화면에 표시합니다. 페이지의 상태는 다음처럼 설계했습니다.

```ts
interface State {
  pageText: string;
  isLoading: boolean;
  error?: string;
}

function renderPage(state: State) {
  if (state.error) {
    return `Error! Unable to load ${currentPage}: ${state.error}`;
  } else if (state.isLoading) {
    return `Loading ${currentPage}...`;
  }
  return `<h1>${currentPage}</h1>\n${state.pageText}`;
}
```

코드를 살펴보면 분기 조건이 명확히 분리되어 있지 않다는 것을 알 수 있습니다.   
한편 페이지를 전환하는 `changePage` 함수는 다음과 같습니다.

```ts
async function changePage(state: State, newPage: string) {
  state.isLoading = true;
  try {
    const response = await fetch(getUrlForPage(newPage));
    if (!response.ok) {
      throw new Error(`Unable to load ${newPage}: ${response.statusText}`);
    }
    const text = await response.text();
    state.isLoading = false;
    state.pageText = text
  } catch (e) {
    state.error = '' + e;
  }
}
```

`changePage`에는 많은 문제점이 있습니다. 몇 가지 정리해 보면 다음과 같습니다.
- 오류가 발생했을 때 `state.isLoading`을 `false`로 설정하는 로직이 빠져 있습니다.
- `state.error`를 초기화하지 않았기 때문에, 페이지 전환 중에 로딩 메시지 대신 과거의 오류 메시지를 보여 주게 됩니다.
- 페이지 로딩 중에 사용자가 페이지를 바꿔 버리면 어떤 일이 벌어질지 예상하기 어렵습니다. 새 페이지에 오류가 뜨거나, 응답이 오는 순서에 따라 두번째 페이지가 아닌 첫 번째 페이지로 전환될 수도 있습니다.

문제는 바로 상태 값의 두 가지 속성이 동시에 정보가 부족하거나, 두 가지 속성이 충돌할 수 있다는 것입니다. `State` 타입은 `isLoading`이 `true`이면서 동시에 `error` 값이 설정되는 무효한 상태를 허용합니다. 무효한 상태가 존재하면 `render()`와 `changePage()` 둘 다 제대로 구현할 수 없게 됩니다.   
다음은 애플리케이션의 상태를 좀 더 제대로 표현한 방법입니다.

```ts
interface RequestPending {
  state: 'pending';
}

interface RequestError {
  state: 'error';
  error: string;
}
interface RequestSuccess {
  state: 'ok';
  pageText: string;
}
type RequestState = RequestPending | RequestError | RequestSuccess;

interface State {
  currentPage: string;
  requests: {[page: string]: RequestState};
}
```

이번 예제는 상태를 나타내는 타입의 코드 길이가 서너 배 길어지긴 했지만, 무효한 상태를 허용하지 않도록 크게 개선되었습니다. 현재 페이지는 발생하는 모든 요청의 상태로서, 명시적으로 모델링되었습니다. 그 결과로 개선된 `renderPage`와 `changePage` 함수는 쉽게 구현할 수 있습니다.

```ts
function renderPage(state: State) {
  const { currentPage } = state;
  const requestState = state.requests[currentPage];
  switch (requestState.state) {
    case 'pending':
      return `Loading ${currentPage}...`;
    case 'error':
      return `Error! Unable to load ${currentPage}: ${requestState.error}`;
    case 'ok':
      return `<h1>${currentPage}</h1>\n${requestState.pageText}`;
  }
}

async function changePage(state: State, newPage: string) {
  state.requests[newPage] = { state: 'pending' };
  state.currentPage = newPage;

  try {
    const response = await fetch(getUrlForPage(newPage));
    if (!response.ok) {
      throw new Error(`Unable to load ${newPage}: ${response.statusText}`);
    }
    const pageText = await response.text();
    state.requests[newPage] = { state: 'ok', pageText };
  } catch (e) {
    state.requests[newPage] = { state: 'error', error: '' + e };
  }
}
```

이번 아이템의 처음에 등장했던 모호함은 완전히 사라졌습니다. 현재 페이지가 무엇인지 명확하며, 모든 요청은 정확히 하나의 상태로 맞아 떨어집니다. 요청이 진행 중인 상태에서 사용자가 페이지를 변경하더라고 문제없습니다. 무효가 된 요청이 실행되긴 하겠지만 UI에는 영향을 미치지 않습니다.   

타입을 설계할 때는 어떤 값들을 포함하고 어떤 값들을 제외할지 신중하게 생각해야 합니다. 유효한 상태를 표현하는 값만 허용한다면 코드를 작성하기 쉬워지고 타입 체크가 용이해집니다. 유효한 상태만 허용하는 것은 매우 일반적인 원칙입니다. 반면 특정한 상황에서 지켜야할 원칙들도 있는데, 4장의 다른 아이템들에서 다루겠습니다.   

### 요약

- 유효한 상태와 무효한 상태를 둘 다 표현하는 타입은 혼란을 초래하기 쉽고 오류를 유발하게 됩니다.
- 유효한 상태만 표현하는 타입을 지향해야 합니다. 코드가 길어지거나 표현하기 어렵지만 결국은 시간을 절약하고 고통을 줄일 수 있습니다.

## 🥕 아이템 29. 사용할 때는 너그럽게, 생성할 때는 엄격하게
함수의 매개변수는 타입의 범위가 넓어도 되지만, 결과를 반환할 때는 일반적으로 타입의 법위가 더 구체적이어야 합니다.

> 예제 P. 163 ~ P. 166 참고

### 요약
- 보통 매개변수 타입은 반환 타입에  비해 범위가 넒은 경향이 있습니다. 선택적 속성과 유니온 타입은 반환 타입보다 매개변수 타입에 더 일반적입니다.
- 매개변수와 반환 타입의 재사용을 위해서 기본 형태(반환 타입)와 느슨한 형태(매개변수 타입)를 도입하는 것이 좋습니다.

## 🥕 아이템 30. 문서에 타입 정보를 쓰지 않기
다음 코드에서 잘못된 부분을 찾아보겠습니다.

```ts
/**
 * 전경색(foreground) 문자열을 반환합니다.
 * 0 개 또는 1 개의 매개변수를 받습니다.
 * 매개변수가 있을 때는 특정 페이지의 전경색을 반환합니다.
 **/
function getForegroundColor(page?: string) {
  return page === 'login' ? { r: 127, g: 127, b: 127 } : { r: 0, g: 0, b: 0 };
}
```

코드와 주석의 정보가 맞지 않습니다. 둘 중 어느 것이 옳은지 판단하기에는 정보가 부족하며, 잘못된 상태라는 것만은 분명합니다.   
앞의 예제에서 의도된 동작이 코드에 제대로 반영되고 있다고 가정하면, 주석에는 세 가지 문제점이 있습니다.

- 함수가 `string` 형태의 색깔을 반환한다고 적혀 있지만 실제로는 `{ r, g, b }` 객체를 반환합니다.
- 주석에는 함수가 0개 또는 1개의 매개변수를 받는다고 설명하고 있지만, 타입 시그니처만 보아도 명확하게 알 수 있는 정보입니다.
- 불필요하게 장황합니다. 함수 선언과 구현체보다 주석이 더 깁니다.

타입스크립트의 타입 구문 시스템은 간결하고, 구체적이며, 쉽게 읽을 수 있도록 설계되었습니다. 함수의 입력과 출력의 타입을 코드로 표현하는 것이 주석보다 더 나은 방법이라는 것은 자명합니다.   
그리고 타입 구문은 타입스크립트 컴파일러가 체크해 주기 때문에, 절대로 구현체와의 정합성이 어긋나지 않습니다.   
누군가 강제하지 않는 이상 주석은 코드와 동기화되지 않습니다. 그러나 타입 구문은 타입스크립트 타입 체커가 타입 정보를 동기화하도록 강제합니다. 주석 대신 타입 정보를 작성한다면 코드가 변경된다 하더라도 정보가 정확히 동기화됩니다.   
주석은 다음과 같이 개선할 수 있습니다.

```ts
// 애플리케이션 또는 특정 페이지의 전경색을 가져옵니다.
function getForegroundColor(page?: string): Color {
  // ...
}
```

특정 매개변수를 설명하고 싶다면 `JSDoc`의 `@param` 구문을 사용하면 됩니다.   
값을 변경하지 않는다고 설명하는 주석도 좋지 않습니다. 또한 매개변수를 변경하지 않는다는 주석도 사용하지 않는 것이 좋습니다.

```ts
// nums를 변경하지 않습니다.
function sort(nums: number[]) { /* ... */ }
```

그 대신, `readonly`로 선언하여 타입스크립트가 규칙을 강제할 수 있게 하면 됩니다.

```ts
function sort(nums: readonly number[]) { /* ... */ }
```

주석에 적용한 규칙은 변수명에도 그대로 적용할 수 있습니다. 변수명에 타입 정보를 넣지 않도록 합니다. 예를 들어 변수명을 `ageNum`으로 하는 것보다는 `age`로 하고, 그 타입이 `number`임을 명시하는 게 좋습니다.   
그러나 단위가 있는 숫자들은 예외입니다. 단위가 무엇인지 확실하지 않다면 변수명 또는 속성 이름에 단위를 포함할 수 있습니다. 예를 들어 `timeMs`는 `time`보다 훨씬 명확하고 `temperatureC`는 `temperature`보다 훨씬 명확합니다.

## 🥕 아이템 31. 타입 주변에 `null`값 배치하기
값이 전부 `null`이거나 전부 `null`이 아닌 경우로 분명히 구분된다면, 값이 섞여 있을 때보다 다루기 쉽습니다. 타입에 `null`을 추가하는 방식으로 이러한 경우를 모델링할 수 있습니다.   
숫자들의 최솟값과 최댓값을 계산하는 `extent`함수를 가정해 보겠습니다.

```ts
function extent(nums: number[]) {
  let min, max;
  for (const num of nums) {
    if (!min) {
      min = num;
      max = num;
    } else {
      min = Math.min(min, num);
      max = Math.max(max, num);
    }
  }
  return [min, max];
}
```

이 코드는 타입 체커를 통과하고(`strictNullChecks` 없이), 반환 타입은 `number[]`로 추론됩니다. 그러나 여기에는 버그와 함께 설계적 결함이 있습니다.
- 최솟값이나 최댓값이 0인 경우, 값이 덧씌워져 버립니다. 예를 들어, `extent([0, 1, 2])`의 결과는 `[0, 2]`가 아니라 `[1, 2]`가 됩니다.
- `nums` 배열이 비어 있다면 함수는 `[undefined, undefined]`를 반환합니다.

`strictNullChecks` 설정을 켜면 앞의 두 가지 문제점이 드러납니다.

```ts
function extent(nums: number[]) {
  let min, max;
  for (const num of nums) {
    if (!min) {
      min = num;
      max = num;
    } else {
      min = Math.min(min, num);
      max = Math.max(max, num);
      //             ~~~ 'number | undefined' 형식의 인수는 'number' 형식의 매개변수에 할당될 수 없습니다.
    }
  }
  return [min, max];
}
```

`extent`의 반환 타입이 `(number | undefined)[]`로 추론되어서 설계적 결함이 분명해졌습니다. 이제는 `extent`를 호출하는 곳마다 타입 오류의 형태로 나타납니다.

```ts
const [min, max] = extent([0, 1, 2]);
const span = max - min;
//           ~~~   ~~~ 객체가 'undefined'인 것 같습니다.
```

더 나은 해법을 찾아보겠습니다. `min`과 `max`를 한 객체 안에 넣고 `null`이거나 `null`이 아니게 하면 됩니다.

```ts
function extent(nums: number[]) {
  let result: [number number] | null = null;
  for (const num of nums) {
    if (!result) {
      result = [num, num];
    } else {
      result = [Math.min(num, result[0]), Math.max(num, result[1])];
    }
  }
  return result;
}
```

이제는 반환 타입이 `[number, number] | null`이 되어서 사용하기가 더 수월해졌습니다.   
`extent`의 결괏값으로 단일 객체를 사용함으로써 설계를 개선했고, 타입스크립트가 `null` 값 사이의 관계를 이해할 수 있도록 했으며 버그도 제거했습니다. `if(!result)` 체크는 이제 제대로 동작합니다.
