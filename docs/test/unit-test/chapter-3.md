---
sidebar_position: 4
sidebar_label: 3. 단위 테스트 구조
---

# 🐤 Chapter 3: 단위 테스트 구조

## 🥕 단위 테스트를 구성하는 방법

### 🎈 AAA 패턴 사용
AAA 패턴은 각 테스트를 준비, 실행, 검증이라는 세 부분으로 나눌 수 있다. 두 숫자의 합을 계산하는 메서드만 있는 `Calculator` 클래스를 살펴보자.

```cs
public class Calculator {
  public double Sum(double first, double second) {
    return first + second;
  }
}
```

다음 예제는 클래스의 동작을 검증하는 테스트다. 이 테스트는 AAA 패턴을 따른다.

```cs
public class CalculatorTests {
  [Fact]
  public void Sum_of_two_numbers() {
    // 준비
    double first = 10;
    double second = 20;
    var calculator = new Calculator();

    // 실행
    double result = calculator.Sum(first, second);

    // 검증
    Assert.Equal(30, result);
  }
}
```

AAA 패턴은 스위트 내 모든 테스트가 단순하고 균일한 구조를 갖는 데 도움이 된다. 이러한 일관성이 이 패턴의 가장 큰 장점 중 하나다. 일단 익숙해지면 모든 테스트를 쉽게 읽을 수 있고 이해할 수 있다. 결국 전체 테스트 스위트의 유지 보수 비용이 줄어든다. 구조는 다음과 같다.
- 준비 구절에서는 테스트 대상 시스템(SUT)과 해당 의존성을 원하는 상태로 만든다.
- 실행 구절에서는 SUT에서 메서드를 호출하고 준비된 의존성을 전달하며 출력 값을 캡처한다.
- 검증 구절에서는 결과를 검증한다. 결과는 반환 값이나 SUT와 협력자의 최종 상태, SUT가 협력자에 호출한 메서드 등으로 표시될 수 있다.

> **Given-When-Then 패턴**   
> AAA와 유사한 Given-When-Then 패턴에 대해 들어봤을 것이다. 이 패턴도 테스트를 세 부분으로 나눈다.   
> - Given - 준비 구절에 해당
> - When - 실행 구절에 해당
> - Then - 검증 구절에 해당
> 
> 테스트 구성 측면에서 두 가지 패턴 사이에 차이는 없다. 유일한 차이점은 프로그래머가 아닌 사람에게 Given-When-Then 구조가 더 읽기 쉽다는 것이다. 그러므로 Given-When-Then은 비기술자들과 공유하는 테스트에 더 적합하다.

테스트 주도 개발을 실천할 때, 즉 기능을 개발하기 전에 실패할 테스트를 만들 때는 아직 기능이 어떻게 동작할지 충분히 알지 못한다. 따라서 먼저 기대하는 동작으로 윤곽을 잡은 다음, 이러한 기대에 부응하기 위한 시스템을 어떻게 개발할지 아는 것이 좋다.   

직관적이지는 않지만, 이것이 문제를 해결하는 방식이다. 특정 동작이 무엇을 해야 하는지에 대한 목표를 생각하면서 시작한다. 그다음이 실제 문제 해결이다. 다른 것을 하기 전에 검증문을 작성하는 것은 단지 사고 과정의 형식이다. 그러나 다시 말하지만, 이 지침은 TDD를 실천할 때, 즉 제품 코드 전에 테스트를 작성할 때만 적용될 수 있다. 테스트 전에 제품 코드를 작성한다면 테스트를 작성할 시점에 실행에서 무엇을 예상하는지 이미 알고 있으므로 준비 구절부터 시작하는 것이 좋다.

### 🎈 여러 개의 준비, 실행, 검증 구절 피하기
때로는 준비, 실행 또는 검증 구절이 여러 개있는 테스트를 만날 수 있다.   

검증 구절로 구분된 여러 개의 실행 구절을 보면, 여러 개의 동작 단위를 검증하는 테스트를 뜻한다. 이러한 테스트는 더 이상 단위 테스트가 아니라 통합 테스트다. 이러한 테스트 구조는 피하는 것이 좋다. 실행이 하나면 테스트가 단위 테스트 범주에 있게끔 보장하고, 간단하고, 빠르며, 이해하기 쉽다. 일련의 실행과 검증이 포함된 테스트를 보면 리팩터링하라. 각 동작을 고유의 테스트로 도출하라.   

통합 테스트에서는 실행 구절을 여러 개 두는 것이 괜찮을 때도 있다. 통합 테스트는 느릴 수 있다. 속도를 높이는 한 가지 방법은 여러 개의 통합 테스트를 여러 실행과 검증이 있는 단일한 테스트로 묶는 것이다.   

그러나 다시 말하지만, 이 최적화 기법은 통합 테스트에만 적용할 수 있다. 그것도, 전부가 아니라 이미 느리고 더 느려지게 하고 싶지 않은 테스트들만이다. 단위 테스트나 충분히 빠른 통합 테스트에서는 이러한 최적화가 필요하지 않다.

### 🎈 테스트 내 `if`문 피하기
준비, 실행, 검증 구절이 여러 차례 나타나는 것과 비슷하게, `if`문이 있는 단위 테스트를 만날 수 있다. 이것도 안티 패턴이다. 단위 테스트든 통합 테스트든 테스트는 분기가 없는 간단한 일련의 단계여야 한다.   

`if`문은 테스트가 한 번에 너무 많은 것을 검증한다는 표시다. 그러므로 이러한 테스트는 반드시 여러 테스트로 나눠야 한다. 테스트에 분기가 있어서 얻는 이점은 없다. 단지 추가 유지비만 불어난다. `if`문은 테스트를 읽고 이해하는 것을 더 어렵게 만든다.

### 🎈 각 구절을 얼마나 커야 하는가?
일반적으로 준비 구절이 세 구절 중 가장 크며, 실행과 검증을 합친 만큼 클 수도 있다. 그러나 이보다 훨씬 크면, 같은 테스트 클래스 내 비공개 메서드 또는 별도의 팩토리 클래스로 도출하는 것이 좋다. 준비 구절에서 코드 재사용에 도움이 되는 두 가지 패턴으로 오브젝트 마더와 테스트 데이터 빌더가 있다.   

실행 구절은 보통 코드 한 줄이다. 실행 구절이 두 줄 이상인 경우 SUT의 공개 API에 문제가 있을 수 있다. 아래 예제의 실행 구절은 두 줄로 돼 있다. SUT에 문제가 있다는 신호다. 구매를 마치려면 두 번째 메서드를 호출해야 하므로, 캡슐화가 깨지게 된다.

```cs
[Fact]
public void Purchase_succeeds_when_enough_inventory() {
  // 준비
  var store = new Store();
  store.AddInventory(Product.Shampoo, 10);
  var customer = new Customer();

  // 실행
  bool success = customer.Purchase(store, Product.Shampoo, 5);
  store.RemoveInventory(success, Product.Shampoo, 5);

  // 검증
  Assert.True(success);
  Assert.Equal(5, store.GetInventory(Product.Shampoo));
}
```


- 첫 번째 줄에서 고객이 상점에서 샴푸 다섯 개를 얻을려고 한다.
- 두 번째 줄에서는 재고가 감소되는데, `Purchase()` 호출이 성공을 반환하는 경우에만 수행된다.

이러한 모순을 불변 위반이라고 하며, 잠재적 모순으로부터 코드를 보호하는 행위를 캡슐화라고 한다. 불변을 지키는 한, 불변 위반을 초래할 수 있는 잠재적인 행동을 제거해야 한다.

### 🎈 검증 구절에는 검증문이 얼마나 있어야 하는가
마지막으로 검증 구절이 있다. 테스트당 하나의 검증을 갖는 지침을 들어봤을 것이다. 이전 장에서 다뤘던 전체, 즉 가능한 한 가장 작은 코드를 목표로 하는 전제에 기반을 두고 있다.   
이미 알고 있듯이 이 전제는 올바르지 않다. 단위 테스트의 단위는 동작의 단위이지 코드의 단위가 아니다. 단일 동작 단위는 여러 결과를 낼 수 있으며, 하나의 테스트로 그 모든 결과를 평가하는 것이 좋다.   

그렇기는 해도 검증 구절이 너무 커지는 것은 경계해야 한다. 제품 코드에서 추상화가 누락됐을 수 있다. 예를 들어 SUT에서 반환된 객체 내에서 모든 속성을 검증하는 대신 객체 클래스 내에 적절한 동등 멤버를 정의하는 것이 좋다. 그러면 단일 검증문으로 객체를 기대값과 비교할 수 있다.

### 🎈 종료 단계를 어떤가
준비, 실행, 검증 이후의 네 번째 구절로 종료 구절을 따로 구분하기도 한다. 종료는 일반적으로 별도의 메서드로 도출돼, 클래스 내 모든 테스트에서 재사용된다. AAA 패턴에는 이 단계를 포함하지 않는다.   

대부분의 단위 테스트는 종료 구절이 필요 없다. 단위 테스트는 프로세스 외부에 종속적이지 않으므로 처리해야 할 부작용을 남기지 않는다. 종료는 통합 테스트의 영역이다.

### 🎈 테스트 대상 시스템 구별하기
SUT는 테스트에서 중요한 역할을 하는데, 애플리케이션에서 호출하고자 하는 동작에 대한 진입접을 제공한다. 동작은 여러 클래스에 걸쳐 있을 만큼 클 수도 있고 단일 메서드로 작을 수도 있다. 그러나 진입점은 오직 하나만 존재할 수 있다.   

따라서 SUT를 의존성과 구분하는 것이 중요하다. 특히 SUT가 꽤 많은 경우, 테스트 대상을 찾는 데 시간을 너무 많이 들일 필요가 없다. 그렇게 하기 위해 테스트 내 SUT 이름을 `sut`로 하라.

```cs
public class CalculatorTests {
  [Fact]
  public void Sum_of_two_numbers() {
    // 준비
    double first = 10;
    double second = 20;
    var sut = new Calculator(); // Calculator를 이제 sut라고 한다.

    // 실행
    double result = sut.Sum(first, second);

    // 검증
    Assert.Equal(30, result);
  }
}
```

### 🎈 준비, 실행, 검증 주석 제거하기
의존성에서 SUT를 떼어내는 것이 중요하듯이, 테스트 내에서 특정 부분이 어떤 구절에 속해 있는지 파악하는 데 시간을 많이 들이지 않도록 세 구절을 서로 구분하는 것 역시 중요하다. 이를 위한 한 가지 방법은 각 구절을 시작하기 전에 주석을 다는 것이다. 다른 방법은 다음 예제와 같이 빈 줄로 분리하는 것이다.

```cs
public class CalculatorTests {
  [Fact]
  public void Sum_of_two_numbers() {
    double first = 10;
    double second = 20;
    var sut = new Calculator();

    double result = sut.Sum(first, second);

    Assert.Equal(30, result);
  }
}
```

빈 줄로 구절을 분리하면 대부분의 단위 테스트에서 효과적이며, 간결성과 가독성 사이에서 균형을 잡을 수 있다. 그러나 대규모 테스트에서는 잘 작동하지 않는다. 대규모 테스트에서는 준비 단계에 빈 줄을 추가해 설정 단계를 구분할 수도 있다. 통합 테스트에는 복잡한 설정을 포함하는 경우가 많다.

- AAA 패턴을 따르고 준비 및 검증 구절에 빈 줄을 추가하지 않아도 되는 테스트라면 구절 주석들을 제거하라.
- 그렇지 않으면 구절 주석을 유지하라.

## 🥕 xUnit 테스트 프레임워크 살펴보기
- 프레임워크 소개라 생략. (P.89 ~ P.90 참고)

## 🥕 테스트 간 테스트 픽스처 재사용
준비 구절에서 코드를 재사용하는 것이 테스트를 줄이면서 단순화하기 좋은 방법이다.

> **테스트 픽스처**   
> 테스트 픽스처라는 단어는 다음과 같이 두 가지 공통된 의미가 있다.   
> 1. 테스트 픽스처는 테스트 실행 대상 객체다. 이 객체는 정규 의존성, 즉 SUT로 전달되는 인수다. 이러한 객체는 각 테스트 실행 전에 알려진 고정 상태로 유지하기 때문에 동일한 결과를 생성한다. 따라서 픽스처라는 단어가 나왔다.
> 2. 다른 정의는 NUnit 테스트 프레임워크에서 비롯된다. NUnit에서 `[TestFixture]`는 테스트가 포함된 클래스를 표시하는 특성이다.
>
> 이 책에서는 첫 번째 정의를 사용한다.

테스트 픽스처를 재사용하는 첫 번째 (올바르지 않은) 방법은 다음과 같이 테스트 생성자에서 픽스처를 초기화하는 것이다.

```cs
public class CustomerTests {
  private readonly Store _store; // 공통 테스트 픽스처
  private readonly Customer _sut;

  // 클래스 내 각 테스트 이전에 호출
  public CustomerTests() {
    _store = new Store();
    _store.AddInventory(Product.Shampoo, 10);
    _sut = new Customer();
  }

  [Fact]
  public void Purchase_succeeds_when_enough_inventory() {
    bool success = _sut.Purchase(_store, Product.Shampoo, 5);
    Assert.True(success);
    Assert.Equal(5, _store.GetInventory(Product,Shampoo));
  }

  [Fact]
  public void Purchase_fails_when_not_enough_inventory() {
    bool success = _sut.Purchase(_store, Product.Shampoo, 15);
    Assert.False(success);
    Assert.Equal(10, _store.GetInventory(Product.Shampoo));
  }
}
```

두 테스트는 공통된 구성 로직이 있다. 실제로 준비 구절이 동일하므로 `CustomerTests`의 생성자로 완전히 추출할 수 있었고 예제와 같이 작성했다. 테스트에는 더 이상 준비 구절이 있지 않다.   
이 방법으로 테스트 코드의 양을 크게 줄일 수 있으며, 테스트에서 테스트 픽스처 구성을 전부 또는 대부분 제거할 수 있다. 그러나 이 기법은 두 가지 중요한 단점이 있다.
- 테스트 간 결합도가 높아진다.
- 테스트 가독성이 떨어진다.

### 🎈 테스트 간의 높은 결합도는 안티 패턴이다
위 예제에서 모든 테스트가 서로 결합돼 있다. 즉, 테스트의 준비 로직을 수정하면 클래스의 모든 테스트에 영향을 미친다. 에를 들어,

```cs
_store.AddInventory(Product.Shampoo, 10);
```

위 코드를 다음과 같이 수정하면

```cs
_store.AddInventory(Product.Shampoo, 15);
```

상점의 초기 상태에 대한 가정을 무효화하므로 쓸데없이 테스트가 실패하게 된다. 이는 테스트를 수정해도 다른 테스트에 영향을 주어서는 안 된다는 중요한 지침을 위반한다. 테스트는 서로 격리돼 실행해야 한다.

### 🎈 테스트 가독성을 떨어뜨리는 생성자 사용
준비 코드를 생성자로 추출할 때의 또 다른 단점은 테스트 가독성을 떨어뜨리는 것이다. 테스트만 보고 더 이상 전체 그림을 볼 수 없다. 테스트 메서드가 무엇을 하는지 이해하려면 클래스의 다른 부분도 봐야 한다.   

준비 로직이 별로 없더라도 테스트 메서드로 바로 옮기는 것이 좋다.

### 🎈 더 나은 테스트 픽스처 재사용법
두 번째 방법은 다음 예제와 같이 테스트 클래스에 비공개 팩토리 메서드를 두는 것이다.

```cs
public class CustomerTests {
  [Fact]
  public void Purchase_succeeds_when_enough_inventory() {
    Store store = CreateStoreWithInventory(Product.Shampoo, 10);
    Customer sut = CreateCustomer();
    bool success = sut.Purchase(store, Product.Shampoo, 5);
    Assert.True(success);
    Assert.Equal(5, store.GetInventory(Product.Shampoo));
  }

  [Fact]
  public void Purchase_fails_when_enough_inventory() {
    Store store = CreateStoreWithInventory(Product.Shampoo, 10);
    Customer sut = CreateCustomer();
    bool success = sut.Purchase(store, Product.Shampoo, 15);
    Assert.False(success);
    Assert.Equal(10, store.GetInventory(Product.Shampoo));
  }

  private Store CreateStoreWithInventory(Product product, int quantity) {
    Store store = new Store();
    store.AddInventory(product, quantity);
    return store;
  }

  private state Customer CreateCustomer() {
    return new Customer();
  }
}
```

공통 초기화 코드를 비공개 팩토리 메서드로 추출해 테스트 코드를 짧게 하면서, 동시에 테스트 진행 사항에 대한 전체 맥락을 유지할 수 있다. 게다가 비공개 메서드를 충분히 일반화하는 한 테스트가 서로 결합되지 않는다. 즉, 테스트에 픽스처를 어떻게 생성할지 지정할 수 있다.

```cs
Store store = CreateStoreWithInventory(Product.Shampoo, 10);
```

생성된 상점의 특성을 이해하려고 팩토리 메서드 내부를 알아볼 필요가 없기 때문에 가독성이 좋다. 다른 테스트에서도 이 메서드를 사용할 수 있기 때문에 재사용도 가능하다.   

테스트 픽스처 재사용 규칙에 한 가지 예외가 있다. 모든 테스트에, 또는 거의 대부분의 테스트에 사용하는 경우 생성자 픽스처를 인스턴스화할 수도 있다. 데이터베이스와 작동하는 통합 테스트가 종종 여기에 해당한다. 이러한 모든 테스트는 데이터베이스 연결이 필요하며, 이 연결을 한 번 초기화한 다음 어디에서나 재사용할 수 있다. 그러나 기초 클래스를 둬서 개별 테스트 클래스가 아니라 클래스 생성자에서 데이터베이스 연결을 초기화하는 것이 더 합리적이다. 기초 클래스의 공통 초기화 코드 예로 다음 예제를 참조하자.

```cs
public class CustomerTests : IntegrationTests {
  [Fact]
  public void Purchase_succeeds_when_enough_inventory() {
    /* 여기서 _database 사용 */
  }
}

public abstract class IntegrationTests : IDisposable {
  protected readonly Database _database;

  protected IntegrationTests() {
    _database = new Database();
  }

  public void Dispose() {
    _database.Dispose();
  }
}
```

`CustomerTests`가 생성자 없이 작성됐다는 것을 알 수 있다. `IntegrationTests` 기초 클래스 상속을 통해 `_database` 인스턴스에 접근한다.
