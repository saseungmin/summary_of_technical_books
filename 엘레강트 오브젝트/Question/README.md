## 🎯 Chapter 1: Birth
  
#### 🦄 -er로 끝나는 이름을 사용하지 말아야 하는 이유는?
- `-er`을 사용하여 객체의 이름을 짓는 방법은 클래스의 객체들이 무엇을 하고 있는지 살펴본 후 기능에 기반에서 이름을 짓는 방법이다. **클래스의 이름은 객체가 노출하고 있는 기능에 기반해서는 안된다.**
- 클래스의 이름은 무엇을 해야 하는지가 아니라 **무엇인지에 기반해야 한다.**

```java
class Cash {
  private int dollars;
  Cash(int dlr) {
    this.dollars = dlr;
  }

  public String usd() {
    return String.format("$ %d", this.dollars);
  }
}
```

- 객체는 객체의 외부 세계와 내부 세계를 이어주는 연결장치가 아니라 객체는 캡슐화된 데이터의 대표자이다. 즉, 대표자는 **스스로 결정을 내리고 행동할 수 있는 자립적인 엔티티이다.**
- 만약 클래스의 이름이 `-er`로 끝나면, 이 클래스의 인스턴스는 실제로는 객체가 아니라 어떤 데이터를 다루는 절차들의 집합일 뿐이다.

#### 🦄 constructor란?
- `constructor`는 새로운 객체에 대한 진입점으로 몇 개의 인자를 전달받아, 어떤 일을 수행한 후, 임무를 수행할 수 있도록 객체를 준비시킨다.
- `constructor`의 주된 작업은 제공된 인자를 사용해서 캡슐화하고 있는 프로퍼티를 초기화하는 일이다.

```java
class Cash {
  private int dollar;
  Cash(int dlr) {
    this.dollars = dlr;
  }
}
```

#### 🦄 constructor는 몇 개가 적당한가?
- 2~3개의 메서드와 5~10개의 `constructor`를 포함하는 것이 적당하다. `constructor`의 개수가 많아질 수록 더 개선되고, 사용자 입장에서 클래스를 더 편하게 사용할 수 있지만, 메서드가 많아질수록 클래스는 사용하기는 더 어려워진다. 즉, 단일 책임 원칙을 위반하게 된다.

#### 🦄 생성자 하나만 주 생성자로 만들어야 하는 이유?

- 초기화 로직을 단 하나의 `constructor`에만 위치시키고 그 `constructor`를 주 `constructor`라고 부른다.
- 그리고 부 `constructor`라고 부르는 다른 `constructor`들이 이 주 `constructor`를 호출하도록 만들어야 한다.

```java
class Cash {
  private int dollars;

  Cash(float dlr) { // 부
    this((int) dlr);
  }

  Cash(String dlr) { // 부
    this(Cash.parse(dlr));
  }

  Cash(int dlr) { // 주 constructor
    this.dollars = dlr;
  }
}
```

- 중복 코드를 방지하고 설계를 더 간결하게 만들기 때문에 유지보수성이 향상된다는 것이다.
- 내부의 프로퍼티는 오직 한 곳에서만 초기화해야 한다는 핵심 원칙이다.

#### 🦄 생성자에 코드를 넣지 말아야 하는 이유는?
- 주 `constructor`에는 객체 초기화 프로세스를 시작하는 유일한 장소이기 때문에 인자들은 완전해야 한다. 즉, 인자에 손을 대지말아야 한다.
- `constructor`는 어떤 일을 수행하는 곳이 아니기 때문에 `constructor` 안에서 인자에게 어떤 작업을 요청해서는 안된다. 다시 말해서 생성자는 코드가 없어야하고, 오직 할당문만 포함해야 한다.
- 그 이유의 첫번째는 `constructor`에 코드가 없을 경우 **성능 최적화가 더 쉽기 때문에 코드의 실행 속도가 더 빨라진다.**

```java
class StringAsInteger implements Number {
  private String text;

  public StringAsInteger(String txt) {
    this.text = txt;
  }

  public int intValue() {
    return Integer.parseInt(this.text);
  }
}

Number num = new StringAsInteger("123");
num.intValue();
num.intValue();
```

- 텍스트 파싱은 객체를 초기화하는 시점에 단 한 번 수행하기 때문에 실제로 더 효율적이다. `constructor`에서 직접 파싱하는 경우는 객체를 만들 떄마다 파싱이 수행되기 때문에 실행 여부를 제어할 수 없다.
- 인자를 전달된 상태 그대로 캡슐화하고 나중에 요청이 있을 때 파싱하도록 하면, 클래스의 사용자들이 파싱 시점을 자유롭게 결정할 수 있게 된다.
- **객체를 인스턴스화하는 동안에 객체를 만드는 일 이외에는 어떤 일도 수행하지 않는다.** 실제 작업은 객체의 메서드가 수행. 과정을 직접 제어 가능. 객체를 이해하고 재사용도 쉬워진다.


## 🎯 Chapter 2: Education

#### 🦄 객체의 상태 또는 식별자란?
- 내부에 캡슐화된 객체 전체를 가리킨다.

```java
class Cash {
  // 3개의 객체를 캡슐화하고 있다.
  private Integer digits;
  private Integer cents;
  private String currency;
}
```

#### 🦄 가능하다면 캡슐화를 적게 해야하는 이유
- 복잡성이 높을수록 유지보수성이 저하되고, 시간과 돈이 낭비되며, 고객 만족또가 떨어진다. 때문에 4개이하의 객체를 캡슐화해야 한다.
- 최대가 4개인 이유는 직관에 위배된다. 더 많은 객체가 필요하다면, 클래스를 더 작은 클래스로 분해해야 한다.

#### 🦄 최소한 뭔가는 캡슐화를 해야하는 이유
- 캡슐화 되지 않은 클래스는 아무런 상태와 식별자도 가지지 않고 오직 행동만을 포함하게 된다.
- 만약 객체가 어떤 것도 캡슐화하지 않는다면 객체의 좌표는 객체 자신이 세계 전체가 되어야 한다.
- 오직 하나의 세계만 존재할 수 있기 때문에 이 클래스는 오직 하나만 존재해야 한다.

```java
class Universe {

}
```

- **자기 자신을 식별**할 수 있도록 다른 객체들을 캡슐화해야 한다.

#### 🦄 객체 분리란?
- 상호작용하는 **다른 객체를 수정하지 않고도** 해당 객체를 수정할 수 있도록 만든다는 것을 의미한다.
- 이를 가능하게 하는 도구가 인터페이스이다.

#### 🦄 인터페이스를 사용하는 이유?
- `Cash`는 인터페이스로 객체가 다른 객체와 의사소통하기 위해 따라야하는 계약이다.

```java
interface Cash {
  Cash multiply(float factor);
}

class DefaultCash implements Cash {
  private int dollars;

  DefaultCash(int dlr) {
    this.dollars = dlr;
  }

  // 계약에 의존
  @Override
  Cash multiply(float factor) {
    return new DefaultCash(this.dollars * factor);
  }
}
```

- 인터페이스를 사용하면 `Cash` 인터페이스에 대해서 아무런 관심도 가질 필요도 없고 동작하는지도 관심이 없다. 때문에 느슨하게 분리할 수 있다.

#### 🦄 빌더란?
- 빌더란 뭔가를 만들고 새로운 객체를 반환하는 메서드를 가리킨다. 항상 무언가를 반환해야 한다.
- 절대 반환 타입이 `void`가 될 수 없으며, 이름은 항상 명사여야 한다.

```java
int pow(int base, int power);
float speed();
Employee employee(int id);
String parsedCell(int x, int y); // 형용사인 parsed가 명사인 cell을 꾸미고 있을 뿐 명사다.
```

#### 🦄 조정자란?
- 객체로 추상화한 실세계 엔티티를 수정하는 메서드를 조정자라고 부른다.
- 반환 타입은 항상 `void`여야 하고, 이름은 항상 **동사**이다.

```java
void save(String content);
void put(String key, Float value);
void remove(Employee emp);
void quicklyPrint(int id); // 부사의 꾸밈을 받는 동사
```

#### 🦄 Boolean 값을 결과로 반환하는 경우엔 메서드의 이름을 어떻게 지어야 할까?
- 이들은 값을 반환하기 떄문에 빌더에 속하지만 가독성 측면에서 이름을 형용사로 지어야 한다.

```java
boolean empty(); // is empty
boolean readable(); // is readable
boolean negative(); // is negative
```

#### 🦄 메서드 이름을 정할 때 주의사항은?
- 먼저 메서드의 목적이 무엇인지를 확인하고, 메서드는 빌더나 조정자, 둘 중 하나여야 한다. 절대로 빌더인 동시에 조정자이면 안된다. 빌더는 명사로, 조정자는 동사로 지어야 한다.
- boolean 은 예외로 형옹사로 지어야 한다.


#### 🦄 퍼블릭 상수를 사용하지 말아야 하는 이유는?
- 객체는 어떤 것도 공유해서는 안된다. 대신 독립적이어야하고 닫혀 있어야 한다.
- 상수를 이용한 공유 메커니즘은 캡슐화와 객체지향적인 사고 전체를 부정하는 일이다.

```java
public class Constants {
  public static final String EOL = "\r\n";
}
```

- `public`이기 때문에 클래스 로더에 의해 로딩된 모든 클래스들이 상수에 접근할 수 있다. 퍼블릭 상수를 재사용할 수 있다. 하지만 결합도는 높아졌고 응집도는 낮아졌다.

```java
class Records {
  void write(Writer out) {
    for (Record rec: this.all) {
      out.write(rec.toString());
      out.write(Constants.EOL); // here!
    }
  }
}

class Rows {
  void print(PrintStream pnt) {
    for (Row row: this.fetch()) {
      pnt.printf(
        "{ %s }%s", row, Constants.EOL // here!
      );
    }
  }
}
```

- 두 클래스는 같은 객체에 의존하고 있으며 이 의존성은 하드코딩되어 있다.
- 퍼블릭 상수를 이용하면 객체의 응집도는 낮아진다. (객체가 자신의 문제를 해결하는데 덜 집중한다.)
- 필요없이 더 많은 코드를 작성해야 한다. 의도했던 목적과 동떨어져 있을 수 밖에 없다.

#### 🦄 퍼블릭 상수를 사용하지 않고 어떻게 해결해야 할까?
- 기능을 공유할 수 있도록 새로운 클래스를 만들어야 한다.

```java
// 기능을 공통으로 제공한 새로운 클래스를 추가
class EOLString {
  private final String origin;
  EOLString(String src) {
    this.origin = src;
  }

  @Override
  String toString() {
    return String.format("%S\r\n", origin);
  }
}
```
- 필요한 곳에서 사용할 수 있다.

```java
class Records {
  void write(Writer out) {
    for (Record rec: this all) {
      out.write(new EOLString(rec.toString()));
    }
  }
}

class Rows {
  void print(PrintStream pnt) {
    for (Row row: this.fetch()) {
      pnt.printf(
        new EOLString(
          String.format("{ %s }", row)
        )
      );
    }
  }
}
```
- 줄 마지막에 정확하게 추가하는 방법에 관해서는 `EOLString`이 책임을 진다.
- `EOLString`에 대한 결합은 계약을 통해 추가된 것이며, 계약에 의한 결합은 언제라도 분리가 가능하기 때문에 유지보수성을 저하시키지 않는다.

#### 🦄 불변 객체란?
- 인스턴스를 생성한 후에 상태를 변경할 수 없는 객체
- 불변 객체를 사용하면 크기가 작고, 응집력이 높으며, 느슨하게 결합되고, 유지보수하기 쉬운 클래스를 만들 수 있다.

```java
class Cash {
  private final int dollars;

  Cash(int val) {
    this.dollars = val;
  }
}
```

- 불변 객체는 자기 자신을 수정할 수 없고 항상 원하는 상태를 가지는 새로운 객체를 생성해서 반환해야 한다.

#### 🦄 식별자 가변성이란?
- 식별자 가변성이란 두 객체를 비교한 후에 한 객체의 상태를 변경할 때 문제가 발생하는데, 더 이상 동일하지 않지만, 여젼히 두 객체가 동일하다고 생각하는 것이다. (혹은 그 반대)
- 불변 객체를 사용하면 객체를 map에 추가한 후에는 상태 변경이 불가능하기 때문에 식별자 가변성 문제가 발생하지 않는다.

#### 🦄 실패 원자성이란?
- 실패 원자성이란 완전하고 견고한 상태의 객체를 가지거나 아니면 실패하거나 둘 중 하나만 가능한 특성이다.
- 불변 객체는 내부의 어떤 것도 수정할 수 없기 때문에 이런 결함이 발생하지 않는다.

```java
class Cash {
  private int dollars;
  private int cents;

  public Cash mul(int factor) {
    if (/* 뭔가 잘못 됐다면 */) {
      throw new RuntimeException("oops...");
    }

    return new Cash(
      this.dollars * factor,
      this.cents * factor
    );
  }
}
```

#### 🦄 시간적 결합이란?

```java
Cash price = new Cash();
price.setDollars(29);
price.setCents(95);
System.out.println(price); // "$29.95"
```
- 각 줄은 특정한 순서로 정렬되어 있다. 각 줄은 시간적인 순서에 따라 서로 결합되어 있다.
- 줄 사이의 시간적 결합을 프로그래머가 기억해야 하는데 이러면 유지보수에 있어서 어려움이 존재한다.
- 불변 객체를 이용하면 문제를 해결할 수 있다.

```java
Cash price = new Cash(29, 95);
System.out.println(price); // "$29.95"
```

- 이렇게 하나의 문장으로 객체를 인스턴스화할 수 있다. 이 경우에는 인스턴스화와 초기화를 분리시킬 수 없다. 항상 함께 실행되어야 한다. 순서도 변경할 수 없다.

#### 🦄 불변 객체를 사용해서 부수 효과를 제거
- 불변 객체가 아니면 문제가 발생한 지점을 찾기 위해서 수정한 곳을 모두 디버깅 해야 하지만, 불변으로 만들면 어떤 누구도 객체를 수정할 수 없다.
- 코드가 제대로 동작하지 않아도 부수효과가 발생한 위치를 찾을 필요가 없다.

#### 🦄 스레드 안정성(Thread Safety)이란?
- 여러 스레드에서 동시에 사용될 수 있으며 그 결과를 항상 예측가능하도록 유지할 수 있는 객체의 품질을 의미한다.
- 불변 객체는 실행 시점에 상태를 상태를 수정할 수 없게 금지함으로써 결과를 항상 예측가능하도록 유지할 수 있다.

## 🎯 Chapter 3: 취업

### 🦄 5개 이하의 public 메서드만 노출해야되는 이유
- 5개라는 숫자가 중요한것은 아니다. 클래스를 작게 만드는 것이 중요하다. 이때 클래스의 크기를 결정하는 기준이 public 메서드일 뿐이다. 작게 만들면 실수할 가능성이 줄어든다. 10개 메서드 보단 3개의 메서드가 더 만들기 쉽다.
- 코드가 적기 때문에 유지보수가 쉽다.
- 응집도가 높아진다. 각각의 메서드가 클래스의 모든 프로퍼티를 사용한다.
- 테스트하기 쉽다.

### 🦄 정적 메서드를 사용하지 말아야하는 이유
- 정적 메서드를 사용시 소프트웨어 유지보수를 어렵게 만든다.
- 규모가 커지면 순차적인 사고방식은 한계에 직면한다. 정적 메서드는 이런 순차적인 사고방식과 동일하다.
- 객체지향적으로 생각하기에서는 그저 누가 누구인지만 정의하고 객체들이 필요할 때 스스로 상호작용하도록 제어를 위임한다.
- 정적 메서드는 명령형 프로그래밍이다. 호출 즉시 결과를 반환
- 정적 메서드는 조합이 불가능하다. 작은 객체를 조합해서 더 큰 객체를 만들 수 없다.

#### 🎈 선언형 프로그래밍
- 무엇인지만 정의하고 사용자가 계산하는 시점을 결정한다. 무엇인지만 선언. 어떤 일을 하라고 지시하지 않고 오직 선언만 한다. 제어를 서술하지 않고 로직만 표현

#### 🎈 선언형 프로그래밍이 명령형 방식보다 더 좋은 이유는?
- 선언형 방식이 우리가 직접 성능 최적화를 제어할 수 있기 때문에 더 빠르다.
- 다수의 정적 메서드를 호출해야하는 경우 작업을 완료하는데 필요한 모든 정적 메서드를 순차적으로 호출해야만 한다.
- 선언형은 실제로 필요한 시점에 위치를 결정하도록 위임하고, CPU는 요청이 있을 경우에만 계산을 실행한다.
- 또 다른 이유는 다형성 때문이다. 선언형은 생성자의 인자로 객체를 전달할 수는 있지만, 정적 메서드는 전달이 불가능하다. 객체 사이의 결합도를 낮출 수 있다.
- 명령형 방식에서 결과를 예상하기 위해서는 먼저 코드를 실행해야 하기 떄문에 선언형 방식보다 덜 직관적이다. (표현력)
- 코드의 응집도 때문이다. 계산을 책임ㅁ지는 모든 코드들은 뭉쳐 있다. 실수로 코드의 순서를 쉽게 변경할 수 없다.

#### 🎈 다형성이란
- 코드 블록 사이의 의존성을 끊을 수 있는 능력

#### 🎈 유틸리티 클래스
- 편의를 위해 다른 메서드들이 사용하는 정적 메서드들을 모아 놓은 정적 메서드들의 컬렉션 (`java.lang.Math`)

#### 🎈 싱글톤 패턴
- 싱글톤 패턴은 안티 패턴이다.
- 싱글톤과 유틸리티 클래스의 핵심적인 차이는 싱글톤은 분리 가능한 의존성으로 연결되어 있는데 반해, 유틸리티 클래스는 분리가 불가능한 하드코딩된 결합도를 가진다.
- 싱글톤은 전역 변수이다. Java에서 전역변수를 사용할 수 없지만 사용할 수 있는 방법을 발견했고, 그 결과로 만들어진 것이 싱글톤이다.
- 때문에 정적 메서드가 기술적으로 싱글톤이라는 속임수를 가능하게 한 것이다.
- 캡슐화를 사용하자.

## 🦄 인자의 값으로 NULL을 허용하지 말아야 하는 이유
- 객체에게 이야기를 하는 대신 이 객체를 피하고 무시한다. `== null`을 하면 객체에게 직접 얘기를 하지 않게 된다.
- 인자에 `NULL`을 허용하면 비교문을 사용할 수 밖에 없다. `NULL` 여부를 체크함으로써 객체가 맡아야 하는 상당량의 책임을 빼았게 된다.
- NULL 확인 로직으로 코드를 오염시키면 안된다.
- 존재하지 않는 인자 문제는 널 객체를 이용해서 해결해야 한다.