# 🐤 Chapter 1: 타입스크립트와 개발 환경 만들기

## 🦄 타입스크립트란 무엇인가?

### 🐇 자바스크립트에 타입 기능이 있으면 좋은 이유
- 오늘날 소프트웨어는 상당히 복잡하므로 보통 여러 사람이나 팀이 협력해 하나의 제품을 개발한다.
- 항상 코드를 작성한 쪽과 사용하는 쪽 사이에 커뮤니케이션이 중요하다.
- A라는 개발자가 다음과 같은 코드를 만들었다.

```js
function makePerson(name, age) {}
```

- B라는 개발자가 이 코드를 이용하려고 다음 코드를 만들어 실행했을 때 오류가 발생했다면, B 개발자는 오류의 원인이 무엇인지 찾기가 어렵다.

```js
makePerson(32, 'Jack');
```

- 그런데 처음 코드를 다음처럼 타입스크립트의 타입 기능을 이용해 구현했다면 이러한 문제는 발생하지 않았을 것이다.

```ts
function makePerson(name: string, age: number) {}
```

- 그리고 **타입스크립트 컴파일러는 문제의 원인이 어디에 있는지 친절하게 알려주므로 코드를 좀 더 수월하게 작성할 수 있다.**

### 🐇 트랜스파일
- ESNext 자바스크립트 소스코드는 바벨(Babel)이라는 트랜스파일러를 거치면 ES5 자바스크립트 코드로 변환된다.
- 바벨과 유사하게 타입스크립트 소스코드는 **TSC(TypeScript complier)라는 트랜스파일러**를 통해 ES5 자바스크립트 코드로 변환된다.
- 트랜스파일러는 텍스트로 된 소스코드를 바이너리 코드를 바꿔주는 컴파일러와 구분하기 위해 생긴 용어이다.

## 🦄 타입스크립트 주요 문법 살펴보기

- 타입스크립트를 다루려면 ESNext 문법을 알아야 한다.
- 타입스크립트에만 고유한 문법도 있다. 두 가지 문법을 구분해서 알아보자.

### 🐇 ESNext의 주요 문법 살펴보기

1. **비구조화 할당**

ESNext는 **비구조화 할당**(**Destructuring Assignment**)이라고 하는 구문을 제공한다.    
비구조화 할당은 **객체**와 **배열**에 적용할 수 있다.    

```js
// 객체의 속성을 얻는 예제
let person = { name: 'Jane', age: 22 };
let { name, age } = person; // name : Jane, age : 23

// 배열에 비구조화 할당을 적용한 예제
let array = [1, 2, 3, 4];
let [head, ...rest] = array; // head = 1, rest = [2, 3, 4]

// 값을 서로 교환(swap)하는 예
let a = 1, b = 2;
[a, b] = [b, a]; // a = 2, b = 1
```

2. **화살표 함수**

ESNext에서는 `function` 키워드 외에도 **화살표로 함수를 선언**할 수 있다.   

```js
// function 키워드 사용
function add(a, b) {
  return a + b;
}

// 화살표 함수 사용
const add2 = (a, b) => a + b;
```
화살표 함수를 사용하면 `function` 키워드 방식보다 코드를 간결하게 만들 수 있다.   

3. **클래스**
  
ESNext에서는 클래스라는 기능을 제공해 C++나 Java 언어에서 보던 객체지향 프로그래밍을 지원한다.   
객체 지향 프로그래밍은 **캡슐화**, **상속**, **다형성**을 지원한다.   

```ts
abstract class Animal {
  constructor(public name?: string, public age?: number) {}
  abstract say(): string
}

class Cat extends Animal {
    say() {
        return '야옹';
    }
}

class Dog extends Animal {
    say() {
        return '멍멍';
    }
}

let animals: Animal[] = [new Cat('야옹이', 2), new Dog('멍멍이', 3)];
let sounds = animals.map((a) => a.say()); // ['야옹', '멍멍']
```

4. **모듈**

모듈을 사용하면 코드를 여러 개 파일로 분할해서 작성할 수 있다.   
변수나 함수, 클래스 등에 `export` 키워드를 사용해 모듈로 만들면 다른 파일에서도 사용할 수 있다.   
그리고 이렇게 만든 모듈을 가져오고 싶을 때는 `import` 키워드를 사용한다.   

```ts
import * as fs from 'fs';
export function writeFile(filepath: string, content: any) {}
```

5. **생성기**

`yield`문은 **반복자**를 의미하는 **반복기**(**iterator**)를 생성할 때 사용한다. 그런데 반복기는 독립적으로 존재하지 않고 반복기 제공자(iterable)를 통해 얻는다.   
이처럼 `yield`문을 이용해 반복기를 만들어 내는 반복기 제공자를 **생성기**(**generator**)라고 부른다.   
생성기는 `function` 키워드에 별표(`*`)를 결합한 `function*`과 `yield` 키워드를 이용해 만든다.   
타입스크립트에서 `yield`는 반드시 `function*`으로 만들어진 함수 내부에서만 사용할 수 있다.

```ts
function* gen() {
  yield* [1, 2];
}

for(let value of gen()) {
  console.log(value); // 1, 2
}
```

위의 코드에서 `function*`을 **생성기**라고 한다.   
`yield`가 호출되면 프로그램 실행을 일시정지 한 후 점프해서 `for`문을 실행한다.   
`for`문을 마치면 다시 `yield`로 돌아가고 **배열의 모든 요소를 순회할 때까지 반복한다.**   

6. **Promise와 async/await 구문**

ES5로 비동기 콜백 함수를 구현하려면 코드가 상당히 복잡해지고 번거로워진다.   
`Promise`는 비동기 콜백 함수를 상대적으로 쉽게 구현할 목적으로 만들어졌다.   
ESNext에서는 여러 개의 `Promise` 호출을 결합한 좀 더 복잡한 형태의 코드를 `async/await` 구문으로 간결하게 구현할 수 있게 한다.   

```ts
async function get() {
  let values = [];
  values.push(await Promise.resolve(1));
  values.push(await Promise.resolve(2));
  values.push(await Promise.resolve(3));
  return values;
}

get().then(value => console.log(values)); // [1, 2, 3]
```

`async`를 사용한 함수는 본문에서 `await` 키워드를 사용할 수 있다.   
`await`는 `Promise` 객체를 해소(resolve)해 준다. 따라서 `get`함수는 `[1, 2, 3]` 값을 `Promise` 형태로 반환한다.   
`get`이 반환한 `Promise` 객체는 `then` 메서드를 호출해 실제 값을 얻을 수 있다.   

### 🐇 타입스크립트 고유의 문법 살펴보기

1. **타입 주석과 타입 추론**

다음 코드에서 변수 `n`뒤에는 콜론(`:`)과 타입 이름이 있다.   
이것이 **타입 주석**(**type annotation**)이라고 한다.   

```ts
let n: number = 1;
```

그런데 타입스크립트는 타입 부분을 생략할 수도 있다.   
타입스크립트는 변수의 타입 부분이 생략되면 대입 연산자의 **오른쪽 값을 분석해 왼쪽 변수의 타입을 결정한다.**   
이를 **타입 추론**(**type inference**)이라고 한다.   

```ts
let m = 2;
```

타입스크립트의 타입 추론 기능은 자바스크립트 소스코드와 호환성을 보장하는 데 큰 역할을 한다.   
타입 추론 덕분에 자바스크립트로 작성된 파일(`.js`)은 확장자만 `.ts`로 변경하면 타입스크립트 환경에서도 바로 동작한다.   

2. **인터페이스**

아래의 `Person` 인터페이스는 `string`타입의 `name`과 `number`타입의 `age`를 갖는다.   
`?`가 붙은 속성은 객체에 존재하지 않아도 `person`과 같이 오류가 발생하지 않는다.

```ts
interface Person {
  name: string;
  age?: number;
}

let person: Person = { name: 'Jane' };
```

3. **튜플**

튜플은 물리적으로는 배열과 같다.   
다만, 배열에 저장되는 아이템의 데이터 타입이 **모두 같으면 배열**, **다르면 튜플**이다.   

```ts
let numberArray: number[] = [1, 2, 3]; // 배열
let tuple: [boolean, number, string] = [true, 1, 'Ok']; // 튜플
```

4. **제네릭 타입**

제네릭 타입은 **다양한 타입을 한꺼번에 취급**할 수 있게 해준다.   
다음 코드에서 `Container` 클래스는 `value` 속성을 포함한다.   
`Container<number>`, `Container<string>`, `Container<number[]>`, `Container<boolean>` 처럼 여러 가지 타입을 대상으로 동작할 수 있는데 이를 제네릭 타입이라고 한다.   

```ts
class Container<T> {
  constructor(public value: T) {};
}

let numberContainer: Container<number> = new Container<number>(1);
let stringContainer: Container<string> = new Container<string>('Hello World');
```

5. **대수 타입**

**ADT**란, 데이터 타입(abstract data type)을 의미하기도 하지만 대수 타입(algebraic data type)이라는 의미로도 사용된다.   
**대수 타입**이란, 다른 자료형의 값을 가지는 자료형을 의미한다.   
대수 타입은 크게 **합집합 타입**(union), **교집합 타입**(intersection) 두 가지가 있다.   
합집합 타입은 `|` 기호를, 교집합 타입은 `&` 기호를 사용해 다음 코드처럼 여러 타입을 결합해서 만들 수 있다.   

```ts
type NumberOrString = number | string;
type AnimalAndPerson = Animal & Person;
```

## 🦄 타입스크립트 개발 환경 만들기

### 🐇 scoop 프로그램 설치
- 타입스크립트 개발 환경은 Node.js 개발 환경과 똑같다.
- 즉, Node.js를 설치하고 비주얼 스튜디오 코드와 크롬을 설치하면 바로 개발할 수 있다.
- scoop으로 설치한 프로그램들은 `scoop update *` 명령으로 한꺼번에 가장 최신 버전으로 업데이트된다. (brew와 비슷..?)
- [scoop 공식 사이트](https://scoop.sh/)

### 🐇 비주얼 스튜디오 코드 설치
- [vscode 다운로드](https://code.visualstudio.com/download)

### 🐇 Node.js 설치
- [Node.js 다운로드](https://nodejs.org/ko/download/)
- macOS는 brew를 사용하여 설치가능

```
// 버전 획인
$ node --version
```

### 🐇 구글 크롬 브라우저 설치
- [크롬 다운로드](https://www.google.co.kr/chrome/?brand=CHBD&brand=CHBD&gclid=Cj0KCQiA_qD_BRDiARIsANjZ2LBfTiJbLlGGjPP1pkIe5Fqup0R7Tkpg5FTFdV-Ke3E8Vptm3sh4-GoaAt7LEALw_wcB&gclsrc=aw.ds)

### 🐇 타입스크립트 컴파일러 설치
- VSCode를 실행하고 터미널에 다음 명령어를 입력해 typescript 패키지를 설치한다.

```bash
> npm i -g typescript
> tsc -v
```

- typescript 패키지는 서버와 클라이언트로 동작하는 두 개의 프로그램을 포함하고 있다.
- 따라서 타입스크립트 컴파일러 이름은 패키지 이름과 달리 `tsc`이다. 즉, 타입스크립트 컴파일러와 클라이언트라는 의미가 동시에 있다.

### 🐇 타입스크립트 컴파일과 실행

```ts
// hello.ts
console.log('Hello world!');
```

- 다음처럼 터미널에서 명령을 실행하면 `hello.js` 파일이 생기는 것을 확인할 수 있다.

```bash
> tsc hello.ts
```

![compile](../img/Chapter1-1.PNG)

- 즉, 타입스크립트 소스가 TSC에 의해 트랜스파일되어 hello.js 파일이 생성되었다.
- Node.js로 hello.js를 실행해본다.

```bash
> node hello.js
Hello world!
```

### 🐇 ts-node 설치
- tsc는 타입스크립트 코드를 ES5 형식의 자바스크립트 코드로 변환만 할 뿐 실행하지는 않는다.
- 타입스크립트 코드를 ES5로 변환하고 실행까지 동시에 하려면 **ts-node**라는 프로그램을 설치해야 한다.

```bash
> npm i -g ts-node
```
- 설치 후, `--version`으로 프로그램 버전을 확인한다.

```bash
> ts-node --version
```

- 이제 VSCode 터미널에서 다음 명령으로 컴파일과 실행을 동시에 진행해 본다.

```bash
> ts-node hello.ts
Hello world!
```
