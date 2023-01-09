---
sidebar_position: 4
---

# 🌈 Chapter 3 : 네이티브

<details><summary>Table of Contents</summary>

- 내부 `[[Class]]` [:link:](#-내부-class)
- 래퍼 박싱하기 [:link:](#-래퍼-박싱하기)
  - 문자열 [:link:](#-객체-래퍼의-함정)
- 언박싱 [:link:](#-언박싱)
- 네이티브, 나는 생성자다. [:link:](#-네이티브-나는-생성자다)
  - Array() [:link:](#-array)
  - Object(), Function(), and RegExp() [:link:](#-object-function-and-regexp)
  - Date() and Error() [:link:](#-date-and-error)
  - Symbol() [:link:](#-symbol)
  - 네이티브 프로토타입 [:link:](#-네이티브-프로토타입)
- 정리하기 [:link:](#-정리하기)

</details>

- 가장 많이 사용하는 네이티브들
> `String`, `Number`, `Boolean`, `Array`, `Object`, `Function`, `RegExp`, `Date`, `Error`, `Symbol`
- 네이티브는 내장 함수이다.

```javascript
var a = new String('abc');
typeof a; // object
a instanceof String; // true
Object.prototype.toString.call(a); // "[object String]"
```

- `new String('abc')` 생성자의 결과는 원시 값 `abc`를 감싼 **객체 레퍼**이다.
- `typeof` 연산자로 이 객체의 타입을 확인해보면 자신이 감싼 원시 값의 타입이 아닌 `object`의 하위 타입에 가깝다.

```javascript
console.log(a); // String {"abc"}
```

- `new String('abc')`은 `abc`를 감싸는 문자열 래퍼를 생성하며 원시 값 `abc`는 아니다.

## 🎯 내부 `[[Class]]`

- `typeof`가 `object`인 값에는 `[[Class]]`라는 내부 프로퍼티가 추가로 붙는다.
- 이 프로퍼티는 **직접 접근할 수 없고** `Object.prototype.toString()`라는 메서드에 값을 넣어 호출함으로써 존재를 엿볼 수 있다.

```javascript
Object.prototype.toString.call([1, 2, 3]); // "[object Array]"

Object.prototype.toString.call(/regex-literal/i); // "[object RegExp]"
```

- 내부 `[[Class]]` 값이, 배열은 `Array` 정규식은 `RegExp`이다.
- 대부분 내부 `[[Class]]`는 해당 값과 관련된 내장 네이티브 생성자를 가리키지만, 그렇지 않은 경우도 존재한다.

```javascript
Object.prototype.toString.call(null); // "[object Null]"
Object.prototype.toString.call(undefined); // "[object Undefined]"
```

- 위와 같이 `Null()`, `Undefined()` 같은 네이티브 생성자는 없지만 내부 `[[Class]]` 값은 `Null`, `Undefined` 이다.
- 하지만 그 밖의 문자열, 숫자, 불리언 같은 단순 원시 값은 **박싱(Boxing)** 과정을 거친다.

```javascript
Object.prototype.toString.call('abc'); // "[object String]"
Object.prototype.toString.call(42);  // "[object Number]"
Object.prototype.toString.call(true); // "[object Boolean]"
```

- 내부 `[[Class]]` 값이 각각 `String`, `Number`, `Boolean`으로 표시된 것으로 보아 **단순 원시 값은 해당 객체 레퍼로 자동 박싱**됨을 알 수 있다.


## 🎯 래퍼 박싱하기
- 원시 값엔 프로퍼티나 메서드가 없으므로 `.length`, `.toString()`으로 접근하려면 원시 값을 객체 래퍼로 감싸줘야 한다.
- 자바스크립트는 **원시 값을 알아서 박싱(래핑)** 하므로 다음과 같은 코드가 가능하다.

```javascript
var a = 'abc';

a.length; // 3
a.toUpperCase(); // 'ABC'
```

- 따라서 루프 조건 `i < a.length` 처럼 빈번하게 문자열 값의 프로퍼티/메서드를 사용해야 한다면 자바스크립트 엔진이 암시적으로 객체를 생성할 필요가 없도록 처음부터 값을 객체로 갖고 있는 것이 이치에 맞는 것처럼 보이지만, 좋은 생각이 아니다.
- 개발자가 직접 객체 형태로(최적화되지 않은 방향으로) 선 최적화(pre-Optimize)하면 프로그램이 더 느려질 수 있다.
- 직접 객체 형태로 써야 할 이유는 거의 없고, 필요시 엔진이 알아서 암시적으로 박싱하게 하는 것이 낫다.

### 📚 객체 래퍼의 함정
- 다음 예제는 `Boolean`으로 래핑한 값이 있다.

```javascript
var a = new Boolean(false);

if(!a) {
  console.log('Oops'); // 실행 X
}
```

- `false`를 객체 래퍼로 감쌌지만 문제는 **객체가 `truthy`란 점이다.**
- 그래서 예상과 달리, 안에 들어있는 `false`값과 반대의 결과이다.
- **수동으로 원시 값을 박싱하려면 `Object()` 함수를 이용한다.**

```javascript
var a = 'abc';
var b = new String(a);
var c = Object(a);

typeof a; // "string"
typeof b; // "object"
typeof c; // "object"

b instanceof String; // true
c instanceof String; // true

Object.prototype.toString.call(b); // "[object String]"
Object.prototype.toString.call(c); // "[object String]"
```

- 하지만 **객체 레퍼로 직접 박싱하는 건 권하지 않는다.**

## 🎯 언박싱

- 객체 래퍼의 원시 값은 `valueOf()` 메서드로 추출한다.

```javascript
var a = new String('abc');
var b = new Number(42);
var c = new Boolean(true);

a.valueOf(); // 'abc'
b.valueOf(); // 42
c.valueOf(); // true
```

- 이때도 암시적인 언박싱이 일어난다. (자세한 사항 강제변환은 4장에서)

```javascript
var a = new String('abc');
var b = a + ''; // 'b'에는 언박싱된 원시 값 'abc'이 대입된다.

typeof a; // "object"
typeof b; // "string"
```

## 🎯 네이티브, 나는 생성자다.
- 배열, 객체, 함수, 정규식 값은 리터럴 형태로 생성하는 것이 일반적이지만, **리터럴은 생성자 형식으로 만든 것과 동일한 종류의 객체를 생성한다.**
- 필요해서 쓰는 게 아니라면 **생성자는 가급적 쓰지 않는 편이 좋다.**

#### 📚 Array()

```javascript
var a = new Array(1, 2, 3);
a; // [1, 2, 3]

var b = [1, 2, 3];
b; // [1, 2, 3]
```

> `Array()` 생성자 앞에 `new`를 붙이지 않아도 된다. 붙이지 않아도 붙인 것처럼 작동한다. 즉, `Array(1, 2, 3)`와 `new Array(1, 2, 3)` 와 같다.

- `Array` 생성자는 인자로 숫자를 하나만 받으면 그 숫자를 원소로하는 배열을 생성하는 게 아니라 배열의 크기를 미리 정하는 기능이다.
- 하지만 **배열의 크기를 미리 정한다는 것 자체가 밀이 안 된다.**
- 그렇게 하려면 빈 배열을 만들고 나중에 `length` 프로퍼티에 숫자 값을 할당하는 게 맞다.

> 빈 슬롯을 한 군데 이상 가진 배얼을 구멍 난 배열(Sparse Array)라고 한다.

```javascript
var a = new Array(3);
var b = [undefined, undefined, undefined];
var c = [];
c.length = 3;

a; // [empty × 3]
b; // [undefined, undefined, undefined]
c; // [empty × 3]
```

- 브라우저 개발자 콘솔 창 마다 객체를 나타내는 방식이 제각각이라 혼란이 가중된다.
- `a`와 `b`가 어떨 때는 같은 값처럼 보이다가도 그렇지 않을 때도 있다.

```javascript
a.join('-'); // "--"
b.join('-'); // "--"

a.map(function(v, i){return i;}); // [empty × 3]
b.map(function(v, i){return i;}); // [0, 1, 2]
```

- `a.map()`은 `a`에 슬롯이 없기 때문에 `map()` 함수가 순회할 원소가 없다.
- `join()`은 구현 로직이 다음과 같기 때문에 다르다.

```javascript
function fakeJoin(arr, connector) {
  var str = '';
  for(var i = 0; i < arr.length; i++) {
    if(i > 0) {
      str += connector;
    }
    if(arr[i] !== undefined) {
      str += arr[i];
    }
  }
  return str;
}

var a = new Array(3);
fakeJoin(a, '-'); // "--"
```

- `join()`은 슬롯이 있다는 가정하에 `length`만큼 루프를 반복한다.
- `map()` 함수는 빈 슬롯 배열이 입력되면 예기치 않은 결과가 빚어지거나 실패의 원인이 된다.
- 진짜 `undefined` 값 원소로 채워진 배열은 어떻게 생성할까?

```javascript
var a = Array.apply(null, { length: 3 });
a; // [undefined, undefined, undefined]
```

- `apply()`는 모든 함수에서 사용 가능한 유틸리티이다.
- 첫 번째 인자 `this`는 객체 바인딩으로, `null`로 세팅했다.
- 두 번째 인자는 인자의 배열(또는 배열 비슷한 유사 배열)로, 이 안에 **포함된 원소들이 펼쳐져(Spread) 함수의 인자로 전달된다.**
- 따라서 `Array.apply()`는 `Array()` 함수를 호출하는 동시에 `{ length: 3 }` 객체 값을 펼처 인자로 넣는다.
- `apply()` 내부에서는 아마 `0`에서 `length` 직전까지 루프를 순회할 것이다.
- 인덱스별로 객체에서 키를 가져온다. (`arr[0], arr[1], arr[2]`)
- 물론 이 세 프로퍼티도 모두 `{ length: 3 }` 객체에는 존재하지 않기 때문에 모두 `undefined`를 반환한다.
- 즉, `Array()`를 호출하면 `Array(undefined, undefined, undefined)`처럼 되어, 빈 슬롯이 아닌, `undefined`로 채워진 배열이 탄생한다.
- **절대로 빈 슬롯 배열을 애써 만들어서 사용하지 말자.**

### 📚 Object(), Function(), and RegExp()

- 일반적으로 `Object()`, `Function()`, `RegExp()` 생성자도 선택 사항이다.(분명한 의도가 아니면 사용하지 않는 편이 좋다).

```javascript
var c = new Object();
c.foo = 'bar';
c; // { foo: 'bar' }

var d = { foo: 'bar' };
d; // { foo: 'bar' }

var e = new Function('a', 'return a * 2;');
var f = function(a) { return a * 2; }
function g(a) { return a * 2; }

var h = new RegExp('^a*b+', 'g');
var i = /^a*b+/g;
```

- `new Object()` 같은 생성자 폼은 사실상 사용할 일이 없다.
- `Function` 생성자는 함수의 인자나 내용을 동적으로 정의해야 하는, 매우 드문 경우에 한해 유용하다.
- 정규 표현식은 리터럴 형식으로 정의할 것을 적극 권장한다. 구문이 쉽고 무엇보다 성능상 이점이 있다.
- `RegExp()`는 정규 표현식 패턴을 동적으로 정의할 경우 의미 있는 유틸리티다.

```javascript
var name = 'kyle';
var namePattern = new RegExp('\\b(?:' + name + ')+\\b', 'ig');

var matches = someText.match(namePattern);
```

### 📚 Date() and Error()
- 네이티브 생성자 `Date()`와 `Error()`는 리터럴 형식이 없으므로 다른 네이티브에 비해 유용하다.
- `date` 객체 값은 `new Date()`로 생성한다.
- ES5에 정의된 정적 도우미 함수(Helper Function), `Date.now()`를 사용하는 게 더 쉽다. (`getTime()` 보다)
- `Error()` 생성자는 앞에 `new`가 있든 없든 결과는 같다.
- `error` 객체의 주 용도는 현재의 실행 스택 콘텍스트(Execution Stack Context)를 포착하여 객체에 담든 것이다.
- 이 실행 스택 콘텍스트는 **함수 호출 스택, `error` 객체가 만들어진 줄 번호 등 디버깅에 도움이 될 만한 정보들을 담고 있다.**
- `error` 객체는 보통 `throw` 연산자와 함께 사용한다.

```javascript
function foo(x) {
  if(!x) {
    throw new Error('error..');
  }
  // ...
}
```

### 📚 Symbol()
- ES6에서 처음 선보인, 새로운 원시 값 타입이다.
- 심벌은 **충돌 염려 없이 객체 프로퍼티로 사용 가능한, 특별한 유일 값이다.**(절대적으로 유일함이 보장되지는 않는다.)
- 심벌은 프로퍼티명으로 사용할 수 있으나, 프로그램 코드나 개발자 콘솔 창에서 심벌의 실제 값을 보거나 접근하는 건 불가능하다.
- ES6에는 `Symbol.create`, `Symbol.iterator` 식으로 `Symbol` 함수 객체의 정적 프로퍼티로 접근한다.

```javascript
obj[Symbol.iterator] = function() { /* ... */ };
```

- 심벌을 직접 정의하려면 `Symbol()` 네이티브를 사용한다.
- **`Symbol()`은 앞에 `new`를 붙이면 에러**가 나는, 유일한 네이티브 생성자다.

```javascript
var mysym = Symbol('my symbol');
mysym; // Symbol(my symbol)
mysym.toString(); // "Symbol(my symbol)"
typeof mysym; // "symbol"

var a = { };
a[mysym] = 'foobar';
Object.getOwnPropertySymbols(a); // [Symbol(my symbol)]
```

- 심벌은 전용(Private) 프로퍼티는 아니지만, 본래의 사용 목적에 맞게 대부분 전용 혹은 특별한 프로퍼티로 사용한다.
- 심벌은 객체가 아니다. 단순한 스칼라 원시 값이다.

### 📚 네이티브 프로토타입
- 내장 네티이브 생성자는 각자의 `.prototype` 객체를 가진다.(`Array.prototype`..)
> `prototype` 객체에는 해당 객체의 하위 타입별로 고유한 로직이 담겨 있다.
- 문자열 원시 값을 확장한 것까지 포함하여 모든 `String` 객체는 기본적으로 `String.prototype` 객체에 정의된 메서드에 접근할 수 있다.

```javascript
String.prototype.indexOf() // 문자열에서 특정 문자의 위치를 검색
String.prototype.charAt() // 문자열에서 특정 위치의 문자를 반환
String.prototype.substr(), substring(), slice() // 문자열 일부를 새로운 문자열로 추출
String.prototype.toUpperCase(), toLowerCase() // 대소문자 변환된 문자열 생성
String.prototype.trim() // 앞/뒤 공란잉 제거된 새로운 문자열 생성
```
- 이 중 문자열 값을 변경하는 메서드는 없다.
- 수정이 일어나면 늘 **기존 값으로부터 새로운 값을 생성한다.**
- **프로토타입 위임(Prototype Delegation)** 덕분에 모든 문자열이 이 메서드들을 가이 쓸 수 있다.

```javascript
var a = ' abc ';

a.indexOf('c'); // 3
a.toUpperCase(); // ' ABC ';
a.trim(); // 'abc'
```

- 모든 네이티브 프로토타입이 평범한 것은 아니다.

```javascript
typeof Function.prototype; // 'function'
Function.prototype(); // 빈 함수

RegExp.prototype.toString(); // "/(?:)/" - 빈 regex
```

- 네이티브 프로토타입을 변경할 수도 있지만 바람직하지 못하다.

```javascript
Array.isArray(Array.prototype); // true
Array.prototype.push(1, 2, 3); // 3
Array.prototype; // [1, 2, 3]

// 이런 식으로 놔두면 이상하게 작동할 수 있다.
Array.prototype.length = 0;
```

- **프로토타입은 디폴트다**
- 변수에 적절한 값이 할당되지 않은 상태에서 `Function.prototype` -> 빈 함수, `RegExp.prototype` -> 빈 정규식, `Array.prototype` -> 빈 배열은 모두 디폴드 값이다.
- 프로토타입으로 디폴드 값을 세팅하면 추가적인 이점이 있다.
- `.prototype`들은 이미 생성되어 내장된 상태이므로 단 한 번만 생성된다.
- 어떤 식으로도 **프로토타입을 변경하지 않도록 유의해야 한다.**

## 🎯 정리하기
- 자바스크립트는 원시 값을 감싸는 객체 레퍼, 즉 네이티브를 제공한다. (`String`, `Number`)
- 객체 레퍼에는 타입별로 쓸 만한 기능이 구현되어 있어 편리하게 사용할 수 있다. (ex. `trim()`, `concat()`)
- `abc`같은 단순 스칼라 원시 값이 있을 때, 이 값의 `length` 프로퍼티나 `String.prototype`에 정의된 메서드를 호출하면 자바스크립트는 자동으로 원시 값을 박싱(해당되는 객체 레퍼로 감싼다.)하여 필요한 프로퍼티와 메서드를 쓸 수 있게 도와준다.
