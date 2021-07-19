# 🌈 도구 다루기

## 📚 테스팅 프레임워크
다음은 승객 객체, 항공편 객체를 입력받은 `createReservation`은 `passengerInformation` 프로퍼티가 승객 객체, `flightInformation` 프로퍼티가 항공편 객체인 새로운 객체를 반환한다.   

```js
function createReservation(passenger, flight) {
  return {
    passengerInfo: passenger,
    flightInfo: flight,
  };
}
```

팀 규정상 단위 테스트 없이(단위 테스트를 거치지 않고) 제품 코드를 체크인(CVS, SVN과 같은 소스 관리 서버에 자신이 작성한 코드를 반영하는 것)할 수는 없으므로 단위 테스트 작성은 반드시 필요하다.   

```js
describe('createReservation(passenger, flight)', function() {
  it('주어진 passenger를 passengerInfo 프로퍼티에 할당한다', function() {
    var testPassenger = {
      firstName: '윤지',
      lastName: '김',
    };

    var testFlight = {
      number: '3443',
      carrier: '대한한공',
      destination: '울산,'
    };

    var reservation = createReservation(testPassenger, testFlight);
    expect(reservation.passengerInfo).toBe(testPassenger);
  });

  it('주어진 flight를 flightInfo 프로퍼티에 할당한다', function() {
    var testPassenger = {
      firstName: '윤지',
      lastName: '김',
    };

    var testFlight = {
      number: '3443',
      carrier: '대한한공',
      destination: '울산,'
    };

    var reservation = createReservation(testPassenger, testFlight);
    expect(reservation.flightInfo).toBe(testFlight);
  });
});
```

`it` 함수 각자는 개별 단위 테스트고(이 예에서는 2개의 단위 테스트가 있다), 이들은 함수에서 반환된 객체의 속성이 적절한지 `expect` 함수로 검사한다.   

그런데 단위 테스트에 오류가 보인다. 반환된 예약 객체의 속성명은 `passengerInformation`과 `flightInformation`이라고 명세에 나와 있는데, `createReservation` 개발을 너무 서두른 나머지 속성명을 `passengerInfo`와 `flightInfo`로 잘못 코딩한 것이다.   

**명세가 아니라 함수 코드의 개발에 따라 테스트를 작성한 탓에 테스트는 기대하는 함수 작동이 아닌, 구현된 함수의 (잘못된) 실제 작동을 확인한 꼴이다.** 명세 기준으로 테스트 코드를 작성했으면 애당초 속성명을 틀릴 일은 없었을 것이다.   

### 🎈 잘못된 코드 발견하기
TDD는 코드 결함을 최대한 빨리, 곧 코드 생성 직후 감지하며, 작은 기능 하나라도 테스트를 먼저 작성한 뒤, 최소한의 코드마으로 기능을 구현한다.   

다시 `createReservation` 함수로 다시 돌아가 테스트를 먼저 작성하면 어떻게 달라지는 알아보자. 다시 말하지만, 이 함수의 명세는 다음과 같다.

> `createReservation`은 승객 객체, 항공편 객체를 입력받아 `passengerInformation` 프로퍼티가 승객 객체, `flightInformation` 프로퍼티가 항공편 객체인 새로운 객체를 반환한다.

먼저 `passengerInformation` 프로퍼티 할당이 정상적인지 확인하는 테스트를 작성한다.

```js
describe('createReservation(passenger, flight)', function() {
  it('주어진 passenger를 passengerInformation 프로퍼티에 할당한다', function() {
    var testPassenger = {
      firstName: '윤지',
      lastName: '김',
    };

    var testFlight = {
      number: '3443',
      carrier: '대한한공',
      destination: '울산,'
    };

    var reservation = createReservation(testPassenger, testFlight);
    expect(reservation.passengerInformation).toBe(testPassenger);
  });
});
```

그런 다음에 이 테스트를 성공시킬 `createReservation` 코드를 최소한으로 작성한다.

```js
function createReservation(passenger, flight) {
  return {
    passengerInfo: passenger,
    flightInformation: flight,
  };
}
```

단위 테스트하면 실패한다. 이유가 뭘까? 반환 객체의 속성명을 잘못해서 `passengerInformation` 대신 `passengerInfo`로 적었다. 속성명을 정정하고 다시 테스트하면 성공한다.   

반환 객체의 속성명을 잘못 쓴 실수가 `createReservation` 함수를 구현한 코드에 잠복해 있지만, 이번에는 테스트를 먼저 작성한 뒤 명세에 따라 테스트를 했으므로 다른 개발자가 통합 테스트를 진행하다가 연락할 때까지 몇 시간 기다리지 않고도 에러를 즉시 확인하여 조치할 수 있다.

### 🎈 테스트성을 감안하여 설계하기
테스트를 먼저 작성하란 건 코드의 테스트성을 차후에 두고 볼 문제가 아니라 **우선적인 주요 관심사로 생각하는 것이다.** **테스트하기 쉬운 코드가 유지 보수성과 확장성이 월등히 우수하다.** 테스트성을 설계 목표로 정하면 SOLID한 코드를 작성할 수 있다.   

TDD에 충실한 사람이면 무조건 전진해서 `createReservation`을 고치기보다는 일단 새 기능을 확인하는 테스트를 작성한다. 첫 번째 테스트에서는 예약 데이터가 제대로 웹 서비스 종단점까지 보내졌는지를 확인한다.   

그런데 여기서 *`createReservation`이 웹 서비스 통신까지 맡아야 하나?* 하는 의문을 품는 건 자기 계발에 상당히 도움이 된다.

```js
describe('createReservation(passenger, flight)', () => {
  // Existing tests
  it('예약 정보를 웹 서비스 종단점으로 전송한다', () => {
    // createReservation이 웹 서비스 통신까지 맡아야 하나?
  });
});
```

정답은 그럴 일은 없다. 웹 서비스 통신 전담 객체가 없으면 하나 만드는 편이 좋다. 코드 테스트성을 극대화하면 SOLID 원칙을 어긴 코드를 쉽게 솎아낼 수 있다.

### 🎈 꼭 필요한 코드만 작성하기
TDD 작업 절차는 작은 기능 하나를 검증하려면 실패하는 테스트를 먼저 작성한 뒤, 테스트를 성공시킬 만큼만 최소한으로 코딩한다. 그 후 내부적으로 구현 세부를 변경하는 **리팩토링** 과정을 거쳐 개발 중인 코드에서 중복 코드를 들어낸다.   

최소한의 코드를 넣은 다음 리팩토링으로 중복 코드를 없애고,... 이런 과정을 거치면서 결국 마지막에는 꼭 필요한 코드만 살아남게 된다.

### 🎈 안전한 유지 보수와 리팩터링
TDD를 실천하면 프로젝트 제품 코드를 대상으로 확실한 단위 테스트 꾸러미를 구축할 수 있다. 예전에 잘 돌아가던 코드가 지금은 제대로 작동하지 않는 회귀 결함은 코드 품질과 믿음성을 떨어뜨리는 요인이다.   

단위 테스트의 경우 테스트 꾸러미를 개발/보수하느라 재발 비용이 들어가는데, 보험과 마찬가지로 이 재발 비용을 지불하는 부담에서 벗어나는 시점이 온다.   

종합적인 단위 테스트 꾸러미가 마련된 제품 코드를 확장 또는 보수할 때도 비슷한 안도감을 느낄 수 있다. **실수로 다른 코드를 건드리지 않았따는 확신을 하고 코드 일부를 변경할 수 있기 때문이다.**

### 🎈 실행 가능한 명세
TDD 실천 결과, 탄탄하게 구축된 단위 테스트 꾸러미는 테스트 대상 코드의 실행 가능한 명세 역할도 한다.   

`createReservation` 함수로 예를 들면, 단위 테스트한 결과 메시지를 보고 이 함수가 무슨 일을 하는지 큰 그림을 그려볼 수 있다. `createReservation`이 하는 일을 굳이 코드를 읽고 분석하지 않아도 단위 테스트가 최다 알려주는 셈이다. 단위 테스트가 선사하는 *실행 가능 명세*는 프로젝트 참여 개발자에게도, 과거에 자신이 작성한 코드를 다시 찾아보게된 원래 개발자에게도 톡톡히 한몫한다.

### 🎈 재스민 들어가기
재스민은 행위 주도 개발(Behavior-Driven Development, BDD) 방식으로 자바스크립트 단위 테스트를 작성하기 위한 라이브러리다.

- [공식 홈페이지](https://jasmine.github.io/)
- [Jasmine Github](https://github.com/jasmine/jasmine)

도구에 대한 자세한 설명은 공식 홈페이지를 참조 및 책을 참고(P.72 ~ P.78)

## 📚 의존성 주입 프레임워크

### 🎈 의존성 주입이란?
승현은 얼마 남지 않은 자바스크립트 콘퍼런스 행사의 웹 사이트 구축 업무를 자원했다. 참가자 좌석 예약은 필수다. 승현은 좌석 예약 기능을 갖춘 클라이언트 측 코드 개발을 맡았다.   

DB 연동은 콘퍼런스 웹 서비스를 호출하게 되어 있다. 객체 지향 프로그래밍 원칙에 충실한 승현은 우선 `ConferenceWebSvc` 객체에 서비스를 캡슐화하고 멋진 팝업 메시지를 화면에 표시할 자바스크립트 객체 `Messenger`를 작성한다.   

참가ㅏ자는 1인당 세션을 10개까지 등록할 수 있다. 참가자가 한 세션을 등록하면 그 결과를 성공/실패 메시지로 화면에 표시하는 함수를 개발해야 한다. 다음 예제는 초기 버전이다.

```js
Attendee  = function(attendeeId) {
  // new로 생성하도록 강제한다.
  if (!(this instanceof Attendee)) {
    return new Attendee(attendeeId);
  }

  this.attendeeId = attendeeId;

  this.service = new ConferenceWebSvc();
  this.messenger = new Messenger();
};

// 주어진 세션에 좌석 예약을 시도한다.
// 성공/실패 여부를 메시지로 알려준다.
Attendee.prototype.reserve = function(sessionId) {
  if (this.service.reserve(this.attendeeId, sessionId)) {
    this.messenger.success('좌석 예약이 완료되었습니다!', +
      ' 고객님은' + this.service.getRemainingReservation() +
      ' 좌석을 추가 예약하실 수 있습니다.');
  } else {
    this.messenger.failure('죄송합니다, 해당 좌석은 예약하실 수 없슴니다.');
  }
};
```

`ConferenceWebSvc` 내부에는 HTTP 호출이 있다. 이렇게 HTTP 통신이 필요한 코드는 단위 테스트를 어떻게 할까? 단위 테스트는 그 자체로 신속하고 확고해야 한다. 그리고 `Messenger`는 메시지마다 OK 버튼이 있어야 하는데, 이 또한 이 모듈에서 단위 테스트할 대상은 아니다.   

`Attendee` 객체가 아니라 이 객체가 의존하는 코드다. 의존성을 주입하는 식으로 바꾸면 해결할 수 있다. 즉, `ConferenceWebSvc`와 `Messenger`와의 의존성을 하드 코등하지 말고 이들을 `Attendee`에 주입하는 것이다. 단위 테스트용으로는 모의체(fake)나 재스민 스파이 같은 대체제를 주입하면 된다.

```js
// 운영 환경: 
var attendee = new Attendee(new ConferenceWebSvc(), new Messenger(), id);

// 개발(테스트) 환경:
var attendee = new Attendee(fakeService, fakeMessenger, id);
```

이처럼 DI 프레임워크를 사용하지 않고 의존성을 주입하는 것을 두고 *빈자의 의존성 주입*이라 한다. 다음 예제는 빈자의 의존성 주입 방식으로 작성한 `Attendee` 객체다.

```js
Attendee = function(service, messenger, attendeeId) {
  // new로 생성하도록 강제한다.
  if (!(this instanceof Attendee)) {
    return new Attendee(attendeeId);
  }

  this.attendeeId = attendeeId;

  this.service = service;
  this.messenger = messenger;
}
```

### 🎈 의존성을 주입하여 믿음직한 코드 만들기
DI는 실제 객체보다 주입한 스파이나 모의 객체에 더 많은 제어권을 안겨주므로 다양한 에러 조건과 기이한 상황을 만들어내기 쉽다. 혹시 모를 만약의 사태를 폭넓게 커버할 수 있게 테스트를 작성할 수 있다.   

또한, DI는 코드 재사용을 적극적으로 유도한다. 의존성을 품은, 하드 코딩한 모듈은 무거운 짐을 질질 끌고 다니는 터라 보통 재사용하기 어렵다.

### 🎈 의존성 주입의 모든 것
의존성 주입은 어렵지 않다. 도리어 삶을 편안하게 해준다.   

어떤 객체를 코딩하든 어떤 객체를 생성하든지 스스로 다음 질문을 해부자. 한 가지라도 답법이 **예**라면 직접 인스턴스화하지 말고 주입하는 방향으로 생각을 전환하라.

- 객체 또는 의존성 중 어느 하나라도 DB, 설정 파일, HTTP, 기타 인프라 등의 외부 자원에 의존하는가?
- 객체 내부에서 발생할지 모를 에러를 테스트에서 고려해야 하나?
- 특정한 방향으로 객체를 작동시켜야 할 테스트가 있는가?
- 이 서드파티 제공 객체가 아니라 온전히 내가 소유한 객체인가?

### 🎈 사례 연구: 경량급 의존성 주입 프레임워크 개발
지금까지는 의존성 주입을 하드 코딩했다. 최선은 아니다. 전문가다운 의존성 주입 프레임워크는 이렇게 작동한다.

1. 애플리케이션이 시작되자마자 각 인젝터블(injectable: 주입 가능한, 모든 의존성을 집합적으로 일컫는 말이다) 명을 확인하고 해당 인젝터블이 지닌 의존성을 지칭하며 순서대로 DI 컨테이너에 등록한다.
2. 객체가 필요하면 컨테이너에 요청한다.
3. 컨테이너는 일단 요청받은 객체와 그 의존성을 모두 재귀적으로 인스턴스화한다. 그런 다음, 요건에 따라 필요한 객체에 각각 주입한다.

여기서 설명하는 예제는 생락.. 책을 참고(P.81 ~ P.90)

#### TIP
- 더욱 확실한 네거티브 테스트(negative test)를 위해서는 에러가 났다는 사실뿐만 아니라 **실제 에러 메시지까지 확인하라.** 프로토타입이나 함수를 통해 테스트 대상이 가진 메시지를 밖으로 표출하는 것이다.
- **에러 처리 코드를 제일 먼저 테스트하라.** 그다음 다른 업무로 넘어가도 늦지 않다.
- **코드가 전혀 없어도 좋으니 테스트를 성공시킬 최소한의 코드만 작성하라.** 애플리케이션 코드가 테스트보다 앞서 나가면 안 된다.
- **리터럴 대신 변수명을 잘 정해서 DRY하고 자기 서술적인 테스트를 작성하라.**

### 🎈 의존성 주입 프레임워크 활용
앞서 자바스크립트 콘퍼런스 참가자의 좌석 예약 모듈을 개발하면서 `Attendee`의 의존성을 자신의 생성자에 하드 코딩하여 주입했었다.

```js
var attendee = new Attendee(new ConferenceWebSvc(), new Messenger(), id);
```

이제 적합한 DI 컨테이너를 마련했으니 객체를 생성할 때마다 의존성을 하드 코딩해서 넣지 않아도 된다.   

전역 객체 `MyApp` 내부에서 작동하는 애플리케이션은 다음 예제와 같은 설정 코드를 생각할 수 있다.

```js
MyApp = {};

MyApp.diContainer = new DiContainer();

MyApp.diContainer.register(
  'Service', // 웹 서비스를 가리키는 DI 태크
  [], // 의존성 없음
  function() { // 인스턴스를 반환하는 함수
    return new ConferenceWebSvc();
  },
);

MyApp.diContainer.register(
  'Messenger',
  [],
  function() {
    return new Messenger();
  },
);

MyApp.diContainer.register(
  'AttendeeFactory',
  ['Service', 'Messenger'], // Attendee는 service 및 messenger에 의존한다.
  function(service, messenger) {
    return function(attendeeId) {
      return new Attendee(service, messenger, attendeeId);
    }
  },
)
```

`Attendee`를 어떻게 `DiContainer` 안에 넣는지 주목하라. 매우 중요한 고급 기법이다. **`Attendee`를 만드는 함수가 아닌, `Attendee`를 만들 팩토리를 만드는 함수가 등록을 대신한다.** `Attendee`는 자신의 의존성 외에도 `attendeeId` 파라미터가 필요하므로 DI 컨테이너는 이렇게 코딩한다.

```js
var attendee = MyApp.diContainer.get('Attendee', attendeeId);
```

하지만 그러면 다른 객체의 재귀적 의존성으로 `Attendee`를 제공할 방법이 없다.   

다음 예제 처럼 팩토리가 있으면 애플리케이션 깊숙한 곳에서도 DI 컨테이너로부터 `Attendee`를 가져올 수 있다.

```js
var attendeeId = 123;
var sessionId = 1;

// DI 컨테이너에서 attendeeId를 넘겨 Attendee를 인스턴스화한다.
var attendee = MyApp.diContainer.get('AttendeeFactory')(attendeeId);
attendee.reserve(sessionId);
```

### 🎈 최신 의존성 주입 프레임워크
- 앵귤러 JS
- 리콰이어 JS

## 📚 애스팩트 툴킷
애스팩트 지향 프로그래밍(AOP)은 (단일한 책임 범위 내에 있지 않은) 하나 이상의 객체에 유용한 코드를 한데 묶어 눈에 띄지 않게 객체에 배포하는 기법이다.   

AOP 용어로, 배포할 코드 조각을 **어드바이스**(**advice**), 어드바이스가 처리할 문제를 **애스팩트**(**aspect**) 또는 **횡단 관심사**(**cross-cutting concern**)라고 한다.

### 🎈 사례 연구: AOP 있는/없는 캐싱
- 예제 생략. (P.94, 95)

#### AOP로 믿음직한 코드 만들기
AOP로 어떻게 하면 믿음직한 코드를 만들까?

1. AOP는 함수를 단순하게 유지한다. 함수 각자의 단일 책임을 수행할 뿐이다. 단순함은 곧 믿음성이다.
2. AOP는 코드를 DRY하게 해준다. 어떤 코드가 여기저기 출몰하면 나중에 다른 개발자가 잘못 건드릴 여지도 많고, 그러다 보면 동기화가 꺠질 가능성이 당연히 커진다. 그런데 여기서 놓치면 안 될 포인트는, **기존 기능에 새 기능을 붙이는 코드를 반복하고 싶지 않다는 점이다.**

> 여러 코드 블록을 자체로 반복하지 않는 일만큼 다른 코드와 연결하는 부분을 반복하지 않는 일도 중요하다.

3. AOP는 애플리케이션 설정을 한 곳에 집중시킨다. 애스팩트 설정이 단일 책임인 함수가 하나만 있으면 부속 기능 전체를 찾을 때 이 함수만 뒤지면 된다. 무엇보다 디버깅할 때 손쉽게 캐싱 같은 기능을 끄거나 인자 체크 기능을 켤 수 있어 좋다.

### 🎈 사례 연구: Aop.js 모듈 개발
애스팩트 프로그래밍은 새로운 방법으로 함수를 끌어모은다.   
우리는 프레드릭 아펠버그와 데이브 클레이턴이 개발한 아주 우아한 프레임워크([Aop.js](https://github.com/davedx/aop)에서 무료로 내려받을 수 있다)는 다음과 같다.

```js
// Created by Fredrik Appelberg: http://fredrik.appelberg.me/2010/05/07/aop-js.html
// 프로토타입을 지원할 수 있게 데이브 클레이턴이 수정함
Aop = {
  // 주어진 이름공간에 매칭되는 모든 함수 주변(around)에 어드바이스를 적용한다.
  around: function(pointcut, advice, namespaces) {
    // 이름공간이 없으면 전역 이름공간을 찾아내는 꼼수를 쓴다.
    if (namespaces == undefined || namespaces.length == 0)
      namespaces = [ (function(){return this;}).call() ];
    // 이름공간을 전부 순회한다.
    for(var i in namespaces) {
      var ns = namespaces[i];
      for(var member in ns) {
        if(typeof ns[member] == 'function' && member.match(pointcut)) {
          (function(fn, fnName, ns) {
             // member fn 슬롯을 'advice' 함수를 호출하는 래퍼로 교체한다.
             ns[fnName] = function() {
               return advice.call(this, { fn: fn,
                                          fnName: fnName,
                                          arguments: arguments });
             };
           })(ns[member], member, ns);
        }
      }
    }
  },

  next: function(f) {
    return f.fn.apply(this, f.arguments);
  }
};

Aop.before = function(pointcut, advice, namespaces) {
  Aop.around(pointcut,
             function(f) {
               advice.apply(this, f.arguments);
               return Aop.next.call(this, f);
             },
             namespaces);
};

Aop.after = function(pointcut, advice, namespaces) {
  Aop.around(pointcut,
             function(f) {
               var ret = Aop.next.call(this, f);
               advice.apply(this, f.arguments);
               return ret;
             },
             namespaces);
};

module.exports = Aop;
```

> 테스트 주도 개발을 하면 과거의 방법론처럼 믿음 있고 우아한 코드를 만들 수 있다.

AOP의 핵심은 함수 실행(타깃)을 가로채어 다른 함수(어드바이스)를 실행하기 직전이나 직후, 또는 전후에 실행시키는 것이다.

- TDD로 AOP를 구현하는 예제 생략 (P.97 ~ P.110)

## 📚 코드 검사 도구
코드 검사 도구는 코드를 실행하지 않은 상태에서 소스 코드의 구조/구문을 조사하는, 정적 분석을 수행한다. 코드 실행 시 에러가 날 거 같은 프로그래밍 언어를 부정확하게 사용한 곳을 찾아 알려주는 일이 주된 업무다.   

이런 도구를 보통 린터(linter)라고 한다.

### 🎈 린팅 도구로 믿음직한 코드 만들기
린팅은 특히 자바스크립트 코딩 시 긴요하다. 인터프리터 언어인 자바스크립트는 개발자가 실수해도 뭐라고 얘기해주는 컴파일러가 없어서 코드를 실행해보기 전에는 구문 에러를 알 길이 없다.

### 🎈 도구들
- JSHint
- ESLint

### 🎈 엄격 모드
특정 스코프(전역 또는 함수 스코프)에 다음 코드를 넣으면 자바스크립트 해석기는 전혀 다른 방식으로 처리한다.

```js
'use strict';
```

이 지시자가 있는 코드에서 개발자가 흔히 저지르는 실수를 범하면 자바스크립트 에러가 난다.(예: 변수를 선언하기도 전에 사용, 읽기 전용 프로퍼티를 수정, 예약어로 변수를 명명 등).   

엄격 모드를 지원하지 않는 자바스크립트 환경에서 실행하면 `'use strict'` 문자열은 무시된다.

## 📚 정리하기
단위 테스팅 프레임워크는 올바른 소프트웨어 개발을 이끄는 필수품이다.   

자바스크립트 애플리케이션이 점점 복잡해지면서 컴포넌트를 개별적으로 잘 정돈하고 분리하는 일이 더욱 중요해졌다. 그런 점에서 의존성 주입은 중요한 테크닉이다.   

TDD 사례를 들기 위해 애스팩트 지향 프로그래밍 툴킷을 개발했다. AOP를 쓰면 전체 컴포넌트를 바꾸지 않고도 캐싱 같은 공통 기능을 소프트웨어 컴포넌트에 끼워 넣을 수 있고, 코드를 DRY하게 유지하면서도 단일 책임 원칙을 갖고 개방/폐쇄 원칙에 충실한 코드를 만들 수 있다.   

린터는 코드 검사 도구로, 구문 오류나 코딩 규칙을 어긴 코드를 미리 경고함으로써 미시 수준에서 코드 믿음성을 높인다. 엄격 몯는 구문 수준에서 실수를 예방할 방법으로 권장할 만하다.
