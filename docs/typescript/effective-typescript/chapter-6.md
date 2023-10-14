---
sidebar_position: 7
sidebar_label: 6. 타입 선언과 `@types`
---

# 🐤 Chapter 6. 타입 선언과 `@types`

## 🥕 아이템 45. devDependencies에 typescript와 `@types` 추가하기
npm(node package manager)은 세 가지 종류의 의존성을 구분해서 관리하며, 각각의 의존성은 package.json 파일 내의 별도 영역에 들어 있습니다.

- dependencies
현재 프로젝트를 실행하는 데 필수적인 라이브러리들이 포함됩니다. 프로젝트의 런타임에 lodash가 사용된다면 dependencies에 포함되어야 합니다.

- devDependencies
현재 프로젝트를 개발하고 테스트하는 데 사용되지만, 런타임에는 필요 없는 라이브러리들이 포함됩니다. 예를 들어, 프로젝트에서 사용 중인 테스트 프레임워크가 devDependencies에 포함될 수 있는 라이브러리입니다. 프로젝트를 npm에 공개하여 다른 사용자가 해당 프로젝트를 설치한다면, devDependencies에 포함된 라이브러리들은 제외됩니다.

- peerDependencies
런타임에 필요하긴 하지만, 의존성을 직접 관리하지 않는 라이브러리들이 포힘됩니다.

타입스크립트는 개발 도구일 뿐이고 타입 정보는 런타임에 존재하지 않기 때문에 타입스크립트와 관련된 라이브러리는 일반적으로 devDependencies에 속합니다.   

모든 타입스크립트 프로젝트에서 공통적으로 고려해야 할 의존성 두 가지를 살펴보겠습니다.   
첫 번째, 타입스크립트 자체 의존성을 고려해야 합니다. 타입스크립트를 시스템 레벨로 설치할 수도 있지만 다음 두 가지 이유 때문에 추천하지는 않습니다.
- 팀원들 모두가 항상 동일한 버전을 설치한다는 보장이 없습니다.
- 프로젝트를 셋업할 때 별도의 단계가 추가됩니다.

따라서 타입스크립트를 시스템 레벨로 설치하기보다는 devDependencies에 넣는 것이 좋습니다.   

두 번째, 타입 의존성(`@types`)을 고려해야 합니다. 사용하려는 라이브러리에 타입 선언이 포함되어 있지 않더라도, [Definitely/Typed](https://github.com/DefinitelyTyped/DefinitelyTyped)에서 타입 정보를 얻을 수 있습니다.   

원본 라이브러리 자체가 dependencies에 있더라도 `@types` 의존성은 devDependencies에 있어야 합니다.

## 🥕 아이템 46. 타입 선언과 관련된 세 가지 버전 이해하기
타입스크립트는 알아서 의존성 문제를 해결해 주기는커녕, 의존성 관리를 오히려 더 복잡하게 만듭니다. 왜냐하면 타입스크립트를 사용하면 다음 세 가지 사항을 추가로 고려해야 하기 때문입니다.
- 라이브러리의 버전
- 타입 선언(`@types`)의 버전
- 타입스크립트의 버전

세 가지 버전 중 하나라도 맞지 않으면, 의존성과 상관없어 보이는 곳에서 엉뚱한 오류가 발생할 수 있습니다.   

타입스크립트에서 일반적으로 의존성을 관리하는 방식은 다음과 같습니다. 특정 라이브러리를 dependencies로 설치하고, 타입 정보는 devDependencies로 설치합니다.

```bash
$ npm install react
+ react@16.8.6

$ npm install --save-dev @types/react
+ react@16.8.19
```

메이저 버전과 마이너 버전이 일치하지만 패치 버전은 일치하지 않는다는 점을 주목하길 바랍니다.   

실제 라이브러리와 타입 정보의 버전이 별도로 관리되는 방식은 다음 네 가지 문제점이 있습니다.   

첫 번째, 라이브러리를 업데이트했지만 실수로 타입 선언은 업데이트하지 않은 경우입니다. 이런 경우 라이브러리 업데이트와 관련된 새로운 기능을 사용하려 할 때마다 타입 오류가 발생하게 됩니다.   
일반적인 해결책은 타입 선언도 업데이트하여 라이브러리와 버전을 맞추는 것입니다. 그러나 업데이트해야 할 타입 선언의 버전이 아직 준비되지 않은 경우라면 두 가지 선택지가 있습니다. 보강 기법을 활용하여 방법과 타입 선언의 업데이트를 직접 작성하고 공개하여 커뮤니티에 기여하는 방법도 있습니다.   

두 번째, 라이브러리보다 타입 선언의 버전이 최신인 경우입니다. 이런 경우는 타입 정보 없이 라이브러리를 사용해 오다가 타입 선언을 설치하려고 할 때 뒤늦게 발생합니다. 해결책은 라이브러리와 타입 선언의 버전이 맞도록 라이브러리 버전을 올리거나 타입 선언의 버전을 내리는 것입니다.   

세 번째, 프로젝트에서 사용하는 타입스크립트 버전보다 라이브러리에서 필요로 하는 타입스크립트 버전이 최신인 경우입니다. 현재 프로젝트보다 라이브러리에게 필요한 타입스크립트 버전이 높은 상황이라면, `@types` 선언 자체에서 타입 오류가 발생하게 됩니다. 이 오류를 해결하려면 프로젝트의 타입스크립트 버전을 올리거나, 라이브러리 타입 선언의 버전을 원래대로 내리거나, `declare module`선언으로 라이브러리의 타입 정보를 없애 버리면 됩니다.   

네 번째, `@types` 의존성이 중복될 수도 있습니다. 전역 네임스페이스에 있는 타입 선언 모듈이라면 대부분 문제가 발생합니다. 전역 네임스페이스에 타입 선언이 존재하면 중복된 선언, 또는 선언이 병합될 수 없다는 오류로 나타나게 됩니다.   

타입스크립트에서 의존성을 관리한다는 것은 쉽지 않은 일이지만, 잘 관리한다면 그에 따른 보상이 함께 존재합니다. 잘 작성된 타입 선언은 라이브러리를 올바르게 사용하는 방법을 배우는 데 도움이 되며 생산성 역시 크게 향상할 수 있습니다.   

라이브러리를 공개하려는 경우, 타입 선언을 자체적으로 포함하는 것과 타입 정보만 분리하여 DefinitelyTyped에 공개하는 것의 장단점을 비교해 봐야 합니다. 공식적인 권장사항은 라이브러리가 타입스크립트로 작성된 경우에만 타입 선언을 라이브러리에 포함하는 것입니다. 자바스크립트로 작성된 라이브러리는 타입 선언을 DefinitelyTyped에 공개하여 커뮤니티에서 관리하고 유지보수하도록 맡기는 것이 좋습니다.

## 🥕 아이템 47. 공개 API에 등장하는 모든 타입을 익스포트 하기
라이브러리 제작자는 프로젝트 초기에 타입 익스포트부터 작성해야 합니다. 만약 함수의 선언에 이미 타입 정보가 있다면 제대로 익스포트 되고 있는 것이며, 타입 정보가 없다면 타입을 명시적으로 작성해야 합니다.   

만약 어떤 타입을 숨기고 싶어서 익스포트 하지 않았다고 가정해 보겠습니다.

```ts
interface SecretName {
  first: string;
  last: string;
}

interface SecretSanta {
  name: SecretName;
  gift: string;
}

export function getGift(name: SecretName, gift: string): SecretSanta {
  // ...
}
```

해당 라이브러리 사용자는 `SecretName` 또는 `SecretSanta`를 직접 임포트할 수 없고, `getGift`만 임포트 가능합니다. 그러나 타입들은 익스포트된 함수 시그니처에 등장하기 때문에 추출해 낼 수 있습니다. 추출하는 한 가지 방법은 `Parameters`와 `ReturnType` 제너릭 타입을 사용하는 것입니다.

```ts
type MySanta = ReturnType<typeof getGift>; // SecretSanta
type MaName = Parameters<typeof getGift>[0]; // SecretName
```

만약 프로젝트의 융통성을 위해 타입들을 일부러 익스포트 하지 않았던 것이라면, 쓸데없는 작업을 한 셈입니다. 공개 API 매개변수에 놓이는 순간 타입은 노출되기 때문입니다. 그러므로 굳이 숨기려 하지 말고 라이브러리 사용자를 위해 명시적으로 익스포트 하는 것이 좋습니다.

## 🥕 아이템 48. API 주석에 TSDoc 사용하기
사용자를 위한 문서라면 JSDoc 스타일의 주석으로 만드는 것이 좋습니다. 왜냐하면 대부분의 편집기는 함수가 호출되는 곳에서 함수에 붙어 있는 JSDoc 스타일의 주석을 툴팁으로 표시해 주기 때문입니다.

```ts
/** 인사말을 생성합니다. 결과는 보기 좋게 꾸며집니다. */
function greetJSDoc(name: string, title: string) {
  return `Hello ${title} ${name}`;
}
```

타입스크립트 언어 서비스가 JSDoc 스타일을 지원하기 때문에 적극적으로 활용하는 것이 좋습니다. 만약 공개 API에 주석을 붙인다면 JSDoc 형태로 작성해야 합니다. JSDoc에는 `@param`과 `@returns` 같은 일반적 규칙을 사용할 수 있습니다. 한편 타입스크립트 관점에서는 TSDoc이라고 부르기도 합니다.

```ts
/**
 * 인사말을 생성합니다.
 * @param name 인사할 사람의 이름
 * @param title 그 사람의 칭호
 * @returns 사람이 보기 좋은 형태의 인사말
 */
function greetJSDoc(name: string, title: string) {
  return `Hello ${title} ${name}`;
}
```

타입 정의에 TSDoc을 사용할 수도 있습니다.

```ts
/** 특정 시간과 장소에서 수행된 측정 */
interface Measurement {
  /** 어디에서 측정되었나? */
  position: Vector3D;
  /** 언제 측정되었나? epoch에서부터 초 단위로 */
  time: number;
  /** 측정된 운동량 */
  momentum: Vector3D;
}
```

TSDoc 주석은 마크다운 형식으로 꾸며지므로 굵은 글씨, 기울임 글씨, 글머리기호 목록을 사용할 수 있습니다.

```ts
/**
 * 이 _interface_는 **세 가지** 속성을 가집니다.
 * 1. x
 * 2. y
 * 3. z
 */
interface Vector3D {
  x: number;
  y: number;
  z: number;
}
```

주석을 수필처럼 장황하게 쓰지 않도록 주의해햐 합니다. 훌륭한 주석은 간단히 요점만 언급합니다.   

타입스크립트에서는 타입 정보가 코드에 있기 떄문에 TSDoc에서는 타입 정보를 명시하면 안 됩니다.

## 🥕 아이템 49. 콜백에서 `this`에 대한 타입 제공하기
P.243 ~ P.248 참고

> 자바스크립트 `this` 내용이라 생략 ([this 내용 참고](https://saseungmin.github.io/reading_books_record_repository/docs/javascript/core-javascript/chapter-3))

### 요약
- `this` 바인딩이 동작하는 원리를 이해해야 합니다.
- 콜백 함수에서 `this`를 사용해야 한다면, 타입 정보를 명시해야 합니다.

## 🥕 아이템 50. 오버로딩 타입보다는 조건부 타입 사용하기
다음 예제는 타입스크립트의 함수 오버로딩 개념을 사용했습니다.

```ts
function double(x: number | string): number | string;
function double(x: any) { return x + x; }
```

선언이 틀린 것은 아니지만, 모호한 부분이 있습니다.

```ts
const num = double(12); // string | number
const str = double('x'); // string | number
```

선언문에는 `number` 타입을 매개변수로 넣고 `string` 타입을 반환하는 경우도 포함되어 있습니다.   
제너릭을 사용하면 이러한 동작을 모델링할 수 있습니다.

```ts
function double<T extends number | string>(x: T): T;
function double(x: any) { return x + x; }

const num = double(12); // 타입이 12
const str = double('x'); // 타입이 "x"
```

이제는 타입이 너무 과하게 구체적입니다. `string` 타입을 매개변수로 넘기면 `string` 타입이 반환되어야 합니다.   

또 다른 방법은 여러 가지 타입 선언으로 분리하는 것입니다. 타입스크립트에서 함수의 구현체는 하나지만, 타입 선언은 몇 개든지 만들 수 있습니다.

```ts
function double(x: number): number;
function double(x: string): string;
function double(x: any) { return x + x; }

const num = double(12); // 타입이 number
const str = double('x'); // 타입이 string
```

함수 타입이 조금 명확해졌지만 여전히 버그는 남아 있습니다. `string`이나 `number` 타입의 값으로는 잘 동작하지만, 유니온 타입 관련해서 문제가 발생합니다.

```ts
function f(x: number|string) {
  return double(x);
  //            ~ 'string|number' 형식의 인수는 'string' 형식의 매개변수에 할당될 수 없습니다.
}
```

오버로딩 타입의 마지막 선언까지 검색했을 때, `string|number` 타입은 `string`에 할당할 수 없기 때문에 오류가 발생합니다.   
세 번째 오버로딩을 추가하여 문제를 해결할 수도 있지만, 가장 좋은 해결책은 조건부 타입을 사용하는 것입니다.   
조건부 타입은 타입 공간의 `if` 구문과 같습니다.

```ts
function double<T extends number | string>(x: T): T extends string ? string : number;
function double(x: any) { return x + x; }
```

이 코드는 제너릭을 사용했던 예제와 유사하지만, 반환 타입이 더 정교합니다.
- `T`가 `string`의 부분 집합이면, 반환 타입이 `string`입니다.
- 그 외의 경우는 반환 타입이 `number`입니다.

```ts
const num = double(12); // 타입이 number
const str = double('x'); // 타입이 string

// function f(x: string | number): string | number
function f(x: number | string) {
  return double(x);
}
```

유니온에 조건부 타입을 적용하면, 조건부 타입의 유니온으로 분리되기 때문에 `number | string`의 경우에도 동작합니다.   
오버로딩 타입이 작성하기 쉽지만, 조건부 타입은 별개 타입의 유니온으로 일반화하기 때문에 타입이 더 정확해집니다. 타입 오버로딩이 필요한 경우에 가끔 조건부 타입이 필요한 상황이 발생합니다. 각각의 오버로딩 타입이 독립적으로 처리되는 반면, 조건부 타입은 타입 체커가 단일 표현식으로 받아들이기 때문에 유니온 문제를 해결할 수 있습니다.

## 🥕 아이템 51. 의존성 분리를 위해 미러 타입 사용하기
CSV 파일을 파싱하는 라이브러리를 작성한다고 가정해 보겠습니다. NodeJS 사용자를 위해 매개변수에 `Buffer` 타입을 허용합니다.

```ts
function parseCSV(contents: string | Buffer): {[column: string]: string}[] {
  if (typeof contents === 'object') {
    // 버퍼인 경우
    return parseCSV(contents.toString('utf8'));
  }
  // ...
}
```

`Buffer`의 타입 정의는 NodeJS 타입 선언을 설치해서 얻을 수 있습니다.

```bash
$ npm install --save-dev @types/node
```

CSV 파싱 라이브러리를 공개하면 타입 선언도 포함하게 됩니다. 그리고 타입 선언이 `@types/node`에 의존하기 때문에 `@types/node`는 `devDependencies`로 포함해야 합니다. `@types/node`를 `devDependencies`로 포함하면 다음 두 그룹의 라이브러리 사용자들에게 문제가 생깁니다.

- `@types`와 무관한 자바스크립트 개발자
- NodeJS와 무관한 타입스크립트 웹 개발자

각자가 필요한 모듈만 사용할 수 있도록 구조적 타이핑을 적용할 수 있습니다. `@types/node`에 있는 `Buffer` 선언을 사용하지 않고, 필요한 메서드와 속성만 별도로 작성할 수 있습니다. 앞선 예제의 경우에는 인코딩 정보를 매개변수로 받는 `toString` 메서드를 가지는 인터페이스를 별도로 만들어 사용하면 됩니다.

```ts
interface CsvBuffer {
  toString(encoding: string): string;
}
function parseCSV(contents: string | CsvBuffer): {[column: string]: string}[] {
  // ...
}
```

만약 작성 중인 라이브러리가 의존하는 라이브러리의 구현과 무관하게 타입에만 의존한다면, 필요한 선언부만 추출하여 작성 중인 라이브러리에 넣는 것(미러링, mirroring)을 고려해 보는 것도 좋습니다. NodeJS 기반 타입스크립트 사용자에게는 변화가 없지만, 웹 기반이나 자바스크립트 등 다른 모든 사용자에게는 더 나은 사양을 제공할 수 있습니다.   

다른 라이브러리의 타입이 아닌 구현에 의존하는 경우에도 동일한 기법을 적용할 수 있고 타입 의존성을 피할 수 있습니다. 그러나 프로젝트의 의존성이 다양해지고 필수 의존성이 추가됨이 따라 미러링 기법을 적용하기가 어려워집니다. 다른 라이브러리의 타입 선언의 대부분을 추출해야 한다면, 차라리 명시적으로 `@types` 의존성을 추가하는 게 낫습니다.   

미러링 기법은 유닛 테스트와 상용 시스템 간의 의존성을 분리하는 데도 유용합니다.

## 🥕 아이템 52. 테스팅 타입의 함정에 주의하기
프로젝트를 공개하려면 테스트 코드를 작성하는 것은 필수이며, 타입 선언도 테스트를 거쳐야 합니다. 그러나 타입 선언을 테스트하기에는 매우 어렵습니다.   

유틸리티 라이브러리에서 제공하는 `map` 함수의 타입 선언을 작성한다고 가정해 보겠습니다.

```ts
declare function map<U, V>(array: U[], fn: (u: U) => V): V[];
```

타입 선언이 예상한 타입으로 결과를 내는지 체크할 수 있는 한 가지 방법은 함수를 호출하는 테스트 파일을 작성하는 것입니다.

```ts
map(['2017', '2018', '2019'], v => Number(v));
```

하지만 반환값에 대한 체크가 누락되어 있기 때문에 완전한 테스트라고 할 수 없습니다.   
앞의 코드와 동일한 스타일로 `square`라는 함수의 런타임 동작을 테스트한다면 다음과 같은 테스트 코드가 됩니다.

```ts
test('square a number', () => {
  square(1);
  square(2);
});
```

반환값에 대해서는 체크하지 않기 때문에, 실제로는 실행의 결과에 대한 테스트는 하지 않은 게 됩니다. 따라서 `square`의 구현이 잘못되어 있더라도 이 테스트는 통과하게 됩니다.   

```ts
const lengths: number[] = map(['john', 'paul'], name => name.length);
```

이 코드는 일반적으로 불필요한 타입 선언에 해당합니다. 그러나 테스트 코드 관점에서는 중요한 역할을 하고 있습니다. `number[]` 타입 선언은 `map` 함수의 반환 타입이 `number[]`임을 보장합니다. 실제로 `DefinitelyTyped`를 살펴보면, 테스팅을 하기 위해 정확히 동일한 방식을 사용한 수많은 타입 선언을 볼 수 있습니다. 그러나 테스팅을 위해 할당을 사용하는 방법에는 두 가지 근본적인 문제가 있습니다.   

첫 번째, 불필요한 변수를 만들어야 합니다. 반환값을 할당하는 변수는 샘플 코드처럼 쓰일 수도 있지만, 일부 린팅 규칙을 비활성화해야 합니다.   
일반적인 해결책은 변수를 도입하는 대신 헬퍼 함수를 정의하는 것입니다.

```ts
function assertType<T>(x: T) {}

assertType<number[]>(map(['john', 'paul'], name => name.length));
```

이 코드는 불필요한 변수 문제를 해결하지만, 또 다른 문제점이 남아 있습니다.   
두 번째, 두 타입이 동일한지 체크하는 것이 아니라 할당 가능성을 체크하고 있습니다. 다음 예제처럼 잘 동작하는 경우도 있습니다.

```ts
const n = 12;
assertType<number>(n); // 정상
```

`n` 심벌을 조사해 보면, 타입이 실제로 숫자 리터럴 타입인 12임을 볼 수 있습니다. 12는 `number`의 서브타입이고 할당 가능성 체크를 통과합니다.   
그러나 객체의 타입을 체크하는 경우를 살펴보면 문제를 발견하게 될 겁니다.

```ts
const beatles = ['john', 'paul', 'george', 'ringo'];
assertType<{ name: string }[]>(
  map(beatles, name => ({
    name,
    inYellowSubmarine: name === 'ringo'
  })),
); // 정상
```

`map`은 `{name: string, inYellowSubmarine: boolean}` 객체의 배열을 반환합니다. 반환된 배열을 `{name: string}[]`에 할당 가능하지만, `inYellowSubmarine` 속성에 대한 부분이 체크되지 않았습니다.   
게다가 `assertType`에 함수를 넣어 보면, 이상한 결과가 나타납니다.

```ts
const add = (a: number, b: number) => a + b;
assertType<(a: number, b: number) => number>(add);

const double = (x: number) => 2 * x;
assertType<(a: number, b: number) => number>(double); // 정상!?
```

`double` 함수의 체크가 성공하는 이유는, 타입스크립트의 함수 매개변수가 더 적은 함수 타입에 할당 가능하기 때문입니다.   

다음 코드처럼 `Parameters`와 `ReturnType` 제너릭 타입을 이용해 함수의 매개변수 타입과 반환 타입만 분리하여 테스트할 수 있습니다.

```ts
const double = (x: number) => 2 * x;
let p: Parameters<typeof double> = null!;
assertType<number, number>(p);
//                         ~ '[number]' 형식의 인수는 '[number, number]' 형식의 매개변수에 할당될 수 없습니다.

let r: ReturnType<typeof double> = null!;
assertType<number>(r); // 정상
```

한편, `this`가 등장하는 콜백 함수의 경우는 또 다른 문제가 있습니다. `map`은 콜백 함수에서 `this`의 값을 사용할 때가 있으며 타입스크립트는 이러한 동작을 모델링할 수 있으므로, 타입 선언에 반영해야 하며 테스트도 해야 합니다.

앞서 등장했던 테스트는 모두 블랙박스 스타일이었습니다. 세부 사항을 테스트하기 위해서 콜백 함수 내부에서 매개변수들의 타입과 `this`를 직접 체크해 보겠습니다.

```ts
const beatles = ['john', 'paul', 'george', 'ringo'];
assertType<number[]>(
  map(beatles, function(name, i, array) {
    //         ~~~~~~~~ '(name: any, i: any, array: any) => any' 형식의 인수는
    //                  '(u: string) => any' 형식의 매개변수에 할당될 수 없습니다.
    assertType<string>(name);
    assertType<number>(i);
    assertType<string[]>(array);
    assertType<string[]>(this);
    //                   ~~~~ 'this'에는 암시적으로 'any' 형식이 포함됩니다.
    return name.length;
  }),
);
```

다음 코드의 선언을 사용하면 타입 체크를 통과합니다.

```ts
declare function map<U, V>(
  array: U[],
  fn: (this: U[], u: U, i: number, array: U[]) => V
): V[];
```

그러나 다음 모듈 선언은 까다로운 테스트를 통과할 수 있는 타입 선언 파일이지만, 결과적으로 좋지 않은 설계가 됩니다.

```ts
declare module 'overbar';
```

이 선언은 전체 모듈에 `any` 타입을 할당합니다. 따라서 테스트는 전부 통과하겠지만, 모든 타입 안전성을 포기하게 됩니다. 더 나쁜 점은, 해당 모듈에 속하는 모든 함수의 호출마다 암시적으로 `any` 타입을 반환하기 때문에 코드 전반에 걸쳐 타입 안전성을 지속적으로 무너뜨리게 된다는 것입니다.   

타입 시스템 내에서 암시적으로 `any` 타입을 발견해 내는 것은 매우 어렵습니다. 이러한 어려움 때문에 타입 체커와 독립적으로 동작하는 도구를 사용해서 타입 선언을 테스트하는 방법이 권장됩니다.   

`DefinitelyTyped`의 타입 선언을 위한 도구는 [dtslint](https://github.com/microsoft/dtslint)입니다. dtslint는 특별한 형태의 주석을 통해 동작합니다. dtslint를 사용하면 `beatles` 관련 예제의 테스트를 다음처럼 작성할 수 있습니다.

```ts
const beatles = ['john', 'paul', 'george', 'ringo'];
map(beatles, function(
  name, // $ExpectType string
  i, // $ExpectType number
  array // $ExpectType string[]
) {
  this // $ExpectType string[]
  return name.length;
}); // $ExpectType number[]
```

dtslint는 할당 가능성을 체크하는 대신 각 심벌의 타입을 추출하여 글자 자체가 같은지 비교합니다. 이 비교 과정은 편집기에서 타입 선언을 눈으로 확인하는 것과 같은데, dtslint는 이러한 과정을 자동화합니다.   
그러나 글자 자체가 같은지 비교하는 방식에는 단점이 있습니다. `number|string`과 `string|number`는 같은 타입이지만 글자 자체로 보면 다르기 때문에 다른 타입으로 인식됩니다. `string`과 `any`를 비교할 때도 마찬가지인데, 두 타입은 서로 간에 할당이 가능하지만 글자 자체는 다르기 때문에 다른 타입으로 인식됩니다.
