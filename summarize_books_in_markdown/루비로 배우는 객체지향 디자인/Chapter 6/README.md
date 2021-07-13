# ✌️ Chapter 6: 상속을 이용해 새로운 행동 얻기

<details><summary>Table of Contents</summary>

- 📚 고전적 상속 이해하기 [:link:](#-고전적-상속-이해하기)
- 📚 상속을 사용해야 하는 지점을 알기 [:link:](#-상속을-사용해야-하는-지점을-알기)
- 📚 상속의 잘못된 사용 [:link:](#-상속의-잘못된-사용)
- 📚 상위클래스와 하위클래스 사이의 커플링 관리하기 [:link:](#-상위클래스와-하위클래스-사이의-커플링-관리하기)
- 📚 요약 [:link:](#-요약)

</details>

## 📚 고전적 상속 이해하기
- 상속이란 **자동화된 메시지 전달**시스템이다.
- 상속 시스템은 객체가 이해하지 못한 메시지를 어디로 전달해야 하는지를 정의한다. 특정 객체가 이해할 수 없는 메시지를 전달받았을 경우 그 객체는 이 메시지를 다른 객체에게 전달한다. 이런 전달의 관계를 만드는 것이 상속이다.
- 고전적인 상속 관계는 하위클래스(subclasses)를 만드는 것을 통해 정의된다. 메시지는 하위클래스에서 상위클래스로 전달된다.

## 📚 상속을 사용해야 하는 지점을 알기

### 🎈 구체 클래스에서 시작하기
- 예를 들어본다.
- 아래 코드는 Bicycle클래스고 모든 로드 자전거는 이 클래스의 인스턴스이다.

```ruby
class Bicycle
  attr_reader :size, :tape_color

  def initialize(args)
    @size = args[:size]
    @tape_color = args[:tape_color]
  end

  # 모든 자전거가 동일한 크기의 타이어와 체인을 기본값으로 갖는다.
  def spares
    {
      chain: '10-speed',
      tire_size: '23',
      tape_color: tape_color
    }
  end

  # 다른 메서드들..
end

bike = Bicycle.new(
  size: 'M',
  tape_color: 'red'
)

bike.size # M
bike.spares
# { :tire_size => '23', :chain => '10-speed' :tape_color => 'red'}
```

- 이 클래스에서 요구사항이 들어왔다. 디자인의 목표는 마운틴 자전거를 지원하도록 하는 것이다.
- 마운틴 자전거에는 서스펜션이 필요하다.

### 🎈 자전거 종류 추가하기
- 아래 코드의 `spares` 메서드에 `if` 문을 포함하게 되었다. 이 예시는 안티패턴을 보여주기 위한 간단한 우회로에 불과하다. (문제가 많은 패턴)

```ruby
class Bicycle
  attr_reader :style, :size, :tape_color,
              :front_shock, :rear_shock
  def initialize(args)
    @type = args[:style]
    @size = args[:size]
    @tape_color = args[:tape_color]
    @front_shock = args[:front_shock]
    @rear_shock = args[:rear_shock]
  end

  # 좋지 않다.
  def spares
    if style == :road
      {
        chain: '10-speed',
        tire_size: '23',
        tape_color: tape_color
      }
    else
      chain: '10-speed',
      tire_size: '2.1',
      rear_shock: rear_shock
    end
  end
end

bike = Bicycle.new(
  style: :mountain,
  size: 'S',
  front_shock: 'Manitou',
  rear_shock: 'Fox'
)

bike.spares
# {:tire_size => "2.1", :chain => "10-speed", :rear_shock => 'Fox'}
```

- 위 코드는 `style` 변수가 가지고 있는 값을 확인하고 어떤 예비부품이 필요한지 결정한다.
- 이렇게 코드를 구성하면 새로운 `style`을 추가하는 경우 `if`문을 수정해야 한다.
- 또한, `spares` 메서드는 기본 문자열을 가지고 있는데, 이 문자열 중 몇몇은 `if` 문의 조건마다 반복되고 있다.
- `Bicycle`은 하나 이상의 책임을 지고 있으며 수정요쳥에 노출되기 쉬운 코드를 품고 있으며 그 자체로는 재사용이 불가능하다.
- 이 코드는 **자기가 어떤 종류인지 알고 있는 어트리뷰트**를 확인하는 `if` 문을 포함하고 있다. 이 어트리뷰트를 통해 **자기 자신에게** 어떤 메시지를 보낼지 결정한다.
- 오리 타입에서는 **객체의 클래스**를 확인하고 이 **객체**에게 어떤 메시지를 전송할지 결정하는 `if` 문이 있었다.
- 송신자의 입장에서는 "나는 네가 누구인지 알고 있다. 때문에 네가 무엇을 하는지도 안다." 이런 지식은 수정 비용을 높이는 의존성이다.

### 🎈 숨겨진 타입 찾아내기
- 변수 `style`은 `Bicycle`을 서로 다른 두 종류로 구분하고 있다.
- 하나의 클래스가 여러 개의 서로 다른, 하지만 연관된 타입을 가지고 있다.
- 이것을 상속을 통해서 해결할 수 있다. 다시 말해서, **밀접히 연관된 타입들이 같은 행동을 공유하고 있지만 특정한 관점에서는 다른 경우인 것이다.**

### 🎈 상속을 선택하기
- 객체는 메시지를 직접 처리하거나 다른 객체가 철할 수 있도록 메시지를 넘긴다. 상속은 두 객체 사이의 관계를 정의한다.
- 찻 반쩨 객체가 이해할 수 없는 메시지를 수신하면 이 객체는 다음 객체에게 자동으로 메시지를 전달한다. 상속은 이와 같은 관계를 맺도록 정의해준다.
- 여러 객체지향 언어들은 **단일상속**(부모가 하나)을 지원한다. 하나의 하위클래스가 하나의 상위클래스만을 가질 수 있다.
- 오리 타입은 클래스들을 가로지르기 떄문에 공통의 행동을 공유하기 위해 고전적 상속을 사용하지 않는다.
- 어떤 객체가 이해할 수 없는 메시지를 수신하면 루비는 자동으로 이 메시지를 상위클래스에 연쇄적으로 전달한다. 이 메시지를 처리할 수 있는 메서드를 구현하고 있는 상위클래스를 찾는다.
- **이해하지 못하는 메시지가 상위클래스의 연쇄를 타고 올라간다는 사실은, 하위클래스는 상위클래스의 모든 행동을 갖고 있다는 점, 그리고 추가적인 행동을 더 가지고 있다는 사실을 말해준다.**

## 📚 상속의 잘못된 사용
- 다음은 하위클래스 `MountainBike`를 만들어 보려는 첫 번째 시도이다.
- `initialize`와 `spares` 메서드는 모두 `Bicycle`이 이미 구현하고 있다. 때문에 `MountainBike`에서는 재정의(override)되고 있다. 아래 코드에서 재정의된 메서드들은 `super`를 전송하고 있다.

```ruby
# MountainBike
class MountainBike < Bicycle
  attr_reader :front_shock, :rear_shock

  def initialize(args)
    @front_shock = args[:front_shock]
    @rear_shock = args[:rear_shock]
    super(args) # 상위클래스의 연쇄 속으로 넘겨주게 된다.
  end

  def spares
    super.merge(rear_shock: rear_shock)
  end
end 
```

- `MountainBike`의 인스턴스가 로드 자전거와 마운틴 자전거의 행동을 뒤죽박죽으로 가지고 있다.
- `Bicycle` 클래스는 상위클래스 용도로 만들어진 클래스가 아니라 구체 클래스이다.

```ruby
mountain_bike = MountainBike.new(
  size: 'S',
  front_shock: 'Manitou',
  rear_shock: 'Fox',
)

mountain_bike.size # 'S'
mountain_bike.spares
# {:tire_size => '23' 틀림
#  :chain => '10-speed'
#  :tape_color => nil 해당 사항 없음
#  :front_shock => 'Manitou'
#  :rear_shock => 'Fox' }
```

### 🎈 추상화 찾아내기
- `MountainBike`가 만들어지면서 `Bicycle`이라는 이름은 잘못된 정보를 주고 있다. 이 두 클래스의 이름이 둘 사이의 상속 관계를 암시한다.
- 하위클래스는 상위클래스의 **특수한 형태**(**specialization**)이다. `MountainBike`는 `Bicycle`의 모든 행동을 갖고 있고 추가적인 행동을 더 가지고 있어야 한다.
- `Bicycle`과 협업할 수 있는 모든 객체는 `MountainBike`에 대해 아무것도 모른 채 `MountainBike`와 협업할 수 있어야 한다.
- 상속은 이 두 원칙 즉, 모델링하는 객체들이 명백하게 일반-특수 관계를 따라야 한다는 것이고 올바른 코딩 기술을 사용해야 한다는 것이다.

### 🎈 추상화된 상위클래스 만들기
- `Bicycle`은 공통된 행동을 가지고 있고 `MountainBike`와 `RoadBike`에는 각자의 특수한 행동만을 추가해야 한다.
- `Bicycle`의 퍼블릭 인터페이스에는 `spares`와 `size`가 포함되어 있어야 하고 하위클래스의 인터페이스에는 하위클래스만의 고유한 부품을 추가한다.
- 추상 클래스는 상속받기 위해서 존재하고 이 클래스는 하위 클래스들의 공유하는 공통된 행동들의 저장소이고 이 추상 클래스를 상속받은 하위클래스들은 구체적인 형태를 제공할 수 있다.
- 상속 관계를 만드는 데는 높은 비용이 든다. 이 비용을 최소화하는 가장 좋은 방법은 **하위클래스가 추상 클래스를 필요로 하기 바로 직전에 추상 클래스를 만드는 것이다.**
- 새로운 상속 관계를 만들기 위한 첫 단추는 클래스 구조를 만드는 일이다.

```ruby
class Bicycle
  # 이 클래스에는 아무 내용이 없다.
  # 여기 있던 코드는 모두 RoadBike로 옮겼다.
end

class RoadBike < Bicycle
  # 어제 Bicycle의 하위클래스가 되었다.
  # 기존의 Bicycle 클래스가 가지고 있던 모든 코드를 갖고 있다.
end

class MountainBike < Bicycle
  # Bicycle의 하위클래스이다.
  # 코드가 수정되지 않았다.
end
```

- 이러한 재배치가 의미 있는 이유는 하위클래스의 코드를 상위클래스로 올리는 것이 상위클래스의 코드를 하위클래스로 내리는 것보다 수월하기 때문이다.
- 이런식의 현제 구조는 `MountainBike`의 하위클래스는 에러가 발생한다. 이유는 상위클래스인 `Bicycle`에서 `size`를 구현하고 있지 않기 때문이다.(현재 `Bicycle`클래스는 빈 클래스)

### 🎈 추상적인 행동을 위로 올리기
- `size`와 `spares`는 모든 자전거에 적용될 수 있는 메서드이다.
- `size`를 상위클래스인 `Bicycle`로 옮긴다.

```ruby
class Bicycle
  attr_reader :size

  def initialize(args={})
    @size = args[:size]
  end
end

class RoadBike < Bicycle
  attr_reader :tape_color

  def initialize(args)
    @tape_color = args[:tape_color]
    super(args) # super를 통해 Bicycle로 전달
  end
  # ...
end
```

- 이제 `RoadBike`는 `size` 메서드를 `Bicycle` 클래스로부터 상속받고 있다. `RoadBike`는 `Bicycle`의 하위클래스이기 때문에 메시지 전달이 자동으로 이루어진다.

```ruby
road_bike = RoadBike.new(
  size: 'M',
  tape_color: 'red',
)

road_bike.size # "M"

mountain_bike = MountainBike.new(
  size: 'S',
  front_shock: 'Manitou',
  rear_shock: 'Fox'
)

mountain_bike.size # 'S'
```

- 새로운 상속 관계를 만드는 리팩터링을 진행할 때 유념해야 하는 기본 원칙은, **구체적인 것을 내리기보다는 추상적인 것을 끌어올리는 방식을 취해야한다.**

### 🎈 구체적인 것들 속에서 추상적인 것 분리해내기
- `RoadBike`와 `MountainBike` 모두 각자의 `spares` 메서드를 구현하고 있다.
- 하지만 `Bicycle`은 아직 `spares` 메서드를 구현하고 있지 않다. 때문에 `MountainBike`에 `spares` 메서드를 전송하면 `NoMethodError`가 발생한다.
- `RoadBike`의 `spares` 메서드를 그냥 끌어올릴 수는 없다. 이유는 `tape_color`는 로드 자전거만 알고 있어야 하는 내용이다. 때문에 구체적인 것은 `RoadBike`에 남아 있어야 한다.
- 일단 액세서와 세터를 통해 접근해야지 하드코딩된 값이여서는 안 된다.

```ruby
class Bicycle
  attr_reader :size, :chain, :tire_size

  def initialize(args={})
    @size = args[:size]
    @chain = args[:chain]
    @tire_size = args[:tire_size]
  end
  # ...
end
```
- 위 코드는 하위클래스에 상속된다. 하지만 이 코드의 어디에도 이 코드를 상속하기 위해 작성했다는 사실을 보여주는 내용은 없다.

### 🎈 템플릿 메서드 패턴 사용하기
- `Bicycle`의 `initialize` 메서드가 기본값을 가져오는 메시지를 전송하도록 할 것이다.
- `Bicycle`이 이 메시지를 전송하는 궁극적인 목표는 하위클래스가 이 메서드를 재정의하는 것을 통해 하위클래스만의 특수한 행동을 추가할 수 있도록 하기 위함이다.
- 기본 구조를 상위클래스가 정의하고 상위클래스에서 메시지를 전송하여 하위클래스의 특수한 값을 얻는 기술을 **템플릿 메서드** 페턴이라고 부른다.

```ruby
# TemplateBicycle.rb
class Bicycle
  attr_reader :size, :chain, :tire_size

  def initialize(args={})
    @size = args[:size]
    @chain = args[:chain] || default_chain
    @tire_size = args[:tire_size] || default_tire_size
  end

  # 모두의 기본값
  def default_chain 
    '10-speed'
  end
end

class RoadBike < Bicycle
  # ...
  def default_tire_size
    '23' # 하위클래스 기본값
  end
end

class MountainBike < Bicycle
  # ...
  def default_tire_size
    '2.1' # 하위클래스 기본값
  end
end
```

- 이제 모든 자전거는 동일한 체인을 사용하지만 서로 다른 타이어 크기를 갖는다.

### 🎈 모든 템플릿 메서드 구현하기
- 템플릿 메서드 패턴을 사용하는 클래스는 자신이 전송하는 메서드를 직접 구현해 놓아야 한다.
- 하위클래스가 이 메시지를 구현해야 한다고 명시적으로 말해주는 것은 그 자체로 훌륭한 문서가 된다.
- 템플릿 메서드 패턴을 사용할 때는 언제나 호출되는 메서드를 작성하고 유용한 에러 메시지를 제공해야 한다.

```ruby
class Bicycle
  # ...
  def default_tire_size
    raise NotImplementedError, "This #{self.class} cannot respond to:"
  end
end
```

## 📚 상위클래스와 하위클래스 사이의 커플링 관리하기
- 상위클래스의 `spares` 메서드를 여러 가지 방법으로 구현할 수 있다.

### 🎈 커플링 이해하기
- 첫 번째 구현 방식은 가장 간단히 작성할 수 있지만, 클래스 사이의 가장 강력한 결합을 만들어 낸다.
- 현재 두 하위클래스의 `spares` 메서드는 다음과 같다.

```ruby
class RoadBike < Bicycle
  # ...
  def spares
    { chain: '10-speed'
      tire_size: '23'
      tape_color: tape_color }
  end
end

class MountainBike < Bicycle
  # ...
  def spares
    super.merge({ rear_shock: rear_shock })
  end
end
```

- 체인과 타이어 크기를 얻어오는 부분을 `super`를 전송하는 방식으로 바꾸고 로드 자전거의 특수한 부분을 최종 결과 해시에 추가하면 된다.
- 이 코드는 알아보기 쉬운 패턴을 가지고 있고 `Bicycle`이 전송하는 모든 템플릿 메서드는 `Bicycle` 내에서 구현되어 있다.

```ruby
# CoupleBicycle.rb
class Bicycle
  attr_reader :size, :chain, :tire_size

  def initialize(args={})
    @size = args[:size]
    @chain = args[:chain] || default_chain
    @tire_size = args[:tire_size] || default_tire_size
  end

  def spares
    {
      tire_size: tire_size,
      chain: chain,
    }
  end

  def default_chain 
    '10-speed'
  end

  def default_tire_size
    raise NotImplementedError, "This #{self.class} cannot respond to:"
  end
end

class RoadBike < Bicycle
  attr_reader :tape_color

  def initialize(args)
    @tape_color = args[:tape_color]
    super(args)
  end

  def spares
    super.merge({ tape_color: tape_color })
  end

  def default_tire_size
    '23'
  end
end

class MountainBike < Bicycle
  attr_reader :front_shock, :rear_shock

  def initialize(args)
    @front_shock = args[:front_shock]
    @rear_shock = args[:rear_shock]
    super(args)
  end

  def spares
    super.merge({ rear_shock: rear_shock })
  end
  
  def default_tire_size
    '2.1'
  end
end
```

- 이렇게하면 제대로 작동한다. 하지만 두 하위클래스가 비슷한 패턴을 따른다.
- 다른 클래스에 대해 알고 있다면 여기서 의존성이 만들어지는데 그 의존성은 객체를 강하게 결합시킨다.
- 이 의존성은 하위클래스가 `super`를 전송하면서 만들어진다. (하위클래스에서 `super`를 전송하는 것을 잊으면 유효한 값을 얻어오지 못한다.)
- 이 상속 관계 속에서 하위클래스는 자신이 무엇을 해야 하는지 알아야 할 뿐 아니라, 자신의 상위클래스와 어떻게 소통해야 하는지도 알고 있어야 한다. 이때 문제가 발생한다.
- 하위클래스에게 명시적으로 `super`를 전송하라고 강제하고 모든 하위클래스들이 정확히 같은 지저메서 `super`를 전송하는 코드 중복이 발생하고, 실수할 수 있는 가능성을 높인다.

### 🎈 훅 메시지를 사용해서 하위클래스의 결합 없애기
- 하위클래스가 알고리즘을 알고 있고 `super`를 전송하는 대신 **훅**(**hook**) 메시지를 전송할 수 있다. 
- 훅 메시지는 정해진 메서드 구현을 통해 하위클래스가 정보를 재공할 수 있도록 만들어주는 메시지이다.
- 이 방법을 사용하면 상위클래스가 모든 권한을 가질 수 있게 된다.
- 다음과 같이 `RoadBike`는 `post_initialize` 메서드를 재정의하는 것을 통해 자신만의 고유한 초기화 과정을 갖출 수 있다.

```ruby
class Bicycle
  attr_reader :size, :chain, :tire_size

  def initialize(args={})
    @size = args[:size]
    @chain = args[:chain] || default_chain
    @tire_size = args[:tire_size] || default_tire_size

    post_initialize(args)
  end

  def post_initialize(args)
    nil
  end
  # ...
end

class RoadBike < Bicycle
  def post_initialize(args)
    @tape_color = args[:tape_color]
  end
  # ...
end
```

- 위와 같은 방법은 `super`를 제거했을 뿐 아니라 `initialize` 메서드 자체를 제거해주었다.
- 이제 추상화된 상위클래스 `Bicycle`에서 정의되고 있고, `post_initialize`를 전송하는 것은 `Bicycle`의 책임이다.
- 또한, 초기화가 **언제**이루어져야 하는지는 결정하지 않는다. 덕분에 둘 사이의 결합이 줄어들었다.
- `spares` 메서드도 같은 기술을 사용해서 `super`를 전송하는 부분을 제거할 수 있다.


```ruby
class Bicycle
  # ...
  def spares
    {
      tire_size: tire_size,
      chain: chain,
    }.merge(local_spares)
  end

  # hook for subclasses to override
  def local_spares
    {}
  end
  
  # ...
end

class RoadBike < Bicycle
  # ...
  def local_spares
    { tape_color: tape_color }
  end
end
```

- 위 코드에서 `local_spares` 메서드는 기존의 `spares` 메서드를 대체하고 있다.
- 그저 자신의 `local_spares`가 언젠가 어떤 객체에 의해 호출될 것이라는 점만 알고 있다.
- 다음 코드는 마지막 상속 관계 전체 코드이다.

```ruby
# LastBicycle.rb
class Bicycle
  attr_reader :size, :chain, :tire_size

  def initialize(args={})
    @size = args[:size]
    @chain = args[:chain] || default_chain
    @tire_size = args[:tire_size] || default_tire_size
    post_initialize(args)
  end

  def spares
    {
      tire_size: tire_size,
      chain: chain,
    }.merge(local_spares)
  end

  def default_tire_size
    raise NotImplementedError, "This #{self.class} cannot respond to:"
  end

  # 하위클래스가 재정의 할 수 있다.
  def post_initialize(args)
    nil
  end

  def local_spares
    {}
  end

  def default_chain 
    '10-speed'
  end
end

class RoadBike < Bicycle
  attr_reader :tape_color

  def post_initialize(args)
    @tape_color = args[:tape_color]
  end

  def local_spares
    { tape_color: tape_color }
  end

  def default_tire_size
    '23'
  end
end

class MountainBike < Bicycle
  attr_reader :front_shock, :rear_shock

  def post_initialize(args)
    @front_shock = args[:front_shock]
    @rear_shock = args[:rear_shock]
  end

  def local_spares
    { rear_shock: rear_shock }
  end
  
  def default_tire_size
    '2.1'
  end
end
```

- 새로운 하위클래스는 템플릿 메서드만 구현하고 있으면 된다.
- `MountainBike`와 `RoadBike`의 코드는 뚜렷하고, 규격화되어 있고 예측가능하다.


## 📚 요약
- 추상화된 상위클래스를 만드는 가장 좋은 방법은 구체적인 하위클래스의 코드를 위로 올리는 것이다.
- 추상화된 상위클래스는 템플릿 메서드 패턴을 이용해서 하위클래스가 자시늬 특수한 내용을 추가할 수 있도록 돕는다. 그리고 훅 메서드를 통해 `super`를 전송하지 않고도 특수한 내용을 전달할 수 있도록 해준다.
- 훅 메서드를 이용하면 하위클래스가 추상화 알고리즘을 알지 못해도 자신의 특수한 내용을 추가할 수 있다.
- 하위클래스가 `super`를 전송하지 않아도 괜찮기 때문에, 상속 관계의 층위 사이의 결합이 느슨해진다.