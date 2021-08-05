---
sidebar_label: 8. 클래스로 인터페이스를 간결하게 유지하라.
sidebar_position: 9
---

# 🌈 Chapter 8 : 클래스로 인터페이스를 간결하게 유지하라.

### 🎯 읽기 쉬운 클래스를 만들어라.
- 클래스를 선언할 때 `class` 키워드를 사용하고, 새로운 인스턴스를 생성할 때는 `new` 키워드를 사용한다.

```javascript
class Coupon {
}

const coupon = new Coupon();
```
- 클래스의 인스턴스를 생성할 때는 가장 먼저 **생성자 함수를 실행**한다.
- 그 다음은 **생성자 메서드를 생성**하는 것이다. 여기에 `constructor()`라고 이름을 붙인다.
- `constructor()`를 클래스에 추가할 때는 함수를 작성하는 문법과 비슷하지만 `function()` 키워드 없이 작성해야 한다.
- 생성자는 **함수**이므로 자유롭게 인수를 전달할 수도 있다.
- 생성자의 역할 중 하나는 `this` 문맥을 생성하는 것이다.
- 생성자 내부에서 객체에 키-값 쌍을 추가하는 것처럼 `this`에 할당하는 방법으로 클래스에 속성을 추가할 수 있다.
- 또한, 생성자에 인수를 전달할 수 있기 때문에 새로운 인스턴스를 생성할 때 **속성을 동적**으로 설정할 수도 있다.
- 두개의 속성 `price`와 `expiration`을 설정.

```javascript
class Coupon {
  constructor(price, expiration) {
    this.price = price;
    this.expiration = expiration || '2주';
  }
}
const coupon = new Coupon(5);
coupon.price; // 5
coupon['expiration']; // "2주"
```
- 두 가지 간단한 메서드를 추가.
- 생성자와 동일한 문법으로 클래스에 메서드를 추가할 수 있다.
- 메서드는 **화살표 함수가 아닌 보통 함수**로 작성한다.
- 클래스 메서드를 클래스의 인스턴스에서 호출한다면 `this` 문맥에 완전하게 접근할 수 있다.

```javascript
class Coupon {
  constructor(price, expiration) {
    this.price = price;
    this.expiration = expiration || '2주';
  }
  getPriceText() {
    return `$ ${this.price}`;
  }
  getExpirationMessage() {
    return `이 쿠폰은 ${this.expiration} 후에 만료됩니다.`;
  }
}
const coupon = new Coupon(5);
coupon.getPriceText(); // "$ 5"
coupon.getExpirationMessage(); // "이 쿠폰은 2주 후에 만료됩니다."
```

### 🎯 상속으로 메서드를 공유하라.

- 아래의 코드와 같이 위에서 사용한 `Coupon` 클래스를 `extends`를 사용하여 상속받을 수 있다.

```javascript
import Coupon from './extend';
class FlashCoupon extends Coupon {
}
const flash = new FlashCoupon(10);
flash.price; // 10
flash.getPriceText(); // "$ 10"
```
- 새로운 속성이나 메서드를 추가할 것이 아니라면 상속에는 아무런 의미도 없다.
- 새로운 생성자에서 부모 클래스의 생성자에 접근할려면 `super()`를 호출해야 한다.
- `super()`는 부모 클래스의 생성자를 호출하기 때문에 부모 클래스의 생성자에 필요한 인수가 있다면 `super()`를 이용해서 넘겨줄 수 있다.
- 새로운 속성을 추가하거나 부모 생성자가 설정한 속성을 덮어 쓸 수 있다.

```javascript
import Coupon from './extend';
class FlashCoupon extends Coupon {
  constructor(price, expiration) {
    super(price);
    this.expiration = expiration || '2시간';
  }
}
const flash = new FlashCoupon(10);
flash.price; // 10
flash.getExpirationMessage(); // "이 쿠폰은 2시간 후에 만료됩니다."
```
- 자바스크립트 엔진은 먼저 현재 클래스에 메서드가 있는지 확인한 뒤 만약 메서드가 없다면 상속 연결의 상위로 올라가서 각 클래스나 프로토타입을 확인한다.
- 즉, **클래스에 같은 이름의 메서드를 새로 작성하면 부모 클래스에서 상속한 메서드를 대체한다.**
- 새로운 메서드도 추가할 수 있다.
- 다음 예제는 부모 메서드를 호출하는 메서드를 추가로 작성한 것이다.
- 주의할 점은 **부모 클래스에 추가하는 모든 메서드를 자식 클래스가 상속**받는다는 것이다.
- 자식 클래스에서 필요하지 않은 메서드를 부모 클래스에 추가하면 **자식 클래스가 비대해지기 쉽다.**

```javascript
class Coupon {
  constructor(price, expiration) {
    this.price = price;
    this.expiration = expiration || '2주';
  }
  getPriceText() {
    return `$ ${this.price}`;
  }
  getExpirationMessage() {
    return `이 쿠폰은 ${this.expiration} 후에 만료됩니다.`;
  }
  // 추가
  isRewardsEligible(user) {
    // 최근에 접속한 사용자이며, 보상받을 자격이 있는 경우
    return user.rewardsEligible && user.active;
  }
  getRewards(user) {
    if(this.isRewardsEligible(user)) {
      this.price = this.price * 0.9;
    }
  }
}
export default Coupon;
```
- 자식 클래스

```javascript
import Coupon from './extend';
class FlashCoupon extends Coupon {
  constructor(price, expiration) {
    super(price);
    this.expiration = expiration || '2시간';
  }
  getExpirationMessage() {
    return `이 쿠폰은 깜짝 쿠폰이며 ${this.expiration} 후에 만료됩니다.`;
  }
  isRewardsEligible(user) {
    // 최근에 접속한 사용자이며, 보상받을 자격이 있는 경우에 상품의 가격이 20달러 이상
    return super.isRewardsEligible(user) && this.price > 20;
  }
  getRewards(user) {
    if(this.isRewardsEligible(user)) {
      this.price = this.price * 0.8;
    }
  }
}
```
- 자바스크립트는 루비, 자바 등과 클래스를 쓰는 다른 언어와 다르다.
- 자바스크립트는 [**프로토타입 기반 언어**](https://medium.com/@bluesh55/javascript-prototype-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0-f8e67c286b67)이다.

### 🎯 클래스로 기존의 프로토타입을 확장하라.
- 자바스크립트의 클래스와 프로토타입이 다르지 않다는 점을 이해하는 것이 중요하다.
- 클래스는 단지 보통의 자바스크립트를 작성하는 간결한 방법일 뿐이다.
- 전통적인 객체 지향 언어에서 클래스를 사용하는 경우에는 새로운 인스턴스를 생성하면 새로운 객체에 모든 속성과 메서드가 복제된다.
- 자바스크립트는 프로토타입 언어이기 때문에 자바스크립트에서는 새로운 인스턴스를 생성할 때 메서드를 복제하지 않는다. 그 대신 **프로토타입에 대한 연결을 생성한다.**
- 객체의 인스턴스에 있는 메서드를 호출하면 **프로토타입에 있는 메서드를 호출**한다.([참고](https://medium.com/javascript-scene/master-the-javascript-interview-what-s-the-difference-between-class-prototypal-inheritance-e4cd0a7562e9))
- 그렇기 때문에 자바스크립트에서 `class`는 새로운 기능이 아니라 **클래스는 단지 프로토타입을 사용하기 위한 속기법일 뿐인 것이다.**
- 자바스크립트에서 생성자 함수를 이용해 객체 인스턴스 만들기 위해서는 간단히 함수를 작성하면 되는데 **함수로 생성자로 사용하려면 코딩 컨벤션으로 함수명을 대문자**로 시작한다.
- 함수 내부에서 `this` 키워드를 사용해 속성을 연결할 수 있다.
- `new` 키워드를 이용해서 새로운 인스턴스를 생성할 때는 함수를 생성자로 사용하고 `this` 문맥을 바인딩한다.
- 아래 예제 코드는 **생성자 함수**를 이용해서 클래스를 작성한 것이다.

```javascript
function Coupon(price, expiration) {
  this.price = price;
  this.expiration = expiration || '2주';
}
const coupon = new Coupon(5, '2개월');
coupon.price; // 5
```

- `new` 키워드로 새로운 인스턴스를 생성할 때, 생성자를 실행하고 `this` 문맥을 바인딩하지만 **메서드를 복제하지는 않는다.**
- 생성자에서 `this`에 메서드를 추가할 수도 있지만, 프로토타입에 직접 추가하는 것이 훨씬 더 효율적이다.
- **프로토타입은 생성자 함수의 기반이 되는 객체이다.**
- **모든 객체 인스턴스는 프로토타입에서 속성을 가져오고, 새로운 인스턴스도 프로토타입에 있는 메서드를 사용할 수 있다.**

```javascript
Coupon.prototype.getExpirationMessage = function() {
  return `이 쿠폰은 ${this.expiration} 후에 만료됩니다.`;
};

coupon.getExpirationMessage(); // "이 쿠폰은 2개월 후에 만료됩니다."
```

- `class` 키워드를 이용해서 객체를 생성할 때도 여전히 **프로토타입을 생성하고 문맥(context)을 바인딩한다.**
- 단지 `class` 키워드를 이용하면 더욱 직관적인 인터페이스를 사용할 수 있는 것뿐이다.
- 생성자 함수와 프로토타입을 사용해 작성한 코드는 class 키워드로 생성한 것과 동일하다.
- 내부적으로는 단지 프로토타입을 생성할 뿐이다.
- 그렇기 때문에 프로토타입을 이용해서 생성한 레거시 코드에 새로운 코드를 추가할 때 클래스를 사용할 수도 있다.

```javascript
class FlashCoupon extends Coupon {
  constructor(price, expiration) {
    super(price);
    this.expiration = expiration || '2시간';
  }
  getExpirationMessage() {
    return `이 쿠폰은 깜짝 쿠폰이며 ${this.expiration} 후에 만료됩니다.`;
  }
}
```
- [MDN의 클래스와 프로토타입 개념 참고](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Classes#Sub_classing_with_extends)

### 🎯 get과 set으로 인터페이스를 단순하게 만들어라.
- 우리가 작성한 클래스의 속성 중 노출할 생각이 없었던 것을 누군가 조작하려는 경우가 생길 것이다.
- 자바스크립트의 주요 문제점 중 하나는 비공개(static) 속성을 기본적으로 지원하지 않는다는 점이다.
- 아래의 예제 코드에서 price를 정수로 설정하지 않고 문자열로 설정하면 예상하지 못한 버그를 만들어낼 수 있다.

```javascript
class Coupon {
  constructor(price, expiration) {
    this.price = price;
    this.expiration = expiration || '2주';
  }
  getPriceText() {
    return `$ ${this.price}`;
  }
  getExpirationMessage() {
    return `이 쿠폰은 ${this.expiration} 후에 만료됩니다.`;
  }
}
const coupon = new Coupon(5);
coupon.price = '$10';
coupon.getPriceText(); // "$ $10"
```

- 이럴 경우 한 가지 해결책은 `getter`와 `setter`를 이용해서 로직을 추가하고 속성을 뒤로 숨기는 것이다.
- 위 예제 코드의 메서드를 `getter`로 변경하면 다음과 같다.

```javascript
class Coupon {
  constructor(price, expiration) {
    this.price = price;
    this.expiration = expiration || '2주';
  }
  get priceText() {
    return `$ ${this.price}`;
  }
  get expirationMessage() {
    return `이 쿠폰은 ${this.expiration} 후에 만료됩니다.`;
  }
}
```
- 간단한 변경을 처리한 뒤에는 점 표기법으로 메서드를 호출할 수 있으며, 이 경우에는 **괄호를 쓰지 않는다.**
- 실제로는 코드를 실행하는 것이지만 메서드가 마치 속성처럼 작동한다.

```javascript
const coupon = new Coupon(5);
coupon.price = 10;
coupon.priceText; // "$ 10"
coupon.expirationMessage; // "이 쿠폰은 2주 후에 만료됩니다."
```
- 이렇게 하면 정보를 가져오기가 쉬워지지만, 누군가가 잘못된 값을 설정하는 것은 막을 수 없다.
- 이를 위해서는 `setter`도 생성해야 한다.
- `setter`는 게터처럼 동작하지만 **인수를 하나만 받고, 정보를 노출하는 것이 아니라 속성을 변경한다.**
- `setter`에 인수를 전달할 때는 **괄호를 사용하지 않는다.**
- 그 대신 객체에 값을 설정하는 것처럼 **등호를 사용해서 값을 전달한다.**

```javascript
class Coupon {
  constructor(price, expiration) {
    this.price = price;
    this.expiration = expiration || '2주';
  }
  set halfPrice(price) {
    this.price = price / 2;
  }
}
```
- `setter`에 대응되는 `getter`가 없으면 값을 설정할 수는 있지만, 값을 가져올 수는 없다.

```javascript
const coupon = new Coupon(5);
coupon.halfPrice = 20;
coupon.halfPrice; // undefined
```

- `getter`나 `setter`의 이름과 같은 이름을 가진 속성은 둘 수 없다.
- 다음과 같이 `price` 속성이 있을 때 `setter`를 만들면 호출 스택이 무한히 쌓이게 된다.

```javascript
class Coupon {
  constructor(price, expiration) {
    this.price = price;
    this.expiration = expiration || '2주';
  }
  get price() {
    return this.price;
  }
  set price(price) {
    this.price = `$ ${price}`;
  }
}
const coupon = new Coupon(5);
// Uncaught RangeError: Maximum call stack size exceeded
```
- 해결책은 다른 속성을 `getter`와 `setter` 사이의 가교로 사용하는 것이다.
- 현재 자바스크립트에서는 비공개 속성을 지원하지 않으므로 코딩 컨벤선을 따를 수밖에 없다.
- 그렇기 때문에 자바스크립트 개발자들은 이름 앞에 밑줄을 입력해 메서드나 속성이 비공개라는 점을 표시한다. (예: `_price`)
- 이제 정수만 남기고 숫자가 아닌 문자는 모두 제거할 수 있는 `setter`를 생성할 수 있다.

```javascript
class Coupon {
  constructor(price, expiration) {
    this._price = price;
    this.expiration = expiration || '2주';
  }
  get priceText() {
    return `$${this._price}`;
  }
  get price() {
    return this._price;
  }
  set price(price) {
    const newPrice = price.toString().replace(/[^\d]/g, '');
    this._price = parseInt(newPrice, 10);
  }
  get expirationMessage() {
    return `이 쿠폰은 ${this.expiration} 후에 만료됩니다.`;
  } 
}
const coupon = new Coupon(5);
coupon.price; // 5
coupon.price = '$10';
coupon.price; // 10
coupon.priceText; // $10
```
- `getter`와 `setter`가 가져다주는 큰 이점은 복잡도를 숨길 수 있다는 점이다.
- 단점은 이와 함께 우리의 의도까지 가려진다는 점이다.
- `getter`와 `setter`는 때때로 디버깅하기가 매우 어렵고 테스트하기도 어렵다.
- 그렇기 때문에 주의해서 사용하고 충분한 테스트와 문서화를 통해 의도를 명확하게 전달해야 한다.

### 🎯 제너레이터로 이터러블 속성을 생성하라.

- 제너레이터(Generator)라는 함수를 이용하면 데이터를 한 번에 하니씩 반환할 수 있다.
- 이를 통해 깊게 중첩된 객체를 단순한 구조로 변환할 수 있다.
- 제너레이터는 클래스에만 국한되지 않고 특화된 함수이다.
- 제너레이터는 ([MDN 참고](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/function*)) 함수가 호출되었을 때 **그 즉시 끝까지 실행하지 않고 중간에 빠져나갔다가 다시 돌아올 수 있는 함수**이다.
- 제너레이터는 함수 몸체의 **실행을 즉시 끝내지 않는** 하나의 함수이다.
- 즉, 제너레이터는 다음 단계 전까지 **기본적으로 일시 정지하는 중단점이 있는 함수**이다.
- 제너레이터를 생성하려면 `function` 키워드 뒤에 별표(`*`)를 추가한다.
- 이렇게 하면 함수의 일부를 반환하는 `next()`라는 메서드에 접근할 수 있다.
- 함수 몸체 안에서는 `yield` 키워드를 이용해 정보를 반환한다.
- 함수를 실행할 때는 `next()` 메서드를 이용해서 함수가 내보낸 정보를 가져올 수 있다.
- `next()`를 호출하면 두 개의 키 `value`와 `done`이 있는 객체를 가져온다.
- 여기서 `yield`로 선언한 항목이 `value`이고, `done`은 남은 항목이 없다는 것을 알려준다.

```javascript
function* getCairoTrilogy() {
  yield '궁전 샛길';
  yield '욕망의 궁전';
  yield '설탕 거리';
}

const trilogy = getCairoTrilogy();
trilogy.next(); // {value: "궁전 샛길", done: false}
trilogy.next(); // {value: "욕망의 궁전", done: false}
trilogy.next(); // {value: "설탕 거리", done: false}
trilogy.next(); // {value: undefined, done: true}
```
- 함수를 **단계별**로 조각조각 실행할 수 있다.
- 정보의 일부만 꺼내고 다음 조각을 다른 곳에서 사용하기 위해 제너레이터를 전달해줄 수도 있다. 또한, 고차 함수의 경우처럼 다른 곳에 사용할 수 있다.
- **제너테이러가 함수를 이터러블로 바꿔줄 수 있게되었다.**
- 데이터를 한 번에 하나씩 접근하기 때문에 쉽게 이터러블을 만들 수 있다.
- 제너레이터를 이터러블로 사용할 때 반드시 `next()` 메서드를 사용해야 하는 것은 아니다.
- 이터러블이 필요한 작업은 무엇이든 가능하다.
- 아래 코드 처럼 배열에 담을려면 간단하게 펼침 연산자를 사용하면 된다.

```javascript
[...getCairoTrilogy()];
// ["궁전 샛길", "욕망의 궁전", "설탕 거리"]
```
- 아래 예제처럼 `for...of`문을 사용하여 객체에 정보를 담을 수 있다.

```javascript
const readingList = {
  '깡패단의 방문': true,
  '맨해튼 비치': false,
};
for(const book of getCairoTrilogy()) {
  readingList[book] = false;
}
readingList;
// {
//   궁전 샛길: false,
//   깡패단의 방문: true,
//   맨해튼 비치: false,
//   설탕 거리: false,
//   욕망의 궁전: false,
// }
```

- 제너레이터는 클래스에서도 사용된다.
- 제너레이터는 `getter`와 `setter`처럼 클래스에 단순한 인터페이스를 제공할 수 있다.
- 제너레이터를 사용하면 복잡한 데이터 구조를 다루는 클래스를 만들 때, 다른 개발자들이 단순한 배열을 다루는 것처럼 데이터에 접근할 수 있게 설계할 수 있다.
- 아래는 제너레이터를 사용하기 전 빈 배열을 생성하고 `family`를 담아 반환하는 메서드를 만들어야 한다.

```javascript
class FamilyTree {
  constructor() {
    this.family = {
      name: 'Seung',
      child: {
        name: 'Harang',
        child: {
          name: 'Sa',
          child: {
            name: 'In',
          },
        },
      },
    };
  }
  getMembers() {
    const family = [];
    let node = this.family;
    while(node) {
      family.push(node.name);
      node = node.child;
    }
    return family;
  }
}
const family = new FamilyTree();
family.getMembers();
// ["Seung", "Harang", "Sa", "In"]
```

- 제너레이터를 사용하면 배열에 담지 않고 데이터를 바로 반환할 수 있다.
- 게다가 사용자가 메서드 이름을 찾아볼 필요도 없으며, 가계도를 담고 있는 속성을 마치 배열인 것처럼 다룰 수 있다.
- 먼저 메서드 이름을 `getMembers()` 대신 `*` `[Symbol.iterator]()`로 바꾼다.
- `*`는 제너레이털르 생성한다는 것을 표시하고, `Symbol.iterator`는 클래스의 **이터러블에 제너레이터를 연결한다.** (맵 객체가 맵이터레이터를 가지고 있는 것과 비슷)
- 앞서 살펴본 `getCairoTrilogy()` 제너레이터와 다른 점은 **특정한 값을 명시적으로 반환하지 않는 부분이다.** 대신에 반복문의 매 회마다 `yield`로 값을 넘겨주고 반환할 것이 남아있는 한 제너레이터가 계속 진행된다.
- `family.push(node.name);`을 실행하는 대신에 우리가 해야 할 일은 결괏값을 `yield node.name`으로 넘겨주는 것뿐이다.
- 즉, 중간 단계의 배열을 사용할 필요가 없어졌다.
- 아래 코드처럼 펼침 연산자나 `for...of` 문처럼 이터러블이 필요한 작업이 있다면 클래스 인스턴스에 바로 호출해 사용할 수 있다.

```javascript
class FamilyTree {
  constructor() {
    this.family = {
      name: 'Seung',
      child: {
        name: 'Harang',
        child: {
          name: 'Sa',
          child: {
            name: 'In',
          },
        },
      },
    };
  }
  * [Symbol.iterator]() {
    let node = this.family;
    while(node) {
      yield node.name;
      node = node.child;
    }
  }
}
const family = new FamilyTree();
[...family];
// ["Seung", "Harang", "Sa", "In"]
```
- 제너레이터를 사용할 때의 이점은 다른 개발자들이 **클래스의 세부 구현 내용을 알 필요가 없다는 것이다.**

### 🎯 bind()로 문맥 문제를 해결하라.

- 문맥을 변경하는 것은 혼란을 일으실 수 있는데, `this` 키워드를 콜백이나 배열 메서드에서 사용할 떄 특히 더 문제가 될 수 있다.
- 이 문제는 클래스를 사용해도 문제가 사라지지 않는다. (첫 번째 해결 방법: [화살표 함수로 문맥 혼동을 피하라](https://github.com/saseungmin/reading_books_record_repository/tree/master/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%20%EC%BD%94%EB%94%A9%EC%9D%98%20%EA%B8%B0%EC%88%A0/Chapter%207#-%ED%99%94%EC%82%B4%ED%91%9C-%ED%95%A8%EC%88%98%EB%A1%9C-%EB%AC%B8%EB%A7%A5-%ED%98%BC%EB%8F%99%EC%9D%84-%ED%94%BC%ED%95%98%EB%9D%BC))
- 여기서 살펴볼 기법들은 객체 리터럴과 클래스에 사용할 수 있지만 클래스 문법과 사용하는 것이 좀 더 일반적이다.
- 다음은 예제를 살펴보자.

```javascript
class Validator {
  constructor() {
    this.message = '가 유효하지 않습니다.';
  }
  setInvalidMessage(field) {
    return `${field}${this.message}`;
  }
  setInvalidMessages(...fields) {
    return fields.map(this.setInvalidMessage);
  }
}
```
- `setInvalidMessages()` 메서드를 호출하면 함수는 클래스에 대한 `this` 바인딩을 생성한다.
- `setInvalidMessages()` 메서드를 살펴보면, 배열에 `map()`을 호출하면서 콜백에 `setInvalidMessage()` 메서드를 전달한다.
- 그리고 `map()` 메서드가 `setInvalidMessage()` 를 실행하면, 이때 `this`는 **클래스가 아니라 배열 메서드의 문맥(context)으로 새로운 연결을 생성한다.**

```javascript
const validator = new Validator();
validator.setInvalidMessages('도시');
// Uncaught TypeError: Cannot read property 'message' of undefined
```
- 문맥 문제는 리액트 커뮤니티에서도 쉽게 찾을 수 있는데 리액트에서 발생하는 문맥 문제를 해결하는 서로 다른 여러 가지 방법 [참고](https://www.freecodecamp.org/news/react-binding-patterns-5-approaches-for-handling-this-92c651b5af56/)
- 첫 번째 해결책은 [화살표 함수로 문맥 혼동을 피하라](https://github.com/saseungmin/reading_books_record_repository/tree/master/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%20%EC%BD%94%EB%94%A9%EC%9D%98%20%EA%B8%B0%EC%88%A0/Chapter%207#-%ED%99%94%EC%82%B4%ED%91%9C-%ED%95%A8%EC%88%98%EB%A1%9C-%EB%AC%B8%EB%A7%A5-%ED%98%BC%EB%8F%99%EC%9D%84-%ED%94%BC%ED%95%98%EB%9D%BC)에서 제안한 방법과 동일하다. 메서드를 화살표 함수로 바꾸면 화살표 함수는 **새로운 `this` 연결을 생성하지 않기 때문에** 오류가 발생하지 않는다.
- 이 방법의 유일한 단점은 클래스 문법을 사용할 때 함수를 메서드가 아니라 속성으로 옮겨야 한다는 것이다.

```javascript
class Validator {
  constructor() {
    this.message = '가 유효하지 않습니다.';
    this.setInvalidMessage = field => `${field}${this.message}`;
  }
  setInvalidMessages(...fields) {
    return fields.map(this.setInvalidMessage);
  }
}

const validator = new Validator();
validator.setInvalidMessages('도시');
// ["도시가 유효하지 않습니다."]
```
- 메서드를 생성자의 속성으로 옮기면 문맥 문제는 해결할 수 있지만 다른 문제가 발생하게 되는데 **메서드가 여기저기 정의된다는 것이다.**
- 또한, 이런 식으로 메서드를 많이 작성하다 보면 생성자가 빠르게 비대해진다.
- 더 나은 해결책은 `bind()` 메서드를 이용하는 것이다.
- 모든 함수에 사용할 수 있는 **`bind()` 메서드를 이용하면 문맥을 명시적으로 정할 수 있다.**
- 함수에서 `this`로 연결할 곳을 명시적으로 정하기 때문에 `this`로 참조된 곳을 항상 알 수 있다.

```javascript
function sayMessage() {
  return this.message;
}
const alert = {
  message: '위험해!',
};

const sayAlert = sayMessage.bind(alert);
sayAlert();
// "위험해!"
```
- 함수가 `this`를 사용할 때마다 우리가 연결한 객체로 연결될 것이다. 
- 이런 것을 **명시적 연결**이라고 부르는데, 문맥이 런타임에 자바스크립트 엔진에 의해 설정되지 않도록 우리가 직접 문맥을 선언하기 때문이다. ([참고](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/this%20%26%20object%20prototypes/ch2.md#explicit-binding))
- 이제 함수를 `this`에 연결해서 기존의 문맥에 연결할 수도 있다.

```javascript
class Validator {
  constructor() {
    this.message = '가 유효하지 않습니다.';
  }
  setInvalidMessage(field) {
    return `${field}${this.message}`;
  }
  setInvalidMessages(...fields) {
    return fields.map(this.setInvalidMessage.bind(this));
  }
}

const validator = new Validator();
validator.setInvalidMessages('도시');
// ["도시가 유효하지 않습니다."]
```

- 이 방법의 유일한 단점은 다른 메서드에서 함수를 사용하면 `bind()`로 연결해야 한다는 것이다.
- 아래 방법을 사용할 수 있다.
- 이 방법의 장점은 메서드를 원래의 위치에 그대로 유지할 수 있다는 것이다.
- 단지 생성자에서 `this`에 연결할 뿐이다.
- 이제 모든 메서드를 클래스의 몸체 한 곳에 선언할 수 있게 되었고, 속성은 생성자에서 선언하고, 문맥도 속성과 마찬가지로 생성자에서만 설정한다.

```javascript
class Validator {
  constructor() {
    this.message = '가 유효하지 않습니다.';
    this.setInvalidMessage = this.setInvalidMessage.bind(this);
  }
  setInvalidMessage(field) {
    return `${field}${this.message}`;
  }
  setInvalidMessages(...fields) {
    return fields.map(this.setInvalidMessage);
  }
}

const validator = new Validator();
validator.setInvalidMessages('도시');
// ["도시가 유효하지 않습니다."]
```
- 화살표 함수를 사용한 방식과 함수를 `this`에 연결하는 방식 모드 현재의 명세에서 잘 작동한다.
- 추후에는 **생성자 밖에서 클래스 속성을 설정할 수 있는 명세**가 도입될 것이다.
- 새로운 명세를 적용하면 **다른 메서드 옆에 화살표 함수를 속성으로 할당할 수 있게 된다.**

```javascript
class Validator {
  message = '가 유효하지 않습니다.';
  setMessage = field => `${field}${this.message}`;
  setInvalidMessages(...fields) {
    return fields.map(this.setMessage);
  }
}

const validator = new Validator();
validator.setInvalidMessages('도시');
// ["도시가 유효하지 않습니다."]
```

- 바벨은 7.0부터 클래스 속성을 지원한다. 공개 클래스 속성은 크롬 72, 비공개 클래스 속성은 크롬 74부터 지원하고, Mode.js는 버전 12부터 클래스 속성을 지원하므로 해당 버전부터는 REPL에서도 사용 가능하다.
- 문맥 연결은 비용이 클 수 있으므로 특정한 문제를 풀어야 하는 경우에만 사용하는 것이 좋다.
