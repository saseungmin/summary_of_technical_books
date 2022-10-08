---
sidebar_position: 11
---


# 🍭 Chapter 10: 클래스

## 🎃 클래스 체계

### 🎈 캡슐화
변수와 유틸리티 함수는 가능한 공개하지 않는 편이 낫지만 반드시 숨겨야 한다는 법칙도 없다.
때로는 변수나 유티리티 함수를 `protected`로 선언하여 테스트 코드에 접근을 허용하기도 한다.
우리에게 테스트는 아주 중요하다.
같은 패키지 안에서 테스트 코드가 함수를 호출하거나 변수를 사용해야 한다면 그 함수나 변수를 `protected`로 선언하거나 패키지 전체로 공개한다.
하지만 그 전에 비공개 상태를 유지할 온갖 방법을 강구해야 한다. 캡슐화를 풀어주는 결정은 언제나 최후의 수단이다.   

## 🎃 클래스는 작아야 한다!
클래스는 만들 때 첫 번째 규칙은 크기다. **클래스는 작아야 한다**.<br>
두 번째 규칙도 크기다. **더 작아야 한다**.<br>

앞서 **함수** 장에서 했던 이야기를 되풀이할 의도는 없다. 단지 클래스를 설계할 때도, 함수와 마찬가지로, '작게'가 기본 규칙이라는 의미다.<br>
그렇다면 가장 먼저 떠오르는 의문은, 함수와 마찬가지로, `얼마나 작아야 하는가?`겠다.   

함수는 물리적인 행 수로 크기를 측정했다.<br>
<details>
    <summary>클래스는 맡은 <b>책임</b><sup id="a1">1</sup>을 센다.</summary>
    <sup id="a1">1</sup> : [RDD] : Object Design: Roles, Responsibilities, and Collaborations, Rebecca WirfsBrock et al., Addison-Wesley, 2002.
 </details>

```java
public class SuperDashboard extends JFrame implements MetaDataUser {
  public Component getLastFocusedComponent()
  public void setLastFocused(Component lastFocused)
  public int getMajorVersionNumber()
  public int getMinorVersionNumber()
  public int getBuildNumber()
}
```

메서드 다섯 개 정도면 괜찮다. 안 그런가? 여기서는 아니다. `SuperDashboard`는 메서드 수가 작음에도 불구하고 **책임**이 너무 많다.   

클래스 이름은 해당 클래스 책임을 기술해야 한다. 실제로 작명은 클래스 크기를 줄이는 첫 번째 관문이다. 간결한 이름이 떠오르지 않는다면 필경 클래스 크기가 너무 커서 그렇다. 클래스 이름이 모호하다면 필경 클래스 책임이 너무 많아서다.   

또한 클래스 설명은 만일(if), 그리고(and), -(하)며(or), 하지만(but)을 사용하지 않고서 25단어 내외로 가능해야 한다.   

### 🎈 단일 책임 원칙
단일 책임 원칙(SRP)은 클래스나 모듈을 **변경할 이유**가 하나, 단 하나뿐이어야 한다는 원칙이다. SRP는 책임이라는 개념을 정의하며 적절한 클래스 크기를 제시한다. 클래스는 책임, 즉 변경할 이유가 하나여야 한다는 의미다.   

`SuperDashboard`는 변경할 이유가 두 가지다. 첫째, `SuperDashboard`는 소프트웨어 버전을 추적한다. 그런데 버전 정보는 소프트웨어를 출시할 때마다 달라진다. 둘째, `SuperDashboard`는 자바 스윙 컴포넌트를 관리하다. 즉, 스윙 코드를 변경할 때마다 버전 번호가 달라진다.   

책임, 즉 변경할 이유를 파악하려 애쓰다 보면 코드를 추상화하기도 쉬워진다. 더 좋은 추상화가 더 쉽게 떠오른다. `SuperDashboard`에서 버전 정보를 다루는 메서드 세 개를 따로 빼내 `Version`이라는 독자적인 클래스를 만든다. `Version` 클래스는 다른 애플리케이션에서 재사용하기 아주 쉬운 구조다!

```java
public class Version {
  public int getMajorVersionNumber()
  public int getMinorVersionNumber()
  public int getBuildNumber()
}
```

SRP는 객체 지향 설계에서 더욱 중요한 개념이다. 우리는 수많은 책임을 떠안은 클래스를 꾸준히 접한다. 관심사를 분리하는 작업은 프로그램만이 아니라 프로그래밍 활동에서도 마찬가지로 중요하다.   

규모가 어느 수준에 이르는 시스템은 논리가 많고도 복잡하다. 이런 복잡성을 다루려면 체계적인 정리가 필수다. 그래야 개발자가 무엇이 어디에 있는지 쉽게 찾는다. 그래야 (변경을 가할 때) 직접 영향이 미치는 컴포넌트만 이해해도 충분하다. 큼직한 다목적 클래스 몇 개로 이뤄진 시스템은 당장 알 필요가 없는 사실까지 들이밀어 독자를 방해한다.   

큰 클래스 몇 개가 아니라 작은 클래스 여럿으로 이뤄진 시스템이 더 바람직하다. 작은 클래스는 각자 맡은 책임이 하나며, 변경할 이유가 하나며, 다른 작은 클래스와 협력해 시스템에 필요한 동작을 수행한다.   

### 🎈 응집도(Cohesion)
클래스는 인스턴스 변수 수가 작아야 한다. 각 클래스 메서드는 클래스 인스턴스 변수를 하나 이상 사용해야 한다. 일반적으로 메서드가 변수를 더 많이 사용할수록 메서드와 클래스는 응집도가 더 높다. 모든 인스턴스 변수를 메서드마다 사용하는 클래스는 응집도가 가장 높다.   

일반적으로 이처럼 응집도가 가장 높은 클래스는 가능하지도 바람직하지도 않다. 그렇지만 우리는 응집도가 높은 클래스를 선호한다. 응집도가 높다는 말은 클래스에 속한 메서드와 변수가 서로 의존하며 논리적인 단위로 묶인다는 의미기 때문이다.   

아래 예제 코드는 `Stack`을 구현한 코드다. 아래 클래스는 응집도가 아주 높다. `size()`를 제외한 다른 두 메서드는 두 변수를 모두 사용한다.

```java
public class Stack {
  private int topOfStack = 0;
  List<Integer> elements = new LinkedList<Integer>();

  public int size() {
    return topOfStack;
  }

  public void push(int element) {
    topOfStack++;
    elements.add(element);
  }

  public int pop() throws PoppedWhenEmpty {
    if (topOfStack == 0)
      throw new PoppedWhenEmpty();
    int element = elements.get(--topOfStack);
    elements.remove(topOfStack);
    return element;
  }
}
```

'함수를 작게, 매개변수 목록을 짧게'라는 전략을 따르다 보면 때때로 몇몇 메서드만이 사용하는 인스턴스 변수가 아주 많아진다. 이는 십중팔구 새로운 클래스로 쪼개야 한다는 신호다. 응집도가 높아지도록 변수와 메서드를 적절히 분리해 새로운 클래스 두세 개로 쪼개준다.

### 🎈 응집도를 유지하면 작은 클래스 여럿이 나온다
큰 함수를 작은 함수 여럿으로 나누기만 해도 클래스 수가 많아진다. 만약 네 변수를 클래스 인스턴스 변수로 승격한다면 새 함수는 인수가 **필요없다**. 그만큼 함수를 쪼개기 **쉬워진다**.   

불행히도 이렇게 하면 클래스가 응집력을 잃는다. 몇몇 함수만 사용하는 인스턴스 변수가 점점 더 늘어나기 때문이다. 그런데 잠깐만! 몇몇 함수가 몇몇 변수만 사용한다면 독자적인 클래스로 분리해도 되지 않는가? 당연하다. 클래스가 응집력을 잃는다면 쪼개라!   

그래서 큰 함수를 작은 함수 여럿으로 쪼개다 보면 종종 작은 클래스 여럿으로 쪼갤 기회가 생긴가. 그러면서 프로그램에 점점 더 체계가 잡히고 구조가 투명해진다.   

리팩터링 후 가장 먼저 눈에 띄는 변화가 프로그램이 길어졌다는 사실이다. 길이가 늘어난 이유는 여러 가지다. 첫째, 리팩터링한 프로그램은 좀 더 길고 서술적인 변수 이름을 사용한다. 둘째, 리팩터링한 프로그램은 코드 주석을 추가하는 수단으로 함수 선언과 클래스 선언을 활용한다. 셋째, 가독성을 높이고자 공백을 추가하고 형식을 맞추었다.   

가장 먼저, 원래 프로그램의 정확한 동작을 검증하는 테스트 슈트를 작성했다. 그런 다음, 한 번에 하나씩 수 차례에 걸쳐 조금씩 코드를 변경했다. 코드를 변경할 때마다 테스트를 수행해 원래 프로그램과 동일하게 동작하는지 확인했다. 조금씩 원래 프로그램을 정리한 결과 최종 프로그램이 얻어졌다.

## 🎃 변경하기 쉬운 클래스
대대수 시스템은 지속적인 변경이 가해진다. 그리고 뭔가 변경할 때마다 시스템이 의도대로 동작하지 않을 위험이 따른다. 깨끗한 시스템은 클래스를 체계적으로 정리해 변경에 수반하는 위험을 낮춘다.   

아래 코드는 주어진 메타 자료로 적절한 SQL 문자열을 만드는 Sql 클래스다. 아직 미완성이라 update 문과 같은 일부 SQL 기능을 지원하지 않는다. 언젠가 update 문을 지원할 시점이 오면 클래스에 '손대어' 고쳐야 한다. 문제는 '손대면' 위험이 생긴다는 사실이다. 어떤 변경이든 클래스에 손대면 다른 코드를 망가뜨릴 잠정적인 위험이 존재한다. 그래서 테스트도 완전히 다시 해야 한다.

```java
public class Sql {
  public Sql(String table, Column[] columns)
  public String create()
  public String insert(Object[] fields)
  public String selectAll()
  public String findByKey(String keyColumn, String keyValue)
  public String select(Column column, String pattern)
  public String select(Criteria criteria)
  public String preparedInsert()
  private String columnList(Column[] columns)
  private String valuesList(Object[] fields, final Column[] columns)
  private String selectWithCriteria(String criteria)
  private String placeholderList(Column[] columns)
}
```

새로운 SQL 문을 지원하려면 반드시 Sql 클래스에 손대야 한다. 또한 기존 SQL문 하나를 수정할 때도 반드시 Sql 클래스에 손대야 한다. 이렇듯 변경할 이유가 두 가지이므로 Sql 클래스는 SRP를 위반한다.   

단순히 구조적인 관점에서도 Sql은 SRP를 위반한다. 메서드를 쭉 훑어보면 `selectWithCriteria`라는 비공개 메서드가 있는데, 이 메서드는 `select` 문을 처리할 때만 사용한다.   

다음 예제는 어떨까? 공개 인터페이스를 각각 Sql 클래스에서 파생하는 클래스로 만들었다. `valueList`와 같은 비공개 메서드는 해당하는 파생 클래스로 옮겼다. 모든 파생 클래스가 공통으로 사용하는 비공개 메서드는 `Where`와 `ColumnList`라는 두 유틸리티 클래스에 넣었다.

```java
abstract public class Sql {
  public Sql(String table, Column[] columns)
  abstract public String generate();
}

public class CreateSql extends Sql {
  public CreateSql(String table, Column[] columns)
  @Override public String generate()
}

public class SelectSql extends Sql {
  public SelectSql(String table, Column[] columns)
  @Override public String generate()
}

public class InsertSql extends Sql {
  public InsertSql(String table, Column[] columns, Object[] fields)
  @Override public String generate()
  private String valuesList(Object[] fields, final Column[] columns)
}

public class SelectWithCriteriaSql extends Sql {
  public SelectWithCriteriaSql(
    String table, Column[] columns, Column column, String pattern
  )
  @Override public String generate()
}

public class SelectWithMatchSql extends Sql {
  public SelectWithMatchSql(
    String table, Column[] columns, Column column, String pattern
  )
  @Override public String generate()
}

public class FindByKeySql extends Sql {
  public FindByKeySql(
    String table, Column[] columns, String keyColumn, String keyValue
  )
  @Override public String generate()
}

public class PreparedInsertSql extends Sql {
  public PreparedInsertSql(String table, Column[] columns)
  @Override public String generate() {
    private String placeholderList(Column[] columns)
  }
}

public class Where {
  public Where(String criteria)
  public String generate()
}

public class ColumnList {
  public ColumnList(Column[] columns)
  public String generate()
}
```

각 클래스는 극도로 단순하다. 코드는 순식간에 이해된다. 함수 하나를 수정했다고 다른 함수가 망가질 위험도 사실상 사라졌다. 테스트 관점에서 모든 논리를 구석구석 증명하기도 쉬워졌다. 클래스가 서로 분리되었기 떄문이다.   

update 문을 추가할 떄 기존 클래스를 변경할 필요가 전혀 없다는 사실 역시 중요하다! update 문을 만드는 논리는 Sql 클래스에서 새 클래스 UpdateSql을 상속받아 거기에 넣으면 그만이다. update 문을 지원해도 다른 코드가 망가질 염려는 전혀 없다.   

위 예제처럼 재구성한 Sql 클래스는 세상의 모든 장점만 취한다! 우선 SRP를 지원한다. 여기다 객체 지향 설계에서 또 다른 핵심 원칙인 OCP도 지원한다. OCP란 클래스는 확장에 개방적이고 수정에 폐쇄적이어야 한다는 원칙이다.   

새 기능을 수정하거나 기존 기능을 변경할 때 건드릴 코드가 최소인 시스템 구조가 바람직하다. 이상적인 시스템이라면 새 기능을 추가할 때 시스템을 확장할 뿐 기존 코드를 변경하지는 않는다.

### 🎈 변경으로부터 격리
요구사항은 변하기 마련이다. 따라서 코드도 변하기 마련이다. 객체 지향 프로그래밍 입문에서 우리는 구체적인 클래스와 추상 클래스가 있다고 배웠다. 구체적인 클래스는 상세한 구현을 포함하며 추상 클래스는 개념만 포함한다고도 배웠다. 상세한 구현에 의존하는 클라이언트 클래스는 구현이 바뀌면 위험에 빠진다. 그래서 우리는 인터페이스와 추상 클래스를 사용해 구현이 미치는 영향을 격리한다.   

상세한 구현에 의존하는 코드는 테스트가 어렵다. 예를 들어, `Portfolio` 클래스를 만든다고 가정하자. 그런데 `Portfolio` 클래스는 외부 `TokyoStockExchange` API를 사용해 포트폴리오 값을 계산한다. 따라서 우리 테스트 코드는 시세 변화에 영향을 받는다. 5분마다 값이 달라지므로 API로 테스트 코드를 짜기란 쉽지 않다.   

`Portfolio` 클래스에서 `TokyoStockExchange` API를 직접 호출하는 대신 `StockExchange`라는 인터페이스를 생성한 후 메서드 하나를 선언한다.

```java
public interface StockExchange {
  Money currentPrice(String symbol);
}
```

다음으로 `StockExchange` 인터페이스를 구현하는 `TokyoStockExchange` 클래스를 구현한다. 또한 `Portfolio` 생성자를 수정해 `StockExchange` 참조자를 인수로 받는다.

```java
public Portfolio {
  private StockExchange exchange;
  public Portfolio(StockExchange exchange) {
    this.exchange = exchange;
  }
  // ...
}
```

이제 `TokyoStockExchange` 클래스를 흉내내는 테스트용 클래스를 만들 수 있다. 테스트용 클래스는 `StockExchange` 인터페이스를 구현하며 고정된 주가를 반환한다. 테스트에서 마이크로소프트 주식 다섯 주를 구입한다면 테스트용 클래스는 주가로 언제나 100불을 반환한다. 우리 테스트용 클래스는 단순히 미리 정해놓은 표 값을 참조한다. 그러므로 우리는 전체 포트폴리오 총계가 500불인지 확인하는 테스트 코드를 작성할 수 있다.

```java
public class PortfolioTest {
  private FixedStockExchangeStub exchange;
  private Portfolio portfolio;

  @Before
  protected void setUp() throws Exception {
    exchange = new FixedStockExchangeStub();
    exchange.fix("MSFT", 100);
    portfolio = new Portfolio(exchange);
  }

  @Test
  public void GivenFiveMSFTTotalShouldBe500() throws Exception {
    portfolio.add(5, "MSFT");
    Assert.assertEquals(500, portfolio.value());
  }
}
```

위와 같은 테스트가 가능할 정도로 시스템의 결합도를 낮추면 유연성과 재사용성도 더욱 높아진다. 결합도가 낮다는 소리는 각 시스템 요소가 다른 요소로부터 그리고 변경으로부터 잘 격리되어 있다는 의미다. 시스템 요소가 서로 잘 격리되어 있으면 각 요소를 이해하기도 더 쉬워진다.   

이렇게 결합도를 최소로 줄이면 자연스럽게 또 다른 클래스 설계 원칙인 DIP(Dependency Inversion Principle)를 따르는 클래스가 나온다. 본질적으로는 DIP는 클래스가 상세한 구현이 아니라 추상화에 의존해야 한다는 원칙이다. 우리가 개선한 `Portfolio` 클래스는 `TokyoStockExchange`라는 상세한 구현 클래스가 아니라 `StockExchange` 인터페이스에 의존한다. `StockExchange` 인터페이스는 주석 기호를 받아 현재 주식 가격을 반환한다는 추상적인 개념을 표현한다. 이와 같은 추상화로 실제로 주가를 얻어오는 출처나 얻어오는 방식 등과 같은 구체적인 사실을 모두 숨긴다.
