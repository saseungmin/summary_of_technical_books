---
sidebar_position: 6
sidebar_label: 5. 목과 테스트 취약성
---

# 🐤 Chapter 5. 목과 테스트 취약성

## 🥕 목과 스텁 구분

### 🎈 테스트 대역 유형
테스트 대역은 모든 유형의 비운영용 가짜 의존성을 설명하는 포괄적인 용어다. 테스트 대역의 주 용도는 테스트를 편리하게 하는 것이다.   
테스트 대역은 목과 스텁의 두 가지 유형으로 나눌 수 있다.   

이 두 유형의 차이점은 다음과 같다.
- 목은 외부로 나가는 상호 작용을 모방하고 검사하는 데 도움이 된다. 이러한 상호 작용은 SUT가 상태를 변경하기 위한 의존성을 호출하는 것에 해당한다.
- 스텁은 내부로 들어오는 상호 작용을 모방하는 데 도움이 된다. 이러한 상호 작용은 SUT가 입력 데이터를 얻기 위한 의존성을 호출하는 것에 해당한다.

스파이는 목과 같은 역할을 한다. 스파이는 수동으로 작성하는 반면, 목은 목 프레임워크의 도움을 받아 생성된다.   
스텁, 더미, 페이크의 차이는 얼마나 똑똑한지에 잇다. 더미는 널 값이나 가짜 문자열과 같이 단순하고 하드코딩된 값이다. SUT의 메서드 시그니처를 만족시키기 위해 사용하고 최종 결과를 만드는 데 영향을 주지 않는다. 스텁은 더 정교하다. 시나리오마다 다른 값을 반환하게끔 구성할 수 있도록 필요한 것을 다 갖춘 완전한 의존성이다. 마지막으로 페이크는 대다수의 목적에 부합하는 스텁과 같다. 차이점은 생성에 있다. 페이크는 보통 아직 존재하지 않는 의존성을 대체하고자 구현한다.   

목과 스텁의 차이점에도 유의하라. 목은 SUT와 관련 의존성 간의 상호 작용을 모방하고 검사하는 반면, 스텁은 모방만 한다. 이는 중요한 차이점이다.

```cs title="목 라이브러리에서 Mock 클래스를 사용해 목을 생성"
[Fact]
public void Sending_a_greetings_email() {
  var mock = new Mock<IEmailGateway>();
  var sut = new Controller(mock.Object);

  sut.GreetUser("user@email.com");

  mock.Verify(
    x => x.SendGreetingsEmail("user@email.com"),
    Times.Once
  );
}
```

이 클래스는 테스트 대역(목)을 만들 수 있는 도구다. 도구로서의 목을 사용해 목과 스텁, 이 두가지 유형의 테스트 대역을 생성할 수 있기 때문에 도구로서의 목과 테스트 대역으로서 목을 혼동하지 않는 것이 중요하다.

```cs title="Mock 클래스를 사용해 스텁을 생성"
[Fact]
public void Creating_a_report() {
  var stub = new Mock<IDatabase>();
  stub.Setup(x => x.GetNumberOfUsers()).Returns(10);
  var sut = new Controller(stub.Object);

  Report report = sut.CreateReport();

  Assert.Equal(10, report.NumberOfUsers);
}
```

이 테스트 대역은 내부로 들어오는 상호 작용, 즉 SUT에 입력 데이터를 제공하는 호출을 모방한다. 반면 이전 예제에서 `SendGreetingsEmail`에 대한 호출은 외부로 나가는 상호 작용이고 그 목적은 부작용을 일으키는 것(이메일 발송)뿐이다.

### 🎈 스텁으로 상호 작용을 검증하지 말라
목과 스텁의 차이는 스텁과의 상호 작용을 검증하지 말라는 지침에서 비롯된다. SUT에서 스텁으로의 호출은 SUT가 생성하는 최종 결과가 아니다. 이러한 호출은 최종 결과를 산출하기 위한 수단일 뿐이다. 즉, 스텁은 SUT가 출력을 생성하도록 입력을 제공한다.   

4장에서 살펴봣듯이, 테스트에서 거짓 양성을 피하고 리팩터링 내성을 향상시키는 방법은 구현 세부 사항이 아니라 최종 결과를 검증하는 것뿐이다.   

```cs
mock.Verify(x => x.SendGreetingsEmail("user@email.com"));
```

위 예제의 위 구문은 실제 결과에 부합하며, 해당 결과는 도메인 전문가에게 의미가 있다.   

다음 예제는 깨지기 쉬운 테스트의 예에 해당한다.

```cs title="스텁으로 상호 작용 검증"
[Fact]
public void Creating_a_report() {
  var stub = new Mock<IDatabase>();
  stub.Setup(x => x.GetNumberOfUsers()).Returns(10);
  var sut = new Controller(stub.Object);

  Report report = sut.CreateReport();

  Assert.Equal(10, report.NumberOfUsers);
  // 스텁으로 상호 작용 검증
  stub.Verify(
    x => x.GetNumberOfUsers(),
    Times.Once
  );
}
```

최종 결과가 아닌 사항을 검증하는 이러한 관행은 과잉 명세라고 부른다.   
과잉 명세는 상호 작용을 검사할 때 가장 흔하게 발생한다. 스텁과의 상호 작용을 확인하는 것은 쉽게 발견할 수 있는 결함이다. 테스트와 스텁과의 상호 작용을 확인해서는 안 되기 때문이다. 목은 더 복잡하다. 목을 쓰면 무조건 테스트 취약성을 초래하는 것은 아니지만, 대다수가 그렇다.

### 🎈 목과 스텁 함께 쓰기
```cs title="목이자 스텁인 storeMock"
[Fact]
public void Purchase_fails_when_not_enough_inventory() {
  var storeMock = new Mock<IStore>();
  storeMock.Setup(x => x.HasEnoughInventory(Product.Shampoo, 5)).Returns(false);
  var sut = new Customer();

  bool success = sut.Purchase(
    storeMock.Object, Product.Shampoo, 5
  );

  Assert.False(success);
  storeMock.Verify(
    x => x.RemoveInventory(Product.Shampoo, 5),
    Times.Never
  );
}
```

이 테스트는 두 가지 목적으로 `storeMock`을 사용한다. 준비된 응답을 반환하고 SUT에서 수행한 메서드 호출을 검증한다. 그러나 이는 두 가지의 서로 다른 메서드다. 테스트는 `HasEnoughInventory()`에서 응답을 설정한 다음 `RemoveInventory()`에 대한 호출을 검증한다. 따라서 스텁과의 상호 작용을 검증하지 말라는 규칙을 여기서도 위배되지 않는다.   

테스트 대역은 목이면서 스텁이지만, 여전히 목이라고 부르지 스텁이라고 불리지는 않는다.

### 🎈 목과 스텁은 명령과 조회에 어떻게 관련돼 있는가?
목과 스텁의 개념은 명령 조회 분리(CQS) 원칙과 관련이 있다. CQS 원칙에 따르면 모든 메서드는 명령이나 조회여야 하며, 이 둘을 혼용해서는 안 된다. 명령은 부작용을 일으키고 어떤 값도 반환하지 않는 메서드다. 부작용의 예로 객체 상태 변경, 파일 시스템 내 파일 변경 등이 있다. 조회는 그 반대로, 부작용이 없고 값을 반환한다.   

이 원칙을 따르고자 할 경우, 메서드가 부작용을 일으키면 해당 메서드의 반환 타입이 `void`인지 확인하라. 그리고 메서드가 값을 반환하면 부작용이 없어야 한다. 다시 말해, 질문을 할 때 답이 달라져서는 안 된다.   

명령을 대체하는 테스트 대역은 목이다. 마찬가지로 조회릘 대체하는 테스트 대역은 스텁이다.

위 예제의 두 가지 테스트를 다시 살펴보자

```cs
var mock = new Mock<IEmailGateway>();
mock.Verify(x => x.SendGreetingsEmail("user@email.com"));

var stub = new Mock<IDatabase>();
stub.Setup(x => x.GetNumberOfUsers()).Returns(10);
```

`SendGreetingsEmail()`은 이메일을 보내는 부작용이 있는 명령이다. 이 명령을 대체하는 테스트 대역이 목이다. 반면 `GetNumberOfUsers()`는 값을 반환하고 데이터베이스 상태를 변경하지 않는 조회다. 해당 테스트의 ㄷ테스트 대역은 스텁이다.
