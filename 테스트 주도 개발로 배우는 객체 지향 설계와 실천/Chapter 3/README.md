# 🌈 Chapter 3: 도구 소개

## 📚 간략한 JUnit 4 소개
- 자바 테스트 프레임워크로 [JUnit 4](https://junit.org/junit4/)를 사용한다.
- JUnit은 리플렉션을 통해 클래스 구조를 파악한 후 해당 클래스 내에서 테스트를 나타내는 것을 모두 실행한다.
- 이를 테면, 다음은 `Entry` 객체의 컬렉션을 관리하는 `Catalog` 클래스를 시험하는 테스트다.

```java
public class CatalogTest {
  private final Catalog catalog = new Catalog();

  @Test public void containsAnAddedEntry() {
    Entry entry = new Entry("fish", "chips");
    catalog.add(entry);
    assertTrue(catalog.contains(entry));
  }

  @Test public void indexesEntriesByName() {
    Entry entry = new Entry("fish", "chips");
    catalog.add(entry);
    assertEquals(entry, catalog.entryFor("fish"));
    assertNull(catalog.entryFor("missing name"));
  }
}
```

### 🎈 테스트 케이스
- JUnit에서는 `@Test`라는 애노테이션이 지정된 메서드는 모두 테스트 케이스로 취급한다. 테스트 메서드는 값을 반환하거나 매개변수를 받아서는 안 된다. 위 예제의 경우 `CatalogTest` 클래스에는 `containsAnAddedEntry`, `indexesEntriesByName`이라는 테스트 두 개가 정의돼 있다.
- JUnit에서는 테스트를 실행하기 위해 테스트 클래스의 새 인스턴스를 생성한 후 적절한 테스트 메서드를 호출한다.

### 🎈 단정
- JUnit 테스트에서는 테스트 대상 객체를 호출하고 그 결과를 단정(assertion)하는데, 보통 JUnit에 정의돼 있는 단정 메서드를 사용하며, 이러한 메서드는 단정이 실패할때 유용한 오류 메시지를 만들어낸다.
- 예를 들어, `CatalogTest`에서는 JUnit의 세 가지 단정 메서드를 사용했는데, `assertTrue`는 표현식이 참임을 단정하고 `assertNull`은 객체 참조가 `null`임을 단정하며, `assertEquals`는 두 값이 동일함을 단정한다. 만약 실패하면 예상 값과 실제 값을 비교한 내용을 보여준다.

### 🎈 예외 예상하기
- `@Test` 애노테이션은 선택적인 매개변수로 `expected`라는 것을 지원한다. 이 매개변수는 테스트 케이스에서 예외를 던질 것으로 선언한다. 테스트에서 예외를 던지지 않거나 다른 유형의 예외를 던지면 테스트가 실패한다.
- 예를 들어, 다음 테스트에서는 `Catalog`에서 두 항목이 같은 이름으로 추가될 경우 `IllegalArgumentException`을 던지는지 검사한다.

```java
@Test(expected=IllegalArgumentException)
public void cannotAddTwoEntriesWithTheSameName() {
  catalog.add(new Entry("fish", "chips"));
  catalog.add(new Entry("fish", "peas"));
}
```

### 🎈 테스트 픽스처
- 테스트 픽스처(test fixture)는 테스특 시작할 때 존재하는 고정된 상태를 의미한다. 테스트 픽스처는 테스트가 반복 가능함을 보장한다. 즉, 테스트가 실행될 때마다 해당 테스트는 동일한 상태로 시작하므로 동일한 결과를 낼 것이다.
- 픽스처는 테스트가 실행되기 전에 준비해서 테스트 실행이 완료된 후에 정리할 수 있다.
- JUnit 테스트에서 사용되는 픽스처는 해당 테스트를 정의한 클래스에서 관리하고 객체의 필드에 저장된다. 같은 클래스에 정의된 테스트는 모두 동일한 픽스처를 가지고 시작하며, 실행될 때 해당 픽스처를 변경해도 된다. `CatalogTest`에서 픽스처는 `catalog` 필드에 저장된 빈 `Catalog` 객체다.
- JUnit에서는 애노테이션으로 픽스처를 준비하거나 정리하는 메서드를 구분할 수도 있다. 테스트를 실행하기 전에 `@Before` 애노테이션이 지정된 메서드를 모두 실행하고, 픽스처를 정리하기 위해 테스트가 실행된 후 `@After`라는 애노테이션이 지정된 메서드를 실행한다.
- 많은 JUnit 테스트에서 명시적으로 픽스처를 정리하지 않아도 되는데, 픽스처를 준비할 때 JVM 가비지 컬렉션으로 생성된 객체를 수거하는 것만으로도 충분하기 때문이다.
- 다음 예처럼 테스트에서 모두 동일한 항목으로 `catalog`를 초기화할 수 있다.

```java
public class CatalogTest {
  final Catalog catalog = new Catalog();
  final Entry entry = new Entry("fish", "chips");

  @Before public void fillTheCatalog() {
    catalog.add(entry);
  }

  // ...
}
```

### 🎈 테스트 러너
- JUnit이 클래스를 대상으로 리플렉션을 수행해 테스트를 찾아 해당 테스트를 싫행하는 방식은 테스트 러너에서 제어한다. 클래스에 사용되는 러너는 `@RunWith` 애노테이션으로 설정할 수 있다.

## 📚 햄크레스트 매처와 assertThat()
- 햄크레스트는 매칭 조건을 선언적으로 작성하는 프레임워크다. 햄크레스트 자체는 테스트 프레임워크가 아니지만 JUnit이나 jMock을 비롯해 윈도리커 같은 여러 테스트 프레임워크에서 쓰인다.
- 햄크레스트의 매처는 특정 객체가 어떤 조건과 일치하는지 알려주며, 해당 조건이나 객체가 어떤 조건과 일치하지 않는 이유을 기술할 수 있다.
- 이를테면, 다음 코드는 특정 부문자열(substring)을 담은 문자열과 매칭되는 매처를 생성하고 해당 메처를 사용해 단정을 수행한다.

```java
String s = "yes we have no bananas today";

Matcher<String> containsBananas = new StringContains("bananas");
Matcher<String> containsMangoes = new StringContains("mangoes");

assertTrue(containsBananas.matches(s));
assertFalse(containsMangoes.matches(s));
```

- 대개 매처는 직접적으로 인스턴스화되지 않는다. 대신 햄크레스트는 매처를 생성하는 코드의 가독성을 높이고자 모든 매처에 대한 정적 팩터리 메서드를 제공한다.

```java
assertTrue(containsString("bananas").matches(s));
assertFalse(containsString("mangoes").matches(s));
```

- 하지만 실제로는 매처를 JUnit의 `assertThat()`과 조합해 사용한다. `assertThat()`은 매처의 자기서술적인 특성을 활용해 단정이 실패할 경우 뭐가 잘못됐는지 분명하게 드러낸다.

```java
assertThat(s, containsString("bananas"));
assertThat(s, not(containsString("mangoes")));
```

- 두 번째 단정은 햄크레스트의 가장 유용한 기능인데 바로 기존 매처를 조합해 새로운 조건을 정의하는 기능이다. `not()` 메서드를 전달된 매처의 의미와 반대되는 매처를 생성하는 팩터리 함수다. 매처를 조합하더라도 코드와 실패 메시지 모두 자기서술적인 특성을 띠게끔 설계돼 있다.
- 코드를 작성해 명시적으로 조건을 검사하거나 풍부한 정보를 드러내는 오류 메시지를 만들어 내는 게 아니라 `assertThat()`에 매처 표현식을 전달하고 `assertThat()`이 그 일을 알아서 처리하게 할 수 있다.
  
## 📚 jMock2: 목 객체
- [jMock2](http://jmock.org/)는 JUnit에 붙여서 목 객체를 활용한 테스트 방식을 지원한다. jMock은 목 객체를 동적으로 생성하므로 목을 생성하려는 타입의 구현체를 직접 작성하지 않아도 된다. 또 jMock은 테스트 대상 객체 가 그것과 상호 작용 중인 목 객체를 어떻게 호출하고 목 객체가 거기에 반응해 어떻게 동작해야 할지를 지정하는 고수준 API를 제공한다.
- jMock API의 핵심 개념은 모조 객체와 목 객체, 예상 구문이다. 모조 객체는 테스트 대상 객체의 콘텍스트, 즉 그것과 이웃하는 객체를 표현한다. 목 객체는 테스트가 실행되는 과정에서 테스트 대상 객체의 실제 이웃을 대신한다. 예상 구문은 테스트 과정에서 테스트 대상 객체가 그것의 이웃을 어떻게 호출해야 하는지 기술한다.
- 다음 예제는 `AuctionMessageTranslator`가 전달된 메시지 텍스트를 구문 분석(parse)해서 `auctionClosed()` 이벤트를 생성할 것으로 단정한다.

```java
@RunWith(JMock.class)
public class AuctionMessageTranslatorTest {
  private final Mockery context = new JUnit4Mockery();
  private final AuctionEventListener listener = context.mock(AuctionEventListener.class);
  private final AuctionMessageTranslator translator = new AuctionMessageTranslator(listener);

  @Test public void
  notifiesAuctionClosedWhenCloseMessageReceived() {
    Message message = new Message();
    message.setBody("SOLVersion: 1.1; Event: CLOSE;");

    context.checking(new Expectations() {{
      // 단일 예상 구문
      // auctionClosed 메서드가 정확히 한 번 호출될 것으로 예상
      oneOf(listener).auctionClosed();
    }});

    translator.processMessage(UNUSED_CHAT, message);
  }
}
```

### 🎈 예상 구문
- jMock의 예상 구문 API는 표현력이 매우 뛰어나다.
- 예상 구문 블록은 해당 예외 블록을 둘러싼 테스트 코드와 구별함으로써 이웃 객체가 어떻게 호출되는지 기술하는 코드와 실제로 객체를 호출하고 결과를 검사하는 코드를 분명하게 구분하는 데 목적이 있다.
