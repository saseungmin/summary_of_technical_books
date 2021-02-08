## 🌈 Chapter 2: Education

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