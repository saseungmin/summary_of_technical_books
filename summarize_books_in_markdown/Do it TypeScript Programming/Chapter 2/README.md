# 🐤 Chapter 2: 타입스크립트 프로젝트 생성과 관리

## 🦄 타입스크립트 프로젝트 만들기
- 타입스크립트 개발은 Node.js 프로젝트를 만든 다음, 개발 언어를 타입스크립트로 설정하는 방식으로 진행한다.
- 디렉터리를 하나 만들고 여기에 `package.json` 파일을 만드는 것으로 시작한다.
- 터미널에서 `npm init` 명령으로 `package.json` 파일을 생성한다.

```bash
> npm init --y
```

- `package.json`은 Node.js가 관리하는 패키지 관리 파일로서 **프로젝트 정보와 관련 패키지가 기록된다.**
- 이 파일을 이용해 프로젝트를 개발하고 실행하는 데 필요한 패키지를 관리할 수 있다.

### 🐇 프로젝트 생성자 관점에서 패키지 설치하기
- 프로젝트 구현에 필요한 다양한 오픈소스 패키지를 `npm install` 혹은 `npm i` 명령으로 설치한다.
- 이 옵션으로 설치하면 해당 패키지 정보가 `package.json` 파일에 자동으로 기록된다.

```bash
// dependencies 항목에 등록
> npm i --save 
> npm i -S

// devDependencies 항목에 등록
> npm i --save-dev
> npm i -D
```

- 타입스크립트 프로젝트는 보통 `typescript`와 `ts-node` 패키지를 설치한다.

```bash
> npm i -D typescript ts-node
```

- 타입스크립트는 기본적으로 ESNext 자바스크립트 문법을 포함하고 있지만, 자바스크립트와는 완전히 다른 언어이다.
- 즉, 자바스크립트 컴파일러는 `a => a + 1`과 같은 코드를 동작시킬 수는 있지만, 타입스크립트 컴파일러는 `(a: number): number => a + 1`처럼 **타입이 명시적으로 설정되어** 있어야만 코드가 문법에 맞게 작성되었는지를 검증해 코드를 동작시킨다.
- `@types/`가 앞에 붙는 타입 라이브러리들은 항상 `index.d.ts`라는 이름의 파일을 가지고 있으며, 타입스크립트 컴파일러는 이 파일의 내용을 바탕으로 chance, ramda와 같은 라이브러리가 제공하는 함수들을 올바르게 사용했는지 검증한다.
- 타입스크립트는 또한 웹 브라우저나 Node.js가 기본적으로 제공하는 타입들의 존재도 그냥은 알지 못한다.
- 예를 들어, `Promise`와 같은 타입을 사용하려면 `@types/node`라는 패키지를 설치해야 한다.

```bash
> npm i -D @types/node
```

### 🐇 프로젝트 이용자 관점에서 패키지 설치하기
- 프로젝트를 만드는 과정에서 패키지를 설치하면 프로젝트 디렉터리 아래에 `node_modules`이라는 디렉터리가 생기고, 여기에 해당 패키지가 설치된다.
- 보통 프로젝트를 구현하면 여러 패키지가 설치되게 되기 때문에 `node_modules` 디렉터리 크기가 매우 커진다. 그래서 다른 사람에게 프로젝트를 전달할 때는 `node_modules` 디렉터리를 모두 지운다.
- 따라서 다른 사람이 작성한 프로젝트를 전달받아 이용할 때는 가장 먼저 `package.json` 파일이 있는 디렉터리에서 다음 명령을 실행해야 한다.

```bash
> npm i
```
### 🐇 tsconfig.json 파일 만들기
- 타입스크립트 프로젝트는 타입스크립트 컴파일러의 설정 파일인 `tsconfig.json` 파일이 있어야 한다.
- 이 파일은 `tsc --init` 명령으로 만들 수 있다.

```bash
> tsc --init
```

- 기본 `tsconfig.json` 파일은 실제 개발을 진행하는 데 필요한 많은 옵션이 비활성화되어 있다.
- 따라서 보통은 프로젝트에 필요한 옵션만 설정해서 간략하게 한다.

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "esModuleInterop": true,
    "target": "ES5",
    "moduleResolution": "node",
    "outDir": "dist",
    "baseUrl": ".",
    "sourceMap": true,
    "downlevelIteration": true,
    "noImplicitAny": false,
    "paths": { "*": ["node_modules/*"] }
  },
  "include": ["src/**/*"]
}
```
- 위와 같은 내용으로 작성된 `tsconfig.json` 파일을 기본 설정 파일로 적용한다.

### 🐇 src 디렉터리와 소스 파일 만들기
- 앞에서 만든 `include` 항목에는 `["src/**/*"]`라는 값이 설정되어 있는데, 이것은 `./src`와 `./src/utils` 디렉터리에 이 프로젝트의 모든 타입스크립트 소스 파일이 있다는 뜻이다.
- `tsconfig.json` 설정대로 프로젝트를 구성하고자 다음 명령으로 `src/utils` 디렉터리를 생성한다.

```bash
> mkdir -p src/utils
```

- 그리고 각 디렉터리에 실습하는 데 필요한 소스 파일을 만든다.

```bash
> touch src/index.ts src/utils/makePerson.ts
```

- `makePerson.ts`에 다음과 같이 입력한다.

```ts
export function makePerson(name: string, age: number) {
  return { 
    name: name, 
    age: age,
  };
}

export function testMakePerson() {
  console.log(
    makePerson('Jane', 22),
    makePerson('Jack', 33),
  );
}
```

- `index.ts`에 다음과 같이 입력한다.

```ts
import { testMakePerson } from './utils/makePerson';

testMakePerson();
```

### 🐇 package.json 수정
- 타입스크립트 프로젝트를 개발할 때는 `ts-node`를 사용하지만, 막상 개발이 완료되면 타입스크립트 소스코드를 ES5 자바스크립트 코드로 변환해 `node`로 실행해야 한다.
- 그렇게 때문에 다음처럼 `package.json` 파일을 열고 `script` 항목에 `dev`와 `build` 명령을 추가한다.

```json
{
  "name": "chapter-2",
  "version": "1.0.0",
  "description": "타입스크립트 프로젝트 만들기",
  "main": "src/index.js",
  "scripts": {
    "dev": "ts-node src",
    "build": "tsc && node dist"
  },
  /* 생략 */
}
```

- `dev` 명령을 개발 중에 `src` 디렉터리에 있는 `index.ts` 파일을 실행하는 용도로 사용하며, `build` 명령은 개발이 완료된 후 프로그램을 배포하기 위해 `dist` 디렉터리에 ES5 자바스크립트 파일을 만들 때 사용한다.
- 이 명령들은 `npm run 명령` 형태로 사용한다.

```bash
> npm run dev
{ name: 'Jane', age: 22 } { name: 'Jack', age: 33 }
```

- 터미널에서 다음 명령을 실행해 `dist` 디렉터리에 ES5 자바스크립트 파일을 만든다.

```bash
> npm run build
```

- 다음은 `build` 명령으로 만든 `dist` 디렉터리와 ES5로 컴파일된 `index.js` 파일과 `makePerson.js`이다.
- `index.js`

```js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var makePerson_1 = require("./utils/makePerson");
makePerson_1.testMakePerson();
//# sourceMappingURL=index.js.map
```

- `makePerson.js`
```js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testMakePerson = exports.makePerson = void 0;
function makePerson(name, age) {
    return {
        name: name,
        age: age,
    };
}
exports.makePerson = makePerson;
function testMakePerson() {
    console.log(makePerson('Jane', 22), makePerson('Jack', 33));
}
exports.testMakePerson = testMakePerson;
//# sourceMappingURL=makePerson.js.map
```

## 🦄 모듈 이해하기
- 타입스크립트에서는 `index.ts`와 같은 소스 파일을 모듈(module)이라고 한다.
- 코드 관리와 유지 보수를 편리하게 하려고 모듈마다 고유한 기능을 구현하는 방식으로 소스코드를 분할한다. 이러한 작업을 모듈화(modulization)라고 한다.
- 타입스크립트는 이를 위해 `export`와 `import`라는 키워드를 제공한다.

```ts
let MAX_AGE = 100;

interface IPerson {
  name: string,
  age: number,
}

class Person implements IPerson {
  constructor(public name: string, public age: number) {};
}

function makeRandomNumber(max: number = MAX_AGE): number {
  return Math.ceil((Math.random() * max));
}

const makePerson = 
  ( name: string, age: number = makeRandomNumber()) => ({ name, age });

const testMakePerson = (): void => {
  let jane: IPerson = makePerson('Jane');
  let jack: IPerson = makePerson('Jack');
  console.log(jane, jack);
}

testMakePerson();
```

- 터미널에서 다음 명령으로 `index.ts` 파일을 실행한다.

```bash
> npm run dev
```

- 코드를 이해하고 수정할려하니 내용이 조금 복잡해보인다.
- `index.ts` 파일의 내용을 분리해서 모듈화를 진행한다.

### 🐇 index.ts 파일의 모듈화
- `index.ts` 파일을 모듈화하기 위해 `src` 디렉터리 아래에 `person` 디렉터리를 생성 후 그 안에 `Person.ts`라는 이름의 파일을 만든다.
- 그리고 `index.ts` 파일에서 다음과 같은 내용을 `Person.ts` 파일로 옮겨 적는다.

```ts
let MAX_AGE = 100;

interface IPerson {
  name: string,
  age: number,
}

class Person implements IPerson {
  constructor(public name: string, public age: number) {};
}

function makeRandomNumber(max: number = MAX_AGE): number {
  return Math.ceil((Math.random() * max));
}

const makePerson = 
  ( name: string, age: number = makeRandomNumber()) => ({ name, age });
```

- `index.ts`

```ts
const testMakePerson = (): void => {
  let jane: IPerson = makePerson('Jane');
  let jack: IPerson = makePerson('Jack');
  console.log(jane, jack);
}

testMakePerson();
```
- 하지만 이 상태로 코드를 실행해 보면 오류가 발생한다.
- 이 경우 타입스크립트의 `export`와 `import` 구문을 통해 해결할 수 있다.

### 🐇 export 키워드
- `Person.ts` 파일에 `IPerson`과 `makePerson` 선언부에 `export` 키워드를 추가한다.
- `export` 키워드는 `interface`, `class`, `type`, `let`, `const` 키워드 앞에도 붙일 수 있다.

```ts
let MAX_AGE = 100;

export interface IPerson {
  name: string,
  age: number,
}

class Person implements IPerson {
  constructor(public name: string, public age: number) {};
}

function makeRandomNumber(max: number = MAX_AGE): number {
  return Math.ceil((Math.random() * max));
}

export const makePerson = 
  ( name: string, age: number = makeRandomNumber()): IPerson => ({ name, age });
```

### 🐇 import 키워드
- 어떤 파일이 `export` 키워드로 내보낸 심벌을 받아서 사용하려면 `import` 키워드로 해당 심벌을 불러온다.

```ts
import { 심벌목록 } from '파일의 상대 경로';
```

- `index.ts`

```ts
import { IPerson, makePerson } from "./person/Person";

const testMakePerson = (): void => {
  let jane: IPerson = makePerson('Jane');
  let jack: IPerson = makePerson('Jack');
  console.log(jane, jack);
}

testMakePerson();
```

### 🐇 import * as 구문
- `import` 구문의 또 다른 형태는 다음처럼 `as` 키워드를 함께 사용하는 것이다.

```ts
import * as 심벌 from '파일 상대 경로';
```

- `src/utils` 디렉터리에 `makeRandomNumber.ts` 라는 파일을 만들고 `Person.ts`에서 다음과 같은 내용을 옮겨 적는다.

```ts
let MAX_AGE = 100;

export function makeRandomNumber(max: number = MAX_AGE): number {
  return Math.ceil((Math.random() * max));
}
```

- 그리고 `Person.ts` 파일을 열고 첫 줄에 다음과 같은 `import * as` 구문을 작성한 후 `U.` 코드를 추가한다.

```ts
import * as U from "../utils/makeRandomNumber";

// 생략..

export const makePerson = 
  ( name: string, age: number = U.makeRandomNumber()): IPerson => ({ name, age });
```
- `makeRandomNumber`를 분리하였고, `Person.ts` 파일에서는 `U`라는 심벌로 접근할 수 있도록 `import * as` 구문을 지정했다.

### 🐇 export default 키워드
- 타입스크립트는 자바스크립트와 호환하기 위해 `export default` 구문을 제공한다.
- `person` 디렉터리에 `IPerson.ts` 파일을 만들고 다음과 같이 작성한다.

```ts
export default interface IPerson {
  name: string,
  age: number,
}
```

- `export default` 키워드는 한 모듈이 내보내는 기능 중 오직 한 개에만 붙일 수 있다.
- `import`문으로 불러올 때 중괄호 `{}` 없이 사용할 수 있다.
- `Person.ts` 파일을 수정한다.

```ts
import { makeRandomNumber } from "../utils/makeRandomNumber";
import IPerson from "./IPerson";


export default class Person implements IPerson {
  constructor(public name: string, public age: number = makeRandomNumber()) {};
}

export const makePerson = 
  ( name: string, age: number = makeRandomNumber()): IPerson => ({ name, age });
```

- `index.ts`를 다음과 같이 반영한다.

```ts
import IPerson from "./person/IPerson";
import Person, { makePerson } from "./person/Person";

const testMakePerson = (): void => {
  let jane: IPerson = makePerson('Jane');
  let jack: IPerson = new Person('Jack');
  console.log(jane, jack);
}

testMakePerson();
```

### 🐇 외부 패키지를 사용할 때 import문
- 다음처럼 `chance`와 `ramda`라는 패키지를 설치해준다.

```bash
> npm i -S chance ramda
> npm i -D @types/chance @types/ramda
```

- `package.json`

```json
{
  /* 생략.. */
  "devDependencies": { /* -D 옵션 */
    "@types/chance": "^1.1.1",
    "@types/node": "^14.14.16",
    "@types/ramda": "^0.27.34",
    "ts-node": "^9.1.1",
    "typescript": "^4.1.3"
  },
  "dependencies": { /* -S 옵션 */
    "chance": "^1.1.7",
    "ramda": "^0.27.1"
  }
}
```

- `chance` 패키지는 가짜 데이터(fake data)를 만들어 주는 데 사용되며, `ramda`는 함수형 유틸리티 패키지이다.
- `index.ts` 파일을 다음과 같이 수정한다.

```ts
import IPerson from "./person/IPerson";
import Person from "./person/Person";

import Chance from 'chance';
import * as R from 'ramda';

const chance = new Chance();

let persons: IPerson[] = R.range(0, 2)
  .map((n: number) => new Person(chance.name(), chance.age()));

console.log(persons);
```

- `chance`와 `ramda`는 외부 패키지이므로 `node_modules` 디렉터리에 있다.
- 따라서 경로에서 `./`등을 생략한 채 `import`를 할 수 있다.

```bash
> npm run dev
> npm run build
```

## 🦄 tsconfig.json 파일 살펴보기
- 터미널에서 `tsc --help`를 실행하면 다음과 같은 내용을 볼 수 있다.
- 이를 통해 `tsc` 컴파일러는 **컴파일 옵션과 대상 파일 목록** 두 가지를 입력받는다는 것을 알 수 있다.

```bash
> tsc --help
Version 4.1.3
Syntax:   tsc [options] [file...] // tsc 명령 형식

Examples: tsc hello.ts
          tsc --outFile file.js file.ts
          tsc @args.txt
          tsc --build tsconfig.json

Options:
 -h, --help                                         Print this message.
 -w, --watch                                        Watch input files.
 ... 생략 ...
```

- 앞에서 만든 `tsconfig.json` 파일을 보면 다음처럼 구성되어있다.

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "esModuleInterop": true,
    "target": "ES5",
    "moduleResolution": "node",
    "outDir": "dist",
    "baseUrl": ".",
    "sourceMap": true,
    "downlevelIteration": true,
    "noImplicitAny": false,
    "paths": { "*": ["node_modules/*"] }
  },
  "include": ["src/**/*"]
}
```

- `compilerOptions` 항목은 `tsc` 명령 형식에서 **옵션**을 나타내고, `includes` 항목은 **대상 파일 목록**을 나타낸다.
- `include`의 `["src/**/*"]`는 `src` 하위 디렉터리에 있는 모든 파일을 컴파일 대상으로 포함한다는 의미이다.

### 🐇 module 키
- 타입스크립트 소스코드가 컴파일되어 만들어진 ES5 자바스크립트 코드는 웹 브라우저의 Node.js 양쪽에서 모두 동작해야 한다.
- 그런데 웹 브라우저와 Node.js는 물리적으로 동작하는 방식이 달라서 여러 개의 파일로 분할된 자바스크립트 코드 또한 웹 브라우저와 Node.js 양쪽에서 각각 다르게 동작한다.
- 자바스크립트 모듈은 웹 브라우저에서는 **AMD**(**asynchronous module definition**) 방식으로 동작하고, Node.js처럼 웹 브라우저가 아닌 환경에서는 **CommonJS** 방식으로 동작한다.
- `tsconfig.json` 파일에서 `compilerOptions` 항목의 `module` 키는 동작 대상 플랫폼이 웹 브라우저인지 Node.js인지를 구분해 그에 맞는 모듈 방식으로 컴파일하려는 목적으로 설정한다.

```json
{
  "compilerOptions": {
    "module": "commonjs", /* Node.js */
    "module": "amd", /* 웹 브라우저 */
  },
}
```
### 🐇 moduleResolution 키
- `module`키의 값이 `commonjs`이면 Node.js에서 동작하는 것을 의미하므로, **`moduleResolution`키값은 항상 `node`로 설정**한다.
- 반면에 `module`키값이 `amd`이면 **`moduleResolution`키값은 `classic`으로 설정**한다.

### 🐇 target 키
- `target` 키에는 **트랜스파일할 대상 자바스크립트 버전을 설정**한다.
- 대부분 es5를 키값으로 설정한다.

### 🐇 baseUrl과 outDir 키
- `baseUrl`과 `outDir` 키에는 **트랜스파일된 ES5 자바스크립트 파일을 저장하는 디렉터리를 설정한다.**
- `tsc`는 `tsconfig.json` 파일이 있는 디렉터리에서 실행된다. 따라서 현재 디렉터리를 의미하는 `"."`로 `baseUrl` 키값으로 설정하는 것이 보통이다.
- `outDir`키는 **하위 디렉터리의 이름**이다.

### 🐇 paths 키
- `paths` 키에는 **소스 파일의 `import`문에서 `form` 부분을 해석할 때 찾아야 하는 디렉터리를 설정한다.**
- `import` 문에 찾아야 하는 소스가 외부 패키지이면 `node_modules` 디렉터리에서 찾아야 하므로 키값에 `node_modules/*`도 포함한다.

### 🐇 esModuleInterop 키
- 오픈소스 자바스크립트 라이브러리 중에는 웹 브라우저에서 동작한다는 가정으로 만들어진 것이 있는데, 이들은 `CommonJS` 방식으로 동작하는 타입스크립트 코드에 혼란을 줄 수 있다.
- `chance`가 바로 AMD방식을 전제로 해서 구현된 라이브러리이다. 따라서 `chance` 패키지가 동작하려면 `esModuleInterop` 키값을 반드시 `true`로 설정해야 한다.

### 🐇 sourceMap 키
- `sourceMap` 키 값이 `true`이면 트랜스파일 디렉터리에는 `.js` 파일 이외에도 `.js.map` 파일이 만들어진다.
- 이 소스맵 파일은 **변환된 자바스크립트 코드가 타입스크립트 코드의 어디에 해당하는지를 알려준다.**
- 소스맵 파일은 주로 디버깅할 때 사용된다.

### 🐇 downlevelIteration 키
- 생성기(generator)라는 타입스크립트 구문이 있는데, 이 구문이 정성적으로 동작하려면 `downlevelIteration` 키값을 반드시 `true`로 설정해야 한다.

### 🐇 noImplicitAny 키
- 타입스크립트 컴파일러는 기본적으로 `f(a, b)` 처럼 매개변수에 `a, b`에 타입을 명시하지 않은 코드일 경우 `f(a: any, b: any)`처럼 암시적으로 `any`타입으로 설정한 것으로 간주한다.
- 이런 형태의 코드는 타입스크립트 언어의 장점을 가진 것이 아니므로 코드에 문제가 있음을 알려준다.
- 하지만 처음 배우는 사람의 입장에서는 오류 메시지의 의미가 직관적이지 않아 혼란을 준다.
- 이 책에서는 `noImplicitAny`키 값을 `false`로 설정했다.
