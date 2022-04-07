---
sidebar_position: 10
---

# 🌈 Chapter 9: 싱글톤 패턴

## 📚 단위 테스트

### 🎈 객체 리터럴로 싱글톤 공유 캐시 구현하기
객체 리터럴은 자바스크립트 싱글톤 패턴의 가장 단순한 구현체다. 다른 객체 생성 패턴과 달리 다른 함수를 생성하기 위해 호출할 함수도 없을뿐더러 `new` 키워드로 함수를 더 찍어낼 일도 없다.   

현재 `returnValueCache`는 이미 객체 리터럴을 캐시로 사용하고 있으므로 공유 캐시로 사용할 객체 리터럴을 주입하는 게 가장 빠른 길이다.   
다음은 8장의 예제 기반으로 작성했다.

```js
describe('returnValueCache', () => {
  'use strict';

  var testObject;
  var testValue;
  var args;
  var spyReference;

  // 테스트 객체를 생성하는 도우미 함수, testFunction에 스파이를 심고
  // 반환 객체의 spyReference 프로퍼티에 스파이 참조값을 담아둔다.
  function createATestObject() {
    var obj = {
      testFunction: function(arg) {
        return testValue;
      }
    };
    spyOn(obj, 'testFunction').and.callThrough();

    // 애스팩트가 적용된 이후에는
    // 스파이를 직접 참조할 수 없으므로 현재 참조값을 보관해둔다.
    obj.spyReference = obj.testFunction;

    return obj;
  }

  /*** beforeEach 줄임 ***/

  describe('advice(targetInfo)', () => {
    /*** 이전 테스트 줄임 ***/

    it('주입된 캐시를 인스턴스 간에 공유할 수 있다', () => {
      var sharedCache = {};
      var object1 = createATestObject();
      var object2 = createATestObject();

      Aop.around('testFunction', 
        new Aspects.returnValueCache(sharedCache).advice, 
        object1,
      );

      Aop.around('testFunction', 
        new Aspects.returnValueCache(sharedCache).advice, 
        object2,
      );

      object1.testFunction(args);

      // object2의 testFunction 호출 시
      // 캐시된 object1의 testFunction 호출 결과를 가져온다.
      expect(object2.testFunction(args)).toBe(testValue);

      // 따라서 object2의 testFunction은 실행되지 않는다.
      expect(object2.spyReference.calls.count()).toBe(0);
    });
  });
});
```

객체 리터럴을 받게끔 8장의 `returnValueCache`를 수정한다.

```js
var Aspects = Aspects || {};

Aspects.returnValueCache = function(sharedCache) {
  'use strict';

  // 주어진 sharedCache가 있다면 사용한다.
  var cache = sharedCache || {};

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

`returnValueCache`가 공유 캐시를 접수헀으니 `restaurantApi.getRestaurantsWithinRadius`에서 애스팩트 적용 부분을 수정한다.

```js
var Conference = Conference || {};
Conference.caches = Conference.caches || {};

// restaurantApi.getRestaurantsWithinRadius 함수에서
// 캐시로 사용할 객체 리터럴(싱글톤) 생성
Conference.caches.getRestaurantsWithinRadius = {};

// getRestaurantsWithinRadius에 메모이제이션 패턴 적용
Aop.around(
  'restaurantApi',
  function addMemoizationToGetRestaurantsWithinRadius(targetInfo) {
    // ThirdParty.restaurantApi()가 반환한 원본 API
    var api = Aop.next.call(this, targetInfo);

    // getRestaurantsWithinRadius 함수를 장식하여 메모이제이션(공유 캐시로) 추가
    Aop.around('getRestaurantsWithinRadius',
      Aspects.returnValueCache(Conference.caches.restaurantsWithinRadiusCache).advice,
      api,
    );

    // 고친 API를 반환한다.
    return api;
  },
  ThirdParty,
);
```

객체 리터럴을 그야말로 가장 단순한 싱글톤 패턴 구현체이지만, 모듈 패턴 등 타 객체 생성 패턴이 제공하는 데이터 감춤 따위의 기능은 없다.

### 🎈 모듈로 싱글톤 공유 캐시 구현하기
위 예제의 공유 캐시는 객체 리터럴 `restaurantsWithinRadiusCache`를 `Conference.caches` 이름공간에 선언하여 만들었다. 대개 개게 리터럴 정도면 캐시 용도로 나쁘지 않은데, 더 기능이 다양한 캐시를 써야 할 때도 있다. 이를테면 가장 오래전에 캐시한 값을 가장 최근 캐시값으로 대체하면서 항상 일정한 개수의 값들만 남기는, 최저 사용빈도(LRU) 캐시가 있어야 할 때도 있고, 일정 시간까지만 캐시값을 저장해두는 게 더 합리적인 상황도 있을 수 있다. 어쨌든 캐시가 객체 리터럴인 한 이런 부가 기능까지 구현하기 어렵다.   

그래서 프로퍼티 접근 방식이 아닌 API를 토해 객체 리터럴 기반의 캐시 기능을 제공하는 `Conference.simpleCache` 모듈을 직접 개발했다.

```js
var Conference = Conference || {};

Conference.simpleCache = function() {
  'use strict';

  var privateCache = {};

  function getCacheKey(key) {
    return JSON.stringify(key);
  }

  return {
    // 캐시에 있는 키면 true, 아니면 false를 반환한다.
    hasKey: function(key) {
      return privateCache.hasOwnProperty(getCacheKey(key));
    },

    // 캐시에 해당 키값을 저장한다.
    setValue: function(key, value) {
      privateCache[getCacheKey(key)] = value;
    },

    // 해당 키값을 반환한다.
    // (캐시에 키값이 없으면 undefined)
    getValue: function(key) {
      return privateCache[getCacheKey(key)];
    }
  };
};
```

`simpleCache`를 사용하려면 `returnValueCache`를 조금 고쳐야 한다. 공유 캐시를 주지 않으면 객체 리터럴 대신 새 `simpleCache`가 생성되고 이후로는 캐시 객체 프로퍼티를 직접 건드리지 않고 `simpleCache` API가 표출한 메서드를 사용하게 될 것이다.   

이전 `returnValueCache`의 단위 테스트에서 `simpleCache`를 쓰기 위해 수정할 부부은 한 줄 뿐이다.

```js
describe('returnValueSimpleCache', () => {
  'use strict';

  /*** 설정 및 유틸리티 함수는 그대로이므로 줄임 ***/

  describe('advice(targetInfo)', () => {
    /*** 이전 테스트 줄임 ***/

    it('주입된 캐시를 인스턴스 간에 공유할 수 있다', () => {
      // 변경
      // 공유 캐시 객체, simpleCache를 생성한다.
      var sharedCache = Conference.simpleCache();
      var object1 = createATestObject();
      var object2 = createATestObject();

      Aop.around('testFunction', 
        new Aspects.returnValueCache(sharedCache).advice, 
        object1,
      );

      Aop.around('testFunction', 
        new Aspects.returnValueCache(sharedCache).advice, 
        object2,
      );

      object1.testFunction(args);

      // object2의 testFunction 호출 시
      // 캐시된 object1의 testFunction 호출 결과를 가져온다.
      expect(object2.testFunction(args)).toBe(testValue);

      // 따라서 object2의 testFunction은 실행되지 않는다.
      expect(object2.spyReference.calls.count()).toBe(0);
    });
  });
});
```

이렇게 `simpleCache`를 작성하여 `returnValueCache`가 `simpleCache`를 쓰도록 고쳤으니 다음은 `restaurantApi.getRestaurantsWithinRadius` 함수가 사용할 싱글톤 캐시 객체를 만들 차례다.   

객체 리터럴을 공유 캐시로 쓸 때는 객체 리터럴이 이미 싱글톤이니 캐시 인스턴스가 하나만 있다는 사실이 명백했다. 지금은 모듈 자체가 캐시라 상황이 다른데, 모듈 함수를 실행하면 각자 객체 인스턴스를 생성하기 때문이다.   

`restaurantApi` 인스턴스가 다들 단일 `simpleCache` 인스턴스를 바라보게 하려면 즉시 실행 모듈을 응용해서 싱글톤 패턴을 구현하는 것이 좋다. `RestaurantsWithinRadiusCache` 모듈은 호출할 때마다 똑같은 `simpleCache` 인스턴스를 반환하는 단일 함수인 `getInstance`를 표출한다.

```js
describe('Conference.caches.RestaurantsWithinRadiusCache', () => {
  'use strict';

  describe('getInstance', () => {
    it('항상 동일한 인스턴스를 반환한다', () => {
      // .getInstance가 동일한 객체를 반환하는지 확인
      expect(Conference.caches.RestaurantsWithinRadiusCache.getInstance())
        .toBe(Conference.caches.RestaurantsWithinRadiusCache.getInstance());
    });
  });
});
```

다음은 `RestaurantsWithinRadiusCache` 구현부다.

```js
var Conference = Conference || {};
Conference.caches = Conference.caches || {};

// restaurantApi.getRestaurantsWithinRadius 함수에서
// 캐시로 사용할 simpleCache(싱글톤) 생성
Conference.caches.RestaurantsWithinRadiusCache = (function() {
  'use strict';

  var instance = null;

  return {
    getInstance: function() {
      if(!instance) {
        instance = Conference.simpleCache();
      }

      return instance;
    }
  };
})();
```

위 예제에서 즉시 실행 함수의 반환값을 `RestaurantsWithinRadiusCache`에 할당하면서 이 객체를 `getInstance` 함수를 표출한 싱글톤 객체로 확실히 자리매김한다. `getInstance`를 맨 처음 실행하면 숨어 있던 `instance` 변수가 `simpleCache`로 채워진다. 나중에 `getInstance`를 몇 번이고 호출해도 같은 `instance`를 내어준다.

> 인스턴스 객체의 인스턴스화를 나중으로 미룰 수 있다는 점이 싱글톤 패턴의 또 다른 매력이다. 인스턴스 객체를 생성하는 데 시간/비용이 많이 듣다면 중요한 장점이다.

마지막으로 유념할 점은 `returnValueCache` 애스팩트를 `restaurantApi.getRestaurantsWithinRadius` 함수에 적용할 부분 역시 새로운 `RestaurantsWithinRadiusCache` 싱글톤을 쓰게끔 고쳐야 한다는 사실이다.

```js
// getRestaurantsWithinRadius에 메모이제이션 패턴 적용

Aop.around(
  'restaurantApi',
  function addMemoizationToGetRestaurantsWithinRadius(targetInfo) {

    // ThirdParty.restaurantApo()가 반환한 원본 API
    var api = Aop.next.call(this, targetInfo);

    // 싱글톤 캐시 인스턴스를 가져온다.
    var cache = Conference.caches.RestaurantsWithinRadiusCache.getInstance();

    // getRestaurantsWithinRadius 함수를 장식하여
    // 메모이제이션(공유 캐시로) 추가
    Aop.around('getRestaurantsWithinRadius', 
      Aspects.returnValueCache(cache).advice, api);

    // 고친 API를 반환한다.
    return api;
  },
  ThirdParty,
);
```

## 📚 정리하기
싱글톤은 자바스크립트에서 널리 쓰이는 패턴이다. 전역 이름공간을 애플리케이션의 함수나 변수로 오염시키지 않은 상태에서 이름공간을 생성할 때 유용한다. 또한, 캐시처럼 모듈끼리 데이터를 공유하는 용도로 최적이다.   

자바스크립트는 싱글 스레드로 움직이므로 다른 언어보다 객체 리터럴과 즉시 실행 모듈 같은 싱글톤 패턴을 올바르게 구현하기 쉽다. 여러 스레드가 싱글톤 객체에 동시에 접근할 때 야기되는 무제는 고민하지 않아도 된다.   

싱글톤 패턴 구현에 따른 단위 테스트는 객체가 있는지 확인하는 일이 관건이다.
