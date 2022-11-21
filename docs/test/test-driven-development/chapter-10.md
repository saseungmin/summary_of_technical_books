---
sidebar_position: 11
sidebar_label: 10. 흥미로운 시간
---

# 🌈 Chapter 10: 흥미로운 시간
두 `times()` 구현이 거의 비슷하기 하지만 아직 완전히 동일하지는 않다.   

```java
// Franc
Money times(int multiplier) {
  return Money.franc(amount * multiplier);
}

// Dollar
Money times(int multiplier) {
  return Money.dollar(amount * multiplier);
}
```

이 둘을 동일하게 만들기 위한 명백한 방법이 없다. 때로는 전진하기 위해서 물러서야 할 때도 있는 법이다. 팩토리 메서드를 인라인시키면 어떨까?

```java
// Franc
Money times(int multiplier) {
  return new Franc(amount * multiplier, "CHF");
}

// Dollar
Money times(int multiplier) {
  return new Dollar(amount * multiplier, "USD");
}
```

`Franc`에서는 인스턴스 변수 `currency`가 항상 `CHF`이므로 다음과 같이 쓸 수 있다.

```java
// Franc
Money times(int multiplier) {
  return new Franc(amount * multiplier, currency);
}
```

잘 돌아간다. `Dollar`도 마찬가지로 고칠 수 있다.

```java
Money times(int multiplier) {
  return new Dollar(amount * multiplier, currency);
}
```

`Franc`을 가질지 `Money`를 가질지가 정말로 중요한 사실인가? 시스템에 대해 아는 지식을 기반으로 조심스럽게 생각해보아 할 문제다. 하지만 우리에겐 깔끔한 코드와 그 코드가 잘 작동할 거라는 믿음을 줄 수 있는 테스트 코드들이 있다. 몇 분 동안 고민하는 대신 그냥 수정하고 테스트를 돌려서 컴퓨터에게 직접 물어보자. TDD를 가르치다보면 항상 이런 상황을 보게 된다. 컴퓨터라면 10초에서 15초 사이에 대답할 수 있는 문제를 놓고 최고의 소프트웨어 엔지니어들이 5분에서 10분 동안 고민하곤 한다. 가끔은 그냥 컴퓨터에게 물어보는 것도 좋다.   

실험을 실행하기 위해 `Franc.times()`가 `Money`를 반환하도록 고쳐보자.

```java
// Franc
Money times(int multiplier) {
  return Money(amount * multiplier, currency);
}
```

컴파일러가 `Money`를 콘크리트 클래스로 바꿔야 한다고 말한다.

```java
// Money
class Money {
  Money times(int amount) {
    return null;
  }
}
```

빨간 막대다. 에러 메시지에는 기대만큼 도움이 되는 메시지가 아닌 것 같다. 더 나은 메시지를 보기 위해 `toString()`을 정의하자.

```java
// Money
public String toString() {
  return amount + " " + currency;
}
```

헉! 테스트도 없이 코드를 작성하네? 그래도 되는 건가? `toString()`을 작성하기 전에 테스트를 작성하는 게 맞다. 하지만
  - 우린 지금 화면에 나타나는 결과를 보려던 참이다.
  - `toString()`은 디버그 출력에만 쓰이기 때문에 이게 잘못 구현됨으로 인해 얻게 될 리스크가 적다.
  - 이미 빨간 막대 상태인데 이 상태에서는 새로운 테스트를 작성하지 않는 게 좋을 것 같다.

`Franc` 대신 `Money`가 왔다. 문제는 `equals()` 구현에 있다.

```java
// Money
public boolean equals(Object object) {
  Money money = (Money) object;
  return amount == money.amount && getClass().equals(money.getClass());
}
```

정말로 검사해야 할 것은 클래스가 같은지가 아니라 `currency`가 같은지 여부다.   

빨간 막대인 상황에서는 테스트를 추가로 작성하고 싶지 않다. 하지만 지금은 실제 모델 코드를 수정하려고 하는 중이고 테스트 없이는 모델 코드를 수정할 수 없다. 보수적인 방법으로 따르자면 변경된 코드를 되돌려서 다시 초록 막대 상태로 둘아가야 한다. 그러고 나서 `equals()`를 위해 테스트를 고치고 구현 코드를 고칠 수 있게 되고, 그 후에야 원래 하던 일을 다시 할 수 있다.   
이번에는 보수적으로 해보자.

```java
// Franc
Money times(int multiplier) {
  return new Franc(amount * multiplier, currency);
}
```

다시 초록 막대로 돌아왔다. 우리 상황은 `Franc(10, "CHF")`과 `Money(10, "CHF")`가 서로 같기를 바라지만, 사실은 그렇지 않다고 보고된 것이다. 우리는 이걸 그대로 테스트로 사용할 수 있다.

```java
public void testDifferentClassEquality() {
  assertTrue(new Money(10, "CHF").equals(new Franc(10, "CHF")));
}
```

예상대로 실패한다. `equals()` 코드는 클래스가 아니라 `currency`를 비교해야 한다.

```java
// Money
public boolean equals(Object object) {
  Money money = (Money) object;
  return amount == money.amount && currency().equals(money.currency());
}
```

이제 `Franc.times()`에서 `Money`를 반환해도 테스트가 여전히 통과하게 할 수 있다.

```java
// Franc
Money times(int multiplier) {
  return new Money(amount * multiplier, currency);
}
```

이게 `Dollar.times()`에도 적용될까?

```java
// Dollar
Money times(int multiplier) {
  return new Money(amount * multiplier, currency);
}
```

잘 된다! 이제 두 구현이 동일해졌으니, 상위 클래스로 끌어 올릴 수 있ㄷ.

```java
// Money
Money times(int multiplier) {
  return new Money(amount * multiplier, currency);
}
```

곱하기도 구현했으니 이제 아무것도 안 하는 멍청한 하위 클래스들을 제거할 수 있겠다.
