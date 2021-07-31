---
sidebar_label: 1. 변수 할당으로 의도를 하라
sidebar_position: 2
---

# 🌈 Chapter 1 : 변수 할당으로 의도를 하라

### 🎯 const로 변하지 않는 값을 표현하라.
- 변수를 할당하는 방법은 `var`, `let`, `const`
- 대부분의 경우에는 `const`를 사용하는 것이 가장 좋다.
- `const`는 가장 많은 것을 할 수 있기 때문이 아니라 가장 적은 것을 할 수 있기 때문이다.
- **`const`는 블록의 문맥 내에서 재할당할 수 없는 변수 선언이다.** 즉, 한 번 선언하면 변경할 수 없다. 그렇지만 값이 변경되지 않는 것, 즉 **불변값이 되는 것은 아니다.**

```javascript
// var 사용
var taxRate = 0.1;
var total = 100 + (100 + taxRate);
// 100행의 코드를 건너뛰었습니다.
return `구매 금액은 ${total}입니다.`;

// const 사용
const taxRate = 0.1;
const total = 100 + (100 + taxRate);
// 100행의 코드를 건너뛰었습니다.
return `구매 금액은 ${total}입니다.`;
```
- `const`를 사용할 때는 `total`이 상수이며 **재할당할 수 없다는 것**을 알고있기 때문에 정확하게 `110`이 반환된다는 것을 알 수 있다.
- `var`은 반복문, 조건문, 재할당 처럼 값을 변경할 수 있는 코드가 있기 때문에 `total`값이 중간에 변경될 수 있는 여지가 있다.

```javascript
const discountable = [];
// 생략..
for(let i = 0; i < cart.length; i++){
    if(cart[i].discountAvailable){
        discountable.push(cart[i]);
    }
}
```
- `const`에 할당된 값이 불변값이 되지 않는다는 것이 아니다.
- 변수를 재할당할 수는 없지만, 위와 같이 값을 바꿀 수는 있다.
- 그렇기 때문에 위와 같은 코드는 코드이 뒷부분에서 어떤 값을 보게 될지 확신할 수 없기에 조작(multation)을 피하는 것이 최선이다.
  
```javascript
const discountable = cart.filter(item => item.discountAvailable);
```

### 🎯 let과 const로 유효 범위 충돌을 줄여라.
- 변수를 반드시 재할당해야 하는 경우에는 `let`을 사용한다.
- `var`은 **어휘적 유효 범위(lexical scope)**를 따르는 반면, `let`은 **블록 유효 범위(block scope)**를 따른다.
- 블록 밖에서는 블록 유효 범위 변수에 접근할 수 없다. (주괄호를 벗어나면 변수가 존재하지 않는다는 규칙)

```javascript
function getLowesPrice(item){
    var count = item.inventory;
    var price = item.price;
    if(item.salePrice){
        var count = item.saleInventory;
        if(count > 0){
            price = item.salePrice;
        }
    }
    if(count){
        return price;
    }

    return 0;
}
```
- 위와 같은 경우에서 `count`를 `if`문 안에서도 선언되기 때문에 기존 `count` 변수가 덮혀써진다.
- `let`을 사용하여 두 가지 방법으로 이런 문제를 피할 수 있다.
- `let`은 블록 스코프를 따르므로 블록 내부에 선언한 변수는 블록 외부에 존재하지 않는다.

```javascript
function getLowesPrice(item){
    let count = item.inventory;
    let price = item.price;
    if(item.salePrice){
        let count = item.saleInventory;
        if(count > 0){
            price = item.salePrice;
        }
    }
    if(count){
        return price;
    }

    return 0;
}
```
- `if` 문 안에서 선언한 `count`와 충돌이 일어나지 않는다.
- `const`를 사용하면 재할당하지 않기 때문에 더 간결하게 사용할 수 있다.

```javascript
function getLowesPrice(item){
    const count = item.inventory;
    let price = item.price;
    if(item.salePrice){
        const saleCount = item.saleInventory;
        if(saleCount > 0){
            price = item.salePrice;
        }
    }
    if(count){
        return price;
    }

    return 0;
}
```

- `let`과 `const`는 같은 이름의 변수를 다시 선언할 수 없다. (`TypeError` 발생)

### 🎯 블록 유효 범위 변수로 정보를 격리하라.
- `for`문 또는 다른 반복문에서 `let`을 사용해 유효 범위 충돌을 방지하는 방법이 있다.
- 선언한 변수는 중괄호 밖에서는 접근할 수 없지만, 반대로 함수 외부에 선언한 변수는 블록 내부에서 접근할 수 있다.
- 반면에 lexical 스코프를 따르는 변수를 선언한 경우에는 함수 내부 어디서든 접근할 수 있다. 이 이유는 호이스팅이라는 컴파일 과정 덕분에 변수가 선언되기도 전에 접근할 수 있기 때문이다.
- 그렇기 때문에 아래와 같은 예시에서 동일하게 함수 내에서 마지막으로 할당한 값을 참조하게 된다.

```javascript
function addClick(items){
    for(var i = 0; i < items.length; i++){
        items[i].onClick = function() {
            return i;
        };
    }
    return items;
}
const example = [{}, {}];
const clickSet = addClick(example);
clickSet[0].onClick(); // 2
clickSet[1].onClick(); // 2
```

- 이러한 문제를 해결하기 위한 첫 번째 전통적인 방법인 아래 예시는 **클로저**(다른 함수가 사용할 수 있도록 함수 내부에서 변수를 생성하는 것), **고차 함수**(다른 함수를 반환하는 함수) **즉시 실행 함수**가 조합되어 있다.

```javascript
function addClick(items){
    for(var i = 0; i < items.length; i++){
        items[i].onClick = (function(i) {
            return function() {
                return i;
            };
        }(i));
    }
    return items;
}
const example = [{}, {}];
const clickSet = addClick(example);
clickSet[0].onClick(); // 0
clickSet[1].onClick(); // 1
```

- 두 번째 방법으로는 `let`을 사용하여 작성하면 코드를 어수선하게 만들지 않고도 같은 결과를 얻을 수 있다.
- `let`은 블록 유효 범위를 따르므로, 블록 내에서 선언한 변수는 해달 블록에서만 유효하다.
- 따라서 반복되어 값이 변경되더라도, 이전에 선언한 함수의 값은 변경되지 않는다.
```javascript
function addClick(items){
    for(let i = 0; i < items.length; i++){
        items[i].onClick = function() {
            return i;
        };
    }
    return items;
}
const example = [{}, {}];
const clickSet = addClick(example);
clickSet[0].onClick(); // 0
clickSet[1].onClick(); // 1
```

### 🎯 템플릿 리터럴로 변수를 읽을 수 있는 문자열로 변환하라.
- 변수를 연결하지 않고 새로운 문자열을 만드는 방법
- 기존에 사용하던 방법

```javascript
function generateLink(image, width){
    const widthInt = parseInt(width, 10);
    return 'https://' + getProvider() + '/' + image + '?width=' + widthInt;
}
```

- **템플릿 리터럴**을 사용하면 복잡도를 줄일 수 있다.
- 텦플릿 리터럴은 자바스클립트 표현식을 사용해서 문자열을 연결하고 새로운 문자열을 생성하는 간단한 문법이다.

```javascript
function generateLink(image, width){
    return `https://${getProvider()}/${image}?width=${parseInt(width, 10)}`;
}
```
- 템플릿 리터럴을 사용할 때 가급적이면 중괄호 내부에서 많은 것을 하지 않는 것이 좋다.
- 코드가 필요 이상으로 어수선해지기 때문이다.
- 대규모 데이터 변환이 필요한 경우에는 템플릿 리터럴 외부에서 처리하고 결괏값을 변수에 할당해 사용한다.
