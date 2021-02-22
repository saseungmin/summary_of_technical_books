## 🌈 Chapter 3: Employment

### 🦄 5개 이하의 public 메서드만 노출하세요

- 클래스의 크기를 정한느 기준으로 `public` 메서드의 개수를 사용하길 권한다. `public` 메서드가 많을 수록 클래스도 커진다. 클래스가 커질수록 유지보수성은 저하된다. 클래스 안에 포함된 `public` 5개보다 적다면 만족스러운 수준이다.
- 여기서 말하는 `public` 메서드에는 `protected` 메서드도 포함된다.
- 클래스를 작게 만들면 우아함, 유지보수성, 응집도, 테스트 용이성이 향상된다.
- 클래스가 작을 때 클래스의 모든 메서드가 모든 프로퍼티와 상호작용할 가능성이 더 높아진다.

### 🦄 정적 메서드를 사용하지 마세요
- 다음 예는 HTTP 요청을 전송해서 웹 페이지를 로드하는 기능을 구현한 클래스이다.

```java
class WebPage {
  public static String read(String uri) {
    // HTTP 요청을 만들고 UTF-8 문자열로 변환한다.
  }
}
```

- 다음과 같이 `WebPage` 클래스를 사용할 수 있다. `read`는 정적 메서드의 일종이다.

```java
String html = WebPage.read('http://www.example.com');
```
- 더 나은 방식은 정적 메서드 대신 객체를 사용하는 것이다.

```java
class WebPage {
  private final String uri;

  public String content() {
    // HTTP 요청을 만들고 UTF-8 문자열로 변환한다.
  }
}
```

- 다음과 같이 사용할 수 있다.

```java
String html = new WebPage('http://www.example.com').content();
```
- 정적 메서드는 객체 패러다임의 남용이다. 정적 메서드의 사용을 중단해야 한다.
- 정적 메서드는 소프트웨어를 **유지보수하기 어렵게 만든다.**

#### 🎈 객체 대 컴퓨터사고
- 컴퓨터는 우리가 명령어를 제공해줄 것이라고 기대하고, 제공된 명령어를 하나씩 순차적으로 실행한다. 흐름은 항상 순차적이며 스크립트의 위에서 아래로 흐른다. 문장은 위에서 아래로 흐르고 세미콜론을 기준으로 분리된다. 이런 접근방법은 규모가 더 커지면 순차적인 사고방식은 한계에 직면한다.
- 함수형 프로그래밍은 CPU의 계산 방식이나 함수 내부의 정확한 작동 방식을 알 수 없다. 새로운 무엇이 필요하다면 그 **무엇을 정의**한다.
- 함수형, 논리형, 객체지향 프로그래밍이 절차적 프로그래밍과 차별화되는 점이 바로 `is a`이다.
- OOP의 관점에서 최댓값을 계산하는 코드는 다음과 같다.

```java
class Max implements Number {
  private final Number a;
  private final Number b;

  public Max(Number left, Number right) {
    this.a = left;
    this.b = right;
  }
}

Number x = new Max(5, 9);
```
- 위 코드는 최댓값을 계산하지 않고 단지 x가 5와 9의 최댓값이라는(`is a`) 사실을 정의할 뿐이다. 어떻게 구현하고 있는 지는 관심이 없다. 단순히 객체를 생성할 뿐이다.
- 정적 메서드를 이용해서 최댓값을 구하는 Java 코드이다. 잘못된 방식이며, 올바른 객체지향 설계에서는 정적 메서드를 사요애헛는 안된다.

```java
int x = Math.max(5, 9);
```

#### 🎈 선언형 스타일 대 명령형 스타일
- 명령형 프로그래밍에서는 프로그램의 상태를 변경하는 문장을 사용해서 계산 방식을 서술한다.
- 선언형 프로그래밍에서는 제어 흐름을 서술하지 않고 계산 로직을 표현한다.
- 즉, 명령형은 컴퓨터처럼 연산을 차례대로 실행, 선언형은 엔티티와 엔티티 사이의 관계로 구성돠는 자연스러운 사고 패러다임에 더 가깝다.
- 명령형과 선언형의 차이점은 다른 클래스, 객체, 메서드가 이 기능을 **사용하는** 방법에 있다.
- 다음은 명령형 스타일이다.

```java
// 이 정수가 간격 안에 포함되는지 여부 확인
public static int between(int l, int r, int x) {
  return Math.min(Math.max(l, x), r);
}

int y = Math.between(5, 9, 13); // 9를 반환
```
- `between` 메서드는 호출되는 즉시 결과를 반환한다.
- 메서드를 호출한 시점에 CPU가 즉시 결과를 계산한다. 이것이 바로 명령형 스타일이다.
- 다음은 선언형 스타일이다.

```java
class Between implements Number {
  private final Number num;

  Between(Number left, Number right, Number x) {
    this.num = new Min(new Max(left, x), right);
  }

  @Override
  public int intValue() {
    return this.num.intValue();
  }
}

Number y = new Between(5, 9, 13); // 아직..
```

- 아직까지는 CPU에게 숫자를 계산하라고 말하지 않았기 때문에, 이 방식은 선언형 스타일이다. `Between`이 **무엇인지만** 정의하고, 변수 `y`의 사용자가 `intValue()`의 값을 계산하는 시점에 결정한다. 이처럼 선언형 프로그래밍을 정의할 떄 제어를 서술하지 않고 로직만 표현했다.
- 선언형 방식은 더 빠르다. 이유는 선언형 방식에서는 **직접 성능 최적화를 제어할 수 있기 때문에** 더 빠르다는 사실이다. 오직 하나의 정적 메서드만 호출하는 경우라면, 정적 메서드 호출하는 항식이 객체를 생성한 후 메서드를 호출하는 방식보다 빠르지만, 다수의 정적 메서드를 호출해야 하는 경우 다르다.
- 다음은 정적 메서드를 사용하는 예제이다.

```java
public void doIt() {
  int x = Math.between(5, 9, 13);

  if (/* x가 필요한가? */) {
    System.out.println(x);
  }
}
```

- `x`의 값이 필요한지 여부와 무관하게 무조건 `x`의 값을 계산한다. CPU는 어떤 경우에도 `x`의 값이 9라는 사실을 알게 된다.
- 다음은 선언형 방식이다.

```java
public void doIt() {
  Integer x = new Between(5, 9, 13);

  if (/* x가 필요한가? */) {
    System.out.println(x);
  }
}
```

- 두 번째 코드에서는 CPU에게 모든 것을 계산하라고 말하지 않는다. 대신 CPU에게 결과가 실제로 필요한 **시점과 위치**를 결졍하도록 위임하고, CPU는 요청이 있을 경우에만 계산을 실행한다. 때문에 실행 관점에서 선언형 방식이 더 **최적화**되기 떄문에 더 빠르다. 최적화 관점에서 직접 통제할 수 있는 코드가 많을수록 유지보수하기도 더 쉬워진다.
- 선언형 방식이 더 좋은 두 번째 이유는 **다형성** 때문이다.
- `Between` 클래스에서 두 수를 비교하기 위해 `Min`과 `Max` 클래스를 사용하는 대신 `if-then-else` 구문을 사용하도록 변경하고 싶다. 다음은 선언형 방식을 따르는 코드이다.

```java
class Between implements Number {
  private final Number num;

  Between(int left, int right, int x) {
    this(new Min(new Max(left, x), right));
  }

  Between(Number number) {
    this.num = number;
  }
}
```
- 이 클래스를 다른 알고리즘과 함께 조합해서 사용할 수 있다.

```java
Integer x = new Between(
  new IntegerWithMyOwnAlgorithm(5, 9, 13);
);
```
- `Between`과 `Max`, `Min`은 모두 **클래스이기 때문에** `Max`와 `Min`으로부터 `Between`을 아주 쉽게 분리할 수 있다.
- 생성자의 인자로 객체를 전달할 수는 있지만, 정적 메서드를 전달하는 것은 불가능하다.
- **객체를 다른 객체로부터 완전히 분리하기 위해선는 메서드나 주 `ctor` 어디에서도 `new` 언산자를 사용하지 말아야 한다.**
- 선언형 프로그래밍을 이용하면 객체 사이의 결합도를 낮출 수 있을 뿐만 아니라, 이 작업을 우아하게 처리할 수도 있다.
- 선언형이 더 좋은 세 번째 이유는 **표현력**때문이다. 명령옇 방식에서 결과를 예상하기 위해서는 먼저 머릿속에서 코드를 실행해야 하기 떄문에 명령형 방식이 선언형 방식보다 덜 직관적이다. 다음은 명령형 방식이다.

```java
Collection<Integer> evens = new LinkedList<>();

for (int number : numbers) {
  if(number % 2 == 0) {
    evens.add(number);
  }
}
```

- 위 코드가 하는 일을 이해하기 위해서는 코드의 실행경로를 추적해야 한다. 마음 속으로 시각화해야 한다.
- 다음은 선언형 스타일로 작성한 예이다.

```java
Collection<Integer> evens = new Filtered(
  numbers,
  new Predicate<Integer>() {
    @Override
    public boolean suitable(Integer number) {
      return number % 2 == 0;
    }
  }
);

// Groovy를 사용한 방법
Collection<Integer> evens = new Filtered(
  numbers,
  { Integer number -> number % 2 == 0 }
);
```

- 위 선언형 스타일의 코드는 `Filtered` 클래스가 이 컬렉션을 어떻게 생성하는지 모른다. 그저 컬렉션이 필터링되었나는 사실 뿐이다. **코드에는 구현과 관련된 세부 사항은 감춰저 있고, 오직 행동만 표현되어 있다.**
- **알고리즘**과 **실행** 대신 **객체**와 **행동**의 관점에서 사고하기 시작하면 무엇이 올바른지 느껴질 것이다.
- 선언형이 더 좋은 네 번째 이유는 **응집도** 때문이다.
- 위 코드에서 `evens = new Filtered`라는 문장을 통해 `evens`를 한 줄에 선언했다. 이 경우 컬렉션의 계산을 책임지는 모든 코드들은 한 곳에 뭉쳐 있기 때문에 실수로라도 분리할 수 없다.
- 선언형 프로그래밍 스타일은 시간적인 결합 문제를 제거할 수 있으며, 따라서 유지보스성을 개선할 수 있다.
- **객체와 정적 메서드를 혼용해서는 안된다.** **절대로 명령형 스타일을 사용해서는 안된다.**

#### 🎈 유틸리티 클래스
- 유틸리티 클래스란 실제로는 클래스가 아니라 편의를 위해 다른 메서드들이 사용하는 정적 메서드들을 모아 놓은 정적 메서드들의 컬렉션(헬퍼)라도고 부른다. (`java.lang.Math`)
- 이런 유틸리티 클래스를 클래스라고 부르기 어려운 이유는 인스턴스를 생성하지 않기 때문이다.

```java
class Math {
  private Math() {
    // 의도적으로 공백으로 남김
  }

  public static int max(int a, int b) {
    if (a < b) {
      return b;
    }

    return a;
  }
}
```

- 유틸리티 클래스를 구현할 떄는 클래스의 인스턴스가 생성되는 것을 방지하기 위해 위와 같이 `private ctor`을 추가하는 것이 좋다. `ctor`의 가시성이 `private`이기 때문에 클래스에서 선언된 메서드를 제외한 어느 누구도 클래스의 인스턴스를 생성할 수 없다.
- 유틸리티 클래스는 나쁜 요소들을 모아 놓은 집합체이다. **유틸리티 클래스는 안티 패턴이다.**

#### 🎈 싱글톤 패턴
- 싱글톤 패턴은 정적 메서드 대신 사용할 수 있는 매우 유명한 개념이다.
- `Math` 클래스는 싱글톤의 대표적인 예이다.

```java
class Math {
  private static Math INSTANCE = new Math();
  private Math() {}
  
  public static Math getInstance() {
    return Math.INSTANCE;
  }

  public int max(int a, int b) {
    if (a < b) {
      return b;
    }

    return a;
  }
} 
```

- `Math` 클래스의 인스턴스는 오직 하나만 존재할 수 있고, 이 유일한 인스턴스의 이름은 `INSTANCE`이다. 누구라도 `getInstance`을 호출해서 이 인스턴스에 접근할 수 있다.
- 싱글톤은 유명한 디자인 패턴이지만, **안티 패턴**이다.
- 다음은 위의 싱글톤 클래스와 정확하게 동일한 일을 수행하는 유틸리티 클래스이다.

```java
class Math {
  private Math() {}

  public static int max(int a, int b) {
    if (a < b) {
      return b;
    }

    return a;
  }
}
```

- 다음은 두 가지 `max()` 메서드의 사용 방법이다.

```java
Math.max(5, 9); // 유틸리티 클래스
Math.getInstance().max(5, 9); // 싱글톤
```

- 싱글톤은 상태를 캡슐화할 수 있다는 차이점이 있다. 다음은 그 예이다.

```java
class User {
  private static User INSTANCE = new User();
  private String name;
  private User() {}

  public static User getInstance() {
    return User.INSTANCE;
  }

  public String getName() {
    return this.name;
  }

  public String setName(String txt) {
    this.name = txt;
  }
}
```

- `User`는 싱글톤이며, 싱글톤의 목적은 상태를 유지하는 것이 아니다.
- 다음은 `User` 유틸리티 클래스이다.

```java
class User {
  private static String name;
  private User() {}
  
  public static String getName() {
    return User.name;
  }

  public static String setName(String txt) {
    User.name = txt;
  }
}
```

- 둘의 차이점은 **싱글톤은 분리가 가능한 의존성으로 연결되어 있는데 반해, 유틸리티 클래스는 분리가 불가능한 하드코딩된 결합도를 가진다는 것이다.** 다시 말해서 싱글톤의 장점은 `getInstance()`와 함께 `setInstance()`를 추가할 수 있다는 점이다.
- 다음 코드는 싱글톤 클래스 `Math`를 사용하는 코드이다.

```java
Math.getInstance().max(5, 9);
```

- 위 코드는 `Math` 클래스에 결합되어 있다. 다시 말해서, `Math` 클래스는 이 코드가 의지하고 있는 **의존성**이다. 만약에 단위 테스트를 싱행하는 동안에는 `Math.max()` 메서드가 실행되지 않도록 하고 싶을 때는 다음과 같이 할 수 있다.

```java
Math math = new FakeMath();
Math.setInstance(math);
```

- 싱글톤 패턴을 사용하면 내부에 캡슐화된 정적 객체를 교체해서 전체 개념을 테스트할 수 있다. 따라서 캡슐화된 객체를 변경할 수 있기 때문에 싱글톤이 유틸리티 클래스보다는 더 좋다는 것이다.
- 하지만, 싱글톤은 **전역 변수** 그 이상도 그 이하도 아니다. 하지만 OOP에서는 전역 변수를 허용하지 않는다.
- 싱글톤은 어떤 사람이 Java에서 전역 변수를 사용할 수 있는 방법을 발견했고, 그 결과로 만들어진 것이 바로 싱글톤이다. 싱글톤은 객체지향 패러다임의 잘못 사용한 예이다.
- **절대로 싱글톤을 사용하면 안된다.**
- 싱글톤에 대한 대안은 캡슐화를 사용하면 된다. 클래스가 작업을 수행하는데 필요한 모든 요소들이 생성자에 제공되고 내부에 캡슐화돼야 한다.

#### 🎈 함수형 프로그래밍
- FP보다 OOP의 표현력이 더 뛰어나고 강력하다. FP에서는 오직 함수만 사용할 수 있지만 OOP에서는 객체와 메서드를 조합할 수 있다.
- 이상적인 OOP 언어에는 클래스와 함께 함수가 포함되어야 한다. 작은 프로시저로 동작하는 Java의 메서드가 아니라, 하나의 출구만 포함하는 순수한 FP 패러다임에 기반하는 진정한 함수를 포함해야 한다.

#### 🎈 조합 가능한 데코레이터
- 조합 가능한 데코레이터는 그저 다른 객체를 감싸는 객체일 뿐이다. 이것은 디자인 패턴인 데코레이터일 뿐이지만, 이 데코레이터 객체들을 다중계층 구조로 구성하기 시작하면 다음 예제처럼 조합 가능해진다.

```java
names = new Sorted(
  new Unique(
    new Capitalized(
      new Replaced(
        new FileNames(
          new Directory(
            "/var/users/*.xml"
          )
        ),
        "([^.]+)\\.xml",
        "$1"
      )
    )
  )
);
```

- 이 코드는 매우 깔끔하면서도 객체지향적이다. 또한 순순하게 선언형이다.
- 단지 선언만 했을 뿐인데, 이 객체가 무엇인지를 설명할 수 있다.
- 이런 객체들을 조합가능한 데코레이터라고 부른다. `Directory`, `FileNames`, `Replaced`, `Capitalized`, `Unique`, `Sorted` 클래스 각각은 하나의 데코레이터이다.
- 객체들의 전체적인 행동은 내부에 캡슐화하고 있는 객체들에 의해 유도된다. 각 데코레이터는 내부에 캡슐화하고 있는 객체에 별도의 행동을 추가한다. 데코레이터의 상태는 내부에 캡슐화하고 있는 객체들의 상태와 동일하다.
- `if`, `for`. `switch`. `while`과 같은 절차적인 문장이 포함되어 있어서는 안된다.
- `if`는 Java 언어에서 제공하는 연산자이며, 문장을 차례대로 나열하는 절차적인 방식으로 `if`를 사용한다. 미래에는 Java를 대체할 언어가 연산자 `if` 대신 클래스 `If`를 제공하지 못할 이유는 없다. 절차적인 코드 대신 다음과 같이 할 수도 있을 것이다.

```java
float rate;

if (client.age() > 65) {
  rate = 2.5;
} else {
  rate = 3.0;
}

// 객체지향적인 방식으로 개선
float rate = new If(
  new GreaterThan(new AgeOf(client), 65),
  2.5, 3.0
);
```

- 이 코드는 순수하게 객체지향이면서도 선언형이다. 어떤 일도 하지 않으며, 오직 `rate`가 무엇인지만 선언한다.
- 여기서의 요점은 절차적인 연산자가 필요하지 않다는 점이다.
- 긴 메서드와 복잡한 프로시저의 사용을 최대한 자제해야 하고, 작으면서 조합 가능한 클래스들을 설계하고, 더 큰 객체를 조합하기 위해 작은 클래스들을 재사용할 수 있도록 만들어야 한다.
- 객체지향 프로그래밍이란 더 작은 객체들을 기반으로 더 큰 객체들을 조합하는 작업이다.
- 위와 같은 내용들은 정적 메서드를 사용하면 조합이 불가능해진다. **결론적으로, 소프트웨어 어디에서도 `static` 키워드를 사용해서는 안된다.**

### 🦄 인자의 값으로 NULL을 절대 허용하지 마세요
- `NULL`은 정적 메서드 및 가변성과 더불어 객체지향 세계의 골치거리 중 하나다.
- 다음 메서드의 설계를 살펴보자.

```java
public Iterable<File> find(String mask) {
  // 디렉토리를 탐색해서 "*.txt"와 같은 형식의
  // 마스크에 일치하는 모든 파일을 찾는다.
  // 마스크가 NULL인 경우에는 모든 파일을 반환한다.
}
```

- 실제로 `NULL`을 전달하는 방법은 아래의 두 메서드를 하나로 합칠 수 있는 편리한 방법처럼 보인다.

```java
public Iterable<File> findAll();
public Iterable<File> find(String mask);
```

- 하나의 메서드만 제공하면 사용자가 더 쉽고 간편하게 기억할 수 있다.
- `NULL`을 허용하는 `find()` 메서드를 구현하기 위해서는 다음과 같이 분기를 처리할 필요가 있다.

```java
public Iterable<File> find(String mask) {
  if (mask == null) {
    // 모든 파일
  } else {
    // 마스크를 사용해서 파일을 찾는다.
  }
}
```
- 이 코드에서 문제가 되는 부분은 `mask == null`이다. `mask` 객체에게 이야기하는 대신, 이 객체를 피하고 무시한다.
- 객치를 **존중한다면** 다음과 같이 행동한다.

```java
public Iterable<File> find(Mask mask) {
  if (mask.empty()) {
    // 모든 파일
  } else {
    // 마스크를 사용해서 파일을 찾는다.
  }
}
```

- 위 코드를 더 개선할 수 있다.

```java
public Iterable<File> find(Mask mask) {
  Collection<File> files = new LinkedList<>();

  for (File file: /* 모든 파일*/) {
    if (mask.matches(file)) {
      files.add(file);
    }
  }

  return files;
}
```

- 인자의 값으로 `NULL`을 허용하면 `mask == null`과 같은 비교문을 사용할 수 밖에 없다. `NULL` 여부를 체크함으로써 객체가 맡아야 하는 상당량의 책임을 빼앗게 된다. 외부에서 자신의 데이터를 다뤄주기만을 기대하고 스스로를 책임질 수 없게 된다.
- OOP에서 존재하지 않는 인자 문제는 널 객체를 이용해서 해결해야 한다. 전달할 것이 없다면, 비어있는 것처럼 행동하는 객체를 전달하면 된다. 전달한 인자가 객체인지 `NULL`인지를 확인하는 짐을 메서드 구현자에게 떠넘겨서는 안된다. 대신 항상 객체를 전달하되, 전달한 객체에게 무리한 요청을 한다면 응답을 거부하도록 객체를 구현해야 한다.
- 다음과 예제처럼 검색 조건을 지정하기 위해 `find()` 메서드에 전달하는 `Mask` 인터페이스가 있다고 가정한다.

```java
interface Mask {
  boolean matches(File file);
}
```
- 이 인터페이스의 적절한 구현은 글롭 패턴(`*.txt` 형식의 패턴)을 캡슐화하고 이 패턴에 대해 파일 이름을 매칭시킬 것이다. 반면에 널 객체에는 다음과 같이 구현할 수 있다.

```java
class AnyFile implements Mask {
  @Override
  boolean matches(File file) {
    return true;
  }
}
```

- 이 경우는 어떤 내부 로직도 포함하지 않고, 어떤 파일을 전달하더라도 항상 `true`를 반환한다. 이제 `null`을 전달하는 대신, `AnyFile`의 인스턴스를 생성해서 `find()` 메서드에 전달하면 된다.
- 메서드가 인자의 값으로 `NULL`을 허용하지 않기로 했다고 가정했지만, 클라이언트가 여전히 `NULL`을 전달한다면 하나는 방어적인 방법으로 `NULL`을 체크한 후 예외를 던진다.

```java
public Iterable<File> find(Mask mask) {
  if (mask == null) {
    throw new IllegalArgumentException(
      "Mask can't be NULL; please provide an object."
    );
  }
  // 마스크를 사용해서 파일을 찾아 반환
}
```

- 두 번째 방법은 `NULL`을 무사하는 것이다. 여기서는 인자가 절대 `NULL`이 아니라고 가정하고 어떤 대비도 하지 않는다. 메서드를 실행하는 도중에 인자에게 접근하면 `NullPointerException`이 던져지고 메서드 호출자는 실수했다는 사실을 인지하게 될 것이다.
- 중요하지 않은 `NULL` 확인 로직으로 코드를 오명시켜서는 안된다. 방어적으로 대응하기보단 무시함으로써 JVM에 정의된 표준방식으로 처리하는 것이 좋다.
- 요약하자면 **메서드 인자에 절대 `NULL`을 허용하지 마라.**