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

- 콜백 함수는 비동기 데이터를 다루는 좋은 방법이고 오랫동안 표준적인 방법이였다.
- 하지만, 문제는 비동기 함수에서 또 비동기 함수를 호출하고, 거기서 또 비동기 함수를 호출해 마침내 너무나 많은 콜백이 중첩되는 경우가 생기는 것이다.
- 이런 경우를 아래 사진과 같이 **콜백 지옥(Callback Hell)** 이라고 한다.

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

- 프라미스가 담긴 배열을 받아 모든 프라미스가 종료되었을 때의 성공 또는 실패 결과를 반환하는 `Promise.all` 이라는 메서드도 있다. ([MDN](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise/all), [모던 javascript 튜토리얼](https://ko.javascript.info/promise-api#ref-566))

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