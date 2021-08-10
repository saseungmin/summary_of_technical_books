# 🌈 Chapter 8: 의존성 관리하기
- 협력은 필수적이지만 과도한 협력은 설계를 곤경에 빠트릴 수 있다. 협력은 객체가 다른 객체에 대해 알것을 강요한다.
- 다른 객체와 협력하기 위해서는 그런 객체가 존재한다는 사실을 알고 있어야 한다. 객체가 수신할 수 있는 메시지에 대해서도 알고 있어야 한다. 이런 지식이 객체 사이의 의존성을 낳는다.

## 📚 의존성 이해하기

### 🎈 변경과 의존성
- 의존성은 실행 시점과 구현 시점에 서로 다른 의미를 가진다.
  - 실행 시점: 의존하는 객체가 정상적으로 동작하기 위해서는 실행 시에 의존 대상 객체가 반드시 존재해야 한다.
  - 구현 시점: 의존 대상 객체가 변경될 경우 의존하는 객체도 함께 변경된다.
- 다음은 `PeriodCondition` 클래스의 `isSatisfiedBy` 메서드는 `Screening` 인스턴스에게 `getStartTime` 메시지를 전송한다.

```java
public class PeriodCondition implements DiscountCondition {
  private DayOfWeek dayOfWeek;
  private LocalTime startTime;
  private LocalTime endTime;

  //...

  public boolean isSatisfiedBy(Screening screening) {
    return screening.getStartTime().getDayOfWeek().equals(dayOfWeek) &&
      startTime.compareTo(screening.getStartTime().toLocalTime()) <= 0 &&
      endTime.compareTo(screening.getStartTime().toLocalTime()) >= 0;
  }
}
```

- 실행 시점에 `PeriodCondition`의 인스턴스가 정상적으로 동작하기 위해서는 `Screening`의 인스턴스가 존재해야 한다. 만약 `Screening`인스턴스가 존재하지 않으면 예상했던 대로 동작하지 않을 것이다.
- 이처럼 어떤 객체가 예정된 작업을 정상적으로 수행하기 위해 다른 객체를 필요로 하는 경우 두 객체 사이에 의존성이 존재한다고 말한다. 의존성은 방향성을 가지며 항상 단방향이다.
- 이 경우 `PeriodCondition`은 `Screening`에 의존한다.
- 두 요소 사이의 의존성은 의존되는 요소가 변경될 때 의존하는 요소도 함께 변경될 수 있다는 것을 의미한다. 따라서 의존성은 변경에 의한 영향의 전파 가능성을 암시한다.

### 🎈 의존성 전이
- 의존성은 전이될 수 있는데, `Screening`의 코드를 살펴보면 `Screening`이 `Movie`, `LocalDateTime`, `Customer`에 의존한다. 의존성 전이가 의미하는 것은 `PeriodCondition`이 `Screening`에 의존할 경우 `PeriodCondition`은 `Screening`이 의존하는 대상에 대해서도 자동적으로 의존하게 된다 것이다.
- 의존성은 함께 변경될 수 있는 *가능성*을 의미하기 때문에 모든 경우에 의존성이 전이되는 것은 아니다. 의존성이 실제로 전이될지 여부는 변경의 방향과 캡슐화의 정도에 따라 달라진다. 만걍 `Screening`이 의존하고 있는 어떤 요소의 구현이나 인터페이스가 변경되는 경우에 내부 구현을 효과적으로 캡슐화하고 있다면 `Screening`에 의존하고 있는 `PeriodCondition`까지는 변경이 전파되지 않을 것이다.
- 의존성은 전이될 수 있기 때문에 의존성의 종류를 **직접 의존성**과 **간접 의존성**으로 나누기도 한다. 직접 의존성이란 한 요소가 다른 요소에 집접 의존하는 경우를 가리킨다. (`PeriodCondition`이 `Screening`에 의존, 코드에 명시적으로 들어난다.) 간접 의존성이란 직접적인 관계는 존재하지 않지만 의존성 전이에 의해 영향이 전파되는 경우를 가리킨다. (코드 안에 명시적으로 드러나지 않느다.)

### 🎈 런타임 의존성과 컴파일타임 의존성
- 먼저 런타임과 컴파일타임의 의미를 이해해야 한다.
- 런타임은 애플리케이션 실행되는 시점을 가리킨다.
- 컴파일타임은 일반적으로 작성된 코드를 컴파일하는 시점을 가리키지만 문맥에 따라서는 코드 그 자체를 가리키기도 한다.
- 컴파일타임 의존성이라는 용어가 중요하게 생각하는 것은 시간이 아니라 우리가 작성한 코드의 구조이다. 또한 동적 타입 언어의 경우에는 컴파일타임이 존재하지 않기 때문에 컴파일타임 의존성이라는 용어를 실제로 컴파일이 수행되는 시점으로 이해하면 의미가 모호해질 수 있다.
- 객체지향 애플리케이션에서 런타임의 주인공은 객체다. 따라서 런타임 의존성이 다루는 주제는 객체 사이의 의존성이다. 반면 코드 과점에서 주인공은 클래스다. 따라서 컴파일타임 의존성이 다루는 주제는 클래스 사이의 의존성이다.
- 이전의 영화 예매 시스템에서 `Movie`는 비율 할인 정책과 금액 할인 정책 모두를 적용하게 설계했다. 이때 Movie는 추상 클래스인 `DiscountPolicy`에 의존하도록 클래스 관계를 설계했다. `DiscountPolicy`는 `AmountDiscountPolicy`와 `PercentDiscountPolicy`가 상속받았다. 
- 여기서 중요한 것은 `Movie`는 `AmountDiscountPolicy`나 `PercentDiscountPolicy` 클래스로 향하는 어떤 의존성도 존재하지 않는다는 것이다. 오직 추상 클래스인 `DiscountPolicy` 클래스에만 의존한다.
- 하지만 런타임 의존성을 살펴보면 금액 할인 정책을 적용하기 위해서는 `AmountDiscountPolicy`의 인스턴스와 협력해야하고 비율 할인 정책을 적용하기 위해서는 `PercentDiscountPolicy`의 인스턴스와 협력해야 한다.
- 코드를 작성하는 시점의 `Movie` 클래스는 이 두 클래스의 존재에 대해 전혀 알지 못하지만 실행 시점의 `Movie` 인스턴스는 `AmountDiscountPolicy` 인스턴스와 `PercentDiscountPolicy` 인스턴스와 협력할 수 있어야 한다.
- 이 두 클래스의 인스턴스와 함께 협력할 수 이쎄 만드는 더 나은 방법은 `Movie`가 두 클래스 중 어떤 것도 알지 못하게 만드는 것으로 `DiscountPolicy`라는 추상 클래스에 의존하도록 만들고 이 컴파일타임 의존성을 실행 시에 `PercentDiscountPolicy` 인스턴스나 `AmountDiscountPolicy` 인스턴스에 대한 런타임 의존성으로 대체해야 한다.
- 어떤 클래스의 인스턴스가 다양한 클래스의 인스턴스와 협력하기 위해서는 협력할 인스턴스의 구체적인 클래스를 알아서는 안 된다. 실제로 협력할 객체가 어떤 것인지는 런타임에 해결해야 한다.
- 컴파일타입 구조와 런타임 구조 사이의 거리가 멀면 멀수록 설계가 유연해지고 재사용 가능해진다.

### 🎈 컨텍스트 독립성
- 클래스가 특정한 문맥에 강하게 결합될수록 다른 문맥에서 사용하기는 더 어려워진다. 클래스가 사용될 특정한 문맥에 대해 최소한의 가정만으로 이뤄져 있다면 다른 문맥에서 재사용하기가 더 수월해진다. 이를 **컨텍스트 독립성**이라고 부른다.
- 설계가 유연해지기 위해서는 가능한 한 자신이 실행될 컨텍스트에 대한 구체적인 정보를 최대한 적게 알아야 한다.


### 🎈 의존성 해결하기
- 컴파일타임 의존성은 구체적인 런타임 의존성으로 대체돼야 한다.
- 컴파일타임 의존성을 실행 컨텍스트에 맞는 적절한 런타임 의존성으로 교체하는 것을 **의존성 해결**이라고 부른다. 의존서을 해결하기 위해서는 일반적으로 다음과 같은 세 가지 방법을 사용한다.
  - 객체를 생성하는 시점에 생성자를 통해 의존성 해결
  - 객체 생성 후 `setter` 메서드를 통해 의존성 해결
  - 메서드 실행 시 인자를 이용하여 의존성 해결
- 다음과 같이 `Movie` 객체를 생성할 때 `AmountDiscountPolicy`나 `PercentDiscountPolicy`의 인스턴스를 `Movie`의 생성자에 인자로 전달하면 된다.

```java
Movie avatar = new Movie("아바타",
  Duration.ofMinutes(120),
  Money.wons(10000),
  new AmountDiscountPolicy(...)
);

Movie starWars = new Movie("스타워즈",
  Duration.ofMinutes(180),
  Money.wons(11000),
  new PercentDiscountPolicy(...)
);
```
- 이 경우 `Movie`는 생성자를 정의한다.

```java
public class Movie {
  public Movie(String title, Duration runningTime, Money fee, DiscountPolicy discountPolicy) {
    // ...
    this.discountPolicy = discountPolicy;
  }
}
```

- `Movie` 인스턴스를 생성한 후에 메서드를 이용해 의존성을 해결할 수도 있다.

```java
Movie avatar = new Movie(...);
avatar.setDiscountPolicy(new AmountDiscountPolicy(...));
```

- 이 경우 `setter` 메서드를 제공해야 한다.

```java
public class Movie {
  public void setDiscountPolicy (DiscountPolicy discountPolicy) {
    this.discountPolicy = discountPolicy;
  }
}
```

- `setter` 메서드를 이용하는 방법은 실행 시점에 의존 대상이 변경할 수 있기 때문에 설계에 좀 더 유연하게 만들 수 있다. 단점은 객체가 생성된 후에 협력에 필요한 의존 대상을 설저하기 때문에 객체를 생성하고 의존 대상을 설정하기 전까지는 객체의 상태가 불완전할 수 있다는 점이다.
- 때문에 더 좋은 방법은 생성자 방식과 `setter` 방식을 혼합하는 것이다. 항상 객체를 생성할 때 의존성을 해결해서 완전한 상태의 객체를 생성한 후, 필요에 따라 `setter` 메서드를 이용해 의존 대상을 변경할 수 있게 할 수 있다.

```java
Movie avatar = new Movie("아바타",
  Duration.ofMinutes(120),
  Money.wons(10000),
  new AmountDiscountPolicy(...)
);

// ...

avatar.setDiscountPolicy(new AmountDiscountPolicy(...));
```

- `Movie`가 항상 할인 정책을 알 필요까지는 없고 가격을 계산할 때만 일시적으로 알아도 무바하다면 메서드의 인자를 이용해 의존성을 해결할 수도 있다.

```java
public class Movie {
  public Money calculateMovieFee(Screening screening, DiscountPolicy discountPolicy) {
    return fee.minus(discountPolicy.calculateDiscountAmount(screening));
  }
}
```

## 📚 유연한 설계

### 🎈 의존성과 결합도
- 객체들이 협력하기 위해서는 서로의 존재와 수행 가능한 책임을 알아야 한다. 이런 지식들이 객체 사이의 의존성을 낳는다. 따라서 모든 의존성이 나쁜 것은 아니다. 하지만 의존성이 과하면 문제가 될 수 있다.
- 의존성은 협력을 위해 반드시 필요한 것이다. 단지 바람직하지 못한 의존성이 문제일 뿐이다.
- 여기서 바람직한 의존성은 **재사용성**과 관려이 있는데 어떤 의존성이 다양한 환경에서 클래스를 재사용할 수 없도록 제한한다면 그 의존성은 바람직하지 못한 것이다. 다시 말해 컨텍스트에 독립적인 의존성은 바람직한 의존성이고 특정한 컨텍스트에 강하게 결합된 의존성은 바람직하지 않은 의존성이다.
- 다른 환경에서 재사용하기 위해 내부 구현을 변경하게 만드는 모든 의존성은 바람직하지 않은 의존성이다. 바람직한 의존성이란 컨텍스트에 독립적인 의존성을 의미하며 다양한 환경에서 재사용될 수 있는 가능성을 열어놓는 의존성을 의미한다.
- 어떤 두 요소 사이에 존재하는 의존성이 바람직할 때 두 요소가 **느슨한 결합도** 또는 **약한 결합도**를 가진다고 말한다. 반대로 두 요소 사이의 의존성이 바람직하지 못할 때 **단단한 결합도** 또는 **강한 결합도**를 가진다고 말한다.

### 🎈 지식이 결합을 낳는다.
- 결합도의 정도는 한 요소가 자신이 의존하고 있는 다른 요소에 대해 알고 있는 정보의 양으로 결정된다. 만약 많은 정보를 알고 있으면 강하게 결합되고 반대로 적은 정보를 알고 있으면 약하게 결합된다.
- 서로에 대해 알고 있는 지식의 양이 결합도를 결정한다.
- 더 많이 알고 있다는 것은 더 적은 컨텍스트에서 재사용 가능하다는 것을 의미한다. 결합도를 느슨하게 유지하려면 협력하는 대상에 대해 더 적게 알아야 한다. 또한, 협력하는 대상에 대해 필요한 정보 외에는 최대한 감추는 것이 중요하다.
- 가장 효과적인 방법은 추상화를 사용하는 것이다.

### 🎈 추상화에 의존하라
- 추상화를 사용하면 현재 다루가 있는 문제를 해결하는 데 불필요한 정보를 감출 수 있다. 따라서 대상에 대해 알아야 하는 지식의 양을 줄일 수 있기 때문에 결합도를 느슨하게 유지할 수 있다.
- 일반적으로 추상화와 결합도의 관점에서 의존 대상을 다음과 같이 구분하는 것이 유용하고 목록에서 아래쪽으로 갈수록 클라이언트가 알아야 하는 지식의 양이 적어지기 때문에 결합도가 느슨해진다.
  - 구체 클래스 의존성
  - 추상 클래스 의존성
  - 인터페이스 의존성
- 여기서 중요한 것은 실행 컨텍스트에 대해 알아야 하는 정보를 줄일수록 결합도가 낮아진다는 것이다.

### 🎈 명시적인 의존성
- 아래 코드는 한 가지 실수로 인해 결합도가 불필요하게 높아졌다.

```java
public class Movie {
  // ...
  private DiscountPolicy discountPolicy;

  public Movie(String title, Duration runningTime, Money fee) {
    // ...
    this.discountPolicy = new AmountDiscountPolicy(...);
  }
}
```

- `discountPolicy`는 `DiscountPolicy` 타입으로 선언돼 있지만 생성자에서 구체 클래스인 `AmountDiscountPolicy`의 인스턴스가 직접 생성해서 대입하고 있다. 따라서 `Movie`는 추상 클래스인 `DiscountPolicy` 뿐만 아니라 구체 클래스인 `AmountDiscountPolicy`에도 의존하게 된다.
- 해결하기 위해서 클래스 안에서 구체 클래스에 대한 모든 의존성을 제거해야만 한다.
- 다음은 생성자를 사용해 의존성을 해결하는 경우를 나타낸 것이다.

```java
public class Movie {
  // ...
  private DiscountPolicy discountPolicy;

  public Movie(String title, Duration runningTime, Money fee, DiscountPolicy discountPolicy) {
    // ...
    this.discountPolicy = discountPolicy;
  }
}
```

- 생성자의 인자로 `DiscountPolicy`의 자식 클래스 중 어떤 것이라도 전달할 수 있다. 따라서 런타임에 `AmountDiscountPolicy`의 인스턴스나 `PercentDiscountPolicy`의 인스턴스를 선택적으로 전달할 수 있다.
- 의존성의 대상으로 생성자의 인자로 전달받는 방법과 생성자 안에서 직접 생성하는 방법 사이의 가장 큰 차이점은 퍼블릭 인터페이스를 통해 할인 정책을 설정할 수 있는 방법을 제공하는지 여부다. 생성자의 인자로 선언하는 방법은 `Movie`가 `DiscountPolicy`에 의존한다는 사실을 `Movie`의 퍼블릭 인터페이스에 드러내는 것이다. 이를 **명시적인 의존성**이라고 부른다.
- 반면 `Movie`내부에서 `AmountDiscountPolicy`의 인스턴스를 직접 생성하는 방식은 `Movie`가 `DiscountPolicy`에 의존한다는 사실을 감춘다. 다시 말해 의존성이 퍼블린 인터페이스에 표현되지 않는다. 이를 **숨겨진 의존성**이라고 부른다. 의존성이 명시적이지 않으면 의존성을 파악하기 위해 배구 구현을 직접 살펴볼 수밖에 없다.
- 의존성을 명시적으로 드러내면 코드를 직접 수정해야 하는 위험을 피할 수 있다. 실행 컨텍스트에 적절한 의존성을 선택할 수 있기 때문이다.
- 명시적인 의존성을 사용해야만 퍼블릭 인터페이스를 통해 컴파일타임 의존성을 적절한 런타임 의존성으로 교체할 수 있다.

### 🎈 new는 해롭다
- `new`를 잘못 사용하면 클래스 사이의 결합도가 극단적으로 높아진다. 결합도 측면에서 `new`가 해로운 이유는 크게 두 가지이다.
  - `new` 연산자를 사용하기 위해서는 구체 클래스의 이름을 직접 기술해야 한다. 따라서 `new`를 사용하는 클라이언트는 추상화가 아닌 구체 클래스에 의존할 수밖에 없기 때문에 결합도가 높아진다.
  - `new` 연산자는 생성하려는 구체 클래스뿐만 아니라 어떤 인자를 이용해 클래스의 생성자를 호출해야 하는지도 알아야 한다. 따라서 `new`를 사용하면 클라이언트가 알아야 하는 지식의 양이 늘어나기 때문에 결합도가 높아진다.
- 구체 클래스에 직접 의존하면 결합도가 높아진다. 여기에 `new`는 문제를 더 크게 만드는데 클라이언트는 구체 클래스를 생성하는 데 어떤 정보가 필요한지에 대해서도 알아야 하기 때문이다.
- `new`는 결합도를 높이기 떄문에 해롭다. 협력할 클래스의 인스턴스를 생성하기 위해 어떤 인자들이 필요하고 그 인자들을 어떤 순서로 사용해야 하는지에 대한 정보도 노출시킬뿐만 아니라 인자로 사용되는 구체 클래스에 대한 의존성을 추가한다.
- 해결 방법은 인스턴스를 생성하는 로직과 생성된 인스턴스를 사용하는 로직을 분리하는 것이다.
- 외부에서 인스턴스를 전달받는 방법은 의존성 해결 방법과 동일하게 생성자의 인자로 전달하거나, `setter` 메서드를 사용하거나, 실행 시에 메서드의 인자로 전달하면 된다.
- 사용과 생성의 책임을 분리하고, 의존성을 생성자에 명시적으로 드러내고, 구체 클래스가 아닌 추상 클래스에 의존하게 함으로써 설계를 유연하게 만들 수 있다. 그리고 그 출발은 객체를 생성하는 책임을 객체 내부가 아니라 클라이언트로 옮기는 것에 시작헀다는 점을 기억하라.

### 🎈 가끔은 생성해도 무방하다
- 클래스 안에서 객채의 인스턴스를 직접 생성하는 방식이 유용한 경우도 있다. 주로 협력하는 개본 객체를 설정하고 싶은 경우가 여기에 속한다.
- 예를 들어, `Movie`가 대부분의 경우에는 `AmountDiscountPolicy`의 인스턴스와 협력하고 가끔씩만 `PercentDiscountPolicy`의 인스턴스와 협력한다고 가정한다. 만약 이 상황에서 모든 경우에 인스턴스를 생성하는 책임을 클라이언트로 옮긴다면 클라이언트들 사이에 중복 코드가 늘어나고 `Movie`의 사용성도 나빠질 것이다.
- 이 문제를 해결하는 방법은 기본 객체를 생성하는 생성자를 추가하고 이 생성자에서 `DiscountPolicy`의 인스턴스를 인자로 받는 생성자를 체이닝하는 것이다.

```java
public class Movie {
  // ...
  private DiscountPolicy discountPolicy;

  public Movie(String title, Duration runningTime) {
    // 두 번째 생성자 호출
    // 생성자가 체인처럼 연결
    this(title, runningTime, fee, new AmountDiscountPolicy(...));
  }

  public Movie(String title, Duration runningTime, Money fee, DiscountPolicy discountPolicy) {
    // ...
    this.discountPolicy = discountPolicy;
  }
}
```

- 이 방법으로 메서드를 오버로딩하는 경우에도 사용할 수 있다.

```java
public class Movie {
  public Money calculateMovieFee(Screening screening) {
    return calculateMovieFee(screening, new AmountDiscountPolicy(...));
  }

  public Money calculateMovieFee(Screening screening, DiscountPolicy discountPolicy) {
    return fee.minus(discountPolicy.calculateDiscountAmount(screening));
  }
}
```

- 구체 클래스에 의존하게 되더라도 클래스의 사용성이 더 중요하다면 결합도를 높이는 방향으로 코드를 작성할 수 있다. 그럼에도 가급적 구체 클래스에 대한 의존성을 제거할 수 있는 방법을 찾아보는 것이 좋다.

### 🎈 표준 클래스에 대한 의존은 해롭지 않다
- 자바라면 JDK에 포함된 표준 클래스 즉, 변경될 확률이 거의 없는 클래스는 의존성에 문제가 되지 않는다.
- 이런 클래스들에 대해서는 구체 클래스에 의존하거나 직접 인스턴스를 생성하더라도 문제가 없다.

```java
public abstract class DiscountPolicy {
  private List<DiscountCondition> conditions = new ArrayList<>();

  public void switchConditions(List<DiscountCondition> conditions) {
    this.conditions = conditions;
  }
}
```

### 🎈 컨텍스트 확장하기
- 다음 예제에서는 다른 컨텍스트에서 `Movie`를 확장해서 재사용하는 두 가지 예를 본다. 하나는 할인 혜택을 제공하지 않는 영화이고 다른 하나는 다수의 할인 정책을 중복해서 적용하는 영화이다.
- 첫 번째는 할인 혜택을 제공하지 않는 영화의 예매 요금을 계산하는 경우다.
- 할인 정책이 존재하지 않는다는 사실을 할인 정책의 한 종류로 간주하여 `NoneDiscountPolicy` 클래스를 추가하고 `DiscountPolicy`의 자식 클래스로 만든다.

```java
public class NoneDiscountPolicy extends DiscountPolicy {
  @Override
  protected Money getDiscountAmount(Screening screening) {
    return Money.ZERO;
  }
}
```

- 이제 다음과 같이 `NoneDiscountPolicy`의 인스턴스를 `Movie`의 생성자에 전달한다.

```java
Movie avatar = new Movie("아바타",
  Duration.ofMinutes(120),
  Money.wons(10000),
  new NoneDiscountPolicy()
);
```

- 두 번째 예는 중복 적용이 가능한 할인 정책을 구현하는 것이다. (금액 할인 정책과 비율 할인 정책의 혼합 적용)
- 이 문제도 `NoneDiscountPolicy`와 같은 방법으로 해결할 수 있는데 중복 할인 정책을 할인 정책의 한 가지로 간주한다.

```java
public class OverlappedDiscountPolicy extends DiscountPolicy {
  private List<DiscountPolicy> discountPolicies = new ArrayList<>();

  public OverlappedDiscountPolicy(DiscountPolicy ...discountPolicies) {
    this.discountPolicies = Arrays.asList(discountPolicies);
  }

  @Override
  protected Money getDiscountAmount(Screening screening) {
    Money result = Money.ZERO;

    for(DiscountPolicy each : discountPolicies) {
      result = result.plus(each.calculateDiscountAmount(screening));
    }

    return result;
  }
}
```

- 이제 `OverlappedDiscountPolicy`의 인스턴스를 생성해서 `Movie`에 전달하는 것만으로도 중복 할인을 쉽게 적용할 수 있다.

```java
Movie avatar = new Movie("아바타",
  Duration.ofMinutes(120),
  Money.wons(10000),
  new OverlappedDiscountPolicy(
    new AmountDiscountPolicy(...),
    new PercentDiscountPolicy(...)
  )
);
```

- 설계를 유연하게 민들 수 있었던 이유는 `Movie`가 `DiscountPolicy`라는 추상화에 의존하고, 생성자를 통해 `DiscountPolicy`에 대한 의존성을 명시적으로 드러냈으며, `new`와 같이 구체 클래스를 직접적으로 다뤄야 하는 책임을 `Movie`외부로 옮겼기 때문이다.

### 🎈 조합 가능한 행동
- 어떤 객체와 협력하느냐에 따라 객체의 행동이 달라지는 것은 유연하고 재사용 가능한 설계가 가진 특징이다.
- 유연하고 재사용 가능한 설계는 응집도 높은 책임들을 가진 작은 객체들을 다양한 방식으로 연결함으로써 애플리케이션의 기능을 쉽게 확장할 수 있다.
- 유연하고 재사용 가능한 설계는 객체가 어떻게(how) 하는지를 나열하는 것이 아니라 객체들의 조합을 통해 무엇(what)을 하는지를 표현하는 클래스들로 구성된다. 따라서 클래스의 인스턴스를 생성하는 코드를 보는 것만으로도 객체가 어떤 일을 하는지를 쉽게 파악할 수 있다. 다시 말해 선언적으로 객체의 행동을 정의할 수 있는 것이다.
- 유연하고 재사용 가능한 설계는 작은 객체들의 행동을 조합함으로써 새로운 행동을 이끌어낼 수 있는 설계다. 훌륭한 객체지향 설계란 객체가 어떻게 하는지를 표현하는 것이 아니라 객체들의 조합을 선언적으로 표현함으로써 객체들이 무엇을 하는지를 표현하는 설계다.
- 이러한 설계를 창조하는 데 있어서의 핵심은 의존성을 관리하는 것이다.
