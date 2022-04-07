---
sidebar_position: 6
---

# 🌈 Chapter 5: 콜백 패턴

## 📚 단위 테스트

### 🎈 콜백 함수를 사용한 코드의 작성과 테스팅

> **요구사항**: 승현은 곧 개최될 자바스크립트 콘퍼런스 웹 사이트의 담당 개발자다. 그는 콘퍼런스 자원봉사자가 사용할 참가자 체크인 화면을 구현해야 한다. 이 신규 화면은 참가자 목록을 보여주고 그중 한 사람 또는 여러 사람을 선택(체크칭한 것으로 표시) 한 뒤 외부 시스템과 연동하여 체크인을 완료한다. UI 배후의 체크인 기능은 `checkInService` 함수로 구현하기로 했다.   

참가자를 각각 체크인하려면 `attendeeCollection` 객체는 참가자 개인별로 어떤 액션을 수행할 수 있는 구조여야 한다. 승현은 바로 이 액션을 콜백 함수에 넣어 실행하고 싶다. 먼저 `contains`, `add`, `remove` 함수가 필수인 `attendeeCollection`을 다음과 같이 정의한다.

```js
var Conference = Conference || {};
Conference.attendeeCollection = function() {
  var attendees = [];

  return {
    contains: function(attendee) {
      return attendees.indexOf(attendee) > -1;
    },
    add: function(attendee) {
      if (!this.contains(attendee)) {
        attendees.push(attendee);
      }
    },
    remove: function(attendee) {
      var index = attendees.indexOf(attendee);

      if (index > -1) {
        attendees.splice(index, 1);
      }
    },

    iterate: function(callback) {
      // attendees의 각 attendee에 대해 콜백을 실행한다.
    }
  }
}
```

`iterate`를 구현하기 전에 일단 단위 테스트를 만들어 기능을 다음과 같이 점검할 수 있다.

```js
describe('Conference.attendeeCollection', () => {
  describe('contains(attendee)', () => {
    // contains 테스트
  });

  describe('add(attendee)', () => {
    // add 테스트
  });

  describe('remove(attendee)', () => {
    // remove 테스트
  });

  describe('iterate(callback)', () => {
    var collection, callbackSpy;

    // 도우미 함수
    function addAttendeesToCollection(attendeeArray) {
      attendeeArray.forEach(function(attendee) {
        collection.add(attendee);
      });
    }

    function verifyCallbackWasExecutedForEachAttendee(attendeeArray) {
      // 각 원소마다 한 번씩 스파이가 호출되었는지 확인한다.

      expect(callbackSpy.calls.count()).toBe(attendeeArray.length);

      // 각 호출마다 spy에 전달한 첫 번째 인자가 해당 attendee인지 확인한다.
      var allCalls = callbackSpy.calls.all();
      for (var i = 0; i < allCalls.length; i++) {
        expect(allCalls[i].args[0]).toBe(attendeeArray[i]);
      }
    }

    beforeEach(function() {
      collection = Conference.attendeeCollection();
      callbackSpy = jasmine.createSpy();
    });

    it('빈 컬렉션에서는 콜백을 실행하지 않는다', () => {
      collection.iterate(callbackSpy);

      expect(callbackSpy).not.toHaveBeenCalled();
    });

    it('원소가 하나뿐인 컬렉션은 콜백을 한 번만 실행한다', () => {
      var attendees = [Conference.attendee('윤지', '김')];

      addAttendeesToCollection(attendees);;

      collection.iterate(callbackSpy);

      verifyCallbackWasExecutedForEachAttendee(attendees);
    });

    it('컬렉션 원소마다 한 번씩 콜백을 실행한다', () => {
      var attendees = [
        Conference.attendee('윤지', '김'),
        Conference.attendee('Tom', 'Kazansky'),
        Conference.attendee('태영', '김'),
      ];

      addAttendeesToCollection(attendees);;

      collection.iterate(callbackSpy);

      verifyCallbackWasExecutedForEachAttendee(attendees);
    });
  });
});
```

콜백 기능에 둔 이 테스트는 다음 두 가지를 확인한다.
- 콜백 실행 횟수가 정확하다.
- 콜백이 실행될 때마다 알맞은 인자가 전달된다.

이제 `attendeeCollection.iterate` 함수를 구현할 수 있다.

```js
var Conference = Conference || {};
Conference.attendeeCollection = function() {
  var attendees = [];

  return {
    // ...
    getCount: function() {
      return attendees.length;
    },

    iterate: function(callback) {
      attendees.forEach(callback);
    }
  }
}
```

`attendeeCollection` 기능 구현은 마쳤지만, 이 절 앞부분에서 제시한 요건이 아직 다 반영된 것은 아니다. 참가자 체크인 후 외부 시스템에 체크인을 등록하는 코드가 아직 남았다.

### 🎈 콜백 함수의 작성과 테스팅
`attendeeCollection` 틀을 잡았으니 추가 기능 구현은 개별 참가자를 체크인하는 콜백 함수만큼이나 간단하다. 참가자를 체크인하는 익명 함수를 `attendeeCollection.iterate` 함수에 바로 넣기만 하면 된다.

```js
var attendees = Conference.attendeeCollection();

// UI에서 선택된 참가자들을 추가한다.
attendees.iterate(function(attendee) {
  attendee.checkIn();
  // 외부 서비스에 체크인을 등록한다.
})
```

함수를 정의하기 무섭게 다른 함수에 코백으로 바로 넘기는 건 자바스크립트의 강력한 특성이지만, 자칫하면 저도에서 벗어날 우려도 있다.   

첫째, 익명 콜백 함수는 콜백만 따로 떼어낼 뱅법이 없어서 단위 테스트가 불가능하다. 이 예제에서도 참가자 체크인 기능이 `attendeeCollection`에 묶여 있으므로(콜백 실행 여부가 아니라, 참가자들이 제대로 체크인해서 등록 처리가 끝났는지 테스트할 의도가 아니라면) 컬렉션에 포함된 참가자들의 체크인 여부는 전체 컬렉션을 상대로 계속 테스트를 반복할 수밖에 없다.   

둘째, 익명 함수는 디버깅을 매우 어렵게 만든다. 익명 함수는 정의 자체가 이름 없는 함수라서 디버거가 호출 스택에 식별자를 표시할 수 없다. **참조할 함수명이 없는 함수는 실행 콘텍스트를 분간하기 어렵고 결과적으로 디버깅 자체가 녹록하지 않다.**   
하지만 콜백 함수에도 이름을 붙일 수 있는데, 그렇다고 해서 테스트성이 더 좋아지는 건 아니지만, 적어도 디버깅 작업은 한결 수월해진다.

```js
var attendees = Conference.attendeeCollection();

// UI에서 선택된 참가자들을 추가한다.
attendees.iterate(function doCheckIn(attendee) {
  attendee.checkIn();
  // 외부 서비스를 통해 체크인 등록한다.
});
```

이제 호출 스택 목록에 함수명이 표시되어 콘텍스트를 파악할 수 있고 디버깅 작업이 편해졌다.   

다른 방법으로 참가자 체크인은 중요한 기능 요건이므로 가력 `checkInService` 같은 자체 모듈에 캡슐화하면 테스트 가능ㅇ한 단위로 만들 수 있고 체크인 로직을 `attendeeCollection`에서 분리하여 코드를 재사용할 수도 있다.   

> TDD 방식으로 개발하면 즉흥적이고 두서없는 코드가 만들어질까 봐 염려하는 사람들이 많지만, 오히려 테스트 세부를 주의 깊게 바라볼 수 있어 프로그램 구조가 개선되는 효과가 있다.

다음 예는 `checkInService.checkIn` 함수의 기본 기능을 점점하는 테스트 꾸러미다.

```js
describe('Conference.checkInService', () => {
  var checkInService, checkInRecorder, attendee;

  beforeEach(() => {
    checkInRecorder = Conference.checkInRecorder();
    spyOn(checkInRecorder, 'recordCheckIn');

    // checkInRecorder를 주입하면서
    // 이 함수의 recordCheckIn 함수에 스파이를 심는다.
    checkInService = Conference.checkInService(checkInRecorder);

    attendee = Conference.attendee('형철', '서');
  });

  describe('checkInService.checkIn(attendee)', () => {
    it('참가자를 체크인 처리한 것으로 표시한다', () => {
      checkInService.checkIn(attendee);
      expect(attendee.isCheckedIn()).toBe(true);
    });

    it('체크인을 등록한다', () => {
      checkInService.checkIn(attendee);
      expect(checkInRecorder.recordCheckIn).toHaveBeenCalledWith(attendee);
    });
  });
});
```

`checkInService.checkIn` 단위 테스트가 만들어졌고, `checkInService` 구현 역시 간단하다.

```js
var Conference = Conference || {};

Conference.checkInService = function(checkInRecorder) {
  // 주입한 checkInRecorder의 참조값을 보관한다.
  var recorder = checkInRecorder;

  return {
    checkIn: function(attendee) {
      attendee.checkIn();
      recorder.recordCheckIn(attendee);
    }
  };
};
```

마지막으로 콜백 패턴으로 콘퍼런스 참가자를 체크인하는 기능이 테스트를 통과한, 독립적이고 믿음성 있는 3개의 모듈로 서로 잘 조화되어 실행되는 모습이다.

```js
var checkInService = Conference.checkInService(Conference.checkInRecorder());
var attendees = Conference.attendeeCollection();

// UI에서 선택된 참가자들을 컬렉션에 추가한다.
attendees.iterate(checkInService.checkIn);
```

## 📚 문제 예방
익명 함수가 실제로 코드의 관심사를 분리하고 테스트하기 어렵게 만들어 결국 믿음성이 떨어진다는 이야기도 했다.   

그런데 콜백 패턴의 믿음성을 끌어내리는 원인은 익명 콜백 함수뿐만이 아니다. *콜백 화살*이라는 골칫덩이와 콜백 함수에서 엉뚱안 값을 가리키는 `this`, 두 가지 문제점을 어떻게 예방할 수 있는지 알아본다.

### 🎈 콜백 화살 눌러 펴기
콜백 화살(callback arrow)은 콜백 함수를 남발한 극단적인 케이스다. 다음 예제를 살펴보자.

```js
CallbackArrow = CallbackArrow || {};

CallbackArrow.rootFunction = function() {
  CallbackArrow.firstFunction(function(arg) {
    // 첫 번째 콜백 로직
    CallbackArrow.secondFunction(function(arg) {
      // 두 번쩨 콜백 로직
      CallbackArrow.thirdFunction(function(arg) {
        // 세 번째 콜백 로지
        CallbackArrow.fourthFunction(function(arg) {
          // 네 번째 콜백 로직
        });
      });
    });
  });
};

CallbackArrow.firstFunction = function(callback1) {
  callback1(arg);
};
CallbackArrow.secondFunction = function(callback2) {
  callback2(arg);
};
CallbackArrow.thirdFunction = function(callback3) {
  callback3(arg);
};
CallbackArrow.fourthFunction = function(callback4) {
  callback4(arg);
};
```

서로 중첩된 콜백들이 점점 깊은 늪에 빠져드는 모습이 왼쪽에서 오른쪽으로 향하는 공백 화살표 형상을 띤다. **이 코드는 읽기는 물론 고치기도 어렵고 단위 테스트는 사실 불가능하다.**   

이럴 경우, 익명 함수에 이름을 붙여 떼어 놓기만 해도 상황은 훨씬 호전된다. 다음처럼 리팩토링하자.

```js
CallbackArrow = CallbackArrow || {};

CallbackArrow.rootFunction = function() {
  CallbackArrow.firstFunction(CallbackArrow.firstCallback);
};
CallbackArrow.firstFunction = function(callback1) {
  callback1(arg);
};
CallbackArrow.secondFunction = function(callback2) {
  callback2(arg);
};
CallbackArrow.thirdFunction = function(callback3) {
  callback3(arg);
};
CallbackArrow.fourthFunction = function(callback4) {
  callback4(arg);
};

CallbackArrow.firstCallback = function() {
  // 첫 번째 콜백 로직
  CallbackArrow.secondFunction(CallbackArrow.secondCallback);
};
CallbackArrow.secondCallback = function() {
  // 두 번째 콜백 로직
  CallbackArrow.thirdFunction(CallbackArrow.thirdCallback);
};
CallbackArrow.thirdCallback = function() {
  // 세 번째 콜백 로직
  CallbackArrow.fourthFunction(CallbackArrow.fourthCallback);
};
CallbackArrow.fourthFunction = function() {
  // 네 번째 콜백 로직
};
```

이처럼 중첩 콜백을 눌러 편 코드가 더 낫다. 무엇보다 단위 테스트를 전적으로 할 수 있다는 점이 자랑이다. 중첩 익명 콜백 함수의 모든 기능을 그 자체만으로 단위 테스트할 수 있는 `CallbackArrow`의 함수 프로퍼티로 빼낸 덕분이다. 더구나 콜백 함수마다 명찰이 달려 있으니 디버깅 도구에서 스택 추적 시 쓴웃음을 지을 일도 없을 것이다.

### 🎈 this를 조심하라
전혀 엉뚱한 값이 참조할 수 있기 때문에 콜백 함수에서 `this` 변수를 참조할 떄는 조심해야 한다.   

승현은 체크인을 마친 `attendeeCollection`의 `attendee` 객체 수를 세는 `checkedInAttendeeCounter` 모듈을 구현하려고 한다. `checkInService`와 크게 다를 바 없이 `attendeeCollection.iterate`에 표출할 함수를 넘기는 식으로 작성하면 된다. `checkedInAttendeeCounter`의 단위 테스트 코드를 먼저 작성한다.

```js
describe('Conference.checkedInAttendeeCounter', () => {
  var counter;

  beforeEach(() => {
    counter = Conference.checkedInAttendeeCounter();
  });

  describe('increment()', () => {
    // increment 테스트
  });

  describe('getCount()', () => {
    // getCount 테스트
  });

  describe('countIfCheckedIn(attendee)', () => {
    var attendee;

    beforeEach(() => {
      attendee = Conference.attendee('태영', '김');
    });

    it('참가자가 체크인하지 않았으면 인원수를 세지 않는다.', () => {
      counter.countIfCheckedIn(attendee);
      expect(counter.getCount()).toBe(0);
    });

    it('참가자가 체크인하면 인원수를 센다', () => {
      attendee.checkIn();
      counter.countIfCheckedIn(attendee);
      expect(counter.getCount()).toBe(1);
    });
  });
});
```

이어서 `Conference.checkedInAttendeeCounter` 구현부이다.

```js
var Conference = Conference || {};

Conference.checkedInAttendeeCounter = function() {
  var checkedInAttendees = 0;

  return {
    increment: function() {
      checkedInAttendees++;
    },
    getCount: function() {
      return checkedInAttendees;
    },
    countIfCheckedIn: function(attendee) {
      if (attendee.isCheckedIn()) {
        this.increment();
      }
    }
  }
}
```

여기서 `this.increment`를 보면 단위 테스트는 통과하지만 `checkedInAttendeeCounter`를 정말 `attendeeCollection` 인스턴스와 함께 쓸 수 있을까?

```js
var checkInService = Conference.checkInService(Conference.checkInRecorder());
var attendees = Conference.attendeeCollection();
var counter = Conference.checkedInAttendeeCounter();

// UI에서 선택한 참가자들을 참가자 컬렉션에 추가한다.
attendees.add(Conference.attendee('윤지', '김'));
attendees.add(Conference.attendee('승민', '사'));

// 참석자들을 체크인한다.
attendees.iterate(checkInService.checkIn);

// 체크인을 마친 참가자 인원수를 세어본다.
attendees.iterate(counter.countIfCheckedIn);

console.log(counter.getCount()); // 0 어랏??ㄴ
```

위 예제의 결과는 2가 나와야 한다. `attendeeCollection.iterator` 실행 시 `checkedInAttendeeCounter`에서 `this`가 실제로 가리킨 값은 `checkedInAttendeeCounter`가 아니라 전역 `window` 객체임을 알 수 있다.   

일반적으로 `this` 값은 함수를 호출한 (대개 함수 앞에 점으로 연결한) 객체를 가리키지만, 콜백 함수를 만들어 넣을 때 어떤 객체를 참조하라고 직접 지정할 수는 없다. 이런 이유로 콜백 함수는 대부분 `this`를 명시적으로 가리킨다.   

`attendeeCollection.iterate`에서 `forEach`는 콜백 내부에서 참조할 객체를 두 번째 인자로 전달함으로써 `this`가 무엇을 참조해야 하는지 밝힐 수 있다. `attendeeCollection.iterate` 개발 담당자 승현은 `attendeeCollection.iterate`로 하여금 `this`가 참조할 객체를 두 번째 인자로 받아 `forEach`에 그대로 넘겨주게끔 고친다. 이렇게 해서 `countIfCheckedIn` 함수에 걸맞은 `this`를 `checkedInAttendeeCounter` 인스턴스에 묶어둘 수 있다.   

그러나 만일 `attendeeCollection`이 욉 업체가 납품한 라이브러리 코드라 승현이 수정할 수 없는 경우라면 작성한 콜백에서 안정적으로 현재 객체 인스턴스를 가리키도록 할 수 있다.   

우선, `checkedInAttendeeCounter.countIfCheckedIn` 실행 시 `this`가 `checkedInAttendeeCounter` 인스턴스 이외의 객체를 가리키는 상황을 가정한 단위 테스트를 짜보자.

> 버그가 있다는 건 테스트 꾸러미가 아직 덜 됐다는 반증이다. 항상 버그를 고치기 전에 실패할 테스트를 먼저 작성하라.

```js
describe('Conference.checkedInAttendeeCounter', () => {
  var counter;

  // 이전 테스트 줄임

  describe('countIfCheckedIn(attendee)', () => {
    var attendee;

    beforeEach(() => {
      attendee = Conference.attendee('태영', '김');
    });

    //이전 테스트 줄임

    it('this가 꼭 checkedInAttendeeCounter 인스턴스를 가리키는 것은 아니다', () => {
      attendee.checkIn();
      // this에 빈 객체를 넣고
      // counter.countIfCheckedIn을 실행한다.
      counter.countIfCheckIn.call({}, attendee);
      expect(counter.getCount()).toBe(1);
    });
  });
});
```

`Conference.checkedInAttendeeCounter` 자신의 참조값을 `self`라는 변수에 담고 `countIfCheckedIn`에서 `this` 대신 `self`로 참조하면 `getCount` 함수를 확실히 바라볼 수 있을 것이다.

```js
var Conference = Conference || {};

Conference.checkedInAttendeeCounter = function() {
  var checkedInAttendees = 0;
  var self = {
    increment: function() {
      checkedInAttendees += 1;
    },
    getCount: function() {
      return checkedInAttendees;
    },
    countIfCheckedIn: function(attendee) {
      if (attendee.isCheckedIn()) {
        self.increment();
      }
    }
  };

  return self;
};
```

## 📚 정리하기
테스트를 먼저 작성하고 콜백 함수를 여럿 포함한 원코드를 구현하면서 `this`가 뜻밖에 엉뚱한 참조를 할 수 있다는 사실을 알았다. 또한, 익명 콜백 함수가 얼마나 테스트하기 어려운지, 여기에 중첩까지 더하면 골칫덩이 콜백 화살이 되고 만다는 사실을 배웠다.
