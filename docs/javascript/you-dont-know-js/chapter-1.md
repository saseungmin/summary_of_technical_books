---
sidebar_position: 2
---

# 🌈 Chapter 1 : 타입

<details><summary>Table of Contents</summary>

- 타입, 그 실체를 이해하자. [:link:](#-타입-그-실체를-이해하자)
- 내장 타입 [:link:](#-내장-타입)
- 값은 타입을 가진다 [:link:](#-값은-타입을-가진다)
  - 값이 없는 vs 선언되지 않은 [:link:](#-값이-없는-vs-선언되지-않은)
  - 선언되지 않은 변수 [:link:](#-선언되지-않은-변수)
- 정리하기 [:link:](#-정리하기)

</details>

- [ESMA 표준 명세서 5.1](https://www.ecma-international.org/ecma-262/5.1/)를 확인해보자.
  - 이 명세에 수록된 알고리즘에서 사용되는 모든 값은 이 절에서 정의한 타입 목록중 하나에 해당한다.
  - 타입은 ECMAScript **언어 타입**과 **명세 타입**으로 하위 분류된다.
  - ECMAScript 개발자가 ECMAScript 언어를 이용하여 직접 조작하는 값들의 타입이 바로 ECMAScript 언어 타입이다.
  - ECMAScript 언어 타입에는 `Undefined`, `null`, `Boolean`, `String`, `Number`, `Object`가 있다.

## 🎯 타입, 그 실체를 이해하자.
- 타입별로 내재된 특성을 제대로 알고 있어야 값을 다른 타입으로 변환하는 방법을 정확히 이해할 수 있다.
- 어떤 형태로든 거의 모든 자바스크립트 프로그램에서 **강제변환(coercion)이 일어나므로 타입을 확실하게 인지하고 사용하는 것이 좋다.**
> `42`를 문자열로 보고 위치 1에서 `"2"`라는 문자를 추출하려면, 먼저 숫자 `42` -> 문자열 `"42"`로 변경(강제변환)해야 한다.

## 🎯 내장 타입
- 자바스크립트에는 다음 7가지 내장 타입이 있다.
  
```
null, undefined, boolean, number, string, object, symbol(ES6부터 추가)
```
- `object`를 제외한 이들은 **원시 타입(Primitives)** 이다.
- 값 타입은 typeof 연산자로 알 수 있다.
- 하지만 typeof 반환 값은 항상 7가지 내장 타입 중 하나는 아니다.
- 7가지 내장 타입과 1:1로 정확히는 매치되지 않는다.

```javascript
typeof undefined === 'undefined'; // true
typeof true === 'boolean'; // true
typeof 42 === 'number'; // true
typeof "42" === 'string' // true
typeof { life: 42 } === 'object'; // true

// ES6부터 추가
typeof Symbol() === 'symbol'; // true
```
- 예제의 6개 타입은 자신의 명칭과 동일한 문자열을 반환한다.
- `null`에 대한 `typeof` 연산 결과는 꼭 버그처럼 보인다.

```javascript
typeof null === 'object'; // true
typeof null === 'null'; // false
```
- 버그처럼 보이지만 이게 정답. (거의 20년 동안 이 버그는 이제 와서 손을 대자니 다른 버그가 생겨 잘 돌아가던 웹 소프트웨어가 멈춰버릴 경우가 많아서 앞으로도 해결될 가능성은 없다.)
- 그래서 타입으로 `null` 값을 정확히 확인하려면 조건이 하나 더 필요하다.

```javascript
const a = null;
(!a && typeof a === 'object'); // true
```
- `null`은 falsy한 유일한 원시 값이지만, 타입은 `object`인 특별한 존재이다.
- 또한 `typeof`가 반환하는 문자열은 하나 더 존재한다.

```javascript
typeof function a(){ /* ... */ } === "function"; // true
typeof function a(){ /* ... */ } === "object"; // false
```
- `typeof` 반환 값을 보면 마치 `function`이 최상위 레벨의 내장 타입처럼 보이지만 명세를 읽어보면 **실제로는 `object`의 '하위 타입'이다.**
- 구체적으로 함수는 '**호출 가능한 객체(Callable Object)**'라고 명시되어 있다.
- 그렇기 때문에 함수는 객체라서 유용하다. 무엇보다 **함수에 프로퍼티를 둘 수 있다.**

```javascript
function a(b, c) {
  /* ... */
}
```
- 함수에 선언된 인자 개수는 함수 객체의 `length` 프로퍼티로 알 수 있다.

```javascript
a.length; // 2
```

- 함수 a는 인자 두 개(b, c)를 가지므로 '함수의 길이'는 2다.
- **배열도 그냥 객체이다.**

```javascript
typeof [1, 2, 3] === 'object'; // true
```
- 배열은 숫자 인덱스를 가지며, `length` 프로퍼티가 자동으로 관리되는 등의 추가 특성을 지닌, 객체의 '하위 타입'이라 할 수 있따.

## 🎯 값은 타입을 가진다.
- 값에는 타입이 있지만, **변수엔 따로 타입이란 없다.**
- 변수는 언제라도, **어떤 형태의 값이라도 가질 수 있다.**
- 자바스크립트는 **타입 강제(Type Enforcement)** 를 하지 않는다.
- 변숫값에 처음에 할당된 값과 동일한 타입일 필요는 없다. (문자열을 넣었따가 나중에 숫자를 넣어도 상관없다.)

```javascript
var a = 42;
typeof a; // "number"
a = true;
typeof a; // "boolean"
```
- `typeof` 연산자의 반환 값은 **언제나 문자열이다.**

```javascript
typeof typeof 42; // "string"
```
- 따라서 `typeof 42`는 `"number"`를 반환하고, `typeof "number"`의 결과값은 `"string"`이다.

### 📚 값이 없는 vs 선언되지 않은
- 값이 없는 변수의 값은 `undefinded`이며, `typeof` 결과는 `"undefined"`다.

```javascript
var a; 
typeof a; // "undefined"

var b = 42;
var c;

b = c;

typeof b; // "undefined"
typeof c; // "undefined"
```
- `undefined`와 `undeclared`를 동의어처럼 생각하기 쉽지만, 자바스크립트에서 둘은 완전히 다른 개념이다.
- `undefined`는 **접근 가능한 스코프에 변수가 선언되었으나 현재 아무런 값도 할당되지 않은 상태를 가리킨다.**
- `undeclared`는 **접근 가능한 스코프에 변수 자체가 선언조차 되지 않은 상태이다.**

```javascript
var a;

a; // "undefined"
b; // Uncaught ReferenceError: b is not defined
```
- 여기서 `b is not defined` 에러 메시지가 `undefined`이라고 생각할 수 있지만, `is not defined`와 `undefined`는 **의미가 완전히 다르다.**
- 선언되지 않은(undefined) 변수의 `typeof` 연산 결과는 더 헷갈린다.

```javascript
var a;

typeof a; // "undefined"
typeof b; // "undefined"
```
- 선언되지 않은 `typeof`하면 `"undefined"`로 나온다. `b`는 분명 선언조차 하지 않은 변수인데 `typeof b`를 해도 브라우저는 오류 처리를 하지 않는다.
- 바로 이것이 `typeof`만의 독특한 **안전 가드(safety guard)** 이다.


### 📚 선언되지 않은 변수
- 브라우저에서 자바스크립트 코드를 처리할 때, 특히 여러 스크립트 파일의 변수들이 전역 네임스페이스를 공유할 때, `typeof`의 안전 가드는 쓸모가 있다.

```javascript
// debug.js
var DEBUG = true;

// 다른 파일
// 에러 발생
if(DEBUG) {
  console.log('디버깅 시작');
}

// 아래와 같이 안전하게 존재 여부 체크 가능 (전역 변수 체크)
if(typeof DEBUG !== 'undefined') {
  console.log('디버그 시작');
}
```

- `typeof` 안전 가드 없이 전역 변수를 체크하는 다른 방법은 전역 변수가 모두 전역 객체(브라우저는 window)의 프로퍼티라는 점을 이용한다는 점이다.
- 그래서 다음과 같이 체크할 수 있다.

```javascript
if(window.DEBUG) {
  // ...
}
if (window.atob) {
  // ...
}
```
- 선언되지 않은 변수 때와 달리 어떤 객체의 프로퍼티를 접근할 때 그 프로퍼티가 존재하지 않아도 `ReferenceError`가 나지는 않는다.
- 하지만 window 객체를 통한 전역 변수 참조는 가급적 삼가는 것이 좋다.
- 엄밀히 말해서 `typeof` 안전 가드는 전역 변수를 사용하지 않을 때에도 유용한데, 일부 개발자들은 이런 설계 방식이 그다지 바람직하지 않다고 말한다.
- 예를 들어 다른 개발자가 작성한 유틸리티 함수를 자신의 모듈/프로그램에 카피 앤 페이스트하여 사용하는데, 가져다 쓰는 프로그램에 유틸리티의 특정 변숫값이 정의되어 있는지 체크해야 하는 상황을 가졍해보자.

```javascript
function doSomethingCool() {
  var helper = 
    (typeof FeatureXYZ !== 'undefinded') ?
    FeatureXYZ : 
    function() { /*... 기본 XYZ 기능 */}
  
  var val = helper();
  // ...
}
```
- `doSomethingCool` 함수는 `FeatureXYZ` 변수가 존재하면 그대로 사용하고 없으면 함수 바디를 정의하는데, 이렇게 해야 다른 사람이 카피 앤 페이스틀 해도 안전하게 `FeatureXYZ`가 존재하는지를 체크할 수 있다.

```javascript
(function() {
  function FeatureXYZ() { /* 유틸 XYZ 기능 */}

  function doSomethingCool() {
    var helper = 
      (typeof FeatureXYZ !== 'undefinded') ?
      FeatureXYZ : 
      function() { /*... 기본 XYZ 기능 */}
    
    var val = helper();
    // ...
  }

  doSomethingCool();
})();
```
- `FeatureXYZ`는 전역 변수가 아니지만, `typeof` 안전 가드를 이용하여 안전하게 체크하고 있다.
- 또한, **의존성 주입(Dependency Injection)** 설계 패턴으로 `FeatureXYZ`가 `doSomethingCool` 함수의 바깥이나 언저리에 정의되었는지 암시적으로 조사하는 대신, 다음 코드처럼 명시적으로 의존 관계를 전달할 수 있다.

```javascript
function doSomethingCool(FeatureXYZ) {
  var helper = 
    (typeof FeatureXYZ !== 'undefinded') ?
    FeatureXYZ : 
    function() { /*... 기본 XYZ 기능 */}
  
  var val = helper();
  // ...
}
```

## 🎯 정리하기
- 자바스크립트에는 7가지 내장 타입(`null`, `undefined`, `boolean`, `number`, `string`, `object`, `symbol`)이 있으며, `typeof` 연산자로 타입명을 알아낸다.
- 변수는 타입이 없지만 값은 타입이 있고, 타입은 값의 내재된 특성을 정의한다.
- 자바스크립트에서 `undefined`와 `undeclared`는 전혀 다르게 취급하는데 `undefined`는 선언된 변수에 할당할 수 있는 값이지만, `undeclared`는 변수 자체가 선언된 적이 없음을 나타낸다.
- 불행히도 자바스크립트를 두 용어를 대충 섞어버려, 에러 메시지 뿐만 아니라 `typeof` 반환 값도 모두 `undefined`로 뭉뚱그린다.
- 그래도 `typeof` 안전 가드 덕분에 선언되지 않은 변수에 사용하면 쓸만해진다.
