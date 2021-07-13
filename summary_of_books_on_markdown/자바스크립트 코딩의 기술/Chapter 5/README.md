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

### 🎯 filter()와 find()로 데이터의 부분집합을 생성하라.

- [`filter()`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) 메서드는 `map()` 메서드와 다르게 배열에 있는 정보를 변경하지 않고 반환되는 배열의 길이를 줄인다.

```javascript
const team = [
  'Harang B',
  'Dave L',
  'Dave C',
  'Seungmin B',
  'Dain M',
];
```

- 위 `team` 배열에 `Dav`를 포함하는지 확인하기 위해 문자열에 [`match()`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/String/match) 메서드를 사용해야 한다.
- `for`문을 이용한 예전 방법.
  
```javascript
const daves = [];
for(let i = 0; i < team.length; i++) {
  if(team[i].match(/Dav/)) {
    daves.push(team[i]);
  }
}
// ["Dave L", "Dave C"]
```

- `filter()` 메서드는 전달하는 함수는 **반드시 참 값**을 반환해야 한다.
- 만약 **참 값을 반환하지 않으면** 해당 값은 새로운 배열에 담기지 않는다.
- 또한, 반환되는 배열은 원본의 **배열 순서도 그대로 유지**한다.
- 중요한 점은 `filter()` 메서드는 항상 배열을 반환하면 조건에 일치하지 않는 **값이 없는 경우에도 빈 배열을 반환한다.**

```javascript
const daves = team.filter(member => member.match(/Dav/));
```

- 오로지 일치하는 항목이 하나뿐일 때는 [`find()`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/find) 메서드를 사용할 수 있다.
- `find()` 메서드는 참 또는 거짓 값을 반환하는 함수를 인수로 받고, 배열의 항목에 전달한 함수로 평가해 **참 값을 반환하는 첫 번째 항목만 반환한다.**
- **참 값을 반환하는 항목이 없다면 undefined를 반환한다.**

```javascript
const instructors = [
  { name: '승민', libraries: ['미디어교육정보 도서관'] },
  { name: '다인', libraries: ['기념 도서관', '문헌정보학 도서관'] },
  { name: '하랑', libraries: ['중앙 도서관'] },
];
```

- 위의 `instructors` 배열에 `기념 도서관`인 사서를 찾기 위한 `for` 문으로 작성한 방법.

```javascript
let memorialInstructor;
for(let i = 0; i < instructors.length; i++) {
  if(instructors[i].libraries.includes('기념 도서관')) {
    memorialInstructor = instructors[i];
    break;
  }
}
```

- `find()` 메서드를 사용한 방법

```javascript
const librarian = instructors.find(instructor => {
  return instructor.libraries.includes('기념 도서관');
});
```

- `find()` 메서드의 유일한 단점은 반환값을 확신할 수 없다는 점이다.
- `filter()` 메서드를 사용하면 빈 배열이 반환되지만 `find()` 메서드를 사용하면 `undefined`가 반환된다.
- 그렇지만 단락 평가를 이용하면 기본값을 추가해서 일치하는 항목이 없을 때 사용할 수 있다.

```javascript
const images = [{
  path: './me.jpg',
  profile: false,
}];

const profile = images.find(image => image.profile) || {
  path: './default.jpg'
};
// {path: "./default.jpg"}
```

- `find()` 메서드의 한 가지 아쉬운 점은 도서관 이름인  *기념 도서관*을 하드 코딩해야 한다는 점이다.
- 배열 메서드의 콜백 함수는 인수가 하나뿐이라는 문제가 있기 때문에 검사 대상인 항목 하나만 인수로 받을 수 있다.
- 조건에 일치하는지 확인할 변수가 필요해서 **두 번째 인수를 추가해야 할 때 문제가 발생한다.**
- 이런 경우에 [**커링**](https://ko.javascript.info/currying-partials)이라는 기법을 확용하면 인수의 수를 하나로 줄일 수 있다.

```javascript
const findByLibrary = library => instructor => {
  return instructor.libraries.includes(library);
};

const librarian = instructors.find(findByLibrary('미디어교육정보 도서관'));
// {name: "승민", libraries: ["미디어교육정보 도서관"]}
```

### 🎯 forEach()로 동일한 동작을 적용하라.
- `forEach()`는 입력 배열을 전혀 변경하지 않고, 모든 항목에 동일한 동작을 수행한다.

```javascript
const sailingClub = [
  'seung',
  'min',
  'Dain',
  'Harang',
  'jessi',
  'alex',
];
```

- 위의 `sailingClub`을 for 문을 사용한 방법.

```javascript
for(let i = 0; i < sailingClub.length; i++) {
  sendEmail(sailingClub[i]);
}
```

- 굳이 `forEach()`를 사용하는 가치 있는 이유는 다른 메서드처럼 코드를 단순하게 만들기 때문이 아니라, 그보다는 **예측 가능하면서도 다른 배열 메서드와 같이 작동해 함께 연결할 수 있기 때문에** 가치가 있는 것이다.
- 아래 코드와 같이 `forEach()` 메서드는 부수 효과 없이는 아무 소용이 없기 때문에 실행해도 아무런 변화가 없다.
```javascript
const names = ['walter', 'white'];
const capitalized = names.forEach(name => name.toUpperCase());

capitalized; // undefined
```

- 아래 예제 코드처럼 `capitalized` 배열을 둬서 대문자로 변경한 결과를 담을 수 있게 할 수 있지만, 배열을 직접 조작하는 방식은 좋지 못하고, 이러한 작업은 `map()` 메서드로 처리할 수 있기 때문에 `forEach()` 메서드를 사용할 필요가 없다.

```javascript
const names = ['walter', 'white'];
let capitalized = [];
names.forEach(name => capitalized.push(name.toUpperCase()));

capitalized; // ["WALTER", "WHITE"]
```
- 그렇기 때문에 `forEach()` 메서드를 사용하는 곳은 **함수의 유효 범위를 벗어나는 작업이 필요한 경우이다.**
- 즉, **반드시 부수 효과가 필요한 경우**에 `forEach()`를 사용해야 한다.

```javascript
sailingClub.forEach(member => sendEmail(member));
```

- 결국 `forEach()`를 사용하는 가장 큰 요점은 약간의 예측 가능성을 얻을 수 있다는 것으로 `forEach()` 메서드가 있다면 **부수 효과를 발생한다는 점이다.**
- 가장 큰 이유는 **체이닝 과정에서 다른 배열 메서드와 결합할 수 있기 때문이다.**

### 🎯 체이닝으로 메서드를 연결하라.
- [체이닝(method-chaining)](https://en.wikipedia.org/wiki/Method_chaining)은 값을 다시 할당하지 않고 반환된 객체에 메서드를 즉시 호출하는 것을 의미한다.

```javascript
const sailors = [
  {
    name: 'seungmin',
    active: true,
    email: 'seungmin@naver.com',
  },
  {
    name: 'dain',
    active: true,
    email: '',
  },
  {
    name: 'harang',
    active: false,
    email: '',
  },
];
```
- 위 `sailors`배열을 이용해 활동이 없는 회원을 제외시켜보자.

```javascript
const active = sailors.filter(sailor => sailor.active);
// [
//   {name: "seungmin", active: true, email: "seungmin@naver.com"}, 
//   {name: "dain", active: true, email: ""}
// ]
```
- 이메일 주소를 회원이 이메일을 가지고 있으면 해당 이메일을 사용하고, 그렇지 않으면 기본 이메일을 사용한다.

```javascript
const emails = active.map(member => member.email || `${member.name}@naver.com`);
// ["seungmin@naver.com", "dain@naver.com"]
```

- 정확한 회원 정보를 이용해 `sendEmail` 함수를 호출할 수 있다.

```javascript
emails.forEach(sailor => sendEmail(sailor));
```

- 위의 코드들을 체이닝을 사용하여 중간 단계를 제거하고 번수를 선언하지 않고도 동일한 작업들을 처리할 수 있다.

```javascript
sailors
  .filter(sailor => sailor.active)
  .map(member => member.email || `${member.name}@naver.com`)
  .forEach(sailor => sendEmail(sailor));
```
- 메서드 체이닝을 사용할 때 주의 사항은 마지막 문장까지 세미콜론이 없는 것을 확인해야 한다.
- 한 가지 더 중요한 점은 **순서를 지켜야 한다는 점이다.**

### 🎯 reduce()로 배열 데이터를 변환하라.
- 배열 메서드가 훌륭한 이유는 콜백 함수를 이해하기 전에도 결괏값을 한눈에 예측할 수 있기 때문이다.
- 게다가, 배열 메서드는 테스트하기 쉽다.
- [`reduce()`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) 메서드는 배열을 이용해서 근본적으로 다른 새로운 데이터를 만들어야 할 경우나 특정 항목의 수가 필요하거나, 배열을 객체처럼 다른 형태의 자료구조로 변환해야 하는 경우에 사용된다.
- `reduce()` 메서드만의 가장 중요한 특징은 **배열의 길와 데이터 형태를 모두 또는 각각 변경할 수 있다는 점이다.**
- 또한, `reduce()` 메서드는 **반드시 배열을 반환할 필요도 없다.**
- 아래 코드는 `reduce()` 메서드를 사용해서 동일한 배열을 반환한 것이다.

```javascript
// reduce() 메서드의 콜백 함수에 두 개의 인수를 전달한다.
// collectedValues 반환되는 항목
// item 개별 항목
const callback = function (collectedValues, item) {
  // 반환값은 콜백 함수가 반환하는 값을 누적한 것
  return [...collectedValues, item];
};

const saying = ['veni', 'vedi', 'veci'];
const initialValue = [];
const copy = saying.reduce(callback, initialValue); // ["veni", "vedi", "veci"]
```
- `reduce()` 메서드가 특별한 이유는 반환값은 **정수뿐 아니라 세트 같은 컬렉션도 될 수 있다.**
- `reduce()` 메서드의 두 가지 값, 즉 **콜백 함수와 기본값을 전달받는다.**
- 기본값은 생략할 수도 있지만 대부분 작성하여 반환값을 담을 수 있다.
- `reduce()` 메서드에서 까다로운 부분은 **콜백 함수에서 항상 누적된 값을 반환해야 한다는 점이다.**

```javascript
const dogs = [
  { name: '토이 푸들', color: '갈색' },
  { name: '래브라도레트리버', color: '흰색' },
  { name: '포메리안', color: '흰색' },
]
```
- 위 `dogs` 배열을 사용하여 `reduce()`로 고윳값이 담긴 집합을 만들어보자.

```javascript
const colors = dogs.reduce((colors, dog) => {
  if(colors.includes(dog['color'])) {
    return colors;
  }
  return [...colors, dog['color']];
}, []);
// ["갈색", "흰색"]
```

- `reduce()` 메서드를 파악하기 위한 또 다른 중요한 요소는 초깃값이 함수에 전달된 후 어떻게 불리는지를 이해하는 것으로 보통 **캐리(carry)**라고 부르지만, 단지 매개변수이기 때문에 원하는 대로 이름을 붙일 수 있다. (여기서는 `colors`)
- 함수 몸체를 살펴보지 않아도, 다른 배열이 반환된다는 점은 이미 알 수 있기 때문에 **항상 누적값을 명시적으로 작성해야 한다.**
- 또한, 주의할 점은 **누적값을 반환하지 않으면 값은 완전히 사라진다.**

```javascript
const colors = dogs.reduce((colors, dog) => {
  if(colors.includes(dog['color'])) {
    return colors;
  }
  [...colors, dog['color']];
}, []);
// Uncaught TypeError: Cannot read property 'includes' of undefined
```

- `reduce()` 메서드는 데이터의 크기와 형태를 모두 변경할 수 있기 때문에 다른 배열 메서드를 다시 만들 수도 있다.
- 아래 코드는 색상만 모을 때 `map()` 메서드를 사용할 수 있다.
  
```javascript
const colors = dogs.map(dog => dog['color']); // ["갈색", "흰색", "흰색"]
```

- `reduce()` 메서드를 이용해서 같은 결과를 얻을 수 있다.

```javascript
const colors = dogs.reduce((colors, dog) => {
  return [...colors, dog['color']];
},[]);
// ["갈색", "흰색", "흰색"]
```

- `map()`으로도 결과값을 같게 할 수 있는데 고유값을 분리할 때 `reduce()`메서드를 사용하는 이유는 리듀서(reducer)가 더 많은 값을 쉽게 다룰 수 있도록 **코드에 유연성을 제공하기 때문이다.**

```javascript
const filters = dogs.reduce((filters, item) => {
  filters.breed.add(item['name']);
  filters.color.add(item['color']);
  return filters;
},
{
  breed: new Set(),
  color: new Set(),
});
```
- `filters` 결과값
![1](../img/1.PNG);

- 데이터의 크기와 형태를 동시에 바꿀 수 있으므로 사용 방법이 무궁무진하다.
  
```javascript
const developers = [
  { name: 'sa', language: 'javascript' },
  { name: 'seungmin', language: 'typescript' },
  { name: 'dain', language: 'java' },
  { name: 'harang', language: 'javascript' },
];
```
- 위 `developers` 배열로 `reduce()` 언어별로 몇 명인지 확인할 수 있다.

```javascript
const aggregated = developers.reduce((specialities, developer) => {
  const count = specialities[developer.language] || 0;
  return {
    ...specialities,
    [developer.language]: count + 1,
  };
},{});
// {javascript: 2, typescript: 1, java: 1}
```

### 🎯 for...in 문과 for...of 문으로 반복문을 정리하라.
- [`for...of`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/for...of) 문을 이용해서 객체에 대한 반복문을 통해 반복문의 명료성을 유지할 수 있다.
- [`for...in`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/for...in) 문을 이용해서 이터러블에 대한 반복문을 사용할 수 있다.
> - 에어비앤비(Airbnb)의 스타일 가이드는 항상 배열 메서드를 사용하고 `for...of` 문과 `for...in` 문의 사용을 제한해야 한다고 주장한다. ([참고](https://github.com/airbnb/javascript/issues/851))
> - 그렇지만 모든 사람이 이에 동의하지는 않는다. 때로는 자료구조를 배열로 변환하느라 고생하는 것보다는 다른 방법을 찾아보는 것이 나을 수도 있다.
- 아래 예제 코드는 맵을 사용해서 사용자가 옵션을 클릭할 때 다양한 회사를 담은 것이고, 정보를 계속해서 추가하고 삭제하는 작업이므로 맵을 사용하면 쉽게 처리할 수 있다.

```javascript
const firms = new Map()
  .set(10, 'Ivie Group')
  .set(23, 'Soundscaping Source')
  .set(31, 'Big 6');
```

- 사용자사 선택한 회사를 순회하면서 이용할 수 있는 회사인지 확인한다.(다른 곳에서 정의한 `isAvailabel()` 함수를 사용.)

```javascript
const entries = [...firms];
for(let i = 0; i < entries.length; i++){
  const [id, name] = entries[i];
  if(!isAvailable(id)) {
    return `${name}는 사용할 수 없습니다.`;
  }
}
return '모든 회사를 사용할 수 있습니다.';
```

- 위 `for` 문으로 되어있는 반복문을 `find()` 메서드를 사용해서 세버스를 제공하지 못하는 회사가 있는지 확인할 수 있다.

```javascript
const unavailable = [...firms].find(firm => {
  const [id] = firm;
  return !isAvailable(id);
});
if(unavailable) {
  return `${unavailable[1]}는 사용할 수 없습니다.`;
}
return '모든 회사를 사용할 수 있습니다.';
```
- `reduce()` 메서드를 사용해서 메시지를 반환할 수도 있다.

```javascript
const message = [...firms].reduce((availability, firm) => {
  const [id, name] = firm;
  if(!isAvailable(id)) {
    return `${name}는 사용할 수 없습니다.`;
  }
  return availability;
},'모든 회사를 사용할 수 있습니다.');
return message;
```
- 이 방법들은 문제가 되는 부분이 있다. `find()` 메서드를 이용하면 이용할 수 없는 회사가 있는지 확인하고 메시지를 반환하는 두 단계를 거쳐야하고 `reduce()` 메서드를 사용하면 코드를 이해하기 좀 어렵다.
- 또한, `find()` 메서드는 이용이 불가능한 회사 중 첫 번째 회사만 찾을 수 있고, `reduce()` 메서드는 마지막 회사만 찾을 수 있다.
- 맵은 펼침 연산자를 사용할 수 있게 해주는 **맵이터레이터**라는 속성이 존재했는데, 이 속성이 맵을 직접 순회할 수 있게 해준다.
- 그렇기 때문에 `for...of` 문으로 이터레이터를 사용할 수 있다.

```javascript
for(const firm of firms) {
  const [id, name] = firm;
  if(!isAvailable(id)) {
    return `${name}는 사용할 수 없습니다.`;
  }
}
return '모든 회사를 사용할 수 있습니다.';
```

- `for...of` 문은 반복문으로 무엇이든 할 수 있기 때문에 **예측 가능성이 줄어드는 문제**가 있다.
- 컬렉션을 순회할 떄 흔히 벌어지는 컬렉션 조작만 하지 않는다면, 예측 가능성이 줄어드는 것은 이 방식의 유일한 문제이다.
- `for...of` 문은 반드시 필요한 경우에만 사용하는 것이 좋다.
- `for...in` 문은 `for...of` 문과 매우 유사하다.
- `for...in` 문은 객체에 필요한 작업을 직접 실행하기 때문에 `Object.key()`를 실행해서 **객체의 키를 배열로 변환하는 과정을 생략할 수 없다.** 더 정확히 말하면 **객체의 속성을 순회한다.**
> - 객체는 프로토타입 체인에 있는 다른 객체에서 속성을 상속받고, 객체에는 열거할 수 없는 속성이 있어 순회에서 제외되기도 한다.
> - 즉, **객체의 속성은 단순하지 않다.** ([MDN](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/for...in#Description)에서 자체 속성만 반복 참고)
- 그렇기 때문에 맵을 객체로 변경해준다.
```javascript
const firms = {
  '10': 'Ivie Group',
  '23': 'Soundscaping Source',
  '31': 'Big 6',
};
```
- `for...in` 문을 사용해서 변경할 수 있다.

```javascript
for(const id in firms) {
  if(!isAvailable(parseInt(id, 10))) {
    return `${firms[id]}는 사용할 수 없습니다.`;
  }
}
return '모든 회사를 사용할 수 있습니다.';
```
- `for...in`문도 마찬가지로 무조건적으로 사용하지 말고 사용이 적절한 경우에만 선택하는 것이 좋다.
- 키만 필요한 경우에는 배열 메서드를 사용하기 전에 `Object.key()`로 키를 가져오는 것이 더 나을 수도 있다.
- 값만 필요한 경우도 마찬가지로 `Object.value()`를 사용한다.
- 여기서 더 주의해야할 사항은 **객체를 순회하면서 객체를 조작하면 안된다.**
- 객체를 조작하는 것은 매우 위험하고, 특히 **반복 중인 속성 외의 다른 속성을 추가하거나 수정하는 경우에는 버그가 빠르게 퍼질 수 있다.**