---
sidebar_label: 2. 배열로 데이터 컬렉션을 관리하라.
sidebar_position: 3
---

# 🌈 Chapter 2 : 배열로 데이터 컬렉션을 관리하라.

### 🎯 배열로 유연한 컬렉션을 생성하라.
- 데이터 컬렉션을 다루는 구조로 `Map`, `Set`, `WeakMap`, 객체, 배열을 사용할 수 있다.
- 배열은 여기저기 어디에나 등장하는데, 배열에 **이터러블(iterable)** 이 내장되어 있기 때문이다. ([`Iterator`와 `Generator`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Iterators_and_Generators))
- `iterable`은 간단히 말해 컬렉션의 현재 위치를 알고 있는 상태에서 컬렉션의 항목을 한 번에 하나씩 처리하는 방법이다.
- `String`, `Array`, `TypedArray`, `Map` 및 `Set`은 모두 내장 반복가능 객체이다. 그들의 프로토타입 객체가 모두 [`Symbol.iterator`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator) 메서드가 있기 때문이다.
- 컬렉션 개념의 거의 대부분을 배열 형태로 표현할 수 있다. 즉, 배열을 특별한 컬렉션으로 쉽게 변환하거나 다시 배열로 만들 수 있다.
- 키-값 쌍을 사용해 맵 객체와 배열 간의 데이터를 변환할 수 있는데 TC39 위원회에서 [`Object.entries()`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)를 이용해서 객체를 키-값 쌍 배열로 변환하는 명세를 확정했다.([ES2017](https://github.com/tc39/proposal-object-values-entries))

### 🎯 Includes()로 존재 여부를 확인하라.
- `includes`를 사용하면 배열에 있는 값의 위치를 확인하지 않고도 존재 여부를 확인할 수 있다.
- 아래 예제와 같이 특정 문자열을 포함하고 있는지 확인하려면 문자열의 위치를 찾아야 한다.

```javascript
const sections = ['contact','shipping'];

function displayShipping(sections){
    return sections.indexOf('shipping') > -1;
}
// true
```
- 그렇기 때문에 ES2016에서 추가된 [`includes`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/includes)를 사용하여 번거로운 비교 절차를 생략할 수 있다.
- `includes`라는 배열 메서드를 이용하면 값이 배열에 존재하는지 여부를 확인해서 boolean값으로 `true` 또는 `false`를 반환한다.

```javascript
const sections = ['contact','shipping'];

function displayShipping(sections){
    return sections.includes('shipping');
}
// true
```

### 🎯 펼침 연산자로 배열을 본떠라.
- 배열은 데이터를 다룰 때 많은 유연성을 제공하지만 배열에는 수많은 메서드가 있으므로 혼란스럽거나 조작과 부수 효과(side effect)로 인한 문제에 맞닥뜨릴 수 있다.
- 그렇기 때문에 [펼침 연산자(Spread syntax)](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Spread_syntax)를 사용하여 최소한의 코드로 배열을 빠르게 생성하고 조작할 수 있다.
- 펼침 연산자는 배열에만 국한되지 않고 맵 컬렉션에서도 사용가능하고 함수에서는 펼침 연산자의 다른 형태인 나머지 매개변수를 사용할 수 있다.
- 또한, 펼침 연산자는 제너레이터를 이용하는 데이터 구조나 클래스 속성에도 사용할 수 있다.
- 펼침 연산자는 단독으로 사용할 수는 없다. 정보를 어디든 펼처 넣어야 한다.

```javascript
const cart = ['My Name is SeungMin', 'Helloooooo'];
...cart // error
const copyCart = [...cart]; //  ['My Name is SeungMin', 'Helloooooo']
```

- 다음 예시는 배열에서 항목을 제거하려고 할때 반복문만 사용한 것이다.

```javascript
function removeItem(items, removable){
    const updated = [];
    for(let i = 0; i < items.length; i++){
        if(items[i] !== removable){
            updated.push(items[i]);
        }
    }
    return updated;
}
```
- 위 코드는 반복문이 늘어나고 어수선해질수록 코드를 읽고 이해하기가 어려워진다.
- `splice()` 메서드를 사용하여 제거할 수 있다.

```javascript
function removeItem(items, removable){
    const index = items.indexOf(removable);
    items.splice(index, 1);
    return items;
}
```
- 하지만 `splice()` 메서드는 **원본 배열을 조작**한다.
- 원본 배열을 조작하는 작업은 위험한데 특히 함수에서 사용할 때 위험하다.
- 함수에 전달하는 정보가 근본적으로 달라지는 것을 예측할 수 없기 때문이다.
- 그렇기 때문에 원본 배열을 변경하지 않고 배열의 일부를 반환하는 `slice()`를 사용한다.

```javascript
function removeItem(items, removable){
    const index = items.indexOf(removable);
    return items.slice(0, index).concat(items.slice(index + 1));
}
```
- 위 방법도 무엇이 반환되는지 정확하지 않다.
- 다른 개발자가 볼 때 `concat()`으로 배열 두 개를 병합해서 배열 하나를 생성한다는 사실을 이해해야 하기 때문이다.
- 이런 곳에서 펼침 연산자를 사용하여 `slice()` 메서드와 함께 사용하면 하위 배열을 목록으로 변환해 대괄호 안에 작성할 수 있다.

```javascript
function removeItem(items, removable){
    const index = items.indexOf(removable);
    return [...items.slice(0, index), ...items.slice(index + 1)];
}
```
- 위 코드를 보면 원본 배열을 조작하지도 않고, 읽기 쉽고 간결할 뿐아니라 재사용할 수 있으며 예측 가능하다.
- **의도를 가장 잘 전달하는 방법을 선택하자.**
- 함수의 인수 목록을 생성할 때 펼침 연산자를 사용할 수 있다.
```javascript
const book = ['어린왕자','생텍쥐페리',20000];
function formatBook(title, author, price){
    return `${title} by ${author} ${price}원`;
}
// 기존 사용 방법
formatBook(book[0], book[1], book[2]);
// 펼침 연산자 사용
formatBook(...book);
```

### 🎯 push() 메서드 대신 펼침 연산자로 원본 변경을 피해라.
- 펼침 연산자로 새로운 배열을 생성해 배열에 대한 조작을 피하자.
- `push()` 메서드는 새로운 항목을 배열 뒤에 추가해 원본 배열을 변경하기 때문에 좋지 못하다.

```javascript
const reward = {
    name: 'The Little Prince',
    discount: true,
    price: 0,
}

function addFreeGift(cart){
    if(cart.length > 2){
        cart.push(reward);
        return cart;
    }
    return cart;
}

function summarizeCart(cart){
    const discountable = cart.filter(item => item.discount);
    if(discountable.length > 1){
        return {
            error: '할인 상품은 하나만 주문할 수 있습니다.',
        };
    }
    const cartWithReward = addFreeGift(cart);
    return {
        discount: discountable.length,
        items: cartWithReward.length,
        cart: cartWithReward,
    };
}
```

- 함수를 호출할 때는 함수에 전달한 값을 변경하지 않을 것이라는 신뢰가 필요한데 부수 효과가 없는 함수를 [**순수 함수(pure function)**](https://medium.com/javascript-scene/master-the-javascript-interview-what-is-a-pure-function-d1c076bec976)라고한다.
- 위 코드에서 다른 개발자가 다룰 때 원본 값이 변경되었을 것이라고 생각하지 못할 것이다. 그렇기 때문에 펼침 연산자를 사용한다.

```javascript
// ...
function addFreeGift(cart){
    if(cart.length > 2){
        return [...cart, reward];
    }
    return cart;
}
// ...
```

- 추가적으로 펼침 연산자로 배열에 항목을 추가하고 사본을 만드는 방법
  
```javascript
// shift를 사용한 원본 조작
const titles = ['Little Prince', 'Javascript'];
titles.shift('React');
// 펼침 연산자
const titles = ['Little Prince', 'Javascript'];
const addTitles = ['React', ...titles];

// slice를 사용한 복사
const toCopy = ['Little Prince', 'Javascript'];
const copied = toCopy.slice();
// 펼침 연산자를 사용한 복사
const toCopy = ['Little Prince', 'Javascript'];
const copied = [...toCopy];
```

### 🎯 펼침 연산자로 정렬에 의한 혼란을 피하라.
- 펼침 연산자를 사용하여 배열을 정렬하면 여러 번 정렬해도 항상 같은 결과가 나오게 할 수 있다.
- 아래의 객체가 담긴 배열을 정렬해보자.

```javascript
const family = [
    { name: 'Joe', years: 10 },
    { name: 'Theo', years: 5 },
    { name: 'Dyan', years: 10 },
];
```
- [`sort()`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) 메서드를 사용해 숫자 정렬과 문자 정렬을 위해 함수를 생성하자.
  
```javascript
function sortByYears(a, b){
    if(a.years === b.years){
        return 0;
    }
    return a.years - b.years;
}

const sortByName = (a, b) => {
    if(a.name === b.name){
        return 0;
    }
    return a.name > b.name ? 1 : -1;
};
```
- 나이 순으로 정렬을 아래와 같다.
  
```javascript
family.sort(sortByYears);
// {name: "Theo", years: 5}
// {name: "Joe", years: 10}
// {name: "Dyan", years: 10}
```
- 정렬 된 `family`를 이름 순으로 정렬해보자.

```javascript
family.sort(sortByName);
// {name: "Dyan", years: 10}
// {name: "Joe", years: 10}
// {name: "Theo", years: 5}
```

- 다시 정렬 된 `family`를 나이 순으로 정렬해보면 처음 나이 순으로 정렬한 결과와 전혀 다른 결과가 나오게 된다.

```javascript
family.sort(sortByYears);
// {name: "Theo", years: 5}
// {name: "Dyan", years: 10}
// {name: "Joe", years: 10}
```

- 이렇듯 매번 순서가 바뀐다면 사용자는 애플리케이션을 신뢰하지 못할 것이고 우리가 원한 결과도 아니다.
- 이런 경우 **원본 데이터를 조작하지 않고 사본을 사용해 조작**하면 해결할 수 있다.

```javascript
[...family].sort(sortByYears);
// {name: "Theo", years: 5}
// {name: "Joe", years: 10}
// {name: "Dyan", years: 10}
```
