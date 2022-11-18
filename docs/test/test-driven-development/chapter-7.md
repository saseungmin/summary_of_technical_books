---
sidebar_position: 8
sidebar_label: 7. 사과와 오렌지
---

# 🌈 Chapter 7: 사과와 오렌지

```java
public void testEquality() {
  assertTrue(new Dollar(5).equals(new Dollar(5)));
  assertFalse(new Dollar(5).equals(new Dollar(6)));
  assertTrue(new Franc(5).equals(new Franc(5)));
  assertFalse(new Franc(5).equals(new Franc(6)));
  assertFalse(new Franc(5).equals(new Dollar(5)));
}
```

실패한다. `Dollar`가 `Franc`이라는군. 동치성 코드에서는 `Dollar`가 `Franc`과 비교되지 않는지 검사해야 한다. 두 객체의 클래스를 비교함으로써 이러한 검사를 쉽게 수행할 수 있다. 오직 금액과 클래스가 서로 동일할 때만 두 `Money`가 서로 같은 것이다.

```java
public boolean equals(Object object) {
  Money money = (Money) object;
  return amount == money.amount && getClass().equals(money.getClass());
}
```

모델 코드에서 클래스를 이런 식으로 사용하는 것은 좀 지저분해 보인다. 자바 객체의 용어를 사용하는 것보다 재정 분야에 맞는 용어를 사용하고 싶다. 하지만 현재는 통화 개념 같은 게 없고, 통화 개념을 도입할 충분한 이유가 없어 보이므로 잠시 이대로 두자.   

이제 정말 공통 `times()` 코드를 처리해야 할 때다. 따라서 혼합된 통화 간의 연산에 대해 다루어야 한다.
