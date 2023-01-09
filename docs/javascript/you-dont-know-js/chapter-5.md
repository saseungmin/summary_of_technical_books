---
sidebar_position: 6
---

# 🌈 Chapter 5 : 문법

<details>
<summary>Table of Contents</summary>

- 문과 표현식 [:link:](#-문과-표현식)
  - 문의 완료 값 [:link:](#-문의-완료-값)
  - 표현식의 부수 효과 [:link:](#-표현식의-부수-효과)
  - 콘텍스트 규칙 [:link:](#-콘텍스트-규칙)
- 연산자 우선순위 [:link:](#-연산자-우선순위)
  - 단락 평가 [:link:](#-단락-평가)
  - 끈끈한 우정 [:link:](#-끈끈한-우정)
  - 분명히 하자 [:link:](#-분명히-하자)
- 세미콜론 자동 삽입 [:link:](#-세미콜론-자동-삽입)
  - 에러 정정 [:link:](#-에러-정정)
- 에러 [:link:](#-에러)
  - 너무 이른 변수 사용 [:link:](#-너무-이른-변수-사용)
- 함수 인자 [:link:](#-함수-인자)
- try...finally [:link:](#-tryfinally)
- switch [:link:](#-switch)
- 정리하기 [:link:](#-정리하기)

</details>

## 🎯 문과 표현식
- 자바스크립트 문법에서 문(Statement)은 문장(Sentence), 표현식(Expression)은 어구(Phrase), 연산자는 구두점/접속사에 해당된다.
- 자바스크립트에서 모든 **표현식은 단일한, 특정한 결괏값으로 계산된다.**

```javascript
var a = 3 * 6;
var b = a;
b;
```
- 여기서 `3 * 6`은 표현식이다. 두 번째 줄 역시 표현식이며, 세 번째 줄 b도 표현식이다.
- 이 세 줄은 각각 표현식이 포함된 문이다.
- 첫 번째, 두 번째 두 문은 각각 **변수를 선언하므로 선언문(Declaration Statement)이라 한다.**
- 앞에 `var`이 빠진 `a = 3 * 6`, `b = a`는 **할당 표현식(Assignment Expression)이라고 한다.**
- 세 번째 줄은 b가 표현식의 전부이지만 이것만으로도 완전한 문이다. 일반적으로 이런 문을 **표현식 문(Expression Statement)이라고 일컫는다.**

### 📚 문의 완료 값
- 모든 문은 (그 값이 undefined라 해도) 완료 값을 가진다.
> - ES5.1. 문 도입부에 문의 평가 결과는 항상 완료 값이다.
> - 또한, 크롬의 콘솔 창에서 최근에 실행된 문의 완료 값을 기본적으로 출력하게 되어 있는점.
- `var b = a` 같은 문의 완료 값은?? 할당 표현식 `b = a`는 할당 이후의 값이 완료 값이지만, `var`문 자체의 완료 값은 `undefined`다. ([명세](http://www.ecma-international.org/ecma-262/5.1/#sec-12.2)에 적혀있음.)
- 그러나 콘솔 창이 내어준 완료 값은 개발자가 내부 프로그램에서 사용할 수 있는 값은 아니다. 완료 값을 순간 포착할 방법은??
- 그 전에 다른 종류의 문 완료 값을 보자.
- 예를 들어, 보통의 `{}` 블록은 내부의 가장 마지막 문/표현식의 완료 값을 자신의 완료 값으로 반환한다.

```javascript
var b;

if (true) {
  b = 4 + 38;
}
```

- 콘솔 창에서 실행하면 42가 나오는데 블록 내의 마지막 문 `b = 4 + 38`의 완료 값이 42 이므로 `if` 블록의 완료 값도 42를 반환한 것이다.
- 즉, 블록의 완료 값은 **내부에 있는 마지막 문의 값을 암시적으로 반환한 값이다.**
- 하지만 다음과 같은 코드가 작동하지 않는 건 분명히 문제가 있다.

```javascript
var a, b;
a = if(true) {
  b = 4 + 38;
}
// Uncaught SyntaxError: Unexpected token 'if'
```

- **문의 완료 값을 포착하여 다른 변수에 할당하는 건 쉬운 구문/문법으로는 불가능하다.**
- 완료 값을 포착하려면 어쩔 수 없이 유해함의 대명사 `eval()` 함수를 사용할 수밖에 없다.

```javascript
var a, b;
a = eval('if (true) { b = 4 + 38; }');
a; // 42
```
- ES7 명세에는 `do`표현식이 제안된 상태이다.

```javascript
var a, b;
a = do{
  if(true){
    b = 4 + 38;
  }
};
a; // 42가 나와야 하지만 나오지 않음 에러뜸..
```

- `do{ }` 표현식은 블록 실행 후 블록 내 마지막 문의 완료 값을 `do` 표현식 전체의 완료 값으로 반환하며 결국 이 값이 변수 a에 할당된다.
- `eval()`은 절대 사용하지 말자.

### 📚 표현식의 부수 효과
- 대부분의 표현식에는 부수 효과가 없다.

```javascript
var a = 2;
var b = a + 3;
```

- 표현식 `a + 3` 자체는 가령 a 값을 바꾸는 등의 부수 효과가 전혀 없다.
- 단지 `b = a + 3` 문에서 결괏값 5가 b에 할당될 뿐이다.
- 다음 함수 호출 표현식은 부수 효과를 가진 표현석의 전형적인 예다.

```javascript
function foo() {
  a = a + 1;
}

var a = 1;
foo(); // undefined.  a는 2로 변경
```
- 다른 부수 효과를 지닌 표현식.

```javascript
var a = 42;
var b = a++;

a; // 43
b; // 42
```

- `a++`이 하는 일은 두 가지다.
- a의 현재 값 42를 반환하고 a값을 1만큼 증가시킨다.
- `a++`를 ()로 감싸면 후위 부수 효과를 캡슐화할 수 있다고 착각할 수 있지만 `a++` 표현식에서 부수 효과 발생 이후 재평가된 새 표현식을 만들어내는 건 불가능하다.

```javascript
var a = 42;
var b = (a++);

a; // 43
b; // 42
```

- 문을 나열하는(Statement-Series) 콤마 연산자`,`를 사용하면 다수의 개발 표현식을 하나의 문으로 연결할 수 있다.

```javascript
var a = 42, b;
b = (a++, a);

a; // 43
b; // 43
```
- `a++`, `a` 표현식은 두 번째 a 표현식을 첫 번째 `a++` 표현식에서 부수 효과가 발생한 이후에 평가한다. 그래서 b의 앖은 43이다.
- `delete` 역시 부수 효과를 일으키는 연산자이다.

```javascript
var obj = {
  a: 42
};

obj.a; // 42
delete obj.a; // true
obj.a; // undefined
```

- 이 연산자의 부수 효과는 바로 프로퍼티를 제거하는 것이다.

```javascript
var a;

a = 42; // 42
a; // 42
```
- `a = 42`에서 `=` 연산자는 부수 효과와 무관해 보이지만 `a = 42` 문의 **실행 결과는 이제 막 할당된 값**이므로 42를 a에 할당하는 자체가 본질적으로 부수 효과이다.
- 이렇게 할당 표현식/문 실행 시 할당된 값이 완료 값이 되는 작동 원리는 다음과 같은 **연쇄 할당문(Chained Assignment)** 에서 특히 유용하다.

```javascript
var a, b, c;
a = b = c = 42;
```
- 위 예와 같은 경우 42를 c에 할당하는 부수 효과를 일으키며, 42를 b에 할당하는 부수 효과를 일으키고, 42를 a에 할당하는 부수 효과를 일으킨다.

```javascript
function vowels(str) {
  var matches;

  if(str){
    // 모든 모음을 추출한다.
    matches = str.match(/[aeiou]/g);

    if(matches){
      return matches;
    }
  }
}

vowels('Hello World'); // ['e', 'o', 'o']
```
- 할당 연산자의 부수 효과를 잘 활용하면 다음과 같이 2개의 `if`문을 하나로 간단히 합칠 수 있다.

```javascript
function vowels(str) {
  var matches;

  // 모든 모음을 추출한다.
  if(str && (matches = str.match(/[aeiou]/g))){
    return matches;
  }
}

vowels('Hello World'); // ['e', 'o', 'o']
```

### 📚 콘텍스트 규칙

#### 📌 중괄호
- 자바스크립트에서 중괄화 `{}`가 나올 법한 곳은 크게 두 군데이다.
1. **객체 리터럴**

```javascript
var a = {
  foo: bar()
};
```
- `{}`는 a에 할당될 값이므로 객체 리터럴이다.

2. **레이블**

```javascript
{
  foo: bar()
}
```
- `{}`는 어디에도 할당되지 않은, 고립된 객체 리터럴처럼 보이지만 그렇지 않다.
- 여기서의 `{}`는 평범한 코드 블록이다.
- `let` 블록 스코프 선언과 함께 쓰이면 아주 유용하다.
- `{}` 코드 블록은 `for/while` 루프, `if` 조건 등에 붙어있는 코드 블록과 기능적으로 매우 유사하다.
- 이것은 자바스크립트에서 **레이블 문(Labeled statement)** 이라 부르는, 거의 잘 알려지지 않은(권장 하지 않는다.) 기능 덕분이다.
- 즉, `foo`는 `bar()`문의 레이블이다.
- 자바스크립트에는 레이블 점프(Labeled Jump)라는 특별한 형태의 `goto`장치가 대신 마련되어 있다.
- `continue`와 `break` 문은 선택적으로 어떤 레이블을 받아 `goto`처럼 프로그램의 실행 흐름을 점프시킨다.

```javascript
foo: for(var i = 0; i < 4; i++) {
  for(var j = 0; j < 4; j++) {
    if(j == i) {
      // 다음 순회 시 foo 붙은 루프로 점프한다.
      continue foo;
    }

    if((j * i) % 2 == 1) {
      // 평범한, 안쪽 루프의 continue
      continue;
    }
    console.log(i, j);
  }
}

// 1 0
// 2 0
// 2 1
// 3 0
// 3 2
```

- `continue foo`는 `foo`라는 레이블 위치로 이동하여 계속 순회하라는 의미가 아니라 `foo`라는 **레이블이 붙은 루프의 다음 순회를 계속하라라는 뜻**이다. 따라서 사실 임의적인 `goto`와는 다르다.
- `break foo`는 `foo`라는 레이블 위치로 이동하여 계속 순회하라는 의미가 아니라, `foo`라는 **레이블이 붙은 바깥쪽 루프/블록 밖으로 나가 그 이후부터 계속하라는 뜻**이다.
- 레이블은 비 루프(Nonloop)블록에 적용할 수 있는다, 단 이런 비 루프 레이블은 `break`만 참조할 수 있다.
- 레이블 `break __`를 써서 레이블 블록 밖으로 나갈 수는 있지만, 비 루프 블록을 `continue __` 한다든가, 레이블이 없는 `break`로 블록을 빠져나가는 건 안 된다.

```javascript
function foo() {
  bar: {
    console.log('hello');
    break bar;
    console.log('실행 안 된다.');
  }
  console.log('world');
}
foo();
// hello
// world
```
- 레이블 루프/블록은 사용 빈도가 극히 드물고 못마땅한 구석도 많아 가능한 피하는게 좋다.
- 이를테면 루프 점프를 할 바에야 차라리 함수 호출이 더 낫다.

3. **블록**

```javascript
[] + {}; // "[object Object]"
{} + []; // 0
```
- 윗 줄에서 엔진은 `+` 연산자 표현식의 `{}`를 실제 값(빈 객체)으로 해석한다.
- **`[]`는  `""`로 강제변환되고 `{}`도 문자열 `"[object Object]"`로 강제변환된다.**
- 그러나 **아랫 줄의 `{}`는 동떨어진 빈 블록으로 간주한다.**
- 블록 끝을 꼭 세미콜론으로 끝나야 한다는 법은 없으므로 문제 될 건 없다.
- **결국  `+ []`표현식에서 명시적으로 `[]`를 숫자 0으로 강제변환한다.**

4. **객체 분해**
- ES6부터 분해 할당(Destructuring Assignments), 구체적으로는 객체 분해시 `{}`를 사용한다.

```javascript
function getData() {
  // ...
  return {
    a: 42,
    b: 'foo',
  };
}

var { a, b } = getData();
console.log(a, b); // 42 'foo'
```

- `{}`를 이용한 객체 분해는 명명된 함수에도 활용할 수 있는데, 이를테면 암시적인 객체 프로퍼티 할당과 비슷한 간편 구문이다.

```javascript
function foo({a, b, c}) {
  // 다음 코드처럼 할 필요가 없다.
  // var a = obj.a, b = obj.b, c = obj.c
  console.log(a, b, c);
}

foo({
  c: [1, 2, 3],
  a: 42,
  b: 'foo',
});
// 42 "foo" [1, 2, 3]
```

5. **else if와 선택적 블록**

```javascript
if (a) {
  // ...
}
else if (b) {
 // ...
}
else {
  // ...
}
```
- 실은 `else if` 같은 건 없다. 자바스크립트 문법의 숨겨진 특성이다.
- `if`와 `else`문의 실행문이 하나밖에 없는 경우 블록을 감싸는 `{}`를 생략해도 된다.

```javascript
if (a) doSomething(a);
```
- 여러 스타일 가이드 문서에는 단일 문 블록도 `{}`로 감싸라고 조언한다.

```javascript
if (a) { doSomething(a); }
```
- 그러나 정확히 동일한 문법 규칙이 `else` 절에도 적용되어 좀 전에 봤던 코드는 실제로는 항상 이렇게 파싱된다.

```javascript
if (a) {
 // ...
}
else {
  if (b) {
    // ...
  }
  else {
    // ...
  }
}
```
- 즉, `else if`라고 쓰는 건 표준 스타일 가이드의 위반 사례가 되며, 단일 `if` 문과 같이 `else`를 정의한 셈이 된다.
- 물론 `else if`는 이미 누구나 다 쓰는 관용 코드고, 한 단계  하위로 들여 쓰기를 하는 효과가 있어 나름 매력은 있다.

## 🎯 연산자 우선순위

```javascript
var a = 42;
var b = 'foo';
var c = [1, 2, 3];

a && b || c; // 결과는?
a || b && c; // 결과는?
```
- 두 표현식의 결과를 이해하려면 표현식에 연산자가 여러 개 있을 경우 어떤 규칙으로 처리되는지 알아야 한다.
- 바로 이 규칙을 연산자 우선순위(Operator precedence)라고 한다.

```javascript
var a = 42, b;
b = (a++, a);

a; // 43
b; // 43

var a = 42, b;
b = a++, a;

a; // 43
b; // 42
```
- b값이 바뀐 이유는 연산자가 `=` 연산자보다 우선순위가 낮기 때문이다.
- 그러므로 `b = a++, a`를 엔진은 `(b = a++), a`로 해석한다.
- 연산자로 **`,`를 사용할 때에는 이 연산자의 우선순위가 최하위**라는 사실 또한 반드시 알고 있어야 한다. 즉, 어떤 연산자라도 `,`보다 먼저 묶인다.

```javascript
if (str && (matches = str.match(/[aeiou]/g))) {
  // ...
}
```
- 할당문 양쪽을 `()`로 감싸야한다. `&&`가 `=` 보다 우선순위가 높으므로 `()`로 묶어주지 않으며 표현식은 **(str && matches) = str.match(/[aeiou]/g)** 로 처리된다.

```javascript
var a = 42;
var b = 'foo';
var c = false;

var d = a && b || c ? c || b ? a : c && b : a;
d; // 42
```
- 제일 앞의 `(a && b || c)`가 `(a && b) || c`와 `a && (b || c)` 중 어느 쪽으로 해석될까?

```javascript
(false && true) || true; // true
false && (true || true); // false

false && true || true; // true
(false && true) || true; // true
```

- **`&&` 연산자가 먼저 평가되고 `||` 연산자가 그 다음에 평가된다.**

```javascript
true || false && false; // true

(true || false) && false; // false
true || (false && false); // true
```

- [MDN 연산자 우선순위 참고](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/%EC%97%B0%EC%82%B0%EC%9E%90_%EC%9A%B0%EC%84%A0%EC%88%9C%EC%9C%84)

### 📚 단락 평가
- `&&`, `||` 연산자는 **좌측 피연산자의 평가 결과만으로 전체 결과가 이미 결정될 경우 우측 피연산자의 평가를 건너뛴다.**
- 그래서 단락(Short Circuited)이란 말이 유래된 것이다.

```javascript
function doSomething(opts) {
  if(opts && opts.cool) {
    // ...
  }
}
```

- `opts && opts.cool`에서 `opts`는 일종의 가드다.
- 만약, `opts`가 존재하지 않는다면 당연히 `opts.cool` 표현식은 에러일 수밖에 없다.
- 일단 `opts`를 먼저 단락 평가해보고, 그 결과가 실패면 `opts.cool`은 자동으로 건너뛰니 결과적으로 에러는 나지 않는다.
- `||` 단락 평가도 마찬가지다.

```javascript
function doSomething(opts) {
  if(opts.cache || primeCache()) {
    // ...
  }
}
```

- `opts.cache`를 먼저 체크해서 OK면, 굳이 `primeCache()` 함수는 호출하지 않고 넘어갈 수 있다.
- 그렇기 때문에 불필요한 작업이 줄어든다.

### 📚 끈끈한 우정
- 삼항 연산자 `? :`는 `&&`와 `||`보다 우선순위가 높을까 아니면 낮을까?

```javascript
a && b || c ? c || b ? a : c && b : a
```
- 즉, 다음 둘 중에서 어느 쪽으로 처리될까?

```javascript
a && b || (c ? c || (b ? a : c) && b : a)
(a && b || c) ? (c || b) ? a : (c && b) : a
```
- 정답은 아랫 줄이다.
- `&&`는 `||`보다, `||`는 `? :`보다 각각 우선순위가 높기 때문이다.
- 따라서 표현식 `(a && b || c)`가 `? :`부다 먼저 평가된다.

### 📚 결합성

- 연산자 우선순위 규칙에 의거하여 `&&`와 `||`는 `? :`보다 먼저 묶이는데 만약 우선순위가 동일한 다수의 연산자라면 처리 순서가 어떻게 될까?
- 일반적으로 연산자는 좌측부터 그룹핑(Grouping)이 일어나는지 우측부터 구릅핑이 일어나는지에 따라 **좌측 결합성(Left-Associative)** 또는 **우측 결합성(Right-Associative)** 을 가진다.
- 이것이 중요한 이유는 함수 호출과 같이 표현식이 부수 효과를 일으킬 수 있기 때문이다.

```javascript
var a = foo() && bar();
```

- `foo()` 함수를 먼저 호출한 뒤, 그 결과값에 따라 `bar()` 호출 여부를 결정한다.
- 만일 `bar()`가 `foo()` 앞에 있다면 전혀 다른 식으로 프로그램이 흘러갈 것이다.
- `foo()` 함수를 먼저 호출되는 건 단순히 좌측 ➡ 우측 순서로 처리(자바스크립트의 기본 처리 순서)되니 그런 것이지 `&&`의 결합성와는 무관한다.
- `&&` 연산자는 하나뿐이고 그룹핑은 없으므로 결합성이 끼어들 여지가 없다.
- 그러나 `a && b && c` 같은 표현식에서는 **암시적인 그룹핑이 발생**한다.
- `&&`는 좌측부터 결합하므로 `(a && b) && c`와 같다.
- 설사 우측부터 결합하여 `a && (b && c)`라도 결과가 같다.
- 따라서 정확항 정의를 따져 보자는 얘기가 아니라면, `&&`, `||`이 좌측 결합성 연산자라는 건 그다지 중요하지 않다.
- 하지만 모든 연산자가 다 그런 것은 아니다. 결합 방향이 좌/우측 어느 쪽인지에 따라 완전히 다르게 작동하는 연산자도 있다.
- 우선 `? :` 연산자가 그렇다.

```javascript
a ? b : c ? d : e;
```

- `? :`연산자는 **우측 결합성 연산자**이다.
- 그렇기 때문에 다음과 같이 그룹핑 된다.

```javascript
a ? b : (c ? d : e)
```
- 우측부터 결합하므로 결과가 달라지는데 이를테면 `(a ? b : c) ? d : e`는 다섯 개 값들의 조합에 따라 상이하게 작동한다.
- `=`도 우측 결합성 연산자 중 하나다.

```javascript
var a, b, c;
a = b = c = 42;
```

- `a = b = c = 42`는 우측부터 결합하기 때문에 실제로 엔진은 `a = (b = (c = 42))` 처럼 해석한다.

```javascript
var a = 42;
var b = 'foo';
var c = false;

var d = a && b || c ? c || b ? a : c && b : a;
```

- d는 다음과 같이 해석된다.

```javascript
((a && b) || c) ? ((c || b) ? a : (c && b)) : a
```

### 📚 분명히 하자
- 연산자 우선순위/결합석과 손으로 `()`를 감싸 주는 두 방법을 적절히 사용해야 한다.
- 예를 들어, `(a && b && c)`는 그 자체로 최선이므로 굳이 결합성을 고려하여 순서를 명시하고자 **((a && b) && c)** 처럼 쓰는 건 장환한 코드를 낳을 뿐이므로 그냥 놔둔다.
- 두 개의 `? :` 조건 연산자가 체이닝된 코드가 있다면, 주저 없이 `()`로 그룹핑하여 의도한 로직을 확실히 밝힌다.

## 🎯 세미콜론 자동 삽입
- ASI(Automatic Semicolon Insertion)는 자바스크립트 프로그램의 세미콜론이 누락된 곳에 엔진이 자동으로 `;`를 삽입하는 것을 말한다.
- 단 하나의 `;`이라도 누락되면 자바스크립트 프로그램은 돌아가지 않기 때문에 자바스크립트 코딩 시 `;`를 안 써도 될 것 같은 부분에 생략을 해도 프로그램이 실행되는 이유는 ASI 덕분이다.
- 단, ASI는 새 줄에만 적용되며 어떠한 경우에도 줄 중간에 삽입되는 일은 없다.
- 기본적으로 자바스크립트 파서는 줄 단위로 파싱을 하다가 에러가 나면 `;`을 넣어보고 타당한 거 같으면 `;`를 삽입한다.

```javascript
var a = 42, b
c;
```

- 이 경우 자바스크립트 엔진은 b 뒤에 암시적으로 `;`을 삽입한다. 따라서 `c;`는 독립적인 표현식 문이 된다.

```javascript
var a = 42, b = 'foo';
a
b // "foo"
```
- 표현식 문에도 ASI가 적용되므로 에러 없는 유효한 프로그램이다.

```javascript
var a = 42;
do {
  // ...
} while(a) // ; 빼먹었다!
a;
```
- 위 같은 경우에서도 ASI는 끼어들어 친절하게 `;`를 넣어준다.
- ASI는 주로 `break`, `continue`, `return`, `yield`에도 동일한 추론 로직이 사용된다.

### 📚 에러 정정

- 대부분의 세미콜론은 선택 사항이다.
- 명세에는 ASI가 에러 정정(Error Correction) 루틴이라고 씌여 있다.
- 에기서 에러는 구체적으로는 파서 에러다. 다른 말로 풀이하면 ASI가 파서를 너그럽게하여 에러를 줄이는 것이다.
- 파서 에러는 프로그램을 부정확하게/잘못 코딩했기 때문에 나는 것일 뿐, 그 외의 경우는 없다.
- 따라서 ASI가 꼼꼬히 파서 에러를 정정했음에도 발생한 파서 에러는 프로그램 작성자가 정말 잘못 짠 코드가 있다는 증거다.
- 하지만 ASI의 기능에 의존하는 것은 본질적으로 새 줄을 유효 공백 문자로 바라보는 것과 같다는 의견도 있다.
- 그렇기 때문에 **필요하다고 생각되는 곳이라면 어디든지 세미콜론을 사용하고, ASI가 어떻게든 뭔가 해줄 거라는 가정은 최소화하는게 좋다.**
> - 자바스크립트의 창시자인 브렌단 아이크는 이렇게 말했다.
> - **ASI는 구문 오류를 정정하는 프로시저다.**
> 만약 ASI를 보편적인, 유효 개행 문자 규칙쯤으로 여기고 코드를 작성한다면 곤경에 처하게 될 것이다.
> 내가 1995년 5월 열흘 간으로 되돌아갈 수만 있다면 강력한 유효 개행 문자를 만들 것이다. **ASI가 마치 유효 개행 문자를 넣어주는 것처럼 착각하지 않기를 바란다.**

## 🎯 에러
- 자바스크립트에는 하위 에러 타입(TypeError, ReferenceError, SyntaxError 등)뿐만 아니라, 일부 에러는 컴파일 시점에 발생하도록 문법적으로 정의도어 있다.
- 자바스크립트는 조기 에러(Early Error) 붙잡아 던지게 되어 있는, 한눈에 봐도 알 수 있는 구문 에러는 물론이고, 자바스크립트 문법에는 구문상 오류는 아니지만 허용되지 않는 것들도 정의되어 있다.
- 코드가 실행되기 전에 발생하므로 이런 에러는 `try...catch`로 잡을 수 없으며, 그냥 프로그램 파싱/컴파일이 실패한다.
- 다음 정규 표현식 리터럴 내부의 구문이 그런 예로 자바스크립트 구문상 아무 문제 없지만 올바르지 않은 정규 표현식은 조기 에러를 던진다.

```javascript
var a = /+foo/; // Uncaught SyntaxError: Invalid regular expression: /+foo/: Nothing to repeat
```

- 할당 대상은 반드시 식별자여야 하므로 다음 예제에서 42는 잘못된 위치에 있기 때문에 곧바로 에러가 난다.
  
```javascript
var a;
42 = a; // Uncaught SyntaxError: Invalid left-hand side in assignment
```

### 📚 너무 이른 변수 사용
- ES6는 임시 데드 존(TDZ, Temporal Dead Zone)이라는 새로운 개념을 도입했다.
- **TDZ는 아직 초기화를 하지 않아 변수를 참조할 수 없는 코드 영역이다.**
- ES6 `let` 블록 스코핑이 대표적인 예이다.

```javascript
{
  a = 2; // Uncaught ReferenceError: Cannot access 'a' before initialization
  let a;
}
```
- `let a` 선언에 의해 초기화되기 전 `a = 2` 할당문이 변수 a에 접근하려고 한다.
- 하지만 a는 아직 TDZ 내부에 있으므로 에러가 난다.
- 원래 `typeof` 연산자는 산언되지 않은 변수 앞에 붙여도 오류가 나지 않는데 TDZ 참조 시에는 이러한 안전장치가 없다.

```javascript
{
  typeof a; // undefined
  typeof b; // Uncaught ReferenceError: Cannot access 'b' before initialization
  let b;
}
```

## 🎯 함수 인자
- TDZ 관련 에러는 ES6 디폴트 인자 값에서도 찾아볼 수 있다.

```javascript
let b = 3;
function foo(a = 42, b = a + b + 5) {
  // ... 
}

// Uncaught SyntaxError: Identifier 'b' has already been declared
```
- 두 번째 할당문에서 좌변 b는 아직 TDZ에 남아 있는 b를 참조하려고 하기 때문에 에러를 던진다.
- 그러나 이 시점에서 인자 a는 TDZ를 밟고 간 이후여서 문제가 없다.
- ES6 디폴트 인자 값은 함수에 인자를 넘기기 않거나 `undefined`를 전달했을 때 적용된다.

```javascript
function foo(a = 42, b = a + 1) {
  console.log(a, b);
}

foo(); // 42 43
foo(undefined); // 42 43
foo(5); // 5 6
foo(void 0, 7); // 42 7
foo(null); // null 1
```

- ES6 디폴트 인자 입장에서 보면 인자 값이 없거나 `undefined` 갓을 받거나 그게 그거지만 차이점을 엿볼 수 있는 경우도 있다.

```javascript
function foo(a = 42, b = a + 1) {
  console.log(
    arguments.length, a, b,
    arguments[0], arguments[1],
  );
}

foo(); // 0 42 43 undefined undefined
foo(10); // 1 10 11 10 undefined
foo(10, undefined); // 2 10 11 10 undefined
foo(10, null); // 2 10 null 10 null
```

- `undefined` 인자를 명시적으로 넘기면 `arguments` 배열에도 값이 `undefined`인 원소가 추가되는데, 여기에 해당하는 디폴트 인자 값과 다르다.
- 이런 현상이 ES5에서도 똑같은 불일치는 교묘하게 발생한다.

```javascript
function foo(a) {
  a = 42;
  console.log(arguments[0]);
}

foo(2); // 42
foo(); // undefined
```

- 인자를 넘기면 `arguments`의 슬롯과 이나가 연결되면서 항상 같은 값이 할당되지만 인자 없이 호출하면 전혀 연결되지 않다.
- 더욱이 엄격 모드에서는 어떻게 해도 연결되지 않는다.

```javascript
function foo(a) {
  "use strict";
  a = 42;
  console.log(arguments[0]);
}

foo(2); // 2
foo(); // undefined
```

## 🎯 try...finally
- `finally` 절의 코드는 반드시 실행디고 다른 코드로 넘어가기 전에 `try` 이후부터 항상 실행된다.
- 어떤 의미에서 `finally` 절은 다른 블록 코드에 상관없이 필히 실행되어야 할 콜백 함수와 같다고 봐야 맞다.
- 그런데 만약 `try` 절에 `return`문이 있으면?

```javascript
function foo() {
  try {
    return 42;
  }
  finally {
    console.log('hello');
  }
  console.log('실행될 리 없지.');
}

console.log(foo());
// hello
// 42
```

- `return 42`에서 `foo()` 함수의 완료 값은 42로 세팅되고, `try` 절의 실행이 종료되면서 곧 바로 `finally` 절로 넘어간다.
- 그 후 `foo()` 함수 전체의 실행이 끝나고 완료 값은 호출부 `console.log()`문에 반환된다.
- `try`안에 `throw`가 있어도 비슷하다.

```javascript
function foo() {
  try {
    throw 42;
  }
  finally {
    console.log('hello');
  }
  console.log('실행될 리 없지.');
}

console.log(foo());
// hello
// Uncaught 42
```

- 만약 `finally` 절에서 예외가 던져지면, 이전의 실행 결과는 모두 무시한다. 즉, 이전에 `try` 블록에서 생성한 완료 값이 있어도 완전히 사라진다.

```javascript
function foo() {
  try {
    return 42;
  }
  finally {
    throw 'hello';
  }
  console.log('실행될 리 없지.');
}

console.log(foo());
// Uncaught hello
```

- `continue`나 `break` 같은 비선형 제어문 역시 `return`과 `throw`와 비슷하게 작동한다.

```javascript
for(var i = 0; i < 10; i++) {
  try {
    continue;
  }
  finally {
    console.log(i);
  }
}

// 0 1 2 3 4 5 6 7 8 9
```

- `finally` 절의 `return`은 그 이전에 실행된 `try`나 `catch` 절의 `return`을 덮어쓰는데 반드시 명시적으로 `return` 문을 써야 한다.

```javascript
function bar() {
  try {
    return 42;
  }
  finally {
    // return 42를 무시한다.
    return;
  }
}

function foo() {
  try {
    return 42;
  }
  finally {
    // return 42를 무시한다.
    return 'hello';
  }
}

function baz() {
  try {
    return 42;
  }
  finally {
    // return이 존재하지 않으면 이전 return을 존중한다.
  }
}
```

- 보통 함수에서는 `return`을 생략해도 `return;` 또는 `return undefined;` 한 것으로 치지만, `finally` 안에서 `return`을 빼면 이전의 `return`을 무시하지 않고 존중한다.

```javascript
function foo() {
  bar: {
    try {
      return 42;
    }
    finally {
      // bar 레이블 블록으로 나간다.
      break bar;
    }
  }
  console.log('이게 뭐야!');

  return 'hello';
}

console.log(foo());
// 이게 뭐야!
// hello
```

- 이런 코딩은 피하자.
- 사실상 `return`을 취소해버리는 `finally + 레이블 break` 코드는 그냥 골치 아픈 코드를 양산할 뿐이다.

## 🎯 switch

```javascript
switch(a) {
  case 2:
    // 뭔가 할테고
    break;
  case 42:
    // 다른 일을 할테고
    break;
  default:
    // 이무것도 안 걸리면 여기
}
```

- `switch` 표현식과 `case` 표현식 간의 매치 과정은 `===` 알고리즘과 똑같다.
- `case` 문에 확실한 값이 명시된 경우라면 엄격한 매치가 적절하다.
- 그러나 강제변환이 일어나는 동등비교를 이용하고 싶다면 `switch` 문에 꼼수?를 부려야 한다.

```javascript
var a = '42';
switch (true) {
  case a == 10:
    console.log('10 또는 "10"');
    break;
  case a == 42:
    console.log('42 또는 "42"');
    break;
  default:
    // 여기는 올리가 없어용
}

// '42 또는 "42"'
```
- `==`를 써도 `switch` 문은 엄격하게 매치한다. 그래서 `case` 표현식 평가 결과가 `truthy`이지만 엄격히 `true`는 아닐 경우 매치는 실패한다.
- 이를테면 표현식에 `&&`나 `||`같은 논리 연산자를 사용할 때 문제가 된다.

```javascript
var a = 'Hello World';
var b = 10;

switch (true) {
  case (a || b == 10):
    // 여기로 안오는데..
    break;
  default:
    console.log('오잉');
}

// 오잉
```

- `(a || b == 10)`의 평가 결과는 `true`가 아닌 `Hello World`이므로 매치가 되지 않는다.
- 이 때는 분명히 표현식의 결과가 `true/false`로 떨어지게 `case !!(a || b == 10) :`과 같이 작성해야 한다.
- `default` 절은 선택 사항이며 꼭 끝 부분에 쓸 필요는 없다.
- 그런데 `default`에서도 `break`를 안 써주면 코드가 계속 실행된다.

## 🎯 정리하기
- 문과 표현식은 영어 언어의 문장, 어구와 각각 유사하다. 포현식은 순수하고 독립적이지만 부수 효과를 일으킬 수 있다.
- 자바스크립트 문법에는 순수 구문 외에 의미론적인 **사용 규칙(코텍스트)가 내재**되어 있다. 예를 들어, 프로그램에서 자주 등장하는 `{}` 쌍은 문 블록, 객체 리터럴이 될 수 있고, 해체 할당이나 명명된 함수 인자로 쓸 수 있다.
- 자바스크립트 연산자는 그 **우선순위**와 **결합성**이 분명히 정해져 있다.
- ASI(자동 세미콜론 삽입)는 자바스크립트 엔진에 내장된 **파서 에러 감지 시스템으로 필요한 `;`이 코드에서 누락된 경우 파서 에러가 나면 자동으로 삽입해보고 코드 실행에 문제가 없도록 도와준다.**
- 자바스크립트 에러는 몇 가지 유형이 있지만 크게 **조기 에러(컴파일러가 던진 잡을 수 없는 에러)** 와 **런타임 에러(try..catch로 잡을 수 있는 에러)** 로 분류 된다.
- 함수 `arguments`와 명명된 인자의 관계는 흥미로운데 `arguments` 배열을 조심하지 앟으면 구멍 난 추상화에서 비롯된 갖가지 함정에 빠질 수 있다. **가급적 `arguments` 사용을 자제**하되 꼭 사용해야 할 경우 **`arguments`의 원소와 이에 대응하는 명명된 인자를 동시에 사용하지 말자.**
- `try`에 붙은 `finally` 절에는 실행 처리 순서 면에서 별난 점이 있는데 떄로는 이런 기벽이 도움이 되기는 하지만, **레이블 블록과 함께 사용하면 많은 혼란을 가중시킬 수 있다.**
- `switch`는 장황한 `if..else if...` 문을 대체하는 훌륭한 수단아지만, 단순하게만 생각했다간 예기치 않은 결과에 당황할 수 있다.
