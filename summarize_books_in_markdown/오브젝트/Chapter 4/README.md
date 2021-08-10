# 🌈 Chapter 4: 설계 품질과 트레이드오프
- 협력은 애플리케이션의 기능을 구현하기 위해 메시지를 주고받은 객체들 사이의 상호작용이다.
- 책임은 객체가 다른 객체와 협력하기 위해 수행하는 행동이다.
- 역할은 대체 가능한 책임의 집합이다.
- 객체지향 설계란 올바른 객체에게 올바른 책임을 할당하면서 낮은 결합도와 높은 응집도를 가진 구조를 창조하는 활동이다.
- 책임은 객체의 상태에서 행동으로, 나아가 객체와 객체 사이의 상호작용으로 설계 중심을 이동시키고, 결합도가 낮고 응집도가 높으며 구현을 효과적으로 캡슐화하는 객체들을 창조할 수 있는 기반을 제공한다.

## 📚 데이터 중심의 영화 예매 시스템
- 객체의 상태는 구현에 속한다. 구현은 불안정하기 때문에 변하기 쉽다. 상태를 객체 분할 중심축으로 삼으면 구현에 관한 세부사항이 객체의 인터페이스에 스며들게 되어 캡슐화의 원칙이 무너진다. 결과적으로 상태의 변경은 인터페이스의 변경을 초래하며 이 인터페이스에 의존하는 모든 객체에게 변경의 영향이 퍼진다. 때문에 데이터에 초점을 맞추는 설계는 변경에 취약할 수 밖에 없다.
- 그에 비해 객체의 책임은 인터페이스에 속한다. 객체의 책임을 드러내는 안정적인 인터페이스 뒤로 책임을 수행하는 데 필요한 상태를 캡슐화함으로써 구현 변경에 대한 파장이 외부로 퍼져나가는 것을 방지한다.

### 🎈 데이터를 준비하자.
- 데이터 중심의 설계는 객체가 내부에 저장해야 하는 데이터가 무엇인가를 묻는 것으로 시작한다.
- `Movie`에 저장될 데이터를 먼저 결정하는 것으로 설계를 시작한다.

```java
public class Movie {
  private String title; // 제목
  private Duration runningTime; // 상영시간
  private Money fee; // 기본 요금
  private List<DiscountCondition> discountConditions;

  private MovieType movieType;
  private Money discountAmount;
  private double discountPercent;
}
```

- 여기서 책임 중심의 `Movie` 클래스와의 차이점은 `discountConditions`, `discountAmount`, `discountPercent` 이 `Movie`안에 포함되어 있다.
- 할인 정책은 영화별로 오직 하나만 지정할 수 있기 때문에 `MovieType`으로 상태를 확인한다.

```java
public enum MovieType {
  AMOUNT_DISCOUNT, // 금액 할인 정책
  PERCENT_DISCOUNT, // 비율 할인 정책
  NONE_DISCOUNT, // 미적용
}
```

- 이처럼 데이터 중심 설계에서는 객체가 포함해야 하는 데이터에 집중한다. (이 객체가 포함해야 하는 데이터는 무엇인가?)
- 이제 캡슐화를 위해서 간단한 방법인 내부의 데이터를 반환하는 **접근자**와 데이터를 변경하는 **수정자**를 추가한다.

```java
public class Movie {
  public MovieType getMovieType() {
    return movieType;
  }

  public void setMovieType(MovieType movieType) {
    this.movieType = movieType;
  }

  public Money getFee() {
    return fee;
  }

  public List<DiscountCondition> getDiscountConditions() {
    return Collections.unmodifiableList(discountConditions);
  }

  public void setDiscountConditions(List<DiscountCondition> discountConditions) {
    this.discountConditions = discountConditions;
  }

  public Money getDiscountAmount() {
    return discountAmount;
  }

  public void setDiscountAmount(Money discountAmount) {
    this.discountAmount = discountAmount;
  }

  public double getDiscountPercent() {
    return discountPercent;
  }

  public void setDiscountPercent(double discountPercent) {
    this.discountPercent = discountPercent;
  }
}
```

- 이제 할인 조건을 구현한다. 영화 예매 도메인에 순번 조건과 기간 조건이 있다.

```java
public enum DiscountConditionType {
  SEQUENCE, // 순번 조건
  PERIOD // 기간 조건
}
```

- 할인 조건을 구현하는 `DiscountCondition`은 할인 조건의 타입을 저장할 인스턴스 변수인 `type`을 포함한다.

```java
public class DiscountCondition {
  private DiscountConditionType type;

  private int sequence; // 상영 순번

  private DayOfWeek dayOfWeek; // 요일
  private LocalTime startTime; // 시작 시간
  private LocalTime endTime; // 종료 시간
}
```

- 캡슐화를 통해 이 속성들을 클래스 외부로 노출해서는 안되기 때문에 `Movie` 클래스처럼 메서드를 추가한다.

```java
public class DiscountCondition {
  public DiscountConditionType getType() {
    return type;
  }

  public void setType(DiscountConditionType type) {
    this.type = type;
  }

  // 생략...
}
```

- 이어서 Screening 클래스를 구현한다. 위와 같은 방식으로 어떤 데이터를 포함해야 하는지를 결정하고 데이터를 캡슐화하기 위해 메서드를 추가한다.


```java
public class Screening {
  private Movie movie;
  private int sequence;
  private LocalDateTime whenScreened;

  public Movie getMovie() {
    return movie;
  }

  public void setMovie(Movie movie) {
    this.movie = movie;
  }
  
  // 생략...
}
```

- 영화 예매 시스템의 목적은 영화를 예매하는 것이기 떄문에 `Reservation` 클래스도 추가한다.

```java
public class Reservation {
  private Customer customer;
  private Screening screening;
  private Money fee;
  private int audienceCount;

  public Reservation(Customer customer, Screening screening, Money fee, int audienceCount) {
    this.customer = customer;
    this.screening = screening;
    this.fee = fee;
    this.audienceCount = audienceCount;
  }

  public Customer getCustomer() {
    return customer;
  }

  public void setCustomer(Customer customer) {
    this.customer = customer;
  }
  
  // 생략...
}
```

- 다음은 `Customer`클래스로 고객의 정보를 보관하는 클래스이다.

```java
public class Customer {
  private String name;
  private String id;

  public Customer(String name, String id) {
    this.id = id;
    this.name = name;
  }
}
```

### 🎈 영화를 예매하자
- `ReservationAgency`는 데이터 클래스들을 조합해서 영화 예매 절차를 구현하는 클래스이다.

```java
public class ReservationAgency {
  public Reservation reserve(Screening screening, Customer customer, int audienceCount) {
    Movie movie = screening.getMovie();

    boolean discountable = false;
    // DiscountCondition에 대해 루프를 돌면서 할인 가능 여부를 확인
    for (DiscountCondition condition : movie.getDiscountConditions()) {
      if (condition.getType() == DiscountConditionType.PERIOD) {
        // 기간 조건
      } else {
        // 순번 조건
      }

      if (discountable) {
        break;
      }
    }
    
    Money fee;
    if (discountable) { // 할인 여부
      Money discountAmount = Money.ZERO;
      // 할인 정책에 따라 예매 요금 계산
      switch(movie.getMovieType()) {
        case AMOUNT_DISCOUNT:
          // 금액 할인 정책
        case PERCENT_DISCOUNT:
          // 할인 비율
        case NONE_DISCOUNT:
          // 할인 정책이 적용 x
      }

      fee = movie.getFee().minus(discountAmount);
    } else {
      fee = movie.getFee();
    }

    return new Reservation(customer, screening, fee, audienceCount);
  }
}
```

## 📚 설계 트레이드오프

### 🎈 캡슐화
- 상태와 행동을 하나의 객체 안에 모으는 이유는 객체의 내부 구현을 외부로부터 감추기 위해서이다. (여기서 구현이란 나중에 변경될 가능성이 높은 어떤 것)
- 변경될 가능성이 높은 부분은 구현, 상대적으로 안정적인 부분을 인터페이스라고 부른다.
- 캡슐화는 외부에서 알 필요가 없는 부분을 감춤으로써 대상을 단순화하는 추상화의 한 종류이다. (안정적인 인터페이스 뒤로 캡슐화한다.)
- **캡슐화가 중요한 이유는 불안정한 부분과 안정적인 부분을 분리해서 변경의 영향을 통제할 수 있기 때문이다.**
- 캡슐화란 **변경 가능성이 높은 부분을 객체 내부로 숨기는 추상화 기법이다.**

### 🎈 응집도와 결합도
- 응집도는 모듈에 포함된 내부 요소들이 연관돼 있는 정도를 나타낸다. **모듈 내의 요소들이 하나의 목적**을 위해 긴밀하게 협력한다면 그 모듈은 높은 은집도를 가진다.
- 겹합도는 의존성의 정도를 나타내며 **다른 모듈에 대해 얼마나 많은 지식을 갖고 있는지**를 나타내는 척도이다. 다른 모듈에 대해 너무 자세하게 알고 있다면 높은 결합도를 가진다.
- 높은 은집도와 낮은 결합도를 가진 설계를 추구해야 하는 이유는 **설계를 변경하기 쉽게 만들기 때문이다.**
- **변경의 관점에서 응집도란 변경이 발생할 때 모듈 내부에서 발생하는 변경의 정도로 측정할 수 있다.** (하나의 변경으로 인해 모듈 전체가 변경된다면 결합도는 높고, 하나의 변경에 하나의 모듈만 변경된다면 결합도는 낮은 것이다.)
- 캡슐화를 지키면 모듈 안의 응집도는 높아지고 모듈 사이의 결합도는 낮아진다.

## 📚 데이터 중심의 영화 예매 시스템의 문제점
- `Movie`예제의 데이터 중심의 설계는 책임 중심 설계와 기능적으로는 완전히 동일하지만 설계 관점에서는 완전히 다르다.
- 근본적인 차이점은 캡슐화를 다루는 방식이다. 데이터 중심은 캡슐화를 위반하고 객체의 내부 구현을 인터페이스의 일부로 만든다.
- 데이터 중심의 설계의 대표적인 문제점은 세 가지로 캡슐화 위반, 높은 결합도, 낮은 응집도이다.

### 🎈 캡슐화 위반
- 데이터 중심으로 설계한 `Movie` 클래스는 오직 메서드를 통해서만 객체의 내부 상태에 접근할 수 있다. 하지만 접근자와 수정자 메서드는 객체 내부의 상태에 대한 어떤 정보도 캡슐화하지 못한다.

```java
public class Movie {
  // Movie 내부에 Money 타입의 fee라는 이름의 인스턴스 변수가 존재한다는 사실을 
  // 퍼블릭 인터페이스에 노골적으로 드러낸다.
  private Money fee;

  public Money getFee() {
    return fee;
  }

  public void setFee(Money fee) {
    this.fee = fee;
  }
}
```

- 이러한 근본적인 원인은 객체가 수행할 책임이 아니라 내부에 저장할 데이터에 초점을 맞췄기 때문이다.
- 이러한 접근자와 수정자에 과도하게 의존하는 설계 방식은 **추측에 의한 설계 전략**이라고 부른다. 이 전략은 객체가 사용될 **협력을 고려하지 않고** 객체가 다양한 상황에서 사용될 수 있을 것이라는 막연한 추측을 기반으로 설계를 진행한다.

### 🎈 높은 결합도
- 객체의 내부 구현을 변경했음에도 이 인터페이스에 의존하는 모든 클라이언트들도 함께 변경해야 한다.

```java
public class ReservationAgency {
  public Reservation reserve(Screening screening, Customer customer, int audienceCount) {
    // ...
    Money fee;
    if (discountable) {
      // ...
      fee = movie.getFee().minus(discountAmount);
    } else {
      fee = movie.getFee();
    }

    return new Reservation(customer, screening, fee, audienceCount);
  }
}
```

- 만약 위 코드에서 `fee`의 타입을 변경한다면 이를 위해서 `getFee` 메서드의 반환 타입도 함께 수정해야 한다. 그리고 `getFee`를 호출하는 `ReservationAgency`의 구현도 변경된 타입에 맞게 수정해야 한다.
- 데이터 중심 설계는 객체의 캡슐화를 약화시키기 때문에 클라이언트가 객체의 구현에 강하게 결합된다.
- `ReservationAgency`가 모든 데이터 객체에 의존하고 있다. `DiscountCondition`의 데이터가 변경되면 `ReservationAgency`도 함께 수정해야 한다.
- 데이터 중심의 설계는 전체 시스템을 하나의 거대한 의존성 덩어리로 만들어 버리기 떄문에 어떤 변경이라도 일단 발생하고 나면 시스템 전체가 요통칠 수밖에 없다.

### 🎈 낮은 응집도
- `ReservationAgency`가 다음과 같은 수정사항이 발생하는 경우에 코드를 수정해야 한다.
  - 할인 정책이 추가될 경우
  - 할인 정책별로 할인 요금을 계산하는 방법이 변경될 경우
  - 할인 조건이 추가될 경우
  - 할인 조건별로 할인 여부를 판단하는 방법이 변경될 경우
  - 예메 요금을 계산하는 방법이 변경될 경우
- 낮은 응집도는 두 가지 측면에서 설계에 문제를 일으킨다.
  - 변경의 이유가 서로 다른 코드들을 하나의 모듈 안에 뭉쳐놓았기 때문에 변경과 아무 상관이 없는 코드들이 영향을 받게 된다.
  - 하나의 요구사항 변경을 반영하기 위해 동시에 여러 모듈을 수정해야 한다.

> **단일 책임 원칙(SRP)**
> - 모듈의 응집도가 변경과 연관이 있다는 사실을 강조하기 위해 단일 책임 원칙이 나왔다.
> - 단일 책임 원칙은 클래스는 단 한 가지의 변경 이유만 가져야 한다.

## 📚 자율적인 객체를 향해
  
### 🎈 캡슐화를 지켜라
- 객체는 스스로의 상태를 책임져야 하고 외부에서는 인터페이스에 정의된 메서드를 통해서만 상태에 접근할 수 있어야 한다.
- 여기서 말하는 메서드는 접근자나 수정자가 아니라 객체에게 의미 있는 메서드는 객체가 책임져야 하는 무언가를 수행하는 메서드이다.
- 접근자와 수정자를 사용한 메서드의 문제점은 코드 중복이 발생할 확률이 높다. 또한 변경에 취약하다. `getBottom`이라는 메서드를 변경하면 이 메서드를 사용하는 모든 곳에서 수정이 이루어져야 한다.
- 해결 방법은 캡슐화를 강화시키는 것이다. 객체가 자기 스스로 책임을 지게 말이다.

### 🎈 스스로 자신의 데이터를 책임지는 객체
- 상태와 행동을 객체라는 하나의 단위로 묶는 이유는 객체 스스로 자신의 상태를 처리할 수 있게 하기 위해서이다.
- 객체 내부에 저장되는 데이터보다 객체가 협력에 참여하면서 수행할 책임을 정의하는 오퍼레이션이 더 중요하다.
  - 이 객체가 어떤 데이터를 포함해야 하는가?
  - 이 객체가 데이터에 대해 수행해야 하는 오퍼레이션은 무엇인가?
- 두 질문을 조합하면 객체의 내부 상태를 저장하는 방식과 저장된 상태에 대해 호출할 수 있는 오퍼레이션의 집합을 얻을 수 있다. 다시 말해 새로운 데이터 타입을 만들 수 있는 것이다.
- 영화 예매 시스템의 `ReservationAgency`로 새어나간 데이터에 대한 책임을 실제 데이터를 포함하고 있는 객체로 옮겨본다.
- 할인 조건을 표현하는 `DiscountCondition`부터 시작한다. 첫 번째 질문인 어떤 데이터를 관리해야 하는 지를 묻는건 앞에서 결정해 놓았다.
- 두 번째 질문은 이 데이터에 대해 수행할 수 있는 오포레이션이 무엇인가를 묻는 것이다. 할인 조건에는 순번 조건과 기간 조건의 두 가지 종류가 존재하고 `DiscountCondition`의 순번 조건일 경우에는 `sequence`를 이용하고 기간 조건일 경우에는 `dayOfWeek`, `startTime`, `endTime`을 이용해 할인 여부를 결정한다. 따라서 두 개의 `isDiscountable`이 필요할 것이고 각 `isDiscountable` 메서드 안에서 `type`의 값을 이용해 현재의 할인 조건 타입에 맞는 적절한 메서드가 호출됐는지 판단한다.

```java
public class DiscountCondition {
  // 데이터 생략..

  public DiscountConditionType getType() {
    return type;
  }

  public boolean isDiscountable(DayOfWeek dayOfWeek, LocalTime time) {
    if (type != DiscountConditionType.PERIOD) {
      throw new IllegalArgumentException();
    }

    return this.dayOfWeek.equal(dayOfWeek) &&
      this.startTime.compareTo(time) <= 0 &&
      this.endTime.compareTo(time) >= 0;
  }

  public boolean isDiscountable(int sequence) {
    if (type != DiscountConditionType.SEQUENCE) {
      throw new IllegalArgumentException();
    }

    return this.sequence == sequence;
  }
}
```

- 다음은 `Movie`를 구현하는데 첫 번째 질문은 이미 결정했다.
- 두 번째 질문은 `Movie`는 영화 요금을 계산하는 오퍼레이션과 할인 여부를 판단하는 오퍼레이션이 필요하다. 할인 정책은 금액 할인, 비율 할인, 할인 미적용의 세 가지 타입이 있다. 때문에 할인 정책의 타입을 반환하는 `getMovieType` 메서드와 정책별로 요금을 계산하는 세 가지 메서드를 구현한다.

```java
public class Movie {
  // 데이터 생략..

  public MovieType getMovieType() {
    return movieType;
  }

  public Money calculateAmountDiscountedFee() {
    if (movieType != MovieType.AMOUNT_DISCOUNT) {
      throw new IllegalArgumentException();
    }

    return fee.minus(discountAmount);
  }

  // 다 비슷.. 생략..
}
```
- `Movie`는 `DiscountCondition`의 목록을 포함하기 떄문에 할인 여부를 판단하는 오퍼레이션 역시 포함해야 한다.

```java
public class Movie {
  public boolean isDiscountable(LocalDateTime whenScreened, int sequence) {
    for (DiscountCondition condition : discountConditions) {
      // 기간 조건 검증
      if (condition.getType() == DiscountConditionType.PERIOD) {
        if (condition.isDiscountable(whenScreened.getDayOfWeek(), whenScreened.toLocalTime())) {
          return true;
        }
      } else {
        // 순번 조건 검증
        if (condition.isDiscountable(sequence)) {
          return false;
        }
      }
    }

    return false;
  }
}
```

- `Screening` 클래스도 두 질문에 대해 생각하며 구현한다.

```java
public class Screening {
  // 생략..

  public Money calculateFee(int audienceCount) {
    switch (movie.getMovieType()) {
      case AMOUNT_DISCOUNT:
        // ...
      case PERCENT_DISCOUNT: 
        // ...
      case NONE_DISCOUNT:
        // ...
    }
  }
}
```

- `ReservationAgency`는 `Screening`의 `calculateFee` 메서드를 호출해 예매 요금을 계산한 후 계산된 요금을 이용해 `Reservation`을 생성한다.

```java
public class ReservationAgency {
  public Reservation reserve(Screening screening, Customer customer, int audienceCount) {
    Money fee = screening.calculateFee(audienceCount);
    return new Reservation(customer, screening, fee, audienceCount);
  }
}
```

- 이렇게 하면 내부 구현을 더 면밀하게 캡슐화하고 있기 때문에 좀더 개선되었다. 두 번째 설계에서는 데이터를 처리하는 데 필요한 메서드를 데이터를 가지고 있는 객체 스스로 구현하고 있다. 따라서 이 객체들은 스스로를 책임진다고 말할 수 있다.

## 📚 하지만ㄴ 여전히 부족하다.
- 두 번째 설계 역시 데이터 중심의 설계 방식에 속한다.

### 🎈 캡슐화 위반
- 수정된 객체들은 자기 자신의 데이터를 스스로 처리한다. `DiscountCondition`은 자기 자신의 데이터를 이용해 할인 가능 여부를 스스로 판단한다.

```java
public class DiscountCondition {
  private DiscountConditionType type;
  private int sequence;
  private DayOfWeek dayOfWeek;
  private LocalTime startTime;
  private LocalTime endTime;

  public DiscountConditionType getType() { }

  public boolean isDiscountable(DayOfWeek dayOfWeek, LocalTime time) { }

  public boolean isDiscountable(int sequence) { }
}
```

- 하지만 `DiscountCondition`에 구현된 두 개의 `isDiscountable` 메서드를 보면 `DayOfWeek` 타입의 요일 정보와 `LocalTime` 타입의 시간 정보가 인스턴스 변수로 포함돼 있다는 사실을 인터페이스를 통해 외부에 노출하고 있다. 이렇게 되면 해당 메서드를 사용하는 모든 클라이언트도 함께 수정해야 한다.
- `Movie`도 역시 캡슐화가 부족하다. 내부 구현을 인터페이스에 노출시키고 있다. `calculateAmountDiscountedFee`, `calculatePercentDiscountedFee`, `calculateNoneDiscountedFee`이라는 세 개의 메서드는 할인 정책에는 금액 할인 정책, 비율 할인 정책, 미적용의 세 가지가 존재한다는 사실을 드러내고 있다.

### 🎈 높은 결합도
- 캡슐화 위반으로 인해 `DiscountCondition`의 내부 구현이 외부로 노출됐기 때문에 `Movie`와 `DiscountCondition` 사이의 결합도는 높을 수밖에 없다.

```java
public class Movie {
  public boolean isDiscountable(LocalDateTime whenScreened, int sequence) {
    for (DiscountCondition condition : discountConditions) {
      if (condition.getType() == DiscountConditionType.PERIOD) {
        if (condition.isDiscountable(whenScreened.getDayOfWeek(), whenScreened.toLocalTime())) {
          return true;
        }
      } else {
        if (condition.isDiscountable(sequence)) {
          return false;
        }
      }
    }

    return false;
  }
}
```

- `DiscountCondition`의 기간 할인 조건의 명칭이 `PERIOD`에서 다른 값으로 변경된다면 `Movie`를 수정해야 한다.
- `DiscountCondition`의 종류가 추가되거나 삭제된다면 `if ~ else`구문을 수정해야 한다.


## 📚 데이터 중심 설계의 문제점
- 두 번째 설계가 변경에 유연하지 못한 이유는 캡슐화를 위반했기 떄문이다.
- 데이터 중심의 설계가 변경에 취약한 이유는 두 가지다.
  - 본질적으로 너무 이른 시기에 데이터에 관해 결정하도록 강요한다.
  - 데이터 중심의 설계에서는 협력이라는 문맥을 고려하지 않고 객체를 고립시킨 채 오퍼레이션을 결정한다.

### 🎈 데이터 중심 설계의 객체의 행동보다는 상태에 초점을 맞춘다.
- 데이터에 초점이 맞춰져 있다면 만족스러운 캡슐화를 얻기 어렵다.
- 데이터를 먼저 결정하고 데이터를 처리하는 데 필요한 오퍼레이션을 나중에 결정하는 방식은 데이터에 관한 지식이 객체의 인터페이스에 고스란히 드러나게 된다.
- 결론적으로 데이터 중심의 설계는 너무 이른 시기에 데이터를 대해 고민하기 때문에 캡슐화에 실패하게 된다.

### 🎈 데이터 중심 설계는 객체를 고립시킨 채 오퍼레이션을 정의하도록 만든다
- 데이터 중심 설계에서 초점은 객체의 외부가 아니라 내부로 향한다.
- 실행 문맥에 대한 깊이 있는 고민 없이 객체가 관리할 데이터의 세부 정보를 먼저 결정한다.
