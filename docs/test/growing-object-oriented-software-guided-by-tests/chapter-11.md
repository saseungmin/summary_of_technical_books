---
sidebar_position: 12
sidebar_label: 11. 첫 테스트 통과하기
---

# 🌈 Chapter 11: 첫 테스트 통과하기

## 📚 테스트 도구 구축
- 테스트 기반 구조에 사용될 두 개의 컴포넌트, 즉 `ApplicationRunner`와 `FakeAuctionServer`를 작성할 일이 남는다.

### 🎈 애플리케이션 러너
- `ApplicationRunner`는 현재 만들고 있는 스윙 애플리케이션과 관리 및 통신을 총괄하는 객체다. `ApplicationRunner`는 마치 명령줄에서 실행된 것처럼 애플리케이션을 실행하고 GUI 상태를 조회하고 테스트가 끝날 때 애플리케이션을 종료하기 위해 메인 창에 대한 참조를 획득해서 보관한다.
- 아래 테스트는 특정 문자열을 보여주는 레이블 컴포넌트를 찾는데 애플리케이션에서 이 레이블을 만들어내지 않는다면 예외가 발생할 것이다.

```java
public class ApplicationRunner {
  public static final String SNIPER_ID = "sniper";
  public static final String SNIPER_PASSWORD = "sniper";
  private AuctionSniperDriver driver;

  public void startBiddingIn(final FakeAuctionServer auction) {
    Thread thread = new Thread("Test Application") {
      // 코드의 각 부분을 올바르게 조합했는지 확인하고자 애플리케이션의 main 함수를 통해 애플리케이션을 호출
      @Override public void run() {
        try {
          // 한 품목에 대해서만 입찰하고 식별자를 main()으로 전달한다고 가정한다.
          Main.main(XMPP_HOSTNAME, SNIPER_ID, SNIPER_PASSWORD, auction.getItemId());
        } catch (Exception e) {
          // main()에서 예외를 던지면 여기서는 예외를 출력하기만 한다.
          e.printStackTrace();
        }
      }
    };

    thread.setDaemon(true);
    thread.start();
    // 프레임과 컴포넌트를 찾기 위해 제한 시간 주기를 줄였다.
    driver = new AuctionSniperDriver(1000);
    // 애플리케이션이 접속을 시도했는지 파악하고자 상태가 Joining으로 바뀔길 기다린다.
    // 이 단정은 사용자 인터페이스가 어딘가에 스나이퍼 상태를 표시하는 레이블이 있음을 말해준다.
    driver.showsSniperStatus(STATUS_JOINING);
  }

  public void showsSniperHasLostAuction() {
    // 스나이퍼가 경매에서 낙찰하지 못하면 Lost 상태를 보여줄 것으로 예상한다.
    driver.showsSniperStatus(STATUS_LOST);
  }

  public void stop() {
    if (driver != null) {
      // 테스트가 끝나면 드라이버가 창을 없애게 해서 가비지 컬렉션이 완료되기 전에 다른 테스트에서 창을 사용하는 것을 방지한다.
      driver.dispose();
    }
  }
}
```

### 🎈 가짜 경매
- `FakeAuctionServer`는 대체 서버로서, 테스트에서는 `FakeAuctionServer`를 이용해 경매 스나이퍼가 어떻게 XMPP 메시지를 사용해 경매와 상호 작용하는지 검사할 수 있다.
- `FakeAuctionServer`에는 세 가지 책임이 있다.
  1. XMPP 브로커에 접속해 스나이퍼와의 채팅에 참여하라는 요청을 수락해야 한다.
  2. 스나이퍼로부터 채팅 메시지를 받거나 특정 제한 시간 내에 아무런 메시지도 받지 못하면 실패해야 한다.
  3. 사우스비 온라인에서 명시한 대로 테스트에서 스나이퍼로 메시지를 되돌려 보낼 수 있게 해야 한다.

```java
public class FakeAuctionServer {
  // 상수 생략..
  private final String itemId;
  private final XMPPConnection connection;
  private Chat currentChat;

  public FakeAuctionServer(String itemId) {
    this.itemId = itemId;
    this.connection = new XMPPConnection(XMPP_HOSTNAME);
  }

  public void startSellingItem() throws XMPPException {
    // XMPP 브로커로 접속
    connection.connect();
    // 품목 식별자로 로그인 이름을 생성
    connection.login(format(ITEM_ID_AS_LOGIN, itemId), AUCTION_PASSWORD,AUCTION_RESOURCE);
    // 로그인 이름을 ChatManagerListener에 등록
    connection.getChatManager().addChatListener(
      new ChatManagerListener() {
        public void chatCreated(Chat chat, boolean createdLocally) {
          currentChat = chat;
        }
      }
    );
  }

  public String getItemId() {
    return itemId;
  }
}
```

- 메시지를 받으로면 `chat`에 `MessageListener`를 추가해야 한다.

```java
public class FakeAuctionServer {
  // ...
  private final SingleMessageListener messageListener = new SingleMessageListener();

  // ... 
  public void startSellingItem() throws XMPPException {
    // ...
    connection.getChatManager().addChatListener(
      new ChatManagerListener() {
        public void chatCreated(Chat chat, boolean createdLocally) {
          currentChat = chat;
          chat.addMessageListener(messageListener);
        }
      }
    );
  }
  // ...

  public void hasReceivedJoinRequestFromSniper() throws InterruptedException {
    // 테스트에서 Join 메시지가 언제 도착하는지 알 필요가 있다. (이 구현에서 5초 이내)
    messageListener.receivesAMessage();
  }

  public void announceClosed() throws XMPPException {
    // 테스트에서는 경매가 종료될 때 경매 종료 선언을 흉내 낼 수 있어야 한다.
    currentChat.sendMessage(new Message());
  }

  public void stop() {
    // 연결 닫기
    connection.disconnect();
  }
}
```

## 📚 테스트 실패와 통과

### 🎈 첫 사용자 인터페이스

#### 🐶 테스트 실패
- 테스트에서 `Auction Sniper Main`이라는 사용자 인터페이스 컴포넌트를 찾지 못한다.

#### 🐶 구현
- 예제 애플리케이션에는 최상위 윈도가 필요하다. 여기서는 윈도를 하나 만들고 적절한 이름만 부여한다.

```java
public class Main {
  private MainWindow ui;

  public Main() throws Exception {
    startUserInterface();
  }

  public static void main(String... args) throws Exception {
    Main main = new Main();
  }

  private void startUserInterface() throws Exception {
    SwingUtilities.invokeAndWait(new Runnable() {
      public void run() {
        ui = new MainWindow();
      }
    });
  }
}

public class MainWindow extends JFrame {
  public MainWindow() {
    super("Auction Sniper");
    setName(MAIN_WINDOW_NAME);
    setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    setVisible(true);
  }
}
```

#### 🐶 참고
- 현재 위 코드의 사용자 인터페이스는 최소화되어있다. 사용자 인터페이스는 별것 없지만 확실히 애플리케이션 윈도를 시작하고 거기에 연결할 수 있다. 테스트는 여전히 실패하지만 한걸음 내디딘 셈이다.
- 이제 테스트 설비가 동작한다는 사실을 알 수 있으며, 이로써 좀 더 흥미로운 기능을 구현하는 것으로 나아갈 때 걱정거리가 하나 줄어든 셈이다.

### 🎈 스나이퍼 상태 표시

#### 🐶 테스트 실패
- 테스트에서는 최상위 윈도를 찾았지만 스나이퍼의 현재 상태는 나타나 있지 않다.
- 우선 스나이퍼에서는 경매가 응답하길 기다리는 동안 Joining을 보여줘야 한다.

#### 🐶 구현
- `MainWindow`에 스나이퍼 상태를 추가하는 레이블을 추가한다.

```java
public class MainWindow extends JFrame {
  public static final String SNIPER_STATUS_NAME = "sniper status";
  private final JLabel sniperStatus = createLabel(STATUS_JOINING);

  public MainWindow() {
    super("Auction Sniper");
    setName(MAIN_WINDOW_NAME);
    add(sniperStatus);
    pack();
    setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    setVisible(true);
  }

  private static JLabel createLabel(String initialText) {
    JLabel result = new JLabel(initialText);
    result.setName(SNIPER_STATUS_NAME);
    result.setBorder(new LineBorder(Color.BLACK));
    return result;
  }
}
```

### 🎈 경매 연결

#### 🐶 테스트 실패
- 사용자 인터페이스는 동작하지만 경매에서는 스나이퍼로부터 Join 요청을 받지는 않는다.

#### 🐶 구현
- 구현에서는 `Main`에서 채팅에 연결해 빈 메시지를 보낸다. 아직까진 메시지를 받는 것에 신경 쓰지 않으므로 널 `MessageListener`를 작성해 최초의 빈 메시지를 보내기 위한 `Chat`을 작성한다.

```java
// 구현 생략.. (책 118p 참고)
```

### 🎈 경매로부터 응답받기

#### 🐶 테스트 실패
- 경매와 연결되면 스나이퍼는 경매로부터 Lost 응답을 받아 보여줘야 한다.

#### 🐶 구현
- 이제 사용자 인터페이스를 채팅에 추가해 경매에서 응답을 받을 수 있어야 한다.

## 📚 필요한 최소한의 것
- 전 구간에 걸친 시스템의 초기 구조를 설계하고 검증해(여기서 전 구간에 걸쳤다는 말은 동작하는 환경에 배포하는 것까지 포함한다) 패키지, 라이브러리, 도구 선택이 실제로 효과가 있을지 증명하는 데 있다.
- 긴박감은 팀이 가정을 테스트하는 데 절대적으로 필요한 최소한의 기능을 추려내는 데 도움이 될 것이다. 이러한 이유로 스나이퍼 메시지에 아무런 내용도 집어넣지 않은 것이다.
- 상세한 코드 설계로 너무 힘을 빼지도 않게되었다.
- 0 번째 반복 주기에서는 보통 팀에서 의사 결정을 이끄는 기준을 파악하면서 프로젝트 주요 안건을 제기하므로 프로젝트를 주관하는 곳에서는 프로젝트 목적에 관한 심층적인 문제들을 처리할 것으로 예상해야 한다.
