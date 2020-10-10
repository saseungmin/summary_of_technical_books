## 🌈 Chapter 8 : 클래스로 인터페이스를 간결하게 유지하라.

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