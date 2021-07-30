---
sidebar_position: 7
---

# 🌈 Chapter 6: 프로토타입

- 자바스크립트는 프로토타입 기반 언어이다.
- 프로토타입 기반 언어에서는 어떤 객체를 원형(prototype)으로 삼고 이를 복제(참조)함으로써 상속과 같은 효과를 얻는다.

## 📚 프로토타입의 개념 이해

### 🎈 constructor, prototype, instance

```js
var instance = new Constructor();
```

1. 어떤 생성자 함수(Constructor)를 `new` 연산자와 함께 호출하면
2. `Constructor`에서 정의된 내용을 바탕으로 새로운 인스턴스가 생성된다.
3. 이때 `instance`에는 `__proto__`라는 프로퍼티가 자동으로 부여되는데,
4. 이 프로퍼티는 `Constructor`의 `prototype`이라는 프로퍼티를 참조한다.

여기서 `prototype`은 객체이다. 이를 참조하는 `__proto__` 역시 당연히 객체이다.   
`prototype` 객체 내부에는 인스턴스가 사용할 메서드를 저장한다. 그러면 인스턴스에서도 숨겨진 `__proto__`를 통해 이 메서드들에 접근할 수 있게 된다.   

- 다음 예에서 `Person`이라는 생성자 함수의 `prototype`에 `getName`이라는 메서드를 지정했다.

```js
var Person = function (name) {
  this._name = name;
};

Person.prototype.getName = function () {
  return this._name;
}

var suzi = new Person('Suzi');
suzi.__proto__.getName(); // undefined

Person.prototype === suzi.__proto__ // true
```

- 여기서 `suzi.__proto__.getName();` 호출하는 부분이 `Suzi`라는 이름이 아니라 `undefined`가 나온 이유는 `this`의 바인딩된 대상이 잘못 지정되었기 때문이다.
- 어떤 함수를 메서드로서 호출할 때는 메서드명 바로 앞의 객체가 곧 `this`가 된다. 그렇기 때문에 현재 `this`는 `suzi.__proto__`라는 객체가 되는 것이다. 이 객체 내부에는 `name` 프로퍼티가 없으므로 `undefined`를 반환하는 것이다.
- 해결하는 방법으로는  `__proto__` 없이 인스턴스에서 곧바로 메서드를 쓰면된다. 이러한 이유는 `__proto__`는 **생략 가능**한 프로퍼티이기 때문이다.

```js
var suzi = new Person('Suzi');
suzi.getName(); // Suzi
```

> 즉, `new` 연산자로 `Constructor`를 호출하면 `instance`가 만들어지는데, 이 `instance`의 생략 가능한 프로퍼티인 `__proto__`는 `Constructor`의 `prototype`을 참조한다.

- `__proto__` 프로퍼티는 생략 가능하도록 구현돼 있기 때문에 **생성자 함수의 `prototype`에 어떤 메서드나 프로퍼티가 있다면 인스턴스에서도 마치 자신의 것처럼 해당 메서드나 프로퍼티에 접근할 수 있게 된다.**

### 🎈 constructor 프로퍼티
- 생성자 함수의 프로퍼티인 `prototype` 객체 내부에는 `constructor`라는 프로퍼티가 있다. 인스턴스의 `__proto__` 객체 내부에도 마찬가지이다.
- 이 프로퍼티는 단어 그대로 원래의 생성자 함수(자기 자신)를 참조한다. 인스턴스로부터 그 원형이 무엇인지를 알 수 있는 수단이다.

```js
var arr = [1, 2];

Array.prototype.constructor === Array; // true
arr.__proto__.constructor === Array; // true
arr.constructor === Array; // true

var arr2 = new arr.constructor(3, 4);
console.log(arr2); // [3, 4];
```

- `constructor`를 변경하더라도 참조하는 대상이 변경될 뿐 이미 만들어진 인스턴스의 원형이 바뀐다거나 데이터 타입이 변하는 것은 아니다. 어떤 인스턴스의 생성자 정보를 알아내기 위해 `constructor` 프로퍼티에 의존하는 게 항상 안전하지 않다.
- 다음 각 줄은 모두 동일한 대상을 가리키게 된다

```js
[Constructor]
[instance].__proto__.constructor
[instance].constructor
Object.getPrototypeOf([instance]).constructor
[Constructor].prototype.constructor
```

- 다음 각 줄은 모두 동일한 객체(prototype)에 접근할 수 있다.

```js
[Constructor].prototype
[instance].__proto__
[instance]
Object.getPrototypeOf([instance])
```

## 📚 프로토타입 체인

### 🎈 메서드 오버라이드
- 인스턴스가 동일한 이름의 프로퍼티 또는 메서드를 가지고 있다.

```js
// 메서드 오버라이드
var Person = function (name) {
  this.name = name;
};

Person.prototype.getName = function () {
  return this.name;
};

var iu = new Person('지금');
iu.getName = function () {
  return '바로 ' + this.name;
};
console.log(iu.getName()); // 바로 지금
```

- 자바스크립트 엔진이 `getName`이라는 메서드를 찾는 방식은 가장 가까운 대상인 자신의 프로퍼티를 검색하고, 없으면 그다음으로 가까운 대상인 `__proto__`를 검색하는 순서로 진행된다.
- 다음은 메서드 오버라이딩이 이뤄져 있는 상황에서 `prototype`에 있는 메서드에 접근하는 방법이다.
- `this`가 `prototype`을 바라보고 있는데 이걸 인스턴스를 바라보도록 `call`이나 `apply`로 바꿔주면 된다.

```js
console.log(iu.__proto__.getName()); // undefined
console.log(iu.__proto__.getName.call(iu)); // 지금
```

### 🎈 프로토타입 체인
- 배열 리터럴의 `__proto__`에는 `pop`, `push`등의 익숙한 배열 메서드 및 `constructor`가 있다.
- 추가로, 이 `__proto__`안에 또다시 `__proto__`가 등장하는데, 이유는 바로 `prototype` 객체가 **객체**이기 때문이다. 기본적으로 모든 객체의 `__proto__`에는 `Object.prototype`이 연결된다. `prototype` 객체도 예외가 아니다.
- 그렇기 때문에 배열에서 생략 가능한 `__proto__`를 한 번 더 따라가면 `Object.prototype`을 참조할 수 있다.

```js
var arr = [1, 2];
arr(.__proto__).push(3);
arr(.__proto__.__proto__).hasOwnProperty(2); // true
```

- 어떤 데이터의 `__proto__` 프로퍼티 내부에 다시 `__proto__` 프로퍼티가 **연쇄적으로 이어진 것을 프로토타입 체인**이라 하고, 이 **체인을 따라가며 검색하는 것은 프로토타입 체이닝**이라고 한다.
- 프로토타입 체인닝은 메서드 오버라이드랑 동일한 맥락인데, 어떤 메서드를 호출하면 자바스크립트 엔진은 데이터 자신의 프로퍼티들을 검색해서 원하는 메서드가 있으면 그 메서드를 실행하고, 없으면 `__proto__`를 검색해서 있으면 그 메서드를 실행하고, 없으면 다시 `__proto__`를 검색해서 실행하는 식으로 진행된다.

```js
// 메서드 오버라이드와 프로토타입 체이닝
var arr = [1, 2];
Array.prototype.toString.call(arr); // 1, 2
Object.prototype.toString.call(arr); // [object Array]
arr.toString(); // 1, 2

arr.toString = function () {
  return this.join('-');
}

arr.toString(); // 1-2
```

### 🎈 객체 전용 메서드의 예외사항
- 어떤 생성자 함수이든 `prototype`은 반드시 객체이기 때문에 `Object.prototype`이 언제나 프로토타입 체인의 최상단에 존재하기 된다. 따라서 **객체에서만 사용할 메서드는 다른 여느 데이터 타입처럼 프로토타입 객체 안에 정의할 수가 없다.** 그 이유는 다른 데이터 타입도 해당 메서드를 사용할 수 있게 되기 때문이다.

```js
// Object.prototype에 추가한 메서드에의 접근
Object.prototype.getEntries = function () {
  var res = [];
  for (var prop in this) {
    if (this.hasOwnProperty(prop)) {
      res.push([prop, this[prop]]);
    }
  }
  return res;
};

var data = [
  ['object', { a: 1, b: 2, c: 3 }], // [['a', 1], ['b', 2], ['c', 3]]
  ['number', 345],                  // []
  ['string', 'abc'],                // [['0','a'], ['1', 'b'], ['2', 'c']]
  ['boolean', false],               // []
  ['func', function () {}],         // []
  ['array', [1, 2, 3]],             // [['0', 1], ['1', 2], ['2', 3]]
];

data.forEach(function (datum) {
  console.log(datum[1].getEntries());
});
```

- 위와 같은 경우 모든 데이터가 오류 없이 결과를 반환하고 있다. 원래 의도대로라면 객체가 아닌 다른 데이터 타입에 대해서는 오류를 던지게끔 돼야 할 텐데, **어느 데이터 타입이건 무조건 프로토타입 체이닝을 통해 `getEntries` 메서드에 접근할 수 있으니** 그렇게 동작하지 않는 것이다.
- 이 같은 이유로 객체만을 대상으로 동작하는 객체 전용 메서드들은 부득이 `Object.prototype`이 아닌 `Object` 스태틱 메서드로 부여할 수밖에 없었다. 또한, 생성자 함수인 `Object`와 인스턴스인 객체 리터럴 사이에는 `this`를 통한 연결이 불가능하기 때문에 여느 전용 메서드처럼 메서드명 앞의 대상이 곧 `this`가 되는 방식 대신 `this`의 사용을 포기하고 대상 인스턴스를 인자로 직접 주입해야 하는 방식으로 구현돼 있다.
- 만약 객체 전용 메서드에 대해서도 다른 데이터 타입과 마찬가지의 규칙을 적용할 수 있었다면, 예를 들어 `Object.freeze()`처럼 표현할 수 있었을 것이다. 즉, `instance.__proto__`에 `freeze`라는 메서드가 있었을 것이다.
- 그러한 이유로 객체 한정 메서드들을 `Object.prototype`이 아닌 `Object`에 직접 부여할 수밖에 없었던 이유는 **`Object.prototype`이 여타의 참조형 데이터뿐 아니라 기본형 데이터조차 `__proto__`에 반복 접근함으로써 도달할 수 있는 최상위 존재이기 때문이다.**
- 반대로 같은 이유에서 `Object.prototype`에는 어떤 데이터에서도 활용할 수 있는 범용적인 메서드들만 있다. (`toString`, `hasOwnProperty`, `valueOf`, `isPrototypeOf`)

### 🎈 다중 프로토타입 체인
- 자바스크립트 기본 내장 데이터 타입들은 모두 프로토타입 체인이 1단계(객체)이거나 2단계로 끝나는 경우만 있었지만 사용자가 새롭게 만드는 경우에는 그 이상도 얼마든지 가능하다. 대각선의 `__proto__`를 연결해나가기만 하면 무한대로 체인 관계를 이어나갈 수 있다.
- 대각선의 `__proto__`를 연결하는 방법은 `__proto__`가 가리키는 대상, 즉 생성자 함수의 `prototype`이 연결하고자 하는 상위 생성자 함수의 인스턴스를 바라보게끔 해주면 된다.

```js
var Grade = function () {
  var args = Array.prototype.slice.call(arguments);

  for (var i = 0; i < args.length; i++) {
    this[i] = args[i];
  }

  this.length = args.length;
};

var g = new Grade(100, 80);
```

- 여러 개의 인자를 받아 각각 순서대로 인텍싱해서 저장하고 length 프로퍼티가 존재하는 등으로
- 배열의 형태를 지니지만, 배열의 메서드를 사용할 수 없는 유사배열객체이다.
- 인스턴스에서 배열 메서드를 직접 쓸 수 있게끔 하려면 `g.__proto__`, 즉 `Grade.prototype`이 배열 인스턴스를 바라보게 하면 된다.

```js
Grade.prototype = [];
```

- 이 명령에 의해 서로 별개로 분리돼 있던 데이터가 연결되어 하나의 프로토타입 체인 형태를 띠게 된다.
- 이제는 `Grade`의 인스턴스인 `g`에서 직접 배열의 메서드를 사용할 수 있다.

```js
console.log(g); // Grade(2) [100, 80]
g.pop();
console.log(g); // Grade(1) [100]
g.push(90);
console.log(g); // Grade(2) [100, 90]
```

- `g` 인스턴스의 입장에서는 프로토타입 체인에 따라 `g` 객체 자신이 지니는 멤버, `Grade`의 `prototype`에 있는 멤버, `Array.prototype`에 있는 멤버, 끝으로 `Object.prototype`에 있ㄴㄴ 멤버에까지 접근할 수 있게 됐다.

## 📚 정리
- 어떤 생성자 함수를 `new` 연산자와 함꼐 호출하면 `Constructor`에서 정의된 내용을 바탕으로 새로운 인스턴스가 생성된다. 이 인스턴스에는 `__proto__`라는, `Constructor`의 `prototype` 프로퍼티를 참조하는 프로퍼티가 자동으로 부여된다.
- `__proto__`는 생략 가능한 속성이라서, 인스턴스는 `Constructor.prototype`의 메서드를 마치 자신의 메서드인 것처럼 호출할 수 있다.
- `Constructor.prototype`에는 `constructor`라는 프로퍼티가 있는데, 이는 다시 생성자 함수 자신을 가리킨다. 이 프로퍼티는 인스턴스가 자신의 생성자 함수가 무엇인지를 알고자 할 때 필요한 수단이다.
- `__proto__` 방향을 계속 찾아가면 최종적으로는 `Object.prototype`에 당도하게 된다. 이런 식으로 `__proto__` 안에 다시 `__proto__`를 찾아가는 과정을 **프로토타입 체이닝**이라고 하며, 이 프로토타입 체이닝을 통해 각 프로토타입 메서드를 자신의 것처럼 호출할 수 있다. 이때 접근 방식은 자신으로부터 가장 가까운 대상부터 점차 먼 대상으로 나아가며, 원하는 값을 찾으면 검색을 중단한다.
- `Object.prototype`에는 모든 데이터 타입에서 사용할 수 있는 범용적인 메서드만이 존재하며, 객체 전용 메서드는 여느 데이터 타입과 달리 `Object` 생성자 함수에 스태틱하게 담겨있다.
