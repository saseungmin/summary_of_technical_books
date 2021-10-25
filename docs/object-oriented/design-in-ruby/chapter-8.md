---
sidebar_position: 9
---

# ✌️ Chapter 8: 조합을 이용해 객체 통합하기

- 객체지향 조합을 이용하면 간단하고 독립적인 객체를 보다 크고 복합적인 것으로 통합할 수 있다. 조합에서 좀 더 큰 객체는 자신의 부분들을 가지고 있다. 즉, **가지고 있는**(**has-a**) 관계를 맺는다.

## 📚 자전거 부품 조합하기
- 6장의 마지막 코드를 사용한다.

### 🎈 Bicycle 클래스 업데이트하기
- `Parts` 객체는 자전거 부품의 목록을 들고 있을 책임이 있다. (`Bicycle`은  `Parts` 객체에게 `sparse` 메시지를 전송한다.)
- 아래 코드는 `Bicycle` 클래스에 `Parts` 객체를 들고 있는 `parts` 변수를 추가해주고 `spares`를 `parts`에게 전달해준다.

```ruby
class Bicycle
  attr_reader :size, :parts

  def initialize(args={})
    @size = args[:size]
    @parts = args[:parts]
  end

  def spares
    parts.spares
  end
end
```

### 🎈 Parts의 상속 관계 만들기
- 이제 `Bicycle`에서 제거했던 부품의 행동을 `Parts`로 옮겨본다.

```ruby title="BicycleParts.rb"
class Parts
  attr_reader :chain, :tire_size
  
  def initialize(args={})
    @chain = args[:chain] || default_chain
    @tire_size = args[:tire_size] || default_tire_size
    post_initialize(args)
  end

  def spares
    {
      tire_size: tire_size,
      chain: chain
    }.merge(local_spares)
  end

  def default_tire_size
    raise NotImplementedError
  end

  # 하위클래스가 재정의 가능
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

class RoadBikeParts < Parts
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

class MountainBikeParts < Parts
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

- 6장의 `Bicycle` 상속 관계와 거의 똑같다. 추상 클래스 `Parts`가 추가되었다.

```ruby title="BicycleParts.rb"
road_bike = Bicycle.new(
  size: 'L',
  parts: RoadBikeParts.new(tape_color: 'red')
)

puts road_bike.size
puts road_bike.spares

mountain_bike = Bicycle.new(
  size: 'L',
  parts: MountainBikeParts.new(rear_shock: 'Fox')
)

puts mountain_bike.size
puts mountain_bike.spare

# L
# {:tire_size=>"23", :chain=>"10-speed", :tape_color=>"red"}
# L
# {:tire_size=>"2.1", :chain=>"10-speed", :rear_shock=>"Fox"}
```

- 이번 리팩터링을 통해서 `Bicycle` 속에서 자전거와 관련된 코드가 거의 없어졌다.

## 📚 Parts 객체 조합하기
- 이제 하나의 부품을 담당하는 클래스를 만들어야 한다. (`Part`)
- `Bicycle`은 하나의 `Parts`를 들고 있고 이 객체는 여러 개의 `Part`를 들고 있다.

### 🎈 Part 만들기
- `Bicycle`은 `Parts`에게 `spares`를 전송하고, 이어서 `parts`는 각각의 `Part`에서 `need_spare`를 전송한다.
- 새로운 `Parts` 클래스는 `Part`들의 배열을 감싸는 단순한 래퍼에 불과했다.

```ruby title="PartsPart.rb"
class Parts
  attr_reader :parts

  def initialize(parts)
    @parts = parts
  end

  def spares
    parts.select{|part| part.needs_spare}
  end
end

class Part
  attr_reader :name, :description, :needs_spare

  def initialize(args)
    @name = args[:name]
    @description = args[:description]
    @needs_spare = args.fetch(:needs_spare, true)
  end
end
```
- 이제 개별 `Part`들을 만들수 있다. 다음 코드는 여러 개의 부품을 만들어 인스턴스 변수에 저장할 수 있다.

```ruby
chain = Parts.new(name: 'chain', description: '10-speed')
road_tire = Parts.new(name: 'tire_size', description: '23')
tape = Parts.new(name: 'tape_color', description: 'red')
mountain_tire = Parts.new(name: 'tire_size', description: '2.1')
rear_shock = Parts.new(name: 'rear_shock', description: 'Fox')
front_shock = Parts.new(
  name: 'front_shock', 
  description: 'Manitou', 
  needs_spare: false
)
```

- 각각의 `Part`들을 묶어 `Parts`를 만들 수 있다.

```ruby title="PartsPart.rb"
road_bike_parts = 
  Parts.new([chain, road_tire, tape])

road_bike = Bicycle.new(
  size: 'L',
  parts: road_bike_parts,
)

road_bike.size
road_bike.spares

mountain_bike = 
  Bicycle.new(
    size: 'L',
    parts: Parts.new([
      chain,
      mountain_tire,
      front_shock,
      rear_shock
    ])
  )

mountain_bike.size
mountain_bike.spares
```

### 🎈 Parts를 보다 배열과 비슷하게 만들기
- `Bicycle`의 `parts`와 `spares` 메서드는 같은 방식으로 작동하지 않는다.

```ruby
mountain_bike.spares.size # 3
mountain_bike.parts.size # NoMethodError
```

- 두번째 줄의 `parts`는 `Parts`의 인스턴스를 반환하고 이 인스턴스는 `size` 메서드를 모르기 때문에 문제가 발생한다.
- `Parts`에 `size` 메서드를 추가해준다.

```ruby
def size
  parts.size
end
```
- 하지만 `Array`의 모든 행동을 기대하기 때문에 배열이게 만들어준다.

```ruby
class Parts < Array
  def spares
    select{|part| part.needs_spare}
  end
end
```

- 하지만 `+` 같은 메서드도 포함되어 있어 두 개의 `Parts`를 합쳤을 때 그 결과로 `Array`의 인스턴스가 반환된다. 그리고 `Array`는 `spares` 메서드를 이해하지 못한다.

```ruby
combo_parts = (mountain_bike.parts + road_bike.parts)

puts combo_parts.size # 7
puts combo_parts.spares # NoMethodError

puts mountain_bike.parts.class # Parts
puts road_bike.parts.class # Parts
puts combo_parts.class # Array
```

- 때문에 완벽한 해결책은 없다. 위와 같은 예 중에 상황에 따라 결정을 내려야한다.
- 다음과 같은 해결책도 존재한다. `Parts` 클래스는 `size` 메서드를 `@parts`에게 전달해주고 `Enumerable` 모듈을 인클루드해서 반복과 검색을 가능케 해주는 메서드를 얻을 수 있고 이 코드에 `+` 메서드를 전송하면 `NoMethodError`를 내뱉는다. 하지만 기존의 `Enumerable`의 모든 메서드를 이해한다.

```ruby
require 'forwardable'
class Parts
  extend Forwardable
  def_delegators :@parts, :size, :each
  include Enumerable

  def initialize(parts)
    @parts = parts
  end

  def spares
    select{|part| part.needs_spare}
  end
end
```

## 📚 Parts 생산하기
- 아래 코드에서 마운틴 자전거를 만들려면 네 개의 부품이 필요하다는 사실을 알고 있어야 한다.

```ruby
mountain_bike = 
  Bicycle.new(
    size: 'L',
    parts: Parts.new([
      chain,
      mountain_tire,
      front_shock,
      rear_shock
    ])
  )
```

- 그렇기 때문에 특정 자전거를 만드는 데 필요한 부품들의 조합을 정리하는 것이 좋다.
- 아래 코드는 간단한 이차원 배열을 가지고 수행하였다.

```ruby
road_config = [
  ['chain', '10-speed'],
  ['tire_size', '23'],
  ['tape_color', 'red']
]

mountain_config = [
  ['chain', '10-speed'],
  ['tire_size', '2.1'],
  ['front_size', 'Manitou', false],
  ['rear_shock', 'Fox']
]
```

### 🎈 PartsFactory 만들기
- 다른 객체를 생산하는 객체를 팩토리라고 한다.
- 아래의 모듈은 나열된 배열 중 하나를 가지고 `Parts`를 생산한다. 이 모듈의 공개적인 책임은 `Parts`를 만드는 것이다.

```ruby title="PartsFactory.rb"
module PartsFactory
  def self.build(
    config,
    part_class = Part,
    parts_class = Parts
  )
    parts_class.new(
      config.collect {|part_config|
        part_class.new(
          name: part_config[0],
          description: part_config[1],
          needs_spare: part_config.fetch(2, true)
        )
      }
    ) 
  end
end
```
- `config`의 구조에 대한 지식을 팩토리 안에 넣어두면 `config`가 매우 간결하게 표현될 수 있다. `PartsFactory`가 `config`의 내부 구조를 알고 있기 때문에, 해시가 아니라 배열의 형태로 `config`를 작성할 수 있다.
- 또한, 한 번 `config`를 배열로 관리하기 시작하면 새로운 `Parts`를 만들 때는 언제나 팩토리를 사용해야 한다.

```ruby title="PartsFactory.rb"
road_parts = PartsFactory.build(road_config)
mountain_parts = PartsFactory.build(mountain_config)
```
- 이제 `PartsFactory`와 새로운 설정값 배열 덕분에 제대로 된 부품(Parts)을 만들기 위한 모든 지식이 고립되었다.

### 🎈 PartsFactory 발전시키기
- 이제 `Part` 클래스를 살펴보면 `PartsFactory` 모듈에서 사용하는 모든 `Part`를 만들고 있기 때문에 `Part`에 들어있을 필요가 없다.
- 그렇기 때문에 `Part` 클래스는 아무런 코드도 남지 않게 되기 때문에 `OpenStruct`로 대체할 수 있다.
- 몇 개의 어트리뷰트를 하나의 객체 속에 묶을 수 있는 편리한 방법을 제공한다. `OpenStruct`는 해시를 초기화 인자로 받고 이 해시에서 어트리뷰트들을 읽어온다.
- 이걸 이용해서 `Part`의 역할을 수행하는 객체를 만들고 `PartsFactory`는 이 객체를 사용할 수 있다.

```ruby title="PartsFactoryOpenStruct.rb"
require 'ostruct'
module PartsFactory
  def self.build(config, parts_class = Parts)
    parts_class.new(
      config.collect {|part_config|
        create_part(part_config)
      }
    ) 
  end

  def self.create_part(part_config)
    OpenStruct.new(
      name: part_config[0],
      description: part_config[1],
      needs_spare: part_config.fetch(2, true)
    )
  end
end
```
- 이제 전체 애플리케이션에서 부픔(Parts) 생산을 책임지는 곳은 `PartsFactory` 뿐이다.

```ruby
road_parts = PartsFactory.build(road_config)
# <OpenStruct name="chain", description="10-speed", needs_spare=true>
# <OpenStruct name="tire_size", description="23", needs_spare=true>
# <OpenStruct name="tape_color", description="red", needs_spare=true>
```

## 📚 조합된 Bicycle
- 완성된 `Bicycle`은 `Parts`을 가지고(has-a) 있다.
- `Parts`는 `Part`의 모음을 가지고(has-a) 있다. `Parts`를 품고 있는 객체들은 이들을 역할이라고 이해한다.
- `Parts`는 `Part` 역할을 수행하는 클래스이고 `spares`를 구현하고 있다.
- `Part`의 역할을 `OpenStruct`가 수행하며 `name`, `description`, `needs_spare`를 구현하고 있다.
- 완성된 코드는 `PartsFactoryOpenStruct.rb` 참고

> - 위임이란 한 객체가 전달받은 메시지를 단순히 다른 객체에게 전달하는 것을 의미한다.
> - 조합은 **가지고 있는** 관계이다. (대학은 학부를 가지고 있다. 자전거는 부품을 가지고 있다.) 두 객체 사이의 가지고 있는 관계를 의미한다.   
> 또한, 포함된 객체가 포함하는 객체로부터 독립적으로 존재하지 못하는 방식으로 서로 가지고 있는 관계를 맺고 있다. (대학이 없어지면 학부도 없어진다.)
> - 집합은 포함된 객체가 독립적으로 존재할 수 있는 조합을 뜻한다. (학부는 교수를 가지고 있지만 대학이 폐지되고 학부가 폐지되어도 교수는 여젼히 스스로 존재할 수 있다.)

## 📚 상속과 조합 중 하나 선택하기
- 고전적 상속은 **코드를 배치하는 기술**이다. 객체들의 상속 관계 속에 배치한 대가로 메시지 전달을 얻게 되었다.
- 조합을 사용하면 객체들 사이의 관계를 클래스의 상속 관계 속에 적어 놓을 필요가 없다. 객체들은 각자 독립적으로 존재한다. 그 대신 관계를 맺고 있는 객체를 알고 있어야 하며 직접 메시지를 전달해야 한다.
- 조합이 해결할 수 있는 문제라면 조합을 사용한다. 조합은 상속보다 내재적으로 훨씬 적은 의존성을 갖고 있다.
- 위함 요소가 적지만 그 대가가 클 때는 상속을 선택한다.

### 🎈 상속의 결과 받아들이기

#### 🐤 상속의 이점
- 상속 관계의 위쪽에서 정의된 메서드는 강력한 영향력을 갖는다. 이 메서드를 변경하면 상속 괸계에 따라 여파가 크다. 코드의 작은 한 부분만 수정해도 행동의 변화를 크게 이끌어 낼 수 있다. (reasonable)
- 상속 관계는 확장에 열려있고, 동시에 수정에는 닫혀있다. 새로운 하위클래스를 만들어서 새로운 변형을 받아들이기가 매우 쉽다. (usable)
- 새로운 하위클래스를 만들려고 할 때 기존 코드를 자연스럽게 참조 가능하다. (exemplary)

#### 🐤 상속의 비용
- 상속을 사용하는 데 따르는 첫 번째 우려는 상속이 어울리지 않는 문제를 해결하는 데 상속을 사용할 수 있다.
- 둘째, 상속이 문제를 해결하기 위한 적절한 방법일지라도 다른 프로그래머가 우리가 작성한 코드를 우리가 바라지 않는 방식으로 사용할 수 있다.
- 잘못된 상속 관계 속에서 코드를 수정할 때 매우 큰 비용이 발생한다. (reasonable)
- 새로운 행동을 도저히 추가할 수 없는 상황이 있다. (usable)
- 초보 프로그래머가 잘못된 상속 관계를 확장하려 했을 때 혼란을 일으킨다. (exemplary)
- 상속의 하위클래스는 상위클래스가 정의하고 있는 메서드에 의존하기 때문에 작은 부분을 수정해도 넓은 영역에 거대한 영향을 미칠 수 있다.

### 🎈 조합의 결과 받아들이기
- 조합된 객체는 클래스의 상속 관계에 의존하지 않는다. 그리고 수신한 메시지를 직접 전달한다.

#### 🐤 조합의 이점
- 조합을 사용하면 명확한 책임과 명료한 인터페이스를 갖는 작은 객체를 여럿 만들게 된다.
- 작은 객체들은 하나의 책임만을 갖고 있고, 자신의 행동을 직접 명시하고 있다. (투명한 객체. transparent)
- 수정사항이 발생했을 때 코드를 이해하기 쉽고 어떤 일이 벌어질지 예상할 수 있다.
- 주어진 인터페이스를 충실히 따르는 객체를 추가하기만 하면 된다. (reasonable)
- 조합에 관여하는 객체들은 본질적으로 그 크기가 작다. 구조적으로 독립되어 있다. 추가 제거가 용이하고 대체할 수 있는 요소를 만들어준다. (usable)

#### 🐤 조합의 비용
- 조합은 객체의 여러 부분들과 관계를 맺고 있다. 그렇기 때문에 이 부분들이 모여 전체가 작동하는 방식은 훨씬 불명확할 수 있다. (transparent)
- 구조로부터의 독립성은 자동화된 메시지 전달을 포기하면서 얻은 것이다.
- 비슷한 부분들을 정리해야 하는 상황에서는 별 도움을 주지 못한다.

### 🎈 올바른 관계 선택하기
- 상속은 이미 존재하는 클래스들에 새로운 기능을 추가할 때 가장 잘 어울린다.
- 주어진 행동이 자신이 부분들의 총합 이상일 때 조합을 사용하라.

#### 🐤 무엇이다(is-a) 관계에서 상속 사용하기
- 고정적이고 일반-특수의 상속 관계가 뚜렷한 것은 고전적 상속으로 구조화하기 좋은 대상이다.
- 하나의 카테고리를 구성하는 것(컴퓨터공학과, 전기공학과, 전자공학과... 공학으로 묶인다. 즉, 이것은 공학이다. (It is a 공학))

#### 🐤 무엇처럼 행동하는(behaves-like-a) 관계에는 오리 타입을 사용하라
- 여러 개의 객체가 같은 역할을 수행해야 하는 상황을 만든다.
- 코드 속에 숨어 있는 역할을 알아 볼 수 있는 두 가지 핵심적인 방법은 첫째, 객체가 역할을 수행하고 있지만, 그 역할이 객체의 핵심적인 책임이 아닌 경우이다. (자전거는 여러 행동을 하지만, 자전거는 자전거일 뿐이다.)
- 둘째로, 코드의 여러 곳에서 특정 역할을 수행하려고 하는 경우이다. 일반적으로는 전혀 상관없는 객체들이 같은 역할을 수행하려 드는 경우이다.
- 역할을 수행하는 객체의 관점이 아니라, 역할을 부여하는 객체의 관점에서 생각해야 한다.

#### 🐤 가지고 있는(has-a) 관계에서 조합 사용하기
- 많은 객체들은 여러 부분으로 이루어져 있지만, 객체 자체는 부분들의 총합 이상의 것이다. (자전거는 부품을 가지고 있다.)
- 자전거의 부품들은 행동과 전혀 다른, 부품마다의 고유한 행동을 가지고 있다.
