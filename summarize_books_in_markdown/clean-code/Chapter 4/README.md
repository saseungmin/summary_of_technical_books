# 🍭 Chapter 4: 주석

> 나쁜 코드에 주석을 달지 마라. 새로 짜라.

잘 달린 주석은 그 어떤 정보보다 유용하다. 경솔하고 근거 없는 주석은 코드를 이해하기 어렵게 만든다. 오래되고 조잡한 주석은 거짓과 잘못된 정보를 퍼뜨려 해악을 미친다.   

우리는 코드로 의도를 표현하지 못해, 그러니까 실패를 만회하기 위해 주석을 사용한다. 주석은 언제나 실패를 의미한다. 때때로 주석 없이는 자신을 표현한 방법을 찾지 못해 할 수 없이 주석을 사용한다. 그래서 주석은 반겨 맞은 손님이 아니다.   

주석은 오래될수록 코드에서 멀어진다. 오래될수록 완전히 그릇될 가능성도 커진다. 이유는 단순하다. 프로그래머들이 주석을 유지하고 보수하기란 현실적으로 불가능하니까.   

코드는 변화하고 진화한다. 일부가 여기서 저기로 옮겨지기도 한다. 조각이 나뉘고 갈라지고 합쳐지면서 괴물로 변한다. 불행하게도 주석이 언제나 코드를 따라가지는 않는다. 아니, 따라가지 못한다. 주석이 코드에서 분리되어 점점 더 부정확한 고아로 변하는 사례가 너무도 흔하다.   

부정확한 주석은 아예 없는 주석보다 훨씬 더 나쁘다. 부정확한 주석은 독자들을 현혹하고 오도한다. 부정확한 주석은 결코 이뤄지지 않을 기대를 심어준다. 더 이상 지킬 필요가 없는 규칙이나 지켜서는 안 되는 규칙을 명시한다.   

진실은 한곳에만 존재한다. 바로 코드다. 코드만이 자기가 하는 일을 진실되게 말한다. 코드만이 정확한 정보를 제공하는 유일한 출처다. 그러므로 우리는 주석을 가능한 줄이도록 꾸준히 노력해야 한다.

## 🎃 주석은 나쁜 코드를 보완하지 못한다
코드에 주석을 추가하는 일반적인 이유는 코드 품질이 나쁘기 때문이다.   

표현력이 풍부하고 깔끔하며 주석이 거의 없는 코드가, 복잡하고 어수선하며 주석이 많이 달리 코드보다 훨씬 좋다. 자신이 저지른 난장판을 주석으로 설명하려 애쓰는 대신에 그 난장판을 깨끗이 치우는 데 시간을 보내라!

## 🎃 코드의 의도를 표현하라!
확실히 코드만으로 의도를 설명하기 어려운 경우가 존재한다. 불행히도 많은 개발자가 이를 코드는 훌륭한 수단이 아니라는 의미로 해석한다. 분명히 잘못된 생각이다. 다음 코드 예제 두 개를 살펴보자. 어느 쪽이 더 나은가?

```java
if ((employee.flags & HOURLY_FLAG) && (employee.age > 65))
```

다음 코드는 어떤가?

```java
if (employee.isEligibleForFullBenefits())
```

몇 초만 더 생각하면 코드로 대다수 의도를 표현할 수 있다. 많은 경우 주석으로 달려는 설명을 함수로 만들어 표현해도 충분하다.

## 🎃 좋은 주석
어떤 주석은 필요하거나 유익하다. 하지만 명심하기 바란다. 정말로 좋은 주석은, 주석을 달지 않은 방법을 찾아낸 주석이라는 사실을!

### 🎈 법적인 주석
때로는 회사가 정립한 구현 표준에 맞춰 법적인 이유로 특정 주석을 넣으라고 명시한다. 예를 들어, 각 소스 파일 첫 머리에 주석으로 들어가는 저작권 정보와 소유권 정보는 필요하고도 타당하다.   

소스 파일 첫머리에 들어가는 주석이 반드시 계약 조건이나 법적인 정보일 필요는 없다. 모든 조항과 조건을 열거하는 대신에, 가능하다면, 표준 라이선스나 외부 문서를 참조해도 되겠다.

### 🎈 정보를 제공하는 주석
때로는 기본적인 정보를 주석으로 제공하면 편리하다. 예를 들어, 다음 주석은 추상 메서드가 반환할 값을 설명한다.

```java
// 테스트 중인 Responder 인스턴스를 반환한다.
protected abstract Responder responderInstance();
```

때때로 위와 같은 주석이 유용하다 할지라도, 가능하다면, 함수 이름에 정보를 담는 편이 더 좋다. 예를 들어, 위 코드는 함수 이름을 `responderBeingTested`로 바꾸면 주석이 필요 없어진다.   

다음은 좀 더 나은 예제다.

```java
// kk:mm:ss EEE, MMM dd, yyyy 형식이다.
Pattern timeMatcher = Pattern.compile(
  "\\d*:\\d*:\\d* \\w*, \\w* \\d*, \\d*"
);
```

위에 제시한 주석은 코드에서 사용한 정규표현식이 시각과 날짜를 뜻한다고 설명한다. 이왕이면 시각과 날짜를 변환하는 클래스를 만들어 코드를 옮겨주면 더 좋고 더 깔끔하겠다. 그러면 주석이 필요 없어진다.

### 🎈 의도를 설명하는 주석
때때로 주석은 구현을 이해하게 도와주는 선을 넘어 결정에 깔린 의도까지 설명한다.

```java
public void testConcurrentAddWidgets() throws Exception {
  WidgetBuilder widgetBuilder =new WidgetBuilder(new Class[]{BoldWidget.class});

  String text = "'''bold text'''";
  ParentWidget parent = new BoldWidget(new MockWidgetRoot(), "'''bold text'''");
  AtomicBoolean failFlag = new AtomicBoolean();
  failFlag.set(false);

  // 스레드를 대량 생성하는 방법으로 어떻게든 경쟁 조건을 만들려 시도한다.
  for (int i = 0; i < 25000; i++) {
    WidgetBuilderThread widgetBuilderThread = new WidgetBuilderThread(widgetBuilder, text, parent, failFlag);
    Thread thread = new Thread(widgetBuilderThread);
    thread.start();
  }

  assertEquals(false, failFlag.get());
}
```

### 🎈 의미를 명료하게 밝히는 주석
때떄로 모호한 인수나 반환값은 그 의미를 읽기 좋게 표현하면 이해하기 쉬워진다. 일반적으로 인수나 반환값 자체를 명확하게 만들면 더 좋겠지만, 인수나 반환값이 표준 라이브러리나 변경하지 못하는 코드에 속한다면 의미를 명료하게 밝히는 주석이 유용하다.

```java
public void testCompareTo() throws Exception {
  WikiPagePath a = PathParser.parse("PageA");
  
  assertTrue(a.compareTo(a) == 0); // a == b
}
```

물론 그릇된 주석을 달아놓을 위험은 상당히 높다.

### 🎈 결과를 경고하는 주석
때로 다른 프로그래머에게 결과를 경고할 목적으로 주석을 사용한다. 예를 들어, 다음은 특정 테스트 케이스를 꺼야하는 이유를 설명하는 주석이다.

```java
// 여유 시간이 충분하지 않다면 실행하지 마십시오.
public void _testWithReallyBigFile() {
  writeLinesToFile(10000000);

  response.setBody(testFile);
  response.readToSend(this);
  String responseString = output.toString();
  assertSubString("Content-Length: 10000000", responseString);
  assetTrue(bytesSent > 10000000);
}
```

### 🎈 TODO 주석
때로는 '앞으로 할 일'을 `//TODO` 주석으로 남겨두면 편하다. 다음은 함수를 구현하지 않은 이유와 미래 모습을 `//TODO` 주석으로 설명한 예제다.

```java
// TODO-MDM 현재 필요하지 않다.
// 체크아웃 모델을 도입하면 함수가 필요 없다.
protected VersionInfo makeVersion() throws Exception {
  return null;
}
```

`TODO` 주석은 프로그래머가 필요하다 여기지만 당장 구현하기 어려운 업무를 기술하다. 더 이상 필요 없는 기능을 삭제하라는 알림, 누군가에게 문제를 봐달라른 요청, 더 좋은 이름을 떠올려달라는 부탁, 앞으로 발생할 이벤트에 맞춰 코드를 고치라는 주의 등에 유용하다. 하지만 어떤 용도로 사용하든 시스템에 나쁜 코드를 남겨 놓는 핑계가 되어서는 안 된다. 주기적으로 `TODO` 주석을 점검해 없애도 괜찮은 주석은 없애라고 권한다.

### 🎈 중요성을 강조하는 주석
자짓 대수롭지 않다고 여겨질 뭔가의 중요성을 강조하기 위해서도 주석을 사용한다.

```java
String listItemContent = match.group(3).trim();
// 여기서 trim은 정말 중요하다. trim 함수는 문자열에서 시작 공백을 제거한다.
// 문자열에 시작 공백이 있으면 다른 문자열로 인신되기 때문이다.
new ListItemWidget(this, listItemContent, this.level + 1);
return buildList(text.substring(match.end()));
```

### 🎈 공개 API에서 Javadocs
설명이 잘 된 공개 API는 참으로 유용하고 만족스럽다. 표준 자바 라이브러리에서 사용한 Javadocs가 좋은 예다. Javadocs가 없다면 자바 프로그램을 짜기가 아주 어려우리라.   

공개 API를 구현한다면 반드시 훌륭한 Javadocs를 작성한다. 하지만 이 장에서 제시하는 나머지 충고도 명심하기 바란다. 여느 주석과 마찬가지로 Javadocs 역시 독자를 오도하거나, 잘못 위치하거나, 그릇된 정보를 전달할 가능성이 존재한다.

## 🎃 나쁜 주석
대다수 주석이 이 범주에 속한다. 일반적으로 대다수 주석은 허술한 코드를 지탱하거나, 엉성한 코드를 변명하거나, 미숙한 결정을 합리화하는 등 프로그래머가 주절거리는 독백에서 크게 벗어나지 못한다.

### 🎈 주절거리는 주석
특별한 이유 없이 의무감으로 혹은 프로세스에서 하라고 하니까 마지못해 주석을 단다면 전적으로 시간낭비다. 주석을 달기로 결정했다면 충분히 시간을 들여 최고의 주석을 달도록 노력한다.   

```java
public void loadProperties() {
  try {
    String propertiesPath = propertiesLocation + "/" + PROPERTIES_FILE;
    FileInputStream = new FileInputStream(propertiesPath);
    loadedProperties.load(propertiesStream);
  } catch(IOException e) {
    // 속성 파일이 없다면 기본값을 모두 메모리로 읽어 들였다는 의미다.
  }
}
```

`catch` 블록에 있는 주석은 무슨 뜻일까? 확실히 저자에게야 의미가 있겠지만 그 의미가 다른 사람에게는 전해지지 않는다. 답을 알아내려면 다른 코드를 뒤져보는 수밖에 없다. 이해가 안 되어 다른 모습들까지 뒤져야 하는 주석은 독자와 제대로 소통하지 못하는 주석이다. 그런 주석은 바이트만 낭비할 뿐이다.

### 🎈 같은 이야기를 중복하는 주석
아래 예제는 간단한 함수로, 헤더에 달린 주석이 같은 코드 내용을 그대로 중복한다. 자칫하면 코드보다 주석을 읽는 시간이 더 오래 걸린다.

```java
// this.closed가 true일 때 반환되는 유틸리티 메서드다.
// 타임아웃에 도달하면 예외를 던진다.
public synchronized void waitForClose(final long timeoutMillis) throws Exception {
  if (!closed) {
    wait(timeoutMillis);
    if (!closed) {
      throw new Exception("MockResponseSender could not be closed");
    }
  }
}
```

주석이 코드보다 더 많은 내용을 제공하지 못한다. 코드를 정당화하는 주석도 아니고, 의도나 근거를 설명하는 주석도 아니다. 코드보다 읽기가 쉽지도 않다. 실제로 코드보다 부정확해 독자가 함수를 대충 이해하고 넘어가게 만든다.

### 🎈 오해할 여지가 있는 주석
때때로 의도는 좋았으나 프로그래머가 딱 맞을 정도로 엄밀하게는 주석을 달지 못하기도 한다.   

위 예제에서 `this.closed`가 `true`로 변하는 순간에 메서드는 반환되지 않는다. `this.closed`가 `true`**여야** 메서드는 반환된다. 아니면 무조건 타임아웃을 기다렸다 `this.closed`가 그래도 `true`가 **아니면** 예외를 던진다.

### 🎈 의무적으로 다는 주석
모든 함수에 Javadocs를 달거나 모든 변수에 주석을 달아야 한다는 규칙은 어리석기 그지없다. 이런 주석은 코드를 복잡하게 만들며, 거짓말을 퍼뜨리고, 혼동과 무질서를 초래한다.   

아래와 같은 주석은 아무 가치도 없다. 오히려 코드만 헷갈리가 만들며, 거짓말할 가능성을 높이며, 잘못된 정보를 제공할 여지만 만든다.

```java
/**
*
* @param title CD 제목
* @param author CD 저자
* @param tracks CD 트랙 숫자
* @param durationInMinutes CD 길이(단위: 분)
*/
public void addCD(String title, String author, int tracks, int durationInMinutes) {
  CD cd = new CD();
  cd.title = title;
  cd.author = author;
  cd.tracks = tracks;
  cd.duration = durationInMinutes;
  cdList.add(cd);
}
```

### 🎈 이력을 기록하는 주석
때때로 사람들은 모듈을 편집할 때마다 모듈 첫머리에 주석을 추가한다. 그리하여 모듈 첫 머리 주석은 지금까지 몯ㄹ에 가한 변경을 모두 기록하는 일종의 일지 혹은 로그가 된다.   

예전에는 모든 모듈 첫머리에 변경 이력을 기록하고 관리하는 관례가 바람직했다. 당시에는 소스 코드 관리 시스템이 없었으니까. 하지만 이제는 혼란만 가중할 뿐이다. 완전히 제거하는 편이 좋다.

### 🎈 있으나 마나 한 주석
때때로 있으나 마나 한 주석을 접한다. 쉽게 말해, 너무 당연한 사실을 언급하며 새로운 정보를 제공하지 못하는 주석이다.

```java
/*
 * 기본 생성자
 */
protected AnnualDateRule() {
  // ...
}
```

그렇단 말이지? 다음은 어떤가?

```java
/** 월 중 일자 */
private int dayOfMonth;
```

위와 같은 주석은 지나친 참견이라 개발자가 주석을 무시하는 습관에 빠진다. 코드를 읽으며 자동으로 주석을 건너뛴다. 결국은 코드가 바뀌면서 주석은 거짓말로 변한다.

### 🎈 무서운 잡음
떄로는 Javadocs도 잡음이다. 다음은 잘 알려진 오픈 소스 라이브러리에서 가져온 코드다. 아래 나오는 Javadocs는 어떤 목적을 수행할까? 답: 없다. 단지 문서를 제공해야 한다는 잘못된 욕심으로 탄생한 잡음일 뿐이다.

```java
/** The name. */
private String name;
/** The version. */
private String version;
```

### 🎈 함수나 변수로 표현할 수 있다면 주석을 달지 마라
다음 코드를 살펴보자.

```java
// 전역 목록 <smodule>에 속하는 모듈이 우리가 속한 하위 시스템에 의존하는가?
if (smodule.getDependSubsystems().contains(subSysMod.getSubSystem()))
```

이 코드에서 주석을 없애고 다시 표현하면 다음과 같다.

```java
ArrayList moduleDependees = smodule.getDependSubsystems();
String ourSubSystem = subSysMod.getSubSystem();
if (moduleDependees.contains(ourSubSystem))
```

코드를 작성한 저자는 (가능성이야 희박하지만) 주석을 먼저 달고 주석에 맞춰 코드를 작성했을지도 모르겠다. 하지만 위와 같이 주석이 필요하지 않도록 코드를 개선하는 편이 더 좋았다.

### 🎈 위치를 표시하는 주석
때때로 프로그래머는 소스 파일에서 특정 위치를 표시하려 주석을 사용한다. 예를 들어, 최근에 살펴보던 프로그램에서 다음 행을 발견했다.

```java
// Actions //////////////
```

극히 드물지만 위와 같은 배너 아래 특정 기능을 모아놓으면 유용한 경우도 있긴 있다. 하지만 일반적으로 위와 같은 주석은 가독성만 낮추므로 제거해야 마땅하다. 특히 뒷부분에 슬래시로 이어지는 잡음은 제거하는 편이 좋다.   

너무 자주 사용하지 않는다면 배너는 눈에 띄며 주의를 환기한다. 그러므로 반드시 필요할 때만, 아주 드물게 사용하는 편이 좋다. 배너를 남용하면 독자가 흔한 잡음으로 여겨 무시한다.
