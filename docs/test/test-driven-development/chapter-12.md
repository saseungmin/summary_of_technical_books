---
sidebar_position: 13
sidebar_label: 12. 드디어, 더하기
---

# 🌈 Chapter 12: 드디어, 더하기

```java
public void testSimpleAddition() {
  Money sum = Money.dollar(5).plus(Money.dollar(5));
  assertEquals(Money.dollar(10), sum);
}
```

그냥 `Money.dollar(10)`를 반환하는 식으로 가짜 구현을 할 수도 있다. 하지만 어떻게 구현해야 할지 명확하므로 다음과 같이 하겠다.

```java
// Money
Money plus(Money addend) {
  return new Money(amount + addend.amount, currency);
}
```

이 간단한 예제에서 `Bank`가 할 일은 정말 하나도 없다. 일단 객체만 하나 있다면 오케이다.

```java
public void testSimpleAddition() {
  // ...
  Bank bank = new Bank();
  Money reduced = bank.reduce(sum, "USD");
  assertEquals(Money.dollar(10), reduced);
}
```

두 `Money`의 합은 `Expression`이어야 한다.

```java
public void testSimpleAddition() {
  // ...
  Expression sum = five.plus(five);
  Bank bank = new Bank();
  Money reduced = bank.reduce(sum, "USD");
  assertEquals(Money.dollar(10), reduced);
}
```

`$5`를 만드는건 간단하다.

```java
public void testSimpleAddition() {
  Money five = Money.dollar(5);
  Expression sum = five.plus(five);
  Bank bank = new Bank();
  Money reduced = bank.reduce(sum, "USD");
  assertEquals(Money.dollar(10), reduced);
}
```

이걸 컴파일하면 어떻게 해야 하나? `Expression` 인터페이스가 필요하다.

```java
// Expression
interface Expression
```

`Money.plus()`는 `Expression`을 반환해야 한다.

```java
// Money
Expression plus(Money addend) {
  return new Money(amount + addend.amount, currency);
}
```

이건 `Money`가 `Expression`을 구현해야 한다는 뜻이다.

```java
// Money
class Money implements Expression
```

이제 빈 `Bank` 클래스가 필요하다.

 ```java
 // Bank
 class Bank
 ```

그리고 `Bank`에는 `reduce()`의 스텁이 있어야 한다.

```java
// Bank
Money reduce(Expression source, String to) {
  return null;
}
```

이제 컴파일이 되고, 바로 실패한다. 만세! 진전이다. 간단히 가짜 구문을 할 수 있다.

```java
// Bank
Money reduce(Expression source, String to) {
  return Money.dollar(10);
}
```
