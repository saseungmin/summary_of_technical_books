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