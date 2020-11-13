# 🌈 Chapter 5 : 문법

<details>
<summary>Table of Contents</summary>

- 문과 표현식 [:link:](#-문과-표현식)
  - 문의 완료 값 [:link:](#-문의-완료-값)
  - 표현식의 부수 효과 [:link:](#-표현식의-부수-효과)


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