---
sidebar_position: 15
sidebar_label: 14. 바꾸기
---

# 🌈 Chapter 14: 바꾸기
2프랑이 있는데 이걸 달러로 바꾸고 싶다.

```java
public void testReduceMoneyDifferentCurrency() {
  Bank bank = new Bank();
  bank.addRate("CHF", "USD", 2);
  Money result = bank.reduce(Money.franc(2), "USD");
  assertEquals(Money.dollar(1), result);
}
```

나는 프랑을 달러로 변환할 때 나누기 2를 한다. 다음 한 줌의 지저분한 코드면 초촉 막대를 볼 수 있다.

```java
// Money
public Money reduce(String to) {
  int rate = (currency.equals("CHF") && to.equals("USD")) ? 2 : 1;
  return new Money(amount / rate, to);
}
```

횐율에 대한 일은 모두 `Bank`가 처리해야 한다. `Expression.reduce()`의 인자로 `Bank`를 넘겨야 할 것이다. 우선 호출하는 부분을 작성하자.

```java
// Bank
Money reduce(Expression source, String to) {
  return source.reduce(this, to);
}
```

그리고 구현 부분.

```java
// Expression
Money reduce(Bank bank, String to);

// Sum
public Money reduce(Bank bank, String to) {
  int amount = augend.amount + addend.amount;
  return new Money(amount, to);
}

// Money
public Money reduce(Bank bank, String to) {
  int rate = (currency.equals("CHF") && to.equals("USD")) ? 2 : 1;
  return new Money(amount / rate, to);
}
```

인터페이스에 선언된 메서드는 공용이어야 하므로 `Money`의 `reduce()`도 공용이어야 한다. 이제 횐율을 `Bank`에서 계산할 수 있게 됐다.

```java
// Bank
int rate(String from, String to) {
  return (from.equals("CHF") && to.equals("USD")) ? 2 : 1;
}
```

그리고 올바른 환율을 `bank`에게 물어보자.

```java
// Money
public Money reduce(Bank bank, String to) {
  int rate = bank.rate(currency, to);
  return new Money(amount / rate, to);
}
```

귀찮은 2가 아직도 테스트와 코드 두 부분에 모두 나온다. 이걸 없애버리려면 `Bank`에서 환율표를 가지고 있다가 필요할 때 찾아볼 수 있게 해야한다. 키를 위한 객체를 따로 만들어야겠다.

```java
// Pair
private class Pair {
  private String from;
  private String to;

  Pair(String from, String to) {
    this.from = from;
    this.to = to;
  }

  public boolean equals(Object object) {
    Pair pair = (Pair) object;
    return from.equals(pair.from) && to.equals(pair.to);
  }

  public int hashCode() {
    return 0;
  }
}
```

0은 최악의 해시 코드다. 하지만 구현하기 쉽고 우리가 빨리 달릴 수 있도록 도와준다는 장점이 있다. 해시 코드를 이대로 둔다면 해시 테이블에서의 검색이 마치 선형 검색과 비슷하게 수행될 것이다. 나중에 많은 통화를 다뤄야 할 일이 생기면 그때 실제 측정 데이터를 가지고 개선하게 될 것이다. 일단, 환율을 저장할 뭔가가 필요하다.

```java
// Bank
private Hashtable rates = new Hashtable();
```

환율을 성정할 수도 있어야 한다.

```java
// Bank
void addRate(String from, String to, int rate) {
  rates.put(new Pair(from, to), new Integer(rate));
}
```

그리고 필요할 때 환율을 얻어낼 수도 있어야 한다.

```java
// Bank
int rate(String from, String to) {
  Integer rate = (Integer) rates.get(new Pair(from, to));
  return rate.intValue();
}
```

잠깐! 빨간 막대다. 무슨 일일까? 여기저기 조금 기웃거려 보면, USD에서 USD로의 환율을 요청하면 그 값이 1이 되어야 한다고 기대한다는 것을 알 수 있다. 뜻밖의 일이므로, 좀 전에 우리가 발견한 내용을 나중에 코드를 읽어볼 다른 사람들에게도 알려 주기 위해 테스트로 만들어 두자.

```java
public void testIdentityRate() {
  assertEquals(1, new Bank().rate("USD", "USD"));
}
```

이제 에러가 총 두 개다. 하지만 한 곳만 바꿔 주면 두 개가 모두 없어질 것임을 알 수 있다.

```java
// Bank
int rate(String from, String to) {
  if (from.equals(to)) return 1;
  Integer rate = (Integer) rates.get(new Pair(from, to));
  return rate.intValue();
}
```

초록 막대!
