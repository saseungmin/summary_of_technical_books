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
- **포함 다형성**은 메시지가 동일하더라도 수신한 객체의 타입에 따라 실제로 수행되는 행동이 달라지는 능력을 의미한다. 포함 다형성은 **서브타입 다형성**이라고도 부른다. 보통 객체지향 프로그래밍에서 다형성이라고 부르른 것이 포함 다형성을 의미한다.

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

- `GradeLecture`의 `average` 메서드는 부모 클래스인 `Lecture`에 정의된 `average` 메서드와 이름은 같지만 시그니처는 다르다. 두 메서드는 시그니처가 다르기 떄문에 메서들르 대체하지 않으며, 결과적으로 두 메서드는 공존할 수 있다. 이처럼 부모 클래스에서 정의한 메서드와 이름은 동일하지만 시그니처는 다른 메서드를 자식 클래스에 추가하는 것을 **메서드 오버로딩**이라고 부른다.

### 🎈 데이터 관점의 상속

- `Lecture`의 인스턴스를 생성하면 시스템은 인스턴스 변수 `title`, `pass`, `scores`를 저장할 수 있는 메소리 공간을 할당하고 생성자의 매개변수를 이용해 값을 설정한 후 생성된 인스턴스의 주소를 `lecture`라는 이름의 변수에 대입한다.


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
- 객체지향 언어에서는 메시지를 수신했을 때 실행될 메서드가 런타임에 결정된다. 실행될 메서드를 런타임에 결정하는 방식을 **동적 바인딩**또는 **지연 바인딩**이라고 부른다.
- 객체지향 언어가 제공하는 업캐스팅과 동적 바인딩을 이용하면 부모 클래스 참조에 대한 메시지 전송을 자식 클래스에 대한 메서드 호출로 변환할 수 있다.