---
sidebar_position: 3
---

# 🌈 Chapter 2: Education

### 🦄 가능하다면 적게 캡슐화하세요
- 복잡성이 높을수록 유지보수성이 저하되고, 시간과 돈이 낭비되며, 고객 만족도가 떨어진다. 때문에 4개 또는 그 이하의 객체를 캡슐화할 것을 권장한다.
- 내부에 캡슐화된 객체 전체를 가리켜 객체의 상태 또는 식별자라고 부른다.

```java
class Cash {
  // 3개의 객체를 캡슐화하고 있다.
  private Integer digits;
  private Integer cents;
  private String currency;
}
```
- 동일한 값의 달러, 센트, 통화를 캡슐화하는 `Cash` 클래스의 두 객체는 서로 동일하다는 뜻이다.

```java
Cash x = new Cash(29, 95, "USD");
Cash y = new Cash(29, 95, "USD");

assert x.equals(y);
assert x == y;
```

- 위 예제는 두 객체 `x`와 `y`의 상태는 동일하지만 식별자는 서로 다르다. `==`연산자와 `equals`로 두 객체가 서로 동일하지 않다고 판단한다.
- Java를 비롯한 OOP 언어에서 객체는 단지 메서드가 추가된 데이터의 집합일 뿐이다. 데이터의 저장 여부와 상관없이 복사본을 비교하는 경우에도 다르다.

```java
Object x = new Object();
Object y = new Object();

assert x.equals(y); // 실패
```
- 내부에 캡슐화된 모든 객체들이 객체의 식별자를 구성하는 요소라는 사실에 동의한다면, 이제 캡슐화하기에 적합한 객체의 수를 결정해야 한다.
- 최대 4개가 합리적인 이유는 4개 이상의 자표는 직관에 위배된다는 사실이다.(사람은 이름, 생년월일 / 자동차는 제조사, 모델, 제조년도)
- 더 많은 객체가 필요하다면, 클래스를 더 작은 클래스들로 분해해야 한다.

### 🦄 최소한 뭔가는 캡슐화하세요
- 다음 예는 캡슐화를 하지 않은 객체이다.

```java
class Year {
  int read() {
    return System.currentTimeMillis()
      / (1000 * 60 * 60 * 24 * 30 * 12) - 1970;
  }
}
```
- 프로퍼티가 없는 클래스는 객체지향 프로그래밍에서 정적 메서드와 유사하다. 이런 클래스는 아무런 상태와 식별자도 가지지 않고 오직 행동만을 포함한다.
- 실행으로부터 인스턴스 생성을 고립시켜야 한다. 다시 말해서 오직 `constructor`에서만 `new`연산자를 허용해야 한다는 뜻이다.

```java
class Year {
  private Millis millis;
  
  Year(Millis msec) {
    this.millis = msec;
  }

  int read() {
    return this.millis.read()
      / (1000 * 60 * 60 * 24 * 30 * 12) - 1970;
  }
}
```
- 객체는 무언가를 캡슐화해야 한다. 이 객체는 자기 자신을 식별할 수 있도록 다른 객체들을 캡슐화해야 한다.
- 만약 객체가 어떤 것도 캡슐화하지 않는다면 객체의 좌표는 객체 자신이 세계 전체가 되어야 한다.

```java
class Universe {

}
```
- 오직 하나의 세계만 존재할 수 있기 때문에 이 클래스는 오직 하나만 존재해야 한다.
- 다음 예제는 완벽한 객체지향 설계를 적용한 모습이다.

```java
class Year {
  private Number num;

  Year(final Millis msec) {
    this.num = new Min(
      new Div(
        msec,
        new Mul(1000, 60, 60, 24, 30, 12)
      ),
      1970
    );
  }

  int read() {
    return this.num.intValue();
  }
}
```

- 또는 다음과 같다.

```java
class Year {
  private Number num;

  Year(final Millis msec) {
    this.num = msec.div(
      1000.mul(60).mul(60).mul(24).mul(30).mul(12)
    ).min(1970);
  }

  int read() {
    return this.num.intValue();
  }
}
```

### 🦄 항상 인터페이스를 사용하세요.
- 객체들은 서로를 필요로 하기 때문에 **결합**된다는 것이다.
- 설계를 시작하는 단계에서 각각의 객체가 어떤 일을 수행해야 하고 다른 객체에게 어떤 서비스를 제공하는 지를 정확하고 알고 있는 편이 낫기 때문에 결합은 유용하지만 객체의 수가 수십 개를 넘거가면서부터 객체 사이의 강한 결합도의 문제가 발생하게 된다.
- 애플리케이션 전체를 유지보수 가능하도록 만들기 위해서는 객체를 **분리해야한다.**
- 객체 분리란 상호작용하는 **다른 객체를 수정하지 않고도** 해당 객체를 수정할 수 있도록 만든다는 것을 의미한다. 이를 가능하게 하는 도구가 바로 **인터페이스**이다.

```java
interface Cash {
  Cash multiply(float factor);
}
```

- `Cash`는 인터페이스로 객체가 다른 객체와 의사소통하기 위해 따라야하는 **계약**이다.

```java
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

- 금액이 필요하다면 실제 구현 대신 계약에 의존하면 된다.

```java
class Employee {
  private Cash salary;
}
```
- `Employee` 클래스는 `Cash` 인터페이스의 구현 방법에 아무런 관심이 없다. 어떻게 동작하는 지도 관심없다. 때문에 느슨하게 분리할 수 있다.
- 추가로 클래스 안의 **모든** 퍼블릭 메서드가 인터페이스를 구현하도록 만들어야 한다. 올바르게 설계된 클래스라면 **최소한 하나의 인터페이스라도 구현하지 않는 퍼블릭 메서드를 포함해서는 안된다.**
- 다음과 같이 설계해서는 안된다.

```java
class Cash {
  public int cents() {
    // 어떤 작업을 수행
  }
}
```
- `cents` 메서드는 어떤 것도 오버라이드하지 않기 때문에 문제가 있다. 이 설계는 클래스의 사용자로 하여금 이 클래스에 강하게 결합되도록 조장한다. 다른 클래스의 객체가 직접적으로 `Cash.cents()`를 사용할 수 밖에 없기 때문에 새로운 메서드를 이용해서 구현을 대체할 수 없다.
- 클래스가 존재하는 이유는 **다른 누군가가 클래스의 서비스를 필요**로 하기 때문이고, 서비스는 계약이자 인터페이스이기 때문에 클래스가 제공하는 서비스는 어딘가에 문서화되어야 한다.
- 동일한 인터페이스를 구현하는 여러 클래스들이 존재한다. 그리고 각각의 경쟁자는 서로 다른 경쟁자를 쉽게 대체할 수 있어야 한다. 이것이 **느슨한 결합도**의 의미이다.

### 🦄 메서드 이름을 신중하게 선택하세요
- 간단한 법칙은 빌더(builder)의 이름은 **명사**로, 조정자(manipulator)의 이름은 **동사**로 짓는 것이다.
- 빌더란 뭔가를 만들고 새로운 객체를 반환하는 메서드를 가리킨다. 빌더는 항상 **뭔가를 반환해야 한다.** 빌더의 반환타입은 절대 `void`가 될 수 없으며, 이름은 항상 명사여야 한다.

```java
int pow(int base, int power);
float speed();
Employee employee(int id);
String parsedCell(int x, int y); // 형용사인 parsed가 명사인 cell을 꾸미고 있을 뿐 명사다.
```

- 객체로 추상화한 실세계 엔티티를 수정하는 메서드를 조정자라고 부른다. 조정자의 반환 타입은 항상 `void`이고, 이름은 항상 **동사**이다.

```java
void save(String content);
void put(String key, Float value);
void remove(Employee emp);
void quicklyPrint(int id); // 부사의 꾸밈을 받는 동사
```

- 다음은 원칙을 위반하는 잘못된 예

```java
// 저장된 전체 바이트를 반환
int save(String content); // void를 반환하도록 바꾸거나 bytesSaved()와 같은 이름으로 변경
// map이 변경된 경우 TRUE를 반환 
boolean put(String key, Float value); // void를 반환하도록 변경하거나 putOperation으로 변경
// speed를 저장한 후 이전 값을 반환
float speed(float val);
```

#### 🎈 빌더는 명사다
- 어떤 갓을 반환하는 메서드의 이름을 동사로 짓는 것은 잘못이다.

```java
class Bakery {
  Food cookBrownie();
  Drink brewCupOfCoffee(String flavor);
}
```
- 위의 두 메서드는 객체의 메서드가 아니라 **프로시저**이다.
- 두 메서드의 이름은 `Bakery`를 자립적이고 자율적인 객체로 존중해서는 안되기 때문에 객체에게 할 일을 일일이 명령해야 한다고 속삭인다. 이것은 객체지향적인 접근방법이 아니라 절차적인 접근방법이다.
- 메서드의 이름을 동사로 지을 때에는 객체에게 무엇을 할 지를 알려주어야 한다. 무엇을 만들어야 하는 지만 요청하고, 만드는 방법은 객체 스스로 결정하도록 해야 한다.

```java
// 잘 지어진 예
InputStream stream(URL url);
String content(File file);
int sum(int x, int y);
```

#### 🎈 조정자는 동사다
- 실세계의 엔티티를 조작해야 하는 경우에는, 다음과 같이 객체가 그 작업을 수행하도록 요청한다.

```java
class Pixel {
  void paint(Color color);
}

Pixel center = new Pixel(50, 50);
center.paint(new Color("red"));
```

- `paint` 메서드는 값을 반환하지 않는다. 요청하는 것과 같다.

#### 🎈 빌더와 조정자 혼합하기
- 다음 예는 파일 내용을 저장하고 저장된 바이트 수를 반환하는 메서드이다.

```java
class Document {
  int write(InputStream content);
}
```

- 이 메서드는 앞에서 설명한 원칙을 위반하고 있다. 원칙상으로는 메서드 `write`의 반홚 타입을 `void`로 바꿔야 하지만, 실제로 저장된 바이트 수를 알 필요가 있다.
- `write()` 메서드는 데이터를 쓰는 동시에, 쓰여진 바이트 수를 카운트한다. 다시 말해서 하나의 메서드 안에서 너무 복잡한 일을 처리하고 있다. 메서드의 목적이 명확하지 않기 때문에 깔끔하게 명사나 동사 둘 중 하나로 이름을 지을 수가 없다. 이 문제를 해결할 방법으로 리팩토링을 해야한다.

```java
class Document {
  OutputPipe output(); // 빌더
}

class OutputPipe {
  void write(InputStream content); // 조정자
  int bytes(); // 빌더
  long time(); // 빌더
}
```

#### 🎈 Boolean 값을 결과로 반환하는 경우
- `Boolean` 값을 반환하는 메서드의 이름은 어떻게 지을까?
- `Boolean` 값을 반환하는 메서드는 규칙에 있어서 예외적인 경우이다. 값을 반환하기 때문에 이 메서드들은 빌더에 속하지만, 가독성 측면에서 이름을 **형용사**로 지어야 한다.

```java
boolean empty(); // is empty
boolean readable(); // is readable
boolean negative(); // is negative
```

- 접두사 `is`는 중복이기 때문에 메서드의 이름에 포함시키지 않지만, 메서드를 읽을 때는 일시적으로 앞에 붙여 자연스벌게 들리도록 해야 한다.
- 아래의 메서드에서는 문제가 될 수 있는데 `is`를 붙이면 올바르지 않은 문장이 만들어지기 때문이다. 이런 경우 더 적합한 이름은 `equalTo`와 `present`이다.

```java
boolean equals(Object obj);
boolean exists();
```
- `Boolean`을 반환하는 메서드를 특별하게 취급해야 하는 이유는 Java를 포함한 대부분의 언어들이 논리 구성자를 특별한 방식으로 다루기 때문이다.
- 다음은 클래스에 문자열이 비어있는지 여부를 반환하는 `emptiness()` 메서드를 추가한 후 사용한 것이다.

```java
if (name.emptiness() == true) {
  // 뭔가 한다.
}
```

- 이 문장은 `if emptiness of the name is true`로 자연스럽게 읽히지만 Java에서는 이런 방식으로 코드를 작성하지 않는다.

```java
if (name.empty()) {
  // 뭔가 한다.
}
```

- 요약하지면, **먼저 메서드의 목적이 무엇인지를 확인하고, 메서드는 빌더나 조정자, 둘 중 하나여야 한다. 절대로 빌더인 동시에 조정자이면 안된다. 빌더는 명사로, 조정자는 동사로 지어야 한다.**

### 🦄 퍼블릭 상수(Public Constant)를 사용하지 마세요
- 상수라고도 불리는 `public static final` 프로퍼티는 객체 사이에 데이터를 공유하기 위해 사용하는 메커니즘이다. 글자 그대로 상수를 사용하는 아유는 데이터를 공유하기 위해서이다.
- 하지만 반대하는 이유 또한 객체들은 어떤 것도 공유해서는 안되기 때문이다. 대신 독립적이어야하고 닫혀 있어야 한다.
- 상수를 이용한 공유 메커니즘은 캡슐화와 객체지향적인 사고 전체를 부정하는 일이다.

```java
class Records {
  private static final String EOL = "\r\n";

  void write(Writer out) {
    for (Record rec: this.all) {
      out.write(rec.toString());
      out.write(Records.EOL);
    }
  }
}
```
- 이 예제는 `Recodes` 클래스의 내부에서만 사용되므로 완전히 울바른 상황이다. 하지만 다른 객체를 사용하는 `Rows` 클래스가 있다면?

```java
class Rows {
  private static final String EOL = "\r\n";

  void print(PrintStream pnt) {
    for (Row row: this.fetch()) {
      pnt.printf(
        "{ %s }%s", row, Rows.EOL
      );
    }
  }
}
```

- `Rows`의 로직은 `Records`의 로직과 다르며, 협력하는 객체 집합도 완전히 다르다. 두 클래스는 공통점이 없다. 하지만 두 클래스 모두 `EOL` `private` 상수를 정의하고 있다. 때문에 다음과 같이 객체를 사용해서 중복 문제를 해결해야 한다.

```java
public class Constants {
  public static final String EOL = "\r\n";
}
```

- 이렇게 하면 `public`이끼 때문에 클래스 로더에 의해 로딩된 모든 클래스들이 상수에 접근할 수 있다. 퍼블릭 상수를 재사용할 수 있다.
- 하지만 **결합도**가 높아졌고 **응집도**가 낮아졌다.

#### 🎈 결합도 증가
- 다음은 `Records` 클래스와 `Rows` 클래스이다.

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

- 두 클래스는 모두 같은 객체에 의존하고 있으며 이 의존성은 **하드 코딩**되어 있다.
- `Records.write()`, `Rows.print()`, `Constants,EOL` 세 곳에서 코드의 일부가 서로 결합되어 의존하고 있다.

#### 🎈 응집도 저하
- 퍼블릭 상수를 사용하면 객체의 응집도는 낮아진다. 낮은 응집도는 객체가 자신의 문제를 해결하는데 덜 집중한다는 것을 의미한다.
- 상수는 자신에 관해 아무 것도 알 지 못하며, 자신의 존재 이유를 이해하지 못하는 하나의 텍스트 덩어리에 불과하다.
- 의미를 추가하기 위해서는 `Records`와 `Rows` 클래스 안에 더 많은 코드를 작성해야 한다. 목적을 명확하게 만들어줄 코드를 추가해서 이 원시적인 정적 상수를 감싸야 한다. 하지만 이런 코드는 원래 의도했던 목적과 동떨어져 있을 수 밖에 없다.
- 때문에 코드 중복 문제를 적절하게 해결하기 위해서는 객체 사이에 데이터를 중복해서는 안된다. 대신, **기능을 공유**할 수 있도록 **새로운 클래스**를 만들어야 한다.

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
- 이제 필요한 곳에서 `EOLString`을 사용할 수 있다.

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

- 이제 접미사를 줄 마지막에 정확하게 추가하는 방법에 관해서는 `EOLString`이 책임을 진다.
- `EOLString`에 대한 결합은 **계약을 통해** 추가된 것이며, 계약에 의한 결합은 언제라도 분리가 가능하기 때문에 유지보수성으 저하시키지 않는다.
- 요약하자면 **OOP에서 퍼블릭 상수를 절대로 사용해서는 안된다.** 사소해 보이는 상수라도 항상 작은 클래스를 이영해서 대체해야 한다.

### 🦄 불변 객체로 만드세요
- 모든 클래스를 상태 변경이 불가능한 불변 클래스(immutable class)로 구현하면 유지보수성을 크게 향상시킬 수 있다.
- 불변성은 크기가 작고, 응집력이 높으며, 느슨하게 결합되고, 유지보수하기 쉬운 클래스를 만들 수 있도록 한다.
- **인스턴스를 생성한 후에 상태를 변경할 수 없는 객체를 불변 객체**라고 부른다.
- 다음 예는 가변 객체이다.

```java
class Cash {
  private int dollars;

  public void setDollars(int val) {
    this.dollars = val;
  }
}
```

- 다음 예제는 불변 객체이다.

```java
class Cash {
  private final int dollars;

  Cash(int val) {
    this.dollars = val;
  }
}
```

- `final` 키워드는 생성자 외부에서 프로퍼티의 값을 수정할 경우 컴파일 타임 에러가 발생해야 한다는 사실을 컴파일러에게 알려준다.
- 불변 객체는 필요한 모든 것을 내부에 캡슐화하고 변경할 수 없도록 통제한다. 불변 객체를 수정해야 한다면 프로퍼티를 수정하는 대신 새로운 객체를 생성해야 한다.
- 다음은 가변 클래스로 구현한 코드이다.

```java
class Cash {
  private int dollars;

  public void mul(int factor) {
    this.dollars *= factor;
  }
}
```

- 다음은 동일한 작업을 수행하는 불변 클래스이다.

```java
class Cash {
  private final int dollars;

  public Cash mul(int factor) {
    return new Cash(this.dollars * factor);
  }
}
```
- 불변 객체는 자기 자신을 수정할 수 없고 **항상 원하는 상태를 가지는 새로운 객체를 생성해서 반환해야 한다.**
- 다음은 가변 객체의 사용 방법

```java
Cash five = new Cash(5);
five.mul(10);
System.out.println(five); // 50
```

- 다음은 불변 객체를 사용한 방법이다.

```java
Cash five = new Cash(5);
Cash fifty = five.mul(10);
System.out.println(fifty); // 50
```

- `five` 객체를 생성하고 나면 `five`는 `fifty`가 될 수 없다. 5는 5일 뿐이다.
- **가변 객체는 엄격하게 금지해야 한다.**

#### 🎈 식별자 가변성(Identity Mutability)
- 불변 객체에는 식별자 가변성 문제가 없다. 이 문제는 동일해 보이는 두 객체를 비교한 후 한 객체의 상태를 변경할 때 문제가 발생하는데, 더 이상 동일하지 않지만, 여전히 두 객체가 동일하다고 생각한다. 그 반대일 수도 있다.

```java
Map<Cash, String> map = new HashMap<>();
Cash five = new Cash("$5");
Cash ten = new Cash("$10");
map.put(five, "five");
map.put(ten, "ten");
five.mul(2);
System.out.println(map); // { $10 => "five", $10 => "ten" }
```
- 이러면 `map`은 동일한 키가 두 개 존재하기 때문에 올바르지 않다. 처음엔 동일하지 않은 두 객체를 생성한 뒤 두 객체를 `map`에 추가하는데, 이때는 키가 서로 다르기 때문에 `HashMap`은 두 개의 독립적인 엔트리를 생성한다. 그 후 5를 10으로 변경해도 `map`에게 이 사실을 알려주지 않았기 때문에 `map`은 변경이 일어났다는 사실을 전혀 인식하지 못한다.
- 이 후 둘 중 하나를 검색하려고 하면, `map` 상태가 비정상적이기 때문에 어떤 결과를 얻을지 예측할 수 없다.

```java
map.get(five) // ten? five??
```

- 불변 객체를 사용하면 객체를 `map`에 추가한 후에는 상태 변경이 불가능하기 때문에 식별자 가변성 문제가 발생하지 않는다.

#### 🎈 실패 원자성(Failure Atomicity)
- 실패 원자성이란 **완전하고 견고한 상태의 객체**를 가지거나 아니면 **실패하거나** 둘 중 하나만 가능한 특성이다.
- 다음은 가변 클래스 `Cash` 예제이다.

```java
class Cash {
  private int dollars;
  private int cents;

  public void mul(int factor) {
    this.dollars *= factor;

    if (/* 뭔가 잘못 됐다면 */) {
      throw new RuntimeException("oops...");
    }

    this.cents *= factor;
  }
}
```

- `mul()` 메서드를 실행하는 도중에 예외가 던져진다면 객체의 절반(`this.dollars`)만 수정되고 나머지 절반(`this.cents`)은 원래 값을 유지한다.
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

- 불변 객체의 정의에 따르면 모든 불변 객체는 **원자적**이기 때문에 원자성을 걱정할 필요가 없다.
- 가변 객체 안에서 명시적으로 실패 원자성을 보장하는 방ㅃ도 있지만 객체의 복잡성이 더 높아지고, 실수할 가능성이 더 커지기 떄문에 좋지 않다.

#### 🎈 시간적 결합(Temporal Coupling)
- 다음은 시간적 결합을 이해할 수 있는 좋은 방법인 예제이다.

```java
Cash price = new Cash();
price.setDollars(29);
price.setCents(95);
System.out.println(price); // "$29.95"
```

- 각 줄은 특정한 순서로 정렬되어 있다. 각 줄은 시간적인 순서에 따라 서로 결합되어 있다. 다음과 같이 코드를 재정렬해도 컴파일은 여전히 성공한다.

```java
Cash price = new Cash();
price.setDollars(29);
System.out.println(price); // "$29.00"
price.setCents(95);
```

- 이렇게 줄 사이의 시간적인 결합을 프로그래머가 기억해야 한다. 이러면 유지보수에 있어서 어려움이 크다.
- 다음과 같이 불변 객체를 이용하여 문제를 해결할 수 있다.

```java
Cash price = new Cash(29, 95);
System.out.println(price); // "$29.95"
```

- 이렇게 하나의 문장으로 객체를 인스턴스화할 수 있다. 이 경우에는 **인스턴스화**와 **초기화**를 분리시킬 수 없다. 항상 함께 실행되어야 한다. 순서도 변경할 수 없다.

#### 🎈 부수효과 제거(Side effect-free)
- 다음 예제는 가격을 2배로 증가시키는 실수를 저질렸다.

```java
void print(Cash price) {
  System.out.println("Tody price is: " + price);
  price.mul(2);
  System.out.println(
    "Buy now, tomorrow price is: " + price
  );
}
```

- 이제 이 메서드를 호출하면 부수효과가 발생한다.

```java
Cash five = new Cash(5);
print(five);
System.out.println(five); // "$10"
```

- 문제를 해결하기 위해 문제가 발생한 지점을 찾기 위해서 `five` 객체를 수정한 모든 곳을 디버깅해야 한다.
- 반면에 `Cash` 클래스를 불변으로 만들면 어떤 누구도 객체를 수정할 수 없다. 그리고 객체의 상태가 변하지 않았다고 확신할 수 있다. 코드가 제대로 동작하지 않아도 부수효과가 발생한 위치를 찾을 필요가 없다.

#### 🎈 NULL 참조 없애기
- 설정되지 않은(unset) 프로퍼티에 관한 예제이다.

```java
class User {
  private final int id;
  private String name = null;

  public User(int num) {
    this.id = num;
  }

  public void setName(String txt) {
    this.name = txt;
  }
}
```

- 이 클래스의 인스턴스가 생성될 떄 `name` 프로퍼티의 값으오 `NULL`이 할당된다. 이 값은 나중에 `setName()` 메서드를 호출할 때 초기화되고, 그 전까지는 값이 `NULL`인 상태를 유지한다.
- `NULL`은 빈 문자열과 크게 다르지 않다. `NULL`이 아닌지 체크해야하고, 문제가 없는지 확인해야 한다. 그리고 문제는 어김없이 발생한다.
- 더 큰 문제는 실제 값이 아닌 `NULL`을 참조하는 객체는 **유지보수성**이 저하될 수 밖에 없다. 언제 객체가 유효한 상태인지 언제 **객체가 아닌** 다른 형태로 바뀌는 지를 이해하기가 어렵기 때문이다.
- 모든 객체를 불변으로 만들면 객체 안에 `NULL`을 포함시키는 것이 애초에 불가능해져 작고, 견고하며,응집도 높은 객체를 생성할 수 밖에 없도록 **강제되기 때문에** 유지보수하기에 훨씬 더 쉬운 객체를 만든다.

#### 🎈 스레드 안정성(Thread Safety)
- 스레드 안정성이란 여러 스레드에서 동시에 사용될 수 잇으며 그 결과를 항상 **예측가능하도록** 유지할 수 있는 객체의 품질을 의미한다.
- 불변 객체는 실행 시점에 상태를 상태를 수정할 수 없게 금지함으로써 결과를 항상 예측가능하도록 유지할 수 있다. 어떤 스레드도 객체의 상태를 수정할 수 없기 때문에 가능하다.
- 명시적으로 동기화를 이용하면 가변 클래스 역시 스레드에 안전하게 만들 수는 있다.

```java
class Cash {
  private int dollars;
  private int cents;

  public void mul(int factor) {
    synchronized (this) {
      this.dollars *= factor;
      this.cents *= factor;
    }
  }
} 
```

- 정상적으로는 동작하지만 문제점이 있다. 첫째, 가변 클래스에 스레드 안전성을 추가하는 일은 생각처럼 쉽지 않다. 둘째, 동기화 로직을 추가하는 일은 성능상의 비용을 초래한다. 각 스레드는 객체를 **배타적으로 잠그기 때문에** 다른 모든 스레드는 객체가 해제될 때까지 기달릴 수밖에 없다.
- 이런 이유로 가변 객체를 피하고 불변 객체를 사용해야 한다.

#### 🎈 더 작고 더 단순한 객체
- 객체가 더 단순해질 수록 응집도는 더 높아지고, 유지보수하기는 더 쉬워진다.
- 대부분의 경우, 단순하다는 것응 더 적은 코드 줄수를 의미한다. 한 클래스 안에 1000줄의 코드가 들어있다면, 작성자조차도 클래스가 어떤 일을 하는지 모를 것이 분명하다. 최대 크기는 주석과 공백을 포함해 250줄정도.. (여기서 코드란 프로덕션 코드와 테스트 코드 포함)
- 불변 객체는 아주 크게 만드는 일이 불가능하고, 일반적으로 불변 객체는 가변 객체보다 더 작다. (불변 객체가 작은 이유는 생성자 안에서만 상태를 초기화할 수 있다.)

### 🦄 문서를 작성하는 대신 테스트를 만드세요
- 문서화는 유지보수에 있어 중요한 구성요소이다.
- 클래스나 메서드에 관한 추가정보에 얼마나 쉽게 접근할 수 있는 지가 중요하다.
- 이상적인 코드는 스스로 설명하기 떄문에 어떤 추가 문서도 필요하지 않는다. 따라서 코드를 문서화하는 대신 코드를 깔끔하게 만들어야 한다.
- 여기서 깔끔하게 만든다라는 말에는 단위 테스트도 함께 만든다는 의미가 포함되어 있다.
- 깔끔하고 유지보수 가능한 단위 테스트를 추가하면, 클래스를 더 깔끔하게 만들 수 있고 유지보수성을 향상시킬 수 있다. 더 훌륭한 단위 테스트를 작성할수록 더 적은 문서화가 요구된다. **단위 테스트가 바로 문서화이다.**
- 훌륭하고 깔끔한 단위 테스트를 만들기 위한 최고의 조언은 메인 코드만큼 단위 테스트에도 관심을 기울여야 한다.
- 다음은 `Cash` 클래스의 단위 테스트이다.

```java
class CashTest {
  @Test
  public void summarizes() {
    assertThat(
      new Cash("$5").plus(new Cash("$3")),
      equalTo(new Cash("$8"))
    );
  }

  @Test
  public void deducts() {
    assertThat(
      new Cash("$7").plus(new Cash("-$11")),
      equalTo(new Cash("-$4"))
    );
  }

  @Test
  public void multiplies() {
    assertThat(
      new Cash("$2").mul(3),
      equalTo(new Cash("$6"))
    );
  }
}
```

### 🦄 모의 객체(Mock) 대신 페이크 객체(Fake)를 사용하세요
- 테스트를 최적화하기 위한 도구인 **모킹**이다.
- 다음은 자기 자신을 새로운 환율로 변환할 수 있는 `Cash` 클래스이다.

```java
class Cash {
  private final Exchange exchange;
  private final int cents;

  public Cash(Exchange exch, int cnts) {
    this.exchange = exch;
    this.cents = cnts;
  }

  public Cash in(String currency) {
    return new Cash(
      this.exchange,
      this.cents * this.exchange.rate(
        "USD", currency
      )
    );
  }
}
```

- `Cash`는 `Exchange`클래스에 의존하기 때문에 `Cash` 클래스를 사용하기 위해서는 `Exchange`의 인스턴스를 `Cash`의 생성자에 전달해야 한다.

```java
// NYSE 클래스는 USD에서 EUR로 변환하기 위한 환율을 찾는 방법을 알고 있다.
// 패스워드로 secret을 사용하고 있다.
Cash dollar = new Cash(new NYSE("secret"), 100);
Cash euro = dollar.in("EUR");
```

- 우리는 `NYSE`가 개입하지 않고 `Cash` 클래스를 테스트할 수 있는 방법이 필요하다.
- 전통적인 접근방식은 모킹으로 `NYSE`를 사용하는 대신 `Exchange` 인터페이스에 대한 모의 객체를 생성한 후 `Cash` 생성자의 인자로 사용한다.

```java
Exchange exchange = Mockito.mock(Exchange.class);
Mockito.doReturn(1.15)
  .when(exchange)
  .rate("USD", "EUR")
Cash dollar = new Cash(exchange, 500);
Cash euro = dollar.in("EUR");
assert "5.75".equals(euro.toString());
```

- 모킹 대신 페이크 객체를 사용하는 것이 좋다.
- 다음은 사용자에게 전달될 `Exchange` 인터페이스의 최종 코드이다.

```java
interface Exchange {
  float rate(String origin, String target);

  final class Fake implements Exchange {
    @Override
    float rate(String origin, String target) {
      return 1.2345;
    } 
  }
}
```

- 중첩된 페이크 클래스는 인터페이스의 일부이며 인터페이스와 함께 제공된다.
- 아래는 모킹 대신 페이크 클래스를 사용한 단위 테스트이다.

```java
Exchange exchange = new Exchange.Fake();
Cash dollar = new Cash(exchange, 500);
Cash euro = dollar.in("EUR");
assert "6.17".equals(euro.toString());
```
- 페이크 클래스를 만족하도록 테스트를 작성하지 말고, 페이크 클래스가 테스트를 올바르게 지원하도록 만들어야 한다. 페이크 클래스를 사용하면 테스트를 더 짧게 만들 수 있기 때문에 유지보수성이 눈에 띄게 향상된다.
- 반면에 모킹의 경우, 테스트가 장황해지고, 이해하거나 리팩토링하기 어려워진다. 또한, 모킹은 가정을 사실로 전환시키기 떄문에 단위 테스트를 유지보수하기 어렵게 만든다.
- 클래스의 행동이 변경되면 단위 테스트가 실패하기 때문에, 단위 테스트은 코드 리팩토링에 큰 도움이 된다. 하지만 동시에 **행동이 변경되지 않을 경우에는 실패해서는 안된다.**
- 하지만 앞에서 살펴본 단위 테스트는 아무런 이유 없이도 실패할 수 있다. `Exchange` 인터페이스를 다음과 같이 수정한다.

```java
interface Exchange {
  float rate(String target);
  float rate(String origin, String target);
}
```

- 다음과 같이 변경한 후 `origin` 통화가 `USD`일 경우 하나의 인자를 받는 새로운 `rate` 메서드를 사용하도록 `Cash` 클래스를 수정한다고 가정하면, 단위 테스트가 실패할 것이다. 아무 것도 실패하지 않았지만, 테스트는 실패했다는 잘못된 신호를 보낸다.
- 단위 테스트는 너무 쉽게 깨지고 불안정하고 대부분의 실패는 모킹 때문에 일어난다.
- 다음은 동일한 상황에서 `Exchange` 인터페이스를 변경하기 위해서는 자연수럽게 `Exchange.Fake` 클래스의 구현도 함께 변경해야 한다.

```java
interface Exchange {
  float rate(String target);
  float rate(String origin, String target);

  final class Fake implements Exchange {
    @Override
    float rate(String target) {
      return this.rate("USD", target);
    }

    @Override
    float rate(String origin, String target) {
      return 1.2345;
    }
  }
}
```

- 위와 같이 페이크 객체를 사용하면 단위 테스트가 깨지지 않는다.
- 모킹은 **나쁜 프랙티스**이다. 모킹은 클래스 구현과 관련된 내부 세부사항을 테스트와 결합시킨다.
- 반대로 페이크 클래스를 사용하면 테스트를 충분히 유지보수 가능하게 만들 수 있다. `Cash` 클래스와 `Exchange` 클래스 사이의 의사소통 방식에 대해서는 신경 쓸 필요가 없기 때문이다.
- 페이크 클래스의 중요한 장점 한 가지는 페이크 클래스는 인터페이스의 설계에 관해 더 깊이 고민하도록 해준다. 인터터이스를 설계하면서 페이크 클래스를 만들다보면 플연적으로 인터페이스의 작성자뿐만 아니라 사요자의 관점에서도 고민한다. 인터페이스를 다른 관점에서 바라보고 테스트 리소스를 사용해서 사용자와 동일한 기능을 구현한다.

### 🦄 인터페이스를 짧게 유지하고 스마트(smart)를 사용하세요
- 두 개의 인터페이스가 각각 5개의 메서드를 선언하고 있다면, 두 인터페이스를 모두 구현하는 클래스는 10개의 `public` 메서드를 가지기 떄문에 이 클래스를 우아하다고 말하기는 어렵다.
- 앞 섹션에서 설명한 `Exchange` 인터페이스이다.

```java
interface Exchange {
  float rate(String target);
  float rate(String source, String target);
}
```

- 이 인터페이스는 너무 많은 것응 요구하기 때문에 설계 관점에서는 형편 없는 인터페이스이다.
- 이런 종류의 계약은 단일 책임 원칙을 위반하는 클래스를 만들도록 부추긴다. 다시 말해서 응집도가 낮은 클래스를 만들게 한다.
- 두 `rate` 메서드는 독립적인 함수이다. 하나의 인자를 받는 `rate` 메서드는 이 인터페이스에 포함되어서는 안된다.
- 이를 해결하기위해서 인터페이스 안에 **스마트** 클래스를 추가해서 해결할 수 있다.

```java
interface Exchange {
  float rate(String source, String target);
  
  final class Smart {
    private final Exchange origin;
    
    public float toUsd(String source) {
      return this.origin.rate(source, "USD");
    }
  }
}
```

- 이 스마트 클래스는 `Exchange` 인터페이스가 어떻게 구현되고 환율이 어떻게 계산되는 지는 모르지만, 인터페이스 위에 특별한 기능을 적용한다. 이 기능은 `Exchange`의 서로 다른 구현 사이에 공유될 수 있다.

```java
float rate = new Exchange.Smart(new NYSE()).toUsd("EUR");
```

- 모든 `Exchange` 구현체에 동시에 더 많은 기능을 추가해야 한다고 가정한다. `EUR`라는 문자열 리터럴을 반복적으로 사용하고 싶지는 않다. 때문에 `eurToUsd()` 메서드를 사용할 수 있다.

```java
interface Exchange {
  float rate(String source, String target);

  final class Smart {
    private final Exchange origin;

    public float toUsd(String source) {
      return this.origin.rate(source, "USD");
    }

    public float eurToUsd() {
      return this.toUsd("EUR");
    }
  }
}
```

- 이제 단 한번의 메서드 호출만으로 `EUR`에서 `USD`로의 환율을 얻을 수 있다.

```java
float rate = new Exchange.Smart(new NYSE()).eurToUsd();
```

- 스마트 클래스의 크기는 점점 더 커지겠지만, `Exchange` 인터페이스는 작고, 높은 응집도를 유지할 수 있다.
- 인터페이스를 짧게 만들고 스마트 클래스를 인터페이스와 함께 배포함으로써 공통 기능을 추출하고 코드 중복을 피할 수 있다.
- 이러한 접근방법은 데코레이터와 매우 유사하다. 테코레이터와 스마트 클래스와 다른 점은 스마트 클래스가 객체에 새로운 메서드를 추가하는데 비해 테코레이터는 이미 존재하는 메서드를 좀 더 강력하게 만든다는 점이다.
  
```java
interface Exchange {
  float rate(String origin, String target);

  final class Fast implements Exchange {
    private final Exchange origin;

    @Override
    public float rate(String source, String target) {
      final float rate;
      
      if (source.equals(target)) {
        rate = 1.0f;
      } else {
        rate = this.origin.rate(source, target);
      }

      return rate;
    }

    public float toUsd(String source) {
      return this.origin.rate(source, "USD");
    }
  }
}
```

- 중첩 클래스인 `Exchange.Fast`는 데코레이터인 동시에 스마트 클래스이다. 첫째, `Exchange.Fast`는 `rate()` 메서드를 오버라이드해서 더 강력하게 만든다. 둘째, `Exchange.Fast`는 새로운 메서드인 `toUsd()`를 추가해서 `USD`로 쉽게 환율을 변혼할 수 있도록 해준다.
