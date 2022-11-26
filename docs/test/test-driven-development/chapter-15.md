---
sidebar_position: 16
sidebar_label: 15. 서로 다른 통화 더하기
---

# 🌈 Chapter 15: 서로 다른 통화 더하기
드디어 이 모든 작업의 시초인 `$5 + 10CHF`에 대한 테스트를 추가할 준비가 됐다.

```java
public void testMixedAddition() {
  Expression fiveBucks = Money.dollar(5);
  Expression tenFrancs = Money.franc(10);
  Bank bank = new Bank();
  bank.addRate("CHF", "USD", 2);
  Money result = bank.reduce(
    fiveBucks.plus(tenFrancs), "USD");
  assertEquals(Money.dollar(10), result);
}
```

이게 우리가 원하는 코드다. 불행히도 컴파일 에러가 무지 많다.

```java
public void testMixedAddition() {
  Money fiveBucks = Money.dollar(5);
  Money tenFrancs = Money.franc(10);
  Bank bank = new Bank();
  bank.addRate("CHF", "USD", 2);
  Money result = bank.reduce(
    fiveBucks.plus(tenFrancs), "USD");
  assertEquals(Money.dollar(10), result);
}
```

테스트가 실패한다. `10USD` 대신 `15USD`가 나왔다. `Sum.reduce()`가 인자를 축약하지 않은 것 같아 보인다. 실제로도 그렇다.

```java
// Sum
public Money reduce(Bank bank, String to) {
  int amount = augend.amount + addend.amount;
  return new Money(amount, to);
}
```

다음과 같이 두 인자를 모두 축약하면 테스트가 통과할 것이다.

```java
// Sum
public Money reduce(Bank bank, String to) {
  int amount = augend.reduce(bank, to).amount + addend.reduce(bank, to).amount;
  return new Money(amount, to);
}
```

통과한다. 파급 효과를 피하기 위해 가장자리에서 작업해 나가기 시작해서 그 테스트 케이스까지 거슬러 올라오도록 하겠다.

```java
// Sum
Expression augend;
Expression addend;
```

`Sum` 생성자의 인자 역시 `Expression`일 수 있다.

```java
// Sum
Sum(Expression augend, Expression addend) {
  this.augend = augend;
  this.addend = addend;
}
```

그럼 `Money`쪽은 어떤가?   
`plus()`의 인자가 `Expression`으로 취급될 수 있다.

```java
// Money
Expression plus(Expression addend) {
  return new Sum(this, addend);
}
```

`times()`의 반환 값도 `Expression`일 수 있다.

```java
// Money
Expression times(int multiplier) {
  return new Money(amount * multiplier, currency);
}
```

이 코드는 `Expression`이 `plus()`와 `times()` 오퍼레이션을 포함해야 함을 제안하고 있다. 이게 `Money`의 전부다. 이제 테스트 케이스에 나오는 `plus()`의 인자도 바꿀 수 있다.

```java
public void testMixedAddition() {
  Money fiveBucks = Money.dollar(5);
  Expression tenFrancs = Money.franc(10);
  Bank bank = new Bank();
  bank.addRate("CHF", "USD", 2);
  Money result = bank.reduce(
    fiveBucks.plus(tenFrancs), "USD");
  assertEquals(Money.dollar(10), result);
}
```

`fiveBucks`를 `Expression`으로 바꾸고 나면 몇 군데를 같이 수정해야 한다. 다행스럽게도 컴파일러가 할일 목록을 제공하기 때문에 우린 계속 집중할 수 있다. 우선 다음과 같이 고친다.


```java
public void testMixedAddition() {
  Expression fiveBucks = Money.dollar(5);
  Expression tenFrancs = Money.franc(10);
  Bank bank = new Bank();
  bank.addRate("CHF", "USD", 2);
  Money result = bank.reduce(
    fiveBucks.plus(tenFrancs), "USD");
  assertEquals(Money.dollar(10), result);
}
```

컴파일러가 점잖게 `Expression`에 `plus()`가 정의되지 않았다고 알려준다. 정의해주자.

```java
// Expression
Expression plus(Expression addend);
```

이제 `Money`와 `Sum`에도 추가해야 한다. Money? 그래, 공용으로 바꾸면 된다.

```java
// Money
public Expression plus(Expression addend) {
  return new Sum(this, addend);
}
```

`Sum`의 구현을 스텁 구현으로 바꾸고, 할일 목록에 적어두자.

```java
// Sum
public Expression plus(Expression addend) {
  return null;
}
```

이제 프로그램이 컴파일되고 테스트도 모두 통과한다.
