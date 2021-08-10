---
sidebar_position: 11
---

# 🌈 Chapter 10: 상속과 코드 재사용

## 📚 상속과 중복 코드

### 🎈 DRY 원칙
- 중복 코드는 변경을 방해한다.
- 중복 코드가 가지는 가장 큰 문제는 코드를 수정하는 데 필요한 노력을 몇 배로 증가시킨다는 것이다. 중복 코드의 묶음을 찾고 찾았다면 찾아낸 모든 코드를 일관되게 수정해야 한다. 모든 중복코드를 개별적으로 테스트해서 동일한 결과를 내놓는지 확인해야만 한다.
- 중복 코드는 수정과 테스트에 드는 비용을 증가시킨다.
- 중복 여부를 판단하는 기준은 변경으로 요구사항이 변경됐을 때 두 코드를 함께 수정해야 한다면 이 코드는 중복이다. 중복 여부를 결정하는 기준은 코드가 변경에 반응하는 방식이다.
- DRY는 반복하지 마라라는 뜻의 **Don't Repeat Yourself**의 첫 글자를 모아 만든 용어로 동일한 지식을 중복하지 말라는 것이다.
  
> DRY 원칙은 모든 지식은 시스템 내에서 단일하고, 애매하지 않고, 정말로 믿을 만한 표현 양식을 가져야 한다.

- DRY 원칙은 **한 번, 단 한 번**(**Once and Only Onc**) **원칙** 또는 **단일 지점 제어**(**Single Point Control**) **원칙**이라고도 부른다.

### 🎈 중복과 변경

#### 🐶 중복 코드 살펴보기

- 예제 생략.
- 책 310 ~ 313 페이지 참고

#### 🐶 중복 코드 수저아기
- 중복 코드가 가지는 단점은 많은 코드 더미 속에서 어떤 코드가 중복인지를 파악하는 일은 쉬운 일이 아니다.
- 중복 코드는 항상 함께 수정돼야 하기 때문에 수정할 때 하나라도 빠트린다면 버그로 이어질 것이다.
- 중복 코드는 새로운 중복 코트를 부른다. 중복 코드를 제거하지 않은 상태에서 코드를 수정할 수 있는 유일한 방법은 새로운 중복 코드를 추가하는 것뿐이다.
- 중복 코드가 늘어날수록 애플리케이션은 변경에 취약해지고 버그가 발생할 가능성이 높아진다. 또한, 버그의 수는 증가하며 그에 비례해 코드를 변경하는 속도는 점점 더 느려진다.

#### 🐶 타입 코드 사용하기
- 두 클래스 사이의 중복 코드를 제거하는 한 가지 방법은 클래스를 하나로 합치는 것이다.
- 하지만 타입 코드를 사용하는 클래스는 낮은 응집도와 높은 결합도라는 문제에 시달리게 된다.
- 객체지향 프로그래밍 언어는 타입 코드를 사용하지 않고도 중복 코드를 관리할 수 있는 효과적인 방법을 제공한다. 그것이 바로 상속이다.

### 🎈 상속을 이용해서 중복 코드 제거하기
- 상속을 이용해 코드를 재사용하기 위해서는 부모 클래스의 개발자가 세웠던 가정이나 추론 과정을 정확하게 이해해야 한다. 이것은 자식 클래스의 작성자가 부모 클래스의 구현 방법에 대한 정확한 지식을 가져야 한다는 것을 의미한다.
- 따라서 상속은 결합도른 높인다. 그리고 상속이 초래하는 부모 클래스와 자식 클래스 사이의 강한 결합이 코드를 수정하기 어렵게 만든다.

> - 상속을 위한 경고 1   
> 자식 클래스의 메서드 안에서 `super` 참조를 이용해 부모 클래스의 메서드를 직접 호출할 경우 두 클래스는 강하게 결합된다. `super` 호출을 제거할 수 있는 방법을 찾아 결합도를 제거하라.

- 자식 클래스가 부모 클래스의 구현에 강하게 결합될 경우 부모 클래스의 변경에 의해 자식 클래스가 영향을 받게 된다.
- 상속을 사용하면 적은 노력으로도 새로운 기능을 쉽고 빠르게 추가할 수 있다. 하지만 그로 인해 커다란 대가를 치러야 할 수도 있다.
- 이처럼 상속 관계로 연결된 자식 클래스가 부모 클래스의 변경에 취약해지는 현상을 가리켜 취약한 기반 클래스 문제라고 부른다.
- 취약한 기반 클래스 문제는 코드 재사용을 목적으로 상속을 사용할 때 발생하는 가장 대표적인 문제이다.

## 📚 취약한 기반 클래스 문제
- 부모 클래스의 변경에 의해 자식 클래스가 영향을 받는 현상을 **취약한 기반 클래스 문제**라고 부른다.
- 이 문제는 상속을 사용한다면 피할 수 없는 객체지향 프로그래밍의 근본적인 취약성이다.
- 취약한 기반 클래스 문제는 상속이라는 문맥 안에서 결합도가 초래하는 문제점을 가리키는 용어다. 상속은 자식 클래스를 점진적으로 추가해서 기능을 확장하는 데는 용이하지만 높은 결합도로 인해 부모 클래스를 점진적으로 개선하는 것은 어렵게 만든다.
- 취약한 기반 클래스 문제는 캡슐화를 약화시키고 결합도를 높인다. 상속은 자식 클래스가 부모 클래스의 구현 세부사항에 의존하도록 만들기 때문에 캡슐화를 약화시킨다.
- 상속을 사용하면 부모 클래스의 퍼블릭 인터페이스가 아닌 구현을 변경하더라도 자시 클래스가 영향을 받기 쉬워진다.
- 객체지향의 기반은 캡슐화를 통한 변경의 통제다. 상속은 코드의 재사용을 위해 캡슐화의 장점을 희석시키고 구현에 대한 결합도를 높임으로써 객체지향이 가진 강력함을 반감시킨다.

### 🎈 불필요한 인터페이스 상속 문제
- 자바의 초기 버전에서 상속을 잘못 사용한 대표적인 사례는 `java.util.Properties`와 `java.util.Stack`이다. 두 클래스의 공통점은 부모 클래스에서 상속받은 메서드를 사용할 경우 자식 클래스의 규칙이 위반될 수 있다는 것이다.
- 자바의 초기 컬렉션 프레임워크 개발자들은 요소의 추가, 삭제 오퍼레이션을 제공하는 `Vector`를 재사용하기 위해 `Stack`을 `Vector`의 자식 클래스로 구현했다.
- `Stack`이 `Vector`를 상속받기 때문에 `Stack`의 퍼블릭 인터페이스에 `Vector` 퍼블릭 인터페이스가 합쳐진다. 따라서 `Vector`의 퍼블릭 인터페이스를 이용하면 임의의 위치에서 요소를 추가하거나 삭제할 수 있다. 따라서 `Stack`의 규칙을 쉽게 위반할 수 있다.

```java
Stack<String> stack = new Stack<>();
stack.push("1st");
stack.push("2nd");
stack.push("3rd");

stack.add(0, "4th");

assertEquals("4th", stack.pop()); // error! 반환값은 "3rd"
```

- 문제의 원인은 `Vector`의 퍼블릭 인터페이스까지도 함께 상속받았기 때문이다.

> - 상속을 위한 경고 2   
> 상속받은 부모 클래스의 메서드가 자식 클래스의 내부 구조에 대한 규칙을 깨트릴 수 있다.

### 🎈 메서드 오버라이딩 오작용 문제
- `InstrumentHashSet`은 `HashSet`의 내부에 저장된 요소의 수를 셀 수 있는 기능을 추가한 클래스로서 `HashSet`의 자식 클래스로 구현돼 있다.

```java
public class InstrumentHashSet<E> extends HashSet<E> {
  private int addCount = 0; // 요소를 추가한 횟수를 기록

  @Override
  public boolean add(E e) { // 하나의 요소를 추가
    addCount++;

    return super.add(e);
  }

  @Override
  public boolean addAll(Collection<? extends E> c) { // 다수의 요소를 한 번에 추가
    addCount += c.size();
    
    return super.addAll(c);
  }
}
```

- `InstrumentHashSet`의 구현에는 문제가 없어보이지만 다음과 같은 코드를 실행하면 달라진다.

```java
InstrumentHashSet<String> languages = new InstrumentHashSet<>();
languages.addAll(Arrays.asList("Java", "Ruby", "Scala"));
```

- 위 코드를 실행하면 `addCount`의 값이 3일 될 거라 예상하지만, 실제로 실행한 후의 `addCount`의 값은 6이다. 그 이유는 부모 클래스인 `HashSet`의 `addAll` 메서드 안에서 `add` 메서드를 호출하기 때문이다.
- 이 문제를 해결할 수 있는 방법은 `InstrumentHashSet`의 `addAll`을 제거하는 것이다. 하지만 이 방법 역시 나중에 `HashSet`의 `addAll` 메서드가 `add` 메시지를 전송하지 않도록 수정된다면 `addAll` 메서드를 이용해 추가되는 요소들에 대한 카운트가 누락될 것이기 때문이다.
- 더 좋은 해결책은 `InstrumentHashSet`의 `addAll` 메서드를 오버라이딩하고 추가되는 각 요소에 대해 한 번씩 `add` 메시지를 호출하는 것이다.

```java
public class InstrumentHashSet<E> extends HashSet<E> {
  private int addCount = 0;

  @Override
  public boolean add(E e) {
    addCount++;

    return super.add(e);
  }

  @Override
  public boolean addAll(Collection<? extends E> c) {
    boolean modified = false;

    for(E e : c)
      if(add(e))
        modified = true;
    return modified;
  }
}
```

- 하지만 이 방법도 오바리이딩된 `addAll` 메서드의 구현이 `HashSet`의 것과 동일하다는 점에 미래에 발생할지 모르는 위험을 방지하기 위해 코드를 중복시킨 것이다.

> - 상속을 위한 경우 3   
> 자식 클래스가 부모 클래스의 메서드를 오버라이딩할 경우 부모 클래스가 자신의 메서드를 사용하는 방법에 자식 클래스가 결합될 수 있다.

### 🎈 부모 클래스와 자식 클래스의 동시 수정 문제
- 예제 생략.
- 자식 클래스가 부모 클래스의 메서드를 오버라이딩하거나 불필요한 인터페이스를 상속받지 않았음에도 부모 클래스를 수정할 떄 자식 클래스를 함께 수정해야 할 수도 있다.
- 상속을 사용하면 자식 클래스가 부모 클래스의 구현에 강하게 결합되기 때문에 이 문제를 피하기는 어렵다.
- 상속은 기본적으로 부모 클래스의 구현을 재사용한다는 기본 전제를 따르기 때문에 자식 클래스가 부모 클래스의 내부에 대해 속속들이 알도록 강요한다. 따라서 코드 재사용을 위한 상속은 부모 클래스와 자식 클래스를 강하게 결합시키기 때문에 함께 수정해야 하는 상황 역시 빈번하게 발생할 수밖에 없다.

> - 상속을 위한 경우 4   
> 클래스를 상속하면 결합도로 인해 자식 클래스와 부모 클래스의 구현을 영원히 변경하지 않거나, 자식 클래스와 부모 클래스를 동시에 변경하거나 둘 중 하나를 선택할 수밖에 없다.

## 📚 Phone 다시 살펴보기
- 상속으로 인한 피해를 최소화할 수 있는 방법.
- 취약한 기반 클래스 문제를 완전히 없앨 수는 없지만 어느 정도까지 위험을 완화시키는 것은 가능하다.

### 🎈 추상화에 의존하자
- 부모 클래스가 변경될 경우 자식 클래스도 함께 변경될 가능성이 높다. 이 문제를 해결하는 가장 일반적인 방법은 자식 클래스가 부모 클래스의 구현이 아닌 추상화에 의존하도록 만드는 것이다.
- 코드 중복을 제거하기 위해 상속을 도입할 때 따르는 두 가지 원칙은 다음과 같다.
  - 두 메서드가 유사하게 보인다면 차이점을 메서드로 추출하라. 메서드 추출을 통해 두 메서드를 동일한 형태로 보이도록 만들 수 있다.
  - 부모 클래스의 코드를 하위로 내리지 말고 자식 클래스의 코드를 상위로 올려라. 재사용성과 응집도 측면에서 더 뛰어난 결과를 얻을 수 있다.

### 🎈 차이를 메서드로 추출하라
- 중복 코드 안에서 차이점을 별도의 메서드로 추출한다. 이것은 흔히 말하는 *변하는 것으로부터 변하지 않는 것을 분리하라.* 또는 *변하는 부분을 찾고 이를 캡슐화하라.*라는 조언을 메서드 수준에서 적용한 것이다.

```java
public class Phone {
  // ...
  public Money calculateFee() {
    Money result = Money.ZERO;
  
    for(Call call : calls) {
      result = result.plus(calculateCallFee(call));
    }

    return result;
  }

  private Money calculateCallFee(Call call) {
    return amount.times(call.getDuration().getSeconds() / seconds.getSeconds());
  }
}
```

- `NightDiscountPhone`의 경우도 동일하게 메서드를 추출한다.

```java
public class NightDiscountPhone {
  // ...
  public Money calculateFee() {
    Money result = Money.ZERO;

    for(Call call : calls) {
      result = result.plus(calculateCallFee(call));
    }

    return result;
  }

  private Money calculateCallFee(Call call) {
    if(call.getFrom().getHour() >= LATE_NIGHT_HOUR) {
      return nightlyAmount.times(call.getDuration().getSeconds() / seconds.getSeconds());
    } else {
      return regularAmount.times(call.getDuration().getSeconds() / seconds.getSeconds());
    }
  }
}
```

- 두 클래스의 `calculateFee` 메서드는 완전히 동일해졌고 추출한 `calculateCallFee` 메서드 안에 서로 다른 부분을 격리시켜 놓았다.

### 🎈 중복 코드를 부모 클래스로 올려라
- 부모 클래스를 추가한다. 이 클래스는 추상 클래스로 구현하는 것이 적합하다.

```java
public abstract class AbstractPhone {}

public class Phone extends AbstractPhone {...}

public class NightDiscountPhone extends AbstractPhone {...}
```

- 이제 두 클래스의 공톹 부분을 부모 클래스로 이동시킨다. 옮길 때 인스턴스 변수보다 메서드를 먼저 이동시킨다.

```java
public abstract class AbstractPhone {
  private List<Call> calls = new ArrayList<>();

  public Money calculateFee() {
    Money result = Money.ZERO;

    for(Call call : calls) {
      result = result.plus(calculateCallFee(call));
    }

    return result;
  }

  abstract protected Money calculateCallFee(Call call);
}
```

- 이제 두 클래스에 `calculateFee`에 관련된 인스턴스 변수와 메서드를 제거해준다.

```java
public class Phone extends AbstractPhone {
  // ...

  @Override
  protected Money calculateCallFee(Call call) {
    return amount.times(call.getDuration().getSeconds() / seconds.getSeconds());
  }
}

public class NightDiscountPhone extends AbstractPhone {
  // ...

  @Override
  protected Money calculateCallFee(Call call) {
    if(call.getFrom().getHour() >= LATE_NIGHT_HOUR) {
      return nightlyAmount.times(call.getDuration().getSeconds() / seconds.getSeconds());
    } else {
      return regularAmount.times(call.getDuration().getSeconds() / seconds.getSeconds());
    }
  }
}
```

- 이제 우리의 설계는 추상화에 의존하게 된다.

### 🎈 추상화가 핵심이다.
- 공통 코드를 이동시킨 후에 각 클래스는 서로 다른 변경의 이유를 가진다. `AbstractPhone`은 전체 통화 목록을 계산하는 방법이 바뀔 경우에만 변경된다. `Phone`은 일반 요금제의 통화 한 건을 계산하는 방식이 바뀔 경우에만 변경된다. `NightDiscountPhone`은 심야 할인 요금제의 통화 한 건을 계산하는 방식이 바뀔 경우에만 변경된다. 세 클래스는 각각 하나의 변경 이유만을 가진다. 이 클래스들은 단일 책임 원칙을 준수하기 때문에 응집도가 높다. 오직 추상화에만 의존한다. `calculateCallFee` 메서드의 시그니처가 변경되지 않는 한 부모 클래스의 내부 구현이 변경되더라도 자식 클래스는 영향을 받지 않는다. 이 설계는 낮은 결합도를 유지하고 있다.
- 의존성 역전 원칙도 준수하고 있는데, `Phone`과 `NightDiscountPhone`이 추상화인 `AbstractPhone`에 의존한다.
- 새로운 요금제를 추가하는 것도 쉽다. 확장에는 열려 있고 수정에는 닫혀 있기 때문에 개방-폐쇄 원칙도 준수하고 있다.

### 🎈 의도를 드러내는 이름 선택하기
- 한 가지 아쉬운 저은 클래스의 이름이다.
- 다음과 같이 변경해줄 수 있다.

```java
public abstract class Phone {...}

public class RegularPhone extends Phone {...}

public class NightDiscountPhone extends Phone {...}
```

### 🎈 세금 추가하기
- 세금은 모든 요금제에 공통으로 적용돼야 하는 요구사항이다. 따라서 공통 코드를 담고 있는 추상 클래스인 `Phone`을 수정하면 모든 자식 클래스 간에 수정 사항을 공유할 수 있다.

```java
public abstract class Phone {
  private double taxRate;
  private List<Call> calls = new ArrayList<>();

  public Phone(double taxRate) {
    this.taxRate = taxRate;
  }

  public Money calculateFee() {
    Money result = Money.ZERO;

    for(Call call : calls) {
      result = result.plus(calculateCallFee(call));
    }

    return result.plus(result.times(taxRate));
  }

  abstract protected Money calculateCallFee(Call call);
}
```

- 하지만, `Phone` 자식 클래스인 `RegularPhone`과 `NightDiscountPhone`의 생성자 역시 `taxRate`를 초기화하기 위해 수정해야 한다.

```java
public class RegularPhone extends Phone {
  //...
  public RegularPhone (Money amount, Duration seconds, double taxRate) {
    super(taxRate);
    // ...
  }
  // ...
}

public class NightDiscountPhone extends Phone {
  //...
  public NightDiscountPhone (Money nightlyAmount, Money regularAmount, Duration seconds, double taxRate) {
    super(taxRate);
    // ...
  }
  // ...
}
```

- 클래스 사이의 상속은 자식 클래스가 부모 클래스가 구현한 행동뿐만 아니라 인스턴스 변수에 대해서도 결합되게 만든다.
- 결과적으로 책임을 아무리 잘 분리하더라도 인스턴스 변수의 추가는 종종 상속 계층 전반에 걸친 변경을 유발한다. 하지만 인스턴스 초기화 로직을 변경하는 것이 두 클래스에 동일한 세금 계산 코드를 중복시키는 것보다는 현명한 선택이다.
- 상속으로 인한 클래스 사이의 결합을 피할 수 있는 방법은 없다. 상속은 어떤 방식으로든 부모 클래스와 자식 클래스를 결합시킨다. 메서드 구현에 대한 결합은 추상 메서드를 추가함으로써 어느 정도 완화할 수 있지만 인스턴스 변수에 대한 잠재적인 결합을 제거할 수 있는 방법은 없다.

## 📚 차이에 의한 프로그래밍
- 상속이 강력한 이유는 익숙한 개념을 이용해서 새로운 개념을 쉽고 빠르게 추가할 수 있기 때문이다. 
- 이처럼 기존 코드와 다른 부분만을 추가함으로써 애플리케이션의 기능을 확장하는 방법을 **차이에 의한 프로그래밍**이라고 부른다. 상속을 이용하면 이미 존재하는 클래스의 코드를 쉽게 재사용할 수 있기 때문에 애플리케이션의 점진적인 정의가 가능해진다.
- 차의에 의한 프로그래밍의 목표는 중복 코드를 제거하고 코드를 재사용하는 것이다. 중복을 제거하기 위해서는 코드를 재사용 가능한 단위로 분해하고 재구성해야 한다. 코드를 재사용하기 위해서는 중복 코드를 제거해서 하나의 모듈로 모아야 한다. 따라서 중복 코드를 제거하기 위해 최대한 코드를 재사용해야 한다.
- 재사용 가능한 코드란 심각한 버그가 존재하지 않는 코드다. 따라서 코드를 재사용하면 코드의 품질은 유지하면서도 코드를 작성하는 노력과 테스트는 줄일 수 있다.
- 객체지향 세계에서 중복 코드를 제거하고 코드를 재사용할 수 있는 가장 유명한 방법은 상속이다. 상속을 이용하면 새로운 기능을 추가하기 위해 직접 구현해야 하는 코드의 양을 최소화할 수 있따.
- 하지만, 사람들은 코드를 재사용하기 위해 맹목적으로 상속을 사용하는 것이 위험하다는 사시을 깨닫기 시작했다. 상속의 오용과 남용은 애플리케이션을 이해하고 확장하기 어렵게 만든다. 정말로 필요한 경우에만 상속을 사용하라.
