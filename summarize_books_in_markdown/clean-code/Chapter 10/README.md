# 🍭 Chapter 10: 클래스

## 🎃 클래스 체계

### 🎈 캡슐화
변수와 유틸리티 함수는 가능한 공개하지 않는 편이 낫지만 반드시 숨겨야 한다는 법칙도 없다. 때로는 변수나 유티리티 함수를 `protected`로 선언하 테스트 코드에 접근을 허용하기도 한다. 우리에게 테스트는 아주 중요하다. 같은 패키지 안에서 테스트 코드가 함수를 호출하거나 변수를 사용해야 한다면 그 함수나 변수를 `protected`로 선언하거나 패키지 전체로 공개한다. 하지만 그 전에 비공개 상태를 유지할 온갖 방법을 강구한다. 캡슐화를 풀어주는 결정은 언제나 최후의 수단이다.   

## 🎃 클래스는 작아야 한다!
클래스는 만들 때 첫 번째 규칙은 크기다. 클래스는 작아야 한다. 두 버째 규칙도 크기다. 더 작아야 한다. 앞서 **함수** 장에서 했던 이야기를 되풀이할 의도는 없다. 단지 클래스를 설계할 때도, 함수와 마찬가지로, '작게'가 기본 규칙이라는 의미다. 그렇다면 가장 먼저 떠오르는 의문은, 함수와 마찬가지로, "얼마나 작아야 하는가?"겠다.   

함수는 물리적인 행 수로 크기를 측정했다. 클래스는 맡은 책임을 센다.

```java
public class SuperDashboard extends JFrame implements MetaDataUser {
  public Component getLastFocusedComponent()
  public void setLastFocused(Component lastFocused)
  public int getMajorVersionNumber()
  public int getMinorVersionNumber()
  public int getBuildNumber()
}
```

메서드 다섯 개 정도면 괜찮다. 안 그런가? 여기서는 아니다. `SuperDashboard`는 메서드 수가 작음에도 불구하고 **책임**이 너무 많다.   

클래스 이름은 해당 클래스 책임을 기술해야 한다. 실제로 작명은 클래스 크기를 줄이는 첫 번째 관문이다. 간결한 이름이 떠오르지 않는다면 필경 클래스 크기가 너무 커서 그렇다. 클래스 이름이 모호하다면 필경 클래스 책임이 너무 많아서다.   

또한 클래스 설명은 만일(if), 그리고(and), -(하)며(or), 하지만(but)을 사용하지 않고서 25단어 내외로 가능해야 한다.   

### 🎈 단일 책임 원칙
단일 책임 원칙(SRP)은 클래스나 모듈을 **변경할 이유**가 하나, 단 하나뿐이어야 한다는 원칙이다. SRP는 책임이라는 개념을 정의하며 적절한 클래스 크기를 제시한다. 클래스는 책임, 즉 변경할 이유가 하나여야 한다는 의미다.   

`SuperDashboard`는 변경할 이유가 두 가지다. 첫째, `SuperDashboard`는 소프트웨어 버전을 추적한다. 그런데 버전 정보는 소프트웨어를 출시할 때마다 달라진다. 둘째, `SuperDashboard`는 자바 스윙 컴포넌트를 관리하다. 즉, 스윙 코드를 변경할 때마다 버전 번호가 달라진다.   

책임, 즉 변경할 이유를 파악하려 애쓰다 보면 코드를 추상화하기도 쉬워진다. 더 좋은 추상화가 더 쉽게 떠오른다. `SuperDashboard`에서 버전 정보를 다루는 메서드 세 개를 따로 빼내 `Version`이라는 독자적인 클래스를 만든다. `Version` 클래스는 다른 애플리케이션에서 재사용하기 아주 쉬운 구조다!

```java
public class Version {
  public int getMajorVersionNumber()
  public int getMinorVersionNumber()
  public int getBuildNumber()
}
```

SRP는 객체 지향 설계에서 더욱 중요한 개념이다. 우리는 수많은 책임을 떠안은 클래스를 꾸준히 접한다. 관심사를 분리하는 작업은 프로그램만이 아니라 프로그래밍 활동에서도 마찬가지로 중요하다.   

규모가 어느 수준에 이르는 시스템은 논리가 많고도 복잡하다. 이런 복잡성을 다루려면 체계적인 정리가 필수다. 그래야 개발자가 무엇이 어디에 있는지 쉽게 찾는다. 그래야 (변경을 가할 때) 직접 영향이 미치는 컴포넌트만 이해해도 충분하다. 큼직한 다목적 클래스 몇 개로 이뤄진 시스템은 당장 알 필요가 없는 사실까지 들이밀어 독자를 방해한다.   

큰 클래스 몇 개가 아니라 작은 클래스 여럿으로 이뤄진 시스템이 더 바람직하다. 작은 클래스는 각자 맡은 책임이 하나며, 변경할 이유가 하나며, 다른 작은 클래스와 협력해 시스템에 필요한 동작을 수행한다.   

### 🎈 응집도(Cohesion)
클래스는 인스턴스 변수 수가 작아야 한다. 각 클래스 메서드는 클래스 인스턴스 변수를 하나 이상 사용해야 한다. 일반적으로 메서드가 변수를 더 많이 사용할수록 메서드와 클래스는 응집도가 더 높다. 모든 인스턴스 변수를 메서드마다 사용하는 클래스는 응집도가 가장 높다.   

일반적으로 이처럼 응집도가 가장 높은 클래스는 가능하지도 바람직하지도 않다. 그렇지만 우리는 응집도가 높은 클래스를 선호한다. 응집도가 높다는 말은 클래스에 속한 메서드와 변수가 서로 의존하며 논리적인 단위로 묶인다는 의미기 때문이다.   

아래 예제 코드는 `Stack`을 구현한 코드다. 아래 클래스는 응집도가 아주 높다. `size()`를 제외한 다른 두 메서드는 두 변수를 모두 사용한다.

```java
public class Stack {
  private int topOfStack = 0;
  List<Integer> elements = new LinkedList<Integer>();

  public int size() {
    return topOfStack;
  }

  public void push(int element) {
    topOfStack++;
    elements.add(element);
  }

  public int pop() throws PoppedWhenEmpty {
    if (topOfStack == 0)
      throw new PoppedWhenEmpty();
    int element = elements.get(--topOfStack);
    elements.remove(topOfStack);
    return element;
  }
}
```

'함수를 작게, 매개변수 목록을 짧게'라는 전략을 따르다 보면 때때로 몇몇 메서드만이 사용하는 인스턴스 변수가 아주 많아진다. 이는 십중팔구 새로운 클래스로 쪼개야 한다는 신호다. 응집도가 높아지도록 변수와 메서드를 적절히 분리해 새로운 클래스 두세 개로 쪼개준다.
