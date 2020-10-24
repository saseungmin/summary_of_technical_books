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

### 🎯 특수 값
#### 📚 값이 아닌 값
- `undefinded` 타입의 값은 `undefinded` 밖에 없다. `null` 타입도 값은 `null`뿐이다.
- 그래서 이 둘은 **타입과 값이 항상 같다.**
- `null`은 식별자가 아닌 특별한 키워드이므로 `null`이라은 변수에 뭔가 할당할 수는 없다.
- 그렇지만 `undefined`는 식별자로 쓸 수 있다.

#### 📚 Undefined
- 느슨한 모드에서는 전역 스코프에서 `undefined`란 식별자에 값을 할당할 수 있다.(절대 추천 X)

```javascript
function foo() {
  undefined = 2; // 좋지 못하다.
}

function foo() {
  "use strict";
  undefined = 2; // 타입 에러 발생
}
```

- 모드에 상관없이 `undefined`란 이름을 가진 지역 변수는 생성할 수 있다. (사용 X)

```javascript
function foo() {
  "use strict";
  var undefined = 2;
  console.log(undefined); // 2
}
```
- `undefined`는 내장 식별자로, 값은 `undefined`지만, 이 값은 `void` 연산자로도 얻을 수 있다.
- 표현식 `void __`는 어떤 값이든 무효로 만들어, 항상 결괏값을 `undefined`로 만든다. 기존 값은 건드리지 않고 연산 후 값은 복구할 수 없다.

```javascript
var a = 42;
console.log(void a, a); // undefined 42
```

- 관례에 따라 `void`만으로 `undefined` 값을 나타내려면 `void 0`이라고 쓴다. `void 0`, `void 1`, `undefined` 모두 같다.
- `void` 연산자는 값이 존재하는 곳에서 그 값이 `undefined`가 되어야 좋을 경우에만 사용해야 한다. (거의 사용하지 않는다.)

#### 📚 특수 숫자

- 숫자 연산 시 두 피연산자가 전부 숫자가 아닐 경우 유효환 숫자가 나올 수 없으므로 그 결과는 `NaN` 이다.
- `NaN`은 숫자 아님보다는 유효하지 않은(invalid) 숫자, 실패한 숫자, 또는 몹쓸 숫자라고 하는 것이 더 정확하다.

```javascript
var a = 2 / 'foo'; // NaN

typeof a === 'number'; // true
```

- `NaN`은 경계 값의 일종으로 숫자 집합 내에서 특별한 종류의 에러 상황을 나타낸다.
- 어떤 변수값이 특수한 실패 숫자, 즉 `NaN`인지 여부를 확인할 때 `null`, `undefined`처럼 `NaN`도 직접 비교하고 싶지만 틀리다.
- `NaN`은 **다른 어떤 `NaN`과도 동등하지 않다.**
- 사실상 반사성(Reflexive)이 없는 유일무이한 값이다.
- 따라서 `NaN !== NaN`이다.
- `NaN`을 여부를 확일 할 때는 내장 전역 유틸리티 `isNaN()` 함수가 `NaN` 여부를 말해준다.
- 하지만 `isNaN()`는 치명적인 결함이 있는데 이 함수는 `NaN`의 의미를 너무 글자 그대로만 해석해서 실제로 인자 값이 숫자인이 여부를 평가하는 기능이 전부이다.

```javascript
var a = 2 / 'foo';
var b = 'foo';

a; // NaN
b; // 'foo'

window.isNaN(a); // true
window.isNaN(b); // true
```
- `foo`는 당연히 숫자가 아니지만, 그렇다고 `NaN`는 아니다.
- 이 버그는 자바스크립트 탄생 이후 오늘까지 계속됐다.
- ES6 부터는 `Number.isNaN()`이 등장하여 `NaN`여부를 안전하게 체크할 수 있다.
- 자바스크립트에서는 0으로 나누기 연산이 잘 정의되어 있어서 에러 없이 `Infinity(Number.POSITIVE_INFINITY)`라는 결과값이 나온다.

```javascript
var a = 1 / 0; // Infinity
var b = -1 / 0; // Infinity
```

- IEEE 754 명세에 따르면, 덧셈 등의 연산 결과가 너무 커서 표현하기 곤란할 때 가장 가까운 수로 반올림 모드가 결괏값을 정한다.
- 만약 무한을 무한으로 나누면 무한대또는 1이 나올거 같지만 수학책, 자바스크립트 모두 **무한대/무한대는 정의되지 않은 연산이며, 결괏값은 NaN이다**
- 유한한 양수를 무한대로 나누면 `0`이지만 유한한 음수를 무한대로 나누면??
- 자바스크립트에는 `0`과 `-0`이 존재한다.
- 음의 영은 표기만 `-0`으로 하는 것이 아니라 특정 수식의 연산 결과 또한 `-0`으로 떨어진다.

```javascript
var a = 0 / -3; // -0
var b = 0 * -3; // -0
```
- 덧셈과 뺄셈에는 `-0`이 나올 수가 없다.
- 명세에 의하면 `-0`을 문자열화 하면 항상 `"0"`이다.
- 반대로하면 있는 그대로 보여준다.

```javascript
+"-0"; // -0
Number("-0"); // -0
JSON.parse("-0"); // -0
JSON.stringify(-0); // "0"
```

- 확실하게 `-0`과 `0`을 구분하고 싶다 다음과 같이 해준다.

```javascript
function isNegZero(n) {
  n = Number(n);
  return (n === 0) && (1 / n === -Infinity);
}

isNegZero(-0); // true
isNegZero(0 / -3); //true
isNegZero(0); // false
```
- 이렇게 `-0`을 만든 이유는 값의 크기로 어떤 정보(ex. 애니메이션 프레임당 넘김 속도)와 그 값의 부호로 또 다른 정보를 동시에 나타내야 하는 애플리케이션이 있기 때문이다.

#### 📚 특이한 동등 비교

- ES6부터는 `NaN`과 `0`, `-0`간의 동등 비교에 대한 잡다한 예외를 걱정하지 않아도 두 값이 절대적으로 동등한지를 확인하는 새로운 유틸리티를 지원하는데 `Object.is()`를 사용할 수 있다.

```javascript
var a = 2 / 'foo';
var b = -3 * 0;

Object.is(a, NaN); // true
Object.is(b, -0); // true
Object.is(b, 0); //false
```
- `==`나 `===`가 안전하다면 굳이 `Object.is()`는 사용하지 않는 편이 좋다.
- 기본 연산자가 좀 더 효울에 좋고 일반적이기 때문이다.
- `Object.is()`는 주로 특이한 동등 비교에 쓴다.