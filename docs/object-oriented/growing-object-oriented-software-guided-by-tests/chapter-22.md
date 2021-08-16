---
sidebar_position: 23
sidebar_label: 22. 복잡한 테스트 데이터 만들기
---

# 🌈 Chapter 22: 복잡한 테스트 데이터 만들기

- 테스트에서는 객체를 생성하고 싶을 때마다 생성자 인자를 모두 직접 제공해야만 한다.

```java
@Test public void chargesCustomerForTotalCostOfAllOrderedItems() {
  Order order = new Order(
    new Customer("Sherlock Holmes",
      new Address("221b Baker Street", "London",
        new PostCode("MW1", "3RX"))));

  order.addLine(new OrderLine("Deerstalker Hat", 1));
  order.addLine(new OrderLie("Tweed Cape", 1));
}
```

- 이 모든 객체를 생성하는 코드는 테스트 대상이 되는 행위에 기여하지 않는 정보로 테스트를 채워 넣어 테스트가 읽기 어려워진다. 게다가 생성자 인자나 객체 구조를 변경했을 때 여러 테스트가 깨질 것이므로 테스트가 불안정해진다.
- **객체 모체 패턴**은 이 문제를 방지하는 한 가지 시도에 해당한다. 객체 모체는 테스트에서 사용할 객체를 생성하는 여러 팩터리 메서드가 담긴 클래스를 가리킨다.
- 객체 모체는 새 객체 구조를 만드는 코드를 묶고 거기에 이름을 부여함으로써 테스트의 가독성을 높인다. 그뿐 만아니라 객체 모체의 기능은 테스트 사이에서 재사용할 수 있어 유지 보수에도 도움이 된다.
- 한편으로는 객체 모체 패턴은 테스트 데이터가 변형되면 잘 대처하지 못하고 사소한 차이가 있을 때마다 새로운 팩터리 메서드가 필요하다. 때문에 시간이 지나면 객체 모체 자체가 중복된 코드로 가득 차거나 무수히 많은 미세 메서드로 리팩터링되어 지원하기가 너무 어려워질지도 모른다.

## 📚 테스트 데이터 빌더
- 빌더 패턴을 이용해 테스트에서 인스턴스를 생성한다. 복잡한 준비가 필요한 클래스의 경우 생성자의 각 매개변수에 대응되는 필드가 포함된 테스트 데이터 빌더를 만든다.
- 빌더에는 필드의 값을 덮어쓰는 데 사용되는 연결 가능한 공용 메서드가 있으며, 관례상 마지막에 `build()` 메서드를 호출해 필드 값을 토대로 대상 객체의 새로운 인스턴스를 만들어낸다.
- 이렇게 하면 테스트에 예상 결과와 관련이 있는 값만 포함되어 테스트 표현력이 높아진다. 또한 변화에 탄력적으로 대응할 수 있다.
  1. 새 객체를 생성할 때 문법적으로 지저분한 부분을 대부분 가려준다.
  2. 기본적인 경우를 단순하게 하고 특별한 경우라도 그리 복잡하게 만들지 않는다.
  3. 테스트 객체의 구조적인 변화로부터 테스트를 다시 한 번 보호한다. 생성자에 인자를 추가한다면, 새 인자가 필요했던 부분과 관련된 빌더와 테스트만 변경하면 된다.
  4. 읽기 쉽고 오류를 찾기 쉬운 테스트 코드를 작성할 수 있다. 각 빌더 메서드가 해당 매개변수의 용도를 밝히기 떄문이다.

## 📚 비슷한 객체 생성
- 다수의 비슷한 객체를 생성해야 할 떄 빌더를 이용할 수 있다.
- **빌더 하나만을 공통적인 상태로 초기화한 다음 생성될 각 객체를 대상으로 값을 다르게 정의한 후 `build()` 메서드를 호출**하면 된다.

```java
OrderBuilder hatAndCape = new OrderBuilder()
  .withLine('Deerstalker Hat', 1)
  .withLine('Tweed Cape', 1);

Order orderWithSmallDiscount = hatAndCape.withDiscount(0.10).build();
Order orderWithLargeDiscount = hatAndCape.withDiscount(0.25).build();
```

- 더 적은 코드로도 차이에 더 집중할 수 있는 테스트가 만들어진다. 기능을 토대로 빌더의 이름을 짓고 차이점을 토대로 도메인 객체의 이름을 지을 수 있다.
- 이 기법은 객체의 **동일 필드가 달라질 경우 가장 효과적이다.**

```java
Order orderWithDiscount = new OrderBuilder(hatAndCape)
  .withDiscount(0.10)
  .build();

Order orderWithGiftVoucher = new OrderBuilder(hatAndCape)
  .withDiscount("abc")
  .build();
```

## 📚 빌더 조합
- 각 객체에 대한 테스트 데이터 빌더가 '이미 만들어진' 다른 객체를 사용하는 경우에는 그 대상 객체 대신 객체의 빌더를 인자로 전달받을 수 있다.
- 이렇게 하면 `build()` 메서드가 제거되어 테스트 코드가 단순해질 것이다.

```java
Order order = new OrderBuilder()
  .fromCustomer(
    new CustomerBuilder()
      .withAddress(new AddressBuilder().withNoPostcode().build())
      .build())
    .build();

// 변경 후
Order order = new OrderBuilder()
  .fromCustomer(
    new CustomerBuilder()
      .withAddress(new AddressBuilder().withNoPostcode()))
    .build();
```

## 📚 팩터리 메서드를 이용한 도메인 모델 강조
- 빌더를 생성하는 부분을 팩터리메서드로 감싸면 테스트 코드에 있는 잡음을 더욱 줄일 수 있다.

```java
Order order = anOrder().fromCustomer(
  aCustomer().withAddress(anAddress().withNoPostcode())).build();
```

- 테스트 코드를 압축하다보면 빌더에 포함된 중복 코드는 좀 더 두드러져 보인다. 이를 자바의 메서드 중복 정의(method overload)를 활용해 `with()` 메서드를 하나로 줄여서 자바의 타입 시스템이 어느 필드에 갱신해야 할지 판단할 수 있다.

```java
Order order = anOrder().from(aCustomer().with(anAddress().withNoPostcode())).build();
```

- 이 방법은 각 타입의 한 인자에 대해서만 효과가 있다.

## 📚 사용 시점에서 중복 없애기
- 테스트를 구조화해서 특정 맥락에서 이러한 빌더를 가장 잘 활용하는 방법
- 303P ~ 305P 예제 참고

#### 🎈 우선 중복을 제거한다
- 객체 모체 패턴 수행
- 더 나은 방법인 빌더의 인자가 아니라 빌더를 전달한다. (빌더 조합)

#### 🎈 그러고 나서 기량을 향상한다
- 테스트 코드에서 **이름을 바꿔 쓰는 식**으로 테스트 코드에서 강조하는 바를 테스트의 구현 방법이 아닌 **테스트에서 예상하는 행위**로 바꿀 수 있다.

## 📚 의사소통이 우선이다
- 테스트 데이터 빌더를 이용해 중복을 줄이고 테스트 코드를 좀 더 표현력 있게 만들었다.
- 이것은 우리가 코드라는 언어를 관찰한 바를 반영하는 또 다른 기법에 해당하며, 이 기법은 *코드를 읽으려고 있는 것*이라는 원칙에 의해 주도된다.
- 좀 더 읽기 쉽고 기능의 의도를 서술하는 선언적 테스트를 작성하는 데 도움이 된다. 이러한 기법을 이용하면 기술과 관련이 없는 이해당사자와 직접적으로 의사소통하는 데 활용할 수 있다.
