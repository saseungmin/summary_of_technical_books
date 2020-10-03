## 🌈 Chapter 5 : 반복문을 단순하게 만들어라.

### 🎯 화살표 함수로 반복문을 단순하게 만들어라.
- 대부분의 반복문은 [콜백 함수(callback function)](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function)에 의존한다.
- [화살표 함수(arrow function)](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Functions/%EC%95%A0%EB%A1%9C%EC%9A%B0_%ED%8E%91%EC%85%98)는 함수가 장황해지는 문제를 해결해서 함수 작성을 간결하고 짧게 만들어준다.
- 화살표 함수는 필요하지 않은 정보를 최대한 걷어낸다.
  - `function` 키워드
  - 인수를 감싸는 괄호
  - `return` 키워드
  - 중괄호

- 아래는 간단한 함수이다. 이 함수는 [**기명 함수**](https://ko.javascript.info/function-object#ref-153)이다. 또한, [함수 선언(function declaration)](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/function)이다.
```javascript
function capitalize(name) {
  return name[0].toUpperCase() + name.slice(1);
}
```

- 변수에 할당한 [함수 표현식(function expression)](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/function)은 아래와 같다.

```javascript
const capitalize = function(name) {
  return name[0].toUpperCase() + name.slice(1);
}
```

- 여기서 `function` 키워드를 제거하고 화살표로 대체할 수 있다. 또한, 매개변수가 하나뿐이라면 괄호도 제거할 수 있다.

```javascript
const capitalize = name => {
  return name[0].toUpperCase() + name.slice(1);
}
```

- 매개변수가 두 개 이상이면 괄호를 사용해야 한다.

```javascript
const greet = (first, last) => {
  return `안녕하세요! ${capitalize(first)} ${capitalize(last)}님`;
}
```

- 함수를 한 줄로만 작성하는 경우에는 `return` 키워드도 사용할 필요가 없다. 즉, **함수 몸체의 실행 결과를 자동으로 반환한다.**

```javascript
const formatUser = name => `${capitalize(name)}님이 로그인했습니다.`;
```

- 화살표 함수를 변수에 할당하지 않고 익명 함수로 사용할 수도 있다.
- 자바스크립트에서 함수를 다른 함수에 인수로 전달할 수 있다. (예로 콜백 함수를 인수로 받는 함수)

```javascript
function applyCustomGreeting(name, callback) {
  return callback(capitalize(name));
}
```
- 원본 함수를 호출할 때 익명 함수를 생성한 방법
- 함수 `applyCustomGreeting`를 호출하면서 익명 함수를 작성해 전달.

```javascript
applyCustomGreeting('mark', function(name) {
  return `안녕, ${name}!`;
});
// "안녕, Mark!"
```

- 위 코드의 익명 함수를 화살표 함수로 변경할 수 있다.

```javascript
applyCustomGreeting('mark', name => `안녕, ${name}!`);
// "안녕, Mark!"
```

### 🎯 배열 메서드로 반복문을 짧게 작성하라.
- `for`문과 `for...of` 문도 좋지만 적게 사용하는 것이 좋다.
- `for`문과 `for...of` 문은 불필요할 정도로 어수선하기 때문이다.
- 그렇기 때문에 배열 메서드를 사용하여 반복문을 한 줄로 줄일 수 있다.
- 아래의 코드는 `for`문을 사용하였다.

```javascript
const prices = ['1.0', 'little prince', '2.15'];

const formattedPrices = [];
for(let i = 0; i < prices.length; i++) {
  const price = parseFloat(prices[i]);
  if(price){
    formattedPrices.push(price);
  }
}
// [1, 2.15]
```
- 위 코드는 단순하지 못하고, 가독성 또한 코드가 늘어날수록 떨어질 것이다.
- 그렇다고 예측가능한 코드도 아니다. 코드에서 생성한 빈 배열은 상수가 아니므로 나중에 변경될 수도 있고, 그렇지 않을 수도 있다.
- 이러한 코드를 배열 메서드를 사용하면 불필요한 데이터를 배제한, 간결하고 예측 가능한 코드를 만들 수 있다.
- 거의 대부분의 배열 메서드는 반환되는 배열의 길이나 형태를 변경할 수 있다.
> - [`map()`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/map): 형태를 바꿀 수 있지만 길이는 유지된다.
> - [`sort()`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/sort): 형태나 길이는 변경되지 않고 순서만 바꾼다.
> - [`filter()`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/filter): 길이를 변경하지만 형태는 바꾸지 않는다.
> - [`find()`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/find): 배열을 반환하지 않고, 한 개의 데이터가 반환되고 형태는 바뀌지 않는다.
> - [`forEach()`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach): 형태를 이용하지만 아무것도 반환하지 않는다.
> - [`reduce()`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce): 길이와 형태를 바꾸는 것을 비롯해 무엇이든 처리할 수 있다.

- 위의 예제 코드를 배열 메서드를 사용하여 작성할 수 있다.

```javascript
const prices = ['1.0', 'little prince', '2.15'];
const formattedPrices = prices.map(price => parseFloat(price)).filter(price => price);
// [1, 2.15]
```

### 🎯 map() 메서드로 비슷한 길이의 배열을 생성하라.
- 맵 함수는 입력한 배열의 정보 중 한 조각을 받아 새로운 값을 반환한다.
- 때로는 정보의 일부를 반환하기도 하고, 정보를 변형해서 새로운 값을 반환하기도 한다.
- 즉, 배열에 있는 한 가지 속성을 반환하거나 배열에 있는 값을 가져와서 다른 형식의 값을 반환한다.
- 먼저 `for` 문으로 작성해보자.
```javascript
const band = [
  { name: 'corbett', instrument: 'guitar' },
  { name: 'evan', instrument: 'guitar' },
  { name: 'sean', instrument: 'bass' },
  { name: 'brett', instrument: 'drums' },
];

const instruments = [];
for(let i = 0; i < band.length; i++) {
  const instrument = band[i].instrument;
  instruments.push(instrument);
}
```

- `for`문 안에 있는 로직을 함수로 따로 분리해 줄 수 있다.

```javascript
function getInstrument(member) {
  return member.instrument;
}

const instruments = [];
for(let i = 0; i < band.length; i++) {
  instruments.push(getInstrument(band[i]));
}
```
- 대부분의 경우 배열 메서드에는 익명 함수를 작성하지만 필수적이지는 않다.
- 필요하다면 기명 함수를 사용할 수도 있다.
- 이젠 `map()` 배열 메서드를 사용해 `for`문을 사용하지 않고 코드를 작성할 수 있다.

```javascript
function getInstrument(member) {
  return member.instrument;
}
const instruments = band.map(getInstrument);
// ["guitar", "guitar", "bass", "drums"]
```
- 위의 기명 함수를 익명 함수로 바꿀 수 있다. 화살표 함수를 사용하여 변경 할 수 있다.
```javascript
const instruments = band.map(member => member.instrument);
// ["guitar", "guitar", "bass", "drums"]
```
- `map()` 메서드는 원본 배열과 같은 길이의 배열을 생성하는 경우라면 모든 곳에 사용할 수 있다.
