---
sidebar_position: 4
---

# ✌️ Chapter 3: 의존성 관리하기

- 잘 디자인된 객체는 하나의 책임만 지고 있기 때문에 객체가 복잡한 작업을 수행하기 위해서는 다른 객체와 협업해야 한다. 서로 협업하려면 객체는 다른 객체에 대한 지식이 있어야 한다. 지식은 **의존성**을 만들어 낸다.

## 📚 의존성 이해하기
- 다음은 조금 변형된 `Gear` 클래스이다. 이 코드는 네 군데에서 의존성이 있다.
- 의존성이 있다는 것은 `Gear` 클래스를 수정하기 어렵고 연약하게 만든다.

```ruby
class Gear
  attr_reader :chainring :cog, :rim, :tire
  def initialize(chainring, cog, rim, tire)
    @chainring = chainring
    @cog = cog
    @rim = rim
    @tire = tire
  end

  def ratio
    chainring / cog.to_f
  end

  def gear_inches
    ratio * Wheel.new(rim, tire).diameter
  end
  # ...
end

class Wheel
  attr_reader :rim, :trie
  def initialize(rim, tire)
    @rim = rim
    @tire = tire
  end

  def diameter
    rim + (tire * 2)
  end
  # ...
end

Gear.new(52, 11, 26, 1.5).gear_inches
```

### 🎈 의존성이 있다는 것을 알기
다음과 같은 의존성을 갖는다.   
- 다른 클래스의 이름, `Gear`는 `Wheel`이라는 이름의 클래스가 있다는 것을 알고 있다.
- 자기 자신을 제외한 다른 객체에서 전송할 메시지의 이름, `Gear`는 `Wheel`의 인스턴스가 `diameter`라는 메서드를 이해할 수 있다는 것을 알고 있다.
- 메세지가 필요로 하는 인자들, `Gear`는 `Wheel.new`를 위해 `rim`과 `tire`를 인자로 넘겨야 한다는 것을 알고 있다.
- 인자들을 전달하는 순서, `Gear`는 `Wheel.new`의 첫 번째 인자가 `rim`이고 두 번째 인자가 `tire`라는 것을 알고 있다.

위와 같은 불필요한 의존성은 코드를 덜 **적절하게**(**reasonable**) 만든다. 왜냐하면 이 의존성이 `Gear` 클래스의 수정을 강제한다.   
**각 클래스가 자신이 해야 하는 일을 하기 위한 최소한의 지식만을 알고 그 외에는 아무것도 모르도록 의존성을 관리해야 한다.**

### 🎈 객체들 간의 결합
이런 의존성은 `Gear`를 `Wheel`에 **결합**(**couple**)시킨다. 다르게 표현해 이런 결합이 의존성을 낳는다고도 말할 수 있다.   
`Wheel`를 수정하면 `Gear`도 수정해야 된다.   
둘 이상의 객체가 강렬하게 결합되어 있을 때 이들은 한 덩어리로 움직이고 이들 중 하나만 재사용하는 것은 불가능하다.

### 🎈 다른 의존성들
메시지 연쇄는 원래 있던 두 객체 사이의 의존성뿐 아니라, 최종 목표까지 도달하기 위해 거쳐갔던 모든 객체와 메시지들 사이에도 의존성을 만들어낸다.   
연쇄의 중간에 끼어있던 어떤 객체가 변하더라도 이 변화가 첫 번째 객체에 영향을 미친다.   
이런 경우를 **데메테르의 원칙**이 위반되었다고 말한다.   
테스트-코드 사이의 지나친 결합은 코드-코드 사이의 지나친 결합과 같은 결과를 낳는다. 이 결합은 코드의 수정이 뒤이어 테스트의 수정을 강제하는 의존성이다.

## 📚 약하게 결합된 코드 작성하기

### 🎈 의존성 주입하기
`Gear` 클래스에서 `gear_inches` 메서드는 `Wheel` 클래스를 명시적으로 참조하고 있다.   

```ruby
class Gear
  attr_reader :chainring :cog, :rim, :tire
  def initialize(chainring, cog, rim, tire)
    @chainring = chainring
    @cog = cog
    @rim = rim
    @tire = tire
  end

  def ratio
    chainring / cog.to_f
  end

  def gear_inches
    ratio * Wheel.new(rim, tire).diameter
  end
  # ...
end
```

`Wheel` 클래스의 이름을 직접 참조할 때, 가장 눈에 띄는 결과는 `Wheel` 클래스의 이름이 바뀌면 `Gear`의 `gear_inches` 메서드도 함께 변경되어야 한다는 것이다.   
또한, 더 큰 문제는 `Gear`가 `Wheel`를 참조하는 부분을 `gear_inches` 메서드 속에 하드코딩해 놓았을 때 `Gear`는 `Wheel` 인스턴스의 기어 인치만을 계산하겠다고 명시적으로 선언하고 있는 것이다. `Gear`는 다른 종류의 객체와 협업하기를 거부하고 있는 것이다.   
그렇기 때문에 중요한 것은 객체의 클래스가 무엇인지가 아니라, **우리가 전송하는 메시지가 무엇인지**이다.   
`Gear`가 다른 객체에 대한 너무 많은 것을 알고 있을수록 `Gear`는 덜 유용해진다.   
`Gear` 클래스는 `Wheel`에 들러붙지 않고 `diameter`에 반응할 수 있는 객체만 가지고도 초기화될 수 있다.   

```ruby
class Gear
  attr_reader :chainring :cog, :wheel
  def initialize(chainring, cog, wheel)
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
  # ...
end

Gear.new(52, 11, Wheel.new(26, 15)).gear_inches
```

이런 스타일의 코딩은 `Wheel` 인스턴스를 `Gear` 클래스 바깥에서 생성하기 때문에 `Gear`와 `Wheel` 사이의 결합이 없어졌다.   
이런 기술을 **의존성 주입**(**dependency injection**)이라고 부른다.

### 🎈 의존성 격리시키기
불필요한 의존성을 모두 제거하면 가장 좋겠지만 기술적으로는 가능해도 현실적으로는 어렵다. 그렇기 때문에 전반적인 상태를 발전시키는 것이다.   

#### 🐤 인스턴스 생성을 격리시키기
만약 제약조건이 너무 많아서 `Gear`에 `Wheel`을 주입할 수 없다면 새로운 `Wheel` 인스턴스를 만드는 과정을 `Gear` 클래스 내부에 격리시켜 놓을 필요가 있다.   
다음은 첫 번째 예시로 새로운 `Wheel` 인스턴스를 생성하는 과정을 `Gear`의 `gear_inches` 메서드에서 `initialize` 메서드로 옮겼다. 이런 접근은 `Gear`가 새로운 인스턴스를 만들 때마다 무조건 새로운 `Wheel` 인스턴스를 생성한다.

```ruby
class Gear
  attr_reader :chainring :cog, :rim, :tire
  def initialize(chainring, cog, rim, tire)
    @chainring = chainring
    @cog = cog
    @wheel = Wheel.new(rim, tire)
  end

  def gear_inches
    ratio * wheel.diameter
  end
  # ...
end
```

다른 방법은 명시적으로 정의된 `Wheel` 메서드를 통해 새로운 `Wheel` 인스턴스를 만드는 방법이다. 이는 루비의 `||=` 연산자를 이용해서 객체가 필요한 순간에 왔을 때, `Wheel` 인스턴스를 만든다. 이런 경우, `gear_inches`가 `Wheel` 메서드를 호출하기 전까지는 `Wheel`의 인스턴스가 호출되지 않는다.

```ruby
class Gear
  attr_reader :chainring :cog, :rim, :tire
  def initialize(chainring, cog, rim, tire)
    @chainring = chainring
    @cog = cog
    @rim = rim
    @tire = tire
  end

  def gear_inches
    ratio * wheel.diameter
  end

  def wheel
    @wheel ||= Wheel.new(rim, tire)
  end
  # ...
end
```

하지만 이 역시 `Gear`는 너무 많은 것을 알고 있다. `rim`과 `tire`를 초기화 인자로 넘겨야 되고 `Gear`를 위해 `Wheel` 인스턴스를 만들어야 한다.   
그래도 `gear_inches`의 의존성을 줄였으며 `Gear`가 `Wheel`에 의존하고 있다는 사실을 뚜렷하게 드려낼 수 있다.

#### 🐤 외부로 전송하는 메시지 중 위험한 것들을 격리시키기
여기서 외부로 전송되는 메시지란 나 자신이 아닌 객체에게 보내는 메시지다.

```ruby
# diameter메시지는 wheel에게 보내고 있다.
def gear_inches
  ratio * wheel.diameter
end
```

외부에 대한 의존성을 걷어내고 의존성을 클래스 내부의 메서드 속에 캡슐화 시커 놓으면 `gear_inches` 메서드를 수정해야 하는 상활도 줄일 수 있다.

```ruby
def gear_inches
  ratio * diameter
end

def diameter
  wheel.diameter
end
```

위와 같이 구현하면 `Wheel`이 자신이 구현하고 있는 `diameter` 메서드의 이름과 시그니처를 바꾸더라도 `Gear`에게 미치는 영향은 이 래퍼 메서드에 한정될 것이다.   
클래스가 내부에서 변하기 쉬운 **메시지**를 참조하고 있을 때 이 기술을 유용하게 사용할 수 있다.

### 🎈 인자 순서에 대한 의존성 제거하기
다음 예시는 다음 세 개의 인자를 넘겨받는다.  
인자를 넘기는 것보다 중요한 건 모두 **정해진 순서대로** 넘겨야 한다는 점이다.

```ruby
class Gear
  attr_reader :chainring :cog, :wheel
  def initialize(chainring, cog, wheel)
    @chainring = chainring
    @cog = cog
    @wheel = wheel
  end
  # ...
end

Gear.new(52, 11, Wheel.new(26, 15)).gear_inches
```

`new` 메서드를 전송하는 송신자는 `Gear`의 `initialize` 메서드에서 정의된 인자의 순서에 의존적이다.

#### 🐤 초기화 인자로 해시를 사용하기
순서가 고정된 인자들에 의존하지 않는 방법으로는 순서가 고정된 인자 대신 옵션을 해시로 만들어서(hash of options) 넘기는 것이 좋다.   
아래의 에제에서 `args`만 넘겨받는데 이 `arg` 해시가 모든 입력값을 가지고 있다.

```ruby
class Gear
  attr_reader :chainring :cog, :wheel
  def initialize(args)
    @chainring = args[:chainring]
    @cog = arg[:cog]
    @wheel = arg[:wheel]
  end
  # ...
end

Gear.new(
  :chainring => 52,
  :cog => 11,
  :wheel => Wheel.new(26, 15)).gear_inches
```

위와 같은 방법의 이점은 **인자들의 순서에 대한 의존성을 제거했다는 점**이다.   
해시를 사용한 덕분에 인자의 순서에 대한 의존성을 없앨 수 있었지만 해시 키의 이름에 의존하게 되었다. 훨씬 안정적이고 수정해야만 하는 상황에 봉착할 위험이 훨씬 낫다.   
또 다른 이점으로는 **해시 키의 이름들이 인자에 대한 문서 역할을 해주는 것**이다.

#### 🐤 기본값을 사용하기
인자에 기본값을 추가할 수 있는 방법은 여러 가지 있다.   
`boolean`이 아닌 간단한 기본값은 루비의 `||` 메서드를 통해 추가할 수 있다.

```ruby
# ||를 이용한 기본값 설정
def initialize(args)
  @chainring = args[:chainring] || 40
  @cog = args[:cog] || 18
  @wheel = args[:wheel]
end
```
위 와 같은 방법은 가끔은 우리가 원하는 방식으로 작동하지 않는 경우가 있다. `||` 메서드는 or처럼 동작한다. 때문에 위 코드는 Hash의 `[]` 메서드의 특성, 즉 등록되지 않은 키에 대한 값을 요청하면 `nil`을 반환한다는 특성에 의존하고 있다.   
이러한 `||` 특성 때문에 불린 값을 인자로 받고 싶거나 `false`와 `nil`을 구분해야 하는 경우에는 `fetch` 메서드를 사용하는 것이 좋다.    
`fetch` 메서드는 우리가 사용하는 키가 해시에 정의되어 있기를 기대하며 키가 없을 경우에 대한 별도의 처리방식을 제공한다. `fetch`는 우리가 찾는 키가 없을 때 자동으로 `nil`을 반환하지 않는다는 장점이 있다.

```ruby
# fetch를 이용한 기본값 설정
def initialize(args)
  @chainring = args.fetch(:chainring || 40)
  @cog = args.fetch(:cog || 18)
  @wheel = args[:wheel]
end
```

`initialize` 메서드 속에서 기본값을 설정하는 코드를 완전히 제거하고 별도의 래퍼 메서드에서 기본값을 설정해주는 방법도 있다.   
`merge`는 `fetch`와 동일한 효과를 낳는다. 기본값이 훨씬 복잡한 경우에 특히 유효한 방법이다.   

```ruby
# default 해시를 merge해서 기본값을 설정
def initialize(args)
  args = defaults.merge(args)
  @chainring = args[:chainring]
  # ...
end

def defaults
  { :chainring => 40, :cog => 18 }
end
```

#### 🐤 멀티파라미터 초기화를 고립시키기
메서드를 수정할 수 없는 상황이 있을 수도 있는데 이럴 경우에 순서가 고정된 인자들을 갖고 있는 메서드를 사용해야만 하는 상황도 있다.   
반복되는 코드를 DRY하게 만들 수 있는 것과 마찬가지로 외부 인터페이스와 연결되는 지점, `Gear` 인스턴스를 생성하는 지점을 하나의 메서드로 감싸는 것을 통해 코드를 DRY하게 만들 수 있다.   
이 예시에서 `SomeFramework::Gear`는 건드릴 수 있는 애플리케이션이 아니라고 가정한다. 이 의존성을 해결하기 위해 `GearWrapper` 모듈을 만든다.   
`GearWrapper`는 외부 인터페이스에 대한 모든 지식을 한 곳에 고립시켜 놓을 뿐 아니라 애플리케이션이 사용할 수 있는 좀 더 나은 인터페이스를 제공한다.

```ruby
# Gear가 외부 프레임워크의 한 부분일 때
module SomeFramework
  class Gear
    attr_reader :chainring, :cog, :wheel
      def initialize(chainring, cog, wheel)
        @chainring = chainring
        @cog = cog
        @wheel = wheel
      end
    # ...
  end
end

# 외부 인터페이스를 감싸는 모듈을 만들어 변화를 받아들일 수 있도록 하자.
module GearWrapper
  def self.gear(args)
    SomeFramework::Gear.new(args[:chainring],
                            args[:cog],
                            args[:wheel])
  end
end

# 해시를 통해 Gear 인스턴스를 생성할 수 있게 되었다.
GearWrapper.gear(
  :chainring => 52,
  :cog => 11,
  :wheel => Wheel.new(26, 1.5)
).gear_inches
```

`GearWrapper`에 대해서 두 가지를 기억해야 되는데, 첫째로, **`GearWrapper`는 클래스가 아니라 루비의 모듈이다.**   
모듈을 이용해서 `GearWrapper` 인스턴스를 만들지 않고도 `gear` 메시지를 전송하는 명시적이고 독립적인 객체를 얻었다. `GearWrapper`는 인클루드하는 목적이 아니라 `gear` 메시지에 직접 반응하기 위한 것이다.   
두번째로 **오로지 다른 클래스의 인스턴스를 생성하기 위해서만 존재한다는 것이다.** 이런 객체를 **팩토리**(**Factories**)라고 부른다. 팩토리는 다른 객체를 만들기 위해 존재하는 객체이다.

## 📚 의존성의 방향 관리하기

### 🎈 의존성의 방향 바꾸기
지금까지 `Gear`는 `Wheel`이나 `diameter`에 의존했다. 하지만 이 의존성을 `Wheel`이 `Gear`나 `ratio`에 의존할 수 있게 반대로 설정할 수도 있다.

```ruby
class Gear
  attr_reader :chainring, :cog
  def initialize(chainring, cog)
    @chainring = chainring
    @cog = cog
  end

  def gear_inches(diameter)
    ratio * diameter
  end

  def ratio
    chainring / cog.to_f
  end
  # ...
end

class Wheel
  attr_reader :rim, :tire, :gear
  def initialize(rim, tire, chainring, cog)
    @rim = rim
    @tire = tire
    @gear = Gear.new(chainring, cog)
  end

  def diameter
    rim + (tire * 2)
  end

  def gear_inches
    gear.gear_inches(diameter)
  end
  # ...
end

Wheel.new(26, 1.5, 52, 11).gear_inches
```

의존성의 방향이 변경되었다고 해서 계산의 결과가 영향을 받는 것은 아니다.

### 🎈 의존성의 방향 결정하기
1. 어떤 클래스는 다른 클래스에 비해 요구사항이 더 자주 바뀐다.
2. 구체 클래스는 추상 클래스보다 수정해야 하는 경우가 빈번히 발생한다.
3. 의존성이 높은 클래스를 변경하는 것은 코드의 여러 곳에 영향을 미친다.

#### 🐤 변경된 가능성이 얼마나 높은지 이해하기
루비의 베이스 클래스들은 우리가 작성하는 클래스보다 훨씬 덜 바뀌기 때문에 이 베이스 클래스에 의존해도 괜찮다.   
프레임워크 클래스는 얼마나 완성도 있는지 우리 스스로 가늠해봐야 한다. 일반적으로는 우리가 작성하는 코드보다 프레임워크 코드가 더 안정적이다.   
왜 변경되는가와는 상관없이 애플리케이션에서 사용하는 모든 클래스는 다른 클래스와 비교해서 얼마나 변경되지 않는지를 기준으로 순위를 매겨볼 수 있다. 이 순위는 의존성의 방향을 결정하는 데 핵심적이다.

#### 🐤 구체적인 것과 추상적인 것을 인지하기
`Gear`가 `Wheel`, `Wheel.new`, `Wheel.new(rim, tire)`에 의존적일 때 `Gear`는 매우 구체적인 코드에 의존하고 있는 것이다.   
`Wheel`을 `Gear`에 주입하는 방식으로 코드를 수정하면서 `Gear`는 훨씬 추상적인 것에 의존하게 디었다.   
추상화의 훌륭한 점은 일반적이고 안정적인 성질을 지닌다는 점이다. 추상화된 인터페이스는 인터페이스가 기반하고 있던 구체 클래스보다 변경될 일이 훨씬 적어 훨씬 안전하다.

#### 🐤 의존성이 높은 클래스 만들지 않기
의존성이 높은 클래스는 작은 수정 하나 때문에 애플리케이션 전체를 뜯어 고치게 만드는 클래스. 이런 클래스를 가지고 있는 것 자체가 코드를 절대 수정하고 싶지 않게 만든다.

#### 🐤 문제가 되는 의존성을 찾아내기
언제 변화에 봉착하게 될지, 어느 정도로 추상화되어 있는지, 의존성이 몇 군데에 있는지를 검토한다.   
중요한 디자인 결정을 내려야 하는 순간 **수정을 해야 할 수 있는 가능성**이 **여러 의존성**과 만나는 지점에서 발생한다.

A. 추상화 영역: 변경이 발생할 가능성이 낮지만, 변경사항이 있으면 그 영향이 크다.   
B. 중립 영역: 변경이 발생할 가능성이 낮고, 그 영향도 미미하다.   
C. 중립 영역: 변경이 발생할 가능성이 높지만, 그 영향이 미미하다.   
D. 위험 영역: 이곳의 클래스들은 분명 변경될 것이며, 그 영향은 의존적인 객체들로 흘러들어갈 것이다.   

D 영역의 클래스들 때문에 애플리케이션을 수정하기가 어렵다. 작은 수정 하나 때문에 애플리케이션의 여러 곳을 수정해야 한다면 문제의 핵심에는 D 영역 클래스가 있을 것이다.   
다행히도, 근본적인 이슈를 이해하고 있으면 이런 문제들에 미리, 미리 대처할 수 있다.
**자기 자신보다 덜 변하는 것들에 의존하라.**
