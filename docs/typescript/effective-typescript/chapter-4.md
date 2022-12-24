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

## 🥕 아이템 32. 유니온의 인터페이스보다는 인터페이스의 유니온을 사용하기
벡터를 그리는 프로그램을 작성 중이고, 특정한 기하학적 타입을 가지는 계층의 인터페이스를 정의한다고 가정해 보겠습니다.

```ts
interface Layer {
  layout: FillLayout | LineLayout | PointLayout;
  paint: FillPaint | LinePaint | PointPaint;
}
```

`layout`이 `LineLayout` 타입이면서 `paint` 속성이 `FillPaint` 타입인 것은 말이 되지 않습니다. 이런 조합을 허용한다면 라이브러리에서는 오류가 발생하기 십상이고 인터페이스를 다루기도 어려울 것입니다.   
더 나은 방법으로 모델링하려면 각각 타입의 계층을 분리된 인터페이스로 둬야 합니다.

```ts
interface FillLayer {
  layout: FillLayout;
  paint: FillPaint;
}

interface LineLayer {
  layout: LineLayout;
  paint: LinePaint;
}

interface PaintLayout {
  layout: PointLayout;
  paint: PointPaint;
}

type Layer = FillLayer | LineLayer | PointLayer;
```

이런 형태로 `Layer`를 정의하면 `layout`과 `paint` 속성이 잘못된 조합으로 섞이는 경우를 방지할 수 있습니다.   

이러한 패턴의 가장 일반적인 예시는 태그된 유니온입니다. `Layer`의 경우 속성 중의 하나는 문자열 리터럴 타입의 유니온이 됩니다.

```ts
interface Layer {
  type: 'fill' | 'line' | 'point';
  layout: FillLayout | LineLayout | PointLayout;
  paint: FillPaint | LinePaint | PointPaint;
}
```

`type: 'fill'`과 함께 `LineLayout`과 `PointPaint` 타입이 쓰이는 것은 말이 되지 않습니다. 이러한 경우를 방지하기 위해 `Layer`를 인터페이스의 유니온으로 변환해 보겠습니다.

```ts
interface FillLayer {
  type: 'fill';
  layout: FillLayout;
  paint: FillPaint;
}

interface LineLayer {
  type: 'line';
  layout: LineLayout;
  paint: LinePaint;
}

interface PaintLayout {
  type: 'paint';
  layout: PointLayout;
  paint: PointPaint;
}

type Layer = FillLayer | LineLayer | PointLayer;
```

타입스크립트는 태그를 참고하여 `Layer`의 타입의 범위를 좁힐 수도 있습니다.

```ts
function drawLayer(layer: Layer) {
  if (layer.type === 'fill') {
    const { paint } = layer; // 타입이 FillPaint
    const { layout } = layer; // 타입이 FillLayout
  } else if (layer.type === 'line') {
    const { paint } = layer; // 타입이 LinePaint
    const { layout } = layer; // 타입이 LineLayout
  } else {
    const { paint } = layer; // 타입이 PointPaint
    const { layout } = layer; // 타입이 PointLayout
  }
}
```

각 타입의 속성들 간의 관계를 제대로 모델링하면, 타입스크립트가 코드의 정확성을 체크하는 데 도움이 됩니다. 다만 타입 분기 후 `layer`가 포함된 동일한 코드가 반복되는 것이 어수선해 보입니다.   

어떤 데이터 타입을 태그된 유니온으로 표헌할 수 있다면, 보통은 그렇게 하는 것이 좋습니다. 또는 여러 개의 선택적 필드가 동시에 값이 있거나 동시에 `undefined`인 경우도 태그된 유니온 패턴이 잘 맞습니다.

```ts
interface Person {
  name: string;
  // 다음은 둘 다 동시에 있거나 동시에 없습니다.
  placeOfBirth?: string;
  dateOfBirth?: Date;
}
```

타입 정보를 담고 있는 주석은 문제가 될 소지가 매우 높습니다. 두 개의 속성을 하나의 객체로 모으는 것이 더 나은 설계입니다. 이 방법은 `null` 값을 경계로 두는 방법과 비슷합니다.

```ts
interface Person {
  name: string;
  birth?: {
    place: string;
    date: Date;
  }
}
```

`Person` 객체를 매개변수로 받는 함수는 `birth` 하나만 체크하면 됩니다.   

타입의 구조를 손 댈 수 없는 상황이면, 앞서 다룬 인터페이스의 유니온을 사용해서 속성 사이의 관계를 모델링할 수 있습니다.

```ts
interface Name {
  name: string;
}

interface PersonWithBirth extends Name {
  placeOfBirth: string;
  dateOfBirth: Date;
}

type Person = Name | PersonWithBirth;
```

이제 중첩된 객체에서도 동일한 효과를 볼 수 있습니다.

```ts
function eulogize(p: Person) {
  if ('placeOfBirth' in p) {
    const { dateOfBirth } = p; // 정상, 타입이 Date
  }
}
```

## 🥕 아이템 33. `string` 타입보다 더 구체적인 타입 사용하기
`string` 타입으로 변수를 선언하려 한다면, 혹시 그보다 더 좁은 타입이 적절하지는 않을지 검토해 보아야 합니다.   
음악 컬렉션을 만들기 위해 앨범의 타입을 정의한다고 가정해 보겠습니다.

```ts
interface Album {
  artist: string;
  title: string;
  releaseDate: string; // YYYY-MM-DD
  recordingType: string; // 예를 들어, "live" 또는 "studio"
}
```

`string` 타입이 남발된 모습입니다. 계다가 주석에 타입을 정보를 적어 둔 걸 보면 현재 인터페이스가 잘못되었다는 것을 알 수 있습니다. `string` 타입의 범위가 넓기 때문에 제대로 된 `Album` 객체를 사용하더라도 매개변수 순서가 잘못된 것이 오류로 드러나지 않습니다.

```ts
function recordRelease(title: string, date: string) { /* ... */ }
recordRelease(kindOfBlue.releaseDate, kindOfBlue.title); // 오류여야 하지만 정상
```

`releaseDate` 필드는 `Date` 객체를 사용해서 날짜 형식으로만 제한하는 것이 좋습니다. `recordingType` 팔드는 `"live"`와 `"studio"`, 단 두 개의 값으로 유니온 타입을 정의할 수 있습니다.(`enum`을 사용할 수도 있지만 일반적으로는 추천하지 않습니다. 아이템 53 참고)

```ts
type RecordingType = 'studio' | 'live';

interface Album {
  artist: string;
  title: string;
  releaseDate: Date;
  recordingType: RecordingType;
}
```

이러한 방식에는 세 가지 장점이 더 있습니다.   
첫 번째, 타입을 명시적으로 정의함으로써 다른 곳으로 값이 전달되어도 타입 정보가 유지됩니다.   
두 번째, 타입을 명시적으로 정의하고 해당 타입의 의미를 설명하는 주석을 붙여 넣을 수 있습니다.(아이템 48)   

```ts
/** 이 녹음은 어떤 환경에서 이루어졌는지? */
type RecordingType = 'live' | 'studio';
```

함수를 사용하는 곳에서 `RecordingType`의 설명을 볼 수 있습니다.   
세 번째, `keyof`연산자로 더욱 세밀하게 객체의 속성 체크가 가능해집니다.

```ts
type K = keyof Album;
// 타입이 "artist" | "title" | "releaseDate" | "recordingType"
```

그러므로 `string`을 `keyof T`로 바꾸면 됩니다.

```ts
function pluck<T>(records: T[], key: keyof T) {
  return records.map(r => r[key]);
}
```

이 코드는 타입 체커를 통과합니다. 또한 타입스크립트가 반환 타입을 추론할 수 있게 해 줍니다. `pluck` 함수에 마우스를 올려 보면, 추론된 타입을 알 수 있습니다.   

그런데 `key`의 값으로 하나의 문자열을 넣게 되면, 그 범위가 너무 넓어서 적절한 타입이라고 보기 어렵습니다. 예를 들어 보곘습니다.

```ts
const releaseDates = pluck(albums, 'releaseDate'); // 타입이 (string | Date)[]
```

`releaseDates`의 타입은 `(string | Date)[]`가 아니라 `Date[]`이어야 합니다. `keyof T`는 `string`에 비하면 훨씬 범위가 좁기는 하지만 그래도 여전히 넓습니다. 따라서 범위를 더 좁히기 위해서, `keyof T`의 부분 집합으로 두 번째 제너릭 매개변수를 도입해야 합니다.

```ts
function pluck<T, K extends keyof T>(records: T[], key: K): T[K][] {
  return records.map(r => r[key]);
}
```

이제 타입 시그니처가 완벽해졌습니다.   
매개변수 타입이 정밀해진 덕분에 언어 서비스는 `Album`의 키에 자동 완성 기능을 제공할 수 있게 해 줍니다.   
`string`은 `any`와 비슷한 문제를 가지고 있습니다. 따라서 잘못 사용하게 되면 무효한 값을 허용하고 타입 간의 관계도 감추어 버립니다. 이러한 문제점은 타입 체커를 방해하고 실제 버그를 찾지 못하게 만듭니다. 보다 정확한 타입을 사용하면 오류를 방지하고 코드의 가독성도 향상시킬 수 있습니다.

## 🥕 아이템 34. 부정확한 타입보다는 미완성 타입을 사용하기

```ts
interface Point {
  type: 'Point';
  coordinates: number[];
}
interface LineString {
  type: 'LineString';
  coordinates: number[][];
}
interface Polygon {
  type: 'Polygon';
  coordinates: number[][][];
}
type Geometry = Point | LineString | Polygon; // 다른 것들도 추가할 수 있습니다.
```

큰 문제는 없지만 좌표에 쓰이는 `number[]`가 약간 추상적입니다. 여기서 `number[]`는 경도와 위도를 나타내므로 튜플 타입으로 선언하는 게 낫습니다.

```ts
type GeoPosition = [number, number];
interface Point {
  type: 'Point';
  coordinates: GeoPosition;
}
// ...
```

타입을 더 구체적으로 개선했기 때문에 더 나은 코드가 된 것 같습니다. 안타깝게도 새로운 코드가 빌드를 깨뜨린다며 불평하는 사용자들의 모습만 보게 될 겁니다. 코드에는 위도와 경도만을 명시했지만, `GeoJSON`의 위치 정보에는 세 번째 요소인 고도가 있을 수 있고 또 다른 정보가 있을 수도 있습니다.   
결과적으로 타입 선언을 세밀하게 만들고자 했지만 시도가 너무 과했고 오히려 타입이 부정확해졌습니다. 현재의 타입 선언을 그대로 사용하려면 사용자들은 타입 단언문을 도입하거나 `as any`를 추가해서 타입 체커를 완전히 무시해야 합니다.   

이렇게 부정확함을 바로잡는 방법을 쓰는 대신, 테스트 세트를 추가하여 놓친 부분이 없는지 확인해도 됩니다. 일반적으로 복잡한 코드는 더 많은 테스트가 필요하고 타입의 관점에서도 마찬가지입니다.

## 🥕 아이템 35. 데이터가 아닌, API와 명세를 보고 타입 만들기
파일 형식, API, 명세 등 우리가 다루는 타입 중 최소한 몇 개는 프로젝트 외부에서 비롯된 것입니다. 이러한 경우는 타입을 직접 작성하지 않고 자동으로 생성할 수 있습니다. 명세를 참고해 타입을 생성하면 타입스크립트는 사용자가 실수를 줄일 수 있게 도와줍니다.   
명세를 기반으로 타입을 작성한다면 현재까지 경험한 데이터뿐만 아니라 사용 가능한 모든 값에 대해서 작동한다는 확신을 가질 수 있습니다.   

API 호출에도 비슷한 고려 사항들이 적용됩니다. API의 명세로부터 타입을 생성할 수 있다면 그렇게 하는 것이 좋습니다. 특히 GraphQL처럼 자체적으로 타입이 정의된 API에서 잘 동작합니다.   

만약 명세 정보나 공식 스키마가 없다면 데이터로부터 타입을 생성해야 합니다. 이를 위해 [quicktype](https://quicktype.io/) 같은 도구를 사용할 수 있습니다. 그러나 생성된 타입이 실제 데이터와 일치하지 않을 수 있다는 점을 주의해야 합니다. 예외적인 경우가 존재할 수 있습니다.   

우리는 이미 자동 타입 생성의 이점을 누리고 있습니다. 브라우저 DOM API에 대한 타입 선언은 공식 인터페이스로부터 생성되었습니다.(아이템 55) 이를 통해 복잡한 시스템을 정확히 모델링하고 타입스크립트가 오류가 코드상의 의도치 않은 실수를 잡을 수 있게 합니다.

## 🥕 아이템 36. 해당 분야의 용어로 타입 이름 짓기

> 컴퓨터 과학에서 어려운 일은 단 두 가지뿐이다. 캐시 무효화와 이름 짓기. - 필 칼튼

이름 짓기 역시 타입 설계에서 중요한 부분입니다. 엄선된 타입, 속성, 변수의 이름은 의도를 명확히 하고 코드와 타입의 추상화 수준을 높여 줍니다. 잘못 선택한 타입 이름은 코드의 의도를 왜곡하고 잘못된 개념을 심어 주게 됩니다.   

동물들의 데이터베이스를 구축한다고 가정해 보겠습니다. 이를 표현하기 위해 인터페이스는 다음과 같습니다.

```ts
interface Animal {
  name: string;
  endangered: boolean;
  habitat: string;
}

const leopard: Animal = {
  name: 'Snow Leopard',
  endangered: false,
  habitat: 'tundra',
};
```

이 코드에는 네 가지 문제가 있습니다.
- `name`은 매우 일반적인 용어입니다. 동물의 학명인지 일반적인 명칭인지 알 수 없습니다.
- `endangered` 속성이 멸종 위기를 표현하기 위해 `boolean` 타입을 사용한 것이 이상합니다. 이미 멸종된 동물을 `true`로 해야 하는지 판단할 수 없습니다.
  `endangered` 속성의 의도를 "멸종 위기 또는 멸종"으로 생각한 것일지도 모릅니다.
- 서식지를 나타내는 `habitat` 속성은 너무 범위가 넓은 `string` 타입일 뿐만 아니라 서식지라는 뜻 자체도 불분명하기 때문에 다른 속성들보다도 훨씬 모호합니다.
- 객체의 변수명이 `leopard`이지만, `name` 속성의 값은 'Snow Leopard' 입니다. 객체의 이름과 속성의 `name`이 다른 의도로 사용된 것인지 불분명합니다.

이 예제의 문제를 해결하려면, 속성에 대한 정보가 모호하기 때문에 해당 속성을 작성한 사람을 찾아서 의도를 물어 봐야 합니다. 그러나 해당 속성을 작성한 사람은 아마도 회사에 이미 없거나 코드를 기억하지 못할 겁니다. 또는 속성을 작성한 사람을 찾기 위해 기록을 뒤졌을 때, 작성한 사람이 바로 본인이라는 것을 알게 되는 최악의 상황이 펼쳐질 수도 있습니다.   
반면, 다음 코드의 타입 선언은 의미가 분명합니다.

```ts
interface Animal {
  commonName: string;
  genus: string;
  species: string;
  status: ConservationStatus;
  climates: KoppenClimate[];
}

const snowLeopard: Animal = {
  commonName: 'Snow LeoPard',
  genus: 'Panthera',
  species: 'Uncia',
  status: 'VU', // 취약종
  climates: ['ET', 'EF', 'Dfd'], // 고산대 또는 아고산대
}
```

이 코드는 다음 세 가지를 개선했습니다.
- `name`은 `commonName`, `genus`, `species`등 더 구체적인 용어로 대체했습니다.
- `endangered`는 동물 보호 등급에 대한 IUCN의 표준 분류 체계인 `ConservationStatus` 타입의 `status`로 변경되었습니다.
- `habitat`은 기후를 뜻하는 `climates`로 변경되었으며, 쾨펜 기후 분류를 사용합니다.

코드를 표현하고자 하는 모든 분야에는 주제를 설명하기 위한 전문 용어들이 있습니다. 자체적으로 용어를 만들어 내려고 하지 말고, 해당 분야에 이미 존재하는 용어를 사용해야 합니다. 이런 용어들을 사용하면 사용자와 소통에 유리하며 타입의 명확성을 올릴 수 있습니다.   
전문 분야의 용어는 정확하게 사용해야 합니다. 특정 용어를 다른 의미로 잘못 쓰게 되면, 직접 만들어 낸 용어보다 더 혼란을 주게 됩니다.   

타입, 속성, 변수에 이름을 붙일 때 명심해야 할 세 가지 규칙이 있습니다.
- 동일한 의미를 나타낼 때는 같은 용어를 사용해야 합니다. 글을 쓸 때나 말을 할 때, 같은 단어를 반복해서 사용하면 지루할 수 있기 때문에 동의어를 사용합니다. 하지만 코드에서는 좋지 않습니다. 정말로 의미적으로 구분이 되어야 하는 경우에만 다른 용어를 사용해야 합니다.
- `data`, `info`, `thing`, `item`, `object`, `entity` 같은 모호하고 의미 없는 이름은 피해야 합니다. 만약 `entity`라는 용어가 해당 분야에서 특별한 의미를 가진다면 괜찮습니다.
- 이름을 지을 때는 포함된 내용이나 계산 방식이 아니라 데이터 자체가 무엇인지를 고려해야 합니다. 예를 들어, `INodeList`보다는 `Directory`가 더 의미 있는 이름입니다. `Directory`는 구현의 측면이 아니라 개념적인 측면에서 디렉터리를 생각하게 합니다. 좋은 이름은 추상화의 수준을 높이고 의도치 않은 충돌의 위험성을 줄여 줍니다.
