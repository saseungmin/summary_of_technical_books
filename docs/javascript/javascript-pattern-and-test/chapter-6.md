---
sidebar_position: 7
---

# 🌈 Chapter 6: 프라미스 패턴

## 📚 단위 테스트

### 🎈 프로미스 사용법
5장에서 `recordCheckIn` 함수에는 `checkInRecorder` 객체가 있었다. 하지만 단위 테스트를 할 때는 재스민 스파이가 `recordCheckIn` 대역이었고, 이 스파이는 오직 `recordCheckIn`이 호출되었는지만 감시했다.

```js
expect(checkInRecorder.recordCheckIn).toHaveCalledWith(attendee);
```

`checkInService`가 `checkInRecorder`를 호출하는 건 단순한 저질러 놓고 잊어버리기(fire-and-forget)라 호출 여부만 알면 그만이다.

```js
Conference.checkInService = function(checkInRecorder) {
  // 주입한 ㅊheckInRecorder의 참조값을 보관한다.
  var recorder = checkInRecorder;

  return {
    checkIn: function(attendee) {
      attendee.checkIn();
      recorder.recordCheckIn(attendee);
    }
  };
};
```

그러나 더 많은 일을 하고 싶을 때가 있다(예, 에러 처리 또는 작업 성공 시 후속 처리를 덧붙이는 작업). `checkInRecorder`는 보통 `XMLHttpRequest`로 체크인 등록 서버와 연동할 수 있게 구현한다. `checkInRecorder`는 요청을 보낸 후 `onreadystatechange` 이벤트를 귀 기울이고 있다가 결과의 성공/실패에 따라 조치를 한 뒤 자신의 호출부 (`checkInService`)에 바통을 넘기는 식으로 흘러간다. 이렇게 틀에 박힌 작업을 계속 신경 쓰는 건 따분한 일이고 자칫 난삽한 코드로 뒤범벅 될 우려도 있다. 다음처럼 뭔가 예쁘고 우아하게 처리할 수 없을까?

```js
Conference.checkInService = function(checkInRecorder) {
  'use strict';

  // 주입한 ㅊheckInRecorder의 참조값을 보관한다.
  var recorder = checkInRecorder;

  return {
    checkIn: function(attendee) {
      attendee.checkIn();
      recorder.recordCheckIn(attendee).then(
        // 성공
        attendee.setCheckInNumber,
        // 실패
        attendee.undoCheckIn,
      );
    }
  };
};
```

`recordCheckIn` 로직을 비동기 처리한 다음(이때 `then`을 호출), 그 결과의 성공/실패에 따라 지정된 콜백을 부른다. 이러한 요건을 단위 테스트로 5장의 단위테스트에서 다음과 같이 변경해준다.

```js
describe('Conference.checkInService', () => {
  'use strict';
  var checkInService, checkInRecorder, attendee;

  beforeEach(() => {
    checkInRecorder = Conference.checkInRecorder();
    checkInService = Conference.checkInService(checkInRecorder);
    attendee = Conference.attendee('형철', '서');
  });

  describe('checkInService.checkIn(attendee)', () => {
    describe('checkInRecorder 성공 시', () => {
      var checkInNumber = 1234;

      beforeEach(() => {
        spyOn(checkInRecorder, 'recordCheckIn')
          .and
          .callFake(() => Promise.resolve(checkInNumber));
      });

      it('참가자를 체크인 처리한 것으로 표시한다', () => {
        checkInService.checkIn(attendee);
        expect(attendee.isCheckedIn()).toBe(true);
      });

      it('체크인을 등록한다', () => {
        checkInService.checkIn(attendee);
        expect(checkInRecorder.recordCheckIn).toHaveBeenCalledWith(attendee);
      });

      // 테스트 추가
      it('참가자의 checkInNumber를 지정한다', () => {
        checkInService.checkIn(attendee);
        expect(attendee.getCheckInNumber()).toBe(checkInNumber);
      });
    });
  });
});
```

위 예에서 `Promise`가 이루어졌기에 `then` 메서드의 첫 번째 콜백이 호출되고, 이 콜백은 프로미스가 품고 있는 성공적인 처리 결과(`checkInNumber`)를 넘겨받는다.   

조만간 벌어질 일들을 정리해보자.
1. 단위 테스트는 `checkInService.checkIn`을 호출한다.
2. 이 메서드는 `recorder.recordCheckIn`을 호출한다.
3. `recordCheckIn`을 감시 중인 스파이는 `recordCheckIn`이 `checkInNumber` 값을 지닌 귀결 프라미스를 반환하도록 조작한다.
4. 이어서 `recordCheckIn(attendee).then`의 성공 콜백이 실행된다.
5. 성공 콜백 `attendee.setCheckInNumber`는 `checkInNumber`를 피라미터로 받는다.
6. 결국, 단위 테스트 마지막 줄의 기대식은 맞아 떨어진다!

하지만, 다음과 같은 이유로 테스트는 실패한다.
- `Promise`는 비동기적이다.
- 자바스크립트는 이벤트 루프로 멀티 스레딩을 모방했지만, 어디까지나 싱글스레드 방식으로 움직인다.

즉, 자바스크립트 이벤트 루프에서 다음 차례가 오기 전까지는 `Promise`의 `then` 메서드에 구현된 성공 콜백으로 프로그램 제어권이 넘어갈 리 없다. 다시 말해, 이미 기대식 평가는 옛날에 끝난 터라 `Promise` 귀결 시점에는 너무 늦어버린 꼴이다.   

올바르게 코드를 작성하려면 단위 테스트를 어떻게 고쳐야 할까? 첫째, `checkInService.checkIn`이 `then`을 호출하여 수신한 값을 반환하게 한다. 귀결/성공 콜백으로 끝나면 귀결 `Promise`를, 버림/실패 콜백에 이르면 버림 `Promise`를 반환할 것이다.

```js
var Conference = Conference || {};

Conference.checkInService = function(checkInRecorder) {
  'use strict';

  // 주입한 ㅊheckInRecorder의 참조값을 보관한다.
  var recorder = checkInRecorder;

  return {
    checkIn: function(attendee) {
      attendee.checkIn();
      recorder.recordCheckIn(attendee).then(
        function onRecordCheckInSucceeded(checkInNumber) {
          attendee.setCheckInNumber(checkInNumber);
          return Promise.resolve(checkInNumber);
        },
        function inRecordCheckInFailed(reason) {
          attendee.undoCheckIn();
          return Promise.reject(reason);
        }
      );
    }
  };
};
```

둘째, `then`이 내어준 `Promise`가 해결되기 전에 단위 테스트가 자신의 기대식을 평가하지 못하게 막아야 한다. 기대식을 `then`내부에서 실행시키면 된다.

```js
it('참가자의 체크인 번호를 세팅한다', (done) => {
  checkInService.checkIn(attendee).then(
    function onPromiseResolved() {
      expect(attendee.getCheckInNumber()).toBe(checkInNumber);
      done();
    },
    function onPromiseRejected() {
      expect('이 실패 분기 코드가 실행됐다').toBe(false);
      done(); // 비동기 처리가 다 끝나면 반드시 이 함수를 호출해야 한다. 그렇지 않으면 타임아웃 에러
    },
  );
});
```

> 비동기 코드를 테스트할 때는 항상 재스민의 `done()`을 써라.

다음은 실패하는 분기 로직을 확인하는 테스트다.

```js
describe('checkInRecorder 실패 시', () => {
  var recorderError = '체크인 등록 실패!';

  beforeEach(() => {
    spyOn(checkInRecorder, 'recordCheckIn').and.returnValue(
      Promise.reject(new Error(recorderError)),
    );
    spyOn(attendee, 'undoCheckIn');
  });

  it('기대 사유와 함께 버림 프라미스를 반환한다.', () => {
    checkInService.checkIn(attendee).then(
      function promiseResolved() {
        expect('이 성공 함수가 실행된다.').toBe(false);
        done();
      },
      function promiseRejected(reason) {
        expect(reason.message).toBe(recorderError);
        done();
      },
    );
  });
});
```

### 🎈 프로미스 생성과 반환
승현은 `checkInRecorder`를 구현하고자 한다. 그는 현재 지식을 바탕으로 단위 테스트를 구상한다.

```js
describe('Conference.checkInRecorder', () => {
  'use strict';

  var attendee, checkInRecorder;

  beforeEach(() => {
    attendee = Conference.attendee('Tom', 'Jones');
    checkInRecorder = Conference.checkInRecorder();
  });

  describe('recordCheckIn(attendee)', () => {
    it('참가자가 체크인되면 checkInNumber로 귀결된 프라미스를 반환한다', (done) => {
      attendee.checkIn();
      checkInRecorder.recordCheckIn(attendee).then(
        function promiseResolved(actualCheckInNumber) {
          expect(typeof actualCheckInNumber).toBe('number');
          done();
        },
        function promiseRejected() {
          expect('프로미스는 버려졌다').toBe(false);
          done();
        },
      );
    });

    it('참가자가 체크인되지 않으면 에러와 버림 프라미스를 반환한다', (done) => {
      checkInRecorder.recordCheckIn(attendee).then(
        function promiseResolved() {
          expect('프라미스는 귀결됐다').toBe(false);
          done();
        },
        function promiseRejected(reason) {
          expect(reason instanceof Error).toBe(true);
          expect(reason.message)
            .toBe(checkInRecorder.getMessages().mustBeCheckedIn)
          done();
        },
      );
    });
  });
});
```

이제 테스트에 성공하도록 `checkInRecorder`를 작성한다.

```js
var Conference = Conference || {};

Conference.checkInRecorder = function() {
  'use strict';

  var messages = {
    mustBeCheckedIn: '참가자는 체크인된 것으로 표시되어야 한다.',
  };

  return {
    getMessages: function() {
      return messages;
    },
    recordCheckIn: function(attendee) {
      return new Promise(function(resolve, reject) {
        if (attendee.isCheckedIn()) {
          resolve(4444); // 일단 아무 숫자나 넣는다.
        } else {
          reject(new Error(messages.mustBeCheckedIn));
        }
      });
    },
  };
};
```

승현은 잠시 고개를 갸우뚱하더니 콜백에서 `Promise.resolve`와 `Promise.reject`를 반환하지 말고 아예 처음부터 `checkInService.checkIn`에서 직접 프라미스를 만들어도 되지 않나 생각한다.

```js
var Conference = Conference || {};

Conference.checkInService = function(checkInRecorder) {
  'use strict';

  // 주입한 ㅊheckInRecorder의 참조값을 보관한다.
  var recorder = checkInRecorder;

  return {
    checkIn: function(attendee) {
      return new Promise(function checkInPromise(resolve, reject) {      
        attendee.checkIn();
        recorder.recordCheckIn(attendee).then(
          function onRecordCheckInSucceeded(checkInNumber) {
            attendee.setCheckInNumber(checkInNumber);
            resolve(checkInNumber);
          },
          function inRecordCheckInFailed(reason) {
            attendee.undoCheckIn();
            reject(reason);
          }
        );
      });
    }
  };
};
```

### 🎈 XMLHttpRequest 테스팅
이제 `recordCheckIn`의 `XMLHttpRequest`를 작성한다.   
재스민에서 `XMLHttpRequest`를 테스트할 때 jasmine-ajax라는 라이브러리를 사용하여 테스트를 작성할 수 있다.

```js
describe('Conference.checkInRecorder', () => {
  'use strict';

  var attendee, checkInRecorder;
  
  beforeEach(() => {
    attendee = Conference.attendee('일웅', '이');
    attendee.setId(777);
    checkInRecorder = Conference.checkInRecorder();

    // *** 1 ***
    // 재스민 XMLHttpRequest 모의 라이브러리 설치
    jasmine.Ajax.install();
  });

  afterEach(() => {
    // 다 끝난 후에는 원래 XMLHttpRequest로 돌려놓는다.
    jasmine.Ajax.uninstall();
  });

  describe('recordCheckIn(attendee)', () => {
    // *** 9 ***
    it('HTTP 요청이 성공하여 참가자가 체크인되면 checkInNumber로 귀결된 프라미스를 반환한다', () => {
      var expectedCheckInNumber = 1234;
      var request;

      attendee.checkIn();

      // *** 2 ***
      checkInRecorder.recordCheckIn(attendee).then(
        function promiseResolved(actualCheckInNumber) {
          // *** 8 ***
          expect(actualCheckInNumber).toBe(expectedCheckInNumber);
        },
        function promiseRejected() {
          expect('프로미스는 버려졌다').toBe(false);
        },
      );

      // *** 4 ***
      request = jasmine.Ajax.requests.mostRecent();

      // *** 5 ***
      expect(request.url).toBe('/checkin/' + attendee.getId());

      // *** 6 ***
      request.response({
        'status': 200,
        'contextType': 'text/plain',
        'responseText': expectedCheckInNumber,
      });
    });

    it('HTTP 요청이 실패하여 참가자가 체크인되지 않으면 정확한 메시지와 함께 버려진 프라미스를 반환한다', () => {
      var request;
      attendee.checkIn();
      checkInRecorder.recordCheckIn(attendee).then(
        function promiseResolved(actualCheckInNumber) {
          expect('프로미스는 귀결됐다').toBe(false);
        },
        function promiseRejected(reason) {
          expect(reason instanceof Error).toBe(true);
          expect(reason.message)
            .toBe(checkInRecorder.getMessages().httpFailure);
        }
      );

      request = jasmine.Ajax.requests.mostRecent();
      expect(request.url).toBe('/checkin/' + attendee.getId());
      request.response({
        'status': 404,
        'contentType': 'text/plain',
        'responseText': '이래서 에러가 났습니다.',
      });
    });

    it('참가자가 체크인되지 않으면 에러와 버림 프라미스를 반환한다', (done) => {
      checkInRecorder.recordCheckIn(attendee).then(
        function promiseResolved() {
          expect('프로미스는 귀결됐다').toBe(false);
          done();
        },
        function promiseRejected(reason) {
          expect(reason instanceof Error).toBe(true);
          expect(reason.message)
            .toBe(checkInRecorder.getMessages().mustBeCheckedIn);
          done();
        },
      );
    });
  });
});
```

당장 테스트하면 전부 실패할 테니 `XMLHttpRequest`를 `checkInRecorder`에 써넣는다.

```js
var Conference = Conference || {};

Conference.checkInRecorder = function() {
  'use strict';

  var messages = {
    mustBeCheckedIn: '참가자는 체크인된 것으로 표시되어야 한다.',
    httpFailure: 'HTTP 요청 실패!',
  };

  return {
    getMessages: function() {
      return messages;
    },
    recordCheckIn: function(attendee) {
      return new Promise(function(resolve, reject) {
        if (attendee.isCheckedIn()) {
          // *** 3 ***
          var xhr = new XMLHttpRequest();
          xhr.onreadystatechange = function onreadystatechange() {
            if (xhr.readyState == 4) {
              if (xhr.status == 200) {
                // *** 7 ***
                resolve(xhr.responseText);
              } else {
                reject(new Error(messages.httpFailure));
              }
            }
          };

          xhr.open('POST', '/checkin/' + attendee.getId(), true);
          xhr.send();
        } else {
          reject(new Error(messages.mustBeCheckedIn));
        }
      });
    },
  };
};
```

## 📚 프라미스 체이닝
> 샬럿: 이렇게 코딩하면 줄줄이 체이닝할 수 있겠는데? `then`이 귀결 코백 마다 자기 앞에 있는 `then`이 성공할 떄만 실행되게 하면 되잖아?   
> 승현: 물론 그렇게 할 순 있지만, 그러면 단계마다 두 번째(버림) 콜백이 필요하지 않을까? 게다가 `XMLHttpRequest` 객체를 여럿 설정해서 단위 테스트를 해야 할지도 몰라.   
> 샬럿: 맞아 그러네. 근데 말이야, 만일 한 단계라도 `return`이 빠지면, 다음 단계에서 `undefined`가 넘어오겠지? 이런 실수가 제법 자주 일어날 것 같은데?   
> 승현: 응 그래서 테스트할 때 실제 `checkInNumber`가 올바른지 확인하는 거잖아?   
> 샬럿: 글쎄, 그렇게 한다고 제대로 처리될 것 같지 않은데? 예를 들어, 만에 하나 `jasmine.Ajax` 라이브러리를 사용할 수 없는 상황이면 어찌 되겠어? 그래서 말인데, `Promise`에 범용적으로 쓸 만한 모의 라이브러리 같은 건 없을까?

- 샬럿은 정답을 찾았다.

## 📚 프라미스 래퍼
> 샬럿: 네가 짠 코드는 단순 무식하지만 `Promise`를 귀결시킬 때 문제가 될 거야. 이미 귀결된 상태에서 `Promise`를 만드는 걸 말하는 게 아니고, 이미 그건 네가 한 일이니까, 이미 있는 `Promise`의 귀결/버림 말이야.   
> 승현: 그것까진 몰랐네. 그런데 지금 보니 `Promise` 프로토타입에 `then`과 `catch` 두 메서드가 있는데?   
> 샬럿: 바로 그거야. 하지만 벌써 똑똑한 사람들이 유사 `Promise` 객체를 의존성으로 주입하는, `Deferred` 같은 래퍼를 만들어놨더라고. 이걸 단위 테스트할 때 진짜 프라미스나 가짜 프라미스처럼 활용할 수 있을 거 같아.

```js
// 앵귤러 1.3에서 Q라는 프라미스 라이브러리
var deferred = $q.defer(); // 미뤄진 객체를 생성한다.
var promise = deferred.promise; // promise라는 프로퍼티가 있다.
deferred.resolve(1234); // 1234 값으로 프라미스를 귀결한다.
```

## 📚 상태와 숙명

> 샬럿: `Promise`를 다룰 땐 말이야. 진짜든 `Deferred` 쓴 가짜든 `Promise`의 귀결과 이룸 사이의 미묘한 차이를 이해해야 해. 이룸 `Promise`를 생성하는 함수를 `Promise.fulfill`이 아니라 `Promise.resolve`라고 부른단 말이지. `Promise`는 **꼭 어떤 값으로 이루어서 귀결시켜야 한단 법이 없기 때문이야.** 다른 `Promise`로도 얼마든지 귀결시킬 수 있어. 이미 버려진 `Promise`나 나중에 버려질 `Promise`라도 상관없어. **귀결되었다**는 말은 프라미스 숙명이 어느 한쪽으로 결정됐단 뜻이거든. 하나의 값으로 못 박히든지, 아니면 다른 프라미스의 궁극적인 숙명이 되는 게지.   
> 깃허브를 뒤저보니 상태와 운명이라는 제목으로 정리가 잘 되어있는 사이트가 있더라. ([참고](https://github.com/domenic/promises-unwrapping/blob/master/docs/states-and-fates.md))   
> 기본적으로 `Promise`는 언제나 세 가지 **상태**(**state**), 즉 이룸(fulfilled), 버림(rejected), 보류(pending) 중 하나야. 기술적으로 깊게 들어가면 더욱 미세한 차이점이 있지만, 대체로 우리가 짐작하는 그대로야.   
> **숙명**(**fate**)은 귀결(resolved)과 미결(unresolved), 두 가지야. 미결 프라미스의 상태는 항상 보류지만, 귀결 프라미스는 세 가지 상태 중 하나가 될 수 있지. 물론 이룸 상태가 제일 일반적이지만.   
> `then`에서 버림 처리할 `Promise`를 반환해도 단위 테스트에서는 귀결 부분으로 흘러갈 수 있다는 사실이 우리 직관에 다소 반하는 것 같지만, 이 버림 콜백이 귀결 프라미스나 (다음에 귀결 플미스로 바뀔) 빈 값을 반환하는 일은 가능하겠지.

## 📚 표준 프라미스가 제이쿼리 프라미스와 다른 점
> 샬럿: 우리가 알고 있는 것과 달리 제이쿼리 프라미스랑 그냥 `Promise`가 똑같은 게 아니더라고. ([참고](https://github.com/kriskowal/q/wiki/Coming-from-jQuery))

## 📚 정리하기
`Promise`를 생성하고 사용하는 방법을 배웠다.
- `Promise`는 나중에 벌어질 이벤트와 그 성공/실패에 따라 각기 실행할 콜백을 캡슐화한 장치다.
- `Promise` 생성자의 인자는 비동기 작업을 감싼 함수다. 이 함수는 두 인자, 즉 `resolve`와 `reject`를 받는다. `Promise`가 귀결 또는 버림 처리될 때 둘 중 한 함수가 호출된다.
- `Promise`객체의 핵심은 `then` 메서드로, 콜백 함수 2개를 인자로 취한다.
- `Promise`가 귀결되면 첫 번째 콜백으로 이어지고, 이 콜백은 귀결값을 파라미터로 받는다.
- `Promise`가 버려지면 두 번째 콜백이 실행되고 버림 사유를 파라미터로 받는다. 버림 사유는 보통 `Error` 객체로 받지만, 단순 문자열도 상관없다.

프라미스 기반 코드를 테스트할 때 조심할 함정
- 비동기로 작동하는 프라미스는 조심하지 않으면 테스트 기대식이 실행될 때 여전히 미결 상태로 남을 수 있다. 그래서 실패해야 할 테스트가 성공한 것처럼 눈속임한다. 재스민은 특별히 비동기 코드 테스팅을 `done()` 함수로 지원한다.
- `XMLHttpRequest`를 사용한 코드를 테스트할 때 서버를 직접 호출하지 않고 비동기적인 HTTP 특성을 흉내 내고 싶을 때가 있다. 재스민에서 제공하는 AJAX 모의 라이브러리를 사용하면 된다.
- `Promise`는 구조상 체이닝을 할 수 있다. 경우의 수를 모두 따져보고 의도했떤 `then` 콜백으로 실행 흐름이 이루어지는지 확인하라.
- 앵귤러JS의 `$q`나 크리스 코왈의 `Q` 같은 프라미스 래퍼를 이용하면 단위 테스트에서 프라미스 귀결/버림을 더 효과적으로 다룰 수 있다.
