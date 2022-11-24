---
sidebar_position: 14
sidebar_label: 13. 진짜로 만들기
---

# 🌈 Chapter 13: 진짜로 만들기
모든 중복을 제거하기 전까지는 `$5 + $5` 테스트에 완료 표시를 할 수 없다. 코드 중복은 없지만 데이터 중복이 있다. 가짜 구현에 있는 `$10`는

```java
// Bank
Money reduce(Expression source, String to) {
  return Money.dollar(10);
}
```

사실 테스트 코드에 있는 `$5 + $5`와 같다.

```java
public void testSimpleAddition() {
  Money five = Money.dollar(5);
  Expression sum = five.plus(five);
  Bank bank = new Bank();
  Money reduced = bank.reduce(sum, "USD");
  assertEquals(Money.dollar(10), reduced);
}
```

우선, `Money.plus`는 그냥 `Money`가 아닌 `Expression(Sum)`을 반환해야 한다.   
두 `Money`의 합은 `Sum`이어야 한다.

```java
public void testPlusReturnsSum() {
  Money five = Money.dollar(5);
  Expression result = five.plus(five);
  Sum sum = (Sum) result;
  assertEquals(five, sum.augend);
  assertEquals(five, sum.addend);
}
```

위 테스트는 그리 오래가지 못할 것이다. 위 테스트는 수행하고자 하는 연산의 외부 행위가 아닌 내부 구현에 대해 너무 깊게 관여하고 있다. 그렇긴 해도 일단 이 테스트를 통과하면 목표에 한 걸음 더 다가가게 될 것이다. 이 코드를 컴파일하기 위해선 `augend`와 `addend` 필드를 가지는 `Sum` 클래스가 필요하다.

```java
// Sum
class Sum {
  Money augend;
  Money addend;
}
```

`Money.plus()`는 `Sum`이 아닌 `Money`를 반환하게 되어 있기 때문에, 이 코드는 `ClassCastException`을 발생시킨다.

```java
// Money
Expression plus(Money addend) {
  return new Sum(this, addend);
}
```

`Sum` 생성자도 필요하다.

```java
// Sum
Sum(Money augend, Money addend) {
  this.augend = augend;
  this.addend = addend
}
```

그리고 `Sum`은 `Expression`의 일종이어야 한다.

```java
// Sum
class Sum implements Expression
```

이제 `Bank.reduce()`는 `Sum`을 전달받는다. 만약 `Sum`이 가지고 있는 `Money`의 통화가 모두 동일하고, `reduce`를 통해 얻어내고자 하는 `Money`의 통화 역시 같다면, 결과는 `Sum` 내에 있는 `Money`들이 `amount`를 합친 값을 갖는 `Money` 객체여야 한다.

```java
public void testPlusReturnsSum() {
  Expression sum = new Sum(Money.dollar(3), Money.dollar(4));
  Bank bank = new Bank();
  Money result = bank.reduce(sum, "USD");
  assertEquals(Money.dollar(7), result);
}
```

현존하는 테스트가 깨지도록 인자를 선택했다. 우리가 `Sum`을 계산하면 결과는 `Money`가 되어야 하며, 그 `Money`의 양은 두 `Money` 양의 합이고, 통화는 우리가 축약하는 통화여야 한다.

```java
// Bank
Money reduce(Expression source, String to) {
  Sum sum = (Sum) source;
  int amount = sum.augend.amount + sum.addend.amount;
  return new Money(amount, to);
}
```

이 코드는 다음 두 가지 이유로 지저분하다.
- 캐스팅(형변환), 이 코드는 모든 `Expression`에 대해 작동해야 한다.
- 공용(public) 필드와 그 필드들에 대한 두 단께를 걸친 레퍼런스.

간단히 고칠 수 있는 문제들이다.

```java
// Bank - 추후 수정
Money reduce(Expression source, String to) {
  Sum sum = (Sum) source;
  return sum.reduce(to);
}

// Sum
public Money reduce(String to) {
  int amount = augend.amount + addend.amount;
  return new Money(amount, to);
}
```

막대가 초록색이고 위의 코드에 대해 더 할 것이 명확하지 않으니까 일단 그 테스트를 작성하도록 하자.

```java
public void testReduceMoney() {
  Bank bank = new Bank();
  Money result = bank.reduce(Money.dollar(1), "USD");
  assertEquals(Money.dollar(1), result);
}

// Bank
Money reduce(Expression source, String to) {
  if (source instanceof Money) return (Money) source;
  Sum sum = (Sum) source;
  return sum.reduce(to);
}
```

지저분하다, 지저분해. 그래도 초록 막대 상태이므로 리팩토링을 할 수 있다. 클래스를 명시적으로 검사하는 코드가 있을 때에는 항상 다형성을 사용하도록 바꾸는 것이 좋다. `Sum`은 `reduce(String)`를 구현하므로, `Money`도 그것을 구현하도록 만든다면 `reduce()`를 `Expression` 인터페이스에도 추가할 수 있게 된다.

```java
// Bank
Money reduce(Expression source, String to) {
  if (source instanceof Money)
    return (Money) source.reduce(to);
  Sum sum = (Sum) source;
  return sum.reduce(to);
}

// Money
public Money reduce(String to) {
  return this;
}
```

`Expression` 인터페이스에 `reduce(String)`를 추가하면,

```java
// Expression
Money reduce(String to);
```

지저분한 캐스팅과 클래스 검사 도구를 제거할 수 있다.

```java
// Bank
Money reduce(Expression source, String to) {
  return source.reduce(to);
}
```
