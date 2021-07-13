# 🌈 Chapter 1: 객체, 설계

## 📚 티켓 판매 애플리케이션 구현하기

> **조건**
> - 이벤트에 당첨된 관람객은 초대장을 티켓으로 교환한 후 입장가능
> - 당첨되지 않은 관람객은 티켓을 구매한 후 입장가능

- 다음은 이벤트 당첨자에게 발송되는 초대장 구현한다.

```java
public class Invitation { // 초대장
  private LocalDateTime when; // 초대 일자
}
```

- `Ticket` 클래스 추가

```java
public class Ticket {
  private Long fee;

  public Long getFee() {
    return fee;
  }
}
```

- 이벤트 당첨자는 티켓으로 교환할 수 있는 초대장, 이벤트에 당첨되지 않은 관람객은 현금을 보유하고 있을 것이다. (관람객이 가지고 올 수 있는 소지품은 초대장, 현금, 티켓이다.)
- 관람객이 소지품을 보관한 `Bag` 클래스를 추가한다.

```java
public class Bag {
  private Long amount; // 현금
  private Invitation invitation; // 초대장
  private Ticket ticket; // 티켓

  public boolean hasInvitation() { // 초대장 보유여부 확인
    return invitation != null;
  }

  public boolean hasTicket() { // 티켓 보유여부 확인
    return ticket != null;
  }

  public void setTicket(Ticket ticket) { // 초대장을 티켓으로 교환
    this.ticket = ticket;
  }

  public void minusAmount(Long amount) { // 현금 감소
    this.amount -= amount;
  }

  public void plusAmount(Long amount) { // 현금 증가
    this.amount += amount;
  }
}
```

- 이벤트에 당첨된 관람객은 현금과 초대장을 가지고 있지만 이벤트에 당첨되지 않은 관람객은 초대장이 없다.
- 따라서 `Bag` 인스턴스의 상태는 현금과 초대장을 함꼐 보관하거나, 현금만 보관하는 두 가지 중 하나이다. `Bag`의 인스턴스를 생성하는 시점에 이 제약을 강제할 수 있도록 생성자를 추가.

```java
public class Bag {
  public Bag (long amount) {// 현금만
    this(null, amount);
  }

  public Bag(Invitation invitation, long amount) { // 초대장과 현금
    this.invitation = invitation;
    this.amount = amount;
  }
}
```

- 다음은 관람객이라는 개념을 구현하는 `Audience` 클래스를 구현한다.

```java
public class Audience {
  private Bag bag;

  public Audience(Bag bag) {
    this.bag = bag;
  }

  public Bag getBag() { // 관람객은 가방을 소지할 수 있다.
    return bag;
  }
}
```

- 매표소에는 관람객에게 판매할 티켓과 티켓의 판매 금액이 보관돼 있어야 한다.
- 매표소를 구현하기 위해 `TicketOffice` 클래스를 추가한다.

```java
public class TicketOffice {
  private Long amount; // 판매 금액
  private List<Ticket> tickets = new ArrayList<>(); // 티켓의 목록

  public TicketOffice(Long amount, Ticket, ...tickets) {
    this.amount = amount;
    this.tickets.addAll(Arrays.asList(tickets));
  }

  public Ticket getTicket() {
    return tickets.remove(0); // 편의를 위해 tickets 컬렉션의 맨 첫 번째 위치에 저장된 티켓을 반환
  }

  public void minusAmount(Long amount) { // 판매 금액을 더한다.
    this.amount -= amount;
  }

  public void plusAmount(Long amount) { // 판매 금액을 차감
    this.amount += amount;
  }
}
```

- 판매원은 매표소에서 초대장을 티켓으로 교환해 주거나 티켓을 판매하는 역할을 한다.
- 판매원을 구현한 `TicketSeller` 클래스는 자신이 일하는 매표소(`ticketOffice`)를 알고 있어야 한다.

```java
public class TicketSeller {
  private TicketOffice ticketOffice;

  public TicketSeller(TicketOffice ticketOffice) {
    this.ticketOffice = ticketOffice;
  }

  public TicketOffice getTicketOffice() {
    return ticketOffice;
  }
}
```

- 마지막으로 소극장을 구현하는 `Theater` 클래스이다.

```java
public class Theater {
  private TicketSeller ticketSeller;

  public Theater(TicketSeller ticketSeller) {
    this.ticketSeller = ticketSeller;
  }

  public void enter(Audience audience) {
    if (audience.getBag().hasInvitation()) { // 초대장이 있으면
      Ticket ticket = ticketSeller.getTicketOffice().getTicket();
      audience.getBag().setTicket(ticket); // 판매원이 티켓을 준다.
    } else { // 초대장이 없으면
      Ticket ticket = ticketSeller.getTicketOffice().getTicket();
      audience.getBag().minusAmount(ticket.getFee()); // 관람객이 돈을 지불한다.
      ticketSeller.getTicketOffice().plusAmount(ticket.getFee()); // 판매원이 돈을 받는다.
      audience.getBag().setTicket(ticket); // 티켓을 준다.
    }
  }
}
```

- 몇 가지 문제점을 가지고 있다.

## 📚 무엇이 문제인가

### 🎈 예상을 빗나가는 코드
- 관람객과 판매원이 소극장의 통제를 받는 수동적인 존재라는 문제를 가지고 있다. (소극장은 관람객의 가방을 열어 초대장이 있는 지 확인한다.)
- 이해 가능한 코드란 그 동작이 야상에서 크게 벗어나지 않는 코드이지만 앞의 예제는 예상을 벗어난다.
- 위 예제 코드를 이해하기 위해서는 여러 가지 세부적인 내용들을 한꺼번에 기억하고 있어야 한다. (`Theater`의 `enter` 메서드를 이해하기 위해서는 `Audience`가 `Bag`을 가지고 있고, `Bag`안에 현금과 티켓, `TicketSeller`가 `TicketOffice`에서 티켓을 판매하는 등..) 하나의 클래스나 메서드에서 너무 많은 세부사항을 다루고 있기 때문에 코드를 읽고 이해해야 하는 사람에게 큰 부담이 된다.
- **가장 심각한 문제는 `Audience`와 `TicketSeller`를 변경할 경우 `Theater`도 함께 변경해야 한다는 점이다.**

### 🎈 변경에 취약한 코드
- 예를 들어 관람객이 가방을 들고 있다는 가정이 바뀌었다고 가정하면 `Audience` 클래스에서 `Bag`을 제거해야 할 뿐만 아니라 `Bag`에 직접 접근하는 `Theater`의 `enter` 메서드 역시 수정해야 한다.
- **지나치게 세부적인 사실에 의존해서 동작한다.** 이처럼 다른 클래스가 `Audience`의 내부에 대해 더 많이 알면 알수록 `Audience`를 변경하기 어려워진다.
- 이것은 객체 사이의 **의존성**(**dependency**)과 관련된 문제다. 의존성은 변경에 대한 영향을 암시한다. 
- 객체 사이의 의존성을 완전히 없애는 것이 정답은 아니다. **객체지향 설계는 서로 의존하면서 협력하는 객체들의 공동체를 구축하는 것이다.** 따라서 **애플리케이션의 기능을 구현하는 데 필요한 최소한의 의존성만 유지하고 불필요한 의존성을 제거하는 것이다.**
- 객체 사이의 의존성이 과한 경우를 가리켜 **결합도**(**coupling**)가 높다고 말한다. 결합도는 의존성과 관련돼 있기 때문에 결합도 역시 변경과 관련이 있다. 결합도가 높으면 함께 변경될 확률도 높아지기 떄문에 변경하기 어려워진다.
- 따라서 설계의 목표는 **객체 사이의 결합도를 낮춰 변경이 용이한 설계를 만드는 것이다.**

## 📚 설계 개선하기
- 예제 코드는 기능은 제대로 수행하지만 이해하기 어렵고 변경하기가 쉽지 않다.
- 코드를 이해하기 어려운 이유는 `Theater`가 관람객의 가방과 판매원의 매표소에 직접 접근하기 때문이다. 즉, 의도를 정확하게 소통하지 못하기 때문에 코드가 이해하기 어려워진 것이다.
- 해결 방법은 `Theater`가 `Audience`와 `TicketSeller`에 관해 너무 세세한 부분까지 알지 못하도록 정보를 차단하면 된다. `Theater`가 원하는 것은 관람객이 소극장에 입장하는 것뿐이다.
- 즉, 관람객과 판매원을 **자율적인 존재**로 만들면 된다.

### 🎈 자율성을 높이자
- 첫 번째 단계는 `Theater`의 `enter` 메서드에서 `TicketOffice`에 접근하는 모든 코드를 `TicketSeller` 내부로 숨기는 것이다. 
- `TicketSeller`에 `sellTo` 메서드를 추가하고 `Theater`에 있던 로직을 이 메서드에 옮긴다.

```java
public class TicketSeller {
  private TicketOffice ticketOffice;

  public TicketSeller(TicketOffice ticketOffice) {
    this.ticketOffice = ticketOffice;
  }

  public void sellTo(Audience audience) {
    if (audience.getBag().hasInvitation()) {
      Ticket ticket = ticketOffice.getTicket();
      audience.getBag().setTicket(ticket);
    } else {
      Ticket ticket = ticketOffice.getTicket();
      audience.getBag().minusAmount(ticket.getFee());
      ticketOffice.plusAmount(ticket.getFee());
      audience.getBag().setTicket(ticket);
    }
  }
}
```

- `ticketOffice`는 접근 가능한 퍼블릭 메서드가 더 이상 존재하지 않기 때문에 외부에서는 `ticketOffice`에 직접 접근할 수 없게 되었다. `TicketSeller`는 `ticketOffice`에서 티켓을 꺼내거나 판매 요금을 적립하는 일을 스스로 수행할 수밖에 없다.
- 이처럼 개념적이거나 물리적으로 객체 내부의 세부적인 사항을 감추는 것을 **캡슐화**(**encapsulation**)라고 부른다. 캡슐화의 목적은 변경하기 쉬운 객체를 만드는 것이다. **캡슐화를 통해 객체 내부로의 접근을 제한**하면 객체와 객체 사이의 결합도를 낮출 수 있기 때문에 설계에 좀 더 쉽게 변경할 수 있게 된다.
- 이제 `Theater`의 `enter` 메서드는 `sellTo`를 호출하는 간단한 코드로 바뀐다.

```java
public class Theater {
  private TicketSeller ticketSeller;

  public Theater(TicketSeller ticketSeller) {
    this.ticketSeller = ticketSeller;
  }

  public void enter(Audience audience) {
    ticketSeller.sellTo(audience);
  }
}
```

- 수정된 `Theater`클래스는 어디에서도 `ticketOffice`에 접근할 수 없게 되었다. `TicketSeller` 내부에 존재한다는 사실도 알지 못한다. 단지 `Theater`는 `ticketSeller`가 `sellTo` **메시지를 이해하고 응답할 수 있다는 사실만 알고 있을 뿐이다.**
- `Theater`는 오직 `TicketSeller`의 **인터페이스**에만 읜존한다. `TicketSeller`가 내부에 `TicketOffice` 인스턴스를 포함하고 있다는 사실은 **구현**의 영역에 속한다. 인터페이스만을 공개하는 것은 **객체 사이의 결합도를 낮추고 변경하기 쉬운 코드를 작성**하기 위해 따라야 하는 가장 기본적인 설계 원칙이다.
- 이제 `Audience`의 캡슐화를 개선한다. `TicketSeller`는 `Audience`의 `getBag` 메서드를 호출해서 `Audience`의 `Bag` 인스턴스에 직접 접근한다. 여전히 `TicketSeller`에 의존하고 있기 때문에 자율적인 존재가 아니다.
- `Audience`에 `buy` 메서드를 추가하고 `TicketSeller`의 `sellTo` 메서드에서 `getBag` 메서드에 접근하는 부분을 `buy` 메서드로 옮긴다.

```java
public class Audience {
  private Bag bag;

  public Audience(Bag bag) {
    this.bag = bag;
  }

  public Long buy(Ticket ticket) {
    if (bag.hasInvitation()) {
      bag.setTicket(ticket);
      return 0L;
    } else {
      bag.setTicket(ticket);
      bag.minusAmount(ticket.getFee());
      return ticket.getFee();
    }
  }
}
```

- 외부의 제 3자가 자신의 가방을 열어보도록 허용하지 않게 되었다. `Audience`가 `Bag`을 직접 처리한다. 외부에서 `Audience`가 `Bag`을 소유하고 있다는 사실을 알 필요가 없다.
- 이제 다음과 같이 `TicketSeller`가 `Audience`의 인터페이스만 의존하도록 수정하자.

```java
public class TicketSeller {
  private TicketOffice ticketOffice;

  public TicketSeller(TicketOffice ticketOffice) {
    this.ticketOffice = ticketOffice;
  }

  public void sellTo(Audience audience) {
    ticketOffice.plusAmount(audience.buy(ticketOffice.getTicket()));
  }
}
```
- 캡슐화 개선 후 크게 달라진 점은 `Audience`와 `TicketSeller`가 **내부 구현을 외부에 노출하지 않고 자신의 문제를 스스로 책임지고 해결한다는 것이다.** 즉, 자율적인 존재가 된 것이다.

### 🎈 캡슐화와 응집도
- 밀접하게 연관된 작업만을 수행하고 연관성 없는 작업은 다른 객체에 위임하는 객체를 가리켜 **응집도**(**cohesion**)가 높다고 말한다. 자신의 데이터를 스스로 처리하는 자율적인 객체를 만들면 결합도를 낮출 수 있을뿐더러 응집도를 높일 수 있다.
- **응집도를 높이기 위해서 객체 스스로 자신의 데이터를 책임져야 한다.**
- **외부의 간섭을 최대한 배제하고 메시지를 통해서만 협력하는** 자율적인 객체들의 공동체를 만드는 것이 훌륭한 객체지향을 설계를 얻을 수 있는 지름길인 것이다.

### 🎈 절차지향과 객체지향
- 수정하기 전 코드의 모든 처리는 `Theater`의 `enter` 메서드 안에 존재했었다. 이 관점에서 `enter` 메서드는 **프로세스**(**Process**)이며 `Audience`, `TicketSeller`, `Bag`, `TicketOffice`는 **데이터**이다. 이처럼 프로세스와 데이터를 별도의 모듈에 위치시키는 방식을 **절차적 프로그래밍**이라고 부른다.
- 절차적 프로그래밍은 수동적이고, 소극적인 존재이다. 또한, 예상을 너무나도 쉽게 벗어나기 때문에 원활하게 의사소통하지 못한다. 더 큰 문제는 데이터의 변경으로 인한 영향을 지역적으로 고립시키기 어렵다는 것이다.
- 변경하기 쉬운 설계는 한 번에 하나의 클래스만 변경할 수 있는 설계다.
- 수정 후 코드처럼 데이터와 프로세스가 동일한 모듈 내부에 위치하도록 프로그래밍하는 방식을 **객체지향 프로그래밍**이라고 부른다.
- 훌륭한 객체지향 설계의 핵심은 캡슐화를 이용해 의존성을 적절히 관리함으로써 객체 사이의 결합도를 낮추는 것이다.

### 🎈 책임의 이동
- 두 방식 사이에 근본적인 차이를 만드는 것은 **책임의 이동**이다.
- 수정전 코드인 절차적 프로그래밍 방식으로 작성된 코드는 주로 `Theater`에 의해 제어된다. 이 말은 즉, **책임이 `Theater`에 집중돼 있다는 것이다.**
- 그에 반해 객체지향 설계에서는 제어 흐름이 각 객체에 적절하게 분산돼 있다. 하나의 기능을완성하는 데 필요한 책임이 여러 객체에 걸쳐 분산돼 있다. 다시 말해 `Theater`에 몰려 있던 책임이 개별 객체로 이동한 것이다. 이것이 바로 **책임의 이동**이 의미하는 것이다. 각 **객체는 자신을 스스로 책임진다.**
- 객체지향 설계의 핵심은 적절한 객체에 대한 책임을 할당 하는 것이다. 따라서 객체가 어떤 데이터를 가지느냐보다는 **객체에 어떤 책임을 할당할 것이냐에 초점을 맞춰야 한다.**
- 설계를 어렵게 만드는 것은 **의존성**이다. 해결 방법은 의존성을 제거함으로써 객체 사이의 **결합도**를 낮추는 것이다. 예제에서 결합도를 낮추기 위해 내부로 감춰 **캡슐화**했다.
- 결과적으로 불필요한 세부사항을 객체 내부를 캡슐화하는 것은 객체의 **자율성**을 높이고 **응집도** 높은 객체들의 공동체를 창조할 수 있게 한다.

### 🎈 더 개선할 수 있다
- `Audience` 클래스는 자율적인 존재이지만 `Bag`은 `Audience`에 의해 끌려다니는 수동적인 존재다.
- `Bag`을 자율적인 존재로 바꿔본다.

```java
public class Bag {
  private Long amount;
  private Ticket ticket;
  private Invitation invitation;

  public Long hold(Ticket ticket) {
    if (hasInvitation()) {
      setTicket(ticket);
      return 0L;
    } else {
      setTicket(ticket);
      minusAmount(ticket.getFee());
      return ticket.getFee();
    }
  }

  private void setTicket(Ticket ticket) {
    this.ticket = ticket;
  }

  private boolean hasInvitation() {
    return invitation != null;
  }

  private void minusAmount(Long amount) {
    this.amount -= amount;
  }
}
```

- `public` 메서드였던 `hasInvitation`, `minusAmount`, `setTicket` 메서드들은 더 이상 외부에서 사용되지 않고 내부에서만 사용되기 때문에 가시성을 `private`으로 변경했다.
- 이제 `Audience`를 인터페이스에만 구현하도록 수정한다.

```java
public class Audience {
  private Bag bag;

  public Audience(Bag bag) {
    this.bag = bag;
  }

  public Long buy(Ticket ticket) {
    return bag.hold(ticket);
  }
}
```

- `TicketSeller`도 `TicketOffice`의 자율권을 침해한다.

```java
public class TicketOffice {
  private Long amount;
  private List<Ticket> tickets = new ArrayList<>();

  public TicketOffice(Long amount, Ticket, ...tickets) {
    this.amount = amount;
    this.tickets.addAll(Arrays.asList(tickets));
  }

  public void sellTicketTo(Audience audience) {
    plusAmount(audience.buy(getTicket())); // 의존성이 생김
  }

  private Ticket getTicket() {
    return tickets.remove(0);
  }

  private void plusAmount(Long amount) {
    this.amount += amount;
  }
}
```

- `TicketSeller`가 `TicketOffice`의 구현이 아닌 인터페이스에만 의존하게 돼었다.

```java
public class TicketSeller {
  private TicketOffice ticketOffice;

  public TicketSeller(TicketOffice ticketOffice) {
    this.ticketOffice = ticketOffice;
  }

  public void sellTo(Audience audience) {
    ticketOffice.sellTicketTo(audience);
  }
}
```

- 변경 후 살펴보면 `TicketOffice`에 `Audience`의 의존성이 추가되었다.
- `TicketOffice`의 자율서은 높였지만 전체 설계의 관점에서는 결합도가 상승했다. 어떻게 해야할까?
- 토론 끝에 개발팀은 `TicketOffice`의 자율성보다는 `Audience`에 대한 결합도를 낮추는 것이 더 중요하다는 결론에 도달했다.
- 여기서 알게된 사실 두가지는 어떤 기능을 설계하는 방법은 한 가지 이상일 수 있다. 둘째, 어떤 경우에도 모든 사람들을 만족시킬 수 있는 설계를 만들 수는 없다.

### 🎈 그래, 거짓말이다!
- 능동적이고 자율적인 존재로 소프트웨어 객체를 설계하는 원칙을 가리켜 **의인화**라고 부른다.
- 훌륭한 객체지향 설계란 **소프트웨어를 구성하는 모든 객체들이 자율적으로 행동하는 설계를 가리킨다.**
- 실세계에서는 수동적인 존재라고 하더라도 객체지향의 세계로 넘어오는 순간 생명과 지능을 가진 존재로 다시 태어난다.

## 📚 객체지향 설계

### 🎈 설계가 왜 필요한가

> 설계란 코드를 배치하는 것이다.

- 예제의 두 코드의 코드를 배치하는 방법은 완전히 다르다.
- 첫 번째 코드에서는 데이터와 프로세스를 나누어 별도의 클래스에 배치했지만 두 번째 코드에서는 필요한 데이터를 보유한 클래스 안에 프로세스를 함께 배치했다.
- **좋은 설계란 오늘 완성해야 하는 기능을 구현하는 코드를 짜는 동시에 내일 쉽게 변경할 수 있는 코드를 짜야 한다. 또한, 오늘 요구하는 기능을 온전히 수행하면서 내일의 변경을 매끄럽게 수용할 수 있는 설계다.**

### 🎈 객체지향 설계
- 변경에 유연하게 대응할 수 있는 코드다.
- 객체지향 프로그래밍은 의존성을 효율적으로 통제할 수 있는 다양한 방법을 제공함으로써 요구사항 변경에 좀 더 수월하게 대응할 수 있는 가능성을 보여준다.
- 객체지향 세계에서 애플리케이션은 **객체**들로 구성되며 애플리케이션의 기능은 객체들 간의 **상호작용**울 통해 구현된다. 그리고 객체들 사이의 상호작용은 객체 사이에 주고 받는 **메시지**로 표현된다.
- 훌륭한 객체지향 설계란 협력하는 객체 사이의 의존성을 적절하게 관리하는 설계다.
- 데이터와 프로세스를 하나의 덩어리로 모으는 것은 훌륭한 객체지향 설계로 가는 첫걸음이다.
- 진정한 객체지향 설계로 나아가는 길은 **협력하는 객체들 사이의 의존성을 적절하게 조절함으로써 변경에 용이한 설계를 만드는 것이다.**