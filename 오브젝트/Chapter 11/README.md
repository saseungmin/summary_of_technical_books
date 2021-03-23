# 🌈 Chapter 11: 합성과 유연한 설계
- 합성은 전체를 표현하는 객체가 부분을 표현하는 객체를 포함해서 부분 객체의 코드를 재사용한다. 또한, 합성에서 두 객체 사이의 의존성은 런타임에 해결된다.
- 상속 관계는 **is-a 관계**라고 부르고 합성 관계는 **has-a 관계**라고 부른다.
- 합성은 구현에 의존하지 않는다는 점에서 상속과 다르다. 합성은 내부에 포함되는 객체의 구현이 아닌 퍼블릭 인터페이스에 의존한다. 따라서 합성을 이용하면 포함된 객체의 내부 구현이 변경되더라도 영향을 최소화할 수 있기 떄문에 변경에 더 안정적인 코드를 얻을 수 있게 된다.
- 코드 작성 시점에 결정한 상속 관계는 변경이 불가능하지만 합성 관계는 실행 시점에 동적으로 변경할 수 있다.

> 코드 재사용을 위해서는 객체 합성이 클래스 상속보다 더 좋은 방법이다.

- 상속은 부모 클래스 안에 구현된 코드 자체를 재사용하지만 합성은 포함되는 객체의 퍼블릭 인터페이스를 재사용한다.

## 📚 상속을 합성으로 변경하기
- 10장에서 코드 재사용을 위해 상속을 남용했을 때 세 가지 문제점은 불필요한 인터페이스 상속 문제, 메서드 오버라이딩 오작용 문제, 부모 클래스와 자식 클래스의 동시 수정 문제가 존재했다.
- 합성을 사용하면 상속이 초래하는 세 가지 문제점을 해결할 수 있다.
- 10장의 상속 예제를 합성 관계로 변경해본다.

### 🎈 불필요한 인터페이스 상속 문제: java.util.Properties와 java.util.Stack
- `Vector`를 상속받는 `Stack`을 `Vector`의 인스턴스 변수를 `Stack` 클래스의 인스턴스 변수로 선언함으로써 합성 관계로 변경할 수 있다.

```java
public class Stack<E> {
  private Vector<E> elements = new Vector()<>;

  public E push(E item) {
    elements.addElement(item);

    return item;
  }

  public E pop() {
    if (elements.isEmpty()) {
      throw new EmptyStackException();
    }

    return elements.remove(elements.size() - 1);
  }
}
```

### 🎈 메서드 오버라이딩의 오작용 문제: InstrumentHashSet
- `InstrumentHashSet`도 같은 방법을 사용해서 합성 관계로 변경할 수 있다.
- `HashSet` 인스턴스를 내부에 포함한 후 `HashSet`의 퍼블릭 인터페이스에서 제공하는 오퍼레이션들을 이용해 필요한 기능을 구현하면 된다.

```java
public class InstrumentHashSet<E> implements Set<E> {
  private int addCount = 0;
  private Set<E> set;

  public InstrumentHashSet(Set<E> set) {
    this.set = set;
  }

  @Override
  public boolean add(E e) {
    addCount++;

    return set.add(e);
  }

  @Override
  public boolean addAll(Collection<? extends E> c) {
    addCount += c.size();
    
    return set.addAll(c);
  }

  public int getAddCount() {
    return addCount;
  }

  @Override public boolean remove(Object o) { return set.remove(o); }
  @Override public void clear() { set.clear(); }
  // ...
}
```

- `InstrumentHashSet`은 `HashSet`이 제공하는 메서드를 그대로 제공해야 한다. `HashSet`은 `Set` 인터페이스를 실체화하는 구현체 중 하나이며, `InstrumentHashSet`이 제공해야 하는 모든 오퍼레이션들은 `Set` 인터페이스에 정의돼 있다. 따라서 `InstrumentHashSet`이 `Set` 인터페이스를 실체화하면서 내부에 `HashSet`의 인스턴스를 합성하면 `HashSet`에 대한 구현 결합도는 제거하면서도 퍼블릭 인터페이스는 그대로 유지할 수 있다. 이를 **포워딩**(**forwarding**)이라고 부르고 동일한 메서드를 호출하기 위해 추가된 메서드를 **포워딩 메서드**(**forwarding method**)라고 부른다.

### 🎈 부모 클래스와 자식 클래스의 동시 수정 문제: PersonalPlaylist
- 이경우엔 합성을 이용하여 변경하도라도 두 클래스에서 변경이 일어난다.

```java
public class PersonalPlaylist {
  private Playlist playlist = new Playlist();

  public void append(Song song) {
    // ...
  }

  public void remove(Song song) {
    // ...
  }
}
```

- 그렇다고 하더라도 여전히 상속보다는 합성을 사용하는 것이 더 좋은데 향후에 `Playlist`의 내부 구현을 변경하더라도 파급효과를 최대한 `PersonalPlaylist` 내부로 캡슐화할 수 있기 때문이다.

> - 몽키 패치   
> 몽키 패치(Monkey Patch)란 현재 실행 중인 환경에만 영향을 미치도록 지역적으로 코드를 수정하거나 확장하는 것을 가리킨다.   
> `Playlist`의 코드를 수정할 권한이 없거나 소스코드가 존재하지 않는다고 하더라도 몽키 패치가 지원되는 환경이라면 `Playlist`에 직접 `remove` 메서드를 추가하는 것이 가능하다. (루비의 열린 클래스, C#의 확장 메서드)

- 합성은 안정성과 유연성이라는 장점을 제공한다.

## 📚 상속으로 인한 조합의 폭발적인 증가
- 상속으로 인해 결합도가 높아지면 코드를 수정하는 데 필요한 작업의 양이 과도하게 늘어나는 경향이 있다. (작은 기능들을 조합해서 더 큰 기능을 수행하는 객체를 만들어야 하는 경우)
  - 하나의 기능을 추가하거나 수정하기 위해 불필요하게 많은 수의 클래스를 추가하거나 수정해야 한다.
  - 단일 상속만 지원하는 언어에서는 상속으로 인해 오히려 중복 코드의 양이 늘어날 수 있다.

### 🎈 기본 정책과 부가 정책 조합하기
- 10장에서 소개했던 핸드폰 과금 시스템에 새로운 요구사항을 추가해본다.
- 새로운 요구사항은 일반 요금제와 심야 할인 요금제라는 두 요금제에 부가 정책을 추가하는 것이다. (기본 정책과 부가 정책)
- 부가 정책은 통화량과 무관하게 기본 저책에 선택적으로 추가할 수 있는 요금 방식.
- 때문에 부가 정ㅇ책은 기본 정책의 계산 결과에 적용될 수 있고 선택적으로 적용할 수 있으며 조합이 가능하다. 또한, 부가 정책은 임의의 순서로 적용 가능하다.

> - 기본 정책 : 일반 요금제, 심야 할인 요금제
> - 부가 정책 : 세금 정책, 기본 요금 할인 정책

### 🎈 상속을 이용해서 기본 정책 구현하기
- 10장의 예제와 같음.

### 🎈 기본 정책에 세금 정책 조합하기
- 다음은 일반 요금제에 세금 정책을 조합하는 것으로 `RegularPhone` 클래스를 상속받은 `TaxableRegularPhone`클래스를 추가한 것이다.

```java
public class TaxableRegularPhone extends RegularPhone {
  private double taxRate;

  public TaxableRegularPhone(Money amount, Duration seconds, double taxRate) {
    super(amount, seconds);
    this.taxRate = taxRate;
  }

  @Override
  public Money calculateFee() { // 부모 클래스에서 오버라이딩
    Money fee = super.calculateFee();
    return fee.plus(fee.times(taxRate)); // 세금 정책을 조합한 요금을 계산
  }
}
```
- `super` 호출을 사용한다면 원하는 결과를 쉽게 얻을 수는 있지만 자식 클래스와 부모 클래스 사이의 결합도가 높아지고 만다. 결합도를 낮추는 방법은 자식 클래스가 부모 클래스의 메서드를 호출하지 않도록 부모 클래스에 추상 메서드를 제공하는 것이다.

```java
public abstract class Phone {
  private List<Call> calls = new ArrayList<>();

  public Money calculateFee() {
    Money result = Money.ZERO;

    for(Call call : calls) {
      result = result.plus(calculateCallFee(call));
    }

    return afterCalculated(result);
  }

  protected abstract Money calculateCallFee(Call call);
  protected abstract Money afterCalculated(Money fee);
}
```

- 자식 클래스는 `afterCalculated` 메서드를 오버라이딩해서 계산된 요금에 적용할 작업을 추가한다.

```java
public class RegularPhone extends Phone {
  // ...

  @Override
  protected Money calculateCallFee(Call call) {
    return amount.times(call.getDuration().getSeconds() / seconds.getSeconds());
  }

  @Override
  protected Money afterCalculated(Money fee) {
    return fee;
  }
}
```

- `NightlyDiscountPhone` 클래스 역시 수정해야 한다.

```java
public class NightlyDiscountPhone extends Phone {
  // ...

  @Override
  protected Money calculateCallFee(Call call) {
    if(call.getFrom().getHour() >= LATE_NIGHT_HOUR) {
      return nightlyAmount.times(call.getDuration().getSeconds() / seconds.getSeconds());
    } else {
      return regularAmount.times(call.getDuration().getSeconds() / seconds.getSeconds());
    }
  }

  @Override
  protected Money afterCalculated(Money fee) {
    return fee;
  }
}
```

- 이처럼 부모 클래스에 추상 메서드를 추가하면 모든 자식 클래스들이 추상 메서드를 오버라이딩해야하는 문제가 발생한다.
- 모든 추상 메서드의 구현이 동일하다. 유연성을 유지하면서도 중복 코드를 제거할 수 있는 방법은 `Phone`에서 `afterCalculated` 메서드에 대한 기본 구현을 함께 제공하는 것이다.
- 추상 메서드의 단점은 상속 계층에 속하는 모든 자식 클래스가 추상 메서드를 오버라이딩해야 한다는 것이다.
 
```java
public abstract class Phone {
  // ...

  protected Money afterCalculated(Money fee) { // 훅 메서드
    return fee;
  }

  protected abstract Money calculateCallFee(Call call);
}
```
- 이처럼 추상 메서드와 동일하게 자식 클래스에서 오버라이딩할 의도로 메서드를 추가했지만 편의를 위해 기본 구현을 제공하는 메서드를 **훅 메서드**(**hook method**)라고 부른다.

- `TaxableRegularPhone`을 다음과 같이 수정한다.

```java
public class TaxableRegularPhone extends RegularPhone {
  private double taxRate;

  public TaxableRegularPhone(Money amount, Duration seconds, double taxRate) {
    super(amount, seconds);
    this.taxRate = taxRate;
  }

  @Override
  public Money afterCalculated(Money fee) {
    return fee.plus(fee.times(taxRate));
}
```

- 심야 할인 요금제인 `NightDiscountPhone`에도 세금을 부과할 수 있도록 `TaxableNightDiscountPhone`을 추가한다.

```java
public class TaxableNightDiscountPhone extends NightlyDiscountPhone {
  private double taxRate;

  public TaxableNightDiscountPhone(Money nightlyAmount, Money regularAmount, Duration seconds, double taxRate) {
    super(nightlyAmount, regularAmount, seconds);
    this.taxRate = taxRate;
  }

  @Override
  public Money afterCalculated(Money fee) {
    return fee.plus(fee.times(taxRate));
}
```

- 문제는 `TaxableNightDiscountPhone`과 `TaxableRegularPhone` 사이에 코드를 중복했다는 것이다. 두 클래스의 코드를 보면 부모 클래스의 이름을 제외하면 대부분 코드가 거의 동일하다.
- 대부분의 객체지향 언어는 단일 상속만 지원하기 때문에 상속으로 인해 발생하는 중복 코드 문제를 해결하기가 쉽지 않다.

### 🎈 기본 정책에 기본 요금 할인 정책 조합하기
- 두 번째 부가 정책인 기본 요금 할인 정책을 `Phone`의 상속 계층에 추가해본다.
- 일반 요금제와 기본 요금 할인 정책을 조합하고 싶으면 `RegularPhone`을 상속받은 `RateDiscountableRegularPhone` 클래스를 추가한다.

```java
public class RateDiscountableRegularPhone extends RegularPhone {
  private Money discountAmount;

  public RateDiscountableRegularPhone(Money amount, Duration seconds, Money discountAmount) {
    super(amount, seconds);
    this.discountAmount = discountAmount;
  }

  @Override
  public Money afterCalculated(Money fee) {
    return fee.minus(discountAmount);
}
```

- 심야 할인 요금제와 기본 요금 할인 정책을 조합하고 싶으면 `NightlyDiscountPhone`을 상속받는 `RateDiscountableNightlyDiscountPhone` 클래스를 추가하면 된다.

```java
public class RateDiscountableNightlyDiscountPhone extends NightlyDiscountPhone {
  private Money discountAmount;

  public RateDiscountableNightlyDiscountPhone(Money nightlyAmount, Money regularAmount, Duration seconds, Money discountAmount) {
    super(nightlyAmount, regularAmount, seconds);
    this.discountAmount = discountAmount;
  }

  @Override
  public Money afterCalculated(Money fee) {
    return fee.minus(discountAmount);
}
```

- 이번에도 부가 정책을 구현한 `RateDiscountableNightlyDiscountPhone` 클래스와 `RateDiscountableRegularPhone` 클래스 사이에 중복 코드를 추가했다.

### 🎈 중복 코드의 덫에 걸리다
- 부가 정책은 자유롭게 조합할 수 있어야 하고 적용되는 순서 역시 임의로 결정할 수 있어야 한다.
- 상속을 이용한 해결 방법은 모든 가능한 조합별로 자식 클래스를 하나씩 추가하는 것이다. 굉장히 복잡해질 것이다.
- 하지만 복잡성보다 더 큰 문제는 바로 새로운 정책을 추가하기가 어렵다는 것이다.
- 현재의 설계에 새로운 정책을 추가하기 위해서는 불필요한 많은 수의 클래스를 상속 계층 안에 추가해야 한다.
- 상속의 남용으로 하나의 기능을 추가하기 위해 필요 이상으로 많은 수의 클래스를 추가해야하는 경우를 가리켜 **클래스 폭발**(**class explosion**) 문제 또는 **조합의 폭발**(**combinational explosion**) 문제라고 부른다.
- 클래스 폭발 문제는 자식 클래스가 부모 클래스의 구현에 강하게 결합되도록 강요하는 상속의 근본적인 한계 떄문에 발생하는 문제다. 컴파일타임에 결정된 자식 클래스와 부모 클래스 사이의 관계는 변경될 수 없기 때문에 자식 클래스와 부모 클래스의 다양한 조합이 필요한 상황에서 유일한 해결 방법은 조합의 수만큼 새로운 클래스를 추가하는 것뿐이다.
- 클래스 폭발 문제는 새로운 기능을 추가할 때뿐만 아니라 기능을 수정할 떄도 문제가 된다. 만약 세금 정책이 변경된다면 관련된 코드가 여러 클래스 안에 중복돼 있기 때문에 모두 찾아 동일한 방식으로 수정해야 한다.
- 이 문제를 해결할 수 있는 최선의 방법은 상속을 포기하는 것이다.