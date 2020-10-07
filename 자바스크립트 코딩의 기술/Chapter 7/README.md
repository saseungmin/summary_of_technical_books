## 🌈 Chapter 7 : 유연한 함수를 만들어라.

### 🎯 테스트하기 쉬운 함수를 작성하라.
- 테스트를 작성하면 코드를 쉽게 리팩토링할 수 있고, 오래된 코드를 훨씬 쉽게 이해할 수 있다.
- 또한, 일반적으로 더 명확하고 버그가 적은 애플리케이션을 만들 수 있다.
- **테스트 가능한 코드를 작성**하면 코드가 점차 **개선**되고, 테스트를 **작성하기 쉬워**지며, **사용자 경험도 개선**될 것이다.
- 대표적인 테스트 프레임워크인 [재스민(Jasmine)](https://jasmine.github.io/), [모카(Mocha)](https://mochajs.org/), [제스트(Jest)](https://jestjs.io/) 가 있다. ([모카 추가 참고](https://ko.javascript.info/testing-mocha))
- 이 책의 예제 코드를 위해 작성된 테스트 코드는 테스트 실행기로 모카를 사용하고 있다.
- 아래는 조금 복잡한 코드이다.
```javascript
import { getTaxInformation } from './taxService';

function formatPrice(user, { price, location }) {
  const rate = getTaxInformation(location); // <label id="test.external" />
  const taxes = rate ? `추가 세금 $${price * rate}` : '추가 세금';

  return `${user}님의 함께 금액: $${price} 및 ${taxes}`; 
}

export { formatPrice };
```
- 테스트할 때 어려운 부분은 `const rate = getTaxInformation(location);`이 부분으로 외부 함수를 호출할 때 시작된다.
- 불러온 함수를 직접 사용할 때는 테스트하려는 함수가 불러온 함수와 밀접하게 결합되는 문제가 있다.
- 즉, 테스트를 실행할 때 테스트가 외부 API에도 접근해야 하며, 그 결과 테스트는 네트워크 접근, 응답 시간 등에 의존하게 된 것이다.
- 이 문제를 피하려면 모의 객체(mock)를 생성해서 **함수를 가로채고 명시적은 반환값을 설정**하게 만들어야 한다.

```javascript
import expect from 'expect';

import sinon from 'sinon';
import * as taxService from './taxService';
import { formatPrice } from './problem';

describe('가격 표시', () => {
  let taxStub;

  beforeEach(() => {
    // getTaxInformation 함수를 덮어 써서 간단한 반환값이 되도록 스텁(stub)을 생성한다.
    // 스텁을 만들 때 불러온 코드는 건너뛰기 때문에 실제 코드를 실행하지 않고 출력될 값만 선언한다.
    // 스텁을 사용할 때 장점은 어떤 종류든 외부 의존성을 걱정할 필요가 없다.
    taxStub = sinon.stub(taxService, 'getTaxInformation'); // <label id="test.stub" />
  });

  // 테스트 꾸러미가 종료되면 원래의 메서드를 사용하도록 코드를 복구해줘야 한다.
  // 코드를 복구하는 것은 필수 단계이다.
  afterEach(() => {
    taxStub.restore(); // <label id="test.restore" />
  });

  it('세금 정보가 없으면 세금 추가를 안내해야 한다', () => {
    // 스텁을 사용한 예
    taxStub.returns(null); // <label id="test.stub2" />
    const item = { price: 30, location: 'Oklahoma' };
    const user = 'Aaron Cometbus';
    const message = formatPrice(user, item);
    const expectedMessage = 'Aaron Cometbus님의 합계 금액: $30 및 추가 세금';
    expect(message).toEqual(expectedMessage);
  });

  it('세금 정보가 있으면 세금 금액을 알려줘야 한다', () => {
    taxStub.returns(0.1);

    const item = { price: 30, location: 'Oklahoma' };
    const user = 'Aaron Cometbus';
    const message = formatPrice(user, item);
    const expectedMessage = 'Aaron Cometbus님의 합계 금액: $30 및 추가 세금 $3';
    expect(message).toEqual(expectedMessage);
  });
});
```
- 테스트 코드에 스파이(spy), 모의 객체, 스텁과 같은 여러 가지 외부 헬퍼를 사용하고 있다면, 코드가 복잡하고 강하게 결합되어 있다는 증거로 코드를 단순화해야 한다.
- 이럴 경우 외부 함수를 인수로 전달하도록 바꾸기만 하면 된다.
- 의존성을 인수로 전달하는 것을 [**의존성 주입(dependency injection)**](https://wiki.cys.wo.tc/doku.php?id=javascript%EC%97%90%EC%84%9C%EC%9D%98_%EC%9D%98%EC%A1%B4%EC%84%B1_%EC%A3%BC%EC%9E%85)이라고 한다.
- 코드의 결합을 제거하려면 `getTaxInformation()`을 인수로 전달하는 것만으로 충분하다.
  
```javascript
function formatPrice(user, { price, location }, getTaxInformation) {
  const rate = getTaxInformation(location);
  const taxes = rate ? `추가 세금 $${price * rate}` : '추가 세금';

  return `${user}님의 함께 금액: $${price} 및 ${taxes}`; 
}

export { formatPrice };
```
- 위와 같이 하면 의존성 주입을 사용하기 때문에 스텁이 필요하지 않게 된다.
- 특정한 입력값을 받은 `formatPrice()`가 특정한 결과를 반환하는지 테스트한다.

```javascript
import expect from 'expect';

import { formatPrice } from './test';

describe('가격 표시', () => {
  it('세금 정보가 없으면 세금 추가를 안내해야 한다', () => {
    const item = { price: 30, location: 'Oklahoma' };
    const user = 'Aaron Cometbus';
    const message = formatPrice(user, item, () => null);
    expect(message).toEqual('Aaron Cometbus님의 합계 금액: $30 및 추가 세금');
  });

  it('세금 정보가 있으면 세금 금액을 알려줘야 한다', () => {
    const item = { price: 30, location: 'Oklahoma' };
    const user = 'Aaron Cometbus';
    const message = formatPrice(user, item, () => 0.1);
    expect(message).toEqual('Aaron Cometbus님의 합계 금액: $30 및 추가 세금 $3');
  });
});
```
- 테스트 대상인 함수와 `expect`라이브러리 외에는 아무것도 필요하지 않다. 테스트 코드를 작성하기가 더 쉬워졌고, 코드가 단일 책임을 갖도록 책임을 줄이는 면에서도 더욱 효과적이다.
- 코드에는 몇 가지 부수 효과와 입출력이 있을 수 있다. 이러한 부분은 최대한 적게 사용하는 것이 테스트 가능한 코드를 작성하는 묘수이다.
- 만약 **테스트 코드를 작성하기 어렵다면 코드를 변경해야 한다.**
- [자바스크립트 테스트에서 발생하는 다른 문제](https://www.toptal.com/javascript/writing-testable-code-in-javascript)