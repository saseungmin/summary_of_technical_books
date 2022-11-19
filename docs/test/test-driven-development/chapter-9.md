---
sidebar_position: 10
sidebar_label: 9. 우리가 사는 시간
---

# 🌈 Chapter 9: 우리가 사는 시간
통화를 표현하기 위한 복잡한 객체들을 원할 수도 있다. 그리고 그 객체들이 필요한 만큼만 만들어지도록 하기 위해 경량 팩토리를 사용할 수 있을 것이다. 하지만 당분간은 그런 것들 대신 문자열을 쓰자.

```java
public void testCurrency() {
  assertEquals("USD", Money.dollar(1).currency());
  assertEquals("CHF", Money.franc(1).currency());
}
```

우선, `Money`에 `currency()` 메서드를 선언하자.

```java
abstract String currency();
```

그 다음 두 하위 클래스에서 이를 구현하자.

```java
// Franc
String currency() {
  return "CHF";
}

// Dollar
String currency() {
  return "USD";
}
```

우린 두 클래스를 모두 포함할 수 있는 동일한 구현을 원한다. 통화를 인스턴스 변수에 저장하고, 메서드에서는 그냥 그걸 반환하게 만들 수 있을 것 같다.

```java
// Franc
private String currency;
Franc(int amount) {
  this.amount = amount;
  currency = "CHF";
}
String currency() {
  return currency;
}
```

`Dollar`도 똑같이 변경하자.

```java
private String currency;
Dollar(int amount) {
  this.amount = amount;
  currency = "USD";
}
String currency() {
  return currency;
}
```

이제 두 `currency()`가 동일하므로 변수 선언과 `currency()` 구현을 둘 다 위로 올릴 수 있게 됐다.   

```java
// Money
protected String currency;
String currency() {
  return currency;
}
```

문자열 "USD"와 "CHF"를 정적 팩토리 메서드로 옮긴다면 두 생성자가 동일해질 것이고, 그렇다면 공통 구현을 만들 수 있을 것이다.   
우선 생성자에 인자를 추가하자.

```java
// Franc
Franc(int amount, String currency) {
  this.amount = amount;
  this.currency = "CHF";
}
```

생성자를 호출하는 코드 두 곳이 깨진다.

```java
// Money
static Money franc(int amount) {
  return new Franc(amount, null);
}

// Franc
Money times(int multiplier) {
  return Money.franc(amount * multiplier);
}
```

이제 팩토리 메서드가 "CHF"를 전달할 수 있다.

```java
// Money
static Money franc(int amount) {
  return new Franc(amount, "CHF");
}
```

그리고 마지막으로 인자를 인스턴스 변수에 할당할 수 있다.

```java
// Franc
Franc(int amount, String currency) {
  this.amount = amount;
  this.currency = currency;
}
```

내가 이런 작은 단계를 밟아가는 것에 대해서 다시금 방어적으로 되는 것 같다. 내가 여러분에게 정말 이런 식으로 일해야 한다고 주장하는 건가? 아니다. 나는 여러분이 이런 식으로도 일할 수도 있어야 한다고 말하는 것이다.   

```java
// Money
static Money dollar(int amount) {
  return new Dollar(amount, "USD");
}

// Dollar
Dollar(int amount, String currency) {
  this.amount = amount;
  this.currency = currency;
}
Money times(int multiplier) {
  return Money.dollar(amount * multiplier);
}
```

지금과 같은 일을 TDD를 하는 동안 계속 해주어야 하는 일종의 조율이다. 종종걸음으로 진행하는 것이 답답한가? 그러면 보폭을 조금 넓혀라. 성큼성큼 걷는 것이 불안한가? 그럼 보폭을 줄여라. TDD란 조종해 나가는 과정이다. 이쪽으로 조금, 저쪽으로 조금. 지금도, 그리고 앞으로도 정해진 올바른 보폭이라는 것은 존재하지 않는다.   

두 생성자가 이제 동일해졌다. 구현을 상위 클래스에 올리자.

```java
// Money
Money(int amount, String currency) {
  this.amount = amount;
  this.currency = currency;
}

// Franc
Franc(int amount, String currency) {
  super(amount, currency);
}

// Dollar
Dollar(int amount, String currency) {
  super(amount, currency);
}
```
