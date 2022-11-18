---
sidebar_position: 9
sidebar_label: 8. 객체 만들기
---

# 🌈 Chapter 8: 객체 만들기
두 `times()` 구현 코드가 거의 똑같다.

```java
// Franc
Franc times(int multiplier) {
  return new Franc(amount * multiplier);
}

// Dollar
Dollar times(int multiplier) {
  return new Dollar(amount * multiplier);
}
```

양쪽 모두 `Money`를 반환하게 만들면 더 비슷하게 만들 수 있다.

```java
// Franc
Money times(int multiplier) {
  return new Franc(amount * multiplier);
}

// Dollar
Money times(int multiplier) {
  return new Dollar(amount * multiplier);
}
```

`Money`의 두 하위 클래스는 그다지 많은 일을 하는 것 같지 않으므로 아예 제거해버리고 싶다. 그런데 한번에 그렇게 큰 단계를 밟는 것은 TDD를 효과적으로 보여주기에 적절하지 않을 것 같다.   

그렇지. 하위 클래스에 대한 직접적인 참조가 적어진다면 하위 클래스를 제거하기 위해 한 발짝 더 다가섰다고 할 수 있겠다. `Money`에 `Dollar`를 반환하는 팩토리 메서드를 도입할 수 있다. 이런 식으로 사용할 수 있다.

```java
public void testMultiplication() {
  Dollar five = Money.dollar(5);
  assertEquals(new Dollar(10), five.times(2));
  assertEquals(new Dollar(15), five.times(3));
}
```

구현 코드는 `Dollar`를 생성하여 반환한다.

```java
static Dollar dollar(int amount) {
  return new Dollar(amount);
}
```

`Dollar`에 대한 참조가 사라지길 바라므로 테스트의 선언부를 다음과 같이 바꿔야한다.

```java
public void testMultiplication() {
  Money five = Money.dollar(5);
  assertEquals(new Dollar(10), five.times(2));
  assertEquals(new Dollar(15), five.times(3));
}
```

컴파일러가 `Money`에는 `times()`가 정의되지 않았다는 사실을 알려준다. 지금은 그걸 구현할 준비가 되지 않았기 때문에, `Money`를 추상 클래스로 변경한 후 `Money.times()`를 선언하자.

```java
abstract class Money
abstract Money times(int multiplier);
```

이제 팩토리 메서드를 선언을 바꿀 수 있다.

```java
static Money dollar(int amount) {
  return new Dollar(amount);
}
```

모든 테스트가 실행되므로 최소한 뭔가를 깨트리진 않았다. 이제 팩토리 메서드를 테스트 코드의 나머지 모든 곳에서 사용할 수 있다.

```java
public void testMultiplication() {
  Money five = Money.dollar(5);
  assertEquals(Money.Dollar(10), five.times(2));
  assertEquals(Money.Dollar(15), five.times(3));
}

public void testEquality() {
  assertTrue(Money.dollar(5).equals(Money.dollar(5)));
  assertFalse(Money.Dollar(5).equals(Money.Dollar(6)));
  assertTrue(new Franc(5).equals(new Franc(5)));
  assertFalse(new Franc(5).equals(new Franc(6)));
  assertFalse(new Franc(5).equals(Money.Dollar(5)));
}
```

이제 전보다 조금 나은 상황이다. 어떤 클라이언트 코드도 `Dollar`라는 이름의 하위 클래스가 있다는 사실을 알지 못한다. 하위 클래스의 존재를 테스트에서 분리함으로써 어떤 모델 코드에도 영향을 주지 않고 상속 구조를 마음대로 변경할 수 있게 됐다.   

`testFrancMultiplication`을 변경하려고 하다보니 이 테스트가 검사하는 로직 중 `Dollar` 곱하기 테스트에 의해 검사되지 않는 부분은 하나도 없다는 것을 알아챘다. 이 테스트를 삭제한다면 코드에 대한 확신이 조금이라도 줄어들까? 약간이나마 그럴 가능성이 있으니 일단 그대로 남겨두자. 하지만 좀 수상쩍다.

```java
public void testEquality() {
  assertTrue(Money.dollar(5).equals(Money.dollar(5)));
  assertFalse(Money.Dollar(5).equals(Money.Dollar(6)));
  assertTrue(Money.Franc(5).equals(Money.Franc(5)));
  assertFalse(Money.Franc(5).equals(Money.Franc(6)));
  assertFalse(Money.Franc(5).equals(Money.Dollar(5)));
}

public void testFrancMultiplication() {
  Money five = Money.franc(5);
  assertEquals(Money.franc(10), five.times(2));
  assertEquals(Money.franc(15), five.times(3));
}
```

구현은 `Money.dollar()`와 유사하다.

```java
static Money franc(int amount) {
  return new Franc(amount);
}
```

다음 장에서 우리는 `times()`의 중복을 거둬낼 것이다.
