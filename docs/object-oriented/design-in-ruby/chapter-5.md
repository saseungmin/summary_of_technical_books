---
sidebar_position: 6
---

# ✌️ Chapter 5: 오리 타입으로 비용 줄이기

- **오리 타입**(**duck typing**)은 특정 클래스에 종속되지 않은 퍼블릭 인터페이스이다.
- 여러 클래스를 가로지르는 이런 인터페이스는 클래스에 대한 의존을 유연하게 만들어 준다.

## 📚 오리 타입 이해하기
- 애플리케이션은 특정 클래스에 종속되지 않은 퍼블릭 인터페이스를 정의할 수 있다.
- 객체를 사용하는 사람은 모든 객체가 자신이 구현하고 있는 어떤 인터페이스 또는 모든 인터페이스에 맞춰 행동하리라 믿어도 된다. 진짜 중요한 것은 객체가 **무엇**인가가 아니라 어떻게 **행동**하는가이다.

### 🎈 오리 타입 무시하기
- `Trip`의 `prepare` 메서드는 자신이 인자로 받은 `mechanic` 객체에게 `prepare_bicycles` 메시지를 전송한다.
- `Mechanic` 클래스를 참조하는 객체가 없다.
```ruby
class Trip
  attr_reader :bicycles, :customers, :vehicle

  # 무엇이든 이 mechanic 인자의 클래스가 될 수 있다.
  def prepare(mechanic)
    mechanic.prepare_bicycles(bicycles)
  end

  # ...
end

# 우연히 아래 클래스의 인스턴스를 넘겨준다면, 제대로 작동할 것이다.
class Mechanic
  def prepare_bicycles(bicycles)
    bicycles.each {|bicycle| prepare_bicycle(bicycle)}
  end

  def prepare_bicycle(bicycle)
    #...
  end
end
```
- 위 코드에서 `prepare` 메서드 자체는 `Mechanic` 클래스에 의존하고 있지 않지만, **`prepare_bicycles` 메서드에 반응할 수 있는 객체를 수신해야 한다는 사실에 의존하고 있다.**

### 🎈 문제가 더 복잡해지면
- 만약 위 코드에서 요구사항이 변경되었다고 가정하면 다음과 같이 복잡해진다.

```ruby
class Trip
  attr_reader :bicycles, :customers, :vehicle

  def prepare(preparers)
    preparers.each {|preparer|
      case preparer
      when Mechanic
        preparer.prepare_bicycles(bicycles)
      when TripCoordinator
        preparer.buy_food(customers)
      when Driver
        preparer.fill_water_tank(vehicle)
      end
    }
  end
end

class TripCoordinator
  def buy_food
    # ...
  end
end

class Driver
  def gas_up(vehicle)
    # ...
  end

  def fill_water_tank(vehicle)
    # ...
  end
end
```

- 위 상황에서 `prepare`가 `prepare_bicycle` 메서드를 이해하지 못하는 객체를 처리해야만 한다.
- 만약 새로운 `preparer`가 존재하면 `case` 구문에 `when`절을 추가해야 할 것이다. 이 경우 뻣뻣하고 유연하지 못한 애플리케이션이다.

### 🎈 오리 타입 찾기
- 의존성을 제거하기 위해서 중요한 한가지 사실은 `Trip`의 `prepare` 메서드는 **하나의 목적**을 갖고 있기 떄문에 `prepare`의 인자 역시 이 목표를 이루기 위해 협업하는 객체라는 사실이다.
- 그렇기 때문에 `prepare`가 무엇을 원하는지에 집중한다. 즉, `prepare` 관점에서 생각한다.
- 인자가 주어진 작업을 제대로 할 줄 안다고 `prepare`가 믿기만 하면 디자인은 훨씬 간단해질 것이다.
- 그 다음은 `prepare` 메서드가 `Preparer`에게 어떤 메시지를 전송할지 생각하는 것이다.
- 다음 코드는 새로운 디자인을 적용한 결과로 `prepare` 메서드는 모든 인자가 모두 `Preparer`일 것이라 기대하고 인자의 클래스는 모두 새로운 인터페이스를 구현하고 있다.

```ruby title="Trip2.rb"
class Trip
  attr_reader :bicycles, :customers, :vehicle

  def prepare(perparers)
    perparers.each {|perparer|
      perparer.prepare_trip(self)}
  end
end

# 모든 preparer가 오리 타입일 때
# 이 객체들은 모두 prepare_trip 메서드를 이해한다.
class Mechanic
  def prepare_trip(trip)
    trip.bicycles.each {|bicycle|
      prepare_bicycle(bicycle)}
  end

  # ...
end

class TripCoordinator
  def prepare_trip(trip)
    buy_food(trip.customers)
  end

  # ...
end

class Driver
  def prepare_trip(trip)
    vehicle = trip.vehicle
    gas_up(vehicle)
    fill_water_tank(vehicle)
  end

  # ...
end
```

- 이제 `prepare` 메서드를 수정하지 않고도 새로운 `Preparer`를 추가할 수 있다.

### 🎈 오리 타입을 사용해서 얻을 수 있는 이점
- 오리 코드는 추상적이다. 코드를 이해하기 위해 좀 더 노력해야 하지만, 대신 손쉬운 확장성을 제공한다.
- 오리 타입을 찾았기 때문에 기존 코드를 수정하지 않고도 애플리케이션에서 새로운 행동을 이끌어낼 수 있다.
- 오리 코드를 사용하면 구체적인 것에서 추상적인 것으로 바뀐다. 확장하기 쉬워지지만 그 아래 숨겨진 클래스를 파악하는 데 더 많은 노력을 기울여야 한다.

> **폴리모피즘**   
> 폴리모피즘은 여러 형태를 가지고 있는 상태를 의미한다. (하나의 종이 여러 형태를 가지고 있다.)   
> 메시지의 송신자는 수신자의 클래스를 신경 쓸 필요가 없다. 수신자는 주어진 행동에 걸맞는 자신만의 행동을 제공한다. 결국 하나의 메시지가 여러 개의(poly) 형태(morphs)를 갖게 돈다.   
> 오리 타입도 그중 하나이다.    
> 폴리모픽 메서드는 암묵적인 합의를 중시한다. 송신자의 관점에서 보면 이들은 상호 대체적이다.

## 📚 오리 타입을 사용하는 코드 작성하기

### 🎈 숨겨진 오리 타입 알아보기
다음과 같은 경우에 오리 타입을 젹옹할 수 있다.
- 클래스에 따라 변경되는 case 구분
- `kind_of?` 와 `is_a?`
- `responds_to?`


#### 🐤 클래스에 따라 변경되는 case 구분
- 도메인 객체의 클래스 이름에 따라 다르게 작동하는 `case` 구분이다.

```ruby
class Trip
  attr_reader :bicycles, :customers, :vehicle

  def prepare(preparers)
    preparers.each {|preparer|
      case preparer
      when Mechanic
        preparer.prepare_bicycles(bicycles)
      when TripCoordinator
        preparer.buy_food(customers)
      when Driver
        preparer.fill_water_tank(vehicle)
      end
    }
  end
end
```

- 이 패턴은 공유하고 있는 무언가 때문에 이 객체들이 여기에 모여 있는 것이다.
- 우리가 전송해야 하는 메시지를 알려준다. 이 메시지가 오리 타입을 찾아내기 위한 출발점이 된다.
- 여기서는 오리 타입 `Prepare`의 퍼블릭 인터페이스는 `prepare_trip` 메서드를 가져야 한다.

#### 🐤 kind_of? 와 is_a?
- `kind_of?` 와 `is_a?` 메시지는 클래스를 확인해준다.
- `kind_of`를 사용해도 클래스에 따라 변경되는 `case` 구문을 사용하는 것과 아무런 차이가 없다.

```ruby
if preparer.kind_of? (Mechanic)
  preparer.prepare_bicycles(bicycle)
elsif preparer.kind_of? (TripCoordinator)
  preparer.buy_food(customers)
elsif preparer.kind_of? (vehicle)
  preparer.gas_up(vehicle)
  preparer.fill_water_tank(vehicle)
end
```

#### 🐤 responds_to?
- 다음 코드는 의존성의 개수가 아주 조금 줄어들긴 했지만, 여전히 의존성이 많다.

```ruby
if preparer.responds_to? (:prepare_bicycles)
  preparer.prepare_bicycles(bicycle)
elsif preparer.responds_to? (:buy_food)
  preparer.buy_food(customers)
elsif preparer.responds_to? (:gas_up)
  preparer.gas_up(vehicle)
  preparer.fill_water_tank(vehicle)
end
```

### 🎈 오리 타입을 믿기
- 위 코드들은 수정하기 어렵게 만드는 의존성을 불러온다.
- 유연한 애플리케이션이란 믿을 수 있는 객체로 이루어져 있다. 객체를 믿을 만하게 만드는 일은 우리의 몫이다.

### 🎈 오리 타입 문서 작성하기
- 오리 타입은 추상적이기에 매우 강력한 디자인 도구가 될 수 있지만 이 추상성 자체가 코드 속에서 오리 타입을 잘 드러나지 않게 만든다.
- **오리 타입을 만들었다면 문서도 작성하고 오리 타입의 퍼블릭 인터페이스 역시 테스트해야 한다.**
- 좋은 테스트만 작성해도 그 자체로 최고의 문서가 될 수 있다.

### 🎈 현명하게 오리 타입 선택하기
- 디자인의 목표는 비용을 줄이는 것이다.
- 오리 타입을 만들어서 불안정한 의존성을 줄일 수 있다면, 만들면 된다.

## 📚 오리 타입을 무서워하지 않고 사용하기

### 🎈 정적 타입으로 오리 타입 거부하기
- 동적 언어를 두렵게 느끼는 프로그래머들은 객체의 클래스를 확인하는 습관이 있다. 이런 확인은 동적 언어의 힘을 반감시키고 오리 타입을 사용할 수 없도록 만들어 버린다.
- 타입 확인을 추가하면 할수록 코드는 점점 덜 유연해지고 점점 더 클래스에 의존하게 된다. 이 문제를 해결하는 방법은 타입 확인을 지워버리는 것이다.

### 🎈 정적 타입 vs 동적 타입
정적 타입의 장점은 다음과 같다.
- 컴파일 시점에 컴파일러가 타입 에러를 잡아낼 수 있다.
- 눈에 보이는 타입 정보가 문서의 역할을 한다.
- 컴파일된 코드는 빠르게 동작할 수 있도록 최적화되어 있다.

하지만 이 이점들은 각가의 상응하는 가정을 받아들일 경우에만 의미가 있다.
- 컴파일러가 타입을 확인하지 않으면 런타임 타입 에러가 발생할 것이다.
- 프로그래머는 전체 맥락에서 객체의 타입을 추측할 수 없고, 코드를 이해하지 못할 것이다.
- 이러한 최적화를 거치지 않으면 애플리케이션이 너무 느릴 것이다.

동적 타입의 장점은 다음과 같다.
- 코드가 해석되면 동적으로 로드될 수 있다. compile/make 과정을 거칠 필요가 없다.
- 소스 코드에 명시적인 타입 정보를 포함할 필요가 없다.
- 메타프로그래밍이 손쉽다.

다음과 같은 가정을 받아들인다면 이런 이점은 보다 강화된다.
- compile/make 과정이 없으면 전체 애플리케이션 개발이 보다 빠르게 진행된다.
- 타입을 선언하는 코드가 없으면 프로그래머가 코드를 이해하기 쉬다.
- 메타프로그래밍은 프로그래밍 언어의 바람직한 기능이다.

## 📚 요약
- 객체지향 디자인의 핵심은 메시지가 있다.
- 메시지는 퍼블릭 인터페이스를 따라 객체들 사이를 오간다.
- 오리 타입은 이 퍼블릭 인터페이스를 클래스로부터 분리해낸다. 그리고 객체가 누구인지가 아니라 객체가 무엇을 하는지에 따라 가상의 타입을 만들어 낸다.
- 오리 타입은 오리 타입이 없었다면 발견하지 못했을 추상화를 볼 수 있게 해준다.
- 이 추상화에 의존할 때 애플리케이션의 위험성은 줄어들고 유연성은 증가한다. 유지보수 비용이 줄어들고 쉽게 수정할 수 있게 된다.
