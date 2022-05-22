---
sidebar_position: 9
---

# 🍭 Chapter 8: 경계

## 🎃 외부 코드 사용하기
패키지 제공자나 프레임워크 제공자는 적용성을 최대한 넓히려 애쓴다. 더 많은 환경에서 돌아가야 더 많은 고객이 구매하니까. 반면, 사용자는 자신의 요구에 집중하는 인터페이스를 바란다. 이런 긴장으로 인해 시스템 경계에서 문제가 생길 소지가 많다.   

한 예로, `java.util.Map`을 살펴보자. `Map`은 굉장히 다양한 인터페이스로 수많은 기능을 제공한다. `Map`이 제공하는 기능성과 유연성은 확실히 유용하지만 그만큼 위험도 크다.   

```java
Map sensors = new HashMap();
```

`Sensor` 객체가 필요한 코드는 다음과 같이 `Sensor` 객체를 가져온다.

```java
Sensor s = (Sensor)sensors.get(sensorId);
```

위와 같은 코드가 한 번이 아니라 여러 차례 나온다. 즉, `Map`이 반환하는 `Object`를 올바른 유형으로 변환할 책임은 `Map`을 사용하는 클라이언트에 있다. 그래도 코드는 동작한다. 하지만 깨끗한 코드라 보기는 어렵다. 게다가 위와 같은 코드는 의도도 분명히 드러나지 않는다. 대신 다음과 같이 제네릭스를 사용하면 코드 가독성이 크게 높아진다.

```java
Map<String, Sensor> sensors = new HashMap<Sensor>();
// ...
Sensor s = sensors.get(sensorId);
```

그렇지만 위 방법도 `Map<String, Sensor>`가 사용자에게 필요하지 않은 기능까지 제공한다는 문제는 해결하지 못한다.   

다음은 `Map`을 좀 더 깔끔하게 사용한 코드다. `Sensors` 사용자는 제네릭스가 사용되었는지 여부에 신경 쓸 필요가 없다. 아래에서 보듯, 제네릭스의 사용 여부는 `Sensors` 안에서 결정한다.

```java
public class Sensors {
  private Map sensors = new HashMap();

  public Sensor getById(String id) {
    return (Sensor) sensors.get(id);
  }

  // 이하 생략
}
```

경계 인터페이스인 `Map`을 `Sensors` 안으로 숨긴다. 따라서 `Map` 인터페이스가 변하더라도 나머지 프로그램에는 영향을 미치지 않는다. 제네릭스를 사용하는 하지 않든 더 이상 문제가 안 된다. `Sensors` 클래스 안에서 객체 유형을 관리하고 변환하기 때문이다.   

또한 `Sensors` 클래스는 프로그램에 필요한 인터페이스만 제공한다. 그래서 코드는 이해하기는 쉽지만 오용하기는 어렵다. `Sensors` 클래스는 (나머지 프로그램이) 설계 규칙과 비즈니스 규칙을 따르도록 강제할 수 있다.   

`Map` 클래스를 사용할 때마다 위와 같이 캡슐화하라는 소리가 아니다. `Map`을 여기저기 넘기지 말라는 말이다. `Map`과 같은 경계 인터페이스를 이용할 때는 이를 이용하는 클래스나 클래스 계열 밖으로 노출되지 않도록 주의한다.

## 🎃 경계 살피고 익히기
외부 패키지 테스트가 우리 책임은 아니다. 하지만 우리 자신을 위해 우리가 사용할 코드를 테스트하는 편이 바람직하다.   

외부 코드를 익히기는 어렵다. 외부 코드를 통합하기도 어렵다. 곧바로 우리쪽 코드를 작성해 외부 코드를 호출하는 대신 먼저 간단한 테스트 케이스를 작성해 외부 코드를 익히면 어떨까? 점 뉴커크는 이를 **학습 테스트**라 부른다.   

학습 테스트는 프로그램에서 사용하려는 방식대로 외부 API를 호출한다. 통제된 환경에서 API를 제대로 이해하는지를 확인하는 셈이다. 학습 테스트는 API를 사용하려는 목적에 초점을 맞춘다.

## 🎃 log4j익히기
로깅 기능을 직접 구현하는 대신 아파치의 `log4j` 패키지를 사용하려 한다고 가정하자. 문서를 자세히 읽기 전에 첫 번째 테스트 케이스를 작성한다. 화면에 `hello`를 출력하는 테스트 케이스다.

```java
@Test
public void testLogCreate() {
  Logger logger = Logger.getLogger("MyLogger");
  logger.info("hello");
}
```

테스트 케이스를 돌렸더니 `Appender`라는 뭔가가 필요하다는 오류가 발생한다. 문서를 좀 더 읽어보니 `ConsoleAppender`라는 클래스가 있다. 그래서 `ConsoleAppender`를 생성한 후 테스트 케이스를 다시 돌린다.

```java
@Test
public void testLogAddAppender() {
  Logger logger = Logger.getLogger("MyLogger");
  ConsoleAppender appender = new ConsoleAppender();
  logger.addAppender(appender);
  logger.info("hello");
}
```

이번에는 `Appender`에 출력 스트림이 없다는 사실을 발견한다. 이상하다. 출력 스트림이 있어야 정상이 아닌가? 구글에서 검색한 후 다음과 같이 시도한다.

```java
@Test
public void testLogAddAppender() {
  Logger logger = Logger.getLogger("MyLogger");
  logger.removeAllAppenders();
  logger.addAppender(new ConsoleAppender(
    new PatternLayout("%p %t %m%n"),
    ConsoleAppender.SYSTEM_OUT
  ));
  logger.info("hello");
}
```

이제서야 제대로 돌아간다. 지금까지 간단한 콘솔 로거 초기화하는 방법을 익혔으니, 이제 모든 지식을 독자적인 로거 클래스로 캡슐화한다. 그러면 나머지 프로그램은 `log4j` 경계 인터페이스를 몰라도 된다.

## 🎃 학습 테스트는 공짜 이상이다.
학습 테스트는 공짜 이상이다. 투자하는 노력보다 얻는 성과가 더 크다. 패키지 새 버전이 나온다면 학습 테스트를 돌려 차이가 있는지 확인한다. 학습 테스트는 패키지가 예상대로 도는지 검증한다. 일단 통합한 이후라고 하더라도 패키지가 우리 코드와 호환되리라는 보장은 없다. 패키지 작성자에게 코드를 변경할 필요가 생길지도 모른다. 패키지 작성자는 버그를 수정하고 기능도 추가한다. 패키지 새 버전이 나올 때마다 새로운 위험이 생긴다. 새 버전이 우리 코드와 호환되지 않으면 학습 테스트가 이 사실을 곧바로 밝혀낸다.   

학습 테스트를 이용한 학습이 필요하든 그렇지 않든, 실제 코드와 동일한 방식으로 인터페이스를 사용하는 테스트 케이스가 필요하다. 이런 경계 테스트가 있다면 패키지의 새 버전으로 이전하기 쉬워진다. 그렇지 않다면 낡은 버전을 필요 이상으로 오랫동안 사용하려는 유혹에 빠지기 쉽다.

## 🎃 아직 존재하지 않은 코드를 사용하기
경계와 관련해 또 다른 유형은 아는 코드와 모르는 코드를 분리하는 경계다. 때로는 우리 지식이 경계를 넘어 미치지 못하는 코드 영역도 있다. 때로는 알려고 해도 알 수가 없다. 때로는 더 이상 내다보지 않기로 결정한다.   

우리가 바라는 인터페이스를 구현하면 우리가 인터페이스를 전적으로 통제한다는 장점이 생긴다. 또한 코드 가독성도 높아지고 코드 의도도 분명해진다. 이와 같은 설계는 테스트도 아주 편하다. 적절한 `Fake` 클래스를 사용하면 해당 클래스를 테스트할 수 있다. API 인터페이스가 나온 다음 경계 테스트 케이스를 생성해 우리가 API를 올바르게 사용하는지 테스트할 수도 있다.

## 🎃 깨끗한 경계
경계에서는 흥미로운 일이 많이 벌어진다. 변경이 대표적인 예다. 소프트웨어 설계가 우수하다면 변경하는데 많은 투자와 재작업이 필요하지 않다. 엄청난 시간과 노력과 재작업을 요구하지 않는다. 통제하지 못하는 코드를 사용할 때는 너무 많은 투자를 하거나 향후 변경 비용이 자나치게 커지지 않도록 각별히 주의해야 한다.   

경계에 위치하는 코드는 깔끔히 분리한다. 또한 기대치를 정의하는 테스트 케이스도 작성한다. 이쪽 코드에서 외부 패키지를 세세하게 알아야 할 필요가 없다. 통제가 불가능한 외부 패키지에 의존하는 대신 통제가 가능한 우리 코드에 의존하는 편이 훨씬 더 좋다. 자칫하면 오히려 외부 코드에 휘둘리고 만다.   

외부 패키지를 호출하는 코드를 가능한 줄여 경계를 관리하자. `Map`에서 봤듯이, 새로운 클래스로 경계를 감싸거나 아니면 `ADAPTER` 패턴을 사용해 우리가 원하는 인터페이스를 패키지가 제공하는 인터페이스로 변환하자. 어느 방법이든 코드 가독성이 높아지며, 경계 인터페이스를 사용하는 일관성도 높아지며, 외부 패키지가 변했을 때 변경할 코드도 줄어든다.