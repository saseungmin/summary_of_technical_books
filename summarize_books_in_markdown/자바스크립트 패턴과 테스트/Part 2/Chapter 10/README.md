# 🌈 팩토리 패턴

## 📚 단위 테스트
> **요구사항**: 자바스크립트 콘퍼런스는 많은 프레젠테이션으로 풍성할 것이다. 승현은 프레젠테이션 모델링을 고민 중이다.   
> 프레젠테이션 유형은 두 가지, 즉 일반(regular) 프레젠테이션과 벤더(vendor) 프레젠테이션으로 나뉜다. 일반 프레젠테이션은 제목과 발표자(선택) 정보가 있고, 벤더 프레젠테이션은 여기에 벤더명, 제품(선택) 정보가 추가된다.


||일벤 프레젠테이션|벤더 프레젠테이션|
|:---:|:---:|:---:|
|title(제목)|필수|필수|
|presenter(발표자)|선택|선택|
|vendor(벤더)|-|필수|
|product(제품)|-|선택|

승현은 `Object.create` 메서드로 프로토타입 상속을 해보려고 다음처럼 일반, 벤더 프레젠테이션 클래스르 코딩한다.

```js title="일반 프레젠테이션"
// 일반 프레젠테이션
var Conference = Conference || {};
Conference.Presentation = function(title, presenter) {
  'use strict';

  if (!(this instanceof Conference.Presentation)) {
    throw new Error(Conference.Presentation.messages.mustUseNew);
  }

  if (!title) {
    throw new Error(Conference.Presentation.messages.titleRequired);
  }

  this.title = title;
  this.presenter = presenter;
};

Conference.Presentation.messages = {
  mustUseNew: 'Presentation은 반드시 "new"로 생성해야 합니다.',
  titleRequired: 'title은 필수 입력 항목입니다.',
};
```

- 벤더 프레젠테이션

```js title="벤더 프레젠테이션"
// 벤더 프레젠테이션
var Conference = Conference || {};
Conference.VendorPresentation = function(title, presenter, vendor, product) {
  'use strict';

  if (!(this instanceof Conference.VendorPresentation)) {
    throw new Error(Conference.VendorPresentation.messages.mustUseNew);
  }

  if (!vendor) {
    throw new Error(Conference.VendorPresentation.messages.vendorRequired);
  }

  // 실직적인 상속은 생성자에 있는 다음 코드에서 일어난다.
  Conference.VendorPresentation.call(this, title, presenter);
  this.vendor = vendor;
  this.presenter = presenter;
};

// 프로토타입 상속이 이루어진다.
Conference.VendorPresentation.prototype
    = Object.create(Conference.Presentation.prototype);

Conference.VendorPresentation.messages = {
  mustUseNew: 'VendorPresentation은 반드시 "new"로 생성해야 합니다.',
  vendorRequired: 'vendor은 필수 입력 항목입니다.',
};
```

코드는 문제없이 돌아가지만, 발표자 없이 `VendorPresentation`을 생성하는 광경이 조금 부자연스럽다.

```js
new VendorPresentation('The title', undefined, 'The Vendor', 'The Product');
```

비디오, 세미나 등 유형이 전혀 다른 프레젠테이션도 있다. 이들까지 `Presentation` 객체를 상속하면 이상한 생성자를 갖게 되지 않을까? 또한, 프레젠테이션 유형은 네 코드에서 알아서 파악해야 해야되지 않을까?   

`presentationFactory` 객체에 `create` 메서드를 만들고 프로퍼티 뭉치로 이루어진 파라미터를 하나 받아 알아서 처리시키면 될 거 같다.   

```js
describe('presentationFactory', () => {
  var factory = Conference.presentationFactory();

  describe('create(objectLiteral)', () => {
    it('파라미터에 이상한 프로퍼티가 있으면 예외를 던진다', () => {
      var badProp = 'badProperty';
      
      function createWithUnexpectedProperties() {
        var badParam = {};
        badParam[badProp] = 'unexpected!';
        factory.create(badParam);
      }

      expect(createWithUnexpectedProperties).toThrowError(
        Conference.presentationFactory.messages.unexpectedProperty + badProp
      );
    });
  });
});
```

`presentationFactory`의 첫 번째 임무는 파라미터에 이상한 프로퍼티는 없는지 살피는 일이다.

```js
var Conference = Conference || {};

Conference.presentationFactory = function presentationFactory() {
  'use strict';

  return {
    // obj 인자의 프로퍼티에 따라
    // 하나의 Presentation 또는 그 하위 Presentation 중 하나를 생성한다.
    create: function(obj) {
      var baseProperties = ['title', 'presenter'];
      var vendorProperties = ['vendor', 'product'];
      var allProperties = baseProperties.concat(vendorProperties);
      var p;
      var ix;

      for (p in obj) {
        if (allProperties.indexOf(p) < 0) {
          throw new Error(
            Conference.presentationFactory.messages.unexpectedProperty + p,
          );
        }
      }

      // 나중에 Presentation에서 유래한 객체를 반환할 예정
    }
  };
};

Conference.presentationFactory.messages = {
  unexpectedProperty: '이상한 프로퍼티를 지닌 생성 파라미터가 있습니다.',
};
```

네거티브 테스트를 통과하고 관련 코딩이 끝났다면 다음은 팩토리 본연의 로직을 구현할 차례다.   

첫째, 파라미터에 기본 `Presentation` 객체의 프로퍼티만 있으면 `create` 메서드는 그냥 이 객체를 반환한다. 이런 파라미터가 넘어오면 정말 `Presentation`이 반환되는지 확인하는 단위 테스트를 작성하기는 쉬워도 두 가지 중요한 고민거리를 남긴다.
- `Presentation` 생성자에 올바른 파라미터가 전달됐는지 어떻게 확신할까?
- 그렇다고 하더라도 생성된 객체가 잘 반환되었는지 무슨 수로 보장할까?

```js
describe('presentationFactory', () => {
  'use strict';
  var factory = Conference.presentationFactory();
  var baseParameter = {
    title: '자바스크립트를 멋지게 사용해보세요',
    presenter: '박길벗',
  };

  describe('create(objectLiteral)', () => {
    /** 이전 테스트 줄임 **/

    describe('기본 프로퍼티만 있을 경우', () => {
      var fakePresentation = {
        title: '프레젠테이션을 베끼는 방법',
      };
      var spyOnConstructor;
      var returnedPresentation;

      beforeEach(() => {
        spyOnConstructor = spyOn(Conference, 'Presentation')
          .and.returnValue(fakePresentation);
        returnedPresentation = factory.create(baseParameter);
      });

      it('모든 값을 Presentation 생성자에 넘긴다', () => {
        expect(spyOnConstructor).toHaveBeenCalledWith(
          baseParameter.title, baseParameter.presenter,
        );
      });

      it('Presentation 생성자를 딱 한 번만 호출한다', () => {
        expect(spyOnConstructor.calls.count()).toBe(1);
      });

      it('생성자 Presentation을 반환한다', () => {
        expect(factory.create(baseParameter)).toBe(fakePresentation);
      });
    });
  });
});
```

위 예제의 기본 프레젠테이션을 팩토리가 잘 생성하는지 확인하는 일이 거의 다고, 나머지는 벤더 프레젠테이션 관련 테스트들이다.

```js
describe('presentationFactory', () => {
  'use strict';
  var factory = Conference.presentationFactory();
  var baseParameter = {
    title: '자바스크립트를 멋지게 사용해보세요',
    presenter: '박길벗',
  };

  describe('create(objectLiteral)', () => {
    /** 이전 테스트 줄임 **/

    describe('기본 프로퍼티만 있을 경우', () => {
      // 테스트를 줄임
    });

    describe('VendorPresentation 프로퍼티가 적어도 하나 이상 있을 경우', () => {
      var vendorParameter = {
        title: '자바스크립트를 멋지게 사용해보세요',
        presenter: '박길벗',
        vendor: '길벗출판사',
        product: '자바스크립트 패턴과 테스트',
      };
      var fakeVendorPresentation = {
        title: vendorParameter.title,
      };
      var spyOnConstructor;

      beforeEach(() => {
        spyOnConstructor = spyOn(Conference, 'VendorPresentation')
          .and.returnValue(fakeVendorPresentation);
      });


      it('VendorPresentation을 생성해본다', () => {
        var expectedCallCount = 0;

        function createParam(propName) {
          var param = {};
          var p;

          for (p in baseParameter) {
            param[p] = baseParameter[p];
          }

          param[propName] = vendorParameter[propName];
          return param;
        }

        // 각 vendor 프로퍼티를 차례로 지닌 파라미터를 생성한다.
        ['vendor', 'product'].forEach(function(propName) {
          var param = createParam(propName);
          var presentation = factory.create(param);

          expect(spyOnConstructor.calls.count()).toBe(++expectedCallCount);
        });
      });

      it('모든 값을 VendorPresentation 생성자에 넘긴다', () => {
        factory.create(vendorParameter);

        expect(spyOnConstructor).toHaveBeenCalledWith(
          vendorParameter.title, vendorParameter.presenter,
          vendorParameter.vendor, vendorParameter.product,
        );
      });

      it('VendorPresentation 생성자를 딱 한 번만 호출한다', () => {
        factory.create(vendorParameter);
        
        expect(spyOnConstructor.calls.count()).toBe(1);
      });

      it('생성한 VendorPresentation을 반환한다', () => {
        expect(factory.create(vendorParameter)).toBe(fakeVendorPresentation);
      });
    });
  });
});
```

## 📚 팩토리 패턴 구현
테스트로 기능을 다 점건했으니 이제 팩토리를 구현하자.

```js
var Conference = Conference || {};

Conference.presentationFactory = function presentationFactory() {
  'use strict';

  return {
    // obj 인자의 프로퍼티에 따라
    // 하나의 Presentation 또는 그 하위 Presentation 중 하나를 생성한다.
    create: function(obj) {
      var baseProperties = ['title', 'presenter'];
      var vendorProperties = ['vendor', 'product'];
      var allProperties = baseProperties.concat(vendorProperties);
      var p;
      var ix;

      for (p in obj) {
        if (allProperties.indexOf(p) < 0) {
          throw new Error(
            Conference.presentationFactory.messages.unexpectedProperty + p,
          );
        }
      }

      // 추가
      for (ix = 0; ix < vendorProperties.length; ++ix) {
        if (obj.hasOwnProperty(vendorProperties[ix])) {
          return new Conference.VendorPresentation(
            obj.title, obj.presenter, obj.vendor, obj.product,
          );
        }
      }

      return new Conference.Presentation(obj.title, obj.presenter);
    }
  };
};

Conference.presentationFactory.messages = {
  unexpectedProperty: '이상한 프로퍼티를 지닌 생성 파라미터가 있습니다.',
};
```

팩토리가 하는 일을 정리해보자.
- `create`의 파라미터는, 이전에 객체 리터럴로 넘겼을 때 `undefined`로 자리 끼움했던 보기 흉한 형태에서 완전히 벗어났다.
- 파라미터에 무엇이든 잘 건네주기만 하면 뒷일은 팩토리가 알아서 처리한다.
- 나중에 유형이 다른 프레젠테이션도 얼마든지 추가할 수 있다.
- `new` 키워드로 객체를 생성해야 한다는 사실을 팩토리가 대신 기억해준다.

## 📚 다른 팩토리 유형
오직 한 가지 유형의 객체만 생성하는 팩토리가 있다. 가령 여기서 본 객체 리터럴을 `presentationParameterFactory` 팩토리로 만들어낼 수 있다.   

이 장의 팩토리는 `create` 함수 하나만 있지만, 용도에 특화된 유형별 `create` 메서드가 여럿 있는 팩토리도 있다.   

팩토리는 제품별로 필요한 환경을 구축할 수 있는 편리한 곳이다. 현장에서는 단위 테스트, 기능 테스트, 제품마다 환경이 달라지는 경우가 많은데, 의존성을 주입하면 상황에 맞게 적절히 팩토리를 적용할 수 있다.   

끝으로, 팩토리는 싱글톤으로도 바꿔 쓸 수 있어서 9장에서 설명한 여러 가지 싱글톤을 적용할 수 있다.

## 📚 정리하기
연관된 객체 중 하나를 꺼내 생성할 수 있는 팩토리를 작성했다. 팩토리엔 대부분 `create`같은 이름의, 하나 또는 그 이상의 파라미터를 반든 메서드가 하나 있다. 이 메서드는 전달받은 파라미터를 살펴보고 알맞은 객체를 내어준다.   

팩토리는 객체 생성을 강력하게 다스리고 한 겹 더 추상화한다.   

팩토리 단위 테스트에서는 다음을 확인하자.
- `create` 함수는 잘못된 파라미터를 받지 않는다.
- 파라미터가 정상적으로 전달되면 그에 따른, 원객체의 생성 함수를 정확히 호출한다.
- 이렇게 하여 반환된 객체게 바로 `create`가 반환한 객체다.
