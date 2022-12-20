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
