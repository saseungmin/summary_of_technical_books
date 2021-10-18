## 🌈 Chapter 9 : 외부 데이터에 접근하라.

### 🎯 프라미스를 이용해 비동기적으로 데이터를 가져오라.

- 자바스크립트는 **비동기 언어**이다. 비동기 언어는 그저 이전의 코드가 완전히 해결되지 않아도 이어지는 코드를 실행할 주 있는 언어를 의미한다.
- [비동기 코드와 동기 코드의 차이점 참고](https://www.pluralsight.com/guides/introduction-to-asynchronous-javascript)
- 비동기 언어의 가치는 **지연된 정보를 기다리는 동안 이 정보가 필요하지 않은 다른 코드를 실행할 수 있다는 점**에 있다. (지연된 정보를 기다리는 동안 코드가 멈추지 않는다.)
- 비동기 데이터를 다룰 때 반복적으로 사용할 수 있는 기법인 [**프라미스(Promise)**](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise)가 있다. ([모던 JavaScript 튜토리얼 참고](https://ko.javascript.info/promise-basics))
- 프라미스가 등장하기 전에는 **콜백(Callback) 함수**를 사용해 비동기 작업을 처리했다.
- 데이터 원본에 비용을 요청할 때 콜백 함수를 인수로 넘겨주고, 이 함수가 비동기 데이터를 가져온 후에는 콜백 함수를 호출한다. (예: `setTimeout()`)
- 다음 예제는 `setTimeout()`을 사용한 비동기 처리 코드이다.

```javascript
function getUserPreferences(cb) {
  return setTimeout(() => {
    cb({
      theme: 'dusk',
    });
  }, 1000);
}

function log(value) {
  return console.log(value);
}

log('starting'); // starting

getUserPreferences(preference => {
  return log(preference.theme.toUpperCase());
});

log('ending?'); // ending?

// DUSK
```

- 콜백 함수는 비동기 데이터를 다루는 좋은 방법이고 오랫동안 표준적인 방법이었다.
- 하지만, 문제는 비동기 함수에서 또 비동기 함수를 호출하고, 거기서 또 비동기 함수를 호출해 마침내 너무나 많은 콜백이 중첩되는 경우가 생기는 것이다.
- 이런 경우를 아래 사진과 같이 **콜백 지옥(Callback Hell)**이라고 한다.

![callback_hell](../img/callback%20hell.jpeg)

- 프라미스를 사용하면 이러한 콜백 함수 문제를 해결할 수 있다.
- 프라미스는 콜백 함수를 인수로 받는 대신에 **성공과 실패에 대응하는 메서드를 사용한다.**
- 프라미스는 비동기 작업을 전달받아서 응답에 따라 두 가지 메서드 중 하나를 호출하는 객체이다.
- 프라미스는 비동기 작업이 **성공하거나 충족된 경우** `then()` 메서드에 결과를 넘겨준다.
- 비동기 작업에 **실패하거나 거부되는 경우**에는 프로미스가 `catch()` 메서드를 호출한다.
- `then()`과 `catch()` 메서드에는 **모두 함수를 인수로 전달한다.**
- 이때 두 메서드에 인수로 전달되는 함수에는 **비동기 작업의 결과인 응답만이 인수로 전달된다.**
- 프라미스는 두 개의 인수, `resolve()`와 `reject()`를 전달받는다.
- `resolve()`는 코드가 의도대로 동작했을 때 실행되고 `resolve()`가 호출되면 `then()` 메서드에 전달된 함수가 실행된다.

```javascript
function getUserPreferences() {
  const preference = new Promise((resolve, reject) => {
    resolve({
      theme: 'dusk',
    });
  });
  return preference;
}

// 성공한 경우 then() 메서드를 이용해서 코드를 호출
getUserPerferences()
  .then(preference => {
    console.log(preference.theme);
  });
// 'dusk'
```
- 프라미스를 설정할 때 `then()`과 `catch()` 메서드를 모두 사용할 수 있다.
- 다음은 실패하는 프라미스이다. 인수에 있는 `reject()`가 호출된다.

```javascript
function failUserPreference() {
  const finder = new Promise((resolve, reject) => {
    reject({
      type: '접근 거부됨',
    });
  });
  return finder;
}
```

- 프라미스를 호출할 때 `then()`메서드와 `catch()`메서드를 연결해서 추가할 수 있다.
  
```javascript
failUserPreference()
  .then(preference => {
    // 실행되지 않는다.
    console.log(preference.theme);
  })
  .catch(error => {
    console.log(`실패: ${error.type}`);
  });
// 실패: 접근 거부됨
```

- 다음 예제는 중첩된 콜백 함수를 프라미스로 변경한 코드이다.

```javascript
function getMusic(theme) {
  if(theme === 'dusk') {
    return Promise.resolve({
      album: 'music for airports',
    });
    return Promise.resolve({
      album: 'kind of blue',
    });
  }
}

getUserPreferences()
  .then(preference => {
    return getMusic(preference.theme);
  })
  .then(music => {
    console.log(music.album);
  });
// music for airports
```
- 여러 개의 중첩된 콜백 함수에 데이터를 전달하는 대신 여러 개의 `then()` 메서드를 통해 데이터를 아래로 내려주는 것이다.
- 위의 코드를 아래와 같이 변경해줄 수 있다.

```javascript
getUserPreferences()
  .then(preference => getMusic(preference.theme))
  .then(music => { console.log(music.album); });
```

- 끝으로, 프라미스를 연결하는 경우에는 `catch()` 메서드를 개별적으로 연결할 필요가 없다.
- `catch()` 메서드를 하나만 정의해서 프라미스가 거절되는 모든 경우를 처리할 수 있다.

```javascript
function getArtist(album) {
  return Promise.resolve({
    artist: 'Brian Eno',
  });
}

function failMusic(theme) {
  return Promise.reject({
    type: '네트워크 오류',
  });
}

getUserPreferences()
  .then(preference => failMusic(preference.them))
  .then(music => getArtist(music.album))
  // 거부될 때(reject) 실행된다.
  .catch(e => {
    console.log(e);
  });
// {type: "네트워크 오류"}
```

- 프라미스가 담긴 배열을 받아 모든 프라미스가 종료되었을 때의 성공 또는 실패 결과를 반환하는 `Promise.all`이라는 메서드도 있다. ([MDN](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise/all), [모던 javascript 튜토리얼](https://ko.javascript.info/promise-api#ref-566))

### 🎯 async/await로 함수를 명료하게 생성하라.

- 프라미스는 콜백과 비교하면 엄청난 발전이지만 인터페이스가 여전히 다소 투박하다.
- 프라미스를 사용해도 여전히 메서드에서 콜백을 다뤄야 한다.
- `async/await`를 이용해 프라미스를 효율적으로 처리할 수 있다.
- `async` 키워드를 이용해서 선언한 함수는 **비동기 데이터를 사용한다는 것을 의미한다.**
- 비동기 함수의 내부에서 `await` 키워드를 사용하면 **값이 반환될 때까지 함수의 실행을 중지시킬 수 있다.**
- `async/await`는 **프라미스를 대체하지는 않는다.** 단지 프라미스를 더 나은 문법으로 감싸는 것에 불과하다.
- 아래 코드는 프라미스를 사용했던 예제 코드를 `async/await`로 변경할 수 있다.

```javascript
getUserPreferences()
  .then(preference => {
    console.log(preference.theme);
  });
// 'dusk'

async function getTheme() {
  const { theme } = await getUserPreferences();
  return theme;
}
```
- 비동기 함수는 프라미스로 변환된다는 점이다.
- 즉, `getTheme()`를 호출해도 여전히 `then()`메서드가 필요하다.

```javascript
getTheme()
  .then(theme => {
    console.log(theme);
  })
// dusk
```

- `async` 함수는 **여러 개의 프라미스**를 다룰 때 좋다.
- `async/await`를 이용하면 개별 프라미스에서 반환된 값을 **변수에 먼저 할당하고 다음에 이어질 함수로 전달**할 수 있다.
- 즉, 연결된 프라미스를 하나의 함수로 감싸진 여러 개의 함수 호출로 변환할 수 있다.

```javascript
async function getArtistByPreference() {
  const { theme } = await getUserPreferences();
  const { album } = await getMusic(theme);
  const { artist } = await getArtist(album);
  return artist;
}

getArtistByPreference()
  .then(artist => {
    console.log(artist);
  });
// Brian Eno
```

- 오류는 다음 예제처럼 `catch()` 메서드를 추가해서 잡을 수 있다.

```javascript
async function getArtistByPreference() {
  const { theme } = await getUserPreferences();
  const { album } = await failMusic(theme);
  const { artist } = await getArtist(album);
  return artist;
}
getArtistByPreference()
  .then(artist => {
    console.log(artist);
  })
  .catch(e => {
    console.log(e);
  });
// {type: "네트워크 오류"}
```

### 🎯 fetch로 간단한 AJAX 호출을 처리하라.

- `fetch()`를 이용해서 원격 데이터를 가져올 수 있다.
- API를 이용하면 네이티브 소프트웨어처럼 작동하는 매우 빠른 애플리케이션을 만들어낼 수 있다.
- [AJAX(Asynchronous JavaScript And XML)](https://developer.mozilla.org/ko/docs/Web/Guide/AJAX/Getting_Started)(비동기 자바스크립트와 XML)로 데이터를 가져오는 것은 꽤 번거로웠다.
- AJAX 호출을 처리할 수 있는 `fetch()`라는 간단한 도구가 생겼다.
- `fetch()`는 자바스크립트 명세의 일부가 아니라 `fetch()` 명세는 WHATWG(Web Hypertext Application Technology Working Group)가 [정의](https://fetch.spec.whatwg.org/)한다.
- 따라서 대부분의 최신 브라우저에서 지원되지만 Node.js에서는 기본적으로 지원되지 않는다.
- Node.js에서 `fetch()`를 사용하려면 [node-fetch 패키지](https://www.npmjs.com/package/node-fetch)를 사용해야 한다.
- `fetch()`를 사용하려면 API 끝점(endpoint)이 필요하다. 
- typicode는 [JSONPlaceholder](https://jsonplaceholder.typicode.com/)를 통해 가상 블로그 데이터를 제공하고 있다.
- 또한, typicode에서 제공하는 [JSON 서버](https://github.com/typicode/json-server)라는 도구를 이용하면 로컬 환경에서 모의 API를 만들 수 있다.
- 다음은 `fetch()`를 사용한 `GET` 요청이다.
  
```javascript
fetch('https://jsonplaceholder.typicode.com/posts/1');
// {
// "userId": 1,
// "id": 1,
// "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
// "body": "quia et suscipit\nsuscipit recusandae...",
// }
```

- 요청을 보내고 나면 `fetch()`는 아래 사진과 같이 응답을 처리하는 프라미스를 반환한다.

![fetch](../img/2.PNG)

- `then()` 메서드에 응답을 처리하는 콜백 함수를 추가한다.
- `fetch()`는 다양한 믹스인을 포함하고 있어서 **응답 본문 데이터를 자동으로 변환해준다.**
- `then()` 메서드의 콜백에서 파싱 된 데이터를 처리할 수 있다.

```javascript
fetch('https://jsonplaceholder.typicode.com/posts/1')
  .then(data => {
    // Response {...}
    return data.json();
  })
  .then(post => {
    console.log(post.title);
    // sunt aut facere repellat provident occaecati excepturi optio reprehenderit
  });
```
- `fetch()` 프라미스는 상태 코드가 `404`여서 요청에 실패한 경우에도 응답 본문을 반환한다.
- 즉, 요청이 실패하는 경우를 `catch()` 메서드만으로 처리할 수 없다.

```javascript
fetch('https://jsonplaceholder.typicode.com/posts/1')
  .then(data => {
    // 200 ~ 299 사이인 경우 true로 설정되어 있는 ok 필드.
    // 익스플로러 지원 x
    if(!data.ok) {
      throw Error(data.status);
    }
    return data.json();
  })
  .then(post => {
    console.log(post.title);
  })
  .catch(e => {
    console.log(e);
  });
```

- `fetch()`를 사용한 `POST`방법은 두 번째 인수로 설정 조건을 담은 객체를 전달해야 한다.
- 설정 객체는 서로 다른 다양한 세부 사항을 담을 수 있다.
- 여기서 가장 중요한 정보만 포함시킬 것이다.
- 메서드를 `POST`를 사용한다고 선언해주고, `JSON` 데이터를 넘겨줘야 한다.
- 그리고 `JSON` 데이터를 보내기 때문에 헤더의 `Content-Type`을 `application/json`으로 설정해야 한다.
- 끝으로 `JSON` 데이터를 담은 문자열로 요청 본문을 추가한다.

```javascript
const update = {
  title: 'Clarence White Techniques',
  body: 'Amazing',
  userId: 1,
};

const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(update),
};

fetch('https://jsonplaceholder.typicode.com/posts', options)
  .then(data => {
    if(!data.ok) {
      throw Error(data.status);
    }
    return data.json();
  })
  .then(update => {
    console.log(update);
    // {
    //   title: "Clarence White Techniques", 
    //   body: "Amazing", 
    //   userId: 1, 
    //   id: 101
    // }
  })
  .catch(e => {
    console.log(e);
  });
```
- 자세한 사항은 [MDN 참고](https://developer.mozilla.org/ko/docs/Web/API/Fetch_API/Fetch%EC%9D%98_%EC%82%AC%EC%9A%A9%EB%B2%95)

### 🎯 localStorage로 상태를 장기간 유지하라.

- `localStorage`를 이용하면 사용자 정보를 쉽게 저장할 수 있다.
- `localStorage`는 브라우저에만 존재하는 작은 데이터베이스와 같다.
- `localStorage`에 정보를 추가하거나 가져올 수 있지만, **브라우저의 자바스크립트에서 직접적으로 접근할 수는 없다.**
- 값을 저장하려면 `localStorage` 객체에 `setItem()` 메서드를 사용해서 값을 설정하면 된다.
- 첫 번째 인수에는 키, 두 번째 인수에는 값을 전달한다.

```javascript
function saveBreed(breed) {
  localStorage.setItem('breed', breed);
}
```

- 사용자가 페이지를 떠났다가 다시 방문할 때는 비슷한 명령으로 데이터를 가져올 수 있다.

```javascript
function getSavedBreed() {
  return localStorage.getItem('breed');
}
```

- 추가했던 항목을 삭제할 수도 있다.

```javascript
function removeBreed() {
  return localstorage.removeItem('breed');
}
```

- `localStorage`의 강점은 사용하면 사용자에게 추가적인 노력을 요구하지 않고도 사용자 정보를 저장할 수 있다.
- 즉, 페이지를 떠났다가 다시 돌아오거나 새로 고침을 하더라도 이전과 동일하게 애플리케이션을 설정할 수 있다.

```javascript
function applyBreedPreference(filters) {
  const breed = getSavedBreed();
  if(breed) {
    filters.set('breed', breed);
  }
  return filters;
}
```

- 다른 객체와 마찬가지로 원하는 만큼 키를 추가할 수 있다.
- 사용자가 설정한 모든 조건을 저장하고 싶은 경우 항목별로 저장할 수 있지만, 그룹으로 묶어서 저장하면 훨씬 쉽다.
- `localStorage`의 유일한 단점은 **데이터가 반드시 문자열이어야 한다는 점이다.**
- `localStorage`에 **배열이나 객체는 저장할 수 없다.**
- 이 단점은 `JSON.stringify()`를 이용해 데이터를 문자열로 변환하고, 다시 가져올 때는 `JSON.parse()`를 이용해 자바스크립트 객체로 변환하면 된다.
- 사용자의 검색 조건을 모두 저장하려면 모든 조건을 문자열로 바꿔야 한다.
- 조건을 처리할 때 맵을 사용했기 때문에 문자열로 바꾸려면 먼저 배열에 펼쳐 넣어야 한다.

```javascript
let filters = new Map();
filters.set('id','seungmin');

function savePreferences(filters) {
  const filterString = JSON.stringify([...filters]);
  localStorage.setItem('preferences', filterString);
}

savePreferences(filters);
```

- 저장한 데이터를 다시 사용할 때는 `localStorage`에서 데이터를 가져와 다시 맵으로 변환하면 된다.
- 객체나 배열을 저장하는 경우에는 문자열을 파싱하는 과정만 거치면 된다.

```javascript
function retrievePreferences() {
  const preferences = JSON.parse(localStorage.getItem('preferences'));
  return new Map(preferences);
}
retrievePreferences();
// Map(1) {"id" => "seungmin"}
```

- `localStorage`를 비워야 하는 경우는 `clear()`를 사용해서 모든 키-값 쌍을 삭제할 수 있다.

```javascript
function clearPreferences() {
  localStorage.clear();
}
```
- 단점은 여러 기기에서 데이터를 유지할 수 없다는 단점이 있지만, 로그인을 피할 수 있다는 이점이 훨씬 더 크다.
- 덧붙여서 [`sessionStorage`](https://developer.mozilla.org/ko/docs/Web/API/Window/sessionStorage)를 사용해도 데이터를 임시로 저장할 수 있다.
- 이 도구는 서버 측 렌더링과 클라이언트 측 기능을 혼합되어 있는 경우에 유용하다.
- 페이지를 **새로 고침하면 저장한 데이터가 유지**되고, 사용자가 **페이지를 떠났다가 다시 돌아오면 저장한 데이터가 없는 기본 상태를 보여준다.**
- 완전히 통합된 단일 페이지 애플리케이션을 만들어내는 도구를 다룰 수 있다.
- 브라우저에 저장된 정보와 API 접근을 이용하면 서버를 통한 페이지 렌더링을 한 번으로 줄일 수 있다.