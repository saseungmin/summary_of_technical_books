# 🍭 Chapter 3: 함수적 자료구조

## 🎃 함수적 자료구조의 의미
함수적 자료구조란 오직 순수 함수만으로 조작되는 자료구조이다. 순수 함수는 자료를 그 자리에서 변경하거나 기타 부수 효과를 수행하는 일이 없어야 함을 기억하기 바란다. **따라서 함수적 자료구조는 정의에 의해 불변이다.**   

가장 보변적인 함수적 자료구조라 할 수 있는 단일 연결 목록을 살펴보자. 다음의 단일 연결 목록 정의는 사실상 스칼라의 표준 라이브러리에 정의되어 있는 `List` 자료 형식의 것과 개념적으로 동일하다.

```scala
package fpinscala.datastructures

sealed trait List[+A]
case object Nil extends List[Nothing]
case class Cons[+A](head: A, tail: List[A]) extends List[A]

object List {
  def sum(ints: List[Int]): Int = ints match {
    case Nil => 0
    case Cons(x, xs) => x + sum(xs)
  }

  def product(ds: LIst[Double]): Double = ds match {
    case Nil => 1.0
    case Cons(0.0, _) => 0.0
    case Cons(x, xs) => x * product(xs)
  }

  def apply[A](as: A*): List[A] =
    if (as.isEmpty) Nil
    else Cons(as.head, apply(as.tail: _*))
}
```

일반적으로 자료 형식을 도입할 때는 `trait` 키워드를 사용한다. `trait` 키워드로 정의하는 특질(trait)은 하나의 추상 인터페이스로, 필요하다면 일부 메서드의 구현을 담을 수도 있다. 지금 예에서는 `trait`를 이용해서 `List`라는 특질을 정의한다. 이 특질에는 메서드가 하나도 없다. `trait` 앞에 `sealed`를 붙이는 것은 이 특질의 모든 구현이 반드시 이 파일 안에 선언되어 있어야 함을 뜻한다.   

그 다음에는 있는 `case` 키워드로 시작하는 두 줄은 `List`의 두 가지 구현, 즉 두 가지 **자료 생성자**이다. `List`는 자료 생성자 `Nil`로 표기되는 빈 목록일 수도 있고 자료 생성자 `Cons`(관례상 constructor의 줄임말로 쓰인다)로 표기되는 비지 않은 목록일 수도 있다. 비지 않은 목록은 초기 요소 `head` 다음에 나머지 요소들을 담은 하나의 `List`로 구성된다.

```scala
case object Nil extends List[Noting]
case class Cons[+A](head: A, tail: List[A]) extends List[A]
```

함수를 다형적으로 만들 수 있듯이, 자료 형식도 다형적으로 만들 수 있다. `sealed trait List` 다음에 형식 매개변수 `[+A]`를 두고 `Cons` 자료 생성자 안에서 그 `A` 매개변수를 사용함으로써, 목록에 담긴 요소들의 형식에 대해 다형성이 적용되는 `List` 자료 형식이 만들어진다. 그러면 하나의 동일한 정의로 `Int` 요소들의 목록, `Double` 요소들의 목록, `String` 요소들의 목록 등등을 사용할 수 있게 된다(형식 매개 변수 `A`에 있는 `+`는 **공변**을 뜻한다).   

자료 생성자 선언은 해당 형태의 자료 형식을 구축하는 함수를 도입한다. 다음은 자료 생성자의 용레 몇 가지이다.

```scala
val ex1: List[Double] = Nil
val ex2: List[Int] = Cons(1, Nil)
val ex3: List[String] = Cons("a", Cons("b", Nil))
```

`case object Nil`에 의해 `Nil`이라는 표기를 이용해서 빈 `List`를 구축할 수 있게 되며, `case class Cons`는 `Cons(1, Nil), Cons("a", Cons("b", Nil))` 같은 표기를 통해서 임의의 길이의 단일 연결 목록을 구축할 수 있게 한다. `List`는 형식 `A`에 대해 매개변수화되어 있으므로, 이 함수들 역시 서로 다른 형식의 `A`에 대해 인스턴스화되는 다형적 함수들이다.   

각 자료 생성자는 `sum`이나 `product` 같은 함수들에서처럼 **패턴 부합**(pattern matching)에 사용할 수 있는 **패턴**도 도입한다.

## 🎃 패턴 부합
`object List`에 속한 함수 `sum`과 `product`를 자세히 살펴보자. 이런 함수들은 `List`의 `동반 객체`(companion object)라고 부르기도 한다. 두 함수 모두 패턴 부합을 활용한다.

```scala
def sum(ints: List[Int]): Int = ints match {
  case Nil => 0
  case Cons(x, xs) => x + sum(xs)
}

def product(ds: LIst[Double]): Double = ds match {
  case Nil => 1.0
  case Cons(0.0, _) => 0.0
  case Cons(x, xs) => x * product(xs)
}
```

이들이 재귀적인 정의임을 주목하기 바란다. `List` 같은 재귀적인 자료 형식을 다루는 함수들을 작성할 때는 이처럼 재귀적인 정의를 사용하는 경우가 많다.   

패턴 부합은 표현식의 구조를 따라 내려가면서 그 구조의 부분 표현식을 추출하는 복잡한 `switch` 문과 비슷하게 작동한다. 부합의 각 경우 문은 `=>` 의 좌변에 **패턴**이 있고 그 우변에 **결과**가 있는 형태이다. 대상의 경우 문의 패턴과 **부합**하면, 그 경우 문의 결과가 전체 부합 표현식의 결과가 된다. 만일 대상과 부합하는 패턴이 여러 개면 스칼라는 처음으로 부합하는 경우 문을 선택한다.

## 🎃 함수적 자료구조의 자료 공유
자료가 불변이라면, 예를 들어 목록에 요소를 추가하거나 목록에서 요소를 제거하는 함수는 어떻게 작성해야 할까? 기존 목록의 앞에 1이라는 요소를 추가하려면 `Cons(1, xs)`라는 새 목록을 만들면 된다. 목록은 불변이므로 `xs`를 실제로 복사할 필요는 없다. 그냥 재사용하면 된다. 이를 **자료 공유**라고 부른다. 불변이 자료를 공유하면 함수를 좀 더 효율적으로 구현할 수 있을 때가 많다. 자료가 변하거나 깨지지 않도록 방어적으로 복사본을 만들어 둘 필요가 없는 것이다.   

이를 두고 함수적 자료구조는 **영속적**(persistent)이라고 말한다. 이는 자료구조에 연산이 가해져도 기존의 참조들이 결코 변하지 않음을 뜻한다.

### 🎈 자료 공유의 효율성
자료 공유를 이용하면 연산을 좀 더 효율적으로 수행할 수 있는 경우가 많다. 자료 공유의 더욱 놀라는 예로, 다음 함수는 한 목록의 모든 요소를 다른 목록의 끝에 추가한다.

```scala
def append[A](a1: List[A], a2: List[A]): List[A] =
  a1 match {
    case Nil => a2
    case Cons(h, t) => Cons(h, append(t, a2))
  }
```

이 정의는 오직 첫 목록이 다 소진될 때까지만 값들을 복사함을 주의하기 바란다. 따라서 이 함수의 실행 시간과 메모리 사용량은 오직 `a1`의 길이에만 의존한다. 목록의 나머지는 그냥 `a2`를 가리킬 뿐이다. 만일 이 함수를 배열 두 개를 이용해서 구현한다면 두 배열의 모든 요소를 결과 배열에 복사해야 했을 것이다. 이 경우 불변이 연결 목록이 배열보다 훨씬 효율적이다.   

단일 연결 목록의 구조 때문에, `Cons`의 `tail`의 치환할 때마다 반드시 이전의 모든 `Cons` 객체를 복사해야 한다. 서로 다른 연산들을 효율적으로 지원하는 순수 함수적 자료구조를 작성할 때의 관건은 자료 공유를 현명하게 활용하는 방법을 찾아내는 것이다. (스칼라 표준 라이브러리의 순수 함수적 순차열 구현인 Vector를 참고)

### 🎈 고차 함수를 위한 형식 추론 개선
`dropWhile` 같은 고차 함수에는 흔히 익명 함수를 넘겨준다. 그럼 전형적인 예를 하나 보자. 우선 `dropWhile`의 서명을 떠올려보자.

```scala
def dropWhile[A](l: List[A], f: A => Boolean): List[A]
```

인수 `f`에 익명 함수를 지정해서 호출하기 위해서는 그 익명 함수의 인수의 형식을 명시해야 한다.

```scala
val xs: List[int] = List(1,2,3,4,5)
val ex1 = dropWhile(xs, (x: Int) => x < 4)
// List(4,5)
```

`x`의 형식이 `Int`임을 명시적으로 표기해야 한다는 것은 다소 번거롭다. `dropWhile`의 첫 인수는 `List[Int]`이므로, 둘째 인수의 함수는 반드시 `Int`를 받아야 한다. 다음처럼 `dropWhile`의 인수들을 두 그룹으로 묶으면 스칼라가 그러한 사실을 추론할 수 있다.

```scala
def dropWhile[A](as: List[A])(f: A => Boolean): List[A] =
  as match {
    case Cons(h, t) if f(h) => dropWhile(t)(f)
    case _ => as
  }
```

이 버전은 `dropWhile`을 호출하는 구문은 `dropWhile(xs)(f)`의 형태이다. 즉, `dropWhile(xs)`는 하나의 함수를 돌려주며, 그 함수를 인수 `f`로 호출한다. 인수들을 이런 식으로 묶는 것은 스칼라의 형식 추론을 돕기 위한 것이다. 이제는 `dropWhile`을 다음과 같이 형식 주해 없이 호출할 수 있다.

```scala
val xs: List[Int] = List(1,2,3,4,5)
val ex1 = dropWhile(xs)(x => x < 4)
```

`x`의 형식을 명시적으로 지정하지 않았음을 주목하기 바란다.   

좀 더 일반화하자면, 함수 정의에 여러 개의 인수 그룹이 존재하는 경우 형식 정보는 그 인수 그룹들을 따라 왼쪽에서 오른쪽으로 흘러간다. 이처럼, 형식 추론이 최대로 일어나도록 함수 인수들을 적절한 순서의 여러 인수 목록을 묶는 경우가 많다.

## 🎃 목록에 대한 재귀와 고차 함수로의 일반화
`sum`과 `product`의 구현을 다시 살펴보자.

```scala
def sum(ints: List[Int]): Int = ints match {
  case Nil => 0
  case Cons(x, xs) => x + sum(xs)
}

def product(ds: LIst[Double]): Double = ds match {
  case Nil => 1.0
  case Cons(x, xs) => x * product(xs)
}
```

두 정의가 아주 비슷하다는 점에 주목하자. 이런 코드 중복을 발견했다면 부분 표현식들을 추출해서 함수 인수로 대체함으로써 코드를 일반화하는 것이 항상 가능하다. 일반화된 함수는 빈 목록일 때의 반환값과 비지 않은 목록일 때 결과에 요소를 추가하는 함수를 인수로 받는다.

```scala
def foldRight[A, B](as: List[A], z: B)(f: (A, B) => B): B =
  as match{
    case Nil => z
    case Cons(x, xs) => f(x, foldRight(xs, z)(f))
  }

def sum2(ns: List[Int]) =
  foldRight(ns, 0)((x,y) => x + y)

def product2(ns: List[Double]) = 
  foldRight(ns, 1.0)(_ * _) // (x, y) => x * y를 좀 더 간결하게 표기한 것이다.
```

`foldRight`는 하나의 요소 형식에만 특화되지 않았다. 그리고 일반화 과정에서 우리는 이 함수가 돌려주는 값이 목록의 요소와 같은 형식일 필요가 없다는 점도 알게 되었다. `foldRight`가 하는 일을 이런 식으로 설명할 수 있다: 이 함수는 다음에서 보듯이 목록의 생성자 `Nil`과 `Cons`를 `z`와 `f`로 치환한다.

```scala
Cons(1, Cons(2, Nil))
f(1, f(2, z))
```

`foldRight`가 하나의 값으로 축약되려면 반드시 목록의 끝까지 순회해야 함을 주목하기 바란다.

### 🎈 그 외의 목록 조작 함수들
목록을 처리하는 함수를 작성할 때는 명시적인 재귀 함수를 일반화하는 여러 방법을 고려해 보는 습관을 가지길 바란다. 그렇게 하면 이런 함수들을 스스로 (재)발견하게 될 것이며, 그러다 보면 각각의 적절한 용도를 본능적으로 알게 될 것이다.

#### 표준 라이브러리의 목록들
스칼라 표준 라이브러리(API 문서화는 http://mng.bz/vu45)에도 `List`가 있다.   

표준 라이브러리의 목록에는 이외에도 여러 가지 유용한 메서드가 있다. 지금까지 본 메서드들과 달리 이들은 독립적인 함수가 아니라 `List[A]`의 메서드로 정의되어 있다.
- `def take(n: Int): List[A]` - `this`의 처음 `n`개의 요소들로 이루어진 목록을 돌려준다.
- `def takeWhile(f: A => Boolean):List[A]` - 주어진 술어 `f`를 만족하는, `this`의 가장 긴 선행 요소들로 이루어진 목록을 돌려준다.
- `def forall(f: A => Boolean): Boolean` - `this`의 모든 요소가 술어 `f`를 만족할때만 `true`를 돌려준다.
- `def exists(f: A => Boolean): Boolean` - `this`의 요소들 중 하나라도 `f`를 만족하는 것이 있으면 `true`를 돌려준다.
- `scanLeft`와 `scanRight` - `foldLeft` 및 `foldRight`와 비슷하되 최종적으로 누적된 값만 돌려주는 것이 아니라 부분 결과들의 `List`를 돌려준다.

### 🎈 단순 구성요소들로 목록 함수를 조립할 때의 효율성 손실
`List`의 한 가지 문제는, 어떤 연산이나 알고리즘을 아주 범용적인 함수들로 표현할 수 있긴 하지만 그 결과로 만들어진 구현이 항상 효율적이지는 않는다는 점이다. 같은 입력을 여러 번 훑는 구현이 만들어질 수 있으며, 이른 종료를 위해서는 명시적인 재귀 루푸를 작성해야 할 수 있다.

## 🎃 트리
`List`는 소위 **대수적 자료 형식**(algebraic data tye, ADT)이라고 부르는 것의 한 예일 뿐이다. (이 ADT를 다른 분야에서 말하는 추상 자료 형식과 혼동하지 말기 바란다.) ADT는 하나 이상의 자료 생성자들로 이루어진 자료 형식일 뿐이다. 그러한 자료 생성자들은 각각 0개 이상의 인수를 받을 수 있다. 이러한 자료 형식을 해당 자료 생성자들이 **합**(sum) 또는 **합집합**(union)이라고 부르며, 각각의 자료 생성자는 해당 인수들의 **곱**(product)이라고 부른다. 대수적 자료 형식이라는 이름에 걸맞게 **대수학**(algebra)의 용어들이 쓰임을 주목하기 바란다.   

대수적 자료 형식을 다른 자료구조의 정의에 사용할 수 있다.  그럼 간단한 이진 트리 자료구조를 정의해 보자.

```scala
sealed trait Tree[+A]
case class Leaf[A](value: A) extends Tree[A]
case class Branch[A](left: Tree[A], right: Tree[A]) extends Tree[A]
```

> **ADT와 캡슐화**   
> 대수적 자료 형식이 형식의 내부 표현을 공용(public)으로 노출하므로 캡슐화를 위반한다는 불평이 있을 수 있다. 함수형 프로그래밍에서는 캡슐화 문제를 다르게 취급한다. 함수적 자료 형식에는 그 내부를 노출한다고 해도 버그로 이어지거나 불변식이 위반될만한 예민한 가변 상태가 별로 없다. 형식의 자료 생성자를 노출해도 별문제가 없는 경우가 많으며, 그러한 노출의 결정은 자료 형식의 API 중 어떤 것을 공용으로 노출할 것인지를 결정하는 것과 상당히 비슷한 방식으로 이루어진다.
