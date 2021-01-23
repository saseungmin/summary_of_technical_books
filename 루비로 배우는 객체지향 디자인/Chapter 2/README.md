## ✌️ Chapter 2: 단일 책임 원칙을 따르는 클래스 디자인하기

<details><summary>Table of Contents</summary>

- 📚 무엇을 클래스에 넣을지 결정하기 [:link:](#-무엇을-클래스에-넣을지-결정하기)
- 📚 하나의 책임만을 지는 클래스 만들기 [:link:](#-하나의-책임만을-지는-클래스-만들기)
- 📚 변화를 받아들일 수 있는 코드 작성하기 [:link:](#-변화를-받아들일-수-있는-코드-작성하기)
- 📚 드디어, 진짜 바퀴 [:link:](#-드디어-진짜-바퀴)

</details>

- 객체지향 시스템의 근간을 이루는 것은 **메시지**이지만 가장 눈에 띄는 구조는 **클래스**이다.
- **클래스는 단순해야 한다.** **지금 당장** 해야 할 일을 할 줄 알고, **나중에도** 쉽게 수정할 수 있는 클래스, 이런 클래스르르 가지고 모델링해야 한다.

### 📚 무엇을 클래스에 넣을지 결정하기

#### 🎈 메서드들을 묶어 클래스로 만들기
- 메서드를 제대로 묶어 클래스를 만드는 일은 중요하지만, 프로젝트의 초기 단계에서 메서드를 제대로 묶어내기는 어렵다. 당장 주어진 정보가 너무 부족하기 때문이다.
- 디자인이란 완벽함을 추구하는 행위라기보다 코드의 수정가능성을 보전하는 기술이다.

#### 🎈 수정하기 쉽도록 코드를 구성하기
다음과 같이 **수정하기 쉽다**를 정의한다면   
- 수정이 예상치 못한 부작용ㅇㄹ 낳지 않는다.
- 요구사항이 조금 변했을 때 연관된 코드들을 조금만 수정하면 된다.
- 현재 코드를 다시 사용하기 쉽다.
- 코드를 수정하는 가장 쉬운 방법은 이미 수정하기 쉬운 코드에 새로운 코드를 추가하는 것이다.

우리가 작성하는 코드는 다음과 같은 특징이 있어야 한다.   
- **투명하다**(**Transparent**): 수정돈 코드 속에서 그리고 이 코드와 연관된 코드 속에서, 수정의 결과가 뚜렷하게 드러나야 한다.
- **적절하다**(**Reasonable**): 모든 수정 비용은 수정 결과를 통해 얻은 이득에 비례해야 한다.
- **사용가능하다**(**Usable**): 예상치 못한 새로운 상황에서도 현재 코드를 사용할 수 있어야 한다.
- **모범이 된다**(**Exemplary**): 코드 자체가 나중에 수정하는 사람이 위의 특징을 이어갈 수 있게 도와줘야 한다.

이런 코드를 짜기 위한 첫 단추는 모든 클래스들이 하나의, 잘 정의된 책임을 갖도록 하는 일이다.

### 📚 하나의 책임만을 지는 클래스 만들기
- 하나의 클래스는 최대한 작으면서도 유용한 것만 해야 한다. 다시 말해서, 하나의 책임만 있어야 한다.

#### 🎈 애플리케이션 예시: 자전거와 기어
- 자전거를 타는 사람들은 서로 다른 두 기어를 비교하기 위해 앞, 뒤 톱니바퀴의 톱니수를 비율로 표시해서 사용한다.

```ruby
# 큰 기어
chainring = 52 # 톱니 개수
cog = 11
ratio = chainring / cog.to_f
puts ratio # 4.727272..

# 작은 기어
chainring = 30 # 톱니 개수
cog = 27
ratio = chainring / cog.to_f
puts ratio # 1.1111111...
```
- 이 자전거 세계의 특정 물체를 지칭하는 명사는 자전거, 기어 같은 단어들이다. 이 명세들이 클래스로 표현할 만한 가장 기본적인 후보들이다.
- 하지만 자전거의 행동을 설명하는 내용이 없다. 그러므로 필요한 것은 자전거 클래스가 아니다.
- 기어는 앞 톱니바퀴, 뒷 톱니바퀴, 기어비를 갖고 있다. 다시 말해 **데이터와 행동**을 둘 다 갖고 있다. 때문에 기어는 클래스가 되기에 충분한다.

```ruby
class Gear
  attr_reader :chainring, :cog
  def initialize(chainring, cog)
    @chainring = chainring
    @cog = cog
  end

  def ratio
    chainring / cog.to_f
  end
end

puts Gear.new(52, 11).ratio # 4.727272..
puts Gear.new(30, 27).ratio # 1.1111111...
```

- `Gear` 인스턴스는 세 개의 메서드를 구현한다. (chainring: 앞 톱니바퀴수, cog: 뒷 톱니바퀴수, ratio: 기어비)
- `Gear` 클래스는 스스로 구현한 메서드와 상위클래스로부터 상속받은 메서드로 구성되어 있기 때문에 `Gear` 인스턴스가 행할수 있는 행동들의 묶음, 다시 말해 기어 인스턴스가 이해할 수 있는 메시지는 상당히 많다.
- 다음으로 요구사항이 들어와 다양한 크기의 바퀴를 고려할 수 있는 계산기를 원했다.
- 그래서 기어도 다르고 바퀴 크기도 다른 자전거를 비교하기 위해 기어 인치라는 단위를 사용한다.

> 기어 인치 = 바퀴 지름 x 기어비
> 바퀴 지름 = 바퀴테(rim) 지름 + 타이어 높이의 두 배

```ruby
class Gear
  attr_reader :chainring :cog, :rim, :tire
  def initialize(chainring, cog, rim, tire)
    @chainring = chainring
    @cog = cog
    @rim = rim # 바퀴테 지름
    @tire = tire # 타이어 높이
  end

  def ratio
    chainring / cog.to_f
  end

  def gear_inches
    # 타이어는 바퀴테를 감싸고 있으므로, 지름을 계산할 때 타이어 높이에 2를 곱한다.
    ratio * (rim + (tire * 2))
  end
end

puts Gear.new(52, 11, 26, 1.5).gear_inches
# 137.090909090909
puts Gear.new(52, 11, 24, 1.25).gear_inches
# 125.272727272727
```

- `Gear` 클래스는 현재 상태만으로도 충분할지 모르지만 `Gear` 클래스는 점점 더 발전해 나갈 수많은 클래들중 하나이다. 더 효율적으로 발전하려면 코드는 수정하기 쉬워야 한다.

#### 🎈 단일 책임 원칙은 왜 중요한가
- 재사용 할 수 있는 클래스란 쉽게 가져다 쌀 수 있는 코드다.
- 한 개 이상의 책임이 있는 클래스는 재사용이 어렵다. 이렇게 되면 유지보수를 어렵게 하고 버그를 만들어 낸다.
- 애플리케이션이 너무 많은 것을 하는 클래스에 기대고 있으면 예상치 못한 오류가 발생할 가능성도 높아진다.

#### 🎈 클래스에게 하나의 책임만 있는지 알아보기
- `Gear` 클래스가 다른 클래스의 책임까지 짊어지고 있는지 알아보는 방법은 클래스를 인격이 있는 존재처럼 가정하고 질문을 던져보는 것이다. 클래스가 구현하고 있는 모든 메서드를 하나씩 질문 형태로 바꾸면 말이 되는 질문이 만들어져야 한다.
- 클래스가 진짜 하는 일이 무엇인지 알아낼 수 있는 또 다른 방법은 클래스의 책임을 한 문장으로 만들어 보는 것이다. 클래스는 최대한 작으면서도 유용한 것만 해야 한다.
- 만약 가장 단순한 표현이 **그리고** 같은 단어를 사용한다면 이 클래스는 하나 이상의 책임을 가지고 있을 가능성이 높다.
- 단순한 표현이 **또는**이라는 단어를 사용한다면 클래스는 서로 연관되지도 않은 둘 이상의 책임을 가지고 있다는 뜻이다.
- 클래스 안의 모든 것들이 하나의 핵심 목표와 연관되어 있을 때 이 클래스는 **강하게 응집되어 있다**고 할 수 있다. 또는 **하나의 책임만을 갖고 있다고 말할 수 있다.**
- 단일 책임 원칙(SRP)는 책임 주도 디자인(RDD)에 그 기원을 두고 있다.
- 그렇기 때문에 `Gear` 클래스는 뭔가 문제가 있다. `Gear`는 하나 이상의 책임을 지고 있지만 당장 어떻게 수정해야 할지는 불명확하다.

#### 🎈 언제 디자인을 결졍할지 판단하기
- 준비도 안 된 상태에서 서둘러서 디자인을 결정해야 한다고 느끼지 말자. 더 많은 정보를 얻을 때까지 일단은 그냥 기다리고 있는 쪽이 가장 비용 효율적인 접근일지도 모른다.
- `Gear` 클래스는 코드는 투명하고 적절하지만 디자인이 훌룡하지는 않다. 아무런 의존성이 없기 때문에 코드를 수정한다고 해서 특별히 문제가 생기지 않을 뿐이다.
- 만약 다른 객체와의 의존성이 생긴다면 `Gear` 클래스는 투명함과 적절함을 잃게 될 것이다. 바로 그 순간이 코드를 재구성을 재구성해야 할 때이다.
- 디자인 결정은 꼭 필요한 순간에, 그 순간이 제공하는 정보들을 가지고 해야 한다.

### 📚 변화를 받아들일 수 있는 코드 작성하기

#### 🎈 데이터가 아니라 행동에 기반한 코드를 작성하라
- 행동은 메서드 속에 담겨 있고 메시지를 보내는 행위를 통해 실행된다.
- 하나의 책임만 지는 클래스를 만들면 각각의 작은 행동들은 단 한 곳에만 존재한다.
- 객체는 행동과 함께 데이터를 갖는다. 이 데이터에는 두 가지 방법으로 접근할 수 있는데 인스턴스 변수를 직접 참조하거나 또는 인스턴스 변수를 감싸는 엑세서 메서드(accessor method)를 만들어 이 메서드를 통해 접근하는 방법이다.

#### 🎈 인스턴스 변수 숨기기
- 아래 `ratio` 메서드처럼, 변수를 직접 참조하기보다는 언제나 엑세서 메서드를 통해 변수에 접근하는 것이 좋다.

```ruby
class Gear
  def initialize(chainring, cog)
    @chainring = chainring
    @cog = cog
  end

  def ratio
    @chainring / cog.to_f # 멸망의 길
  end
end
```

- 주어진 클래스가 직접 선언한 변수에 접근하더라도 변수를 메서드로 감싸서 클래스로부터 감추는 편이 좋다. 루비는 캡슐화된 메서드를 쉽게 만들 수 있도록 `attr_reader`를 제공한다.

```ruby
class Gear
  attr_reader :chainring, :cog
  def initialize(chainring, cog)
    @chainring = chainring
    @cog = cog
  end

  def ratio
    chainring / cog.to_f
  end
end
```

- `attr_reader`는 변수를 감쌀 수 있는 간단한 래퍼 메서드를 만들어 준다. 아래는 `cog`라는 래퍼 메서드를 가상으로 구현한 것이다.

```ruby
# attr_reader를 통해 구현
def cog
  @cog
end
```
- 이제 `cog`는 무엇인지 아는 것은 `cog` 메서드뿐이기 때문에 단 한 번만 정의된 행동으로 변경되었다.
- 이렇게 `@cog` 레퍼 메서드로 감싸져 있으면 `cog` 메서드를 직접 구현해서 `cog`가 어떤 의미인지 다시 정의할 수 있다.

```ruby
# 간단한 cog 구현 예
def cog
  @cog * unanticipated_adjustment_factor
end

# 조금 더 복잡한 경우
def cog
  @cog * (foo ? bar_adjustment : baz_adjustment)
end
```

- 데이터를 마치 **메시지를 이해하는 객체**처럼 취급하는 것은 두 가지 새로운 이슈를 낳는다.
- 첫 번째 이슈는 가시성에 관한 것으로 `@cog` 변수를 **퍼블릭 메서드** `cog`로 감싸는 것은 다른 클래스에서 `@cog` 변수에 접근할 수 있게 해준다.
- 두 번째 이슈는 모든 변수를 래퍼 메서드로 감싸고 변수를 마치 객체처럼 사용할 수 있기 때문에 **데이터**와 **객체** 사이의 구분이 무의미해진다.
- 이를 통해 예상치 못한 변화로부터 코드를 보호할 수 있다.

#### 🎈 데이터 구조 숨기기
- 아래와 같은 `ObscuringReferences` 클래스가 있다.

```ruby
class ObscuringReferences
  attr_reader :data
  def initialize(data)
    @data = data
  end

  def diameters
    # 0은 바퀴테(rim), 1은 타이어 높이(tire)
    data.collect {
      |cell| cell[0] + (cell[1] * 2)
    }
  end
  # ... 배열의 인덱스에 접근하는 여러 메서드들..
end
```
- 이런 지식의 배열의 구조에 **의존적**이다.
- 루비는 구조에서 의미를 손쉽게 분리할 수 있게 해준다. 메서드로 인스턴스 변수를 손쉽게 감쌀 수 있는 것처럼 루비의 `Struct` 클래스를 이용하면 데이터 구조를 감쌀 수 있다.

```ruby
class RevealingReferences
  attr_reader :wheels
  def initialize(data)
    @wheels = wheelify(data)
  end

  def diameters
    wheels.collect {|wheel|
      wheel.rim + (wheel.tire * 2)}
  end
  
  Wheel = Struct.new(:rim, :tire)
  def wheelify(data)
    data.collect {|cell|
      Wheel.new(cell[0], cell[1])}
  end
end
```

- 이렇게 `diameters` 메서드는 배열의 내부 구주에 대한 지식이 전혀 없다.
- 입력받은 배열의 구조에 대한 모든 지식은 `wheelify` 메서드 속에 격리되었고 이 메서드는 배열들의 배열을 `Struct`들이 배열로 변환시켰다.
- [루비 공식문서](https://ruby-doc.org/core/classes/Struct.html)는 `Struct`를 명시적으로 클래스를 만들지 않고도 엑세서 메서드를 이용해 여러 어트리뷰트들을 묶어내는 편리한 방법이라고 정의한다.
- 이런 스타일의 코드는 외부 데이터 구조의 변화로부터 코드를 보호해주며, 보다 읽기 좋고 의미가 잘 드러나는 코드를 작성할 수 있게 해준다.

#### 🎈 모든 곳에 단일 책임 원칙을 강제하라

1. **메서드에서 추가적인 책임을 뽑아내기**
마치 클래스처럼, 메서드 역시 하나의 책임만을 져야 한다. 메서드가 하나의 책임만을 지닐 떄 메서드는 수정하기도 쉽고 재사용하기도 쉽다.

```ruby
def diameters
  wheels.collect {|wheel|
    wheel.rim + (wheel.tire * 2)}
end
```

위 메서드는 두 개이 책임을 지고 있다. (여러 개의 바퀴를 하나씩 훑는 것, 바퀴 하나의 지름을 계산하는 것)   
하나의 책임만 있는 두 개의 메서드로 분리해서 코드를 단순하게 만들 수 있다.   

```ruby
# 배열을 하나씩 훑는다.
def diameters
  wheels.collect {|wheel| diameter(wheel)}
end

# 바퀴 한 개의 지름을 계산한다.
def diameters(wheel)
  wheel.rim + (wheel.tire * 2)
end
```

여러 메서드가 각각 하나의 책임을 질 때 다음과 같은 이득을 얻을 수 있다.
- **예전에는 몰랐던 특성이 드러난다.** 리펙터링을 통해 크래스의 모든 메서드가 하나의 책임만 지게 되면 클래스 자체가 명확하게 드러난다.
- **주석을 넣어야 할 필요가 없어진다.**
- **재사용을 유도한다.**
- **다른 클래스로 옮기기 쉽다.** 디자인에 필요한 정보를 얻고 코드를 수정하기로 마음먹었을 때, 작은 메서드들은 옮기기 쉽다.

2. **클래스의 추가적인 책임들을 격리시켜 놓아라**
모든 메서드들이 하나의 책임만 지게 되면 클래스의 역할 범위 역시 분명해진다.   
그렇게 때문에 우리의 목표는 최대한 특정 디자인에 종속되지 않으면서, `Gear`가 하나의 책임만을 지도록 하는 것이다.   
루비는 바퀴 지름을 계산하는 책임을 `Gear` 클래스로부터 제거하면서도 새로운 클래스에 이 책임을 부여하지 않을 수 있는 방법을 제공한다. 기존의 `Wheel Strcut`에 블록을 이용해서 지름을 계산하는 메서드를 추가한다.

```ruby
class Gear
  attr_reader :chainring :cog, :wheel
  def initialize(chainring, cog, rim, tire)
    @chainring = chainring
    @cog = cog
    @wheel = Wheel.new(rim, tire)
  end

  def ratio
    chainring / cog.to_f
  end

  def gear_inches
    ratio * wheel.diameter
  end

  Wheel = Struct.new(:rim, :tire) do
    def diameter
      rim + (tire * 2)
    end
  end
end
```

- 지름을 계산할 줄 아는 `Wheel`을 갖게 되었다. 이젠 독립적인 `Wheel` 클래스를 만들기에 충분한 정보를 얻었다.

### 📚 드디어, 진짜 바퀴
- 이젠 요구사항으로 자전거 바퀴 둘레를 계산하는 기능이 필요하다고 말한다.
- `Wheel`을 `Gear`안에 넣어 두었기에 둘레를 계산하는 메서드를 추가하는 것은 아주 쉽다.
- 여기서 진짜 중요한 변호는 `Gear` 클래스와 독립된 `Wheel` 클래스가 명시적으로 필요해졌다는 점이다.
- 이미 `Gear` 클래스 안에서 `Wheel`의 행동을 구분해 놓았기 때문에 수정은 어렵지 않다.

```ruby
# Gear4.rb
class Gear
  attr_reader :chainring :cog, :wheel
  def initialize(chainring, cog, wheel=nil)
    @chainring = chainring
    @cog = cog
    @wheel = wheel
  end

  def ratio
    chainring / cog.to_f
  end

  def gear_inches
    ratio * wheel.diameter
  end
end


class Wheel
  attr_reader :rim, :tire
  def initialize(rim, tire)
    @rim = rim
    @tire = tire
  end

  def diameter
    rim + (tire * 2)
  end

  def circumference
    diameter * Math::PI
  end
end

@wheel = Wheel.new(26, 1.5)
puts @wheel.circumference
# 91.1061...

puts Gear.new(52, 11, @wheel).gear_inches
# 137.0909090..

puts Gear.new(52, 11).ratio
# 4.727272...
```
- 이제 `Gear`와 `Wheel` 모두 하나의 책임만 지게 되었다.