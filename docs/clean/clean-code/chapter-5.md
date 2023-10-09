---
sidebar_position: 6
---

# 🍭 Chapter 5: 형식 맞추기

프로그래머라면 형식을 깔끔하게 맞춰 코드를 짜야 한다. 코드 형식을 맞추기 위한 간단한 규칙을 정하고 그 규칙을 착실히 따라야 한다. 팀으로 일한다면 팀이 합의해 규칙을 정하고 모두가 그 규칙을 따라야 한다. 필요하다면 규칙을 자동으로 적용하는 도구를 활용한다.

## 🎃 형식을 맞추는 목적
코드 형식은 중요하다. 너무나도 중요하므로 융통성 없이 맹목적으로 따르면 안 된다. 코드 형식은 의사소통의 일환이다. 의사소통 전문 개발자의 일차적인 의무다.   

오늘 구현한 기능이 다음 버전에서 바뀔 확률은 아주 높다. 그런데 오늘 구현한 코드의 가독성은 앞으로 바뀔 코드의 품질에 지대한 영향을 미친다. 오랜 시간이 지나 원래 코드의 흔적을 더 이상 찾아보기 어려울 정도로 코드가 바뀌어도 맨 처음 잡아놓은 구현 스타일과 가독성 수준은 유지보수 용이성과 확장성에 계속 영향을 미친다. 원래 코드는 사라질지라도 개발자의 스타일과 규율은 사라지지 않는다.

## 🎃 적절한 행 길이를 유지하라
세로 길이부터 살펴보자. 소스 코드는 얼마나 길어야 적당할까? 자바에서 파일 크기는 클래스 크기와 밀접하다.   

일반적으로 큰 파일보다 작은 파일이 이해하기 쉽다.

### 🎈 신문 기사처럼 작성하라
이름이 간단하면서도 설명이 가능하게 짓는다. 이름만 보고도 올바른 모듈을 살펴보고 있는지 아닌지를 판단할 정도로 신경 써서 짓는다. 소스 파일 첫 부분은 고차원 개념과 알고리즘을 설명한다. 아래로 내려갈수록 의도를 세세하게 묘사한다. 마지막에는 가장 저차원 함수와 세부 내역이 나온다.   

신문은 다양한 기사로 이뤄진다. 대다수 기사가 아주 짧다. 어떤 기사는 조금 길다. 한 면을 채우는 기사는 거의 없다.

### 🎈 개념을 빈 행으로 분리하라
거의 모든 코드는 왼쪽에서 오른쪽으로 그리고 위에서 아래로 읽힌다. 각 행은 수식이나 절을 나타내고, 일련의 행 묶음은 완결된 생각 하나를 표현한다. 생각 사이에는 빈 행을 넣어 분리해야 마땅하다.   

빈 행은 새로운 개념을 시작한다는 시각적 단서다. 코드를 읽어 내려가다 보면 빈 행 바로 다음 줄에 눈길이 멈춘다. 빈 행을 빼버리면 코드 가독성이 현저하게 떨어져 암호처럼 보인다. 눈의 초점을 흐리게 하고 코드를 바라보면 효과는 더욱 분명하게 드러난다.

### 🎈 세로 밀집도
줄바꿈이 개념을 분리한다면 세로 밀집도는 연관성을 의미한다. 즉, 서로 밀집한 코드 행은 세로로 가까이 놓여야 한다는 뜻이다. 다음 예제를 살펴보자. 의미 없는 주석으로 두 인스턴스 변수를 떨어뜨려 놓았다.

```java
public class ReporterConfig {
  /**
   * 리포터 리스너의 클래스 이름
   */
  private String m_className;

  /**
   * 리포터 리스너의 속성
   */
  private List<Property> m_properties = new ArrayList<Property>();
  public void addProperty(Property property) {
    m_properties.add(property);
  }
}
```

다음 예제가 훨씬 더 읽기 쉽다. 코드가 '한눈'에 들어온다. 적어도 내게는 그렇다. 척 보면 변수 2개에 메서드가 1개인 클래스라는 사실이 드러난다. 머리나 눈을 움직일 필요가 거의 없다.

```java
public class ReporterConfig {
  private String m_className;
  private List<Property> m_properties = new ArrayList<Property>();

  public void addProperty(Property property) {
    m_properties.add(property);
  }
}
```

### 🎈 수직 거리
시스템이 무엇을 하는지 이해하고 싶은데, 이 조각 저 조각이 **어디에** 이는지 찾고 기억하느라 시간과 노력을 소모한다.   

서로 밀접한 개념은 세로로 가까이 둬야 한다. 물론 두 개념이 서로 다른 파일에 속한다면 규칙이 통하지 않는다. 하지만 타당한 근거가 없다면 서로 밀접한 개념은 한 파일에 속해야 마땅하다. 이게 바로 `protected` 변수를 피해야 하는 이유 중 하나다.   

같은 파일에 속할 정도로 밀접한 두 개념은 세로 거리로 연관성을 표현한다. 여기서 연관성이란 한 개념을 이해하는 데 다른 개념이 중요한 정도다. 연관성이 깊은 두 개념이 멀리 떨어져 있으면 코드를 읽는 사람이 소스 파일과 클래스 여기저기 뒤지게 된다.   

**변수 선언**. 변수를 사용하는 위치에 최대한 가까이 선언한다. 우리가 만든 함수는 매우 짧으므로 지경 변수는 각 함수 맨 처음에 선언한다. 다음은 JUnit 4.3.1에서 가져온 다소 긴 함수다.

```java
private static void readPreferences() {
  InputStream is = null;

  try {
    is = new FileInputStream(getPreferencesFile());
    setPreferences(new Properties(getPreferences()));
    getPreferences().load(is);
  } catch (IOException e) {
    try {
      if (is != null)
        is.close();
    } catch (IOException e1) {
      // ...
    }
  }
}
```

루프를 제어하는 변수는 흔히 루프 문 내부에 선언한다. 다음 예제 역시 JUnit 4.3.1에서 가져온 작고 귀여운 함수다.

```java
public int countTestCases() {
  int count = 0;
  for (Test each: tests)
    count += each.countTestCases();
  return count;
}
```

**인스턴스 변수**. 반면, 인스턴스 변수는 클래스 맨 처음에 선언한다. 변수 간에 세로로 거리를 두지 않는다. 잘 설계한 클래스는 많은 (혹은 대다수) 클래스 메서드가 인스턴스 변수를 사용하기 때문이다.   

잘 알려진 위치에 인스턴스 변수를 모은다. 변수 선언을 어디서 찾을지 모두가 알고 있어야 한다.   

**종속 함수**. 한 함수가 다른 함수를 호출한다면 두 함수는 세로로 가까이 배치한다. 또한 가능하다면 호출하는 함수를 호출되는 함수보다 먼저 배치한다. 그러면 프로그램이 자연스럽게 읽힌다. 규칙을 일관적으로 적용한다면 독자는 방금 호출한 함수가 잠시 후에 정의되리라는 사실을 예측한다. 호출되는 함수를 찾기가 쉬워지며, 그만큼 모듈 전체의 가독성도 높아진다.   

**개념적 유사성**. 어떤 코드는 서로 끌어당긴다. 개념적인 친화도가 높기 때문이다. 친화도가 높을수록 코드를 가까이 배치한다. 친화도가 높은 요인은 여러 가지다. 앞서 보았듯이, 한 함수가 다른 함수를 호출해 생기는 직접적인 종속성이 한 예다. 변수와 그 변수를 사용하는 함수도 한 예다. 하지만 그 외에도 친화도를 높이는 요인이 있다. 비슷한 동작을 수행하는 일군의 함수가 좋은 예다.

```java
public class Assert {
  static public void assertTrue(String message, boolean condition) {
    if (!condition)
      fail(message);
  }

  static public void assertTrue(boolean condition) {
    assertTrue(null, condition);
  }

  static public void assertFalse(String message, boolean condition) {
    assertTrue(message, !condition);
  }

  static public void assertFalse(boolean condition) {
    assertFalse(null, condition);
  }
  // ...
}
```

위 함수들은 개념적인 친화도가 매우 높다. 명명법이 똑같고 기본 기능이 유사하고 간단하다. 서로가 서로를 호출하는 관계는 부차적인 요인이다. 종속적인 관계가 없더라도 가까이 배치할 함수들이다.

### 🎈 세로 순서
일반적으로 함수 호출 종속성은 아래 방향으로 유지한다. 다시 말해, 호출되는 함수를 호출하는 함수보다 나중에 배치한다. 그러면 소스 코드 모듈이 고차원에서 저차원으로 자연스럽게 내려간다.   

신문 기사와 마찬가지로 가장 중요한 개념은 가장 먼저 표현한다. 가장 중요한 개념을 표현할 때는 세세한 사항을 최대한 배제한다. 세세한 사항은 가장 마지막에 표현한다. 그러면 독자가 소스 파일에서 첫 함수 몇 개만 읽어도 개념을 파악하기 쉬워진다. 세세한 사항까지 파고들 필요가 없다.

## 🎃 가로 형식 맞추기
짧은 행이 바람직하다. 100자나 120자에 달해도 나쁘지 않다. 하지만 그 이상은 솔직히 주의부족이다.   

예저에는 오른쪽으로 스크롤할 필요가 절대로 없게 코드를 짰다. 하지만 요즘 모니터가 아주 크다. 게다가 젊은 프로그래머들은 글꼴 크기를 왕찰 줄여, 200자까지도 한 화면에 들어간다. 가급적이면 그렇게 하지 말기를 권한다. 개인적으로는 120자 정도가 행 길이를 제한한다.

### 🎈 가로 공백과 밀집도
가로로는 공백을 사용해 밀접한 개념과 느슨한 개념을 표현한다. 다음 함수를 살펴보자.

```java
private void measureLine(String line) {
  lineCount++;
  int lineSize = line.length();
  totalChars += lineSize;
  lineWidthHistogram.addLine(lineSize, lineCount);
  recordWidestLine(lineSize);
}
```

할당 연산자를 강조하려고 앞뒤에 공백을 줬다. 할당문은 왼쪽 요소와 오른쪽 요소가 분명히 나뉜다. 공백을 넣으면 두 가지 주의 요소가 확실히 나뉜다는 사실이 더욱 분명해진다.   

반면, 함수 이름과 이어지는 괄호 사이에는 공백을 넣지 않았다. 함수와 인수는 서로 밀접하기 때문이다. 공백을 넣으면 한 개념이 아니라 별개로 보인다. 함수를 호출하는 코드에서 괄호 안 인수는 공백으로 분리했다. 쉼표를 강조해 인수가 별개라는 사실을 보여주기 위해서다.   

연산자 우선순위를 강조하기 위해서도 공백을 사용한다.

```java
public class Quadratic {
  public static double root1(double a, double b, double c) {
    double determinant = determinant(a, b, c);
    return (-b + Math.sqrt(determinant)) / (2*a);
  }
}
```

수식을 읽기가 아주 편하다. 승수 사이에는 공백이 없다. 곱셈은 우선순위가 가장 높기 때문이다. 항 사이에는 공백이 들어간다. 덧셈과 뺄셈은 우선순위가 곱셈보다 낮기 때문이다.   

### 🎈 가로 정렬

```java
public class FitNesseExpediter implements ResponseSender {
  private Socket          socket;
  private InputStream     input;
  private OutputStream    output;
  private Request         request;
  private Response        response;
  private FitNesseContext context;
  // ...
}
```

위와 같은 정렬은 별로 유용하지 못하다. 코드가 엉뚱한 부분을 강조해 진짜 의도가 가려지기 때문이다. 예를 들어, 위 선언부를 읽다 보면 변수 유형은 무시하고 변수 이름부터 읽게 된다.   

그래서 나는 더 이상 위와 같이 코드를 장려하지 않는다. 이제는 다음과 같이, 선언문과 할당문을 별도로 정렬하지 않는다. 정렬하지 않으면 오히려 중대한 결함을 찾기 쉽다. 정렬이 필요할 정도로 목록이 길다면 문제는 목록 **길이**지 정렬 부족이 아니다. 선언부가 길다면 클래스를 쪼개야 한다는 의미다.

```java
public class FitNesseExpediter implements ResponseSender {
  private Socket socket;
  private InputStream input;
  private OutputStream output;
  private Request request;
  private Response response;
  private FitNesseContext context;
  // ...
}
```

### 🎈 들여쓰기
범위(scope)로 이뤄진 계층을 표현하기 위해 우리는 코드를 들여쓴다. 들여쓰는 정도는 계층에서 코드가 자리잡은 수준에 비례한다. 클래스 정의처럼 파일 수준인 문장은 들여쓰지 않는다. 클래스 내 메서드는 클래스보다 한 수준 들여쓴다. 메서드 코드는 메서드 선언보다 한 수준 들여쓴다. 블록 코드는 블록을 포함하는 코드보다 한 수준 들여쓴다.   

프로그래머는 이런 들여쓰기 체계에 크게 의존한다. 왼쪽으로 코드를 맞춰 코드가 속하는 범위를 시각적으로 표현한다. 그러면 이 범위에서 저 범위로 재빨리 이동하기 쉬워진다.   

들여쓰기한 파일은 구조가 한눈에 들어온다. 변수, 생성자 함수, 접근자 함수, 메서드가 금방 보인다. 반면, 들여쓰기 하지 않은 코드는 열심히 분석하지 않는한 거의 불가능하다.

**들여쓰기 무시하기**. 때로는 간단한 `if`문, 짧은 `while` 문, 짧은 함수에서 들여쓰기 규칙을 무시하고픈 유혹이 생긴다. 이런 유혹에 빠질 때마다 나는 항상 원점으로 돌아가 들여쓰기를 넣는다. 즉, 나는 다음과 같이 한 행에 범위를 뭉뚱그린 코드를 피한다.

```java
public class CommentWidget extends TextWidget {
  public static final String REGEXP = "^#[^\r\n]*(?:(?:\r\n)|\n|\r)?";

  public CommentWidget(ParentWidget parent, String text) {super(parent, text);}
  public String render() throws Exception {return "";}
}
```

대신, 다음과 같이 들여쓰기로 범위를 제대로 표현한 코드를 선호한다.

```java
public class CommentWidget extends TextWidget {
  public static final String REGEXP = "^#[^\r\n]*(?:(?:\r\n)|\n|\r)?";

  public CommentWidget(ParentWidget parent, String text) {
    super(parent, text);
  }

  public String render() throws Exception {
    return "";
  }
}
```

### 🎈 가짜 범위
때로는 빈 `while` 문이나 `for` 문을 접한다. 나는 이런 구조를 좋아하지 않기에 가능한 한 피하려 애쓴다. 피하지 못할 때는 빈 블록을 올바로 들여쓰고 괄호로 감싼다. 지금까지 나는 `while` 문 끝에 세미콜론 하나를 살짝 덧붙인 코드로 수없이 골탕을 먹었다. 세미콜론은 새 행에다 제대로 들여써서 넣어준다. 그렇게 하지 않으면 눈에 띄지 않는다.

```java
while (dis.read(buf, 0, readBufferSize) != -1)
;
```

## 🎃 팀 규칙
프로그래머라면 각자 선호하는 규칙이 있다. 하지만 팀에 속한다면 자신이 선호해야 할 규칙은 바로 팀 규칙이다. 팀은 한 가지 규칙에 합의해야 한다. 그리고 모든 팀원은 그 규칙을 따라야 한다. 그래야 소프트웨어가 일관적인 스타일을 보인다. 개개인이 따로국밥처럼 맘대로 짜대는 코드는 피해야 한다.   

좋은 소프트웨어 시스템은 읽기 쉬운 문서로 이뤄진다는 사실을 기억하기 바란다. 스타일은 일관적이고 매끄러워야 한다. 한 소스 파일에서 봤던 형식이 다른 소스 파일에도 쓰이리라는 신뢰감을 독자에게 줘야 한다. 온갖 스타일을 뒤섞어 소스 코드를 필요 이상으로 복잡하게 만드는 실수는 반드시 피한다.
