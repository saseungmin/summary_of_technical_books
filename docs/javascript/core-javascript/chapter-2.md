---
sidebar_position: 3
---

# 🌈 Chapter 2: 실행 컨텍스트

- 실행 컨텍스트(execution context)는 **실행할 코드에 제공할 환경 정보들을 모아놓은 객체**로, 자바스크립트의 동적 언어로서의 성격을 가장 잘 파악할 수 있는 개념이다.
- 자바스크립트는 어떤 실행 컨텍스트가 활성화되는 시점에 선언된 변수를 위로 끌어올리고(호이스팅), 외부 환경 정보를 구성하고, `this` 값을 설정하는 등의 동작을 수행한다.

## 📚 실행 컨텍스트란?
- 실행 컨텍스트(execution context)는 **실행할 코드에 제공할 환경 정보들을 모아놓은 객체**이다.
- 동일한 환경에 있는 코드들을 실행할 때 필요한 환경 정보들을 모아 컨텍스트를 구성하고, 이를 콜 스택에 쌓아올렸다가, 가장 위에 쌓여있는 컨텍스트와 관련 있는 코드들을 실행하는 식으로 전체 코드의 환경과 순서를 보장한다.

```js
// 실행 컨텍스트와 콜 스택
// ------------------ (1)
var a = 1;
function outer() {
  function inner() {
    console.log(a); // undefined
    var a = 3;
  }

  inner(); // ------------ (2)
  console.log(a); // 1
}

outer(); // ------------ (3)
console.log(a); // 1
```

1. 위 예제와 같이 처음 자바스크립트 코드를 실행하는 순간 `(1)` 전역 컨텍스트가 콜 스택에 담긴다. **최상단의 공간은 코드 내부에서 별도의 실행 명령이 없어도 브라우저에서 자동으로 실행하므로 자바스크립트 파일이 열리는 순간 전역 컨텍스트가 활성화된다.**
2. 콜 스택에는 전역 컨텍스트 외에 다른 덩어리가 없으므로 전역 컨텍스트와 관련된 코드들을 순차로 진행하다가 `(3)`에서 `outer` 함수를 호출하면 자바스크립트 엔진은 `outer`에 대한 환경 정보를 수집해서 `outer` 실행 컨텍스트를 생성한 후 콜 스택에 담는다.
3. 콜 스택의 맨 위에 `outer` 실행 컨텍스트가 놓인 상태가 됐으므로 전역 컨텍스트와 관련된 코드의 실행을 일시 중단하고 대신 `outer` 실행 컨텍스트와 관련된 코드, 즉 `outer` 함수 내부의 코드들을 순차적으로 실행한다.
4. 다시 `(2)`에서 `inner` 함수의 실행 컨텍스트가 콜 스택의 가장 위에 담기면 `outer` 컨텍스트와 관련된 코드의 실행을 중단하고 `inner` 함수 내부의 코드를 순서대로 진행한다.
5. `inner` 함수 내부에서 `a` 변수에 값 3을 할당하고 나면 `inner` 함수의 실행이 종료되면서 `inner` 실행 컨텍스트가 콜 스택에서 제거된다. 그 후 `(2)`의 다음 줄부터 이어서 실행한다.
6. `a` 변수의 값을 출력하고 나면 `outer` 함수의 실행이 종료되어 `outer` 실행 컨텍스트가 콜 스텍에서 제거되고 클 스택에는 전역 컨텍스트만 남아 있게 된다.
7. 그런 다음, 실행을 중단했던 `(3)`의 다음 줄부터 이어서 실행한다. `a` 변수의 값을 출력하고 나면 전역 공간에 더는 실행할 코드가 남아 있지 않아 전역 컨텍스트도 제거되고, 콜 스택에는 아무것도 남지 않은 상태로 종료되게 된다.
- 이렇게 어떤 실행 컨텍스트가 활성화될 때 자바스크립트 엔진은 해당 컨텍스트에 관련된 코드들을 실행하는 데 필요한 환경 정보들을 수집해서 실행 컨텍스트 객체에 저장한다. 이 객체는 자바스크립트 엔진이 활용할 목적으로 생성할 분 개발자가 코드를 통해 확인할 수 없다. 여기에 담기는 정보들은 다음과 같다.
  - `VariableEnvironment`: 현재 컨텍스트 내의 식별자들에 대한 정보 + 외부 환경 정보. 선언 시점의 `LexicalEnvironment`의 스냅샷으로, 변경 사항은 반영되지 않음.
  - `LexicalEnvironment`: 처음에는 `VariableEnvironment`와 같지만 변경 사항이 실시간으로 반영됨.
  - `ThisBinding`: `this` 식별자가 바라봐야 할 대상 객체.

## 📚 VariableEnvironment
- `VariableEnvironment`에 담기는 내용은 `LexicalEnvironment`와 같지만 최초 실행 시의 스냅샷을 유지한다는 점이 다르다.
- 실행 컨텍스트를 생성할 때 `VariableEnvironment`에 정보를 먼저 담은 다음, 이를 그대로 복사해서 `LexicalEnvironment`를 만들고, 이후에는 `LexicalEnvironment`를 주로 활용한다.
- `VariableEnvironment`와 `LexicalEnvironment`의 내부는 `environmentRecord`와 `outerEnvironmentReference`로 구성돼 있다.

## 📚 LexicalEnvironment

### 🎈 environmentRecord와 호이스팅
- `environmentRecord`에는 현재 컨텍스트와 관련된 코드의 식별자 정보들이 저장된다. 컨텍스트를 구성하는 함수에 지정된 매개변수 식별자, 선언한 함수가 있을 경우 그 함수 자체, `var`로 선언된 변수의 식별자 등이 식별자에 해당한다. 컨텍스트 내부 전체를 처음부터 끝까지 쭉 훑어나가며 **순서대로** 수집한다.
- 코드가 실행되기 전임에도 불구하고 자바스크립트 엔진은 이미 해당 환경에 속한 코드의 변수명들을 모두 알고 있게 된다. 그 말은 즉, 자바스크립트 엔진은 식별자들을 최상단으로 끌어올려놓은 다음 실제 코드를 실행한다라고 생각해도 문제 없다. 여기서 호이스팅이라는 개념이 등장한다.

#### 🐶 호이스팅 규칙
- `environmentRecord`에는 매개변수, 이름, 함수 선언, 변수명 등이 담긴다.

```js
// 매개변수와 변수에 대한 호이스팅
function a() {
  var x = 1; // 수집 대상 1(매개변수 선언)
  console.log(x); // (1)
  var x; // 수집 대상 2(변수 선언)
  console.log(x); // (2)
  var x = 2; // 수집 대상 3(변수 선언)
  console.log(x); // (3)
}

a();
```

- `environmentRecord`는 현재 실행될 컨텍스트의 대상 코드 내에 어떤 식별자들이 있는지에만 관심이 있고, 각 식별자에 어떤 값이 할당될 것인지는 관심이 없다. 따라서 변수를 호이스팅할 때 변수명만 끌어올리고 할당 과정은 원래 자리에 그래도 남겨둔다. 매개변수의 경우에도 마찬가지이다.
- `environmentRecord`의 관심사에 맞춰 수집 대상 1, 2, 3을 순서대로 끌어올리고 나면 다음과 같은 형태로 바뀐다.

```js
function a() {
  var x; // 수집 대상 1의 변수 선언 부분
  var x; // 수집 대상 2의 변수 선언 부분
  var x; // 수집 대상 3의 변수 선언 부분

  x = 1; // 수집 대상 1의 할당 부분
  console.log(x); // (1)
  console.log(x); // (2)
  x = 2; // 수집 대상 3의 할당 부분
  console.log(x); // (3)
}

a(1);
```

- 이제 호이스팅이 끝났으니 실제 코드가 실행될 차례이다.
  1. 변수 `x`를 선언하고 이때 메모리에서는 저장할 공간을 미리 확보하고, 확보한 공간의 주솟값을 변수 `x`에 연결해둔다.
  2. 그 다음 변수 `x`를 차례로 선언한다. 이미 선언된 변수 `x`가 존재하니 무시한다.
  3. `x`에 1을 할당한다. 우선 숫자 1을 별도의 메모리에 담고, `x`와 연결된 메모리 공간에 숫자 1을 가리키는 주솟값을 입력한다.
  4. `x`를 `(1)`과 `(2)`에서 1이 출력된다.
  5. `x`에 2를 할당한다. 숫자 2를 별도의 메모리에 담고, 그 주솟값을 든 채로 `x`와 연결된 메모리 공간으로 간다. 이제 변수 `x`는 숫자 2를 가리키게 된다.
  6. `x`가 `(3)`에서 2가 출력되고, 이제 함수 내부의 모든 코드가 실행됐으므로 실행 컨텍스트가 콜 스택에서 제거된다.

```js
// 함수 선언의 호이스팅
function a() {
  console.log(b);  // (1)
  var b = 'bbb';   // 수집 대상 1(변수 선언)
  console.log(b);  // (2)
  function b () {} // 수집 대상 2(함수 선언) 
  console.log(b);  // (3)
}

a();
```

- `a` 함수를 실행하는 순간 `a` 함수의 실행 컨텍스트가 생성된다. 이때 변수명과 함수 선언의 정보를 위로 끌어올린다. 변수는 선언부와 할당부를 나누어 선언부만 끌어올리는 반면 함수 선언은 함수 전체를 끌어올린다.

```js
function a() {
  var b; // 수집 대상 1. 변수는 선언부만 끌어올린다.
  function b() {} // 수집 대상2. 함수 선언은 전체를 끌어올린다.

  console.log(b); // (1)
  b = 'bbb'; // 변수의 할당부는 원래 자리에 남겨둔다.
  console.log(b); // (2)
  console.log(b); // (3)
}

a();
```

#### 🐶 함수 선언문과 함수 표현식
- 함수 선언문은 `function` 정의부만 존재하고 별도의 할당 명령이 없는 것을 의미하고, 반대로 함수 표현식은 정의한 `function`을 별도의 변수에 할당하는 것을 말한다.

```js
function a() { /* ... */} // 함수 선언문.

var b = function () { /* ... */} // (익명) 함수 표현식

var c = function d() { /* ... */} // 기명 함수 표현식, 함수명으로는 호출 불가
```

- 함수 선언문과 함수 표현식

```js
console.log(sum(1, 2));
console.log(multiply(3, 4));

function sum (a, b) { // 함수 선언문 sum
  return a + b;
}

var multiply = function (a, b) { // 함수 표현식 multiply
  return a * b;
}
```

- 다음은 위 코드가 호이스팅을 마친 상태이다.

```js
var sum = function sum(a, b) { // 함수 선언문은 전체를 호이스팅이한다.
  return a + b;
};

var multiply; // 변수는 선언부만 끌어올린다.

console.log(sum(1, 2)); // 3
console.log(multiply(3, 4)); // multiply is not a function.

multiply = function (a, b) { // 변수의 할당부는 원래 자리에..
  return a * b;
}
```

- 위 예에서 `multiply` 호출시 값이 할당돼 있지 않다. 비어있는 대상을 함수로 여겨 실행하라고 명령했다. 따라서 *multiply us not a function*이라는 에러 메시지가 출력된다.

### 🎈 스코프, 스코프 체인, outerEnvironmentReference
- 스코프(scope)란 식별자에 대한 유효범위이다.
- 어떤 경계 A의 외부에서 선언한 변수는 A의 외부뿐 아니라 A의 내부에서도 접근이 가능하지만, A의 내부에서 선언한 변수는 오직 A의 내부에서만 접근할 수 있다.
- 식별자의 유효범위를 안에서부터 바깥으로 차례로 검색해나가는 것을 스코프 체인(scope chain)이라고 한다. 그리고 이를 가능케 하는 것이 바로 `LexicalEnvironment`의 두 번째 수집 자료인 `outerEnvironmentReference`이다.

#### 🐶 스코프 체인
- `outerEnvironmentReference`는 **현재 호출된 함수가 선언**될 당시의 `LexicalEnvironment`를 참조한다.
- 예를 들어, A함수 내부에 B 함수를 선언하고 다시 B 함수 내부에 C 함수를 선언한 경우, 함수 C의 `outerEnvironmentReference`는 함수 B의 `LexicalEnvironment`를 참조한다. 함수 B의 `LexicalEnvironment`에 있는 `outerEnvironmentReference`는 다시 함수 B가 선언되던 때(A)의 `LexicalEnvironment`를 참조한다.
- 이처럼 `outerEnvironmentReference`는 연결리스트 형태를 띤다. 선언 시점의 `LexicalEnvironment`를 계속 찾아 올라가면 마지막엔 전역 컨텍스트의 `LexicalEnvironment`가 있을 것이다. 또한 각 `outerEnvironmentReference`는 오직 자신이 선언된 시점의 `LexicalEnvironment`만 참조하고 있으므로 가장 가까운 요소부터 차례대로만 접근할 수 있고 다른 순서로는 접근하는 것은 불가능하다.
- 이런 구조적 특성 덕분에 여러 스코프에서 동일한 식별자를 선언하는 경우에는 **무조건 스코프 체인 상에서 가장 먼저 발견된 식별자에만 접근이 가능하게 되는것이다.**

```js
// 스코프 체인
var a = 1;
var outer = function () {
  var inner = function () {
    console.log(a);
    var a = 3;
  };

  inner();
  console.log(a);
};

outer();
console.log(a);
```

1. 전역 컨텍스트가 활성화된다. 전역 컨텍스트의 `environmentRecord`에 `{a, outer}` 식별자를 저장한다. 전역 컨텍스트는 선언 시점이 없으므로 전역 컨텍스트의 `outerEnvironmentReference`에는 아무것도 담기지 않는다. (this: 전역 객체)
2. 전역 스코프에 있는 변수 `a`에 1을, `outer`에 함수를 할당한다.
3. `outer` 함수를 호출한다. 이에 따라 전역 컨텍스트의 코드는 `outer` 호출하는 시점에서 임시중단되고, `outer` 실행 컨텍스트가 활성화되어 `outer` 내부의 첫번째 줄로 이동한다.
4. `outer` 실행 컨텍스트의 `environmentRecord`에 `{ inner }` 식별자를 저장한다. `outerEnvironmentReference`에는 `outer` 함수가 선언될 당시의 `LexicalEnvironment`가 담긴다. `outer` 함수는 전역 공간에서 선언됐으므로 전역 컨텍스트의 `LexicalEnvironment`를 참조복사한다. 이를 `[GLOBAL, { a, outer }]`라고 표기한다. 첫 번째는 실행 컨텍스트의 이름, 두 번째는 `environmentRecord` 객체이다. (this: 전역 객체)
5. `outer` 스코프에 있는 변수 `inner`에 함수를 할당한다.
6. `inner` 함수를 호출하고 이에 따라 `outer` 실행 컨텍스트의 코드는 임시중단되고, `inner` 실행 컨텍스트가 활성화되어 `inner` 함수 내부의 첫 번째줄로 이동한다.
7. `inner` 실행 컨텍스트의 `environmentRecord`에 `{ a }` 식별자를 저장한다. `outerEnvironmentReference`에는 `inner` 함수가 선언될 당시의 `LexicalEnvironment`가 담긴다. `inner` 함수는 `outer` 함수 내부에서 선언됐으므로 `outer` 함수의 `LexicalEnvironment` 즉, `[ outer, { inner }]`를 참조보고사한다. (this: 전역 객체)
8. 식별자 `a`에 접근하고 현재 활성화 상태인 `inner` 컨텍스트의 `environmentRecord`에서 `a`를 검색한다. `a`가 발견됐는데 아직 할당된 값이 없다. (`undefined` 출력)
9. `inner` 스코프에 있는 변수 `a`에 3을 할당한다.
10. `inner` 함수 실행이 종료되고 `inner` 실행 컨텍스트가 콜 스택에서 제거되고, 바로 아래의 `outer` 실행 컨텍스트가 다시 활성화되면서, 앞서 중단했던 `inner` 호출 줄 다음 줄로 이동한다.
11. `outer` 내부의 `console.log(a)` 즉, 식별자 `a`에 접근하고자 한다. 이때 자바스크립트 엔진은 활성화된 실행 컨텍스트의 `LexicalEnvironment`에 접근한다. 첫 요소의 `environmentRecord`에서 `a`가 있는지 찾아보고, 없으면 `outerEnvironmentReference`에 있는 `environmentRecord`로 넘어가는 식으로 계속해서 검색한다. 예제에서는 두 번째 즉, 전역 `LexicalEnvironment`에 `a`가 있으니 `a`에 저장된 값 1을 반환한다. (1 출력)
12. `outer` 함수 실행이 종료된다. `outer` 실행 컨텍스트가 콜 스택에서 제거되고, 바로 아래 전역 컨텍스트가 다시 활성화되면서, 앞서 중단했던 `outer` 호출 부분 다음 줄로 이동한다.
13. 식별자 `a`에 접근하고자 한다. 현재 활성화 상태인 전역 컨택스트의 `environmentRecord`에서 `a`를 검색한다. 바로 `a`를 찾고 (1 출력) 모든 코드의 실행이 완료된다.
14. 전역 컨텍스트가 콜 스택에서 제거되고 종료된다.
- 전역 공간에서는 전역 스코프에서 생성된 변수만 접근할 수 있지만 `outer` 함수 내부에서는 `outer` 및 전역 스코프에서 생성된 변수에 접근할 수 있다. 또한 `inner` 함수 내부에서는 `inner`, `outer`, 전역 스코프 모두에 접근할 수 있다.
- 스코프 체인 상에 있는 변수라고 해서 무조건 접근 가능한 건 아닌데 위 코드에서 식별자 `a`는 전역 공간에서도 선언했고 `inner` 함수 내부에서 선언했다. 이때 `inner` 스코프의 `LexicalEnvironment`부터 검색할 수밖에 없기 때문에 `inner` `LexicalEnvironment`에 `a` 식별자가 존재하므로 스코프 체인 검색을 더 진행하지 않고 즉시 `a`를 반환하게 된다. 이를 **변수 은닉화**라고 한다.

## 📚 this
- 실행 컨텍스트의 `thisBinding`에는 `this`로 지정된 객체가 저장된다.
- 실행 컨텍스트 활성화 당시에 `this`가 지정되지 않은 경우 `this`에는 전역 객체가 저장된다.
- 그밖에는 함수를 호출하는 방법에 따라 `this`에 저장되는 대상이 다르다. 
- 3장 참고

## 📚 정리
- 실행 컨텍스트는 실행할 코드에 제공할 환경 정보들을 모아놓은 객체이다.
- 실행 컨텍스트는 전역 공간에서 자동으로 생성되는 전역 컨텍스트와 `eval` 및 함수 실행에 의한 컨텍스트 등이 있다.
- 실행 컨텍스트 객체는 활성화되는 시점에 `VariableEnvironment`, `LexicalEnvironment`, `ThisBinding`의 세 가지 정보를 수집한다.
- 실행 컨텍스트를 생성할 때는 `VariableEnvironment`와 `LexicalEnvironment`가 동일한 내용으로 구성하지만 `LexicalEnvironment`는 함수 실행 도중에 변경되는 사항이 즉시 반영되는 반면 `VariableEnvironment`는 초기 상태를 유지한다.
- `VariableEnvironment`와 `LexicalEnvironment`는 매개변수명, 변수의 식별자, 선언한 함수의 함수명 등을 수집하는 `environmentRecord`와 바로 직전 컨텍스트의 `LexicalEnvironment` 정보를 참조하는 `outerEnvironmentReference`로 구성돼 있다.
- **호이스팅**은 코드 해석을 좀 더 수월하게 하기 위해 `environmentRecord`의 수집 과정을 추상화한 개념으로, 실행 컨텍스트가 관여하는 코드 집단의 최상단으로 이들을 끌어올린다라고 해석하는 것이다. 이때 변수 선언과 값 할당이 동시에 이뤄진 문장은 선언부만을 호이스팅하고, 할당 과정은 원래 자리에 남아있게 되는데, 여기서 함수 선언문과 함수 표현식의 차이가 발생한다.
- **스코프**는 변수의 유효범위를 말한다. `outerEnvironmentReference`는 해당 함수가 선언된 위치의 `LexicalEnvironment`를 참조한다. 코드 상에서 어떤 변수에 접근하려고 하면 현재 컨텍스트의 `LexicalEnvironment`를 탐색해서 발견되면 그 값을 반환하고, 발견되지 못할 경우 다시 `outerEnvironmentReference`에 담긴 `LexicalEnvironment`를 탐색하는 과정을 거친다. 만약 전역 컨텍스트의 `LexicalEnvironment`까지 탐색해도 해당 변수를 찾지 못하면 `undefined`를 반환한다.
- `this`는 실행 컨텍스트를 활성화하는 당시에 지정된 `this`가 저장되는데 함수를 호출하는 방법에 따라 그 값이 달라진다. 지정되지 않은 경우에는 전역 객체가 저장된다.