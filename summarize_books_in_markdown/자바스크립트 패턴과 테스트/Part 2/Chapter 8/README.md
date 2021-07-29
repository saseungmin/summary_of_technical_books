# 🌈 메모이제이션 패턴

## 📚 단위 테스트
TDD를 실천 중인 승현이는 `memoizedRestaurantApi` 퍼사드를 구현하기 위해 가장 먼저 할 일은 단위 테스트를 작성하는 것이다. 승현은 샬럿이 UI를 자주 고치지 않도록 샬럿이 사용할 함수와 같은 `getRestaurantsNearConference` 함수를 애스팩트가 가미된 서드파티 API에 표출하기로 한다.   

앞서 서드파티 API를 확장하여 `getRestaurantsNearConference` 메서드를 추가한 코드의 단위테스트와 마찬가지로, API가 실제로 반환한 객체의 타입은 신경 쓸 필요가 없다. 따라서 프라미스를 쓴 비동기 코드 테스트의 자질구레한 요소 때문에 얽매이지 않아도 된다.

```js
describe('memoizedRestaurantApi', () => {
  'use strict';

  var api;
  var service;
  var returnedFromService;

  beforeEach(() => {
    api = ThirdParty.restaurantApi();
    service = Conference.memoizedRestaurantApi(api);
    returnedFromService = {};
  });

  describe('getRestaurantsNearConference(cuisine)', () => {
    it('기대 인자를 넘겨 api의 getRestaurantsNearConference를 실행', () => {
      var cuisine = '분식';
      spyOn(api, 'getRestaurantsNearConference');
      service.getRestaurantsNearConference(cuisine);
      var args = api.getRestaurantsNearConference.calls.argsFor(0);
      expect(args[0]).toEqual(cuisine);
    });

    it('서드파티 API의 반환값을 반환한다', () => {
      spyOn(api, 'getRestaurantsNearConference').and.returnValue(returnedFromService);

      var value = service.getRestaurantsNearConference('Asian Fusion');
      expect(value).toBe(returnedFromService);
    });

    it('같은 요리를 여러 번 요청해도 api는 한 번만 요청한다', () => {
      var cuisine = '분식';

      spyOn(api, 'getRestaurantsNearConference').and.returnValue(returnedFromService);

      var iterations = 5;
      for (var i = 0; i < iterations; i++) {
        var value = service.getRestaurantsNearConference(cuisine);
      }

      expect(api.getRestaurantsNearConference.calls.count()).toBe(1);
    });

    it('같은 요리를 여러 번 요청해도 같은 값으로 귀결된다', () => {
      var cuisine = '한정식';

      spyOn(api, 'getRestaurantsNearConference').and.returnValue(returnedFromService);

      var iterations = 5;
      for (var i = 0; i < iterations; i++) {
        var value = service.getRestaurantsNearConference(cuisine);
        expect(value).toBe(returnedFromService);
      }
    });
  });
});
```

이어서 구현부를 작성한다.

```js
var Conference = Conference || {};

Conference.memoizedRestaurantApi = function(thirdPartyApi) {
  'use strict';

  var api = thirdPartyApi;
  var cache = {};

  return {
    getRestaurantsNearConference: function(cuisine) {
      // 키워드 cuisine에 해당하는 키가 캐시에 있는지 찾아보고, 있으면 캐시된 프라미스를 즉시 반환한다.
      if (cache.hasOwnProperty(cuisine)) {
        return cache[cuisine];
      }

      // 캐시에 없으면 서드파티 API에 요청 후 전달받은 프라미스를
      // cache[cuisine] = returnedPromise;로 캐시에 추가한 뒤 호출부에 프라미스를 넘겨준다.
      var returnedPromise = api.getRestaurantsNearConference(cuisine);
      cache[cuisine] = returnedPromise;
      return returnedPromise;
    }
  }
}
```

메모이제이션 기능 덕분에 `getRestaurantsNearConference` 함수는 API 호출 횟수를 줄일 수 있다. 서드파티 `restaurantApi`를 이용한 지점에 달랑 `memoizedRestaurantApi`만 추가하면 되니까 안도했던 샬럿이 승현에게 한 가지 더 제안한다.   

> 샬럿: 승현, 네가 `getRestaurantsNearConference`를 넣으러고 확장했듯이 메모이제이션 기능을 갖춘 애스팩트로 `restaurantApi`를 확장할 방법은 없을까?   
> 승현: 어, 가능해. `memoizedRestaurantApi` 없이 다른 데서도 필요하면 얼마든지 쓸 수 있는 범용 `memoization` 애스팩트를 만들 수 있을 거야.

## 📚 AOP로 메모이제이션 추가하기

### 🎈 메모이제이션 애스팩트 생성하기
승현의 다음 목표는 `restaurantApi`처럼 다른 코드에서도 메모이제이션 덕을 보게끔 메모이제이션 코드를 전 예제 `memoizedRestaurantApi`에서 추출하여 애스팩트로 옮기는 것이다.   

단위 테스트를 먼저 작성한다. `returnValueCache`는 `advice`함수 하나를 정의한 모듈로 구현된다. `beforeEach` 블록의 다음 문을 실행하면 `testFunction`을 어드바이스로 장식한다.   

```js
Aop.around('testFunction', Aspects.returnValueCache().advice, testObject);
```

```js
describe('returnValueCache', () => {
  'use strict';

  var testObject;
  var testValue;
  var args;
  var spyReference;
  var testFunctionExecutionCount;

  beforeEach(() => {
    // 테스트할 때마다 우선 실행 횟수를 초기화한다.
    testFunctionExecutionCount = 0;
    testValue = {};
    testObject = {
      testFunction: function(arg) {
        return testValue;
      }
    };

    spyOn(testObject, 'testFunction').and.callThrough();
    // 애스팩트가 적용된 이후에는
    // 스파이를 직접 참조할 수 없으므로 현재 참조값을 보관해둔다.
    spyReference = testObject.testFunction;

    // testObject.testFunction을 returnValueCache 애스팩트로 장식한다.
    Aop.around('testFunction', Aspects.returnValueCache().advice, testObject);

    args = [{ key: 'value' }, 'someValue'];
  });

  describe('advice(targetInfo)', () => {
    it('첫 번째 실행 시 장식된 함수의 반환값을 반환한다', () => {
      var value = testObject.tetFunction.apply(testObject, args);
      expect(value).toBe(testValue);
    });

    it('여러 번 실행 시 장식된 함수의 반환값을 반환한다', () => {
      var iterations = 3;
      
      for (var i = 0; i < iterations; i++) {
        var value = testObject.testFunction.apply(testObject, args);
        expect(value).toBe(testValue);
      }
    });

    it('같은 키값으로 여러 번 실행해도 장식된 함수만 실행한다', () => {
      var iterations = 3;

      for (var i = 0; i < iterations; i++)  {
        var value = testObject.testFunction.apply(testObject, args);
        expect(value).toBe(testValue);
      }

      expect(spyReference.calls.count()).toBe(1);
    });

    it('고유한 각 키값마다 꼭 한 번씩 장식된 함수를 실행한다', () => {
      var keyValues = ['value1', 'value2', 'value3'];

      keyValues.forEach(function iterator(arg) {
        var value = testObject.testFunction(arg);
      });

      // 요청을 각각 다시 실행한다. 결과는 캐시에서 가져오므로 장식된 함수를 실행하지 않는다.
      keyValues.forEach(function iterator(arg) {
        var value = testObject.testFunction(arg);
      });

      // 장식된 함수는 고윳값 하나당 꼭 한 번씩 실행되어야 한다.
      expect(spyReference.calls.count()).toBe(keyValues.length);
    });

    // 캐시 키가 정확히 계산되었는지 확인하는 추가 테스트 등등...
  });
});
```

`testObject.testFunction`에 스파이를 심고서 이 함수에 애스팩트를 적용한다. 스파이가 실행됐는지 확인하려고 하기 전까진 만사 순조롭게 흘러갈 것이다.   

`testObject.testFunction`에 둔 스파이는 이 함수를 애스팩트로 장식하는 순가 종적을 감출 것이다. 따라서 다음 기대식에서 `calls`는 이제 `testObject.testFunction` 프로퍼티가 아니어서 실패한다.

```js
expect(testObject.testFunction.calls.count()).toBe(1);
```

함수에 애스팩트를 적용하기 전, 본함수의 참조값을 `spyReference`에 보관하여 해결했다.

```js
expect(spyReference.calls.count()).toBe(1);
```

다음은 `returnValueCache` 구현부이다.

```js
var Aspects = Aspects || {};

Aspects.returnValueCache = function() {
  'use strict';

  var cache = {};

  return {
    advice: function(targetInfo) {
      // 함수에 넘긴 인자를 캐시 키로 이용한다.
      // (객체 참조값 비교가 아닌, 문자열 비교를 하기 위해 문자열로 바꾼다).
      var cacheKey = JSON.stringify(targetInfo.args);

      if (cache.hasOwnProperty(cacheKey)) {
        return cache[cacheKey];
      }

      // 장식된 함수를 가져와 실행한 뒤 그 반환값을 캐시에 저장한다.
      var returnValue = Aop.next(targetInfo);
      cache[cacheKey] = returnValue;
      return returnValue;
    }
  };
};
```

### 🎈 returnValueCache 애스팩트를 restaurantApi에 적용하기
마지막으로 `restaurantApi` 메서드를 `restaurantApi` 애스팩트로 장식한다. `restaurantApi` 함수에 `returnValueCache` 애스팩트를 직접 적용하는 게 일반적인 해결책이다. 그래야 `getRestaurantsNearConference`도 기억하면서 `getRestaurantsWithinRadius`를 쓰는 다른 함수까지 자동으로 메모이제이션 혜택을 누릴 수 있다.   

다음 예는 `getRestaurantsWithinRadius` 함수를 기억하게끔 `ThirdPartyRestaurantApiAspects.js`를 수정한 코드다.

```js
// getRestaurantsWithinRadius에 메모이제이션 패턴 적용
Aop.around(
  // 반환값을 수정해야 할 함수
  'restaurantApi',
  // 반환값을 수정하는 함수
  function addMemoizationToGetRestaurantsWithinRadius(targetInfo) {
    // ThirdParty.restaurantApi()가 반환한 원본 API
    var api = Aop.next.call(this, targetInfo);

    // getRestaurantsWithinRadius 함수를 장식하여 메모이제이션 추가
    Aop.around('getRestaurantsWithinRadius',
      Aspects.returnValueCache().advice, api);

    // 고친 API를 반환한다.
    return api;
  },
  ThirdParty
);

// ThirdParty.restaurantApi()에 getRestaurantsNearConference 멤버 추가
Aop.around(
  // 반환값을 수정해야 할 함수
  'restaurantApi',
  // 반환값을 수정하는 함수
  function addGetRestaurantsNearConference(targetInfo) {
    'use strict';

    // ThirdParty.restaurantApi()가 반환한 원본 API
    var api = Aop.next.call(this, targetInfo);

    // API에 추가할 함수
    function getRestaurantsNearConference(cuisine) {
      return api.getRestaurantsWithinRadius(
        '울산 남구 신정로 20번길 988', 2.0, cuisine
      );
    }

    // 없으며 이 함수를 추가한다.
    api.getRestaurantsNearConference = 
      api.getRestaurantsNearConference || getRestaurantsNearConference;

    // 고친 API를 반환한다.
    return api;
  },

  // 반환값을 수정해야 할 함수의 이름공간
  ThirdParty
);
```

## 📚 정리하기
메모이제이션 패턴 구현 시 다음 두 가지를 단위 테스트로 꼭 확인하라.
- 반환값을 기억할 함수 또는 자원은 어떤 키를 기준으로 맨 처음 호출할 때 한 번만 접근한다.
- 그 이후로 같은 키를 인자로 기억한 함수를 다시 호출하면 맨 처음 호출했을 때와 같은 값을 반환한다.
