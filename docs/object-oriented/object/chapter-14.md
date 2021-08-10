---
sidebar_position: 15
---

# 🌈 Chapter 14: 일관성 있는 협력
- 일관성 있는 설계가 가져다 주는 큰 이익은 코드가 이해하기 쉬워진다.
- 가능하다면 유사한 기능을 구현하기 위해 유사한 협력 패턴을 사용하라.

## 📚 핸드폰 과금 시스템 변경하기
- 예제 생략. 책 P471 참고
- 설명 생략
- 고정요금 방식(`FixedFeePolicy`), 시간대별 방식(`TimeOfDayDiscountPolicy`), 요일별 방식(`DayOfWeekDiscountPolicy`), 구간별 방식(`DurationDiscountPolicy`) 네 가지로 추가적으로 분류
- 비일관성은 두 가지 상황에서 발목을 잡는다. 하나는 새로운 구현을 추가해야 하는 상황이고, 또 다른 하나는 기존의 구현을 이해해야 하는 상황이다. 새로운 정책을 추가하면 추가할수록 코드 사이의 일관성은 점점 더 어긋나게 되는 것이다.
- 일관성 없는 코드가 가지는 두 번째 문제점은 코드를 이해하기 어렵다는 점이다. 유사한 요구사항이 서로 다른 방식으로 구현돼 있다면 요구사항이 유사하다는 사실 자체도 의심하게 될 것이다. 때문에 유사한 기능을 서로 다른 방식으로 구현해서는 안 된다.
- 객체지향에서 기능을 구현하는 유일한 방법은 객체 사이의 협럭을 만드는 것뿐이므로 유지보수 가능한 시스템을 구축하는 첫걸음은 협력을 일관성 있게 만드는 것이다.

## 📚 설계에 일관성 부여하기
- 일관성 있는 설계를 만드는 가장 훌륭한 조언은 다양한 설계 경험을 익히라는 것이다.
- 두 번째 조언은 널리 알려진 디자인 패턴을 학습하고 변경이라는 문맥 안에서 디자인 패턴을 적용해 보라는 것이다.
- 협력을 일관성 있게 만들기 위해 다음과 같은 기본 지침을 따르는 것이 도움이 된다.
  - 변하는 개념을 변하지 않는 개념으로부터 분리하라.
  - 변하는 개념을 캡슐화하라.

### 🎈 조건 로직 대 객체 탐색
- 객체지향에서 변경을 다루는 전통적인 방법은 조건 로직을 객체 사이의 이동으로 바꾸는 것이다.

```java
public class Movie {
  private DiscountPolicy discountPolicy;

  // 현재의 할인 정책이 어떤 종류인지 확인하지 않는다.
  public Money calculateMovieFee(Screening screening) {
    // 단순히 현재의 할인 정책을 나타내는 discountPolicy에 필요한 메시지를 전송할 뿐이다.
    // 할인 정책의 종류를 체크하던 조건문이 discountPolicy로의 객체 이동으로 대체된 것이다.
    return fee.minus(discountPolicy.calculateDiscountAmount(screening));
  }
}
```

- 다형성은 바로 이런 조건 로직을 객체 사이의 이동으로 바꾸기 위해 객체지향이 제공하는 설계 기법이다.
- 단순히 자신의 요청을 잘 처리해줄 것이라 믿고 메시지를 전송할 뿐이다.
- 실제로 협력에 참여하는 주체는 구체적인 객체다. 이 객체들은 협력안에서 `discountPolicy`를 대체할 수 있어야 한다. 다시 말해서 `discountPolicy`는 서브 타입이어야 한다.
- 메시지를 전달할 뿐 객체지향적인 코드는 조건을 판단하지 않는다. 단지 다음 객체로 이동할 뿐이다.
- 조건 로직을 객체 사이의 이동으로 대체하기 위해서는 커다란 클래스를 더 작은 클래스들로 분리해야 한다. 클래스를 분리하기 위해 가장 중요한 기준은 변경의 이유와 주기다. 클래스는 명확히 단 하나의 이유에 의해서만 변경돼야 하고 클래스 안의 모든 코드는 함께 변경돼야 한다. 즉, 단일 책임 원칙을 따르도록 클래스를 분리해야 한다는 것이다.
- 큰 메서드 안에 뭉쳐있던 조건 로직들을 변경의 압력에 맞춰 작은 클래스들로 분리하고 나면 인스턴스들 사이의 협력 패턴에 일관성을 부여하기 더 쉬워진다.
- 유사한 행동을 수행하는 작은 클래스들이 자연스럽게 역할이라는 추상화로 묶이게 되고 역할 사이에서 이뤄지는 협력 방식이 전체 설계의 일관성을 유지할 수 있게 이끌어주기 때문이다.

> 일관성 있는 협력을 위한 지침
> 1. 변하는 개념을 변하지 않는 개념으로부터 분리하라.
> 2. 변하는 개념을 캡슐화하라.

- 핵심은 훌륭한 추상화를 찾아 추상화에 의존하도록 만드는 것이다. 추상화에 대한 의존은 결합도를 낮추고 결과적으로 대체가능한 역할로 구성된 협력을 설계할 수 있게 해준다. 따라서 선택하는 추상화의 품질이 캡슐화의 품질을 결정한다.
- 변경에 초점을 맞추고 캡슐화의 관점엥서 설계를 바라보면 일관성 있는 협력 패턴을 얻을 수 있다.

### 🎈 캡슐화 다시 살펴보기

- **데이터 은닉**이란 오직 외부에 공개된 메서드를 통해서만 객체의 내부에 접근할 수 있게 제한함으로써 객체 내부의 상태 구현을 숨기는 기법을 가리킨다. 간단하게 말해서 클래스의 모든 인스턴스 변수는 `private`으로 선언해야 하고 오직 해당 클래스의 메서드만이 인스턴스 변수에 접근할 수 있어야 한다.
- 그러나 캡슐화는 데이터 은닉 이상이다. GOF의 조언에 따르면 소프트웨어 안에서 변할 수 있는 모든 개념을 감추는 것이다. 캡슐화란 변하는 어떤 것이든 감추는 것이다.
- 캡슐화의 가장 대표적인 예는 객체의 퍼블릭 인터페이스와 구현을 분리하는 것이다.
- 코드 수정으로 인한 파급효과를 제어할 수 있는 모든 기법이 캡슐화의 일종이다. 데이터 캡슐화와 메서드 캡슐화는 **개별 객체에 대한 변경을 관리**하기 위해 객체 캡슐화와 서브타입 캡슐화는 **협력에 참여하는 객체들의 관계**에 대한 변경을 관리하기 위해 사용한다.
- 변경을 캡슐화할 수 있는 다양한 방법이 존재하지만 협력을 일관성 있게 만들기 위해 가장 일반적으로 사용하는 방법은 서브타입 캡슐화와 객체 캡슐화를 조합하는 것이다. 서브타입 캡슐화는 인터페이스 상속을 사용하고, 객체 캡슐화는 합성을 사용한다.

> - 변하는 부분을 분리해서 타입 계층을 만든다.
>   - 변하는 부분들의 공통적인 행동을 추상 클래스나 인터페이스로 추상화한 후 변하는 부분들이 이 추상 클래스나 인터페이스를 상속받게 만든다. 변하는 부분은 변하지 않는 부분의 서브타입이 된다.
> - 변하지 않는 부분의 일부로 타입 계층을 합성한다.
>   - 타입 계층에 변하지 않는 부분에 합성한다. 변하지 않는 부분에서는 변경되는 구체적인 사항에 결합돼서는 안된다.
>   - 의존성 주입과 같이 결합도를 느슨하게 유지할 수 있는 방법을 이용해 오직 추상화에만 의존하게 만든다.

## 📚 일관성 있는 기본 정책 구현하기

### 🎈 변경 분리하기
- 일관성 있는 협력을 만들기 위한 첫 번째 단계는 변하는 개념과 변하지 않는 개념을 분리하는 것이다.
- 이 예제에서 시간대별, 요일별, 구간별 방식의 공통점은 각 기본 정책을 구성하는 방식이 유사하다.
  - 기본 정책은 한 개 이상의 규칙으로 구성된다.
  - 하나의 규칙은 적용조건과 단위요금의 조합이다.
- 공통점은 변하지 않는 부분이고, 차이점은 변하는 부분이다. 따라서 변하지 않는 규칙으로부터 변하는 적용조건을 분리해야 한다.

### 🎈 변경 캡슐화하기
- 협력을 일관성 있게 만들기 위해서는 변경을 캡슐화해서 파급효과를 줄여야 한다.
- 변경을 캡슐화하는 가장 좋은 방법은 변하지 않는 부분으로부터 변하는 부분을 분리하는 것이다. 또한 변하는 부분의 공통점을 추상화하는 것도 포함한다.
- 여기서 변하지 않는 것은 규칙이다. 변하는 것은 적용조건이다. 따라서 규칙으로부터 적용조건을 분리해서 추상화한 후 시간대별, 요일별, 구간별 방식을 이 추상화의 서브타입으로 만든다. 이것이 서브타입의 캡슐화다. 그 후에 규칙이 적용조건을 표현하는 추상화를 합성 관계로 연결한다. 이것이 객체 캡슐화다.

### 🎈 협력 패턴 설계하기
- 변하는 부분과 변하지 않는 부분을 분리하고, 변하는 부분을 적절히 추상화하고 나면 변하는 부분을 생략한 채 변하지 않는 부분만을 이용해 객체 사이의 협력을 이야기할 수 있다. 
- 추상화만으로 구성한 협력은 추상화를 구체적인 사례로 대체함으로써 다양한 상황으로 확장할 수 있게 된다. 다시 말해서 재사용 가능한 협력 패턴이 선명하게 드러나는 것이다.

### 🎈 추상화 수준에서 협력 패턴 구현하기
- 먼저 적용조건을 표현하는 추상화인 `FeeCondition`에서 시작한다. `FeeCondition`은 `findTimeIntervals`라는 단 하나의 오퍼레이션을 포함하는 간단한 인터페이스다.

```java
public interface FeeCondition {
  // 적용조건을 만족하는 기간을 구한 후 List에 담아 반환
  List<DateTimeInterval> findTimeIntervals(Call call);
}
```

- `FeeRule`은 단위요금(`feePerDuration`)과 적용조건(`feeCondition`)을 저장하는 두 개의 인스턴스 변수로 구성된다.

```java
public class FeeRule {
  private FeeCondition feeCondition;
  private FeePerDuration feePerDuration;

  public FeeRule(FeeCondition feeCondition, FeePerDuration, feePerDuration) {
    this.feeCondition = feeCondition;
    this.feePerDuration = feePerDuration;
  }

  // FeeCondition에게 findTimeIntervals 메시지를 전송해서 조건을 만족하는
  // 시간의 목록을 반환받은 후 feePerDuration의 값을 이용해 요금을 계산한다.
  public Money calculateFee(Call call) {
    return feeCondition.findTimeIntervals(call)
      .stream()
      .map(each -> feePerDuration.calculate(each))
      .reduce(Money.ZERO, (first, second) -> first.plus(second));
  }
}
```

- `FeePerDuration` 클래스는 단위 시간당 요금이라는 개념을 표현하고 이 정보를 이용해 일정 기간 동안의 요금을 계산하는 `calculate` 메서드를 구현한다.

```java
public class FeePerDuration {
  private Money fee;
  private Duration duration;

  public FeePerDuration(Money fee, Duration duration) {
    this.fee = fee;
    this.duration = duration;
  }

  public Money calculate(DateTimeInterval interval) {
    return fee.times(interval.duration().getSeconds() / duration.getSeconds());
  }
}
```

- 이제 `BasicRatePolicy`가 `FeeRule`의 컬렉션을 이용해 전체 통화 요금을 계산하도록 수정할 수 있다.

```java
public class BasicRatePolicy implements RatePolicy {
  private List<FeeRule> feeRules = new ArrayList<>();

  public BasicRatePolicy(FeeRule ... feeRules) {
    this.feeRules = Arrays.asList(feeRules);
  }

  @Override
  public Money calculateFee(Phone phone) {
    return phone.getCalls()
      .stream()
      .map(call -> calculate(call))
      .reduce(Money.ZERO, (first, second)  -> first.plus(second));
  }

  private Money calculate(Call call) {
    return feeRules
      .stream()
      .map(rule -> calculateFee(call))
      .reduce(Money.ZERO, (first, second) -> first.plus(second));
  }
}
```

- 지금까지 구현한 클래스와 인터페이스는 모두 변하지 않는 추상화에 해당한다. 이 요소들을 조합하면 전체적인 협력 구조가 완성된다. 다시 말해서 변하지 않는 요소와 추상적인 요소만으로도 요금 계산에 필요한 전체적인 협력 구조를 설명할 수 있다는 것이다.
- 변하는 것과 변하지 않는 것을 분리하고 변하는 것을 캡슐화한 코드는 오로지 변하지 않는 것과 추상화에 대한 의존성만으로도 전체적인 협력을 구현할 수 있다. 변하는 것은 추상화 뒤에 캡슐화되어 숨겨져 있기 때문에 전체적인 협력의 구조에 영향을 미치지 않는다.

### 🎈 구체적인 협력 구현하기
- `FeeCondition` 인터페이스를 실체화하는 클래스에 따라 기본 정책의 종류가 달라진다.

#### 🐶 시간대별 정책
- `TimeOfDayFeeCondition`의 인스턴스는 협력 안에서 `FeeCondition`을 대체할 수 있어야 한다. 따라서 `FeeCondition`의 인터페이스를 구현하는 서브타입으로 만들어야 한다.

```java
public class TimeOfDayFeeCondition implements FeeCondition {
  private LocalTime from;
  private LocalTime to;

  public TimeOfDayFeeCondition(LocalTime from, LocalTime to) {
    this.from = from;
    this.to = to;
  }

  @Override
  public List<DateTimeInterval> findTimeIntervals(Call call) {
    return call.getInterval().splitByDay()
      .stream()
      .map(each ->
        DateTimeInterval.of(
          LocalDateTime.of(each.getFrom().toLocalDate(), from(each)),
          LocalDateTime.of(each.getTo().toLocalDate(), to(each))
        )
      ).collect(Collectors.toList());
  }

  private LocalTime from(DateTimeInterval interval) {
    return interval.getFrom().toLocalTime().isBefore(from) ?
      from : interval.getFrom().toLocalTime();
  }

  private LocalTime to(DateTimeInterval interval) {
    return interval.getTo().toLocalTime().isAfter(to) ?
      from : interval.getTo().toLocalTime();
  }
}
```

- 나머지 정책 생략..
- 이 예제는 변경을 캡슐화해서 협력을 일관성 있게 만들면 어떤 장점을 얻을 수 있는지를 잘 보여준다. 변하는 부분을 변하지 않는 부분으로부터 분리했기 때문에 변하지 않는 부분을 재사용할 수 있다. 그리고 새로운 기능을 추가하기 위해 오직 변하는 부분만 구현하면 되기 때문에 원하는 기능을 쉽게 완성할 수 있다. 따라서 코드의 재사용성이 향상되고 테스트해야 하는 코드의 양이 감소한다.
- 일관성 있는 협력은 개발자에게 확장 포인트를 강제하기 때문에 정해진 구조를 우회하기 어렵게 만든다.
- 유사한 기능에 대해 유사한 협력 패턴을 적용하는 것은 객체지향 시스템에서 **개념적 무결성**을 유지할 수 있는 가장 효과적인 방법이다.

### 🎈 협력 패턴에 맞추기
- 기존 협력 방식에 벗어난 규칙이 추가되더라도 가급적 기존의 협력 패턴에 맞추는 것이 가장 좋은 방법이다.
- 비록 설계를 약각 비트는 것이 조금은 이상한 구조를 낳더라도 전체적으로 일관성을 유지할 수 있는 설계를 선택하는 것이 현명하다.

> 지속적으로 개선하라
> - 처음에는 일관성을 유지하는 것처럼 보이던 협력 패턴이 시간이 흐르면서 새로운 요구사항이 추가되는 과정에서 일관성의 벽에 조금씩 금이 가는 경우을 자주 보게 된다. 이 현상은 자연스러운 현상이며 오히려 새로운 요구사항을 수용할 수 있는 협력 패턴을 향해 설계를 진화시킬 수 있는 좋은 신호로 받아들여야 한다.
> - 협력은 고정된 것이 아니다. 만약 현재의 패턴이 변경의 무게를 지탱하기 어렵다면 변경을 수용할 수 있는 협력 패턴을 향해 과감하게 리팩터링하라.

### 🎈 패턴을 찾아라
- 애플리케이션에서 유사한 기능에 대한 변경이 지속적으로 발생하고 있다면 변경을 캡슐화할 수 있는 적절한 추상화를 찾은 후, 이 추상화에 변하지 않는 공통적인 책임을 할당하라.
- 현재의 구조가 변경을 캡슐화하기에 적합하지 않다면 코드를 수정하지 않고도 원하는 변경을 수용할 수 있도록 협력과 코드를 리팩터링하라.
- 협력을 일관성 있게 만드는 과정은 유사한 기능을 구현하기 위해 반복적으로 적용할 수 있는 협력의 구조를 찾아가는 기나긴 여정이다. 따라서 협력을 일관성 있게 만든다는 것은 유사한 변경을 수용할 수 있는 협력 패턴을 발견하는 것과 동일하다.
