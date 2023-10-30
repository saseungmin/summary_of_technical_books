---
sidebar_position: 5
sidebar_label: 4. 프라이버시
---

# 🌈 Chapter 4: 프라이버시

```java
public void testMultiplication() {
  Dollar five = new Dollar(5);
  Dollar product = five.times(2);
  assertEquals(10, product.amount);
  product = five.times(3);
  assertEquals(15, product.amount);
}
```

첫 번째 단언을 `Dollar`와 `Dollar`를 비교하는 것으로 재작성할 수 있다.

```java
public void testMultiplication() {
  Dollar five = new Dollar(5);
  Dollar product = five.times(2);
  assertEquals(new Dollar(10), product);
  product = five.times(3);
  assertEquals(15, product.amount);
}
```

이게 더 좋아보이므로 두 번째 단언도 마찬가지로 고쳐보자.

```java
public void testMultiplication() {
  Dollar five = new Dollar(5);
  Dollar product = five.times(2);
  assertEquals(new Dollar(10), product);
  product = five.times(3);
  assertEquals(new Dollar(15), product);
}
```

이제 임시 변수인 `product`는 더 이상 쓸모없어 보인다. 인라인시켜보자.

```java
public void testMultiplication() {
  Dollar five = new Dollar(5);
  assertEquals(new Dollar(10), five.times(2));
  assertEquals(new Dollar(15), five.times(3));
}
```

이 테스트는 일련의 오퍼레이션이 아니라 참인 명제에 대한 단언들이므로 우리의 의도를 더 명확하게 이야기해준다.   

테스트를 고치고 나닌 이제 `Dollar`의 `amount` 인스턴스 변수를 사용하는 코드는 `Dollar` 자신밖에 없게 됐다. 따라서 변수를 `private`으로 변경할 수 있다.

```java
private int amount;
```

이제 할일 목록의 또 다른 항목을 지울 수 있게 됐다. 하지만 위험한 상황을 만들었다는 점에 주목하라. 만약 동치성 테스트가 동치성에 대한 코드가 정확히 작동한다는 것을 검증하는 데 실패한다면, 곱하기 테스트 역시 곱하기에 대한 코드가 정확하게 작동하는 데 실패한다면, 곱하기 테스트 역시 곱하기에 대한 코드가 정확하게 작동한다는 것을 검증하는 데 실패하게 된다. 이것은 TDD를 적극적으로 관리해야 할 위험 요소다. 우리는 완벽함을 위해 노력하지는 않는다. 모든 것을 두 번 말함으로써(코드와 테스트로 한 번씨) 자신감을 가지고 전진할 수 있을 만큼만 결함의 정도를 낮추기를 희망할 뿐이다. 떄때로 우리의 추론이 맞지 않아서 결함이 손가락 사이로 빠져나가는 수가 있다. 그럴 때면 테스트를 어떻게 작성해야 했는지에 대한 교훈을 얻고 다시 앞으로 나아간다. 그 이후에는 용감하게 펄럭이는 초록 막대 아래서 대담하게 앞으로 나아갈 수 있다.
