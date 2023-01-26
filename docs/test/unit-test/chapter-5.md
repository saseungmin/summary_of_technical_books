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

## 🥕 식별할 수 있는 동작과 구현 세부 사항

### 🎈 식별할 수 있는 동작은 공개 API와 다르다
모든 제품 코드는 2차원으로 분류할 수 있다.
- 공개 API 또는 비공개 API
- 식별할 수 있는 동작 또는 구현 세부 사항

식별할 수 있는 동작과 내부 구현 세부 사항에는 미묘한 차이가 있다. 코드가 시스템의 식별할 수 있는 동작이라면 다음 중 하나를 해야 한다.
- 클라이언트가 목표를 달성하는 데 도움이 되는 연산을 노출하라. 연산은 계산을 수행하거나 부작용을 초래하거나 둘 다 하는 메서드다.
- 클라이언트가 목표를 달성하는 데 도움이 되는 상태를 노출하라. 상태는 시스템의 현재 상태다.

구현 세부 사항은 이 두 가지 중 아무것도 하지 않는다.   
코드가 식별할 수 있는 동작인지 여부는 해당 클라이언트가 누구인지, 그리고 해당 클라이언트의 목표가 무엇인지에 달려 있다. 식별할 수 있는 동작이 되려면 코드가 이러한 목표 중 하나에라도 직접적인 관계가 있어야 한다. 클라이언트라는 단어는 코드가 있는 위치에 따라 다른 것을 의미할 수 있다.   

이상적으로 시스템의 공개 API는 식별할 수 있는 동작과 일치해야 하며, 모든 구현 세부 사항은 클라이언트 눈에 보이지 않아야 한다. 이러한 시스템은 API 설계가 잘돼 있다.

### 🎈 구현 세부 사항 유출: 연산의 예
구현 세부 사항이 공개 API로 유출되는 코드의 에를 살펴보자.

```cs title="구현 세부 사항을 유출하는 User 클라스"
public class User {
  public string Name { get; set; }

  public string NormalizeName(string name) {
    string result = (name ?? "").Trim();

    if (result.length > 50)
      return result.Substring(0, 50);
    
    return result;
  }
}

public class UserController {
  public void RenameUser(int userId, string newName) {
    User user = GetUserFromDatabase(userId);

    string normalizedName = user.NormalizeName(newName);
    user.Name = normalizedName;

    SaveUserToDatabase(user);
  }
}
```

속성과 메서드가 둘 다 공개다. 따라서 클래스 API를 잘 설계하려면 해당 멤버가 식별할 수 있는 동작이 되게 해야 한다. 이를 위해서는 다음 두 가지 중 하나를 해야 한다.
- 클라이언트가 목표를 달성하는 데 도움이 되는 연산을 노출하라.
- 클라이언트가 목표를 달성하는 데 도움이 되는 상태를 노출하라.

`Name` 속성만 이 요구 사항을 충족한다. `NormalizeName` 메서드도 작업이지만, 클라이언트의 목표에 직결되지 않는다. `NormalizeName`은 클래스의 공개 API로 유출되는 구현 세부 사항이.

```cs title="API가 잘 설계된 User 클래스"
public class User {
  private string _name;
  public string Name {
    get => _name;
    set => _name = NormalizeName(value);
  }

  public string NormalizeName(string name) {
    string result = (name ?? "").Trim();

    if (result.Length > 50)
      return result.Substring(0, 50);

    return result;
  }
}

public class UserController {
  public void RenameUser(int userId, string newName) {
    User user = GetUserFromDatabase(userId);
    user.Name = newName;
    SaveUserToDatabase(user);
  }
}
```

식별할 수 있는 동작(`Name` 속성)만 공개돼있고, 구현 세부 사향(`NormalizeName` 메서드)은 비공개 API 뒤에 숨겨져 있다.   

클래스가 구현 세부 사항을 유출하는지 판단하는 데 도움이 되는 유용한 규칙이 있다. 단일한 목표를 달성하고자 클래스에서 호출해야 하는 연산의 수가 1보다 크면 해당 클래스에서 구현 세부 사항을 유출할 가능성이 있다. 이상적으로는 단일 연산으로 개별 목표를 달성해야 한다. 에를 들어 첫 예제인 `UserController`는 `User`의 두 가지 작업을 사용해야 했다.

```cs
string normalizedName = user.NormalizeName(newName);
user.Name = normalizedName; 
```

리팩터링 후에 연산 수가 1로 감소했다.

```cs
user.Name = newName;
```

### 🎈 잘 설계된 API와 캡슐화
구현 세부 사항을 노출하면 불변성 위반을 가져온다. 원래 버전의 `User`는 구현 세부 사항을 유출할 뿐만 아니라 캡슐화를 제대로 유지하지 못했다.   

계속해서 증가하는 코드 복잡도에 대처할 수 있는 방법은 실질적으로 캡슐화 말고는 없다. 코드 API가 해당 코드로 할 수 있는 것과 할 수 없는 것을 알려주지 않으면 코드가 변경됐을 때 모순이 생기지 않도록 많은 정보를 염두에 둬야 한다. 이렇게 하는 데 가장 좋은 방법은 캡슐화를 올바르게 유지해 코드베이스에서 잘못할 수 있는 옵션조차 제공하지 않도록 하는 것이다. 캡슐화는 궁극적으로 단위 테스트와 동일한 목표를 달성한다. 즉, 소프트웨어 프로젝트의 지속적인 성장을 가능하게 하는 것이다.   

- 구현 세부 사항을 숨기면 클라이언트의 시야에서 클래스 내부를 가릴 수 있기 때문에 내부를 손상시킬 위험이 적다.
- 데이터와 연산을 결합하면 해당 연산이 클래스의 불변성을 위반하지 않도록 할 수 있다.

### 🎈 구현 세부 사항 유출: 상태의 예
다음 예제는 4장에서 본 `MessageRenderer` 클래스가 있다.

```cs
public class MessageRenderer : IRenderer {
  public IReadOnlyList<IRenderer> SubRenderers { get; }
  public MessageRenderer() {
    SubRenderers = new List<IRenderer> {
      new HeaderRenderer(),
      new BodyRenderer(),
      new FooterRenderer(),
    };
  }

  public string Render(Message message) {
    return SubRenderers
      .Select(x => x.Render(message))
      .Aggregate("", (str1, str2) => str1 + str2);
  }
}
```

하위 렌더링 클래스 컬렉션이 공개다. 그러나 이 컬렉션이 식별할 수 있는 동작인가? 아니다. 클라이언트에게 필요한 클래스 멤버는 `Render` 메서드뿐이다. 따라서 `SubRenderers`는 구현 세부 사항 유출이다.   

이 테스트는 구현 세부 사항에 결합돼 있어 깨지기 쉽고 테스트 대상을 `Render` 메서드로 바꿔서 불안정성을 해소했다. 좋은 단위 테스트와 잘 설계된 API 사이에는 본질적인 관계가 있다. 모든 구현 세부 사항을 비공개로 하면 테스트가 식별할 수 있는 동작을 검증하는 것 외에는 다른 선택지가 없으며, 이로 인해 리팩터링 내성도 자동으로 좋아진다.

> API를 잘 설계하면 단위 테스트도 자동으로 좋아진다.

잘 설계된 API의 정의에서 비롯된 또 다른 지침으로, 연산과 상태를 최소한으로 노출해야 한다. 클라이언트가 목표를 달성하는 데 직접적으로 도움이 되는 코드만 공개해야 하며, 다른 모든 것은 구현 세부 사항이므로 비공개 API 뒤에 숨겨야 한다.   

||식별할 수 있는 동작|구현 세부 사항|
|---:|---:|---:|
|**공개**|좋음|나쁨|
|**비공개**|해당 없음|좋음|

## 🥕 목과 테스트 취약성 간의 관계

### 🎈 육각형 아키텍처 정의
애플리켕션 서비스 계층은 도메인 계층 위에 있으며 외부 환경과의 통신을 조정한다. 이 계층은 도메인 클래스와 프로세스 외부 의존성 간의 작업을 조정한다. 다음은 애플리케이션 서비스에 대한 조정의 예따.
- 데이터베이스를 조회하고 해당 데이터로 도메인 클래스 인스턴스 구체화
- 해당 인스턴스에 연산 호출
- 결과를 데이터베이스에 다시 저장

애플리케이션 서비스 계층과 도메인 계층의 조합은 육각형을 형성하며, 이 육각형은 애플리케이션을 나타낸다. 또한 다른 애플리케이션과 소통할 수 있고, 다른 애플리케이션도 육각형을 나타낸다. 육각형 아키텍처의 목적은 세 가지 중요한 지침을 강조하는 것이다.
- 도메인 계층과 애플리케이션 서비스 계층 간의 관심사 분리
- 애플리케이션 내부 통신: 육각형 아키텍처는 애플리케이션 버시스 계층에서 도메인 계층으로 흐르는 단방향 의존성 흐름을 규정한다. 애플리케이션 서비스 계층과 도메인 계층 간에 관심사를 분리하는 것은 애플리케이션 서비스 계층이 도메인 계층에 대해 아는 것을 의미하지만, 반대는 아니다. 도메인 계층은 외부 환경에서 완전히 격리돼야 한다.
- 애플리케이션 간의 통신: 외부 애플리케이션은 애플리케이션 서비스 계층에 있는 공통 인터페이스를 통해 해당 애플리케이션에 연결된다. 아무도 도메인 계층에 직접 접근할 수 없다. 육각형의 각 면은 애플리케이션 내외부 연결을 나타낸다.

식별할 수 있는 동작은 바깥 계층에서 안쪽으로 흐른다. 외부 클라이언트에게 중요한 목표는 개별 도메인 클래스에서 달성한 하위 목표로 변환된다. 도메인 클래스의 경우 클라이언트는 애플리케이션 서비스에 해당하고, 애플리케이션 서비스면 외부 클라이언트에 해당한다.

### 🎈 시스템 내부 통신과 시스템 간 통신
일반적인 애플리케이션에는 시스템 내부 통신과 시스템 간 통신이 있다. 시스템 내부 통신은 애플리케이션 내 클래스 간의 통신이다. 시스템 간 통신은 애플리케이션이 다른 애플리케이션과 통신하는 것을 말한다.

> 시스템 내부 통신은 구현 세부 사항이고, 시스템 간 통신은 그렇지 않다.

시스템 간 통신의 특성은 별도 애플리케이션과 함께 성장하는 방식에서 비롯된다. 성장의 주요 원칙 중 하나로 하위 호환성을 지키는 것이다. 시스템 내부에서 하는 리팩터링과 다르게, 외부 애플리케이션과 통신할 때 사용하는 통신 패턴은 항상 외부 애플리케이션이 이해할 수 있도록 유지해야 한다.   

목을 사용하면 시스템과 외부 애플리케이션 간의 통신 패턴을 확인할 때 좋다. 반대로 시스템 내 클래스 간의 통신을 검증하는 데 사용하면 테스트 구현 세부 사항과 결합되며, 그에 따라 리팩터링 내성 지표가 미흡해진다.

### 🎈 시스템 내부 통신과 시스템 간 통신의 예
`CustomerController` 클래스는 도메인 클래스와 외부 애플리케이션 간의 작업을 조정하는 애플리케이션 서비스다.

```cs title="외부 애플리케이션과 도메인 모델 연결하기"
public class CustomerController {
  public bool Purchase(int customerId, int productId, int quantity) {
    Customer customer = _customerRepository.GetById(customerId);
    Product product = _productRepository.GetById(productId);

    bool isSuccess = customer.Purchase(
      _mainStore, product, quantity
    );

    if (isSuccess) {
      _emailGateway.SendReceipt(
        customer.Email, product.Name, quantity
      );
    }

    return isSuccess;
  }
}
```

구매라는 동작은 시스템 내부 통신과 시스템 간 통신이 모두 있는 비즈니스 유스케이스다. 시스템 간 통신은 `CustomerController` 애플리케이션 서비스와 두 개의 외부 시스템인 서드파티 애플리케이션과 이메일 게이트웨이 간의 통신이다. 시스템 내부 통신은 `Customer`와 `Store` 도메인 클래스 간의 통신이다.   

다음 예제는 목을 사용하는 타당한 예를 보여준다.

```cs title="취약한 테스트로 이어지지 않는 목 사용"
[Fact]
public void Successful_purchase() {
  var mock = new Mock<IEmailGateway>();
  var sut = new CustomerController(mock.Object);

  bool isSuccess = sut.Purchase(
    customerId: 1, productId: 2, quantity: 5
  );

  Assert.True(isSuccess);
  mock.Verify(
    x => x.SendReceipt(
      "customer@email.com", "Shampoo", 5
    ), Times.Once
  );
}
```

`isSuccess` 플래그는 외부 클라이언트에서도 확인할 수 있으며, 검증도 필요하다. 하지만 이 플래그는 목이 필요 없고, 간단한 값 비교만으로 충분하다.   

이제 `Customer` 클래스와 `Store` 클래스 간의 통신에 목을 사용한 테스트를 살펴보자.

```cs title="취약한 테스트로 이어지는 목 사용"
[Fact]
public void Purchase_succeeds_when_enough_inventory() {
  var storeMock = new Mock<IStore>();
  storeMock
    .Setup(x => x.HasEnoughInventory(Product.Shampoo, 5))
    .Returns(true);
  var customer = new Customer();

  bool success = customer.Purchase(
    storeMock.Object, Product.Shampoo, 5
  );

  Assert.True(success);
  storeMock.Verify(
    x => x.RemoveInventory(Product.Shampoo, 5),
    Times,Once
  );
}
```

`Customer` 클래스에서 `Store` 클래스로의 메서드 호출은 애플리케이션 경계를 넘지 않는다. 호출자와 수신자 모두 애플리케이션 내에 있다. 또한 이 메서드는 클라이언트가 목표를 달성하는 데 도움이 되는 연산이나 상태가 아니다. 이 두 도메인 클래스의 클라이언트는 구매를 목표로 하는 `CustomerController`다. 이 목표에 직접적인 관련이 있는 멤버는 `customer.Purchase()`와 `store.GetInventory()` 이렇게 둘뿐이다.
