---
sidebar_position: 7
sidebar_label: 6. 돌아온 "모두를 위한 평등"
---

# 🌈 Chapter 6: 돌아온 "모두를 위한 평등"
실제로 새로운 테스트 케이스를 하나 작동하게 만들었다. 하지만 테스트를 빨리 통과하기 위해 몇 톤이나 되는 코드를 복사해서 붙이는 엄청난 죄를 저질렀다. 이제 청소할 시간이다.   

가능한 방법 한 가지는 우리가 만든 클래스 중 하나가 다른 클래스를 상속받게 하는 것이다. 내가 그렇게 해봤는데, 거의 어떤 코드도 구원하지 못했다. 대신, 두 클래스의 공통 상위 클래스를 찾아낼 생각이다.   
`Money`클래스가 공통의 `equals` 코드를 갖게 하면 어떨까? 간단한 것부터 시작해보자.

```java
class Money
```

모든 테스트는 여전히 돌아갈 것이다. 뭔가를 깨트렸을 것 같지는 않다. 어쨌건 테스트를 돌려보기 좋은 때다. `Dollar`가 `Money`를 상속받는다고 해도 여전히 어떤 것도 꺠지지 않는다.

```java
class Dollar extends Money {
  private int amount;
}
```

뭔가 깨졌나? 아니다. 테스트는 여전히 잘 돈다. 이제 `amount` 인스턴스 변수를 `Money`로 옮길 수 있다.

```java
class Money {
  protected int amount;
}

class Dollar extends Money {
}
```

하위 클래스에서도 변수를 볼 수 있도록 가시성을 `private`에서 `protected`로 변경했다.   
이제 `equals()` 코드를 위로 올리는 일을 할 수 있게 됐다. 우선 임시변수를 선언하는 부분을 변경하자.

```java
public boolean equals(Object object) {
  Money dollar = (Dollar) object;
  return amount == dollar.amount;
}
```

모든 테스트가 여전히 잘 돈다. 이제 캐스트(cast) 부분을 변경하자.

```java
public boolean equals(Object object) {
  Money dollar = (Money) object;
  return amount == dollar.amount;
}
```

좀더 원활한 의사소통을 위해 임시 변수의 이름을 변경하자.

```java
public boolean equals(Object object) {
  Money money = (Money) object;
  return amount == money.amount;
}
```

이제 이 메서드를 `Dollar`에서 `Money`로 옮길 수 있다.   

이제는 `Franc.equals()`를 제거해야 한다. 적절한 테스트를 갖지 못한 코드에서 TDD를 해야 하는 경우가 종종 있을 것이다. 충분한 테스트가 없다면 지원 테스트가 갖춰지지 않은 리팩토링을 만나게 될 수밖에 없다. 리팩토링하면서 실수했는데도 불구하고 테스트가 여전히 통과할 수도 있는 것이다. 어떻게 할 텐가?   

있으면 좋을 것 같은 테스트를 작성하라. 그렇게 하지 않으면 결국에는 리팩토링하다가 뭔가 깨트릴 것이다. 그러면 여러분은 리팩토링에 대해 안 좋은 느낌을 갖게 되고, 리팩토링을 덜 하게 된다. 리팩토링을 더 적게하면 설계의 질이 저하되고, 결국 여러분은 해고될 것이다. 리팩토링하기 전에 테스팅을 하자.   

다행히도 이번 테스트는 작성하기 쉽다. 그냥 `Dollar` 테스트를 복사하자.

```java
public void testEquality() {
  assertTrue(new Dollar(5).equals(new Dollar(5)));
  assertFalse(new Dollar(5).equals(new Dollar(6)));
  assertTrue(new Franc(5).equals(new Franc(5)));
  assertFalse(new Franc(5).equals(new Franc(6)));
}
```

또 중복이다. 두 줄이나 더! 이번에 저지른 죄에 대해서도 속죄하게 될 것이다.

```java
class Franc extends Money {
  private int amount;
}
```

`Money` 클래스에 있는 필드를 이용하면 `Franc`의 `amount` 필드를 제거할 수 있다.

```java
class Franc extends Money {
}
```

`Franc.equals()`는 `Money.equals()`와 거의 비슷해 보인다. 이 두 부분을 완전히 똑같이 만들 수 있다면 프로그램의 의미를 변화시키지 않고 `Franc`의 `equals()`를 지워버릴 수 있게 된다. 우선 임시 변수의 선언 부분을 고치자.

```java
public boolean equals(Object object) {
  Money franc = (Franc) object;
  return amount == franc.amount;
}
```

그 다음엔 캐스트 부분을 수정한다.

```java
public boolean equals(Object object) {
  Money franc = (Money) object;
  return amount == franc.amount;
}
```

임시 변수의 이름도 상위 클래스에 맞게 고쳐야 하는 걸까? 그건 여러분의 양심에 맡기겠다... 그래, 고쳐보자.

```java
public boolean equals(Object object) {
  Money money = (Money) object;
  return amount == money.amount;
}
```

이제 `Franc.equals()`와 `Money.equals()` 사이에 다른 점이 없으므로 `Franc`의 불필요한 코드를 제거하자. 그리고 테스트를 돌려보자. 잘 돌아간다.   
그런데 `Franc`과 `Dollar`를 비교하면 어떻게 될까? 이건 7장에서 다루도록 하자.
