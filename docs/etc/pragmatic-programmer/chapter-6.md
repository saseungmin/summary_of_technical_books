---
sidebar_position: 7
---

# 🤔 Chapter 6: 동시성

동시성은 둘 이상의 코드 조각이 실행될 때 동시에 실행 중인 것처럼 행동하는 것이다. 그리고 병렬성이란 실제로 동시에 실행되는 것이다.   
동시성을 얻으려면 실행 중에 코드의 다른 부분으로 실행을 전환할 수 있는 환경에서 코드를 구동해야 한다. 보통은 파이버(fiber)나 스레드, 프로세스 등을 사용하여 동시성을 구현한다.   
병렬성을 얻으려면 두 가지 일을 동시에 할 수 있는 하드웨어가 필요하다.

### 🥕 모든 일에 동시성이 있다
시스템의 규모가 어느 정도를 넘어가면 동시성을 고려하지 않고 코드를 작성하기란 거의 불가능하다. 동시성을 겉으로 드러날 때도 있지만 라이브러리 안에 묻혀 있는 경우도 있다. 여러분의 애플리케이션이 실제 세상을 다루기 원한다면 동시성은 필수다. 세상은 비동기적이기 때문이다. 만약 순차적으로 하나를 끝낸 다음에 다음 일을 하는 식으로 수행한다면, 시스템은 거북이처럼 느리게 느껴질 것이고 프로그램을 구동하는 하드웨어의 성능도 최대로 활용하지 못할 것이다.   

## 🍭 Topic 33. 시간적 결합 깨트리기
소프트웨어 아키텍처에서 시간이라는 측면은 자주 무시된다. 우리가 신경쓰는 유일한 시간은 일정, 바로 출시까지 남은 시간뿐이다. 하지만 여기서 이야기할 것은 이런 종류의 시간이 아니다. 시간에는 우리가 신경 써야 할 측면이 두 가지 있는데, 동시성(동시에 일어나는 일들)과 순서(시간의 흐름 속에서 일들의 상대적인 위치)다.   

우리는 보통 프로그래밍할 때 두 측면 모두 특별히 신겨 쓰지 않는다. 메서드 A는 언제나 메서드 B보다 먼저 호출해야 한다. 보고서는 한 번에 오직 하나만 생성할 수 있다. 버튼 클릭을 처리하려면 먼저 화면이 갱신되어야 한다.   

이러한 접근 방법은 그다지 유연하지 않고 현실과도 동떨어져 있다.   
우리는 동시성을 확보해야 한다. 시간이나 순서에 의존하는 시간적 결합을 끊는 방법을 생각해 내야 한다. 그렇게 함으로써 유연성도 얻을 수 있고, 작업 흐름 분석과 아키텍처, 설계, 배포와 같은 개발의 여러 측면에서 시간과 관련된 의존성도 함께 줄일 수 있다. 결과적으로 분석하기 더 쉽고 응답속도도 더 빠르며 더 안정적인 시스템을 만들 수 있을 것이다.

### 🥕 동시성 찾기
우리는 동시에 **일어나도 되는** 게 뭐고, 반드시 순서대로 **일어나야 하는** 건 어떤 것인지 찾아내길 원한다. "활동 다이어그램" 같은 표기법을 사용해서 작업 흐름을 그록하는 것이 한 방법이다.

> **TIP 56. 작업 흐름 분석으로 동시성을 개선하라.**

활동 다이어그램을 사용하면 동시에 **수행할 수도 있는데도** 아직 동시에 하고 있지 않은 활동들을 찾아내서 병렬성을 극대화할 수 있다.

### 🥕 동시 작업의 기회
활동 다이어그램은 동시에 작업할 수 있는 부분들을 보여 준다. 하지만 진짜로 동시에 하는 것이 좋은지는 알려주지 않는다. 그래서 설계가 필요하다.   
우리는 시간이 걸리지만, 우리 코드가 아닌 곳에서 시간이 걸리는 활동을 찾고 싶다. 데이터베이스를 조회할 때나 외부 서비스에 접근할 때, 사용자 입력을 기다릴 때 같이 우리 프로그램이 다른 작업이 끝나기를 기다려야 하는 상황 말이다. 이런 순간이 바로 CPU가 손가락만 빨면서 기다리는 대신 좀 더 생산적인 일을 할 수 있는 기회다.

### 🥕 병렬 작업의 기회
컴퓨터 한 대에 있든 아니면 연결된 여러 대에 있든 우리에게 여러 개의 프로세서가 있다면, 그리고 작업을 프로세서들에게 나누어 줄 수 있다면 전체 소요 시간을 단축할 수 있다.   
이런 식으로 나누기에 가장 이상적인 것은 비교적 독립적인 부분 작업들이다. 다른 부분 작업을 기다릴 필요 없이 진행할 수 있으면 좋다. 일반적인 형태는 커다란 작업을 독립적인 부분들로 쪼개서 별렬로 각각 처리한 다음, 결과를 합치는 것이다.   

### 🥕 기회를 찾아 내는 것은 쉽다
여러분의 애플리케이션으로 돌아가자. 동시 작업이나 병렬 작업을 해서 이득을 볼 수 있는 부분을 찾았다. 이제 어려운 부분이 남았다. 어떻게 안전하게 구현할 수 있을까?

## 🍭 Topic 34. 공유 상태는 틀린 상태

여러분이 가장 좋아하는 레스토랑에 방문했다. 메인 요리를 모두 먹은 후 종업원에게 혹시 애플파이가 남아 있는지 묻는다. 종업원은 어꺠 넘어를 돌아보더니 진영장에 한 조각이 남아 있는 것을 확인하고는 그렇다고 대답한다. 여러분은 주문을 마치고 안도의 한숨을 내쉰다.   
한편 레스토랑의 반대쪽에서도 다른 고객이 종업원에게 같은 질문을 하고 있다. 이 종업원도 진열장을 쳐다보고는 한 조각이 있는 것을 확인하고 주문을 받는다. 두 고객 중 한 명은 실망하게 될 것이다.

> **Tip 57. 공유 상태는 틀린 상태다.**

문제는 상태가 공유된 것이다. 레스토랑의 종업원들은 서로를 고려하지 않고 진열장만 확인했다.

### 🥕 비-원자적 갱신

종업원1이 현재 파이 조각 수를 조회하고, 1을 얻는다. 그러고는 고객에게 파이를 약속한다. 하지만 이 시점에 종업원2도 작업을 시작한다. 역시 파이 조각 수를 조회하여 1을 얻고, 고객에게 똑같은 약속을 한다. 둘 중 하나가 마지막 남은 파이 조각을 획득하고, 다른 종업원은 일종의 예외 상태에 빠진다.   

여기서 문제는 두 프로세스가 같은 메모리 영역을 쓰기가 가능하다는 점이 아니다. 문제는 어느 프로세스도 자신이 보는 메모리가 일관되어 있음을 보장할 수 없다는 점이다. 이것은 모두 파이 조각을 가져오고 갱신하는 동안이 원자적이지 않기 떄문이다. 실제 값이 그사이에 바뀔 수 있다. 그렇다면 어떻게 원자적으로 바꿀 수 있을까?

#### 세마포어 및 다른 상호 배제 방법
세마포어는 단순히 한 번에 한 사람만이 가질 수 있는 **무언가**다. 여러분은 세마포어를 만들어서 다른 리소스의 사용을 제어하는 데 쓸 수 있다.   

레스토랑에서는 물리적인 세마포어로 파이 문제를 해결하기로 했다. 진열장 위에 도깨비 인형을 하나 올려 둔다. 모든 종업원은 파이 주문을 받기 전에 도깨비 인형을 손에 넣어야 한다. 주문을 받고 파이를 접시에 담아 고객에게 낸 후에는 도깨비 인형을 보물 파이를 지키는 원래 위치에 되돌려 놓는다. 다음 주문을 받을 수 있도록 말이다.

```ruby
case_semaphore.lock()

if display_case.pie_count > 0
  promise_pie_to_customer()
  display_case.take_pie()
  give_pie_to_customer()
end

case_semaphore.unlock()
```

두 종업원이 동시에 코드를 실행시켰다고 가정해 보자. 둘 다 세마포어를 얻으려고(lock) 시도하지만 한 명만 성공한다. 세마포어를 확보한 쪽은 평소처럼 계속 진행한다. 세마포어를 얻지 못한 쪽은 세마포어를 얻을 수 있을 때까지 멈춰 있는다. 즉, 기다린다. 첫 번째 종업원이 주문을 완료하고 세마포어의 잠금을 해제하면 다른 종업원이 실행을 재개한다.   

이 접근 방식에는 몇 가지 문제가 있다. 가장 큰 문제는 진영장에 접근하는 모든 사람이 빠짐없이 세마포어를 사용해야만 제대로 동작한다는 것이다. 만약 누군가가 깜빡한다면, 다시 말해서 어떤 개발자가 약속을 지키지 않는 코드를 쓴다면 다시 혼돈에 빠진다.

#### 리소스를 트랜잭션으로 관리하라
현재의 설계가 미흡한 것은 진열장 사용을 보호할 책임을 진열장을 사용하는 사람에게 전가하기 때문이다. 제어를 중앙으로 집중시키자. 그러려면 API를 바꿔서 종업원이 하나의 호출로 파이 조각 수를 확인함과 동시에 파이 조각을 가져가도록 만들어야 한다.   

```ruby
def get_pie_if_available()
  @case_semaphore.protect() {
    if @slices.size > 0
      update_sales_data(:pie)
      return @slices.shift
    else
      return false
    end
  }
end
```

### 🥕 트랜잭션이 없는 갱신
공유 메모리는 동시성 문제의 원인으로 많이 지목받는다. 하지만 사실 수정 가능한 리소스를 공유하는 애플리케이션 코드 **어디에서나** 동시성 문제가 발생할 수 있다. 여러분 코드의 인스턴스 둘 이상이 파일, 데이터베이스, 외부 서비스 등 어떤 리소스에 동시에 접근할 수 있다면 여러분은 잠재적인 문제를 안고 있는 것이다.   

> **Tip 58. 불규칙한 실패는 동시성 문제인 경우가 많다.**

### 🥕 그 밖의 독점적인 접근
대부분의 언어에는 공유 리소스에 독접적으로 접근하는 것을 도와주는 라이브러리가 있다. 상호 배제를 의미하는 뮤텍스라고 부르기도 하고, 모니터나 세마포어라고 부르기도 한다. 모두 라이브러리로 제공된다.   

언어 자체에 동시성 지원이 들어 있는 언어도 있다. 예를 들어 러스트는 데이터의 소유권이라는 개념을 강제한다. 변경 가능한 데이터 조각은 어느 한 시점에 단 하나의 변수나 매개 변수만 참조를 가질 수 있다.   

함수형 언어들은 모든 데이터를 변경 불가능하게 만드는 경향이 있으므로 동시성 문제를 단순하게 만든다고 주장할 수도 있겠다. 하지만 함수형 언어도 언젠가는 모든 것이 변경 가능한 진짜 세상에 발을 들여야 하므로 똑같은 문제를 겪는 순간이 올 것이다.

### 🥕 의사 선생님, 아파요.....
혹시 이번 항목에서 얻어 가는 것이 없다면 이것만은 기억하기를 바란다. 리소스를 공유하는 환경에서 동시성은 어렵다. 이문제를 직접 풀려고 한다면 고난의 연속일 것이다.   

그래서 다음 오래된 농담을 음미해보기를 추천하는 것이다.

> 의사 선생님, 이렇게 하면 아파요.   
> 그러면 그렇게 하지 마세요.

## 🍭 Topic 35 액터와 프로세스
액터와 프로세스를 사용하면 흥미로운 방식으로 동시성을 구현할 수 있다. 공유 메모리 접근을 동기화하느라 고생할 필요도 없다.   

- 액터는 자신만의 비공개 지역 상태를 가진 독립적인 가상 처리 장치다. 각 액터는 우편함을 하나씩 보유하고 있다. 액터가 잠자고 있을 때 우편함에 메시지가 도착하면 액터가 깨어나면서 메시지를 처리한다. 처리가 끝나면 우편함의 다른 메시지를 처리한다. 만약 우편함이 비어 있으면 다시 잠든다. 메시지를 처리할 때 액터는 다른 액터를 생성하거나, 알고 있는 다른 액터에게 메시지를 보내거나, 다음 메시지를 처리할 때의 상태가 될 새로운 상태를 생성할 수 있다.
- 프로세스는 본래 더 일반적인 가상 처리기로, 보통 운영 체제가 동시성을 지원하기 위하여 구현한다. 프로세스를 사용할 때 마치 액터처럼 동작하도록 관례를 만들어 제한적으로만 사용할 수도 있는데, 이번 항목에서 이야기하는 프로세스란 바로 이렇게 제한한 것을 말한다.

### 🥕 액터는 언제나 동시성을 띤다
액터의 정의에서 찾아볼 수 **없는** 것이 몇 가지 있다.

- 액터를 **관리하는 것**이 하나도 없다. 다음에 무엇을 하라고 계획을 세우거나, 정보를 입력 데이터에서 최종 결과로 바꾸는 과정을 **조율하는 것**이 없다.
- 시스템이 지정하는 상태는 **오직** 메시지 그리고 각 액터의 지역 상태뿐이다. 메시지는 수신자가 읽는 것 외에는 확인할 방법이 없고, 지역 상태는 액터 바깥에서는 접근이 불가능하다.
- 모든 메시지는 일방향이다. 답장이란 개념은 없다. 액터에서 답장을 받고 싶다면 처음 메시지를 보낼 때 답장 받을 우편함 주소를 메시지에 포함해서 보내야 한다. 나중에 이 주소로 보내는 답장도 결국 또 하나의 메시지일 뿐이다.
- 액터는 각 메시지를 끝날 때까지 처리하고 중간에 다른 일을 하지 않는다. 즉, 한 번에 하나의 메시지만 처리한다.

그 결과 액터들은 아무것도 공유하지 않으면서 비동기적으로 동시에 실행된다. 물리적인 프로세서가 넉넉하다면 각각 액터를 하나씩 돌릴 수 있다. 프로세서가 하나뿐이라면 실행 환경이 액터마다 컨텍스트를 전환해 가면서 실행시킬 수 있다. 어느 쪽이든 액터에서 실행되는 코드는 동일하다.

> **Tip 59. 공유 상태 없는 동시성을 위하여 액터를 사용하라.**

### 🥕 간단한 액터
예시는 책을 참고.

### 🥕 드러나지 않는 동시성
액터 모델에서는 동시성을 다루는 코드를 쓸 필요가 없다. 공유된 상태가 없기 때문이다. 명시적으로 처음부터 끝까지 "이걸 한 다음 저걸 하라"는 코드를 쓸 필요도 없다. 액터가 수신하는 메시지에 따라 알아서 실행되기 떄문이다.   

## 🍭 Topic 36. 칠판
칠판 접근 방법의 몇 가지 주요 특징은 다음과 같다.

- 형사들은 다른 형사의 존재를 알 필요가 없다. 형사들은 칠판을 보며 새로운 정보를 얻고, 자기가 발견한 것을 칠판에 덧붙인다.
- 형사들을 저마다 서로 다른 분야의 훈련을 받았거나, 다른 수준의 학력과 경험을 지녔을 수 있으며, 아예 같은 관할 구역에 속하지 않을 수도 있다. 사건을 해결하고 싶은 마음은 모두에게 있지만, 공통점은 그뿐이다.
- 수사 과정에서 여러 형사가 들어오거나 나갈 수 있고 임무 교대 시간도 제각기 다를 수 있다.
- 칠판에는 제한 없이 어떤 것이든 올릴 수 있다. 사진, 증언, 물리적 증거 등등.

일종의 "자유방임주의"적 동시성이다. 각 형사는 독립된 프로세스, 에이전트, 액터 등과 같다. 누군가는 칠판에 수집한 사실을 붙이고, 누군가는 떼어 낸다. 사실을 조합하거나 처리할 수도 있고 더 많은 정보를 덧붙일 수도 있다. 칠판은 사람들이 서서히 결론에 도달하도록 돕는다.   

### 🥕 칠판 사용 사례
주택 담보 대출이나 신용 대출 신청을 받아서 처리하는 프로그램을 작성한다고 가정해 보자. 이 분야를 관장하는 법은 정부, 금융위원회, 지방 자치 단체 모두 자신만의 규정이 있기 때문에 끔찍하게 복잡하다. 대출 기관은 자신이 몇몇 정보를 고지했다는 사실을 증명해야 하고, 어떤 정보를 달라고 요청해야 하는데, 어떤 질문을 하면 안 되는 등이다.   
준수해야 할 법이라는 골칫거리 외에도 우리가 씨름해야 할 문제들은 다음과 같다.

- 응답은 정해진 순서 없이 도착한다. 예를 들어 신용 조회나 명의 확인 요청은 상당한 시간이 걸리지만, 이름이나 주소는 바로 확인할 수 있다.
- 여러 표준 시간대에 걸쳐 있는 여러 사무실에 분산된 여러 사람이 데이터를 수집할 수도 있다.
- 어떤 데이터 수집은 다른 시스템이 자동으로 해주기도 한다. 그러나 이 데이터도 비동기적으로 도착할 수 있다는 점은 마찬가지다.
- 그런 데다가 어떤 데이터는 다른 데이터에 의존하기까지 한다.
- 새로운 데이터가 도착하면 새로운 질문을 하거나 새로운 정책을 적용해야 할 수도 있다.

칠판 시스템을 법적 요구 사항을 캡슐화하는 규칙 엔진과 함께 사용하면 이러한 어려움을 우아하게 해결할 수 있다. 데이터의 도착 순서는 이제 상관 없다. 어떤 사실이 칠판에 올라가면 적절한 규칙이 발동되도록 하면 된다. 결과에 대한 피드백도 마찬가지로 쉽게 다룰 수 있다. 어떤 규칙에서 나온 것이든 그 결과를 다시 칠판에 올려서 다른 규칙들이 발동되도록 하면 된다.

> **Tip 60. 칠판으로 작업 흐름을 조율하라.**

### 🥕 메시지 시스템과 칠판의 유사성
메시징 시스템을 칠판으로도 사용할 수 있고, 여러 액터를 실행하는 플랫폼으로도 사용할 수 있다는 것이다. 심지어 동시에 둘 모두를 사용할 수도 있다.

### 🥕 하지만 그렇게 간단하지 않다...
아키텍처에서 액터와 칠판, 마이크로서비스를 활용하면 애플리케이션에서 생길 수 있는 모든 종류의 동시성 문제를 예방할 수 있을 것이다. 하지만 거기에는 비용이 따른다. 이런 접근 방식을 사용하면 많은 동작이 간접적으로 일어나므로 분석이 더 힘들다. 메시지 형식 및 API를 모아두는 중앙 저장소를 운영하면 도움이 될 것이다. 이 저장소에서 코드나 문서까지 생성해 준다면 더욱 좋다. 시스템에서 처리하는 메시지나 정보를 추적할 수 있는 좋은 도구도 필요할 것이다. 유용한 기법을 하나 소개하겠다.   

특정한 비즈니스 작업 처리를 시작할 때 고유한 "추적 아이디"를 만들어서 붙이는 것이다. 그리고 해당 작업에 관여하는 모든 액터로 아이디를 전파하면, 나중에 로그 파일을 뒤져서 어떤 일이 일어났는지 재구성해 볼 수 있을 것이다.   
마지막으로 이런 종류의 시스템은 맞춰야 하는 구성 요소 수가 더 많기 때문에 배포하고 관리하기 더 까다롭다. 하지만 그 결과 시스템이 더 잘게 쪼개지고, 전체 시스템이 아니라 개별 액터만 교체하여 시스템을 업데이트할 수 있다는 면에서 어느 정도 보상 받는다.