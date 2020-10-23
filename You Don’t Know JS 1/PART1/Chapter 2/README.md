## 🌈 Chapter 2 : 값

### 🎯 배열
- 자바스크립트 배열은 타입이 엄격한 다른 언어와 달리 **문자열, 숫자, 객체 심지어 다른 배열이나 어떤 타입의 값**이라도 담을 수 있는 그릇이다.

```javascript
var a = [1, "2", [3]];

a.length; // 3
a[0] === 1; // true
a[2][0] === 3; // true
```
- 배열 크기는 미리 정하지 않고도 선언할 수 있으며 원하는 값을 추가하면 된다.

```javascript
var a = [];

a.length; // 0
a[0] = 1;
a[1] = "2";
a[2] = [3];
a.length; // 3
```

- 빈 슬롯이 있는 배열을 다룰 떄는 조심해야 한다.

```javascript
var a = [];

a[0] = 1;
// a[1]이 빠짐
a[2] = [3];
a.length; // 3
```

- 실행은 되지만 이런 코드에서 중간에 건너뛴 빈 슬롯은 혼란을 줄 수 있다.
- 위 예제에서 `a[1]`슬롯 값은 `undefinded`가 될 거 같지만, 명시적으로 `a[1] = undefined` 세팅한 것과 똑같지는 않다.
- 배열 인덱스는 숫자인데, 배열 자체도 하나의 객체여서 키/프로퍼티 문자열을 추가할 수 있다. (**배열 `length`가 증가하지는 않는다.**)

```javascript
var a = [];
a[0] = 1;
a["foobar"] = 2;

a.length; // 1
a["foobar"] // 2
a.foobar; // 2
```

- 키로 넣은 문자열 값이 표준 10진수 숫자로 타입이 바뀌면, 마치 문자열 키가 아닌 숫자 키를 사용한 거 같은 결과가 초래된다.

```javascript
var a = [];

a["13"] = 42;
a.length; // 14
```

#### 📚 유사 배열
- 유사 배열 값(숫자 인덱스가 가리키는 값들의 집합)을 진짜 배열로 바꾸고 싶을 때가 있다.
- 이럴 때는 배열 유틸리티 함수(`indexOf()`, `forEach()`, `concat()` 등)를 사용하여 해결하는 것이 일반적이다.

```javascript
function foo() {
  // arguments 객체를 사용하는 것은 ES6부터 비 권장
  var arr = Array.prototype.slice.call(arguments);
  arr.push("bam");
  console.log(arr);
}

foo("bar", "baz"); // ["bar", "baz", "bam"]
```
- 위와 같은 변환은 `slice()` 함수의 기능을 차용하는 방법으로 가장 많이 사용한다.
- ES6 부터는 기본 내장 함수 `Array.from()`이 이 일을 대신한다.

```javascript
var arr = Array.from(arguments);
```

### 🎯 문자열
- 흔히 문자열은 단지 문자의 배열이라고 생각한다.
- 자바스크립트 문자열은 실제로 생김새만 비슷할 뿐 문자 배열과 같이 않다.

```javascript
var a = 'foo';
var b = ['f', 'o', 'o'];
```
- 문자열은 배열과 겉모습이 닮았다.(유사 배열이다.).
- 둘 다 `length` 프로퍼티, `indexOf()` 메서드(ES5 배열에만 있음), `concat()` 메서드를 가진다

```javascript
a.length; // 3
b.length; // 3

a.indexOf('o'); // 1
b.indexOf('o'); // 1

var c = a.concat('bar'); // foobar
var d = b.concat(['b', 'a', 'r']); // ['f', 'o', 'o', 'b', 'a', 'r']

a === c; // false
b === d; // false

a; // foo
b; // ['f', 'o', 'o']
```
- 그렇다면 기본적으로는 둘 다 '문자의 배열'이라고 할 수 있을까? 그렇지 않다.

```javascript
a[i] = '0';
b[i] = '0';

a; // foo
b; // ['f', 'O', 'o']
```
- 문자열은 불변 값(`Immutable`) 이지만 배열은 가변 값(`Mutable`) 이다.
- `a[1]` 처럼 문자열의 특정 문자를 접근하는 형태가 모든 자바스크립트 엔진에서 유효한 것은 아니다. (익스플로러 구버전은 문법 에러로 인식)
- 문자열은 불변 값이므로 **문자열 메서드는 그 내용을 바로 변경하지 않고 항상 새로운 문자열을 생성한 후 반환한다.**
- 반면에 대부분의 배열 메서드는 그 자리에서 곧바로 원소를 수정한다.

```javascript
c = a.toUpperCase();
a === c; //false
a; // foo
c; // FOO

b.push('!');
b; // ['f','O', 'o', '!']
```

- 문자열을 다룰 때 유용한 대부분의 배열 메서드는 사실상 문자열에 쓸 수 없지만, 문자열에 대해 불변 배열 메서드를 빌려 쓸 수는 있다.

```javascript
a.join; // undefined
a.map; // undefined

var c = Array.prototype.join.call(a, '-');
var d = Array.prototype.map.call(a, function(v) {
  return v.toUpperCase() + '.';
}).join('');

c; // "f-o-o"
d; // "F.O.O."
```

- 문자열의 순서로 거꾸로 뒤집을 수 있다.
- 배열에는 `reverse()` 라는 가변 메서드가 준비되어 있지만, 문자열은 그렇지 않다.

```javascript
a.reverse; // undefined

b.reverse(); // ["!", "o", "o", "f"]
b; // ["!", "o", "o", "f"]
```
- 문자열은 불변 값이라 바로 변경되지 않으므로 배열의 가변 메서드는 통하지 않고, 그래서 '빌려 쓰는 것' 또한 안 된다.

```javascript
Array.prototype.reverse.call(a);
// Cannot assign to read only property '0' of object '[object String]'
```

- 문자열을 배열로 바꾸고 원하는 작업을 수행한 후 다시 문자열로 되돌리는 것이 또 다른 꼼수(Hack)이다.
- 하지만 복잡한(유니코드)문자가 섞여 있는 경우 이 방법은 통하지 않는다.

```javascript
var c = a.split('').reverse().join('');
```

### 🎯 숫자
- **자바스크립트의 숫자 타입은 `number`가 유일**하며 정수(integer), 부동 소수점 숫자를 모두 아우른다.
- 따라서 자바스크립트의 정수는 **부동 소수점 값이 없는 값이다.**(42.0은 정수 42와 같다.)

#### 📚 숫자 구문
- 자바스크립트 숫자 리터럴은 다음과 같이 10진수 리터럴로 표시한다.
- 소수점 앞 정수가 0이면 생략 가능하다.
- 소수점 이하가 0일 때도 생략 가능하다.
```javascript
var a = 42;
var b = 42.3;

var a = 0.42;
var b = .42;

var a = 42.0;
var b = 42.;
```
- 아주 크거나 아주 작은 숫자는 지수형으로 표시하며, `toExponential()` 메서드의 결괏값과 같다.

```javascript
var a = 5E10;
a; // 50000000000
a.toExponential() // "5e+10"
```

- 숫자 값은 `Number` 객체 래퍼(Wrapper)로 박싱(Boxing)할 수 있기 때문에 `Number.prototype` 메서드로 접근할 수도 있다.

```javascript
var a = 42.59;

a.toFixed(0); // "43"
a.toFixed(1); // "42.6"
a.toFixed(2); // "42.59"
```
- 실제로는 숫자 값을 문자열 형태로 반환하며, 원래 값의 소수점 이하 숫자보다 더 많은 자릿수를 지정하면 그만큼 0이 우측에 붙는다.
- 소수점일 경우엔 프로퍼티 접근자가 아닌 숫자 리터럴의 일부로 해석되므로, 연산자를 사용할 떄는 조심해야 한다.

```javascript
42.toFixed(3); // Uncaught SyntaxError: Invalid or unexpected token

(42).toFixed(3); // "42.000"
0.42.toFixed(3); // "0.420"
42..toFixed(3); // "42.000"
```
- `42.toFixed(3);`가 구문 에러가 나는 이유는 `42.` 리터럴(맞는 표현)의 일부가 되어 버려 `.toFixed` 메서드에 접근할 수단이 없기 때문이다.
- 숫자 리터럴은 2진, 8진, 16진 등 다른 진번으로도 나타낼 수 있다.
- ES6+ 엄격 모드(strict mode)에서는 `0363`처럼 `0`을 앞에 붙여 8진수를 표시하지 못한다.

#### 📚 작은 소수 값
- 다음 예제는 이진 부동 소수점 숫자의 부작용 문제이다.
- 자바스크립트만의 문제가 아니라 IEEE 754 표준을 따르는 모든 언어에서 공통적인 문제이다.

```javascript
0.1 + 0.2 === 0.3 // false
```
- 이 문제는 이진 부동 소수점으로 나타낸 `0.1`과 `0.2`는 원래 숫자와 일치하지 않는다.
- 그래서 둘을 더한 결과 역시 정확한 0.3이 아니다. 실제로는 `0.300000000004`에 가깝지만, 가깝다고해도 같은 것은 아니다.
- 많은 애플리케이션이(대부분) 전체수(0과 양수를 포함한 숫자)만을, 그것도 기껏해야 백만이나 조 단위 규모의 숫자를 다룬다.
- 이런 상황이라면 안심하고 자바스크립트의 숫자 연산 기능을 믿고 써도 된다.
- 그렇다면 `0.1 + 0.2` 과 `0.3`, 두 숫자는 미세한 반올림 오차를 허용 공차로 처리하는 방법을 사용한다.
- 이렇게 미세한 오차를 **머신 입실론(컴퓨터가 이해할 수 있는 가장 작은 숫자 단위)** 이라고 하는데, 자바스크립트 숫자의 머신 입실론은 `2^-52^`이다.
- ES6부터는 이 값이 `Number.EPSILON`으로 미리 정의되어 있으므로 필요시 사용하면 되고, ES6 이전 브라우저는 폴리필을 대신 사용한다.

```javascript
if(!Number.EPSILON) {
  Number.EPSILON = Math.pow(2,-52);
}
```

- `Number.EPSILON`으로 두 숫자의 (반올림 허용 오차 이내의) 동등함을 비교할 수 있다.

```javascript
function numbersCloseEnoughToEqual(n1, n2) {
  return Math.abs(n1 - n2) < Number.EPSILON;
}

var a = 0.1 + 0.2;
var b = 0.3;

numbersCloseEnoughToEqual(a, b); // true
numbersCloseEnoughToEqual(0.00000001, 0.00000002); // false
```

#### 📚 정수인지 확인
- ES6부터는 `Number.isInteger()`로 어떤 값의 정수 여부를 확인한다.

```javascript
Number.isInteger(42); // true
Number.isInteger(42.000); // true
Number.isInteger(42.3); // false
```

- 안전한 정수 여부는 ES6부터 `Number.isSafeInteger()`로 체크한다.

```javascript
Number.isSafeInteger(Number.MAX_SAFE_INTEGER); // true
Number.isSafeInteger(Math.pow(2, 53)); // false
Number.isSafeInteger(Math.pow(2, 53) - 1); // true
```

#### 📚 32비트 (부호 있는) 정수
- 정수의 안전 범위가 대략 9조에 이르지만, 32비트 숫자에만 가능한 연산이 있으므로 실제 범위는 훨씬 줄어든다.
- 따라서 정수의 안전 범위는 `Math.pow(-2, 31)`에서 `Math.pow(2, 31) - 1` 까지이다.
- `a | 0` 과 같이 쓰면 숫자 값 ➡ 32 비트 부호 있는 정수로 강제변환을 한다.
- `|` 비트 연산자는 32비트 정수 값에만 쓸 수 있기 때문에 가능한 방법이다.