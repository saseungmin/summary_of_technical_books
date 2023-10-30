---
sidebar_position: 4
sidebar_label: 3. 모두를 위한 평등
---

# 🌈 Chapter 3: 모두를 위한 평등

지금 `Dollar` 객체같이 객체를 값처럼 쓸 수 있는데 이것을 값 객체 패턴(value object pattern)이라고 한다. 값 객체에 대한 제약사항 중 하나는 객체의 인스턴스 변수가 생성자를 통해서 일단 설정된 후에는 결코 변하지 않는다는 것이다.  
값 객체를 사용하면 별칭 문제에 대해 걱정할 필요가 없다는 아주 큰 장점이 있다. 값 객체가 암시하는 것 중 하나는 2장에서와 같이 모든 연산은 새 객체를 반환해야 한다는 것이다. 또다른 암시는 값 객체는 `equals()`를 구현해야 한다는 것이다.

만약 `Dollar`를 해시 테이블의 키로 쓸 생각이라면 `equals()`를 구현할 때에 `hashCode()`를 같이 구현해야 한다. 이것을 할일 목록에 적어 놓고 이것 때문에 문제가 생기면 그때 다루도록 하자.

```java
public void testEquality() {
  assertTrue(new Dollar(5).equals(new Dollar(5)));
}
```

빨간 막대다. 가짜로 구현하는 방법은 단순히 `true`를 반환하는 것이다.

```java
public boolean equals(Object object) {
  return true;
}
```

삼각측량을 하기 위해 두 번째 예제가 필요하다. `$5 != $6`을 해보는게 어떨까?

```java
public void testEquality() {
  assertTrue(new Dollar(5).equals(new Dollar(5)));
  assertTrue(new Dollar(5).equals(new Dollar(6)));
}
```

이제 동치성(equality)을 일반화해야 한다.

```java
public boolean equals(Object object) {
  Dollar dollar = (Dollar) object;
  return amount == dollar.amount;
}
```

내가 생각하기에 삼각측량은 조금 이상한 면이 있다. 그래서 나는 어떻게 리팩토링해야 하는지 전혀 감이 안 올 때만 삼각측량을 사용한다. 코드와 테스트 사이의 중복을 제거하고 일반적인 해법을 구할 방법이 보이면 그냥 그 방법대로 구현한다. 왜 한번에 끝낼 수 있는 일을 두고 또다른 테스트를 만들어야 하는가?

그러나 설계를 어떻게 할지 떠오르지 않을 때면, 삼각측량은 문제를 조금 다른 방향에서 생각해볼 기회를 제공한다. 지금 설계하는 프로그램이 어떤 변화 가능성을 지원해야 하는가? 몇몇 부분을 변경시켜보면 답이 좀더 명확해질 것이다.

자, 동일성 문제는 일시적으로 해결됐다. 하지만 널 값이나 다른 객체들과 비교한다면 어떻게 될까? 이런 상황은 일반적이긴 하지만, 지금 당장은 필요하지 않다. 따라서 할일 목록에 적어 두기만 하자.  
이제 동질성 기능을 구현했으므로 `Dollar`와 `Dollar`를 직접 비교할 수 있게 됐다.
