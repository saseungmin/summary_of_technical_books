---
sidebar_position: 3
---

# 🌈 Chapter 2: 객체지향 프로그래밍

## 📚 영화 예메 시스템
  
### 🎈 요구사항 살펴보기
- 온라인 영화 예매 시스템
- 영화: 영화에 대한 기본 정보를 표현. (제목, 상영시간, 가격 정보)
- 상영: 실제로 관객들이 영화를 관람하는 사건을 표현 (상영 일자, 시간, 순번)
- 하나의 영화는 하루 중 다양한 시간대에 걸쳐 한 번 이상 상영
- 특정한 조건을 만족하는 예매자는 요금을 할인받을 수 있다. 
- 할인액을 결정하는 두 가지 규칙
  - 할인 조건: 가격의 할인 여부를 결정하며 순서 조건과 기간 조건이 있다.
  - 할인 정책: 할인 요금을 결정하며 금액 할인 정책과 비율 할인 정책이 있다.
  - 영화별로 하나의 할인 정책만 할당할 수 있다. 할인 정책을 지정하지 않는 것도 가능하다.
  - 할인 조건은 다수의 할인 조건을 함께 지정가능하며, 순서 조건과 기간 조건을 섞는 것도 가능하다.
- 할인을 적용하기 위해 할인 조건과 할인 정책을 함께 조합해서 사용한다.
- 할인 정책은 1인을 기준으로 책정

## 📚 객체지향 프로그래밍을 향해

### 🎈 협력, 객체, 클래스
- 객체지향은 객체를 지향하는 것으로 클래스를 먼저 결정하면 안된다.
- 어떤 클래스가 필요한지를 고민하기 전에 어떤 객체들이 필요한지 고민해야 한다. 클래스는 상태와 행동을 공유하는 객체들을 추상화한 것이다. 따라서 어떤 객체들이 어떤 상태와 행동을 가지는지를 먼저 결정해야 한다.
- 객체는 독립적인 존재가 아니라  기능을 구현하기 위해 협력하는 공동체의 일원으로 봐야한다. 다른 객체에게 도움을 주거나 의존하면서 살아가는 협력적인 존재이다.

### 🎈 도메인의 구조를 따르는 프로그램 구조
- 문제를 해결하기 위해 사용자가 프로그램을 사용하는 분야를 **도메인**이라고 부른다.
- 클래스의 이름은 대응되는 도메인 개념의 이름과 동일하거나 적어도 유사하게 지어야 한다. (영화는 `Movie`, 상영은 `Screening`..)

### 🎈 클래스 구현하기
- `Screening` 클래스는 사용자들이 예매하는 대상인 상영을 구현한다. `Screening`은 상영할 영화, 순번, 상영 시작 시간을 인스턴스 변수로 포함한다.

```java
public class Screening {
  private Movie movie;
  private int sequence;
  private LocalDateTime whenScreened;

  public Screening(Movie movie, int sequence, LocalDateTime whenScreened) {
    this.movie = movie;
    this.sequence = sequence;
    this.whenScreened = whenScreened;
  }

  public LocalDateTime getStartTime() { // 상영 시작 시간
    return whenScreened;
  }

  public boolean isSequence(int sequence) { // 순번의 일치 여부 검사
    return this.sequence == sequence;
  }

  public Money getMovieFee() { // 기본 요금을 반환
    return movie.getFee();
  }
}
```

- 클래스는 내부와 외부로 구분되며 훌륭한 클래스를 설계하기 위한 핵심은 어떤 부분을 외부에 공개하고 어떤 부분을 감출지를 결정하는 것이다.
- `Screening`처럼 객체의 속성에 직접 접근을 막고 적절한 `public` 메서드를 통해서만 내부 상태를 변경할 수 있게 해야 한다.
- **경계의 명확성이 객체의 자율성을 보장하기 때문에 내부와 외부를 구분해야 한다.** 또한, 프로그래머에게 구현의 자유를 제공한다.

#### 🐶 자율적인 객체
- 객체는 **상태**와 **행동**을 함께 가지는 복합적인 존재이다.
- 겍체는 스스로 판단하고 행동하는 **자율적인 존재**이다.
- 객체 지향은 객체라는 단위 안에 데이터와 기능을 한 덩어리로 묶음으로써 문제 영역의 아이디어를 적절하게 표현할 수 있게 했다. 이처럼 데이터와 기능을 개체 내부로 함께 묶는 것을 **캡슐화**라고 한다.
- 객체지향 프로그래밍 언어는 상태와 행동을 캡슐화하고 더 나아가 외부에서의 접근을 통제할 수 있는 **접근 제어** 메커니즘도 함께 제공한다. (접근 제어를 위해 `public`, `private`과 같은 **접근 수정자**)
- 접근을 통제하는 이유는 **객체를 자율적인 존재로 만들기 위해서이다.**
- 캡슐화와 접근 제어는 객체를 두 부분으로 나눈다. 하나는 외부에서 접근가능한 부분으로 이를 **퍼블릭 인터페이스**라고 부른다.
- 다른 하나는 위부에서는 접근 불가능하고 오직 내부에서만 접근 가능한 부븐으로 이를 **구현**이라고 부른다. (**인터페이스와 구현의 분리 원칙**는 객체지향의 핵심 원칙)

#### 🐶 프로그래머의 자유
- 프로그래머의 역할은 **클래스 작성자**와 **클라이언트 프로그래머**로 구분한다.
- 클래스 작성자는 새로운 데이터 타입을 프로그램에 추가하고, 클라이언트 프로그래머는 클래스 작성자가 추가한 데이터 타입을 사용한다.
- 클래스 작성자는 클라이언트 프로그래머에게 필요한 부분만 공개하고 나머지는 꽁꽁 숨겨야 한다. (**구현 은닉**)
- 접근 제어 메커니즘은 클래스의 내부와 외부를 명확하게 경계 지을 수 있게 하는 동시에 클래스 작성자가 내부 구현을 은닉할 수 있게 해준다.
- 구현 은닉의 장점은 클라이언트 프로그래머가 내부 구현을 모르고 인터페이스만 알고 있어도 사용가능하고, 클래스 작성자는 외부에 미치는 영향을 걱정하지 않고도 내부 구현을 마음대로 변경할 수 있다.
- 변경 가능성이 있는 세부적인 구현 내용을 `private` 영역 안에 감춤으로써 변경으로 인한 혼란을 최소화할 수 있다.

### 🎈 협력하는 객체들의 공동체
- 영화를 예매하는 기능을 구현하는 메서드를 살펴보자.

```java
public class Screening {
  // 영화를 예매한 후 예매 정보를 담고 있는 Reservation의 인스턴스를 생성해서 반환한다.
  // reserve(예매자 정보, 인원수)
  // calculateFee는 요금을 계산한 후 그 결과를 전달한다.
  public Reservation reserve(Customer customer, int audienceCount) {
    return new Reservation(customer, this, calculateFee(audienceCount), audienceCount);
  }

  private Money calculateFee(int audienceCount) {
    // calculateMovieFee 메서드의 반환 값은 1인당 예매 요금이다.
    return movie.calculateMovieFee(this).times(audienceCount);
  }
}
```

- `Screening`은 전체 예매 요금을 구하기 위해 `calculateMovieFee` 메서드의 반환 값에 인원 수인 `audienceCount`를 곱한다.
- `Money`는 금액과 관련된 다양한 계산을 구현하는 클래스이다.

```java
public class Money {
  public static final Money ZERO = Money.wons(0);

  private final BigDecimal amount;

  public static Money wons(long amount) {
    return new Money(BigDecimal.valueOf(amount));
  }

  //생략..
  // Money.java 참고.. 
}
```

- `Reservation` 클래스이다.

```java
public class Reservation {
  private Customer customer; // 고객
  private Screening screening; // 상영 정보
  private Money fee; // 예매 요금
  private int audienceCount; // 인원 수

  public Reservation(Customer customer, Screening screening, Money fee, int audienceCount) {
    this.customer = customer;
    this.screening = screening;
    this.fee = fee;
    this.audienceCount = audienceCount;
  }
}
```

- 영화를 에매하기 위해 `Screening`, `Movie`, `Reservation` 인스턴스들은 서로의 메서드를 호출하며 상호작용한다. 이처럼 시스템의 어떤 기능을 구현하기 위해 객체들 사이에 이뤄지는 상호작용을 **협력**(**Collaboration**)이라고 부른다.
- 객체지향 프로그램을 작성할 때는 먼저 협력의 관점에서 어떤 객체가 필요한지를 결정하고, 객체들의 공통 상태와 행위를 구현하기 위해 클래스를 작성한다.

### 🎈 협력에 관한 짧은 이야기
- 객체는 다른 객체의 인터페이스에 공개된 행동을 수행하도록 **요청**할 수 있다.
- 요청을 받은 객체는 자율적인 방법에 따라 요청을 처리한 후 **응답**한다.
- 객체가 다른 객체와 상호작용할 수 있는 유일한 방법은 **메시지를 전송**하는 것뿐이다.
- 다른 객체에게 요청이 도착할 때 해당 객체가 **메시지를 수신**했다고 이야기 한다.
- 메시지를 수신한 객체는 스스로의 결정에 따라 자율적으로 메시지를 처리할 방법을 결정하는데 이런 방버블 **메서드**라고 한다.
- 메시지와 메서드를 구분하는 것은 중요한데 **다형성**의 개념에서 시작된다.

## 📚 할인 요금 구하기

### 🎈 할인 요금 계산을 위한 협력 시작하기
  
```java
public class Movie {
  private String title; // 제목
  private Duration runningTime; // 상영시간
  private Money fee; // 기본 요금
  private DiscountPolicy discountPolicy; // 할인 정책

  public Movie(String title, Duration runningTime, Money fee, DiscountPolicy discountPolicy) { // 생성자
    this.title = title;
    this.runningTime = runningTime;
    this.fee = fee;
    this.discountPolicy = discountPolicy;
  }

  public Money getFee() {
    return fee;
  }

  public Money calculateMovieFee(Screening screening) {
    return fee.minus(discountPolicy.calculateDiscountAmount(screening));
  }
}
```

- `calculateMovieFee` 메서드는 `discountPolicy`에 `calculateDiscountAmount` 메시지를 전송해 할인 요금을 반환받는다. `Movie`는 기본요금인 `fee`에서 반환된 할인 요금을 차감한다.
- 이 코드에서 객체지향에서 중요한 두 개념이 숨겨져 있는데 하나는 **상속**이고 다른 하나는 **다형성**이다. 그리고 그 기반에는 **추상화**라는 원리가 숨겨져 있다.

### 🎈 할인 정책과 할인 조건
- 할인 정책은 금액 할인 정책인 `AmountDiscountPolicy` 클래스와 비율 할인 정책인 `PercentDiscountPolicy`라는 클래스로 구분된다.
- 두 클래스는 대부분ㅇ늬 코드가 유사하고 할인 요금을 계산하는 방식이 다르기 때문에 중복 코드를 제거하기 위해 부모 클래스인 `DiscountPolicy`를 사용하여 중복 코드를 둘 수 있다.
- `AmountDiscountPolicy`와 `PercentDiscountPolicy`가 이 클래스를 상속받게 된다. `DiscountPolicy`의 인스턴스 생성할 필요가 없기 때문에 **추상 클래스**로 구현한다.

```java
public abstract class DiscountPolicy {
  private List<DiscountCondition> conditions = new ArrayList<>();

  public DiscountPolicy(DiscountCondition ... conditions) {
    this.conditions = Arrays.asList(conditions);
  }

  public Money calculateDiscountAmount(Screening screening) {
    for (DiscountCondition each : conditions) {
      if (each.isSatisfiedBy(screening)) {
        return getDiscountAmount(screening);
      }
    }

    return Money.ZERO;
  }

  abstract protected Money getDiscountAmount(Screening screening);
}
```

- `DiscountCondition`의 리스트인 `conditions`를 인스턴스 변수로 가지기 때문에 하나의 할인 정책은 여러 개의 할인 조건을 포함할 수 있다.
- `calculateDiscountAmount` 메서드는 전체 할인 조건에 대해 차례대로 `DiscountCondition`의 `isSatisfiedBy` 메서드를 호출하고 `isSatisfiedBy` 메서드는 인자로 전달된 `Screening`이 할인 조건을 만족시킬 경우에는 `true`를, 만족시키지 못할 경우에는 `false`를 반환한다.
- 하나라도 만족하는 경우에는 추상 메서드인 `getDiscountAmount` 메서드를 호출해서 할인 요금을 계산한다. 만족하는 조건이 없을 때 할인 요금으로 0원을 반환한다.
- 실제 요금을 계산하는 부분은 `DiscountPolicy`를 상속 받는 자식 클래스에서 오버라이딩한 메서드가 실행될 것이다.
- 이처럼 부모 클래스에 기본적인 알고리즘의 흐름을 구현하고 중간에 필요한 처리를 자식 클래스에게 위임하는 디자인 패턴을 **TEMPLATE METHOD** 패턴이라고 부른다.
- `DiscountCondition`은 인터페이스를 이용하여 선언되어 있다. `isSatisfiedBy` 메서드 인자로 전달된 `screening`이 할인이 가능한 경우를 `true`를 반환하고 불가능한 경우는 `false`를 반환한다.

```java
public interface DiscountCondition {
  boolean isSatisfiedBy(Screening screening);
}
```

- 영화 예매 시스템에는 순번 조건과 기간 조건의 두 가지 할인 조건이 존재한다. 두 가지 할인 조건은 각각 `SequenceCondition`과 `PeriodCondition` 클래스로 구현한다.

```java
public class SequenceCondition implements DiscountCondition {
  private int sequence; // 순번

  public SequenceCondition(int sequence) {
    this.sequence = sequence;
  }

  public boolean isSatisfiedBy(Screening screening) {
    return screening.isSequence(sequence); // 상영 순번과 일치할 경우 true, 일치하지 않으면 false
  }
}
```

- `PeriodCondition`은 상영 시작 시간이 특정한 기간 안에 포함되는지 여부를 판다해 할인 여부를 결정한다.

```java
public class PeriodCondition implements DiscountCondition {
  private DayOfWeek dayOfWeek; // 요일
  private LocalTime startTime; // 시작 시간
  private LocalTime endTime; // 종료 시간

  public PeriodCondition(DayOfWeek dayOfWeek, LocalTime startTime, LocalTime endTime) {
    this.dayOfWeek = dayOfWeek;
    this.startTime = startTime;
    this.endTime = endTime;
  }

  // 상영 요일이 dayOfWeek와 같고 상영 시작 시간이 startTime과 endTime 사이에 있을 경우에는 true
  public boolean isSatisfiedBy(Screening screening) {
    return screening.getStartTime().getDayOfWeek().equals(dayOfWeek) &&
      startTime.compareTo(screening.getStartTime().toLocalTime()) <= 0 &&
      endTime.compareTo(screening.getStartTime().toLocalTime()) >= 0;
  }
}
```

- 이제 할인 정책을 구현한다. 할인 조건을 만족할 경우 일정한 금액을 할인해준다.

```java
public class AmountDiscountPolicy extends DiscountPolicy {
  private Money discountAmount;

  public AmountDiscountPolicy(Money discountAmount, DiscountCondition ... conditions) {
    super(conditions);
    this.discountAmount = discountAmount;
  }

  // DiscountPolicy의 getDiscountAmount 메서드를 오버라이딩한다.
  @Override
  protected Money getDiscountAmount(Screening screening) {
    return discountAmount;
  }
}
```

- `PercentDiscountPolicy` 역시 `DiscountPolicy`의 자식 클래스로서 `getDiscountAmount` 메서드를 오버라이딩 한다.
- 할인 비율을 차감한다.

```java
public class PercentDiscountPolicy extends DiscountPolicy {
  private double percent;

  public AmountDiscountPolicy(double percent, DiscountCondition ... conditions) {
    super(conditions);
    this.percent = percent;
  }

  @Override
  protected Money getDiscountAmount(Screening screening) {
    return screening.getMovieFee().times(percent);
  }
}
```

> - 오버라이딩은 부모 클래스에 정의된 같은 이름, 같은 파라미터 목록을 가진 메서드를 자식 클래스에서 재정의한다.
> - 오버로딩은 메서드의 이름은 같지만 제공되는 파라미터의 목록이 다르다.

### 🎈 할인 정책 구성하기
- 할은 정책은 하나만 설정하고 할인 조건은 여러 개를 적용할 수 있다. `Movie`와 `DiscountPolicy`의 생성자는 이런 제약을 강제한다.

```java
public class Movie {
  // ...

  public Movie(String title, Duration runningTime, Money fee, DiscountPolicy discountPolicy) {
    // ...
    this.discountPolicy = discountPolicy;
  }

  // ...
} 
```

- `DiscountPolicy`의 생성자는 여러 개의 `DiscountCondition` 인스턴스를 허용한다.

```java
public abstract class DiscountPolicy {
  // ...

  public DiscountPolicy(DiscountCondition ... conditions) {
    this.conditions = Arrays.asList(conditions);
  }

  // ...
}
```

- 이처럼 생성자의 파라미터 목로을 이용해 초기화에 필요한 정보를 전달하도록 강제하면 올바른 상태를 가진 객체의 생성을 보장할 수 있다.
- 다음과 같이 할인 정책과 할인 조건을 설정할 수 있다.

```java
Movie avatar = new Movie("아바타",
  Duration.ofMinutes(120),
  Money.wons(10000),
  new AmountDiscountPolicy(Money.wons(800),
    new SequenceCondition(1),
    new SequenceCondition(10),
    new PeriodCondition(DayOfWeek.MONDAY, LocalTime.of(10, 0), LocalTime.of(11, 59)),
    new PeriodCondition(DayOfWeek.THURSDAY, LocalTime.of(10, 0), LocalTime.of(20, 59))
  )
);
```

## 📚 상속과 다형성

### 🎈 컴파일 시간 의존성과 실행 시간 의존성
- `Movie` 클래스는 코드 수준에서 `AmountDiscountPolicy`나 `PercentDiscountPolicy`에 의존하지 않고 오직 추상 클래스인 `DiscountPolicy`에만 의존한다.
- 만약 영화 요금을 계산하기 위해 금액 할인 정책을 적용하고 싶다면 `Movie`의 인스턴스를 생성할 때 인자로 `AmountDiscountPolicy`의 인스턴스를 전달하면 된다. 이제 실행 시에 `Movie`의 인스턴스는 `AmountDiscountPolicy` 클래스의 인스턴스에 의존하게 된다.
- 이처럼 실행 시점에는 `Movie`의 인스턴스는 `AmountDiscountPolicy`나 `PercentDiscountPolicy`의 인스턴스에 의존하게 된다.
- 유연하고, 쉽게 재사용할 수 있으며, 확장 가능한 객체지향 설계가 가지는 특징은 코드의 의존성과 실행 시점의 의존성이 다르다는 점이다. 단점은 코드를 이해하기 어려워진다. 설계가 유연해질수록 코드를 이해하고 디버깅하기는 점점 더 어려워진다. 반면 유연성을 억제하면 재사용성과 확장 가능성은 낮아진다.

### 🎈 차이에 의한 프로그래밍
- 상속은 객체지향에서 코드를 재사용하기 위해 가장 널리 사용되는 방법이다.
- 상속을 이용하면 클래스 사이에 관계를 설정하는 것만으로 클래스가 가지고 있는 모든 속성과 행동을 새로운 클래스에 포함시킬 수 있다.
- 부모 클래스와 다른 부분만을 추가해서 새로운 클래스를 쉽고 빠르게 만드는 방법을 **차이에 의한 프로그래밍**이라고 부른다.

### 🎈 상속과 인터페이스
- 상속이 가치 있는 이유는 부모 클래스가 제공하는 모든 인터페이스를 자식 클래스가 물려받을 수 있기 때문이다.
- 인터페이스는 객체가 이해할 수 있는 메시지의 목록을 정의한다.
- 상속을 통해 자식 클래스는 자신의 인터페이스에 부모 클래스의 인터페이스를 포함하게 된다. 결과적으로 자식 클래스는 부모 클래스가 수신할 수 있는 모든 메시지를 수신할 수 있기 때문에 **외부 객체는 자식 클래스를 부모 클래스와 동일한 타입으로 간주할 수 있다.**
- 다시 말해서 자식 클래스는 상속을 통해 부모 클래스의 인터페이스를 물려받기 때문에 부모 클래스 대신 사용될 수 있다.
- 이처럼 자식 클래스가 부모 클래스를 대신하는 것을 **업캐스팅**이라고 부른다.

### 🎈 다형성
- 코드 상에서 `Movie` 클래스는 `DiscountPolicy` 클래스에게 메시지를 전송하지만 실행 시점에 실제로 실행되는 메서드는 `Movie`와 협력하는 객체의 실제 클래스가 무엇인지에 따라 달라진다. 다시 말해서 `Movie`는 동일한 메시지를 전송하지만 실제로 어떤 메서드가 실행될 것인지는 메시지를 수신하는 객체의 클래스가 무엇이냐에 따라 달라진다. 이를 **다형성**이라고 부른다.
- 다형성은 객체지향 프로그램의 컴파일 시간 의존성과 실행 시간 의존성이 다를 수 있다는 사실을 기반으로 한다.
- 프로그램 작성할 때 `Movie`는 추상 클래스인 `DiscountPolicy`에 의존한다. 따라서 컴파일 시간 의존성은 `DiscountPolicy`로 향한다. 반면에 실행 시점은 실제로 상호작용하는 객체는 `AmountDiscountPolicy`또는 `PercentDiscountPolicy`의 인스턴스이다. 다시 말해 실행 시간 의존성은 `AmountDiscountPolicy`나 `PercentDiscountPolicy`로 향한다.
- 다형성이란 동일한 메시지를 수신했을 때 객체의 타입에 따라 다르게 응답할 수 있는 능력을 의미한다. 따라서 다형적인 협력에 참여하는 객체는 모두 같은 메시지를 이해할 수 있어야 한다. 다시 말해 **인터페이스가 동일해야 한다는 것이다.**
- 메시지와 메서드를 실행 시점에 바인딩한다. 이를 **지연 바인딩** 또는 **동적 바인딩**이라고 한다.
- 그에 반해 전통적인 함수 호출처럼 컴파일 시점에 실행될 함수나 프로시저를 결정하는 것을 **초기 바인딩** 또는 **정적 바인딩**이라고 부른다.
- 객체지향이 컴파일 시점의 의존성과 실행 시점의 의존성을 분리하고, 하나의 메시지를 선택적으로 서로 다른 메서드에 연결할 수 있는 이유가 지연 바인딩 메커니즘을 사용하기 때문이다.

### 🎈 인터페이스와 다형성
- 자바의 인터페이스는 구현에 대한 고려 없이 다형적인 협력에 참여하는 클래스들이 공유 가능한 외부 인터페이스를 정의한 것이다.
- 인터페이스는 추상 클래스와 달리 구현을 공유할 필요가 없다.

## 📚 추상화와 유연성

### 🎈 추상화의 힘
- `DiscountPolicy`는 `AmountDiscountPolicy`와 `PercentDiscountPolicy`보다 추상적이고 `DiscountCondition`은 `SequenceCondition`와 `PeriodCondition` 보다 더 추상적이다.
- 더 추상적인 이유는 인터페이스에 초점을 맟추기 때문이다. `DiscountPolicy`는 모든 할인 정책들이 수신할 수 있는 `calculateDiscountAmount` 메시지를 정의한다. `DiscountCondition`은 모든 할인 조건들이 수신할 수 있는 `isSatisfiedBy` 메시지를 정의한다.
- 구현을 자신 클래스가 결정할 수 있도록 결정권을 위임한다.
- 추상화의 장점은 요구사항의 정책을 높은 수준에서 서술할 수 있다. 두 번째 장점은 추상화를 이용하면 설계가 좀 더 유연해진다.

### 🎈 유연한 설계
- 만약 할인 요금을 계산할 필요 없이 영화에 설정된 기본 금액을 그대로 사용할 땐 어떻게 해야할까?

```java
public class Movie {
  public Money calculateMovieFee(Screening screening) {
    if (discountPolicy == null) {
      return fee;
    }

    return fee.minus(discountPolicy.calculateDiscountAmount(screening));
  }
}
```

- 위와 같이 하면 될까? 하지만 이 경우 예외 케이스로 취급하기 때문에 지금까지 일관성 있던 협력 방식이 무너지게 된다.
- 책임의 위치를 결정하기 위해 조건문을 사용하는 것은 협력의 설계 측면에서 대부분의 경우 좋지 않은 선택이다. 항상 예외 케이스를 최소화하고 일관성을 유지할 수 있는 방법을 선택해야 한다.
- 일관성을 지킬 수 있는 방법은 0원이라는 할인 요금을 계산할 책임을 그대로 `DiscountPolicy` 계층에 유지시키는 것이다. `NoneDiscountPolicy` 클래스를 추가한다.

```java
public class NoneDiscountPolicy extends DiscountPolicy {

  @Override
  protected Money getDiscountAmount(Screening screening) {
    return Money.ZERO;
  }
}
```

- 다음과 같이 `NoneDiscountPolicy`의 인스턴스를 연결해서 할인되지 않은 영화를 생성할 수 있다.

```java
Movie starWars = new Movie("스타워즈",
  Duration.ofMinutes(210),
  Money.wons(10000),
  new NoneDiscountPolicy()
);
```

- 여기서 핵심은 기존의 `Movie`와 `DiscountPolicy`는 수정하지 않고 `NoneDiscountPolicy`라는 새로운 클래스를 추가하는 것만으로 애플리케이션의 기능을 확장했다는 것이다.
- 추상화가 **유연한 설계를 가능하게 하는 이유는 설계가 구체적인 상황에 결합되는 것을 방지하기 때문이다.**
- 결론은 유연성이 필요한 곳에 추상화를 사용하라.

### 🎈 추상 클래스와 인터페이스 트레이드오프
- `NoneDiscountPolicy` 클래스의 코드를 보면 `getDiscountAmount` 메서드가 어떤 값을 반환하더라도 상관이 없다는 사실을 알 수 있는데 부모 클래스인 `DiscountPolicy`에서 할인 조건이 없을 경우에 `getDiscountAmount`를 호출하지 않기 때문이다.
- 이 문제를 해결하는 방법은 `DiscountPolicy`를 인터페이스로 바꾸고 `NoneDiscountPolicy`가 `DiscountPolicy`의 `getDiscountAmount` 메서드가 아닌 `calculateDiscountAmount` 오퍼레이션을 오버라이딩하도록 변경하는 것이다.
- `DiscountPolicy` 클래스를 인터페이스로 변경한다.

```java
public interface DiscountPolicy {
  Money calculateDiscountAmount(Screening screening);
}
```

- 원래의 `DiscountPolicy` 클래스의 이름을 `DefaultDiscountPolicy`로 변경하고 인터페이스를 구현하도록 수정한다.

```java
public abstract class DefaultDiscountPolicy implements DiscountPolicy {
  // ...
}
```
- 이제 `NoneDiscountPolicy`가 `DiscountPolicy` 인터페이스를 구현하도록 변경하면 개념적인 혼란과 결합을 제거할 수 있다.

```java
public class NoneDiscountPolicy implements DiscountPolicy {

  @Override
  public Money calculateDiscountAmount(Screening screening) {
    return Money.ZERO;
  }
}
```

- 구현과 관련된 모든 것들이 트레이드오프의 대상이 될 수 있다는 사실이다. 작성하는 모든 코드에는 합당한 이유가 있어야 한다. 사소한 결정이라도 트레이드오프를 통해 얻어진 결론과 그렇지 않은 결롼 사이의 차이는 크다.

### 🎈 코드 재사용
- 상속은 코드를 재사용하기 위해 널리 사용되는 방법이나 가장 좋은 방법은 아니다.
- 상속보다는 **합성**이 더 좋은 방법이다. 합성은 다른 객체의 인스턴스를 자신의 인스턴스 변수로 포함해서 재사용하는 방법을 말한다.
- `Movie`가 `DiscountPolicy`의 코드를 재사용하는 방법이 합성이다.

### 🎈 상속
- 상속은 두 가지 관점에서 설계에 안 좋은 영향을 미친다.
- **하나는 상속이 캡슐화를 위반한다는 것이고, 다른 하나는 설계를 유연하지 못하게 만든다는 것이다.**
- 상속을 이용하기 위해서는 부모 클래스의 내부 구조를 잘 알고 있어야 한다.
- 결과적으로 부모 클래스의 구현이 자식 클래스에게 노출되기 때문에 **캡슐화가 약화된다.** 캡슐화의 약화는 강하게 결합되도록 만들기 때문에 부모 클래스를 변경할 때 자식 클래스도 함께 변경될 확률을 높인다. 결과적으로 상속을 과도하게 사용한 코드는 변경하기도 어려워진다.
- 두 번째 단점은 설계가 유연하지 않다는 것이다. 상속은 **부모 클래스와 자식 클래스 사이의 관계를 컴파일 시점에 결정한다.** 따라서 **실행 시점에 객체의 종류를 변경하는 것이 불가능하다.**
- 예를 들어 실행 시점에 금액 할인 정책인 영화를 비율 할인 정책으로 변경한다고 가정하면, 상속을 사용한 설계에서는 `AmountDiscountPolicy`의 인스턴스를 `PercentDiscountPolicy`의 인스턴스로 변경해야 한다. 이것은 부모 클래스와 자식 클래스가 강하게 결합돼 있기 때문에 발생하는 문제다.
- 반면 인스턴스 변수로 연결한 기존 방법을 사용하면 실행 시점에 할인 정책을 간단하게 변경할 수 있다.

```java
public class Movie {
  private DiscountPolicy discountPolicy;

  public void changeDiscountPolicy(DiscountPolicy discountPolicy) {
    this.discountPolicy = discountPolicy;
  }
}
```

- 금액 할인 정책이 적용된 영화에 비율 할인 정책이 적용되도록 변경하는 것은 새로운 `DiscountPolicy` 인스턴스를 연결하는 간단한 작업으로 바뀐다.

```java
Movie avatar = new Movie("아바타",
  Duration.ofMinutes(120),
  Money.wons(10000),
  new AmountDiscountPolicy(Money.wons(800), ...)
);

avatar.changeDiscountPolicy(new PercentDiscountPolicy(0.1, ...));
```

### 🎈 합성
- `Movie`는 요금을 계산하기 위해 `DiscountPolicy`의 코드를 재사용한다. 이 방법이 상속과 다른 점은 `Movie`가 `DiscountPolicy`의 인터페이스를 통해 약하게 결합된다.
- 이처럼 인터페이스에 정의된 메시지를 통해서만 코드를 재사용하는 방법을 **합성**이라고 부른다. 그렇기 때문에 구현을 효과적으로 캡슐화할 수 있다. 또한 의존하는 인스턴스를 교체하는 것이 비교적 쉽기 때문에 설계를 유연하게 만든다.
- 상속은 클래스를 통해 강하게 결합되는 데 비해 합성은 메시지를 통해 느슨하게 결합된다. 따라서 코드 재사용을 위해서 상속보다는 합성을 선호한다.
- 그렇다고 해서 상속을 절대 사용하지 말라는 것은 아니고 `DiscountPolicy`와 `AmountDiscountPolicy`, `PercentDiscountPolicy`는 상속 관계로 연결돼 있는데 이처럼 코드를 재사용하는 경우에는 상속보다 합성을 선호나는 것이 옳지만 다형성을 위해 인터페이스를 재사용하는 경우에는 상속과 합성을 함께 조합해서 사용할 수밖에 없다.
- 객체지향의 설계의 핵심은 **적절한 협력을 식별하고 협력에 필요한 역할을 정의한 후에 역할을 수행할 수 있는 적절한 객체에게 적절한 책임을 할당하는 것이다.**
