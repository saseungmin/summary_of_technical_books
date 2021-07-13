# 🌈 Chapter 4: 콜백 함수

## 📚 콜백 함수란?
- 콜백 함수(callback function)는 **다른 코드의 인자로 넘겨주는 함수**이다. 콜백 함수를 넘겨받은 코드는 이 콜백 함수를 필요에 따라 적절한 시점에 실행할 것이다.
- 콜백 함수는 다른 코드(함수 또는 메서드)에게 인자로 넘겨줌으로써 그 **제어권도 함께 워임한 함수**이다. 콜백 함수를 위임받은 코드는 **자체적인 내부 로직에 의해 이 콜백 함수를 적절한 시점**에 실행할 것이다.

## 📚 제어권

### 🎈 호출 시점
- 콜백 함수 예제 `setInterval`

```js
var count = 0;

var cbFunc = function () {
  console.log(count);
  it (++count > 4) {
    clearInterval(timer);
  }
};

var timer = setInterval(cbFunc, 300);
```

- 이 코드를 실행하면 0.3초에 한 번씩 숫자 0부터 1씩 증가하며 출력되다 4가 출력된 이후 종료된다.
- `setInterval`이라고 하는 **다른 코드**에 첫 번째 인자로써 `cbFunc` 함수를 넘겨주자 **제어권을 넘겨받은** `setInterval`이 **스스로의 판단에 따라 적절한 시점**에(0.3초마다) 익명 함수를 실행했다.
- 이처럼 콜백 함수의 제어권을 넘겨받은 코드는 콜백 함수 호출 시점에 대한 제어권을 가진다.

### 🎈 인자

```js
var newArr = [10, 20, 30].map(function (currentValue, index) {
  return currentValue + 5;
});

console.log(newArr); // [15, 25, 35]
```

- `map` 메서드에 정의된 규칙에는 콜백 함수의 인자로 넘어올 값들 및 그 순서도 포함돼 있다. **콜백 함수를 호출하는 주체**가 사용자가 아닌 `map` 메서드이므로 `map` 메서드가 콜백 함수를 호출할 때 인자에 어떤 값들을 어떤 순서로 넘길 것인지가 전적으로 `map` 메서드에게 달린 것이다.
- 이처럼 콜백 함수의 제어권을 넘겨받은 코드는 콜백 함수를 호출할 때 인자에 어떤 값들을 어떤 순서로 넘길 것인지에 대한 제어권을 가진다.

### 🎈 this
- 콜백 함수도 함수이기 때문에 기본적으로는 `this`가 전역객체를 참조하지만, 제어권을 넘겨받을 코드에서 콜백 함수에 별도로 `this`가 될 대상을 지정한 경우에는 그 대상을 참조하게 된다.

```js
// Array.prototype.map - 구현
Array.prototype.map = function (callback, thisArg) {
  var mappedArr = [];

  for (var i = 0; i < this.length; i++) {
    var mappedArr = callback.call(thisArg || window, this[i], i, this);
    mappedArr[i] = mappedValue;
  }

  return mappedArr;
};
```

- 메서드 구현의 핵심은 `call`/`apply` 메서드에 있다. `this`에는 `thisArg` 값이 있을 경우에는 그 값을, 없을 경우에는 전역객체를 지정하고, 첫 번째 인자에는 메서드의 `this`가 배열을 가리킬 것이므로 배열의 `i` 요소 값을, 두 번째 인자에는 `i` 값을, 세 번째 인자에는 배열 자체를 지정해 호출한다.
- 그 결과가 변수 `mappedValue`에 담겨 `mappedArr`의 `i`번재 인자에 할당된다. 
- 제어권을 넘겨받을 코드에서 `call`/`apply` 메서드의 첫 번째 인자에 콜백 함수 내부에서의 `this`가 될 대상을 **명시적으로 바인딩**하기 때문이다.

```js
// 콜백 함수 내부에서의 this
setTimeout(function () { console.log(this); }, 300); // Window {...}

[1, 2, 3, 4, 5].forEach(function (x) {
  console.log(this); // Window {...}
});

document.body.innerHTML += '<button id="a">클릭</button>';
document.body.querySelector('#a')
  .addEventListener('click', function (e) {
    console.log(this, e); // <button id="a">클릭</button> MouseEvent { isTrusted: true, ... }
  });
```

## 📚 콜백 함수는 함수다
- 콜백 함수로 어떤 객체의 메서드를 전달하더라도 그 메서드는 **메서드가 아닌 함수로**서 호출된다.

```js
// 메서드를 콜백 함수로 전달한 경우
var obj = {
  vals: [1, 2, 3],
  logValues: function (v, i) {
    console.log(this, v, i);
  }
};

obj.logValues(1, 2); // { vals: [1, 2, 3], logValues: f } 1 2
[4, 5, 6].forEach(obj.logValues); // Window { ... } 4 0 ...
```

- `forEach` 함수의 콜백 함수로서 전달한 것은 `obj`를 `this`로 하는 메서드를 그대로 전달한 것이 아니라, `obj.logValues`가 가리키는 함수만 전달한 것이다. 이 함수는 메서드로서 호출할 때가 아닌 한 `obj`와의 직접적인 연관이 없어진다. `forEach`에 의해 콜백 함수로서 호출되고, 별도로 `this`를 지정하는 인자를 지정하지 않았으므로 함수 내부에서의 `this`는 전역객체를 바라보게 된다.

## 📚 콜백 함수 내부의 this에 다른 값 바인딩하기
- `this`를 다른 변수에 담아 콜백 함수로 활용할 함수에서는 `this` 대신 그 변수를 사용하게 하고, 이를 클로저로 만들어 사용할 수 있다.

```js
// 콜백 함수 내부의 this에 다른 값을 바인딩하는 방법 - 전통적인 방식
var obj1 = {
  name: 'obj1',
  func: function () {
    var self = this; // 클로저
    return function () {
      console.log(self.name);
    };
  }
};

var callback = obj1.func();
setTimeout(callback, 1000);
// obj1
```

- 콜백 함수 내부에서 `this`를 사용하지 않는 경우

```js
var obj1 = {
  name: 'obj1',
  func: function() {
    console.log(obj1.name);
  }
};

setTimeout(obj1.func, 1000);
// obj1
```

- `this`를 사용하지 않았을 때는 간결하고 직관적이지만 이제는 작성한 함수를 `this`를 이용해 다양한 상황에 재활용할 수 없게 되었다.

```js
// this에 다른 값을 바인딩하는 방법을 재활용
var obj1 = {
  name: 'obj1',
  func: function () {
    var self = this; // 클로저
    return function () {
      console.log(self.name);
    };
  }
};

var obj2 = {
  name: 'obj2',
  func: obj1.func
};

var callback2 = obj2.func();
setTimeout(callback2, 1500);

var obj3 = { name: 'obj3' };
var callback3 = obj1.func.call(obj3);
setTimeout(callback3, 2000);
// obj2
// obj3
```

- 이 경우 `this`를 우회적으로나마 활용함으로써 다양한 상황에서 원하는 객체를 바라보는 콜백 함수를 만들 수 있다.
- 반면에 콜백 함수 내부에서 `this`를 사용하지 않는 경우는 명시적으로 `obj1`을 지정했기 때문에 어떤 방법으로도 다른 객체를 바라보게끔 할 수 없다. 또한 메모리를 낭비하는 측면이 있음에도 전통적인 방식이 널리 통용될 수밖에 없었던 측면도 있다.
- ES5에 등장한 `bind` 메서드를 이용하면 간단히 구현할 수 있다.

```js
var obj1 = {
  name: 'obj1',
  func: function() {
    console.log(this.name);
  }
};

setTimeout(obj1.func.bind(obj1), 1000);

var obj2 = { name: 'obj2' };
setTimeout(obj1.func.bind(obj2), 1500);
```

## 📚 콜백 지옥과 비동기 제어
- 콜백 지옥은 콜백 함수를 익명 함수로 전달하는 과정이 반복되어 코드의 들여쓰기 수준이 감당하기 힘들 정도로 깊어지는 현상으로 주로 이벤트 처리나 서버 통신과 같이 비동기적인 작업을 수행하기 위해 이런 형태가 자주 등장하는데, 가독성이 떨어질뿐더러 코드를 수정하기도 어렵다.
- 웹브라우저 자체가 아닌 별도의 대상에 무언가를 요청하고 그에 대한 응답이 왔을 때 비로소 어떤 함수를 실행하도록 대기하는 등, **별도의 요쳥, 실행 대기, 보류** 등과 관련된 코드는 비동기적 코드이다.

```js
// 콜백 지옥
setTimeout(function (name) {
  var coffeeList = name;
  console.log(coffeeList);

  setTimeout(function (name) {
    coffeeList += ', ' + name;
    console.log(coffeeList);

    setTimeout(function (name) {
      coffeeList += ', ' + name;
      console.log(coffeeList);

      setTimeout(function (name) {
        coffeeList += ', ' + name;
        console.log(coffeeList);
      }, 500, '카페라떼');
    }, 500, '카페모카');
  }, 500, '아메리카노');
}, 500, '에스프레소');
```

- 이 경우 들여쓰기 수준이 과도하게 깊어졌을뿐더러 값이 전달되는 순서가 아래서 위로 향하고 있어 어색하게 느껴진다.
- 이걸 해결하는데 가장 간단한 방법은 익명의 콜백 햄수를 모두 기명함수로 전환하는 것이다.

```js
var coffeeList = '';

var addEspresso = function (name) {
  coffeeList = name;
  console.log(coffeeList);
  setTimeout(addAmericano, 500 '아메리카노');
}

var addAmericano = function (name) {
  coffeeList += ', ' + name;
  console.log(coffeeList);
  setTimeout(addMocha, 500 '카페모카');
}

var addMocha = function (name) {
  coffeeList += ', ' + name;
  console.log(coffeeList);
  setTimeout(addLatte, 500 '카페라떼');
}

var addLatte = function (name) {
  coffeeList += ', ' + name;
  console.log(coffeeList);
}

setTimeout(addEspresso, 500, '에스프레소');
```

- 이 방식은 코드의 가독성을 높이고 함수 선언과 함수 호출만을 구분할 수 있다면 위에서부터 아래로 순서대로 읽어내려가는 데 어려움이 없다.
- 하지만, 일회성 함술ㄹ 전부 변수에 할당하는 것이 좋지 못하다.
- `Promise`를 사용하여 해결할 수 있다.

```js
new Promise(function (resolve) {
  setTimeout(function () {
    var name = '에스프레소';
    console.log(name);
    resolve(name);
  }, 500);
}).then(function (prevName) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      var name = prevName + ', 아메리카노';
      console.log(name);
      resolve(name);
    }, 500);
  })l
}).then(function (prevName) {
  // ... 
}).then(function (prevName) {
  // ... 
});
```

- 다음은 `Promise`를 다른방법으로 사용한 예이다.

```js
var addCoffee = function (name) {
  return function (prevName) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        var newName = prevName ? (prevName + ', ' + name) : name;
        console.log(newName);
        resolve(newName);
      }, 500);
    });
  };
};

addCoffee('에스프레소')()
  .then(addCoffee('아메리카노'))
  .then(addCoffee('카페모카'))
  .then(addCoffee('카페라떼'));
```

- 다음은 제너레이터를 사용한 방법이다.

```js
var addCoffee = function(prevName, name) {
  setTimeout(function () {
    coffeeMaker.next(prevName ? prevName + ', ' + name : name);
  }, 500);
};

var coffeeGenerator = function* () {
  var espresso = yield addCoffee('', '에스프레소');
  console.log(espresso);
  var americano = yield addCoffee(espresso, '아메리카노');
  console.log(americano);
  var mocha = yield addCoffee(americano, '카페모카');
  console.log(mocha);
  var latte = yield addCoffee(mocha, '카페라떼');
  console.log(latte);
};

var coffeeMaker = coffeeGenerator();
coffeeMaker.next();
```

- 다음은 `Promise`와 `Async/await`를 사용한 예제이다.

```js
var addCoffee = function (name) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(name);
    }, 500);
  });
};

var coffeeMaker = async function () {
  var coffeeList = '';
  var _addCoffee = async function (name) {
    coffeeList += (coffeeList ? ', ': '') + await addCoffee(name);
  };

  await _addCoffee('에스프레소');
  console.log(coffeeList);
  await _addCoffee('아메리카노');
  console.log(coffeeList);
  await _addCoffee('카페모카');
  console.log(coffeeList);
  await _addCoffee('카페라떼');
  console.log(coffeeList);
};

coffeeMaker();
```

## 📚 정리
- 콜백 함수는 다른 코드에 인자를 넘겨줌으로써 그 제어권도 함께 위임한 함수이다.
- 제어권을 넘겨받은 코드는 다음과 같은 제어권을 가진다.
  1. 콜백 함수를 호출하는 시점을 스스로 판단해서 실행한다.
  2. 콜백 함수를 호출할 때 인자로 념겨줄 값들 및 그 순서가 정해져 있다. 이 순서를 따르지 않고 코드를 작성하면 기대하는 값과 다른 결과를 얻게 된다.
  3. 콜백 함수의 `this`가 무엇을 바라보도록 할지가 정해져 있는 경우도 있다. 정하지 않은 경우에는 전역객체를 바라본다. 사용자 임의로 `this`를 바꾸고 싶을 경우 `bind` 메서드를 활용하면 된다.
- 어떤 함수에 인자로 메서드를 전달하더라도 이는 결국 함수로서 실행된다.
- 비동기 제어를 위해 콜백 함수를 사용하다 보면 콜백 지옥에 빠지기 쉽다. 이 문제를 해결할 방법으로 `Promise`, `Generator`, `async/await` 등 콜백 지옥으로 부터 벗어날 수 있다.
