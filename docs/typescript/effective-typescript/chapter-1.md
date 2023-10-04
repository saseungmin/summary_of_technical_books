---
sidebar_position: 2
sidebar_label: 1. 타입스크립트 알아보기
---

# 🐤 Chapter 1: 타입스크립트 알아보기

## 🥕 아이템 1. 타입스크립트와 자바스크립트의 관계 이해하기
타입스크립트는 문법적으로도 자바스크립트의 상위집합(superset)입니다. 자바스크립트 프로그램에 문번 오류가 없다면, 유효한 타입스크립트 프로그램이라고 할 수 있습니다. 타입스크립트는 자바스크립트의 상위집합이기 때문에 `.js` 파일에 있는 코드는 이미 타입스크립트라고 할 수 있습니다. `main.js` 파일명을 `main.ts`로 바꾼다고 해도 달라지는 것은 없습니다.   

모든 자바스크립트 프로그램이 타입스크립트라는 명제는 참이지만, 그 반대는 성립하지 않습니다. 타입스크립트 프로그램이지만 자바스크립트가 아닌 프로그램이 존재합니다. 이는 타입스크립트가 타입을 명시하는 추가적인 문법을 가지기 때문입니다.

```ts
function greet(who: string) {
  console.log('hello', who);
}
```

그러나 자바스크립트를 구동하는 노드 같은 프로그램으로 앞의 코드를 실행하면 오류를 출력합니다.   
타입 구문을 사용하는 순간부터 자바스크립트는 타입스크립트 영역으로 들어가게 됩니다.   

타입 시스템의 목표 중 하나는 런타임에 오류를 발생시킬 코드를 미리 찾아내는 것입니다. 타입스크립트가 "정적" 타입 시스템이라는 것은 바로 이런 특징을 말하는 것입니다. 타입스크립트는 타입 구문 없이도 오류를 잡을 수 있지만, 타입 구문을 추가한다면 훨씬 더 많은 오류를 찾아낼 수 있습니다. 코드의 "의도"가 무엇인지 타입 구문을 통해 타입스크립트에 알려줄 수 있기 때문에 코드의 동작과 의도가 다른 부분을 찾을 수 있습니다.   

타입스크립트 타입 시스템은 자바스크립트의 런타임 동작을 모델링합니다. 런타임 체크를 엄격하게 하는 언어를 사용해 왔다면 다음 결과들이 꽤 당황스럽게 느껴질 수 있습니다.

```ts
const x = 2 + '3'; // 정상, string 타입입니다.
const y = '2' + 3; // 정상, string 타입입니다.
```

이 예제는 다른 언어였다면 런타입 오류가 될 만한 코드입니다. 하지만 타입스크립트의 타입 체커는 정상으로 인식합니다. 두 줄 모두 문자열 "23"이 되는 자바스크립트 런타임 동작으로 모델링됩니다.   
반대로 정상 동작하는 코드에 오류를 표시하기도 합니다. 다음은 런타임 오류가 발생하지 않는 코드인데, 타입 체커는 문제점을 표시합니다.

```ts
const a = null + 7;
const b = [] + 12;
alert('hello', 'TypeScript');
```

자바스크립트의 런타임 동작을 모델링하는 것은 타입스크립트 타입 시스템의 기본 원칙입니다. 그러나 앞에서 봤던 경우들처럼 단순히 런타임 동작을 모델링하는 것뿐만 아니라 의도치 않은 이상한 코드가 오류로 이어질 수도 있다는 점까지 고려해야 합니다.   

앞서 등장한 오류들이 발생하는 근본 원인은 타입스크립트가 이해하는 값의 타입과 실제 값에 차이가 있기 때문입니다. 타입 시스템이 정적 타입의 정확성을 보장해 줄 것 같지만 그렇지 않습니다. 애초에 타입 시스템은 그런 목적으로 만들어지지도 않았습니다.

## 🥕 아이템 2. 타입스크립트 설정 이해하기
타입스크립트의 설정들은 어디서 소스 파일을 찾을지, 어떤 종류의 출력을 생성할지 제어하는 내용이 대부분입니다. 설정을 제대로 사용하려면, `noImplicitAny`와 `strictNullChecks`를 이해해야 합니다.   
`noImplicitAny`는 변수들이 미리 정의된 타입을 가져야 하는지 여부를 제어합니다. 다음 코드는 `noImplicitAny`가 해제되어 있을 때에는 유효합니다.

```ts
function add(a, b) {
  return a + b;
}
```

편집기에서 `add` 부분에 마우스를 올려 보면, 타입스크립트가 추론한 함수의 타입을 알 수 있습니다.

```ts
function add(a: any, b: any): any
```

`any` 타입을 매개변수에 사용하면 타입 체커는 속절없이 무력해집니다. `any`는 유용하지만 매우 주의해서 사용해야 합니다.
`any`를 코드에 넣지 않았지만, `any` 타입으로 간주하기 때문에 이를 암시적 `any`라고 부릅니다. 그런데 같은 코드임에도 `noImplicitAny`가 설정되어있다면 오류가 됩니다. 이 오류들은 명시적으로 `any`라고 선언해 주거나 더 분명한 타입을 사용하면 해결할 수 있습니다.

```ts
function add(a: number, b: number) {
  return a + b;
}
```

타입스크립트는 타입 정보를 가질 때 가장 효과적이기 때문에, 되도록 `noImplicitAny`를 설정해야 합니다. 그러면 타입스크립트가 문제를 발견하기 수월해지고, 코드의 가독성이 좋아지며, 개발자의 생산성이 향상됩니다.   

`strictNullChecks`는 `null`과 `undefined`가 모든 타입에서 허용되는지 확인하는 설정입니다.

```ts
const x: number = null; // 정상, null은 유효한 값입니다.
```

그러나 `strictNullChecks`를 설정하면 오류가 됩니다.

```ts
const x: number = null; // error
```

`null` 대신 `undefined`를 써도 같은 오류가 납니다. 만약 `null`을 사용하려고 한다면, 의도를 명시적으로 드러냄으로써 오류를 고칠 수 있습니다.

```ts
const x: number | null = null;
```

`strictNullChecks`는 `null`과 `undefined` 관련된 오류를 잡아내는 데 많은 도움이 되지만, 코드 작성을 어렵게 합니다. 새 프로젝트를 시작한다면 가급적 `strictNullChecks`를 설정하는 것이 좋지만, 타입스크립트가 처음이거나 자바스크립트 코드를 마이그레이션 하는 중이라면 설정하지 않아도 괜찮습니다.   
`strictNullChecks`를 설정하려면 `noImplicitAny`를 먼저 설정해야 합니다. 프로젝트가 거대해질수록 설정 변경은 어려워질 것이므로, 가능한 한 초반에 설정하는 게 좋습니다.

## 🥕 아이템 3. 코드 생성과 타입이 관계없음을 이해하기
타입스크립트 컴파일러는 두 가지 역할을 합니다.

- 최신 타입스크립트/자바스크립트를 브라우저에서 동작할 수 있도록 구버전의 자바스크립트로 트랜스파일합니다.
- 코드의 타입 오류를 체크합니다.

타입스크립트가 자바스크립트로 변환될 때 코드 내의 타입에는 영향을 주지 않습니다. 또한 그 자바스크립트의 실행 시점에도 타입은 영향을 미치지 않습니다.   

### 타입 오류가 있는 코드도 컴파일이 가능합니다
컴파일은 타입 체크와 독립적으로 동작하기 때문에, 타입 오류가 있는 코드도 컴파일이 가능합니다. 타입스크립트 오류는 C나 자바 같은 언어들의 경고와 비슷합니다. 문제가 될 만한 부분을 알려 주지만, 그렇다고 빌드를 멈추지는 않습니다.   

만약 오류가 있을 때 컴파일하지 않으려면, `tsconfig.json`에 `noEmitOnError`를 설정하거나 빌드 도구에 동일하게 적용하면 됩니다.

### 런타임에는 타입 체크가 불가능합니다.
다음처럼 코드를 작성해 볼 수 있습니다.

```ts
interface Square {
  width: number;
}
interface Rectangle extends Square {
  height: number;
}
type Shape = Square | Rectangle;

function calculateArea(shape: Shape) {
  if (shape instanceof Rectangle) {
    // ~~~~~ "Rectangle"은 형식만 참조하지만, 여기서는 값으로 사용되고 있습니다.
    return shape.width * shape.height;
    // ~~~~~ "Shape" 형식에 "height" 속성이 없습니다.
  } else {
    return shape.width * shape.width;
  }
}
```

`instanceof` 체크는 런티임에 일어나지만, `Rectangle`은 타입이기 때문에 런타임 시점에 아무런 역할을 할 수 없습니다. 타입스크립트의 타입은 제거 가능(erasable)합니다. 실제로 자바스크립트로 컴파일되는 과정에서 모든 인터페이스, 타입, 타입 구문은 그냥 제거되어 버립니다.   
앞의 코드에서 다루고 있는 `shape` 타입을 명확하게 하려면, 런타임에 타입 정보를 유지하는 방법이 필요합니다. 하나의 방법은 `height` 속성이 존재하는지 체크해 보는 것입니다.

```ts
function calculateArea(shape: Shape) {
  if ('height' in shape) {
    shape; // 타입이 Rectangle
    return shape.width * shape.height;
  } else {
    shape; // 타입이 Square
    return shape.width * shape.width;
  }
}
```

타입 정보를 유지하는 또 다른 방법으로는 런타임에 접근 가능한 타입 정보를 명시적으로 저장하는 '태그' 기법이 있습니다.

```ts
interface Square {
  kind: 'square';
  width: number;
}
interface Rectangle {
  kind: 'rectangle';
  height: number;
  width: number;
}
type Shape = Square | Rectangle;

function calculateArea(shape: Shape) {
  if (shape.kind === 'rectangle') {
    shape; // 타입이 Rectangle
    return shape.width * shape.height;
  } else {
    shape; // 타입이 Square
    return shape.width * shape.width;
  }
}
```

이 기법은 런타임에 타입 정보를 손쉽게 유지할 수 있기 때문에, 타입스크립트에서 흔하게 볼 수 있습니다. 타입(런타임 접근 불가)과 값(런타임 접근 가능)을 둘 다 사용하는 기법도 있습니다. 타입을 클래스로 만들면 됩니다.

```ts
class Square {
  constructor(public width: number) {}
}
class Rectangle extends Square {
  constructor(public width: number, public height: number) {
    super(width);
  }
}
type Shape = Square | Rectangle;

function calculateArea(shape: Shape) {
  if (shape instanceof Rectangle) {
    shape; // 타입이 Rectangle
    return shape.width * shape.height;
  } else {
    shape; // 타입이 Square
    return shape.width * shape.width;
  }
}
```

인터페이스는 타입으로만 사용 가능하지만, `Rectangle`을 클래스로 선언하면 타입과 값으로 모두 사용할 수 있으므로 오류가 없습니다.

### 타입 연산은 런타임에 영향을 주지 않습니다
값을 정제하기 위해서는 런타임의 타입을 체크해야 하고 자바스크립트 연산을 통해 변환을 수행해야 합니다.

```ts
function asNumber(val: number | string): number {
  return typeof(val) === 'string' ? Number(val) : val;
}
```

### 런타임 타임은 선언된 타임과 다를 수 있습니다.

```ts
function setLightSwitch(value: boolean) {
  switch (value) {
    case true:
      turnLightOn();
      break;
    case false:
      turnLightOff();
      break;
    default:
      console.log('실행되지 않을까 봐 걱정됩니다.');
  }
}
```

타입스크립트는 일반적으로 실행되지 못하는 죽은 코드를 찾아내지만, 여기서는 `strict`를 설정하더라도 찾아내지 못합니다. 그러면 마지막 부분을 실행할 수 있는 경우는 무엇일까요? `boolean`이 타입 선언문이라는 것에 주목하기를 바랍니다. 타입스크립트의 타입이기 때문에 `boolean`은 런타임에 제거됩니다. 자바스크립트였다면 실수로 `setLightSwitch` "ON"을 호출할 수도 있었을 것입니다.   

순수 타입스크립트에서도 마지막 코드를 실행하는 방법이 존재합니다. 예를 들어, 네트워크 호출로부터 받아온 값으로 함수를 실행하는 경우가 있습니다.

```ts
interface LightApiResponse {
  lightSwitchValue: boolean;
}
async function setLight() {
  const response = await fetch('/light');
  const result: LightApiResponse = await response.json();
  setLightSwitch(result.lightSwitchValue);
}
```

`/light`를 요청하면 그 결과로 `LightApiResponse`를 반환하라고 선언했지만, 실제로 그렇게 되리라는 보장은 없습니다. 타입스크립트에서는 런타임 타입과 선언된 타입이 맞지 않을 수 있습니다. 타입이 달라지는 혼란스러운 상황을 가능한 한 피해야 합니다. 선언된 타입이 언제든지 달라질 수 있다는 것을 명심해야 합니다.

### 타입스크립트 타입으로는 함수를 오버로드할 수 없습니다.
타입스크립트에서는 타입과 런타임의 동작이 무관하기 때문에, 함수 오버로딩은 불가능합니다.

```ts
function add(a: number, b: number) { return a + b; }
function add(a: string, b: string) { return a + b; }
```

타입스크립트가 함수 오버로딩 기능을 지원하기는 하지만, 온전히 타입 수준에서만 동작합니다. 하나의 함수에 대해 여러 개의 선언문을 작성할 수 있지만, 구현체는 오직 하나뿐입니다.

```ts
function add(a: number, b: number): number;
function add(a: string, b: string): string;

function add(a, b) {
  return a + b;
}

const three = add(1, 2);
const twelve = add('1', '2');
```

`add`에 대한 처음 두 개의 선언문은 타입 정보를 제공할 뿐입니다. 이 두 선언문은 타입스크립트가 자바스크립트로 변환되면서 제거되며, 구현체만 남게 됩니다.

### 타입스크립트 타입은 런타임 성능에 영향을 주지 않습니다
타입과 타입 연산자는 자바스크립트 변환 시점에 제거되기 때문에, 런타임의 성능에 아무런 영향을 주지 않습니다. 타입스크립트의 정적 타입은 실제로 비용이 전혀 들지 않습니다. 타입스크립트를 쓰는 대신 런타임 오버헤드를 감수하며 타입 체크를 해 본다면, 타입스크립트 팀이 다음 주의 사항들을 얼마나 잘 테스트해 왔는지 몸소 느끼게 될 것입니다.

- '런타임' 오버헤드가 없는 대신, 타입스크립트 컴파일러는 '빌드타임' 오버헤드가 있습니다. 타입스크립트 팀은 컴파일러 성능을 매우 중요하게 생각합니다. 따라서 컴파일은 일반적으로 상당히 빠른 편이며 특히 증분 빌드 시에 더욱 체감됩니다.
- 타입스크립트가 컴파일하는 코드는 오래된 런타임 환경을 지원하기 위해 호환성을 높이고 성능 오버헤드를 감안할지, 호환성을 포기하고 성능 중심의 네이티브 구현체를 선택할지의 문제에 맞닥뜨릴 수도 있습니다. 예를 들어 제너레이터 함수가 ES5 타깃으로 컴파일되려면, 타입스크립트 컴파일러는 호환성을 위한 특정 헬퍼 코드를 추가할 것입니다. 이런 경우가 제너레이터의 호환성을 위한 오버헤드 또는 성능을 위한 네이티브 구현체 선택의 문제입니다. 어떤 경우든지 호환성과 성능 사이의 선택은 컴파일 타깃과 언어 레벨의 문제이며 여전히 타입과는 무관합니다.

## 🥕 아이템 4. 구조적 타이핑에 익숙해지기
자바스크립트는 본질적으로 덕 타이핑 기반입니다. 만약 어떤 함수의 매개변수 값이 모두 제대로 주어진다면, 그 값이 어떻게 만들어졌는지 신경 쓰지 않고 사용합니다. 타입스크립트는 이런 동작, 즉 매개변수 값이 요구사항을 만족한다면 타입이 무엇인지 신경 쓰지 않는 동작을 그대로 모델링합니다.

> 덕 타이핑이란, 객체가 어떤 타입에 부합하는 변수와 메서드를 가질 경우 객체를 해당 타입에 속하는 것으로 간주하는 방식입니다. 덕 테스트에서 유래되었는데, 다음과 같은 명제로 정의됩니다. "먄약 어떤 새가 오리처럼 걷고, 헤엄치고, 꽥꽥거리는 소리를 낸다면 나는 그 새를 오리라고 부를 것이다."

물리 라이브러리와 2D 벡터 타입을 다루는 경우를 가정해 보겠습니다.

```ts
interface Vector2D {
  x: number;
  y: number;
}
```

벡터의 길이를 계산하는 함수는 다음과 같습니다.

```ts
function calculateLength(v: Vector2D) {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}
```

이제 이름이 들어간 벡터를 추가합니다.

```ts
interface NamedVector {
  name: string;
  x: number;
  y: number;
}
```

`NamedVector`는 `number` 타입의 `x`와 `y`속성이 있기 때문에 `calculateLength` 함수로 호출 가능합니다. 타입스크립트는 다음 코드를 이해할 수 있을 정도로 충분히 영리합니다.

```ts
const v: NamedVector = { x: 3, y: 4, name: 'Zee' };
calculateLength(v);
```

흥미로운 점은 `Vector2D`와 `NamedVector`의 관계를 전혀 선언하지 않았다는 것입니다. 그리고 `NamedVector`를 위한 별도의 `calculateLength`를 구현할 필요도 없습니다. 타입스크립트 타입 시스템은 자바스크립트의 런타임 동작을 모델링합니다. `NamedVector`의 구조가 `Vector2D`와 호환되기 때문에 `calculateLength` 호출이 가능합니다. 여기서 "구조적 타이핑(structural typing)"이라는 용어가 사용됩니다.   

구조적 타이핑 때문에 문제가 발생하기도 합니다.

```ts
interface Vector3D {
  x: number;
  y: number;
  z: number;
}
```

그리고 벡터의 길이를 1로 만드는 정규화 함수를 작성합니다.

```ts
function normalize(v: Vector3D) {
  const length = calculateLength(v);

  return {
    x: v.x / length,
    y: v.y / length,
    z: v.z / length,
  };
}
```

그러나 이 함수는 1보다 조금 더 긴(1.41) 길이를 가진 결과를 출력할 것입니다.

```ts
normalize({ x: 3, y: 4, z: 5});
// { x: 0.6, y: 0.8, z: 1 }
```

`calculateLength`는 2D 벡터를 기반으로 연산하는데, 버그로 인해 `normalize`가 3D 벡터로 연산되었습니다. `z`가 정규화에서 무시된 것입니다. 그런데 타입 체커가 이 문제를 잡아내지 못했습니다. `calculateLength`가 2D 벡터를 받도록 선언되었음에도 불구하고 3D 벡터를 받는 데 문제가 없었던 이유는 무엇일까요?   

`Vector3D`와 호환되는 `{ x, y, z }` 객체로 `calculateLength`를 호출하면, 구조적 타이핑 관점에서 `x`, `y`가 있어서 `Vector2D`와 호환됩니다. 따라서 오류가 발생하지 않았고, 타입 체커가 문제로 인식하지 않았습니다. (이런 경우를 오류로 처리하기 위한 설정이 존재합니다. 아이템 37 참고)   

함수를 작성할 때, 호출에 사용되는 매개변수의 속성들이 매개변수의 타입에 선언된 속성만을 가질 거라 생각하기 쉽습니다. 이러한 타입은 "봉인된" 또는 "정확한" 타입이라고 불리며, 타입스크립트 타입 시스템에서는 표현할 수 없습니다. 좋든 싫든 타입은 "열려"있습니다. (타입의 확장에 열려 있다)   

테스트를 작성할 떄는 구조적 타이핑이 유리합니다. 데이터베이스에 쿼리하고 결과를 처리하는 함수를 가정해 보겠습니다.

```ts
interface Author {
  first: string;
  last: string;
}

function getAuthors(database: PostgresDB): Author[] {
  const authorRows = database.runQuery(`SELECT FIRST, LAST FROM AUTHORS`);
  return authorRows.map((row) => ({ first: row[], last: row[1] }));
}
```

`getAuthors` 함수를 테스트하기 위해서는 모킹한 `PostgresDB`를 생성해야 합니다. 그러나 구조적 타이핑을 활용하여 더 구체적인 인터페이스를 정의하는 것이 더 나은 방법입니다.

```ts
interface DB {
  runQuery: (sql: string) => any[];
}

function getAuthors(database: DB): Author[] {
  const authorRows = database.runQuery(`SELECT FIRST, LAST FROM AUTHORS`);
  return authorRows.map((row) => ({ first: row[], last: row[1] }));
}
```

`runQuery` 메서드가 있기 때문에 실제 환경에서도 `getAuthors`에 `PostgresDB`를 사용할 수 있습니다. 구조적 타이핑 덕분에, `PostgresDB`가 `DB` 인터페이스를 구현하는지 명확히 선언할 필요가 없습니다. 테스트를 작성할 때, 더 간단한 객체를 매개변수로 사용할 수도 있습니다.

```ts
test('getAuthors', () => {
  const authors = getAuthors({
    runQuery(sql: string) {
      return [['Toni', 'Morrison'], ['Maya', 'Angelou']];
    }
  });

  expect(authors).toEqual([
    { first: 'Toni', last: 'Morrison' },
    { first: 'Maya', last: 'Angelou' },
  ]);
});
```

테스트 코드에는 실제 환경의 데이터베이스에 대한 정보가 불필요합니다. 심지어 모킹 라이브러리도 필요 없습니다. 추상화(DB)를 함으로써, 로직과 테스트를 특정한 구현(`PostgresDB`)으로부터 분리한 것입니다.   
테스트 이외에 구조적 타이핑의 또 다른 장점은 라이브러리 간의 의존성을 완벽히 분리할 수 있다는 것입니다.

## 🥕 아이템 5. `any` 타입 지양하기
타입스크립트의 타입 시스템은 점진적이고 선택적입니다.   
코드에 타입을 조금씩 추가할 수 있기 때문에 점진적이며, 언제든지 타입 체커를 해제할 수 있기 때문에 선택적입니다. 이 기능들의 핵심은 `any`타입입니다.

```ts
let age: number;
age = '12'; // 형식은 number이기 때문에 할당할 수 없습니다.
age = '12' as any; // OK
```

일부 특별한 경우를 제외하고는 `any`를 사용하면 타입스크립트의 수많은 장점을 누릴 수 없습니다. 부득이하게 `any`를 사용하더라도 그 위험성을 알고 있어야 합니다.

### `any` 타입에는 타입 안전성이 없습니다.
타입 체거는 선언에 따라 `number` 타입으로 판단할 것이고 혼돈은 걷잡을 수 없게 됩니다.

```ts
age += 1; // 런타임에 정상, age는 "121"
```

### `any`는 함수 시그니처를 무시해 버립니다.
함수를 작성할 때는 시그니처를 명시해야 합니다. 호출하는 쪽은 약속된 타입의 입력을 제공하고, 함수는 약속된 타입의 출력을 반환합니다. 그러나 `any`타입을 사용하면 이런 약속을 어길 수 있습니다.

```ts
function calculateAge(birthDate: Date): number {
  // ...
}

let birthDate: any = '1990-01-19';
calculateAge(birthDate); // 정상
```

`any`타입을 사용하면 `calculateAge`의 시그니처를 무시하게 됩니다.

### `any`타입에는 언어 서비스가 적용되지 않습니다.
어떤 심벌에 타입이 있다면 타입스크립트 언어 서비스는 자동완성 기능과 적절한 도움말을 제공합니다. 그러나 `any`타입인 심벌을 사용하면 아무런 도움을 받지 못합니다.   
타입스크립트의 모토는 "확장 가능한 자바스크립트"입니다. "확장"의 중요한 부분은 바로 타입스크립트 경험의 핵심 요소인 언어 서비스입니다. 언어 서비스를 제대로 누려야 독자 여러분과 동료의 생산성이 향상됩니다.

### `any`타입은 코드 리팩터링 때 버그를 감춥니다.
어떤 아이템을 선택할 수 있는 웹 애플리케이션을 만든다고 가정해 보겠습니다.

```ts
interface ComponentProps {
  onSelectItem: (item: any) => void;
}
```

다음과 같이 `onSelectItem` 콜백이 있는 컴포넌트를 사용하는 코드도 있을 겁니다.

```ts
function renderSelector(props: ComponentProps) { /* ... */ }

let selectedId: number = 0;

function handleSelectItem(item: any) {
  selectedId = item.id;
}

renderSelector({ onSelectItem: handleSelectItem });
```

`onSelectItem`에 아이템 객체를 필요한 부분만 전달하도록 컴포넌트를 개선해 보겠습니다. 여기서는 `id`만 필요합니다. `ComponentProps`의 시그니처를 다음처럼 변경합니다.

```ts
interface ComponentProps {
  onSelectItem: (id: number) => void;
}
```

`handleSelectItem`은 `any` 매개변수를 받습니다. 따라서 `id`를 전달받아도 문제가 없다고 나옵니다. `id`를 전달받으면, 타입 체커를 통과함에도 불구하고 런타임에는 오류가 발생할 겁니다. `any`가 아니라 구체적인 타입을 사용했다면, 타입 체커가 오류를 발견했을 겁니다.

### `any`는 타입 설계를 감춰버립니다.
객체를 정의할 때 특히 문제가 되는데, 상태 객체의 설계를 감춰버리기 때문입니다. 깔끔하고 정확하고 명료한 코드 작성을 위해 제대로 된 타입 설계는 필수입니다. `any` 타입을 사용하면 타입 설계가 불분명해집니다. 설계가 잘 되었는지, 설계가 어떻게 되어 있는지 전혀 할 수 없습니다. 만약 동료가 코드를 검토해야 한다면, 동료는 애플리케이션의 상태를 어떻게 변경했는지 코드부터 재구성해 봐야 할 겁니다. 그러므로 설계가 명확히 보이도록 타입을 일일이 작성하는 것이 좋습니다.

### `any`는 타입시스템의 신뢰도를 떨어뜨립니다.
사람은 항상 실수를 합니다. 보통은 타입 체커가 실수를 잡아주고 코드의 신뢰도가 높아집니다. 그러나 런타임에 타입 오류를 발견하게 된다면 타입 체커를 신뢰할 수 없을 겁니다. `any` 타입을 쓰지 않으면 런타임에 발견될 오류를 미리 잡을 수 있고 신뢰도를 높일 수 있습니다.   
