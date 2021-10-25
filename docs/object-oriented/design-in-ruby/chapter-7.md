---
sidebar_position: 8
---

# ✌️ Chapter 7: 모듈을 통한 역할 공유

## 📚 역할 이해하기
- 어떤 문제들은 이 문제를 해결하기 위해서가 아니라면 별로 연관이 없는 객체들이 공통의 행동을 공유하게 만든다. 이런 공통의 행동은 클래스와 아무런 상관이 없다. 이 행동은 객체가 수행하는 **역할**(**role**)이다.
- 역할을 사용하면 역할과 관련된 객체들 사이에 의존성이 생겨난다. 이 의존성은 우리가 어떤 디자인을 선택할지 고민할 때 꼭 고려해야 하는 것들이다.

### 🎈 역할 찾기
- 역할 수행자들이 행동을 공유해야 할 경우에는 공통의 코드를 단 한 곳에 정의되어 있고 오리 타입처럼 행동하고 주어진 역할을 수행하는 객체가 사용해야 한다.
- 여러 객체지향 언어들은 메서드의 묶음에 이름을 부여하고 관리할 수 있는 방법을 제공하는데 루비는 이런 믹스-인을 모듈이라고 한다. 메서드는 모듈 속에서 정의되고 어느 객체든 이 모듈을 추가할 수 있다.
- 객체가 모듈을 인클루드(include)하면 객체는 이 모듈이 정의하고 있는 메서드를 자동화된 위임을 통해 모두 사용할 수 있게 된다.
- 객체는 아래의 설명하는 내용에 부합하는 모든 메시지에 반응할 수 있다.
  1. 스스로가 구현하고 있는 메시지
  2. 상속 관계에서 자기보다 상위에 있는 모든 객체가 구현하고 있는 메시지
  3. 자기가 인클루드한 모든 모듈이 구현하고 있는 메시지
  4. 상속 관계에서 자기보다 상위에 있는 모든 객체가 인클루드하고 있는 모든 모듈이 구현하고 있는 메시지

### 🎈 책임 관리하기
- 아래는 안티패턴으로 `Schedule` 클래스의 인터페이스의 세 개의 메서드이다.

```ruby
scheduled?(target, starting, ending)
add(target, starting, ending)
remove(target, starting, ending)
```

- 위 메서드 모두 세 개의 인자를 가지고 있다.
- 여기서 `Schedule`은 클래스를 확인해서 **준비시간 값**을 얼마로 할당해야 하는지 알게된다. 이 모든 경우에서 `Schedule`은 너무 많은 것을 알고 있다.
- `Schedule`은 다른 클래스의 세부사항에 대해 모르는 채로 그저 메시지를 전송해야 한다.

### 🎈 불필요한 의존성 제거하기
- 특정 변수의 값을 무엇으로 할지 결정하기 위해 `Schedule`은 여러 클래스의 이름을 확인하고 있다.
- 이 사실은 특정 변수를 메시지로 바꾸어야 한다는 점을 알려준다. 입력 받은 객체에게 전송하는 메시지로 변경해야 한다.

#### 🐤 Schedulable 오리 타입 찾아내기
- 특정 클래스 이름을 명시하지 않고 메시지를 target에게 보내는 것으로 표현한다.
- `Schedule`은 `target`의 클래스에 전혀 관심이 없고 그저 `target`이 특정한 메시지에 반응할 수 있기를 바랄 뿐이다.
- 이러한 메시지 기반의 관점은 클래스 속으로 투과해 들어가서 그 속에 숨겨진 역할을 끄집어낸다.

#### 🐤 객체가 자기 스스로를 표현할 수 있게 하기
- 자기 자신의 행동은 자기 자신이 가지고 있어야 한다. (객체B에 대해 알고 싶을 때 꼭 객체A에 대해 알고 있는 건 문제가 있다.)
- 한가지 예로 문자열을 관리하는 유틸리티 메서드를 구현하고 있는 `StringUtils` 클래스에 주어진 문자열이 비어있는지 확인하고 싶으면 `StringUtils`에 `empty` 메서드를 전송해야 한다.
- 문자열의 행동을 얻기 위해 `StringUtils`라는 제삼자를 알고 있어야 한다는 것은 불필요한 의존성을 추가하는 것이다.

### 🎈 구체적인 코드 작성하기
- 두 가지를 결정해야 하는데 코드가 무엇을 해야 하는지, 그리고 코드를 어디에 두어야 하는지.
- 임의의 구체 클래스(예를 들어 `Bicycle`)을 하나 선택하고 여기에 `schedulable?` 메서드를 구현한다.
- 아래는 `Schedule`클래스이다.

```ruby
class Schedule
  def scheduled?(schedulable, start_date, end_date)
    puts "This #{schedulable.class}" +
        "is not scheduled\n" +
        "between #{start_date} and #{end_date}"
    false
  end
end
```

- 아래 코드는 `Bicycle`의 `schedulable?` 구현을 보여준다. `Bicycle`은 자신의 준비 시간(`lead time`)을 알고 있다. 그리고 `scheduled?` 메시지를 `Schedule`에게 전달한다.

```ruby title="Bicycle1.rb"
class Bicycle
  attr_reader :schedule, :size, :chain, :tire_size

  # Schedule을 주입하여 기본값을 제공한다.
  def initialize(args={})
    @schedule = args[:schedule] || Schedule.new
    # ...
  end

  # Bicycle의 준비시간이 감안해서, 주어진 기간에
  # bicycle을 사용할 수 있으면 true를 반환한다.
  def schedulable?(start_date, end_date)
    !scheduled?(start_date - lead_days, end_date)
  end

  # schedule의 답변을 반환한다.
  def scheduled?(start_date, end_date)
    schedule.scheduled?(self, start_date, end_date)
  end

  # bicycle을 사용하기 전에 필요한 준비시간의 일수를 반한한다.
  def lead_days
    1
  end

  # ...
end

require 'date'
starting = Date.parse("2015/09/04")
ending = Date.parse("2015/09/10")

b = Bicycle.new
b.schedulable?(starting, ending)
# ❯ ruby Bicycle1.rb
# This Bicycle is not scheduled
# between 2015-09-03 and 2015-09-10
```

- 위 코드는 `Schedule`이 누구인지, `Bicycle`안에서 어떤 일을 하는지를 밖으로 드러내지 않는다.
- `Bicycle`과 협업하는 객체는 더 이상 `Schedule`의 존재도 그 행동도 알 필요가 없다.

### 🎈 추상화하기
- `Bicycle`만 스케줄 가능성(`schedulable`)을 갖고 있으면 안 된다.
- `Mechanic`, `Vehicle`도 같은 역할을 수행하면 같은 행동을 갖고 있어야 한다.
- 이제 다른 클래스의 객체들도 이 코드를 공유할 수 있도록 코드를 재배치해야 한다.
- 아래의 새로운 `Schedulable` 모듈은 위의 `Bicycle` 클래스에서 공통행동을 뽑아내서 추상화한 것이다.

```ruby title="Schedulable.rb"
module Schedulable
  attr_writer :schedule

  def schedule
    @schedule ||= ::Schedule.new
  end

  def schedulable?(start_date, end_date)
    !scheduled?(start_date - lead_days, end_date)
  end

  def scheduled?(start_date, end_date)
    schedule.scheduled?(self, start_date, end_date)
  end

  # 이 모듈을 인클루드 하는 객체가 재정의할 수 있다.
  def lead_days
    0
  end
end
```

- 위 코드에서 `schedule` 메서드가 추가되었다. 이 메서드는 `Schedule`의 인스턴스를 반환한다.
- 이제 `Schedule`에 대한 의존성이 `Bicycle`에서 `Schedulable` 모듈로 옮겨짐으로 훨씬 더 고립되었다.
- 또 다른 변경은 `lead_days` 메서드에서 찾을 수 있는데 `Bicycle`이 구현했던 `lead_days`는 자전거에만 적용되는 숫자를 반환했지만 이 모듈은 보다 일반적인 기본값, 0을 반환한다.
- 아래 예시처럼 이 모듈을 `Bicycle` 클래스에 인클루드하면 메서드들의 목록에 모듈의 메서드들이 추가된다.
- `lead_days` 메서드는 템플릿 메서드 패턴을 따르는 훅 메서드이다. 재정의해서 자신만의 특수한 행동을 추가할 수 있다.

```ruby
class Bicycle
  include Schedulable

  def lead_days
    1
  end

  # ...
end

require 'date'
starting = Date.parse("2015/09/04")
ending = Date.parse("2015/09/10")

b = Bicycle.new
b.schedulable?(starting, ending)
```

- 이 모듈을 만들었기 때문에 다른 객체들도 이 모듈을 사용해서 `Schedulable`이 될 수 있게 되었고, 객체들은 중복 코드를 작성하지 않고도 이 역할을 수행할 수 있게 되었다.
- 메시지의 패턴은 `Bicycle`에게 `schedulable?`을 전송하는 것으로부터 `Schedulable`에게 `schedulable?`을 전송하는 것으로 바뀌었다.
- 다음은 `Vehicle`과 `Mechanic`에 `Schedulable` 모듈을 인클루드하여 `schedulable?` 메시지에 반응할 수 있도록 변경한 것이다.

```ruby title="IncludeBicycle.rb"
class Vehicle
  include Schedulable

  def lead_days
    3
  end

  # ...
end

class Mechanic
  include Schedulable

  def lead_days
    4
  end

  # ...
end
```

- `Schedulable` 속에 있는 코드는 추상화된 것이고 템플릿 메서드 패턴을 이용해서 객체들이 알고리즘에 자신만의 특수한 내용을 추가할 수 있도록 해주고 있다.
- 자동화된 메시지 전달에 기반하고 있다.

### 🎈 메서드를 찾아 올라가기

#### 🐤 아주 단순한 설명
- 객체가 이해하는 메서드를 그 객체의 클래스에 저장해 놓는다는 것은 이 클래스의 모든 인스턴스가 같은 메서드들의 묶음을 공유한다는 뜻이다. 이 메서드들은 단 한 곳에 정의되어 있으면 된다.
- 메서드를 찾는 과정은 메시지를 수신한 객체의 클래스에서 시작되는데 이 클래스가 메시지를 구현하고 있지 않다면 상위클래스를 찾아보고 연쇄를 타고 올라간다. 이 과정은 상속 괸계의 가장 위에 위치한 클래스에 이를 때까지 진행된다.
- 클래스 위계관계의 최상위에 위치한 Object에 이를 때까지 계속 올라가는데 모든 시도가 실패로 끝나면 탐색을 멈추지 않고 루비는 메시지를 수신했던 객체에게 `method_missing`이라는 새로운 메시지를 전송한다.

#### 🐤 조금 더 정확한 설명
- 모듈에서 정의된 메서드를 찾는 방법은 `Bicycle`이 `Schedulable` 모듈을 인클루드하면 이 모듈에서 정의된 모든 메서드들이 `Bicycle`이 반응할 수 있는 메시지 모듈에 추가된다.
- 모듈의 메서드들은 메서드 탐색 경로에서 `Bicycle`이 정의한 메서드들 바로 위에 자리잡는다.
- 만약 `Schedulable` 모듈이 이미 정의하고 있는 메서드를 `Bicycle`이 구현한다면 `Bicycle` 구현이 `Schedulable`의 것을 재정의하게 된다.

#### 🐤 거의 완벽한 설명
- 하나의 클래스가 여러 개의 모듈을 인클루드할 경우 모듈들은 인클루드된 순서와는 **반대로** 메서드 탐색 경로에 추가된다.
- 결국 가장 나중에 인클루드된 모듈이 메서드 탐색 경로에서는 가장 먼저 등장한다.
- 루비의 `extend` 키워드를 사용하면 모듈의 단일 객체에도 추가할 수 있다. `extend`는 모듈의 행동을 하나의 객체에 직접 추가한다.
- 마지막으로, 모든 객체는 자신만의 싱글톤 클래스에 즉석 메서드를 추가할 수 있다. 이 즉석 메서드는 메서드를 정의한 바로 그 객체만 사용할 수 있다.

## 📚 상속받을 수 있는 코드 작성하기

### 🎈 안티패턴 알아채기
- 작성하는 코드에 상속을 적용하면 좋은 것 같다고 말해주는 안티패턴이 두 개가 존재한다.
- 첫째, type이나 category와 같은 이름을 가진 변수가 있고 이 변수를 가지고 self에 어떤 메시지를 전송할지 결정하는 경우. 새로운 타입이 추가될 때마다 코드를 수정해야 한다.   
공통된 코드는 추상화된 상위클래스로 올리고 타입별로 각각 하위클래스를 만들 수 있다.
- 둘째, 객체의 클래스를 확인하고 어떤 메시지를 전송할지 판단하고 있다면 오리 타입을 놓치고 있다는 뜻이다. 오리 타입은 인터페이스를 공유할 뿐만 아니라 같은 행동을 공유하고 있을 수도 있다. 이럴 경우에는 공통된 코드를 모듈로 만들고 주어진 역할을 수행하는 클래스나 객체에 모듈을 인클루드하면 된다.

### 🎈 추상화된 코드를 모두 사용하기
- **추상화된 상위클래스에 포함된 모든 코드는 이 클래스를 상속받는 모든 하위클래스에도 적용될 수 있어야 한다.**
- 이 원칙은 모듈에도 적용될 수 있는데, 모듈에 포함되어 있는 코드는 이 모듈을 사용하는 모든 객체에게 적용되어야 한다.

### 🎈 약속을 존중하라
- 하위클래스는 자신의 인터페이스를 충실히 따르는 것이 우리의 기대대로 행동하는 것이다. 같은 종류의 입력에 대해 같은 종류의 출력을 내놓아야 한다.
- 하위클래스는 자신의 상위클래스를 대체할 수 있어야 한다.

> **리스코프 치환의 원칙**   
> 타입 시스템이 정상적으로 작동하려면 상위타입은 자신의 하위타입으로 치환될 수 있어야 한다.

### 🎈 템플릿 메서드 패턴 사용하기
- 이 패턴을 사용함으로 인해서 추상적인 것과 구체적인 것을 구분할 수 있다.
- 템플릿 메서드는 알고리즘의 변경되는 지점들을 표현하고, 이 템플릿 메서드를 만드는 것을 통해 우리는 어떤 내용이 변하는 것이며 어떤 것이 변하지 않는 내용인지 명시적으로 선택하게 된다.

### 🎈 한발 앞서 클래스 사이의 결합 깨뜨리기
- 상속받는 클래스가 `super`를 전송해야 하는 코드를 작성하지 말자.
- 대신 훅 메서드를 사용하여 하위클래스가 개입할 수 있는 여지를 제공하면서 하위클래스에게 추상적인 알고리즘에 대해 알아야 하는 책임을 지우지 않을 수 있다.
- 하지만 훅 메서드는 바로 옆 층위 객체와의 관계에서만 사용할 수 있다.

### 🎈 상속 관계(상속구조)를 낮게 만들기
- 객체는 자신보다 위에 있는 모든 것에 의존하고 있기 때문에 높은 상속 관계는 수많은 붙박이 의존성을 가지고 있는 셈이고 이 의존성은 모두 언제든 변경될 수 있다.
- 높은 상속 관계의 문제는 메시지 탐색 경로가 매우 길다는 점이고 메시지가 이 경로 따라갈 때 중간에 만나는 수많은 객체들이 새로운 행동을 추가할 수 있다는 점이다.
