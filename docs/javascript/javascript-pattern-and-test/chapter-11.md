---
sidebar_position: 12
---

# 🌈 Chapter 11: 샌드박스 패턴

## 📚 단위 테스트
> 요구사항: 콘퍼런스 행사의 전반적인 진행 상황과 웹 사이트 운영 실태를 한눈에 파악할 수 있는 대시보드가 있었으면 좋곘다고 주최 담당자는 말한다.   
> 항목은 다음과 같다.
> - 콘퍼런스 등록자 수
> - 콘퍼런스 등록자 성명
> - 체크인한 참가자 수
> - 체크인한 참가자 성명
> - 서드파티 식장 API의 호출 횟수
> - 지역 공항 기상 예보

### 🎈 위젯 샌드박스 만들기
위젯 샌드박스의 목적은 각 위젯을 분리하여 알아서 움직이게 하는 것이다. 그리고 샌드박스 패턴을 이용하면 위젯마다 한정된 의존성 선물 세트를 증정하여 각자 임무를 완수하는 데 필요한 도구를 공수할 수 있다.

#### 위젯 샌드박스를 인스턴스화
`WidgetSandbox` 생성자 함수는 `new` 키워드를 사용해야 하고, 적어도 하나의 인자, 즉 샌드박스에 격리할 위젯 생성 함수를 받도록 작성한다. 먼저, 기능 정검용 단위 테스트를 만든다.

```js
describe('Conference.WidgetSandbox', () => {
  'use strict';

  describe('생성자 함수', () => {
    it('"new" 키워드로 실행하지 않으면 예외를 던진다', () => {
      expect(function shouldThrow() {
        var sandbox = Conference.WidgetSandbox();
      }).toThrowError(Conference.WidgetSandbox.messages.mustBeCalledWithNew);
    });

    it('위젯 함수가 누락되면 예외를 던진다', () => {
      [null, undefined, 1, 'SomeString', false].forEach(function testInvalid(notAFcn) {
        expect(function shouldThrow() {
          var sandbox = new Conference.WidgetSandbox(notAFcn);
        }).toThrowError(Conference.WidgetSandbox.messages.fcnMustBeProvided);
      });
    });

    it('sandbox를 인자로 위젯 함수를 실행한다', () => {
      var widgetFcn = jasmine.createSpy();
      var sandbox = new Conference.WidgetSandbox(widgetFcn);
      
      expect(widgetFcn).toHaveBeenCalledWith(sandbox);
    });
  });
});
```

`WidgetSandbox` 구현부를 작성한다.

```js
var Conference = Conference || {};

Conference.WidgetSandbox = function() {
  'use strict';

  // Conference.WidgetSandbox(...)를 new로 실행했는지 보장한다.
  if (!(this instanceof Conference.WidgetSandbox)) {
    throw new Error(Conference.WidgetSandbox.messages.mustBeCalledWithNew);
  }

  var widgetFunction = arguments[0];

  if (typeof widgetFunction !== 'function') {
    throw new Error(Conference.WidgetSandbox.messages.fcnMustBeProvided);
  }

  widgetFunction(this);
};

Conference.WidgetSandbox.messages = {
  mustBeCalledWithNew: 'WidgetSandbox 함수는 반드시 new로 호출해야 합니다',
  fcnMustBeProvided: '위젯 함수는 필수 입력 항목입니다',
};
```

#### 샌드박스로 위젯에 도구를 제공
`WidgetSandbox`의 목표는 대시보드 위젯 간 결합도를 낮추고 떼어놓는 일이다. 그러나 DOM 조작, 또는 웹 서비스를 이용한 데이터 조회 같은 기능이 안 된다면 아무런 쓸모가 없다.   

어떤 위젯에서 어떤 도구가 필요한지 알고 있으면 되므로 도구 세트를 고정하지 말고 새 도구를 추가해서 `WidgetSandbox` 기능을 확장하는 편이 낫다고 판단한다. 또한, 위젯마다 사용 가능한 도구를 제한할 수 있어야 한다. 예를 들어 웹 서비스 연동이 전혀 필요 없는 위젯에 굳이 AJAX 통신 관련 도구에 접근할 권한을 줄 이유는 없다.   

위와 같은 기능을 구현하기 전에 결정해야 할 문제가 있다.
1. 도구는 어디에 정의하나?
    - `Conference.WidgetTools` 이름공간 내에 도구를 정의하는 게 맞다.
2. 도구를 어떻게 `WidgetSandbox` 인스턴스에 추가하나?
    - 도구를 모듈로 정의하면 도구마다 모듈 함수가 `WidgetSandbox` 인스턴스를 받고, 다음 코드처럼 도구가 스스로를 `WidgetSandbox` 프로퍼티에 추가한다.

```js
Conference.WidgetTools.toolA = function(sandbox) {
  // toolA를 sandbox에 추가한다.
  sandbox.toolA = {
    function1: function() {
      // function1 구현부
    },
    function2: function() {
      // function2 구현부
    },
  };
};
```

3. `WidgetSandbox` 생성자는 다음 둘 중 하나를 받는다.
    - 첫 번째 인자는 위젯에서 쓸 도구명이 담긴 배열, 두 번째 인자는 위젯 함수다. 다음 코드를 보자.
    ```js
    var weatherSandbox = new Conference.WidgetSandbox(
      ['toolA', 'toolB'], 
      Conference.widgets.weatherWidget,
    );
    ```
    - 도구명읠 개별 인자로 나열하고 위젯 함수를 제일 마지막 인자에 넣는다.
    ```js
    var weatherSandbox = new Conference.WidgetSandbox(
      'toolA', 'toolB', Conference.widgets.weatherWidget,
    );
    ```

어느 쪽이든 `WidgetSandbox` 생성자에 도구명 목록을 건네주면 위젯 함수를 제대로 찾는지부터 확인하자.

```js
describe('Conference.WidgetSandbox', () => {
  'use strict';

  describe('생성자 함수', () => {
    it('"new" 키워드로 실행하지 않으면 예외를 던진다', () => {
      expect(function shouldThrow() {
        var sandbox = Conference.WidgetSandbox();
      }).toThrowError(Conference.WidgetSandbox.messages.mustBeCalledWithNew);
    });

    describe('new WidgetSandbox(toolsArray, widgetModule)', () => {
      // 도구 목록을 배열 형태로 넘겼을 때 작동 여부를 테스트

      it('위젯 함수가 누락되면 예외를 던진다', () => {
        [null, undefined, 1, 'SomeString', false].forEach(function testInvalid(val) {
          expect(function shouldThrow() {
            var sandbox = new Conference.WidgetSandbox(['tool1', 'tool2'], val);
          }).toThrowError(Conference.WidgetSandbox.messages.fcnMustBeProvided);
        });
      });

      it('sandbox를 인자로 위젯 함수를 실행한다', () => {
        var widgetFcn = jasmine.createSpy();
        var sandbox = new Conference.WidgetSandbox(['too1', 'too2'], widgetFcn);

        expect(widgetFcn).toHaveBeenCalledWith(sandbox);
      });
    });

    describe("new WidgetSandbox('too1', ..., 'toolN', widgetModule)", () => {
      // 도구 목록을 개별 인자 형태로 넘겼을 때 작동 여부를 테스트

      it('위젯 함수가 누락되면 예외를 던진다', () => {
        [null, undefined, 1, 'SomeString', false].forEach(function testInvalid(val) {
          expect(function shouldThrow() {
            var sandbox = new Conference.WidgetSandbox('tool1', 'tool2', val);
          }).toThrowError(Conference.WidgetSandbox.messages.fcnMustBeProvided);
        });
      });

      it('sandbox를 인자로 위젯 함수를 실행한다', () => {
        var widgetFcn = jasmine.createSpy();
        var sandbox = new Conference.WidgetSandbox('too1', 'too2', widgetFcn);

        expect(widgetFcn).toHaveBeenCalledWith(sandbox);
      });
    });
  });
});
```

이제 위젯 함수를 정확히 골라내도록 `WidgetSandbox` 구현부를 수정하자. `WidgetTools` 이름공간은 일단 빈 객체로 초기화한다.

```js
var Conference = Conference || {};

Conference.WidgetSandbox = function() {
  'use strict';

  // Conference.WidgetSandbox(...)를 new로 실행했는지 보장한다.
  if (!(this instanceof Conference.WidgetSandbox)) {
    throw new Error(Conference.WidgetSandbox.messages.mustBeCalledWithNew);
  }

  var widgetFunction = arguments[arguments.length - 1];

  if (typeof widgetFunction !== 'function') {
    throw new Error(Conference.WidgetSandbox.messages.fcnMustBeProvided);
  }

  widgetFunction(this);
};

// 빈 도구 이름공간을 생성한다.
Conference.WidgetTools = {};

Conference.WidgetSandbox.messages = {
  mustBeCalledWithNew: 'WidgetSandbox 함수는 반드시 new로 호출해야 합니다',
  fcnMustBeProvided: '위젯 함수는 필수 입력 항목입니다',
};
```

단위 테스트는 모두 성공한다.   

다음 단계는 `WidgetSandbox` 생성자 함수에 전달한 도구명에서 도구 모듈 함수를 찾아 도구 인스턴스를 생성하는 일이다. 먼저 도구명 목록을 배열로 넘기는 형태를 해본다. 전달된 도구명은 각각 `Conference.WidgetTools` 프로퍼티에 대응된다. 이 이름공간에 도구명에 해당하는 프로퍼티가 없으면 메시지만 봐도 의미가 분명한 에러를 던져야 한다.   

도구명이 유효한 도구명 `WidgetSandbox` 인스턴스를 유일한 인자로 해당 도구 모듈 함수가 실행될 것이다.

```js
describe('Conference.WidgetSandbox', () => {
  'use strict';

  describe('생성자 함수', () => {
    var widgetFcnSpy;

    beforeEach(() => {
      // 테스트가 실제 도구에 구애받지 않게 테스트 도구를 추가한다.
      Conference.WidgetTools.tool1 = function(sandbox) {
        return {};
      };
      Conference.WidgetTools.tool2 = function(sandbox) {
        return {};
      };

      // 위젯 함수 역할은 대신할 스파이를 만든다.
      widgetFcnSpy = jasmine.createSpy();
    });

    afterEach(() => {
      // 테스트 도구를 삭제한다.
      delete Conference.WidgetTools.tool1;
      delete Conference.WidgetTools.tool2;
    });
    
    /** 이전 테스트 줄임 **/
    
    describe('new WidgetSandbox(toolsArray, widgetFnc)', () => {
      // 도구 목록을 배열 형태로 넘겼을 때 작동 여부를 테스트

      /** 이전 테스트 줄임 **/

      it('올바르지 않은 도구를 지정하면 예외를 던진다', () => {
        var badTool = 'badTool';

        expect(function shouldThrow() {
          var sandbox = new Conference.WidgetSandbox(['tool1', badTool], widgetFcnSpy);
        }).toThrowError(Conference.WidgetSandbox.messages.unknownTool + badTool);
      });

      it('도구 모듈 함수를 sandbox에서 실행한다', () => {
        spyOn(Conference.WidgetTools, 'tool1');
        spyOn(Conference.WidgetTools, 'tool2');

        var sandbox = new Conference.WidgetSandbox(['tool1', 'tool2'], widgetFcnSpy);

        expect(Conference.WidgetTools.tool1).toHaveBeenCalledWith(sandbox);
        expect(Conference.WidgetTools.tool2).toHaveBeenCalledWith(sandbox);
      });
    });

    describe("new WidgetSandbox('tool1', ..., 'toolN', widgetFcn)", () => {
      /** 이전 테스트 줄임 **/
    });
  });
});
```

다음과 같이 `WidgetSandbox`를 수정하면 위 단위 테스트는 성공한다.

```js
var Conference = Conference || {};

Conference.WidgetSandbox = function() {
  'use strict';

  // Conference.WidgetSandbox(...)를 new로 실행했는지 보장한다.
  if (!(this instanceof Conference.WidgetSandbox)) {
    throw new Error(Conference.WidgetSandbox.messages.mustBeCalledWithNew);
  }

  var widgetFunction = arguments[arguments.length - 1];
  var toolsToLoad = [];

  if (typeof widgetFunction !== 'function') {
    throw new Error(Conference.WidgetSandbox.messages.fcnMustBeProvided);
  }

  if (arguments[0] instanceof Array) {
    toolsToLoad = arguments[0];
  }

  toolsToLoad.forEach(function loadTool(toolName) {
    if (!Conference.WidgetTools.hasOwnProperty(toolName)) {
      throw new Error(Conference.WidgetSandbox.messages.unKnownTool + toolName);
    }

    Conference.WidgetTools[toolName](this);
  }, this); // 콜백 내에서 this가 sandbox 인스턴스를 가리키도록 보장한다.

  widgetFunction(this);
};

// 빈 도구 이름공간을 생성한다.
Conference.WidgetTools = {};

Conference.WidgetSandbox.messages = {
  mustBeCalledWithNew: 'WidgetSandbox 함수는 반드시 new로 호출해야 합니다',
  fcnMustBeProvided: '위젯 함수는 필수 입력 항목입니다',
  unknownTool: '알 수 없는 도구입니다',
};
```

이제 마지막으로 여러 도구명을 개별 인자로 전달하는 경우가 남았다. 배열 케이스와 단위 테스트는 거의 같지만, 지금은 실패한다.

```js
describe('Conference.WidgetSandbox', () => {
  'use strict';

  describe('생성자 함수', () => {
    var widgetFcnSpy;

    /** 이전 beforeEach/afterEach 블록을 줄임 **/

    /** 이전 테스트 줄임 **/

    describe('new WidgetSandbox(toolsArray, widgetFcn)', () => {
      // 도구 목록을 배열 형태로 넘겼을 때 작동 여부를 테스트

      /** 이전 테스트 줄임 **/
    });


    describe("new WidgetSandbox('tool1', ..., 'toolN', widgetFcn)", () => {
      // 도구 목록을 개별 인자 형태로 넘겼을 때 작동 여부를 테스트

      /** 이전 테스트 줄임 **/

      it('올바르지 않은 도구를 지정하면 예외를 던진다', () => {
        var badTool = 'badTool';

        expect(function shouldThrow() {
          var sandbox = new Conference.WidgetSandbox('tool1', badTool, widgetFcnSpy);
        }).toThrowError(Conference.WidgetSandbox.messages.unknownTool + badTool);
      });

      it('도구 모듈 함수를 sandbox에서 실행한다', () => {
        spyOn(Conference.WidgetTools, 'tool1');
        spyOn(Conference.WidgetTools, 'tool2');

        var sandbox = new Conference.WidgetSandbox('tool1', 'tool2', widgetFcnSpy);

        expect(Conference.WidgetTools.tool1).toHaveBeenCalledWith(sandbox);
        expect(Conference.WidgetTools.tool2).toHaveBeenCalledWith(sandbox);
      });
    });
  });
});
```

이제 다음처럼 WidgetSandbox 생성자 함수를 고치면 개별 인자로 도구명을 넘겨도 문제없이 처리할 수 있다.

```js {15-19, 25}
var Conference = Conference || {};

Conference.WidgetSandbox = function() {
  'use strict';

  // Conference.WidgetSandbox(...)를 new로 실행했는지 보장한다.
  if (!(this instanceof Conference.WidgetSandbox)) {
    throw new Error(Conference.WidgetSandbox.messages.mustBeCalledWithNew);
  }

  var widgetFunction;
  var toolsToLoad = [];
  var argsArray;

  // arguments에서 진짜 배열을 추출한다.
  argsArray = Array.prototype.slice.call(arguments);

  // 배열 마지막 원소는 widgetFunction일 것이다. 뽑아낸다.
  widgetFunction = argsArray.pop();

  if (typeof widgetFunction !== 'function') {
    throw new Error(Conference.WidgetSandbox.messages.fcnMustBeProvided);
  }

  toolsToLoad = (argsArray[0] instanceof Array) ? argsArray[0] : argsArray;

  toolsToLoad.forEach(function loadTool(toolName) {
    if (!Conference.WidgetTools.hasOwnProperty(toolName)) {
      throw new Error(Conference.WidgetSandbox.messages.unKnownTool + toolName);
    }

    Conference.WidgetTools[toolName](this);
  }, this); // 콜백 내에서 this가 sandbox 인스턴스를 가리키도록 보장한다.

  var widget = widgetFunction(this);
};

/** 이전 코드 줄임 **/
```

### 🎈 샌드박스 도구 생성과 테스팅
`WidgetSandbox` 자체는 사실 별로 효용성이 없다. 위젯 인스턴스는 깨끗하게 떼어 놓았지만, 위젯들이 뭔가 일을 하는 데 필요한 도구가 전혀 없다.   

대시보드에서 봐야 할 데이터 중 콘퍼런스 등록자 명단은 아마 모든 담당자에게 공통일 것이다. 승현은 등록자 성명을 위젯에 보여줄 도구 개발을 착수한다.   

참가자 등록 처리를 관장하는 `attendeeWebApi` 객체는 이미 만들어진 상태인데, 그중 `getAll()` 메서드는 `attendee` 객체의 배열로 귀결하는 프라미스를 반환한다. 승현은 `attendeeNames`라는 도구를 만들어서 `attendeeWebApi`의 퍼사드로 삼아 필요한 기능을 표시하기로 한다.   

`attendeeNames` 도구의 단위 테스트를 작성하자

```js
describe('Conference.WidgetTools.attendeeNames', () => {
  'use strict';

  var attendeeWebApi;
  var sandbox;

  beforeEach(() => {
    attendeeWebApi = Conference.attendeeWebApi();

    // post 메서드는 호출되면 안 된다.
    // 그래도 혹시 모르니 스파이를 심어두어 확인한다.
    spyOn(attendeeWebApi, 'post');

    // attendeeNames를 단위 테스트하고자 sandbox는 빈 객체로 지정한다.
    sandbox = {};
  });

  afterEach(() => {
    // 테스트할 때마다 post가 호출되지 않았는지 확인한다.
    expect(attendeeWebApi.post).not.toHaveBeenCalled();
  });

  it('주어진 sandbox 객체에 자신을 추가한다', () => {
    Conference.WidgetTools.attendeeNames(sandbox, attendeeWebApi);

    expect(sandbox.attendeeNames).not.toBeUndefined();
  });

  describe('attendeeNames.getAll()', () => {
    var attendees;
    var attendeeNames;

    beforeEach(() => {
      Conference.WidgetTools.attendeeNames(sandbox, attendeeWebApi);

      // 테스트 참가자 배열을 채워넣는다.
      attendees = [
        Conference.attendee('태희', '김');
        Conference.attendee('윤지', '김');
        Conference.attendee('정윤', '최');
      ];

      // 테스트 참가자 배열에서 이름을 추출한다.
      attendeeNames = [];
      attendees.forEach(function getNames(attendee) {
        attendeeNames.push(attendee.getFullName());
      });
    });

    it('참가자가 없을 경우 빈 배열로 귀결한다', (done) => {
      spyOn(attendeeWebApi, 'getAll').and.returnValue(
        new Promise(function(resolve, reject) {
          resolve([]);
        }),
      );

      sandbox.attendeeNames.getAll().then(function resolved(names) {
        expect(names).toEqual([]);
        done();
      }, function rejected(reason) {
        expect('실패함').toBe(false);
        done();
      });
    });

    it('참가자가 있을 경우 해당 이름으로 귀결한다', (done) => {
      spyOn(attendeeWebApi, 'getAll').and.returnValue(
        new Promise(function(resolve, reject) {
          resolve(attendees);
        }),
      );

      sandbox.attendeeNames.getAll().then(function resolved(names) {
        expect(names).toEqual(attendeeNames);
        done();
      }, function rejected(reason) {
        expect('실패함').toBe(false);
        done();
      });
    });

    it('어떤 사유로 인해 버려진다', (done) => {
      var rejectionReason = '버림받는 이유';

      spyOn(attendeeWebApi, 'getAll').and.returnValue(
        new Promise(function(resolve, reject) {
          reject(rejectionReason);
        }),
      );

      sandbox.attendeeNames.getAll().then(function resolved(names) {
        expect('귀결됨').toBe(false);
        done();
      }, function rejected(reason) {
        expect(reason).toBe(rejectionReason);
        done();
      });
    });
  });
});
```

`attendeeWebApi.getAll()`가 반환한 프라미스가 `attendeeNames.getAll()` 메서드를 통해 제대로 흘러가는지 체크하면 된다. 또한, `attendeeNames.getAll()`이 각 `attendee` 객체의 전부가 아닌, 참가자 성명만 추출해서 적절히 반환하는지 검사한다.   

다음은 `attendeeNames` 도구의 구현부이다.

```js
var Conference = Conference || {};

Conference.WidgetTools = Conference.WidgetTools || {};

Conference.WidgetTools.attendeeNames = function(sandbox, injectedAttendeeWebApi) {
  'use strict';

  // attendeeWebApi를 선택적으로 주입할 수 있게 코딩한다. 단위 테스트할 때 유용하다.
  var attendeeWebApi = injectedAttendeeWebApi || Conference.attendeeWebApi();

  sandbox.attendeeNames = {
    // 참가자 이름 배열로 귀결하는 프라미스를 반환한다.
    getAll: function getAll() {
      return attendeeWebApi.getAll().then(function extractNames(attendees) {
        // 각 참가자의 전체 성명만 추출하여 반환한다.
        var names = [];
        attendees.forEach(function addName(attendee) {
          names.push(attendee.getFullName());
        });

        return names;
      });
    }
  };
};
```

### 🎈 샌드박스에서 쓸 함수 만들기
샌드박스에 놓고 사용할 모듈의 생성과 테스트는 비교적 간단하다. 샌드박스 패턴에서는 분리한 모듈은 오직 샌드박스 인스턴스에만 의존하며 이 인스턴스는 반드시 모듈에 주입하도록 명시되어 있다. 의존성을 주입하면 자바스크립트 코드의 테스트성과 믿음성이 좋아진다.   

승현이 `attendeeNames` 도구 개발에 몰두할 즈음, 샬럿은 위젯에서 브라우저 문서 객체 모델(DOM)을 연동할 때 쓸 dom 도구를 개발 중이다. 승현이 개발한 `attendeeNames`와 샬럿이 작성한 `dom`, 두 도구를 합하면 비로소 참가자 성명을 보여주는 위젯이 완성된다. 다음 예제는 위젯 단위 테스트 일부를 발췌한 코드다.

```js
describe('Conference.Widgets.attendeeNamesWidget(sandbox)', () => {
  'use strict';

  var sandbox;
  beforeEach(() => {
    sandbox = {};
  });

  it('dom 도구를 사용할 수 없는 경우 에러를 던진다', () => {
    expect(function shouldThrow() {
      Conference.Widgets.attendeeNamesWidget(sandbox);
    }).toThrowError(Conference.Widgets.messages.missingTool + 'dom');
  });

  it('attendeeNames 도구를 사용할 수 없는 경우 에러를 던진다', () => {
    expect(function shouldThrow() {
      sandbox.dom = {};
      Conference.Widgets.attendeeNamesWidget(sandbox);
    }).toThrowError(Conference.Widgets.messages.missingTool + 'attendeeNames');
  });

  // attendeeNamesWidget이 제대로 작동하는지 확인하는 다른 테스트
});
```

샌드박스 객체로 위젯 사용 부분을 테스트하는 코드 외에, 다른 위젯 기능을 확인하는 테스트는 별로 새로울 게 없다. 테스트할 때 꼭 `WidgetSandbox` 인스턴스를 써야 하는 건 아니다. 위젯에 관한 한 샌드박스 기능은 도구를 주는 일이 전부라 객체 리터럴 정도면 테스트 용도로 충분하다.

```js
var Conference = Conference || {};
Conference.Widgets = Conference.Widgets || {};

Conference.Widgets.attendeeNamesWidget = function(sandbox) {
  'use strict';

  // 해당 도구를 사용할 수 없으면 즉시 실패 처리한다.
  if (!sandbox.dom) {
    throw new Error(Conference.Widgets.messages.missingTool + 'dom');
  }

  if (!sandbox.attendeeNames) {
    throw new Error(Conference.Widgets.messages.missingTool + 'attendeeNames');
  }

  // attendeeNames를 조회하여 대시보드에 추가한다.
  sandbox.attendeeNames.getAll().then(function resolved(names) {
    // sandbox.dom으로 이름 목록을 표시한다.
  }, function rejected(reason) {
    // sandbox.dom으로 위젯 대신 에러 메시지를 나타낸다.
  });
};

Conference.Widgets.messages = {
  missingTool: '누락된 도구: ',
};
```

## 📚 정리하기
샌드박스 패턴은 모듈 간 결합도를 낮추고 의존성을 엄격하게 다스리는 기법이다.   

샌드박스 패턴을 구현한 코드는 단위 테스트로 다음 항목을 꼭 확인해야 한다.
- 샌드박스 생성자 함수에 위젯 모듈 함수를 전달한다.
- 도구는 샌드박스 생성자 함수에 배열 또는 개별 인자 형태로 넘긴다.
- 샌드박스에서 사용하기로 지정한 도구가 유효하다.
- 샌드박스 안에서 실행할 위젯이 요청한 도구는 샌드박스가 제공한다.
