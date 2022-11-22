---
sidebar_position: 12
sidebar_label: 11. 모든 악의 근원
---

# 🌈 Chapter 11: 모든 악의 근원
두 하위 클래스 `Dollar`와 `Franc`에는 달랑 생성자밖에 없다. 단지 생성자 때문에 하위 클래스가 있을 필요는 없기 때문에 하위 클래스를 제거하는 게 좋겠다.   

코드의 의미를 변경하지 않으면서도 하위 클래스에 대한 참조를 상위 클래스에 대한 참조로 변경할 수 있다. 일단 `Money.franc()`을 고치자.

```java
// Money
static Money franc(int amount) {
  return new Money(amount, "CHF");
}
```

그리고 `Money.dollar()`도.

```java
static Money dollar(int amount) {
  return new Money(amount, "USD");
}
```

이제 `Dollar`에 대한 참조 하나도 남아 있지 않으므로 `Dollar`를 지울 수 있게 됐다. 반면에 `Franc`은 우리가 작성했던 테스트 코드에서 아직 참조한다.

```java
public void testDifferentClassEquality() {
  assertTrue(new Money(10, "CHF").equals(
    new Franc(10, "CHF")
  ));
}
```

이 테스트를 지워도 될 정도로 다른 곳에서 동치성 테스트를 충분히 하고 있는가? 다른 동치성 테스트를 한번 보자.

```java
public void testEquality() {
  assertTrue(Money.dollar(5).equals(Money.dollar(5)));
  assertFalse(Money.dollar(5).equals(Money.dollar(6)));
  assertTrue(Money.franc(5).equals(Money.franc(5)));
  assertFalse(Money.franc(5).equals(Money.franc(6)));
  assertFalse(Money.franc(5).equals(Money.dollar(5)));
}
```

충분한 테스트인 것 같다. 사실 좀 과하다. 세 번째와 네 번째 단언은 첫 번째, 두 번째 단언과 중복되므로 지우는 게 좋겠다.

```java
public void testEquality() {
  assertTrue(Money.dollar(5).equals(Money.dollar(5)));
  assertFalse(Money.dollar(5).equals(Money.dollar(6)));
  assertFalse(Money.franc(5).equals(Money.dollar(5)));
}
```

클래스 대신 `currency`를 비교하도록 강요하는 테스트 코드는 여러 클래스가 존재할 때만 의미 있다. `Franc` 클래스를 제거하려는 중이기 때문에 `Franc`이 있을 경우에 시스템이 작동하는지 확인하는 테스트는 도움이 되고 오히려 짐이 된다. `Franc`와 함께 `testDifferentClassEquality`를 보내벼리자.
