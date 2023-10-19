---
sidebar_label: 7. 유연한 함수를 만들어라.
sidebar_position: 8
---

# 🌈 Chapter 7 : 유연한 함수를 만들어라.

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
- 이 문제를 피하려면 모의 객체(mock)를 생성해서 **함수를 가로채고 명시적인 반환값을 설정**하게 만들어야 한다.

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
- 테스트 코드에 스파이(spy), 모의 객체, 스텁과 같은 여러 가지 외부 헬퍼를 사용하고 있다면, 코드가 복잡하고 강하게 결합해 있다는 증거로 코드를 단순화해야 한다.
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

### 🎯 화살표 함수로 복잡도를 낮춰라.
- 아래의 코드를 화살표 함수로 변경해 보자.

```javascript
const myinfo = {
  first: 'seungmin',
  last: 'sa',
  city: 'Daejoen',
  state: 'still studying'
};
// 해체 할당 사용
function getName({ first, last }) {
  return `${first} ${last}`;
}
```

- 매개변수에서 **해체 할당, 나머지 매개변수, 매개변수 기본값** 등을 사용하는 특별한 매개변수의 경우에는 **괄호를 포함**해야 한다.
- 괄호가 없으면 자바스크립트 엔진은 우리가 객체 선언이 아니라 함수 선언을 한다는 것을 잘 알지 못한다.

```javascript
const getName = { first, last } => `${first} ${last}`;
// Uncaught SyntaxError: Malformed arrow function parameter list
// 잘못된 화살표 함수 매개변수 목록
const getName = ({ first, last }) => `${first} ${last}`;
getName(myinfo);
// "seungmin sa"
```
- 화살표 함수에서 **객체를 반환하는 경우**에 `return`문을 생략한다면 화살표 함수에서 화살표 우측에 있는 중괄호는 객체를 나타내는 것인지, 아니면 함수 몸체를 감싸는 것인지 구분하기 어렵다.
- 따라서 객체를 반환하는 경우에는 **객체를 괄호로 감싸야 한다.**

```javascript
const getName = ({ first, last }) => ({ fullName: `${first} ${last}` });
getName(myinfo);
// {fullName: ""seungmin sa""}
```
- 괄호를 사용해서 값을 반환할 때는 코드를 여러 줄에 걸쳐 작성할 수 있다.
- `return` 문을 생략하는 동시에 반환값을 여러 줄로 작성할 수 있다.

```javascript
const getNameAndLocation = ({ first, last, city, state }) => ({
  fullName: `${first} ${last}`,
  location: `${city} ${state}`,
});
getNameAndLocation(myinfo);
// {fullName: "seungmin sa", location: "Daejoen still studying"}
```
- 화살표 함수는 다른 함수를 반환하는 함수인 [**고차 함수(Higher-Order Function)**](https://velog.io/@jakeseo_me/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EA%B0%9C%EB%B0%9C%EC%9E%90%EB%9D%BC%EB%A9%B4-%EC%95%8C%EC%95%84%EC%95%BC-%ED%95%A0-33%EA%B0%80%EC%A7%80-%EA%B0%9C%EB%85%90-22-%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EA%B3%A0%EC%B0%A8-%ED%95%A8%EC%88%98Higher-Order-Function-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0)를 만드는 데 좋다.

```javascript
const discounter = discount => {
  return price => {
    return price * (1 - discount);
  };
};
const tenPercentOff = discounter(0.1);
tenPercentOff(100);
// 90
```
- return 없이 중괄호 없이 함수를 반환할 수 있다.

```javascript
const discounter = discount => price => price * (1 - discount);

const tenPercentOff = discounter(0.1);
tenPercentOff(100);
// 90
```
- 고차 함수는 매개변수를 가두는 데 사용할 수 있을 뿐만 아니라, 배열 메서드와 나머지 매개변수에도 도움을 줄 수 있다.
- 아래 방법은 고차 함수를 **두 개의 다른 매개변수 집합을 가진 단일 함수로 변환할 때 필수적으로 사용한다.**

```javascript
discounter(0,1)(100);
// 90
```

### 🎯 부분 적용 함수로 단일 책임 매개변수를 관리하라.
- 고차 함수는 매개변수를 가두는 방법을 통해 특별한 값을 제공하므로, **나중에 원래의 인수에 접근할 수 있게 해두고 함수 실행을 마칠 수 있다.**
- 또한, **매개변수를 분리**해 함수의 의도를 명확하게 유지할 수 있다.
- **부분 적용 함수(partially applied function)**를 사용할 경우, 일부 매개변수를 전달하면 **해당 매개변수를 잠그는 함수가 반환**되어 여기에 더 많은 매개변수를 사용할 수 있다.
- 즉, 부분 적용 함수를 이용하면 한 번에 전달해야 할 함수 인수의 수가 줄어드는 대신 인**수를 더 전달해야 하는 다른 함수를 반환한다.**
- 그렇기 때문에 **서로 독립적인 여러 매개변수 집합**을 둘 수 있다. (단일 책임을 지게 된다.)
- 다음은 예제 객체 정보이다.
```javascript
const building = {
  hours: '8 a.m. - 8 p.m.',
  address: 'Jayhawk Blvd',
};
const manager = {
  name: 'Augusto',
  phone: '555-555-5555',
};
const program = {
  name: 'Presenting Research',
  room: '415',
  hours: '3 - 6',
};
const exhibit = {
  name: 'Emerging Scholarship',
  contact: 'Dyan',
};
```
- 아래는 `building`, `manager`, `program`또는 `exhibit`의 세 가지 인수를 받아 하나의 정보 집합으로 결합하는 함수이다.

```javascript
function mergeProgramInfomation(building, manager, event) {
  const { hours, address } = building;
  const { name, phone } = manager;
  const defaults = {
    hours,
    address,
    contact: name,
    phone,
  };

  return { ...defaults, ...event };
}
```
- 코드를 살펴보면, 함수를 호출할 때마다 전달하는 첫 번째 매개변수는 building으로 항상 동일하다. 이 함수를 반복해서 호출하고 있다.
- 그렇기 때문에 **이런 반복은 함수가 자연스럽게 분리될 수 있다는 것이다.**

```javascript
const programInfo = mergeProgramInfomation(building, manager, program);
const exhibitInfo = mergeProgramInfomation(building, manager, exhibit);
```
- 위 코드를 **고차 함수를 이용해서 단일 책임 매개변수**를 만들면 앞에 위치한 두 개의 인수를 재사용할 수 있다.
- 외부 함수는 매개변수로 `building`과 `manager`만 갖고, 이 함수를 실행하면 매개변수로 `program` 하나만 사용하는 함수를 반환하도록 만들어야 한다.

```javascript
function mergeProgramInfomation(building, manager) {
  const { hours, address } = building;
  const { name, phone } = manager;
  const defaults = {
    hours,
    address,
    contact: name,
    phone,
  };

  return program => {
    return { ...defaults, ...program };
  }
}
```
- 다음과 같이 호출할 수 있다.

```javascript
const programInfo = mergeProgramInfomation(building, manager)(program);
// {
//   address: "Jayhawk Blvd",
//   contact: "Augusto",
//   hours: "3 - 6",
//   name: "Presenting Research",
//   phone: "555-555-5555",
//   room: "415",
// }
const exhibitInfo = mergeProgramInfomation(building, manager)(exhibit);
// {
//   address: "Jayhawk Blvd",
//   contact: "Dyan",
//   hours: "8 a.m. - 8 p.m.",
//   name: "Emerging Scholarship",
//   phone: "555-555-5555",
// }
```
- 매개변수에 단일 책임을 부여하기는 했지만 반복까지 제거되지는 못했기 때문에 부분 적용을 사용하면 문제를 해결할 수 있다. (다음 팁에서)
- 부분 적용과 고차 함수를 사용해 매개변수에 단일 책임을 부여하는 데는 **나머지 매개변수를 재사용할 수 있기 때문이다.**
- 배열에 데이터가 있거나 원본 데이터에 일대일로 대응되는 추가 데이터가 있는 경우 사용하면 좋다.

```javascript
const birds = ['meadowlark', 'robin', 'roadrunner'];
const zip = (...left) => (...right) => {
  return left.map((item, i) => [item, right[i]]);
};
zip('kansas', 'wisconsin', 'new mexico')(...birds);
// [
//   ["kansas", "meadowlark"],
//   ["wisconsin", "robin"],
//   ["new mexico", "roadrunner"]
// ]
```

### 🎯 커링과 배열 메서드를 조합한 부분 적용 함수를 사용하라.
- 이전 고차 함수와 부분 적용을 이용해 매개변수에 단일 책임을 부여하는 방법으로 관련이 없는 매개변수로 인한 문제는 해결했지만, 같은 매개변수를 반복해서 사용하는 문제는 해결할 수 없었다.
- 고차 함수를 사용하면 값을 한 번 저장한 후 나중에 사용할 수 있는 새로운 함수를 만들어서 반복을 피할 수 있다.
- 고차 함수에서 반환된 함수는 바로 다시 호출할 필요가 없다. 고차 함수를 **한 번 호출하면 계속해서 사용할 수 있는 새로운 함수가 반환되기 때문이다.**
- 마치 인수를 하드 코딩해둔 함수를 작성하는 것과 같다.
- 이전에 사용했던 예제 코드를 재사용한다.

```javascript
const setStrongHallProgram = mergeProgramInfomation(building, manager);
const programInfo = setStrongHallProgram(program);
const exhibitInfo = setStrongHallProgram(exhibit);
```
- 고차 함수를 이용하면 매개변수를 별도로 분리할 수 있다. 그렇지만 함수를 완전히 분리하기 전에 **함수에 필요한 인수의 수를 줄일 수 있도록 인수를 분리하는 것이 훨씬 더 좋다.**
- 한 번에 인수를 하나만 받는 함수를 [**커링(currying)**](https://ko.javascript.info/currying-partials) 이라고 하며, 이는 하나의 인수만 전달하는 메서드를 다룰 때 매우 유용하다.
- [자바스크립트는 순수한 형태의 커링을 완벽하게 지원하지는 않지만](https://2ality.com/2017/11/currying-in-js.html), 부분 적용을 이용해서 일련의 단일 매개변수로 매개변수 숫자를 줄이는 방법이 일반적이다.

> #### 📌 커링과 부분 적용
> - 부분 적용(partial application) 함수는 매개변수를 여러 번 받을 수 있다.
> - 부분 적용 함수와 커링 함수는 모두 **원래보다 필요한 인수의 수가 적은 함수를 반환해 인수 수를 줄일 수 있다.**
> - 함수에는 함수가 받을 수 있는 전체 인수의 수가 있으며 **항수**라고 부른다.
> - 부분 적용 함수는 원래의 함수보다 항수가 적은 함수를 반환한다.
> 인수가 총 세 개 필요한 경우에 함수는 세 개의 인수가 필요했지만, 여기에 부분 적용 함수를 이용하면 **항수가 하나인 함수를 반환**한다.
> - 반면 커링 함수는 여러 개의 인수를 받는 함수에서 **정확히 인수 하나만 받는 일련의 함수를 반환할 때 사용한다.**
> 가령 인수 세 개가 필요한 함수가 있다면, 먼저 **인수 하나를 받는 고차 함수가 다른 함수를 반환하고, 반환된 함수도 인수 하나를 받는다.**
> 이 함수에서 끝으로 인수 하나를 받는 마지막 함수가 반환된다.

- 다음 객체 배열 예제를 사용해 보자.

```javascript
const dogs = [
  {
    이름: '맥스',
    무게: 10,
    견종: '보스턴테리어',
    지역: '위스콘신',
    색상: '검정색',
  },
  {
    이름: '도니',
    무게: 90,
    견종: '레브라도레트리버',
    지역: '캔자스',
    색상: '검정색',
  },
  {
    이름: '섀도',
    무게: 40,
    견종: '래트라도레트리버',
    지역: '위스콘신',
    색상: '갈색',
  },
]
```

- 아래 코드는 강아지 배열과 필터 조건을 인수로 받은 후 필터링 조건에 맞는 강아지의 이름만 모아서 반환하는 함수이다.

```javascript
function getDogNames(dogs, filter) {
  const [key, value] = filter;
  return dogs
    .filter(dog => dog[key] === value)
    .map(dog => dog['이름']);
}

getDogNames(dogs, ['색상', '검정색']); // ["맥스", "도니"]
```
- 위 코드는 두 가지 문제가 있다.
- 첫째, 필터 함수에 제약이 있다. 필터 함수는 필터와 각각의 강아지를 정확하게 비교할 때만 정상적으로 작동한다. 
- 둘째, 모든 배열 메서드와 마찬가지로 `map()`은 검사하는 항목만 인수로 받을 수 있기 때문에 유효 범위 내의 다른 변수들을 가져올 방법이 필요하다.
`map()`은 다른 함수 내부의 함수이므로 이를 감싸고 있는 함수의 변수에 접근할 수 있다.
즉, **매개변수를 이용해서 외부 함수에 필요한 변수를 전달할 방법**이 필요하다.
- 첫 번째 문제는 비교 함수를 하드 코딩하지 않고 필터 함수에 콜백 함수로 전달하여 해결 할 수 있다.

```javascript
function getDogNames(dogs, filterFunc) {
  return dogs
    .filter(filterFunc)
    .map(dog => dog['이름'])
}

getDogNames(dogs, dog => dog['무게'] < 20);
// ["맥스"]
```
- 하지만 숫자 `20`과 같은 값을 하드 코딩하고 있다. 즉, 변수를 사용할 때 직접 코딩해서 넣거나 유효 범위의 충돌이 없는지 확인하는 절차를 거치고 있다.
- 그렇기 때문에 부분 적용 함수를 **변수에 할당해서 다른 함수에 데이터를 전달하는 방법으로 나머지 인수**를 제공할 수 있다.
- 이렇게 하면 서로 다른 무게를 기준으로 해도 계속해서 함수를 재사용할 수 있다.
- 유효 범위 충돌이 발생할 가능성도 거의 없다.

```javascript
const weightCheck = weight => dog => dog['무게'] < weight;

getDogNames(dogs, weightCheck(20));
// ["맥스"]
getDogNames(dogs, weightCheck(50));
// ["맥스", "섀도"]
```

- 커링 함수를 사용하면 여러 지점에서 다양한 매개변수를 전달할 수 있다. 또한, 함수를 데이터로 전달할 수도 있다.
- 중요한 부분은 반드시 **두 개의 함수와 두 개의 인수 집합으로 제한할 필요가 없다는 점**으로 커링을 사용해 원래의 비교 함수를 다시 작성할 수 있다.

```javascript
const identity = field => value => dog => dog[field] === value;
const colorCheck = identity('색상');
const stateCheck = identity('지역');

getDogNames(dogs, colorCheck('갈색'));
// ["섀도"]
getDogNames(dogs, stateCheck('캔자스'));
// ["섀도"]
```
- 특정한 요구 사항이 있는 함수를 가져와서 여러 가지 다른 비교를 할 수 있도록 추상화를 만들 수 있다.
- 부분 적용 함수를 변수에 할당할 수 있고, 이 변수를 데이터로 전달할 수도 있다
- 즉, 간단한 도구 모음을 사용해서 매우 정교하게 비교할 수 있다.

```javascript
function allFilters(dogs, ...checks) {
  return dogs
    .filter(dog => checks.every(check => check(dog)))
    .map(dog => dog['이름']);
}

allFilters(dogs, colorCheck('검정색'), stateCheck('캔자스'));
// ["도니"]

function anyFilters(dogs, ...checks) {
  return dogs
    .filter(dog => checks.some(check => check(dog)))
    .map(dog => dog['이름']);
}

anyFilters(dogs, weightCheck(20), colorCheck('갈색'));
// ["맥스", "섀도"]
```

### 🎯 화살표 함수로 문맥 혼동을 피하라.
- 문맥은 함수 또는 클래스에서 `this` 키워드가 참조하는 것이기도 하다.
- [**유효 범위**와 **문맥**](http://ryanmorr.com/understanding-scope-and-context-in-javascript/)은 파악하기가 어렵기도 하지만, 혼동하는 개념이기도 하다.
- **유효 범위(scope)는 함수와 연관**되어 있고, **문맥(context)은 객체와 연관**되어 있다는 것이다.

```javascript
const validator = {
  message: '는 유효하지 않습니다.',
  setInvalidMessage(field) {
    return `${field}${this.message}`;
  },
};

validator.setInvalidMessage('도시');
// 도시는 유효하지 않습니다.
```
- 위 예제 코드에서 `this.message`는 해당 **객체의 속성**을 참조한다.
- 이렇게 작동하는 이유는 객체에서 `setInvalidMessage()` 메서드가 호출될 때 함수에서 **`this` 바인딩을 생성**하면서 해당 **함수가 담긴 객체도 문맥(context)에 포함**시키기 때문이다.
- 객체에서 `this`를 다룰 때는 일반적으로 큰 문제가 없지만, **객체에 담긴 함수를 다른 함수의 콜백 함수로 사용하는 경우**에는 주의가 필요하다.
- 예를 들어 `setTimeout()`, `setInterval()` 메서드나 `map()`, `filter()` 메서드 등 자주 사용하는 배열 메서드를 사용할 때 문제가 발생할 수 있다.
- 이 함수들은 **콜백 함수를 받으면서 콜백 함수의 문맥도 변경**한다.

```javascript
const validator = {
  message: '는 유효하지 않습니다.',
  setInvalidMessages(...fields) {
    return fields.map(function (field) {
      return `${field}${this.message}`;
    });
  },
};
```
- 여기서 문제는 함수를 호출하면 `TypeError` 또는 `undefined`를 받는다는 것이다.

```javascript
validator.setInvalidMessages('도시');
// ["도시undefined"]
```
- 함수를 호출할 때마다 **호출되는 위치를 바탕**으로 `this` 바인딩을 만든다.
- 처음 작성했던 `setInvalidMessage()`는 객체를 문맥으로 해서 호출되었지만, 여기서는 `this`의 문맥이 해당 객체였다.
- `map()` 메서드에 **콜백 함수로 전달한 경우**에는 `map()` 메서드의 **문맥에서 호출되므로** 이 경우에는 **`this` 바인딩이 `validator` 객체가 아니다.**
- 이때의 **문맥은 전역 객체가 된다.** 브라우저에서는 `window`가, Node.js REPL 환경에서는 `global`이 된다.
- 즉, 콜백 함수로 전달되면 `message` 속성에 접근할 수 없게 된다.
- 화살표 함수를 이용하면 이런 문제를 해결할 수 있다.
- 화살표 함수는 함수를 호출할 때 `this` 바인딩을 **새로 만들지 않기 때문에**, 화살표 함수를 이용해서 `map()` 콜백을 다시 작성하면 의도대로 작동하게 된다.

```javascript
const validator = {
  message: '는 유효하지 않습니다.',
  setInvalidMessages(...fields) {
    return fields.map(field => {
      return `${field}${this.message}`;
    });
  },
};

validator.setInvalidMessages('도시');
// ["도시는 유효하지 않습니다."]
```

- 그렇지만 `this` 문맥(context)을 직접 설정해야 할 때도 있다.
- 예를 들어 다음 예제 코드처럼 원래의 `setInvalidMessages()` 메서드를 명명된 메서드가 아니라 속성에 할당한 화살표 함수로 작성한 경우에는 어떻게 해야 할까??

```javascript
const validator = {
  message: '는 유효하지 않습니다.',
  setInvalidMessages: field => `${field}${this.message}`,
};

validator.setInvalidMessages('도시');
// "도시undefined"
```
- 이 경우에는 오류가 발생하게 된다. 현재 객체에 대해 새로운 `this` 문맥 바인딩을 만들지 않았다.
- **새로운 문맥을 만들지 않았기 때문에 전역 객체에 바인딩 된 것이다.**
- 정리하면 화살표 함수는 **이미 문맥이 있고 다른 함수 내부에서 이 함수를 사용하려고 할 때** 유용하다.
