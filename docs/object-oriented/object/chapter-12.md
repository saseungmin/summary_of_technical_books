---
sidebar_position: 13
---

# 🌈 Chapter 12: 다형성

## 📚 다형성
- 객체지향 프로그래밍에서 사용되는 다형성은 **유니버셜 다형성**과 **임시(Ad Hoc) 다형성**으로 분류할 수 있다.
- 유니버셜 다형성은 다시 **매개변수 다형성**과 **포함 다형성**으로 분류할 수 있다. 임시 다형성은 **오버로딩 다형성**과 **강제 다형성**으로 분류할 수 있다.
- 하나의 클래스 안에 동일한 메서드가 존재하는 경우 **오버로딩 다형성**이라고 부른다.

```java
public class Money {
  public Money plus(Money amount) {...}
  public Money plus(BigDecimal amount) {...}
  public Money plus(long amount) {...}
}
```

- **강제 다형성**은 언어가 지원하는 자동적인 타입 변환이나 사용자가 직접 구현한 타입 변환을 이용해 동일한 연산자를 다양한 타입에 사용할 수 있는 방식이다. 예를 들어 이항 연산자인 `+`는 피연산자가 모두 정수일 경우에는 덧셈 연산자로 동작하지만 하나는 정수형이고 다른 하나는 문자열인 경우에는 연결 연산자로 동작한다. 이때 정수형 피연산자는 문자열 타입으로 강제 형변환된다.
- **매개변수 다형성**은 **제네릭 프로그래밍**과 관련이 높은데 클래스의 인스턴스 변수나 메서드의 매개변수 타입을 임의의 타입으로 선언한 후 사용하는 시점에 구체적인 타입으로 지정하는 방식을 가리킨다. 예를 들어, 자바의 `List` 인터페이스는 컬렉션에 보관할 요소의 타입을 임의의 타입으로 `T`로 지정하고 있으며 실제 인스턴스를 생성하는 시점에 `T`를 구체적인 타입으로 지정할 수 있게 하고 있다. 따라서 다양한 타입의 요소를 다루기 위해 동일한 오퍼레이션을 사용할 수 있다.
- **포함 다형성**은 메시지가 동일하더라도 수신한 객체의 타입에 따라 실제로 수행되는 행동이 달라지는 능력을 의미한다. 포함 다형성은 **서브타입 다형성**이라고도 부른다. 보통 객체지향 프로그래밍에서 다형성이라고 부르는 것이 포함 다형성을 의미한다.

```java
public class Movie {
  private DiscountPolicy discountPolicy;

  public Money calculateMovieFee(Screening screening) {
    return fee.minus(discountPolicy.calculateDiscountAmount(screening));
  }
}
```

- 포함 다형성을 구현하는 가장 일반적인 방법은 상속을 사용하는 것이다. 두 클래스의 상속 관계로 연결하고 자식 클래스에서 부모 클래스의 메서드를 오버라이딩한 후 클라이언트는 부모 클래스만 참조하면 된다.
- 포함 다형성을 위한 전제조건은 자식 클래스가 부모 클래스의 서브타입이어야 한다는 것이다. 그리고 **상속의 진정한 목적은 코드 재사용이 아니라 다형성을 위한 서브타입 계층을 구축하는 것이다.**
- 포함 다형성을 위해 상속을 사용하는 가장 큰 이유는 상속이 클래스들을 계층으로 쌓아 올린 후 상황에 따라 적절한 메서드를 선택할 수 있는 메커니즘을 제공하기 때문이다.

## 📚 상속의 양면성

### 🎈 상속을 사용한 강의 평가

#### 🐶 Lecture 클래스 살펴보기
- 수강생들의 성적을 계산하는 간단한 예제 프로그램 구현

```java
public class Lecture {
  private int pass; // 이수 여부를 판단할 기준 점수
  private String title;
  private List<Integer> scores = new ArrayList<>();

  public Lecture(String title, int pass, List<Integer> scores) {
    this.title = title;
    this.pass = pass;
    this.scores = scores;
  }

  public double average() {// 전체 학생들의 평균
    return scores.stream()
      .mapToInt(Integer::intValue)
      .average().orElse(0);
  }

  public List<Integer> getScores(){// 전체 학생들의 성적 반환
    return Collections.unmodifiableList(scores);
  }

  public String evaluate() {
    return String.format("Pass: %d Fail: %d", passCount(), failCount());
  }

  private long passCount() {// 이수
    return scores.stream().filter(score -> score >= pass).count();
  }

  private long failCount() {// 낙제
    return scores.size() - passCount();
  }
}
```

- 다음은 이수 기준이 70점인 객체지향 프로그래밍 과목의 수강생 5명에 대한 성적 통계를 구하는 코드이다.

```java
Lecture lecture = new Lecture("객체지향 프로그래밍", 70, Arrays.asList(81, 95, 75, 50, 45));

String evaluation = lecture.evaluate(); // "Pass: 3 Fail: 2"
```

#### 🐶 상속을 이용해 Lecture 클래스 재사용하기
- 원하는 기능은 `Lecture`의 출력 결과에 등급별 통계를 추가하는 것이다.

```java
public class GradeLecture extends Lecture {
  private List<Grade> grades;

  public GradeLecture(String name, int pass, List<Grade> grades, List<Integer> scores) {
    super(name, pass, scores);
    this.grades = grades;
  }
}
```

- `Grade` 클래스는 등급의 이름과 각 등급 범위를 정의하는 최소 성적과 최대 성적을 인스턴스 변수로 포함한다.

```java
public class Grade {
  private String name;
  private int upper, lower;

  private Grade(String name, int upper, int lower) {
    this.name = name;
    this.upper = upper;
    this.lower = lower;
  }

  public String getName() {
    return name;
  }

  public boolean isName(String name) {
    return this.name.equals(name);
  }

  public boolean include(int score) { // 수강생의 성적이 등급에 포함되는지를 검사한다.
    return score >= lower && score <= upper;
  }
}
```

- 이제 `GradeLecture` 클래스에 학생들의 이수 여부와 등급별 통계를 함께 반환하도록 `evaluate` 메서드를 제정의한다.

```java
public class GradeLecture extends Lecture {
  // ...

  @Override
  public String evaluate() {
    return super.evaluate() + ", " + gradesStatistics();
  }

  private String gradesStatistics() {
    return grades.stream()
      .map(grade -> format(grade))
      .collect(joining(" "));
  }

  private String format(Grade grade) {
    return String.format("%s:%d", grade.getName(), gradeCount(grade));
  }

  private long gradeCount(Grade grade) {
    return getScores()
      .stream()
      .filter(grade::include)
      .count();
  }
}
```

- 여기서 주목할 부분은 `GradeLecture`와 `Lecture`에 구현된 두 `evaluate` 메서드의 시그니처가 완전히 동일하다. 부모 클래스와 자식 클래스에 동일한 시그니처를 가진 메서드가 존재할 경우 자식 클래스의 메서드가 우선순위가 더 높다. 즉, 자식 클래스의 메서드가 실행된다.
- 이처럼 자식 클래스 안에 상속받은 메서드와 동일한 시그니처의 메서드를 재정의해서 부모 클래스의 구현을 새로운 구현으로 대체하는 것을 **메서드 오버라이딩**이라고 부른다.

```java
Lecture lecture = new GradeLecture("객체지향 프로그래밍", 70, 
  Arrays.asList(
    new Grade("A", 100, 95),
    new Grade("B", 94, 80),
    new Grade("C", 79, 70),
    new Grade("D", 69, 50),
    new Grade("F", 49, 0)
  ),
  Arrays.asList(81, 95, 75, 50, 45)
);

// 결과 => "Pass: 3 Fail: 2, A:1 B:1 C:1 D:1 F:1"
lecture.evaluate();
```

- 자식 클래스에 부모 클래스에는 없던 새로운 메서드를 추가하는 것도 가능하다.

```java
public class GradeLecture extends Lecture {
  // ...
  public double average(String gradName) {
    return grades.stream()
      .filter(each -> each.isName(gradeName))
      .findFirst()
      .map(this::gradeAverage)
      .orElse(0d);
  }

  private double gradeAverage(Grade grade) {
    return getScores().stream()
      .filter(grade::include)
      .mapToInt(Integer::intValue)
      .average()
      .orElse(0);
  }
}
```

- `GradeLecture`의 `average` 메서드는 부모 클래스인 `Lecture`에 정의된 `average` 메서드와 이름은 같지만 시그니처는 다르다. 두 메서드는 시그니처가 다르기 때문에 메서드를 대체하지 않으며, 결과적으로 두 메서드는 공존할 수 있다. 이처럼 부모 클래스에서 정의한 메서드와 이름은 동일하지만 시그니처는 다른 메서드를 자식 클래스에 추가하는 것을 **메서드 오버로딩**이라고 부른다.

### 🎈 데이터 관점의 상속

- `Lecture`의 인스턴스를 생성하면 시스템은 인스턴스 변수 `title`, `pass`, `scores`를 저장할 수 있는 메모리 공간을 할당하고 생성자의 매개변수를 이용해 값을 설정한 후 생성된 인스턴스의 주소를 `lecture`라는 이름의 변수에 대입한다.


```java
Lecture lecture = new Lecture(
  "객체지향 프로그래밍", 
  70, 
  Arrays.asList(81, 95, 75, 50, 45)
);
```

- `GradeLecture` 클래스의 인스턴스는 직접 정의한 인스턴스 변수뿐만 아니라 부모 클래스인 `Lecture`가 정의한 인스턴스 변수도 함께 포함한다.

```java
Lecture lecture = new GradeLecture("객체지향 프로그래밍", 70, 
  Arrays.asList(
    new Grade("A", 100, 95),
    new Grade("B", 94, 80),
    new Grade("C", 79, 70),
    new Grade("D", 69, 50),
    new Grade("F", 49, 0)
  ),
  Arrays.asList(81, 95, 75, 50, 45)
);
```

- 상속을 인스턴스 관점에서 바라볼 때는 개념적으로 자식 클래스의 인스턴스 안에 부모 클래스의 인스턴스가 포함되는 것으로 생각하는 것이 유용하다.

### 🎈 행동 관점의 상속
- 행동 관점의 상속은 부모 클래스가 정의한 일부 메서드를 자식 클래스의 메서드로 포함시키는 것을 의미한다.
- 부모 클래스의 모든 퍼블릭 메서드는 자식 클래스의 퍼블릭 인터페이스에 포함된다.
- 런타임 시스템이 자식 클래스에 정의되지 않은 메서드가 있을 경우 이 메서드를 부모 클래스 안에서 탐색한다.
- 책 401~403 참고


## 📚 업캐스팅과 동적 바인딩

### 🎈 같은 메시지, 다른 메서드
- 성적 계산 프로그램에 각 교수별로 강의에 대한 성적 통계를 계산하는 기능을 추가한다.

```java
public class Professor {
  private String name;
  private Lecture lecture;

  public Professor(String name, Lecture lecture) {
    this.name = name;
    this.lecture = lecture;
  }

  // 통계 정보를 생성
  public String compileStatistics() {
    return String.format("[%s] %s - Avg: %.1f", name, lecture.evaluate(), lecture.average());
  }
}
```

- 다음은 다익스트라 교수가 강의하는 알고리즘 과목의 성적 통계를 계산하는 코드다.

```java
Professor professor = new Professor("다익스트라",
  new Lecture("알고리즘",
    70,
    Arrays.asList(81, 95, 75, 50, 45)
  )
);

// 결과 => "[다익스트라]Pass: 3 Fail: 2 - Avg: 69.2"
String statistics = professor.compileStatistics();
```

- 다음은 `GradeLecture`의 인스턴스를 전달한 것이다.

```java
Professor professor = new Professor("다익스트라",
  new GradeLecture("알고리즘",
    70,
    Arrays.asList(
      new Grade("A", 100, 95),
      new Grade("B", 94, 80),
      new Grade("C", 79, 70),
      new Grade("D", 69, 50),
      new Grade("F", 49, 0)
    ),
    Arrays.asList(81, 95, 75, 50, 45)
  )
);

// 결과 => "[다익스트라] Pass: 3 Fail: 2, A:1 B:1 C:1 D:1 F:1 - Avg: 69.2"
String statistics = professor.compileStatistics();
```

- 이 예제는 동일한 메시지를 전송하는 동일한 코드 안에서 서로 다른 클래스 안에 구현된 메서드를 실행할 수 있다는 사실을 알 수 있다.
- 이처럼 코드 안에서 선언된 참조 타입과 무관하게 실제로 메시지를 수신하는 객체의 타입에 따라 실행되는 메서드가 달라질 수 있는 것은 업캐스팅과 동적 바인딩이라는 메커니즘이 작용하기 때문이다.
- 부모 클래스 타입으로 선언된 변수에 자식 클래스의 인스턴스를 할당하는 것이 가능하다. 이를 **업캐스팅**이라고 부른다.
- 선언된 변수의 타입이 아니라 메시지를 수신하는 객체의 타입에 따라 실행되는 메서드가 결정된다. 이것은 객체지향 시스템이 메시지를 처리할 적절한 메서드를 컴파일 시점이 아니라 실행 시점에 결정하기 때문에 가능하다. 이를 **동적 바인딩**이라고 부른다.
- 업케스팅은 서로 다른 클래스의 인스턴스를 동일한 타입에 할당하는 것을 가능하게 해준다. 따라서 부모 클래스에 대해 작성된 코드를 전혀 수정하지 않고도 자식 클래스에 적용할 수 있다.
- 동적 메서드 탐색은 부모 클래스의 타입에 대해 메시지를 전송하더라도 실행 시에는 실제 클래스를 기반으로 실행될 메서드가 선택되게 해준다. 따라서 코드를 변경하지 않고도 실행되는 메서드를 변경할 수 있다.

### 🎈 업캐스팅
- 모든 객체지향 언어는 명시적으로 타입을 변환하지 않고도 부모 클래스 타입의 참조 변수에 자식 클래스의 인스턴스를 대입할 수 있게 허용한다.

```java
Lecture lecture = new GradeLecture(...);
```

- 부모 클래스 타입으로 선언된 파라미터에 자식 클래스의 인스턴스를 전달하는 것도 가능하다.

```java
public class Professor {
  public Professor(String name, Lecture lecture) {...}
}

Professor professor = new Professor("다익스트라", new GradeLecture(...));
```

- 반대로 부모 클래스의 인스턴스를 자식 클래스 타입으로 변환하기 위해서는 명시적인 타입 캐스팅이 필요한데 이를 **다운캐스팅**(**downcasting**)이라고 부른다.

```java
Lecture lecture = new GradeLecture(...);
GradeLecture gradeLecture = (GradeLecture)lecture;
```

- 컴파일러의 관점에서 자식 클래스는 아무런 제약 없이 부모 클래스를 대체할 수 있기 때문에 부모 클래스와 협력하는 클라이언트는 다양한 자식 클래스의 인스턴스와도 협력하는 것이 가능하다.

### 🎈 동적 바인딩
- 함수를 호출하는 전통적인 언어들은 호출될 함수를 컴파일타임에 결정한다. 다시 말해 코드를 작성하는 시점에 호출될 코드가 결정된다. 아처럼 컴파일타임에 호출할 함수를 결정하는 방식을 **정적 바인딩**, **초기 바인딩**, 또는 **컴파일타임 바인딩**이라고 부른다.
- 객체지향 언어에서는 메시지를 수신했을 때 실행될 메서드가 런타임에 결정된다. 실행될 메서드를 런타임에 결정하는 방식을 **동적 바인딩** 또는 **지연 바인딩**이라고 부른다.
- 객체지향 언어가 제공하는 업캐스팅과 동적 바인딩을 이용하면 부모 클래스 참조에 대한 메시지 전송을 자식 클래스에 대한 메서드 호출로 변환할 수 있다.

## 📚 동적 메서드 탐색과 다형성
- 객체지향 시스템은 다음 규칙에 따라 실행할 메서드를 선택한다.

> 1. 메시지를 수신한 객체는 먼저 자신을 생성한 클래스에 적합한 메서드가 존재하는지 검사한다. 존재하면 메서드를 실행하고 탐색을 종료한다.
> 2. 메서드를 찾지 못했다면 부모 클래스에서 메서드 탐색을 계속한다. 이 과정은 적합한 메서드를 찾을 때까지 상속 계층을 따라 올라가며 계속된다.
> 3. 상속 계층의 가장 최상위 클래스에 이르렀지만, 메서드를 발견하지 못한 경우에 예외를 발생시키며 탐색을 중단한다.

- 메시지 탐색과 관련해서 이해해야 하는 중요한 변수는 **self 참조**(**self reference**)이다. 객체가 메시지를 수신하면 컴파일러는 `self` 참조라는 임시 변수를 자동으로 생성한 후 메시지를 수신한 객체를 가리키도록 설정한다.
- 동적 메서드 탐색은 `self`가 가리키는 객체의 클래스에서 시작해서 상속 계층의 역방향으로 이뤄지며 메서드 탐색이 종료되는 순간 `self` 참조는 자동으로 소멸된다.
- 메서드 탐색은 자식 클래스에서 부모 클래스의 방향으로 진행된다. 따라서 항상 자식 클래스의 메서드가 부모 클래스의 메서드보다 먼저 탐색되기 때문에 자식 클래스에 선언된 메서드가 부모 클래스의 메서드보다 더 높은 우선순위를 가지게 된다.
- 클래스 사이의 위임은 프로그래머 개입 없이 상속 계층을 따라 자동으로 이뤄지는데 이것을 **자동적인 메시지 위임**이라고 한다.
- 메시지를 수신했을 때 실제로 어떤 메서드를 실행할지를 결정하는 것은 컴파일 시점이 아닌 실행 시점에 이뤄지며, 메서드를 탐색하는 경로는 `self` 참조를 이용해서 결정한다. 따라서 메서드를 탐색하기 위해 **동적인 문맥**을 사용한다.

### 🎈 자동적인 메시지 위임
- 적절한 메서드를 찾을 때까지 상속 계층을 따라 부모 클래스로 처리가 위임된다.
- 메시지는 상속 계층을 따라 부모 클래스에게 자동으로 위임된다. 이런 관점에서 상속 계층을 정의하는 것은 메서드 탐색 경로를 정의하는 것과 동일하다.

#### 🐶 메서드 오버라이딩
- 메서드 오버라이딩은 자식 클래스의 메서드가 동일한 시그니처를 가진 부모 클래스의 메서드보다 먼저 탐색되기 때문에 벌어지는 현상이다.

```java
Lecture lecture = new GradeLecture(...);
lecture.evaluate();
```

- 위 예제에서 동적 메서드 탐색은 `self` 참조가 가리키는 객체의 클래스인 `GradeLecture`에서 시작되고 `GradeLecture` 클래스 안에 `evaluate` 메서드가 구현돼 있기 때문에 먼저 발견된 메서드가 실행되는 것이다.
- 자식 클래스가 부모 클래스의 메서드를 오버라이딩하면 자식 클래스에서 부모 클래스로 향하는 메서드 탐색 순서 때문에 자식 클래스의 메서드가 부모 클래스의 메서드를 *감추게 된다*.

#### 🐶 메서드 오버로딩

```java
GradeLecture lecture = new GradeLecture(...);
lecture.average("A");
```

- 이 경우 메시지에 응답할 수 있는 `average` 메서드를 `GradeLecture` 클래스에서 발견할 수 있기 때문에 동적 메서드 탐색은 탐색이 시작되는 첫 번째 클래스인 `GradeLecture`에서 종료된다.
- 이번에는 `GradeLecture` 클래스의 인스턴스에 이름은 동일하지만 파라미터는 갖지 않는 `average` 메시지를 전송하는 경우이다.

```java
Lecture lecture = new GradeLecture(...);
lecture.average();
```

- 이번에는 `GradeLecture` 클래스 안에서 메시지에 응답할 수 있는 적절한 메서드를 발견하지 못하기 때문에 부모 클래스인 `Lecture` 클래스에서 메서드를 찾으려고 시도한다. `Lecture`에는 적절한 시그니처를 가진 `average` 메서드가 존재하기 때문에 해당 메서드를 실행한 후 메서드 탐색을 종료한다.
- 이처럼 시그니처가 다르기 때문에 동일한 이름의 메서드가 공존하는 경우를 메서드 오버로딩이라고 부른다.
- 메서드 오버라이딩은 메서드를 감추지만 메서드 오버로딩은 사이좋게 공존한다. 다시 말해서 클라이언트의 관점에서 오버로딩된 모든 메서드를 호출할 수 있는 것이다.

### 🎈 동적인 문맥
- 메시지가 수신한 객체가 무엇이냐에 따라 메서드 탐색을 위한 문맥이 동적으로 바뀐다. 그리고 이 동적인 문맥을 결정하는 것은 메시지를 수신한 객체를 가리키는 `self` 참조다.
- 동일한 코드라고 하더라도 `self`참조가 가리키는 객체가 무엇인지에 따라 메서드 탐색을 위한 상속 계층의 범위가 동적으로 변한다. 따라서 `self` 참조가 가리키는 객체의 타입을 변경함으로써 객체가 실행될 문맥을 동적으로 바꿀 수 있다.
- `self` 참조가 동적 문맥을 결정한다는 사실은 종종 어떤 메서드가 실행될지를 예상하기 어렵게 만드는데 대표적인 경우 자신에게 다시 메시지를 전송하는 **self 전송**이다.

```java
public class Lecture {
  public String stats() {
    return String.format("Title: %s, Evaluation Method: %s", title, getEvaluationMethod());
  }

  public String getEvaluationMethod() {
    return "Pass or Fail";
  }
}
```

- 위 예제에서 현재 객체에게 `getEvaluationMethod` 메시지를 전송하고 있다. 여기서 현재 객체란 `self` 참조가 가리키는 객체다. 이 객체는 처음에 `stats` 메시지를 수신했던 바로 그 객체다. 이처럼 `self` 참조가 가리키는 자기 자신에게 메시지를 전송하는 것을 `self` 전송이라고 부른다.
- `self` 전송을 이해하기 위해서 `self` 참조가 가리키는 바로 그 객체에서부터 메시지 탐색을 다시 시작하는 사실을 기억해야 한다.
- 여기서 중요한 것은 `getEvaluationMethod`라는 문장이 `Lecture` 클래스의 `getEvaluationMethod` 메서드를 실행시키라는 의미가 아니라 `self`가 참조하는 현재 객체에 `getEvaluationMethod` **메시지를 전송** 하라는 것이다. 그리고 메서드 탐색은 처음에 메시지를 탐색을 시작했던 `self` 참조가 가리키는 바로 그 클래스에서부터 다시 시작한다는 것이다.
- 하지만 상속이 끼어들면 이야기가 달라지는데 이번에는 `Lecture` 클래스를 상속받는 `GradeLecture` 클래스에서 다음과 같이 `getEvaluationMethod` 메서드를 오버라이딩해본다.

```java
public class GradeLecture extends Lecture {
  @Override
  public String getEvaluationMethod() {
    return "Grade";
  }
}
```

- `GradeLecture`에 `stats` 메시지를 전송하면 `self` 참조는 `GradeLecture`의 인스턴스를 가리키도록 설정되고 메서드 탐색은 `GradeLecture` 클래스에서부터 시작된다. `GradeLecture` 클래스에는 `stats` 메시지를 처리할 수 있는 적절한 메서드가 존재하지 않기 때문에 부모 클래스인 `Lecture`에서 메서드 탐색을 계속하고 `Lecture` 클래스의 `stats` 메서드를 발견하고는 이를 실행할 것이다.
- `Lecture` 클래스의 `stats` 메서드를 실행하는 중에 `self` 참조가 가리키는 객체에게 `getEvaluationMethod` 메시지를 전송하는 구문과 마주치게 된다. 이제 메시지 탐색은 `self` 참조가 가리키는 객체에서 시작된다.
- 여기서 `self` 참조가 가리키는 객체는 바로 `GradeLecture`의 인스턴스다. 따라서 메시지 탐색은 `Lecture` 클래스를 벗어나 `self` 참조가 가리키는 `GradeLecture`에서부터 다시 시작된다.
- 시스템은 `GradeLecture` 클래스에서 `getEvaluationMethod` 메서드를 발견하고 실행한 후 동적 메서드 탐색을 종료한다.
- `self` 전송은 자식 클래스에서 부모 클래스 방향으로 진행되는 동적 메서드 탐색 경로를 다시 `self` 참조가 가리키는 원래의 자식 클래스로 이동시킨다. 이로인해 `self` 전송이 깊은 상속 계층과 계층 중간중간에 함정처럼 숨어져 있는 메서드 오버라이딩과 만나면 극단적으로 이해하기 어려운 코드가 만들어진다.

### 🎈 이해할 수 없는 메시지
  
#### 🐶 정적 타입 언어와 이해할 수 없는 메시지
- 정적 타입 언어에서는 코드를 컴파일할 때 상속 계층 안의 클래스들이 메시지를 이해할 수 있는지 여부를 판단한다. 따라서 상속 계층 전체를 탐색한 후에도 메시지를 처리할 수 있는 메서드를 발견하지 못했다면 컴파일 에러를 발생시킨다.

```java
Lecture lecture = new GradeLecture(...);
lecture.unknownMessage(); // 컴파일 에러!
```

#### 🐶 동적 타입 언어와 이해할 수 없는 메시지
- 동적 타입 언어 역시 메시지를 수신한 객체의 클래스부터 부모 클래스의 방향으로 메서드를 탐색한다.
- 차이점이라면 동적 타입 언어에는 컴파일 단계가 존재하지 않기 때문에 실제로 코드를 실행해보기 전에는 메시지 처리 가능 여부를 판단할 수 없다는 점이다.
- 만약 상속 계층 안의 어떤 클래스도 메시지를 처리할 수 없다면 메시지 탐색은 다시 한번 최상위 클래스에 이르게 되고 최종적으로 예외가 던져진다.
- 동적 타입 언어는 이해할 수 없는 메시지 처리를 할 수 있는 능력을 가짐으로써 메시지가 선언된 인터페이스와 메서드가 정의된 구현을 분리할 수 있다. 메시지 전송자는 자신이 원하는 메시지를 전송하고 메시지 수신자는 스스로 판단에 따라 메시지를 처리한다. 이것은 메시지를 기반으로 협력하는 자율적인 객체라는 순순한 객체지향의 이상에 좀 더 가까운 것이다. 그러나 동적 타입 언어의 이러한 동적인 특성과 유연성은 코드를 이해하고 수정하기 어렵게 만들뿐만 아니라 디버깅 과정을 복잡하게 만들기도 한다.
- 정적 타입 언어에는 이런 유연성이 부족하지만 좀 더 안정적이다. 모든 메시지는 컴파일타임에 확인되고 이해할 수 없는 메시지는 컴파일 에러로 이어진다. 컴파일 시점에 수신 가능한 메시지를 체크하기 때문에 이해할 수 없는 메시지를 처리할 수 있는 유연성은 잃게 되지만 실행 시점에 오류가 발생할 가능성을 줄여 더 안정적으로 실행 될 수 있다.

### 🎈 self 대 super

- `self` 참조의 가장 큰 특징은 동적이라는 점이다. `self` 참조는 메시지를 수신한 객체의 클래스에 따라 메서드 탐색을 위한 문맥을 실행 시점에 결정한다.
- 자식 클래스에서 부모 클래스의 구현을 재사용해야 하는 경우가 있는데 `super` 참조라는 내부 변수를 제공한다.

```java
public class GradeLecture extends Lecture {
  @Override
  public String evaluate() {
    return super.evaluate() + ", " + gradesStatistics();
  }
}
```

- `super` 참조의 용도는 부모 클래스에 정의된 메서드를 실행하기 위한 것이 아니다. `super` 참조의 정확한 의도는 지금 이 클래스의 부모 클래스에서부터 메서드 탐색을 시작하라는 것이다. 만약 부모 클래스에서 원하는 메서드를 찾지 못한다면 더 상위 부모 클래스로 이동하면서 메서드가 존재하는지 검사한다. 이것은 `super` 참조를 통해 실행하고자 하는 메서드가 반드시 부모 클래스에 위치하지 않아도 되는 유연성을 제공한다.
- 그렇기 때문에 부모 클래스의 메서드를 호출하는 것과 부모 클래스에서 메서드 탐색을 시작하는 것은 의미가 다른데, 전자는 그 메서드가 반드시 부모 클래스 안에 정의돼 있어야 한다는 것을 의미하고 그에 비해 부모 클래스에서 메서드 탐색을 시작한다는 것은 그 클래스의 조상 어딘가에 그 메서드가 정의돼 있기만 하면 실행할 수 있다는 것을 의미한다.
- 이처럼 `super` 참조를 통해 메시지를 전송하는 것은 마치 부모 클래스의 인스턴스에게 메시지를 전송하는 것처럼 보이기 때문에 이를 **super 전송**이라고 부른다.
- `self` 전송이 메시지를 수신하는 객체의 클래스에 따라 메서드를 탐색할 시작 위치를 동적으로 결정하는 데 비해 `super` 전송은 항상 메시지를 전송하는 클래스의 부모 클래스에서부터 시작된다.
- `self` 전송의 경우 메서드 탐색을 시작할 클래스를 반드시 실행 시점에 동적으로 결정해야 하지만 `super` 전송의 경우에는 컴파일 시점에 미리 결정해 놓을 수 있다.

## 📚 상속 대 위임

### 🎈 위임과 self 참조
- `self` 참조는 항상 메시지를 수신한 객체를 가리킨다. 따라서 메서드 탐색 중에는 자식 클래스의 인스턴스와 부모 클래스의 인스턴스가 동일한 `self` 참조를 공유하는 것으로 봐도 무방하다.

```ruby
class Lecture
  def initialize(name, scores)
    @name = name
    @scores = scores
  end

  def stats(this)
    "Name: #{@name}, Evaluation Method: #{this.getEvaluationMethod()}"
  end

  def getEvaluationMethod()
    "Pass or Fail"
  end
end
```

- 위 코드에서 실제로 실행되는 메서드가 `Lecture`의 `getEvaluationMethod` 메서드가 아닐 수 있다는 사실을 명시적르오 드러낸다. `getEvaluationMethod`를 정의한 다른 객체가 전달되면 해당 객체의 메서드가 실행될 수도 있을 것이다.
- 다음은 `Lecture`를 상속받은 `GradeLecture` 클래스의 코드이다.

```ruby
class GradeLecture
  def initialize(name, canceled, scores)
    @parent = Lecture.new(name, scores)
    @canceled = canceled
  end

  def stats(this)
    @parent.stats(this) # 부모 클래스인 Lecture의 인스턴스를 할당
  end

  def getEvaluationMethod()
    "Grade"
  end
end
```

- `GradeLecture`의 `stats` 메서드는 메시지를 직접 처리하지 않고 `Lecture`의 `stats` 메서드에게 요청을 전달한다. 이처럼 자신이 수신한 메시지를 다른 객체에게 동일하게 전달해서 처리를 요청하는 것을 **위임**(**delegation**)이라고 한다.
- 위임은 자신이 정의하지 않거나 처리할 수 없는 속성 또는 메서드의 탐색 과정을 다른 객체로 이동시키기 위해 사용한다. 이를 위해 위임은 항상 현재의 실행 문맥을 가리키는 `self` 참조를 인자로 전달한다. 이것이 `self` 참조를 전달하지 않는 포워딩과 위임의 차이점이다.
- 처리를 요청할 때 `self` 참조를 전달하지 않는 경우를 포워딩이라고 부른다. 이와 달리 `self` 참조를 전달하는 경우에는 위임이라고 부른다. 위임의 정확한 용도는 클래스를 이용한 상속 관계를 객체 사이의 합성 관계로 대체해서 다형성을 구현하는 것이다.
- 이 `self` 참조의 전달은 결과적으로 자식 클래스의 인스턴스와 부모 클래스의 인스턴스 사이에 동일한 실행 문맥을 공유할 수 있게 해준다.
- 상속은 동적으로 메서드를 탐색하기 위해 현재의 실행 문맥을 가지고 있는 `self` 참조를 전달한다. 그리고 이 객체들 사이에서 메시지를 전달하는 과정은 자동으로 이뤄진다. 따라서 **자동적인 메시지 위임**이라고 부르는 것이다.

### 🎈 프로토타입 기반의 객체지향 언어
- 클래스 기반 객체지향 언어들이 상속을 이용해 클래스 사이에 `self` 참조를 자동으로 전달하는 것처럼 프로토타입 기반의 객체지향 언어들 역시 위임을 이용해 객체 사이에 `self` 참조를 자동으로 전달한다.
- 다음은 프로토타입 기반의 객체지향 언어인 자바스크립트를 이용한 객체 사이의 상속이 어떻게 이뤄지는지 살펴본다.

```js
function Lecture(name, scores) {
  this.name = name;
  this.scores = scores;
}

Lecture.prototype.stats = function() {
  return "Name:" + this.name + ", Evaluation Method: " + this.getEvaluationMethod();
}

Lecture.prototype.getEvaluationMethod = function() {
  return "Pass or Fail";
}
```

- 이제 `GradeLecture`가 `Lecture`를 상속받게 하고 `getEvaluationMethod` 메서드를 오버라이딩한다.

```js
function GradeLecture(name, canceled, scores) {
  Lecture.call(this, name, scores);
  this.canceled = canceled;
}

GradeLecture.prototype = new Lecture();
GradeLecture.prototype.constructor = GradeLecture;
GradeLecture.prototype.getEvaluationMethod = function() {
  return "Grade";
}
```

- `GradeLecture`의 `prototype`에 `Lecture`의 인스턴스를 할당했다. 이 과정을 통해 `GradeLecture`를 이용해 생성된 모든 객체들이 `prototype`을 통해 `Lecture`에 정의된 모든 속성과 함수에 접근할 수 있게 된다. 결과적으로 `GradeLecture`의 모든 인스턴스들은 `Lecture`의 특성을 자동으로 상속받게 된다. 이제 메시지를 전송하면 `prototype`으로 연결된 객체 사이의 경로를 통해 객체 사이의 메서드 탐색이 자동으로 이뤄진다.

```js
var grade_lecture = new GradeLecture("OOP", false, [1, 2, 3]);
grade_lecture.stats();
```

- 메서드를 탐색하는 과정은 클래스 기반 언어의 상속과 거의 동일하다. 단지 정적인 클래스 간의 관계가 아니라 동적인 객차 사이의 위임을 통해 상속을 구현하고 있을 뿐이다. 
- `Lecture`의 `stats` 메서드 안에 `this`는 `Lecture`의 인스턴스가 아니다. 메시지를 수신한 현재 객체를 가리킨다.
