---
sidebar_position: 5
---

# 🌈 Chapter 4: Retirement

### 🦄 절대 NULL을 반환하지 마세요

```java
public String title() {
  if (/* title이 없다면 */) {
    return null;
  }

  return "Elegant Objects"
}
```

- 위와 같은 코드는 `title()`이 반환하는 객체는 신뢰할 수 없다. 반환된 객체의 능력을 신뢰할 수 없다.

```java
String title = x.title();
print(title.length());
```

- `title.length()`를 호출할 때마다 항상 `NullPointerException` 예외가 던져질지 모른다는 사실에 불안할 수 밖에 없다. 더 큰 문제는 객체에 대한 **신뢰**가 무너졌다는 사실이다. 반환된 값이 객체 인지부터 확인해야 하기 때문에, 객체에게 작업을 요청한 후 안심하고 결과에 의지할 수 없다.

```java
String title = x.title();

if (title == null) {
  print("Can't print;");
  return;
}

print(title.length());
```

- 객체라는 사상에는 우리가 **신뢰하는** 엔티티라는 개념이 담겨져 있다. 객체는 자신만의 생명주기, 자신만의 행동, 자신만의 상태를 가지는 살아있는 유기체이다. 변수는 객체의 별명일 뿐이다.

```java
String t = x.title();
```

- 여기서 `t`는 `title()` 메서드가 반환하는 객체에게 붙여진 별명이다. 객체를 신뢰하기 때문에 변수 역시 신뢰한다. 여기서 신뢰라는 말에는 객체가 자신의 행동을 전적으로 **책임지고** 우리가 어떤 식으로든 간섭하지 않는다는 의미가 담겨 있다.
- 다음 코드처럼 객체에게 아무런 말도 하지 않은 채 우리 마음대로 예외를 던져서는 안된다.

```java
if (title == null) {
  print("Can't print");
  return;
}
```

- 반환값을 검사하는 방식은 애플리케이션에 대한 신뢰가 부족하다는 신호이다. 여기서 `title()`을 신뢰하지 않는다면, 결과적으로 다른 누구도 신뢰하지 않을 것이다.
- 코드를 읽을 때 신뢰할 수 있는 메서드 호출이 어떤 것이고 `NULL`을 반환하는 메서드 호출이 어떤 것인지를 이해하기 위해 더 많은 시간이 필요하기 때문에, 신뢰의 부족은 결과적으로 유지보수성의 심각한 손실로 이어진다.

```java
void list(File dir) {
  File[] files = dir.listFiles();

  if (files == null) { // 존재하지 않는 경우 예외 반환
    throw new IOException("Directory is absent.");
  }

  for (File file : files) {
    System.out.println(file.getName());
  }
}
```

- 만약 `listFiles()` 메서드가 `NULL`을 반환하는 대신 예외를 던진다면 다음과 같이 구현할 수 있다.

```java
void list(File dir) {
  for (File file : dir.listFiles()) {
    System.out.println(file.getName());
  }
}
```

#### 🎈 빠르게 실패하기 vs. 안전하게 실패하기
- 안전하게 실패하기는 버그, 입출력 문제, 메모리 오버플로우 등이 발생한 상황에서도 소프트웨어가 계속 실행될 수 있도록 최대한 많은 노력을 기울일 것을 권장한다. `NULL`을 반환하는 방법도 일종의 생존 기법이라고 할 수 있다.
- 빠르게 실패하기는 일단 문제가 발생하면 곧바로 실행을 중단하고 최대한 빨리 예외를 던진다. 실패를 감추는 대신 강조한다. 실패를 눈에 잘 띄게 만들고 추적하기 쉽게 만든다. 상황을 구조하지 않는 대신, 가능하면 실패를 분명하게 만든다.
- 에러를 발견한 즉시 보고하는 경우에만 안전성과 견고함을 얻을 수 있다. 더 빠르게 문제를 찾을수록 더 빠르게 실패하고, 결과적으로 전체적인 품질이 향상된다.

#### 🎈 NULL의 대안

```java
public User user(String name) {
  if (/* 데이터베이스에서 발견하지 못했다면 */) {
    return null;
  }

  return /* 데이터베이스로부터 */
}
```
- 위 코드에서 사용자를 찾지 못했기 때문에 `NULL`을 반환하고는 다음 단계로 진행해 버리는 것이다. 위와 같은 사고방식은 안전하게 실패하기 철학과 유사하다.
- `NULL`을 대체할 수 있는 방법중 하나는 메서드를 두 개로 나누는 것이다. 첫 번째 메서드는 객체의 존재를 확인하고, 두 번째 메서드는 객체를 반환한다. 아무 것도 찾지 못한 경우 두 번째 메서드는 예외를 던진다.

```java
public boolean exist(String name) {
  if (/* 데이터베이스에서 발견하지 못했다면 */) {
    return false;
  }

  return true;
}

public User user(String name) {
  return /* 데이터베이스로부터 */;
}
```

- 이 방법은 데이터베이스에 요청을 두 번 전송하기 떄문에 비효율적이라는 단점이 있다.
- 이러한 단점을 보완할 수 있는 두 번쨰 방법은 `NULL`을 반환하거나 예외를 던지는 대신 객체 컬렉션을 반환하는 것이다.

```java
public Collection<User> users(String name) {
  if (/* 데이터베이스에서 발견하지 못했다면 */) {
    return new ArrayList<>(0);
  }

  return Collections.singleton(/* 데이터베이스로부터 */);
}
```

- 여기서는 사용자를 발견하지 못한 경우 빈 컬렉션을 반환한다. 이 경우 클라이언트는 객체를 추출하기 위해 어떤 식으로든 컬렉션에 접근해야만 한다. 기술적으로는 이 방법은 `NULL`과 크게 다르지는 않지만 더 깔끔하다.
- 마지막 방법은 널 객체 디자인 패턴이다. 널 객체 패턴에서는 원하는 객체를 발견하지 못할 경우, 겉으로 보기에는 원래의 객체처럼 보이지만 실제로는 다르게 행동하는 객체를 반환한다. 널 객체는 일부 작업은 정상적으로 처리하지만, 나머지 작업은 처리하지 않는다.
- 이 방법은 객체지향적인 사고방식과도 잘 어울리지만, 제한된 상황에서만 사용 가능하다는 단점이 있다. 또한 반환된 객체의 타입을 동일하게 유지해야 한다.

```java
class NullUser implements User {
  private final String label;

  NullUser(String name) {
    this.label = name;
  }

  @Override
  public String name() {
    return this.label;
  }

  @Override
  public void raise(Cash salary) {
    throw new IllegalStateException(
      "error"
    );
  }
}
```

- 요약하면 절대로 `NULL`을 반환하지말아야 한다.

### 🦄 체크 예외만 던지세요
- 언체크 예외를 사용하는 것은 실수이며, 모든 예외는 체크 예외여야 한다. 또한 다양한 예외 타입을 만드는 것도 좋지 않은 생각이다.
- 다음은 Java에서 체크 예외를 사용하는 예제이다.

```java
public byte[] content(File file) throws IOException {
  byte[] array = new byte[1000];
  new FileInputStream(file).read(array);
  return array;
}
```

- 먼저 메서드의 시그니처가 `throws IOException`으로 종료된다. 무슨 일이 있어도 `content`를 호출하는 쪽에서 `IOException` 예외를 잡아야 한다는 것을 의미한다.

```java
public int length(File file) {
  try {
    return content(file).length();
  } catch (IOException ex) {
    // 예외 처리 로직
  }
}
```

- 이 메서드는 입출력 시스템에서 발생한 문제 때문에 비정상적으로 종료될 수 있다. 메서드는 시그니처에 `throws IOException`이라고 선언함으로써 문제를 처리할 **책임**을 넘긴다.
- 동일한 방식으로 책임을 클라이언트로 **전파하면서** 안전하지 않다고 선언할 수 있다.

```java
public int length(File file) throws IOException {
  return content(file).length();
}
```

- 이렇게 예외를 잡지 않고 더 높은 레벨로 획대시킨다. `IOException`은 `catch` 구문을 이용해서 반드시 잡아야 하기 떄문에 체크 예외에 속한다. 체크 예외가 항상 **가시적인** 이유가 바로 이 때문이다. 이 메서드를 사용하기 위해서 안전하지 않다고 선언하거나, 예외를 잡아서 해결해야 한다.
- 대조적으로 언체크 예외는 무시할 수 있으며 예외를 잡지 않아도 무방하다. 일단 언체크 예외를 던지면, 누군가 예외를 잡기 전까지는 자동으로 상위로 전파된다. 하지만 언어는 예외 처리를 강요하지 않는다. 다음 예제는 언체크 예외에 속한다.

```java
public int length(File file) throws IOException {
  if (!file.exists()) {
    throw new IllegalStateException(
      "File doesn't exist;"
    );
  }

  return content(file).length();
}
```

- 위 예제에서 메서드 시그니처는 `IllegalStateException`이 던져질 수 있다는 사실에 관해서 일절 언급하지 않는다. 호출하는 쪽에서는 알 수 없다. 정보는 숨겨져 있다. 체크 ㅖ외가 항상 가시적이라고 설명했던 이유이다.
- 언체크 예외의 경우 예외의 타입을 선언하지 않아도 무방한 반면에 체크 예외는 항상 예외의 타입을 공개해야 한다.

#### 🎈 꼭 필요한 경우가 아니라면 예외를 잡지 마세요
- 메서드를 설계할 때 모든 예외를 잡아서 메서드를 안전하게 만들지, 아니면 상위로 문제를 전파할지를 명확하게 해야 한다. 상위로 전파하는 방벙를 선호하며 가능하면 예외를 더 높은 레벨로 전파한다.
- 이상적인 설계에서는 애플리케이션의 각 진입점 별로 오직 하나의 `catch` 문만 존재해야 한다.
- 예외를 잡아 상황을 구조하는 일은 매우 정당한 이유가 있을 경우에만 용인되는 매우 중요한 행동이다.

#### 🎈 항상 예외를 체이닝하세요
- 다음은 예외 되던지기의 올바른 사용 예이다.

```java
public int length(File file) throws Exception {
  try {
    return content(file).length();
  } catch (IOException ex) {
    throw new Exception("길이를 계산할 수 없다.", ex);
  }
}
```

- 위 예제에서는 예외를 잡은 즉시 새로운 예외를 던진다. 이와 같은 예외 체이닝은 훌륭한 프랙틱스이다. 원래의 문제를 새로운 문제로 감싸서 함께 상위로 던진다.
- 여기서의 핵심은 무제를 발생시켰던 낮은 수준의 근본 원인을 소프트웨어의 더 높은 수준으로 이동시켰다는 것이다. 
- 다음 코드처럼 근본 원인을 무시하는 것은 좋지 않은 생각이다.

```java
public int length(File file) throws Exception {
  try {
    return content(file).length();
  } catch (IOException ex) {
    throw new Exception("길이를 계산할 수 없다."); // ex 무시
  }
}
```

- 이렇게 되면 저수준 정보가 사라져 버린 상태이다. 항상 예외를 체이닝하고 절대로 원래 예외를 무시하지 말아야 한다.
- 예외 체이닝이 필요한 이유는 예외 체이닝은 의미론적으로 문제와 관련된 문맥을 풍부하게 만들기 위해 필요하다. 메시지 수준이 너무 낮기 때문에 체인을 이용하는 것이다.
- 모든 예외를 잡아 체이닝한 후, 즉시 다시 던져야 한다.

#### 🎈단 한번만 복구하세요
- 예외 후 복구는 흐름 제어를 위한 예외 사용으로 알려진 안티패턴의 또 다른 이름일뿐이다. 다음은 예외 후 복구 방식을 적용한 예이다.

```java
int age;

try {
  age = Integer.parseInt(text);
} catch (NumberFormatException ex) {
  // 여기서 발생한 예외를 복구한다
  age = -1;
}
```

- 위 코드는 `NULL`을 반환하는 안티패턴과 유사하다.
- 모든 메서드가 예외를 던진 후 결코 해당 예외를 잡아서는 안되고 이제 모든 예외의 애플리케이션의 가장 높은 곳까지 전파될 것이다.

```java
public class App {
  public static void main (String... args) {
    try {
      System.out.println(new App().run());
    } catch (Exception ex) {
      System.err.println(
        "죄송하지만 문제가 발생했습니다." + ex.getLocalizedMessage()
      );
    }
  }
}
```

- `catch`에서 어떤 것도 다시 전지지 않고 그 자리에서 즉시 문제를 해결하고 있다. 정적 메서드 `main`은 유해하지 않고 안전하다. 애플리케이션의 가장 높은 레벨에 위치하기 때문에 결코 종료되지 않는다.
- `main`에서 예외를 잡지 않는다면 런테임 환경으로 예외가 전달되고 결국 Java 가상 머신이 예외를 잡게 된다. 이 경우에도 사용자는 메시지를 보지만, 그 메시지는 사용자 친화적이지 않다. 이런 일을 발생하면 안되기 떄문에 대신 **복구**를 한다.
- 모든 진입점에서 동일한 작업이 수행돼야 한다. 항상 예외를 잡고, 체이닝하고, 다시 던져야 한다. 가장 최상위 수준에서 한번만 복구한다.

#### 🎈 관점-지향 프로그래밍을 사용하세요
- 예를 들어 HTTP 요청을 전송해서 웹 페이지를 다운로드하는 경우를 가정한다. 네트워크 연결이 실패할 때마다 사용자엑 오류 메시지를 표시하고 애플리케이션을 재시행하라고 요청해야 한다면 어리석은 일이다. **사용자 대신 프로그램이 스스로 재시도하는 편이 더 좋다. 하지만 재시도를 위해서 예외를 잡아서 복구해야 한다.**

```java
public String content() throws IOException {
  int attempt = 0;
  while (true) {
    try {
      return http();
    } catch (IOException ex) {
      if (attempt >= 2) {
        throw ex;
      }
    }
  }
}
```

- 이 메서드는 `IOException`을 던지면 실패하기 전까지 최대 세 번의 재시도를 할 것이다. 이 메서드는 안전하지 않지만, 그렇다고 즉시 불안정해 지지 않는다. 상위로 전파하기 전에 몇 번 재시도를 한다. 하지만 이 설계는 최상위 수준에 이르기 전에 예외를 복구하기 때문에 위의 내용과 모순된다.
- 한 가지 해결 방법은 관점-지향 프로그래밍 기법을 사용하는 것이다.
- 단 한 번의 메서드를 호출을 재시도하기 위해 10줄의 코드를 작성해야된다. AOP를 이용하면 재시도 메커니즘을 다음과 같이 구현할 수 있다.

```java
@RetryOnFailure(attempts = 3)
public String content() throws IOException {
  return http();
}
```

- 컴파일러는 컴파일 시점에 `@RetryOnFailure` 애노테이션을 발견한 후 `content()` 메서드를 실패 재시도 코드로 둘러싼다. 이 실패 재시도 코드 블록을 관점이라고 부른다.
- 기술적으로 관점이란 제어를 위임받아 `content()`를 언제, 어떻게 호출할지 결정하는 객체를 의미한다.
- AOP가 좋은 이유는 **핵심 클래스로부터 덜 중요한 기술과 메커니즘을 분리해서 코드 중복을 제거할 수 있기 때문이다.**


#### 🎈 하나의 예외 타입만으로도 충분합니다.
- 흐름 제어를 위해서 절대로 예외를 사용하지 않기로 했고, 무엇을 해야 할지 결정하기 위한 목적으로 예외를 잡지 않고 다시 던지기 위해서만 잡는다. 그렇다면 **잡은 예외를 실제 타입에 대해서는 신경 쓸 필요가 없다.** 어짜피 다시 던질 것이기 떄문다.
- 예외를 사용할 일이 없기 때문에 예외의 타입 정보는 필요하지 않다. 예외를 잡을 때 조차도, 한 가지 목적을 위해서만 잡아야 한다. 이유는 바로 예외를 체이닝한 후 다시 던지기 위해서이다.

### 🦄 final이나 abstract이거나
- 상속보다 캡슐화가 더 나은 대안이라고 하지만 우리가 원하는 것은 상속을 완전히 제거하는 것이 아니라 올바르게 사용하는 것이다.
- 상속이 문제를 일으키는 주범은 **가상 메서드**이다.

```java
class Document {
  public int length() {
    return this.content().length();
  }

  public byte[] content() {
    // 문서의 내용을 바이트 배열로 로드한다.
  }
}
```

- 이제 암호화된 문서를 읽을 수 있도록 클래스를 확장해본다.

```java
class EncryptedDocument extents Document {
  @Override
  public byte[] content() {
    // 문서를 로드해서 즉시 복호화하고 그 내용을 반환한다.
  }
}
```

- `content()` 메서드를 오버라이딩했기 때문에 `Document` 클래스로부터 상속된 `length()` 메서드의 행동이 변해버렸다. 결과적으로 `length()` 메서드는 해독한 문서의 길이를 반환한다. 이러면 기대했던 결과가 아니다.
- 우선 문제의 원인을 찾으려면 부보 클래스의 `length()` 메서드가 `content()` 메서드를 호출한다는 사실을 기억해야 한다.
- 상속이 OOP에서 지탱하는 편리한 도구에서 유지보수성을 해치는 골치덩어리로 추락하는 곳이 이 지점이다. 복잡성이 상승하고, 코드를 읽고 이해하기가 어려워진다.
- 이 문제를 해결할 수 있는 방법은 클래스와 메서드를 `final`이나 `abstract` 둘 중 하나로만 제한한다면 문제가 발생할 수 있는 가능성을 없앨 수 있다.
- 먼저 `Document` 클래스가 `final`이라면 상속을 받을 수 없다. 반면에 `content()` 메서드가 `abstract`라면 `Document` 클래스 안에서는 `content()` 메서드를 구현할 수 없기 때문에 `length()` 메서드를 이해하는데 혼란스럽지 않다.
- 기본적으로 클래스가 가질 수 있는 신분은 세 가지인데 `final`이거나 `abstract`이거나, 둘 중 어느 쪽도 아니거나이다. `final` 클래스는 사용자 관점에서 블랙 박스이다. 상속을 통해 수정할 수 없다. 불투명하며 독립적이며 자신이 어떻게 행동해야 하는지 알고 있고, 어떤 도움도 필요로 하지 않ㄴ다. 어떤 메서드도 오버라이딩할 수 없다.
- `abstract`클래스는 글래스 박스이고 불완전하다. 스스로 행동할 수 없기 때문에 누군가의 도움이 필요하며 일부 요소가 누락되어 있다. 기술적으로 `abstract` 클래스의 특정 메서드를 오버라이딩할 수 있지만 다른 메서드는 모두 `final`이다.
- `final`도 `abstract`아닌 건 강력히 반대한다.
- `final`이나 `abstract` 어느 쪽도 아닌 클래스와 메서드의 생성을 금지했다면 `Document` 클래스를 다음과 같이 설계했을 것이다.

```java
final class Document {
  public int length() {}
  public byte[] content() {}
}
```

- 클래스 앞의 `final` 수정자는 이 클래스 안의 어떤 메서드도 자식 클래스에서 오버라이딩할 수 없다는 사실을 컴파일러에게 알려준다. 이제 `EncryptedDocument` 클래스를 추가할 때, `final` 클래스인 `Document`를 상속 받을 수 없다. 이 문제를 해결하기 위해서 인터페이스를 추가해야 한다.

```java
interface Document {
  int length();
  byte[] content();
}
```

- 이제 `Document`이름을 `DefaultDocument`로 변경하고 다음과 같이 변경한다.

```java
final class DefaultDocument implements Document {
  @Override
  public int length() {}
  @Override
  public byte[] content() {}
}
```

- 이제 `DefaultDocument`를 재사용해서 `EncryptedDocument`를 구현한다. `final` 클래스를 상속 받는 것은 불가능하기 때문에 상속 대신 캡슐화를 사용한다.

```java
final class EncryptedDocument implements Document {
  private final Document plain;
  EncryptedDocument(Document doc) {
    this.plain = doc;
  }

  @Override
  public int length() {
    return this.plain.length();
  }

  @Override
  public byte[] content() {
    byte[] raw = this.plain.content();
    return /* 원래 내용을 복호화한다. */
  }
}
```

- `DefaultDocument`와 `EncryptedDocument` 모두 `final`이기 때문에 확장이 불가능하다. 이 예제는 `final`과 `abstract`를 사용하도록 강제하면 대부분의 위치에서 상속을 사용할 수 없다는 사실을 잘 보여준다. 만약 모든 클래스가 `final`이면 오로지 캡슐화만을 이용할 수 있을 것이다.
- 상속을 이용할 적절한 경우는 클래스의 행동을 확장하지 않고 **정제**할 떄이다. 정제란 부분적으로 불완전한 행동을 완전하게 만드는 일을 의미한다.
- 클래스의 확장은 곧 침범을 의미한다. 이런 일을 예상해서 설계한 추상 클래스만을 개선해야 한다.

```java
abstract class Document {
  public abstract byte[] content();

  public final int length() {
    return this.content().length;
  }
}
```

- `DefaultDocument` 클라스를 추가해서 `Document`를 정제해야 한다.

```java
final class DefaultDocument extends Document {
  @Override
  public byte[] content() {
    // 디스크에서 내용을 로드한다.
  }
}
```

- 다른 식으로 정제하는 `EncryptedDocument` 클래스를 추가한다.

```java
final class EncryptedDocument extends Document {
  @Override
  public byte[] content() {
    // 디스크에서 내용을 로드하고, 내용을 암호화한 후 반환한다.
  }
}
```

- 두 클래스 모두 `length()` 메서드가 자신들의 메서드를 사용하는 방법을 명확하게 알고 있다는 가정 하에 메서드를 개선하고 있다.
- 요약하자면 Java를 비롯한 많은 언어에서 `final`과 `abstract` 어느 쪽도 해당되지 않는 클래스와 메서드를 만들 수 있도록 허용한 것은 실수이다. 의도를 명확하게 표현해야 한다.

### 🦄 RAII를 사용하세요
- Java에서는 가비지 컬렉션을 이용해서 객체를 제거하기 때문에 사라진 개념이다. 객체가 더 이상 사용되지 않을 때 객체를 제거하는 작업을 백그라운드로 진행한다 이 프로세스를 가비지 컬렉션이라고 부른다.
- Java7에서는 RAII와 유사한 처리를 할 수는 있다. 다음과 같이 `try-with-resources`기법을 사용해서 가능하다.

```java
int main() {
  try(Text t = new Text("/tmp/test.txt")) {
    t.content();
  }
}
```

- `try` 블록이 끝날 때 객체 `t`를 파괴하는 대신 객체의 `t`의 `close()` 메서드를 호출한다. 이 방법을 사용하기 위해서 `Text` 클래스가 `Closable` 인터페이스를 구현하면 된다.
- 파일, 스트림, 데이터베이스 커넥션 등 실제 리소스를 사용하는 모든 곳에서 RAII를 사용하는 것을 추천한다. Java에서는 AutoCloseable을 사용한다.
