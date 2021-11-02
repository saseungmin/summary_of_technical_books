# 🍭 Chapter 2: 스칼라로 함수형 프로그래밍 시작하기

## 🎃 스칼라 언어의 소개: 예제 하나
이번 절의 목표는 스칼라 언어와 그 구문(문법)을 소개하는 것일 뿐이다.

```scala
// 이것은 주석!
/* 이것도 주석 */
/** 문서화 주석 */
object MyModule { // 단일 객체의 선언 클래스와 클래스의 유일한 인스턴스를 동시에 선언한다.
  def abs(n: Int): Int =
    // 만약 n이 0보다 작으면 n의 부정(부호가 반대)을 돌려준다.
    if (n < 0) -n
    else n

  // 전용(private) 메서드는 오직 MyModule의 다른 멤버들만 호출할 수 있다.
  private def formatAbs(x: Int) = {
    // 수치를 위한 자리표 %d가 두 개 있는 문자열.
    val msg = "The absolute value of %d is %d"
    // 문자열 두 %d 자리표를 각각 x와 abs(x)로 치환한다.
    msg.format(x, abs(x))
  }

  // Unit은 Java나 C 같은 언어의 void와 같은 목적으로 쓰인다.
  def main(args: Array[String]): Unit = 
    println(formatAbs(-42))
}
```

스칼라 코드는 반드시 `object`로 선언되는 객체나 `class`로 선언되는 클래스 안에 들어가야 하는데, 여기서는 둘 중 더 간단한 `object`를 사용한다.   

`abs` 메서드는 정수 하나를 받아서 그 절댓값을 돌려주는 순수 함수이다.

```scala
def abs(n: Int): Int =
  if (n < 0) -n
  else n
```

메서드 자체의 본문은 등호(`=`) 다음에 온다. 흔히, 메서드 선언에서 등호 왼쪽애 았는 것을 **좌변** 또는 **서명**이라고 부르고 등호 오른쪽의 코드를 **우변** 또는 **정의**라고 부른다. 메서드의 정의에 명시적인 `return` 키워드가 없다. 그냥 우변의 평가 결과가 곧 메서드의 반환값이다.

`formatAbs` 메서드 역시 순수 함수이다.

```scala
private def formatAbs(x: Int) = {
  val msg = "The absolute value of %d is %d"
  msg.format(x, abs(x))
}
```

이 메서드는 `private`로 선언되어 있다. 이는 이 메서드를 `MyModule` 객체의 오부에서는 호출할 수 없음을 뜻한다. 이 함수는 `Int` 하나를 받고 `String` 하나를 돌려주는다, 반환 형식이 선언되어 있지 않다. 스칼라가 메서드의 반환 형식을 추론할 수 있는 경우가 많으며, 그럴 때에는 반환 형식을 생략할 수 있다. 그러나 다른 사람이 사용할 메서드에서는 반환 형식을 명시적으로 지정해 주는 것이 대체로 좋은 스타일로 간주된다.   

마지막으로, `main` 메서드는 순수 함수적 핵심부를 호출하고 그 결과를 콘솔에 출력하는 외부 계층(shell)이다. 부수 효과가 발생함을 강조하기 위해, 이런 메서드를 **절차**(procedure) 또는 **불순 함수**(impure function)라고 부르기도 한다.

```scala
def main(args: Array[String]): Unit = 
  println(formatAbs(-42))
```

`main`이라는 이름은 특별하다. 프로그램을 실행할 때 스칼라가 특정한 서명을 가진 `main`이라는 이름의 메서드를 찾기 때문이다. 좀 더 구체적으로, `main` 메서드는 반드시 `String`들의 `Array`를 인수로 받아야 하며, 반환 형식은 반드시 `Unit`이어야 한다.   

스칼라에서 모든 메서드는 폭주하지 않는 한 어떤 값을 돌려준다. 그런데 `main`은 딱히 의미 있는 값을 돌려주지 않는다. 특별한 형식인 `Unit`은 그런 ㄴ메서드의 반환 형식으로 쓰인다. 일반적으로, 반환 형식이 `Unit`이라는 것은 그 메서드에 부수 효과가 존재함을 암시한다.

## 🎃 프로그램의 실행
보통은 스칼라용 빌드 도구인 sbt를 이용하거나 IntelliJ나 Eclipse 같은 IDE를 이용해 스칼라 코드를 구축하고 실행한다.   

이 스칼라 프로그램(MyModule)을 실행하는 가장 간단한 방법은 명령줄에서 직접 스칼라 컴파일러는 불러오는 것이다. 우선 앞의 프로그램을 `MyModule.scala`와 같은 이름의 파일로 저장하고, 다음과 같이 `scalac` 컴파일러를 이용해서 그 프로그램을 Java 바이트코드로 컴파일 한다. 이렇게 하면 확장자가 `.class`인 파일들이 생긴다. 이 파일들에는 Java 가상 기게(JVM)로 실행할 수 있는 컴파일된 코드가 들어 있다. 그 코드를 명령줄 도구 scala를 이용해서 직접 실행할 수 있다.   

또 다른 방법으로, 스칼라 해석기의 대화식 모드, 즉 REPL(read-evaluate-print loop)을 이용해도 된다. REPL은 독자가 스칼라 프로그래머로서 자주 사용하게 될 도구이므로, REPL의 여러 가지 기능에 익숙하지면 도움이 될 것이다.

## 🎃 모듈, 객체, 이름공간
`MyModule`은 `abs`가 속한 **이름공간**(namespace)이다. 몇 가지 세부적인 사항을 생략할 때, 스칼라의 모든 값은 소위 **객체**(object)이며, 각각의 객체는 0개 또는 하나 이상의 **멤버**(member)를 가질 수 있다. 자신의 멤버들에게 이름공간을 제공하는 것이 주된 목적인 객체를 흔히 **모듈**(module)이라고 부른다. 멤버는 `def` 키워드로 선언된 메서드일 수도 있고 `val`이나 `object`로 선언된 또 다른 객체일 수도 있다.   

스칼라에는 **연산자**라는 특별한 개념이 존재하지 않는다. 스칼라에서 `+`는 그냥 유효한 메서드 이름일 뿐이며, 인수 하나인 메서드는 그 어떤 것이라도 마침표와 괄호를 생략한 중위 표기법으로 호출할 수 있다. 예를 들어 `MyModule.abs(42)` 대신 `MyModule abs 42`라고 해도 같은 결과가 된다. 그러면 객체 이름을 생략할 수 있다.   

그리고 다음과 같이 밑줄 표기법을 이용하면 객체의 **모든** 비전용 멤버를 법위에 도입할 수 있다.

```scala
import MyModule._
```

## 🎃 고차 함수: 함수를 함수에 전달
정수나 문자열, 목록 같은 다른 형식의 값처럼 함수도 변수에 배정하거나 자료구조에 저장하거나 인수로서 함수에 넘겨줄 수 있다.   

순수한 함수적 프로그램을 작성할 때는 다른 함수를 인수로 받는 함수를 작성하는 것이 유용한 경우가 많다. 그런 함수를 **고차 함수**(higher-order function, HOF)라고 부른다.

### 🎈 잠깐 곁가지: 함수적으로 루프 작성하기
계승을 구하는 factorial 함수부터 작성해보자.

```scala
def factorial(n: Int): Int = {
  def go(n: Int, acc: Int): Int =
    if (n <= 0) acc
    else go(n - 1, n*acc)

  go(n, 1)
}
```

루프를 함수적으로 작성하는 방법은 바로 재귀 함수를 이용하는 것이다. 스칼라는 이런 종류의 **자기 재귀**(self-recursion)를 검출해서, 재귀 호출이 **꼬리 위치**(tail position)에서 일어난다면 `while` 루프를 사용했을 때와 같은 종료의 바이트코드로 컴파일한다. 핵심은, 재귀 호출의 반환 이우에 특별히 더 하는 일이 없다면 이런 종류의 최적화(꼬리 호출 제거라고 부른다)가 적용된다는 것이다.

> **스칼라의 꼬리 호출**   
> 호출자가 재귀 호출의 결과를 그래도 돌려주는 것 외에는 아무 일도 하지 않을 때, 그런 호출을 **꼬리 위치**에서의 호출, 줄여서 꼬리 호출이라고 말한다. 만약에 `1 + go(n - 1, n * acc)` 재귀 호출 인 경우 더 이상 꼬리 호출이 아니다. `go`의결과에 대해 다른 어떤 일(1을 더하는 것)을 수행해야 하기 떄문이다.   
> 한 함수가 수행하는 모든 재귀 호출이 꼬리 호출이면 스칼라는 해당 재귀를 매 반복마다 호출 스택을 소비하지 않는 반복 루프 형태로 컴파일 한다. 기본 설정에서 스칼라 컴파일러는 꼬리 호출 제거의 성공 여부를 알려주지 않지만, 자신이 작성한 재귀 함수에 대해 꼬리 호출이 실제로 제거되었는지 확인할 필요가 있다면 tailrec 주해(http://mng.bz/bWT5)를 재귀 함수에 적용하면 된다.

### 🎈 첫 번째 고차 함수 작성
`factorial` 함수를 만들었으니, 이제 이 함수를 사용하도록 예제 프로그램을 수정해 보자.

```scala
object MyModule {
  def abs(n: Int): Int =
    if (n < 0) -n
    else n

  def factorial(n: Int): Int = {
    def go(n: Int, acc: Int): Int =
      if (n <= 0) acc
      else go(n - 1, n*acc)

    go(n, 1)
  }

  private def formatAbs(x: Int) = {
    val msg = "The absolute value of %d is %d"
    msg.format(x, abs(x))
  }

  private def formatFactorial(n: Int) = {
    val msg = "The factorial of %d is $d."
    msg.format(n, factorial(n))
  }

  def main(args: Array[String]): Unit = {
    println(formatAbs(-42))
    println(formatFactorial(7))
  }
}
```

두 함수 `formatAbs`와 `formatFactorial`은 거의 동일하다 이 둘을 다음처럼 인수들에 적용할 **함수**를 인수로 받는 하나의 함수 `formatResult`로 일반화하면 어떨까?

```
def formatResult(name: String, n: Int, f: Int => Int) = {
  val msg = "The %s of %d is %d."
  msg.format(name, n, f(n))
}
```

이 `formatResult` 함수는 `f`라는 다른 함수를 받는 하나의 고차 함수다. 다른 인수들처럼 `f`에도 형식을 지정했다. 이 인수의 형식은 `Int => Int`인데, `f`가 정수 인수 하나를 받고 정수 하나를 돌려주라는 뜻이다.   

```
formatResult("absolute value", -42, abs)
formatResult("factorial", 7, factorial)
```
