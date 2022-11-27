---
sidebar_position: 17
sidebar_label: 16. 드디어, 추상화
---

# 🌈 Chapter 16: 드디어, 추상화
다음은 `Sum.plus()`에 대한 테스트다.

```java
public void testSumPlusMoney() {
  Expression fiveBucks = Money.dollar(5);
  Expression tenFrancs = Money.franc(10);
  Bank bank = new Bank();
  bank.addRate("CHF", "USD", 2);
  Expression sum = new Sum(fiveBucks, tenFrancs).plus(fiveBucks);
  Money result = bank.reduce(sum, "USD");
  assertEquals(Money.dollar(15), result);
}
```

`fiveBucks`와 `tenFrancs`를 더해서 `Sum`을 생성할 수도 있지만 위의 코드에서는 명시적으로 `Sum`을 생성하는데, 이게 더 직접적으로 우리 의도를 드러낸다. 우리가 이 테스트들을 작성하는 것은 단지 자신의 프로그래밍 경험을 더 재미있고 보람차게 하려고 하는 것만이 아니고, 후대가 우리의 천재성을 감상할 수 있는 로제타석이 되도록 하기 위함이기도 하다.   
테스트가 코드보다 더 길다. 그리고 코드는 `Money`의 코드와 똑같다.

```java
// Sum
public Expression plus(Expression addend) {
  return new Sum(this, addend);
}
```

TDD로 구현할 땐 테스트 코드의 줄 수와 모델 코드의 줄 수가 거의 비슷한 상태로 끝난다. TDD가 경제적이기 위해서는 매일 만들어 내는 코드의 줄 수가 두 배가 되거나 동일한 기능을 구현하되 절반의 줄 수로 해내야 할 것이다. TDD가 자신의 방법에 비해 어떻게 다른지 직접 측정해 보아야 할 것이다. 이때 디버깅, 통합 작업, 다른 사람에게 설명하는 데 걸리는 시간 등의 요소를 반드시 포함해야 한다는 것을 기억하기 바란다.   

일단 `Sum.times()`가 작동하게 만들 수만 있다면 `Expression.times()`를 선언하는 일이야 어렵지 않을 것이다. 테스트는 다음과 같다.

```java
public void testSumTimes() {
  Expression fiveBucks = Money.dollar(5);
  Expression tenFrancs = Money.franc(10);
  Bank bank = new Bank();
  bank.addRate("CHF", "USD", 2);
  Expression sum = new Sum(fiveBucks, tenFrancs).plus(2);
  Money result = bank.reduce(sum, "USD");
  assertEquals(Money.dollar(20), result);
}
```

이번에도 테스트가 코드보다 길다.

```java
// Sum
Expression times(int multiplier) {
  return new Sum(augend.times(multiplier), addend.times(multiplier));
}
```

지난 장에서 피가산수(`augend`)와 기수(`addend`)를 `Expression`으로 추상화했기 때문에 코드가 컴파일되게 만들려면 `Expression`에 `times()`를 선언해야 한다.

```java
// Expression
Expression times(int multiplier);
```

이 작업 떄문에 `Money.times()`와 `Sum.times()`의 가시성을 높여줘야 한다.

```java
// Sum
public Expression times(int multiplier) {
  return new Sum(augend.times(multiplier), addend.times(multiplier));
}

// Money
public Expression times(int multiplier) {
  return new Money(amount * multiplier, currency);
}
```

테스트가 통과한다.   
뭔가 깔끔히 정리해야 할 것이 있다면, `$5 + $5`를 할 때에 `Money`를 반환하는 걸 실험해 보는 것이다. 테스트는 다음과 같을 것이다.

```java
public void testPlusSameCurrencyReturnMoney() {
  Expression sum = Money.dollar(1).plus(Money.dollar(1));
  assertTrue(sum instanceof Money);
}
```

이 테스트는 외부에 드러나는 객체의 행위에 대한 것이 아니라 구현 중심이기 떄문에 좀 지저분하다. 그렇기는 하지만 이 테스트는 우리가 원하는 변화를 가할 수 있게 해준다. 게다가 이 테스트는 단지 실험일 뿐이다. 이 테스트를 통과시키기 위해 다음과 같이 쓸 수 있다.

```java
// Money
public Expression plus(Expression addend) {
  return new Sum(this, addend);
}
```

인자가 `Money`일 경우에, 그리고 오로지 그 경우에만 인자의 통화를 확인하는 분명하고도 깔끔한 방법이 없다. 실험은 실패했고, 우린 테스트를 삭제하고(어차피 별로 안 좋게 생각하던 테스트였다) 떠난다.
