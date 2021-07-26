# 🌈 부분 적용 함수

## 📚 단위 테스트
곧 열릴 자바스크립트 콘퍼런스 행사장은 수천 명의 굶주린 개발자로 가득 찰 전망이다. 콘퍼런스가 열리면 행사장은 북새통을 이룰 테고 참가자들은 식사 거릴 찾아다닐 시간조차 아까우니 꽤 중요한 문제다.   

스현은 우선 행사장 근처에 있는 음식점 위치를 알려주는 서드파티 웹 서비르를 찾아보고, 샬럿은 이 서비스를 이용해서 UI를 개발하기로 업무를 분담했다. 승현은 서드파티 API 코드를 바로 찾았다.

```js
var ThirdParty = ThirdParty || {};
ThirdParty.restaurantApi = function() {
  'use strict';

  return {
    // 주어진 주소(address) 기준 반경 radiusMiles 마일 이내에 위치한
    // 원하는 요리(cuisine)를 먹을 수 있는 음식점 배열을 반환하는 프라미스를 반환
    getRestaurantsWithinRadius: function(address, radiusMiles, cuisine) {
      // 프라미스는 다음과 같은 객체의 배열로 귀결된다.
      // {
      //   name: '대성각',
      //   address: '울산 남구 신정로 20번길 988',
      // }
    }
  };
};
```

괜찮은 API인 것 같은데, 필요 이상 잡다한 부분도 있다. 먼저, `address` 인자는 콘퍼런스 행사장 주소라서 값이 바뀔 일이 없고, 요건상 근처 음식점은 행사장 기준 3km 이내에 있는 음식점이므로 `radiusMiles` 파라미스터값 또한 일정하다.   

승현은 `getRestaurantsNearConference(cuisine)` 함수로 API를 확장하기로 한다. `address`와 `radius` 파라미터를 고정한 채 `getRestaurantsNearConference(cuisine)`가 `getRestaurantsWithinRadius(address, radius, cuisine)` 반환값을 무조건 반환하게 하는 거다. 일단 이렇게 해서 대략 단위테스트를 그려본다.

```js
describe('ThirdParty.restaurantApi() 애스팩트', () => {
  var api = ThirdParty.restaurantApi();

  describe('getRestaurantsNearConference(cuisine)', () => {
    var returnFromUnderlyingFunction = '아무거';
    var cuisine = '중화요리';

    beforeEach(() => {
      spyOn(api, 'getRestaurantsWithinRadius')
        .and.returnValue(returnFromUnderlyingFunction);
    });

    it('올바른 인자로 getRestaurantsWithinRadius를 호출한다', () => {
      api.getRestaurantsNearConference(cuisine);
      expect(api.getRestaurantsWithinRadius).toHaveBeenCalledWith(
        '울산 남구 신정로 20번길 988', 2.0, cuisine,
      );
    });

    it('getRestaurantsWithinRadius로부터 받은 값을 반환한다', () => {
      var ret = api.getRestaurantsNearConference(cuisine);
      expect(ret).toBe(returnFromUnderlyingFunction);
    });
  });
});
```

## 📚 부분 적용 함수 만들기
본함수를 감싸서 일부 파라미터 값을 고정하는, 다음 함수를 API에 추가하고 싶다.

```js
function getRestaurantsNearConference(cuisine) {
  return api.getRestaurantsWithinRadius(
    '울산 남구 신정로 20번길 988', 2.0, cuisine,
  );
}
```

승현은 다음과 같이 코딩한다.

```js
// ThirdParty.restaurantApi()에 getRestaurantsNearConference 멤버를 추가한다.
Aop.around(
  // 반환값을 수정해야 할 함수
  'restaurantApi',

  // 반환값을 수정하는 함수
  function addGetRestaurantNearConference(targetInfo) {
    'use strict';

    // ThirdParty.restaurantApi()가 반환한 원본 API
    var api = Aop.next.call(this, targetInfo);

    // API에 추가할 함수
    function getRestaurantsNearConference(cuisine) {
      return api.getRestaurantsWithinRadius(
        '울산 남구 신정로 20번길 988', 2.0, cuisine,
      );
    }

    // 없으면 이 함수를 추가한다.
    api.getRestaurantsNearConference =
      api.getRestaurantsNearConference || getRestaurantsNearConference;

    // 수정한 API를 반환한다.
    return api;
  },

  // 반환값을 수정해야 할 함수의 이름공간
  ThirdParty
);
```

## 📚 부분 적용 함수와 커링 구별하기

### 🎈 커링
커링은 인자를 여럿 취하는 함수를 인자 하나만 받은 함수 여러 개로 해체하는 기법이다. 즉, 다음 코드를 `getRestaurantsWithinRadius(address, radius, cuisine)`을 `getRestaurantsCurried(address)(radius)(cuisine)`과 같이 쓰는 걸 말한다.   

첫 번째 호출부 `getRestaurantsCurried(address)` 실행이 끝나면 `radius`를 인자로 받아 또 다른 함수, 즉 `cuisine`을 인자로 받는 함수를 반환하는 함수가 반환한다. 가장 깊은 중첩 단계의 함수가 마지막으로 답을 내어주는 구조다.

```js
function getRestaurantsCurried(address) {
  var self = this;
  return function(radius) {
    return function(cuisine) {
      return self.getRestaurantsWithinRadius(address, radius, cuisine);
    }
  }
}
```

하스켈(Haskell)과 ML처럼 커링 함수가 일상적인 프로그래밍 언어는 모든 함수가 하나의 인자만 받는다. 그밖에 람다 대수학(lambda calculus) 이후 등자안 패턴과 기법이 있다.

### 🎈 부분 적용 함수
부분 적용 함수는 언뜻 인자를 여럿 받는 함수를 더 적은 인자를 받는 함수로 바꾸는 커링과 비슷해 보인다. 그러나 다음 `getRestaurantsNearConference` 구현부를 보면 알 수 있듯이 오히려 정반대에 가깝다. 즉, 부분 적용 함수는 이전 단계에서 생성된 커링 요소에 뭔가 더 보태서 결국 이장 앞부분에서 소개했던 부분 적용 함수 비전과 기능이 같은 함수로 만든 것이다.

```js
function getRestaurantsNearConference(cuisine) {
  return getRestaurantsCurried('울산 남구 신정로 20번길 988')(2.0)(cuisine);
}
```

## 📚 정리하기
값이 불변인 상수 인자를 지닌 함수 호출부는 상수성을 캡슐화하여 함수를 새로 만드는 게 좋다. 이것이 바로 부분 적용 함수 기법이다.   
의도한 대로 상수를 사용하는지 정확하고 DRY한 단위 테스트로 확인하라. 반환 타입은 물론, 본함수에 대한 어떤 가정이나 추정도 할 필요가 없다.(그렇게 해서도 안 된다.)   
부분 적용 함수는 커링과 혼동하기 쉽다. 진짜 커링은 인자를 부분적으로, 아니면 다른 방법으로 적용하는 일이 없다. 외려 여러 인자를 거느린 함수를 인자를 하나만 취하는 여러 단께의 함수들로 쪼갠다. 부분 적용 함수로 인자를 되풀이하지 않는 원리가 마음에 든다면 함수 본체를 실행하는 **메모이제이션**(**memoization**)기법 역시 흡족할 것이다.
