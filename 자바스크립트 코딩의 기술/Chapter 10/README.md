## 🌈 Chapter 10 : 컴포넌트 아키텍처를 이용해 관련 파일을 모아라.

### 🎯 가져오기와 내보내기로 기능을 분리하라.

- 자바스크립트 개발자들은 모듈 시스템을 이용해 프로젝트에서 코드를 쉽게 재사용할 수 있게 되었다. (Require.js, CommonJS)
- 모듈은 단순회되었고, 이제는 간단한 import 문과 export 문을 사용할 수 있다.
- 그리고 이 단순한 인터페이스를 이용하면 **프로젝트 내의 파일 간에 코드를 공유**할 수 있을 뿐만 아니라, 거의 동일한 문법을 이용해서 자바스크립트 커뮤니티에 공개된 코드도 사용할 수 있다.
- 다음 예제는 [화살표 함수로 문맥 혼동을 피하라](https://github.com/saseungmin/reading_books_record_repository/tree/master/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%20%EC%BD%94%EB%94%A9%EC%9D%98%20%EA%B8%B0%EC%88%A0/Chapter%207#-%ED%99%94%EC%82%B4%ED%91%9C-%ED%95%A8%EC%88%98%EB%A1%9C-%EB%AC%B8%EB%A7%A5-%ED%98%BC%EB%8F%99%EC%9D%84-%ED%94%BC%ED%95%98%EB%9D%BC)에서 살펴봤던 예제 코드를 공유하고 싶다면 간단한 `export` 문만 추가하면 된다.

```javascript
const validator = {
  message: '는 유효하지 않습니다.',
  setInvalidMessages: field => `${field}${this.message}`,
};

export { validator };
```

- **함수, 변수, 클래스**를 내보낼 수 있다.
- 모든 것을 내보낼 필요는 없으며, 여러 함수 중 일부 함수만 내보내는 경우에는 기본적으로 공개 함수와 비공개 함수를 생성한 것과 같다.
- 다음 코드는 함수 두 개는 내보내고, 함수 한 개는 숨기는 경우이다.

```javascript
function getPower(decimalPlaces) {
  return 10 ** decimalPlaces;
}

function capitalize(word) {
  return word[0].toUpperCase() + word.slice(1);
}

function roundToDecimalPlace(number, decimalPlaces = 2) {
  const round = getPower(decimalPlaces);
  return Math.round(number * round) / round;
}

export { capitalize, roundToDecimalPlace };
```

- 다른 파일에서 함수를 사용하려면 `import` 키워드를 작성하고 불러오려는 함수를 중괄호 안에 작성한다.
- 그 뒤에 가져올 파일의 경로를 지정하는데, 현재 파일을 기준으로 **상대 경로로 작성한다.**

```javascript
import { capitalize, roundToDecimalPlace } from './util';

function giveTotal(name, total) {
  return `${capitalize(name)}님, 합계는 ${roundToDecimalPlace(total)} 입니다.`;
}

giveTotal('sara', 10.3333333);
// "Sara님, 합계는 10.33입니다."
export { giveTotal };
```

- 내보내기는 함수만 가능한 것이 아니고, 변수와 클래스도 내보낼 수 있다.

```javascript
const PI = 3.14;
const E = 2.71828;

export { E, PI };
```

- 내보내기와 가져오기는 해체 할당과 겅의 동일한 문법을 사용한다.
- 가져오기 항목을 모두 객체의 속성으로 관리하면 변수명으로 모든 것을 가져올 수 있다.
- 해체 할당의 문법과 조금 다른점은 별표(`*`)를 이용해서 모든 함수를 불러오고 변수명을 지정할 수 있다.
- 이렇게 하면 객체에 속한 함수처럼 호출할 수 있다.

```javascript
import * as utils from './util.js';

function greet(name) {
  return `Hello, ${utils.capitalize(name)}`;
}

console.log(greet('seungmin'));
// Hello, Seungmin
export { greet }; 
```

- 아래와 같이 선언한 객체를 파일의 끝에서 개별적으로 추가하는 대신, 각각의 함수 앞에 `export` 키워드를 추가한다.
- 파일 끝부분에 객체를 추가할 필요가 없으므로 코드가 훨씬 더 쉬워진다.

```javascript
function getPower(decimalPlaces) {
  return 10 ** decimalPlaces;
}

export function capitalize(word) {
  return word[0].toUpperCase() + word.slice(1);
}

export function roundToDecimalPlace(number, decimalPlaces = 2) {
  const round = getPower(decimalPlaces);
  return Math.round(number * round) / round;
}
```

- 코드를 분리할 수 있으니 단일 진입점을 가진 파일을 자주 만들게 될 것이고, 더 중요한 함수가 생길 수도 있다.
- 이때 해당 파일의 내보내기 기본값(`export default`)을 선언할 수 있다.
- 이렇게 하면 가져오기 과정이 좀 더 짧아진다.

```javascript
import { capitalize } from './util.js';

export function parseRegion(address) {
  const region = address.state || address.providence || '';
  return region.toUpperCase();
}

export function parseStreet({ street }) {
  return street.split(' ')
    .map(part => capitalize(part))
    .join(' ');
}

export default function normalize(address) {
  const street = parseStreet(address);
  const city = address.city;
  const region = parseRegion(address);
  return `${street} ${city} ${region}`;
}
```

- `normalize()` 함수를 가져올 떄는 중괄호를 사용하지 않는다.
- 중괄호를 사용하지 않으면 내보내기 기본값만 가져온다.
- 함수 이름을 똑같이 할 필요도 없다.
- 내보내기 기본값은 원하는 변수명으로 가져올 수 있다.
- 하지만 가동ㄱ성을 위해 같은 이름을 사용하는 것이 좋다.

```javascript
import normalize from './address.js';

function getAddress(user) {
  return normalize(user.address);
}

export default getAddress;
```

- 내보내기 기본값으로 정해진 함수와 함께 다른 함수도 가져와야 하는 경우에는 `import` 문을 혼합할 수 있다.

```javascript
import normalize, { parseRegion } from './address.js';

function getAddress(user) {
  return normalize(user.address);
}

export function getAddressByRegion(users) {
  // ... 생략
}
getAddressByRegion(bars);
// {NY: ["1120 Manhattan Ave Brooklyn NY"]}
```

- 가져오기 기본값은 특히 **클래스를 불러올 때 유용**하다.
- 한 개의 파일에는 한 개의 클래스만 두는 것이 좋으므로 다른 코드를 내보낼 만한 아유가 없기 때문이다.

```javascript
import { capitalize } from './util.js';

export default class Address {
  constructor(address) {
    this.address = address;
  }

  normalize() {
    const street = this.parseStreet(this.address);
    const city = this.address.city;
    const region = this.parseRegion(this.address);
    return `${street} ${city}, ${region}`;
  }

  parseStreet({ street }) {
    return street.split(' ')
      .map(part => capitalize(part))
      .join(' ');
  }

  parseRegion(address) {
    const region = address.state || address.providence || '';
    return region.toUpperCase();
  }
}
```

### 🎯 npm으로 커뮤니티 코드를 끌어와라.

- [**npm(node package manager)**](https://www.npmjs.com/)(Node 패키지 관리자)이라는 도구를 이용해 라이브러리 코드를 자신의 프로젝트에 직접 내려받고, 버전을 관리하고, 익숙한 규칙에 따라 개별 파일에서 코드를 가져와 사용할 수 있다.
- 물론 npm 말고 페이스북에서 만든, [**yarn**](https://yarnpkg.com/)을 사용해 npm을 대체해 사용할 수 있다.
- npm은 대부분 코드를 가져오기 위해 사용하지만, 그 외에도 프로젝트의 메타데이터나 구성 정보를 설정하고, 명렬줄 스크립트를 실행하고, 다른 사람들이 쓸 수 있도록 프로젝트를 게시할 수도 있다.
- npm을 사용할려면 Node.js를 설치해야 한다.(Node.js를 설치하면 npm도 설치된다.)
- 그 후 프로젝트를 초기화 하기 위해 `npm init`을 실행해준다.
- `npm init` 명령은 `package.json` 파일의 생성을 도와주는 구성 도구를 실행한다.
- `package.json` 파일에는 이름, 설명, 라이선스 등과 같은 프로젝트의 **메타데이터 정보뿐 아니라, 모든 외부 의존성 코드도 포함되어 있다.**
- `npm init`은 단지 `package.json` 파일만을 생성하고 다른 숨긴 파일이나 디렉터리는 생성하지 않는다.

```json
// package.json
{
  "name": "test",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}
```
- `package.json` 파일은 애플리케이션의 가장 중요한 진입점으로 외부 의존성에 대한 정보를 저장하는 곳이기도 하다.
- `npm`은 프로젝트 구조를 갖출 수 있을 뿐만 아니라 코드를 공유할 때도 사용할 수 있다.
- 또한, 다운로드 수, 수정되지 않은 버그의 수, 버전 등에 대한 정보를 추적할 수 있다는 것이다.
- 조사해보고, 코드를 가져와서 쓸 만큼 만족스럽다면 `npm install --save [원하는 패키지]` 명령을 실행해 프로젝트에 설치한다.
- `--save` 플래그는 반드시 써야하는 것은 아니지만 습관이 되면 좋다.
- `npm install`을 하면 프러젝트에 `node_modules` 디렉터리가 없는 경우 디렉터리를 생성하고 패키지를 내려받는다.
- 그다음에는 설치하는 패키지의 버전 번호로 `package.json` 파일을 갱신한다.
- 끝으로, 설치하는 코드의 버전에 대한 세부 정보를 담은 `package-lock.json` 파일을 생성한다.
- 갱신된 `package.json` 파일은 다음과 같으며, `dependencies` 필드가 추가된 것을 확인할 수 있다.

```json
{
  "name": "test",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "lodash": "^4.17.20"
  }
}
```

- 코드를 가져오는 것은 import 문을 사용하여 가져올 수 있다.
- 하지만 라이브러리를 설치했기 때문에 경로는 작성하지 않아도 된다.

```javascript
// ./src/merge.js
import lodash, { fromPairs } from 'lodash';

export function mapToObject(map) {
  return fromPairs([...map]);
}

export function objectToMap(object) {
  const pairs = lodash.toPairs(object);
  return new Map(pairs);
}
```

- 프로젝트 어느 곳에서든 동일한 문법으로 코드를 가져올 수 있다.
- 코드를 읽을 때 어떤 함수가 코드베이스 외부에서 가져온 것인지 쉽게 확인할 수 있다.
- **상대 경로를 사용하지 않고 불러온 코드는 외부 코드이다.**
- 실환경을 위한 빌드에서는 제외해야 하는 코드를 다룰 때는 `npm`이 개발 의존성을 다루고 실행할 수 있는 깔끔한 인터페이스를 제공한다.
- `npm install --save-dev [원하는 패키지]`로 `--save-dev` 플래그를 사용하여 설치할 수 있다.
- `package.json`에 의존성을 추가하는 필드가 다르다. (`devDependencies`)

```json
{
  "name": "test",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "lodash": "^4.17.20"
  },
  "devDependencies": {
    "prettier": "^2.1.2"
  }
}
```

- `npm` 스크립트를 이용해서 `node_modules` 디렉터리에 설치한 패키지를 실행할 수 있다.
- `npm run clean`을 실해하면 프로젝트에 설치한 `Prettier` 패키지를 `npm`이 실행해준다.
```json
{
  "name": "test",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "clean": "prettier --tab-width=2 --write ./code/*.js"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "lodash": "^4.17.20"
  },
  "devDependencies": {
    "prettier": "^2.1.2"
  }
}
```

- 이제 개별 프로젝트가 필요로 하는 의존성을 정리할 수 있을 뿐만아니라, 다른 개발자들이 빌드 과정, 의존성, 패키지 정보를 하나의 파일에서 확인할 수 있게 되었다.

### 🎯 컴포넌트 아키텍처를 이용해 애플리케이션을 만들어라.

- **컴포넌트 아키텍처(component architecture)** 로 흩어져 있는 HTML, 자바스크립트, CSS를 모으는 방법을 살펴보자.
- 오랫동안 개발자들은 파링 형식에 따라 분류하곤 했다. (최상위 디렉터리에 css, js, img 디렉터리를 만들고 분류)
- 그렇지만 개발자 도구가 발전하면서 새로운 패턴이 나왔는데 바로 컴포넌트 아키텍처라는 패턴이다.
- **컴포넌트는 관련 있는 모든 코드를 조합해 하나의 디렉터리에 담은 것이다.**
- 이렇게 하면 조각을 하나씩 추가하는 방법으로 웹 페이지나 애플리케이션을 만들 수 있다.
- 컴포넌트의 문제도 있는데 가장 큰 문제는 **빌드 도구에 의존한다는 점**이며, 그보다 덜하기는 하지만 **프레임워크에 의존한다는 문제**도 있다.
- 다음 예제는 리액트를 사용한 컴포넌트 아키텍처이다.
- 컴포넌트 아키텍처를 이요하면 간단한 패키지 하나에 모든 것을 결합할 수 있다.

```jsx
import React from 'react';
import './Copyright.css';

export default function CopyrightStatement() {
  const year = new Date().getFullYear();
  return (
    <div className="copyright">
      Copyright {year}
    </div>
  );
}
```
- `return` 문에 마크업이 있고, CSS 클래스는 `className`에 작성되어 있다.
- 위 코드는 리액트 프레임워크의 일부인 **`JSX`라고 부르는 특별한 마크업**이다.
- 컴포넌트의 경로는 `src/components` 디렉터리에 담겨있다.
- 또한, 결과적으로 컴파일된 코드가 담기는 `public` 디렉터리도 있다.
- 브라우저가 컴포넌트를 다룰 수 없기 때문에 모든 것은 결국 더 간단한 컴포넌트로 결합된다.
- `components` 디렉터리는 다뤄야할 모든 컴포넌트를 담고 있다.
- 각 컴포넌트는 개별 디렉터리에 나눠져 있다.
- **디렉터리 이름이 대문자로 시작하는 것은 리액트에서 사용하는 컨벤션이다.**
- 이렇게 불필요한 컴포넌트를 삭제하거나 옮기고 싶을때, 디렉터리 전체를 삭제할 수 있고, 불필요한 CSS가 어딘가 남아있는 것을 걱정하지 않아도 된다.
- 컴포넌트를 재사용할 수 있도록 만들어야 한다. 즉, 최대한 하드 코딩하는 설정이 없어야한다.
- 클릭할 때 어떤 동작이 필요한지는 명시적으로 작성하지 않는다.
- **대신 클릭할 때 동작을 컴포넌트에 주입한다.**
- 동작이나 자원을 컴포넌트에 전달하는 것은 다른 형태의 의존성 주입이다. (의존성 주입은 [TIP 32 테스트하기 쉬운 함수를 작성하라](https://github.com/saseungmin/reading_books_record_repository/tree/master/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%20%EC%BD%94%EB%94%A9%EC%9D%98%20%EA%B8%B0%EC%88%A0/Chapter%207#-%ED%85%8C%EC%8A%A4%ED%8A%B8%ED%95%98%EA%B8%B0-%EC%89%AC%EC%9A%B4-%ED%95%A8%EC%88%98%EB%A5%BC-%EC%9E%91%EC%84%B1%ED%95%98%EB%9D%BC) 참고)

```jsx
import React from 'react';
import './IdeaButton.css';
import idea from './idea.svg';

export default function IdeaButton({ handleClick, message }) {
  return (
    <button className="idea-button" onClick={handleClick}>
      <img className="idea-button_icon" src={idea} alt="idea icon" />
      {message}
    </button>
  );
}
```

- 리액트에서는 주입된 의존성을 함수의 인자를 통해 접근할 수 있다.
- 또한, 해체 할당을 이용해서 꺼내올 수 있다.
- 버튼의 메시지는 주입된 값에 따라 다르게 표시된다.
- 중괄호는 템플릿 문법이고, 변수 정보를 감싸고 있다. 
- 아래 예제는 페이지를 만드는 코드로 이 경우 페이지도 **다른 컴포넌트이다.**

```jsx
import React from 'react';

import './App.css';
import IdeaButton from './components/IdeaButton/IdeaButton';
import Copyright from './components/Copyright/Copyright';

function logIdea() {
  console.log('안녕하세요! 승민입니다!');
}
export default function App() {
  return (
    <div className="main">
      <div className="app">
        <IdeaButton
          message="나한테 좋은 생각이 있어!"
          handleClick={logIdea}
          />
      </div>
      <footer>
        <Copyright/>
        <IdeaButton
          message="저도 좋은 생각이 있어요!"
          handleClick={logIdea}
        >
      </footer>
    </div>
  );
}
```

- 코드를 가져오고 다른 모든 조각을 포함하며 모든 것을 결합한다.
- 하나의 논리적인 장소에 모든 것이 모여 있을 때 컴포넌트를 다루는 것이 정말 간단하다.
- 이처럼 컴포넌트 아키텍처는 직관적으로 이해하기 쉽다.
- 관련된 파일을 한곳에 모으는 것이다.
- 유일한 어려움은 모든 것을 연결하기가 쉽지 않다는 점이다.