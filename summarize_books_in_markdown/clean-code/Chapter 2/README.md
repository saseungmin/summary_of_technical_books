# 🍭 Chapter 2: 의미있는 이름

## 🎃 의도를 분명히 밝혀라
좋은 이름을 지으려면 시간이 걸리지만 좋은 이름으로 절약하는 시간이 훨씬 더 많다. 그러므로 이름을 주의 깊게 살펴 더 나은 이름이 떠오르면 개선하기 바란다. 그러면 코드를 읽는 사람이 좀 더 행복해지리라.   

변수나 함수 그리고 클래스 이름은 다음과 같은 굵직한 질문에 모두 답해야 한다. 변수(혹은 함수나 클래스)의 존재 이유는? 수행 기능은? 사용 방법은? 따로 주석이 필요하다면 의도를 분명히 드러내지 못했다는 말이다.   

```java
int d; // 경과 시간(단위: 날짜)
```

이름 `d`는 아무 의미도 드러나지 않는다. 경과 시간이나 날짜라는 느낌이 안 든다. 측정하려는 값과 단위를 표현하는 이름이 필요하다.

```java
int elapsedTimeInDays;
int daysSinceCreation;
int daysSinceModification;
int fileAgeInDays;
```

의도가 드러나는 이름을 사용하면 코드 이해와 변경이 쉬워진다. 다음 코드는 무엇을 할까?

```java
public List<int[]> getThem() {
  List<int[]> list1 = new ArrayList<int[]>();

  for (int[] x : theList)
    if (x[0] == 4)
      list1.add(x);

  return list1;
}
```

코드가 하는 일을 짐작하기 어렵다. 문제는 코드의 단순성이 아니라 코드의 **함축성**이다. 다시 말해, 코드 맥락이 코드 자체에 명시적으로 드러나지 않는다. 위 코드는 암암리에 독자와 다음과 같은 정보를 안다고 가정한다.

1. `theList`에 무엇이 들었는가?
2. `theList`에서 0번째 값이 어째서 중요한가?
3. 값 4는 무슨 의미인가?
4. 함수가 반환하는 리스트 `list1`을 어떻게 사용하는가?

위 코드 샘플엔 이와 같은 정보가 드러나지 않는다. 하지만 정보 제공은 **충분히 가능했었다.** 지뢰찾기 게임을 만든다고 가정하자. 그러면 `theList`가 게임판이라는 사실을 안다. `theList`를 `gameBoard`로 바꿔보자.   

게임판에서 각 칸은 단순 배열로 표현한다. 배열에서 0번째 값은 칸 상태를 뜻한다. 값 4는 깃발이 꽂힌 상태를 가리킨다. 각 개념에 이름만 붙여도 코드가 상당히 나아진다.

```java
public List<int[]> getFlaggedCells() {
  List<int[]> flaggedCells = new ArrayList<int[]>();

  for (int[] cell : gameBoard)
    if (cell[STATUS_VALUE] == FLAGGED)
      flaggedCells.add(cell);

  return flaggedCells;
}
```

위에서 보듯, 코드의 단순성은 변하지 않았다. 연산자 수와 상수 수는 앞의 예와 똑같으며, 들여쓰기 단계도 동일하다. 그런데도 코드는 더욱 명확해졌다.   

한 걸음 더 나아가, `int` 배열을 사용하는 대신, 칸을 간단한 클래스로 만들어도 되겠다. `isFlagged`라는 좀 더 명시적인 함수를 사용해 `FLAGGED`라는 상수를 감춰도 좋겠다.

```java
public List<Cell> getFlaggedCells() {
  List<Cell> flaggedCells = new ArrayList<Cell>();

  for (Cell cell : gameBoard)
    if (cell.isFlagged())
      flaggedCells.add(cell);

  return flaggedCells;
}
```

단순히 이름만 고쳤는데도 함수가 하는 일을 이해하기 쉬워졌다. 바로 이것이 좋은 이름이 주는 위력이다.

## 🎃 그릇된 정보를 피하라
프로그래머는 코드에 그릇된 단서를 남겨서는 안 된다. 그릇된 단서는 코드 의미를 흐린다. 나름대로 널리 쓰이는 의미가 있는 단어를 다른 의미로 사용해도 안 된다. 예를 들어, `hp`, `aix`, `sco`는 변수 이름으로 적합하지 않다. 유닉스 플랫폼이나 유닉스 변종을 가리키는 이름이기 떄문이다.   

여러 계정을 그룹으로 묶을 때, 실제 `List`가 아니라면, `accountList`라 명명하지 않는다. 프로그래머에게 `List`라는 단어는 특수한 의미다. 그러므로 `accountGroup`, `bunchOfAccounts`, 아니면 단순히 `Accounts`라 명명한다.   

서로 흡사한 이름을 사용하지 않도록 주의한다. 한 모듈에서 `XYZControllerForEfficientHandlingOfStrings`라는 이름을 사용하고, 조금 떨어진 모듈에서 `XYZControllerForEfficientStorageOfStrings`라는 이름을 사용한다면? 차이를 알아챘는가? 두 단어는 겁나게 비슷하다.   

유사한 개념은 유사한 표기법을 사용한다. 이것도 **정보**다. 일관성이 떨어지는 표기법은 **그릇된 정보**다. 이름으로 그릇된 정보를 제공하는 진짜 끔찍한 예가 소문자 `L`이나 대문자 `O` 변수다. 두 변수를 한꺼번에 사용하면 더욱 끔찍해진다. 소문자 `L`은 숫자 1처럼 보이고 대문자 `O`는 숫자 0처럼 보인다.

## 🎃 의미 있게 구분하라
컴파일러나 인터프리터만 통과하려는 생각으로 코드를 구현하는 프로그래머는 스스로 문제를 일으킨다. 예를 들어, 동일한 범위 안에서는 다른 두 개념에 같은 이름을 사용하지 못한다. 이름이 달라야 한다면 의미도 달라져야 한다.   

연속적인 숫자를 덧붙인 이름(a1, a2, ..., aN)은 의도적인 이름과 정반대다. 이런 이름은 그릇된 정보를 제공하는 이름도 아니며, 아무런 정보를 제공하지 못하는 이름일 뿐이다. 저자 의도가 전혀 드러나지 않는다.

```java
public static void copyChars(char a1[], char a2[]) {
  for (int i = 0; i < a1.length; i++) {
    a2[i] = a1[i];
  }
}
```

함수 인수 이름으로 `source`와 `destination`을 사용한다면 코드 읽기가 훨씬 더 쉬워진다.   

불용어를 추가한 이름 역시 아무런 정보도 제공하지 못한다. `Product`라는 클래스가 있다고 가정하자. 다른 클래스를 `ProductInfo` 혹은 `ProductData`라 부른다면 개념을 구분하지 않은 채 이름만 달리한 경우다. `Info`나 `Data`는 `a`, `an`, `the`와 마찬가지로 의미가 불분명ㅇ한 불용어다.   

`a`나 `the`와 같은 접두어를 사용하지 말라는 소리가 아니다. 의미가 분명히 다르다면 사용해도 무방하다.   

불용어는 중복이다. 변수 이름에 `variable`이라는 단어는 단연코 금물이다. 표이름에 `table`이라는 단어도 마찬가지다. `NameString`이 `Name`보다 뭐가 나은가? `Name`이 부동소수가 될 가능성이 있던가? 그렇다면 앞서 언급한 "그릇된 정보를 피하라" 규칙을 위반한다.   

개발자를 보호하고자 이름을 바꿨으나 오류 형태는 정확히 다음과 같다.

```java
getActiveAccount();
getActiveAccounts();
getActiveAccountInfo();
```

이 프로젝트에 참여한 프로그래머는 어느 함수를 호출할지 어떻게 알까?   

명확한 관례가 없다면 변수 `moneyAmount`는 `money`와 구분이 안 된다. `customerInfo`는 `customer`와, `accountData`는 `account`와, `theMessage`는 `message`와 구분이 안 된다. 읽는 사람이 차이를 알도록 이름을 지어라.   

## 🎃 발음하기 쉬운 이름을 사용하라
발음하기 어려운 이름은 토론하기도 어렵다. 발음하기 쉬운 이름은 중요하다. 프로그래밍은 사회 활동이기 때문이다.

```java
class DtaRcrd102 {
  private Date genymdhms;
  private Date modymdhms;
  private final String pszqint = "102";
  /* ... */
}

class Customer {
  private Date generationTimestamp;
  private Date modificationTimestamp;
  private final String recordId = "102";
  /* ... */
}
```

둘째 코드는 지적인 대화가 가능해진다. *"마이키, 이 레코드 좀 보세요. 'Generation Timestamp'값이 내일 날짜입니다! 어떻게 이렇죠?"*

## 🎃 검색하기 쉬운 아름을 사용하라
문자 하나를 사용하는 이름과 상수는 텍스트 코드에서 쉽게 눈에 띄지 않는다는 문제점이 있다.   

`MAX_CLASSES_PER_STUDENT`는 `grep`으로 찾기가 쉽지만, 숫자 7은 은근히 까다롭다. 7이 들어가는 파일 이름이나 수식이 모두 검색되기 때문이다. 이런 관점에서 긴 이름이 짧은 이름보다 좋다. 검색하기 쉬운 이름이 상수보다 좋다.   

개인적으로는 간단한 메서드에서 로컬 변수만 한 문자를 사용한다. **이름 길이는 범위 크기에 비례해야 한다.** 변수나 상수를 코드 여러 곳에서 사용한다면 검색하기 쉬운 이름이 바람직하다.

```java
// 1
for (int j = 0; j < 34; j++) {
  s += (t[j] * 4) / 5;
}

// 2
int realDaysPerIdealDay = 4;
const int WORK_DAYS_PER_WEEK = 5;
int sum = 0;

for (int j = 0; j < NUMBER_OF_TASKS; j++) {
  int realTaskDays = taskEstimate[j] * realDaysPerIdealDay;
  int realTaskWeeks = (realTaskDays / WORK_DAYS_PER_WEEK);
  sum += realTaskWeeks;
}
```

위 코드에서 `sum`이 별로 유용하진 않으나 최소한 검색이 가능하다. 이름을 의미있게 지으면 함수가 길어진다. 하지만 `WORK_DAYS_PER_WEEK`를 찾기가 얼마나 쉬운지 생각해보라. 그냥 5를 사용한다면 5가 들어가는 이름을 모두 찾은 후 의미를 분석해 원하는 상수를 가려내야 하리라.

## 🎃 인코딩을 피하라
문제 해결에 집중하는 개발자에게 인코딩은 불필요한 정신적 부담이다. 인코딩한 이름은 거의다 발음하기 어려우며 오타가 생기기도 쉽다.   

### 🎈 헝가리식 표기법
요즘 나오는 프로그래밍 언어는 훨씬 많은 타입을 지원한다. 또한 컴파일러가 타입을 기억하고 강제한다. 계다가 클래스와 함수는 점차 작아지는 추세다. 즉, 변수를 선언한 위치와 사용하는 위치가 멀지 않다.   

자바 프로그래머는 변수 이름에 타입을 인코딩할 필요가 없다. 객체는 강한 타입이며, IDE는 코드를 컴파일하지 않고도 타입 오류를 감지할 정도로 발전했다. 따라서 이제는 헝가리식 표기법이나 기타 인코딩 방식이 오히려 방해가 될 뿐이다. 변수, 함수, 클래스 이름이나 타입을 바꾸기가 어려워지며, 읽기도 어려워진다.

```java
PhoneNumber phoneString;
// 타입이 바뀌어도 이름은 바뀌지 않는다!
```

### 🎈 멤버 변수 접두어
이제 멤버 변수에 `m_`이라는 접두어를 붙일 필요도 없다. 클래스와 함수는 접두가 필요없을 정도로 작아야 마땅하다. 또한 멤버 변수를 다른 색상으로 표시하거나 눈에 띄게 보여주는 IDE를 사용해야 마땅하다.

```java
// 1
public class Part {
  private String m_dsc; // 설명 문자열

  void setName(String name) {
    m_dsc = name;
  }
}

// 2
public class Part {
  String description;

  void setDescription(String description) {
    this.description = description;
  }
}
```

계다가 사람들은 접두어(또는 접미어)를 무시하고 이름을 해독하는 방식으로 재빨리 익힌다. 코드를 읽으수록 접두어는 관심 밖으로 밀려난다. 결룩 접두어는 옛날에 작성한 구닥다리 코드라는 징표가 되버린다.

### 🎈 인터페이스 클래스와 구현 클래스
때로는 인코딩이 필요한 경우도 있다. 예를 들어, 도형을 생성하는 `ABSTRACT FACTORY`를 구현한다고 가정하자. 이 팩토리는 인터페이스 클래스다. 구현은 구체 클래스에서 한다. 그렇다면 두 클래스 이름을 어떻게 지어야 좋을까? 개인적으로 인터페이스 이름은 접두어를 붙이지 않는 편이 좋다고 생각한다. 옛날 코드에서 많이 사용하는 접두어 `I`는 주의를 흐트리고 과도한 정보를 제공한다. 클래스 사용자는 그냥 `ShapeFactory`라고만 생각했으면 좋겠다. 그래서 인터페이스 클래스 이름과 구현 클래스 이름 중 하나를 인코딩해야 한다면 구현 클래스 이름을 택하겠다. `ShapeFactoryImp`나 심지어 `CShapeFactory`가 `IShapeFactory`보다 좋다.

## 🎃 자신의 기억력을 자랑하지 마라
독자가 코드를 읽으면서 변수 이름을 자신이 아는 이름으로 변환해야 한다면 그 변수 이름은 바람직하지 못하다. 이는 일반적으로 문제 영역이나 해법 영역에서 사용하지 않는 이름을 선택했기 때문에 생기는 문제다.   

문자 하나만 사용하는 변수 이름은 문제가 있다. 루프에서 반복 횟수를 세는 변수 `i`, `j`, `k`는 괜찮다. (`l`은 절대 안 된다!) 단, 루프 범위가 아주 작고 다른 이름과 충돌하지 않을 때만 괜찮다. 루프에서 반복 횟수 변수는 전통적으로 한 글자를 사용하기 때문이다. 그 외에는 대부분 적절하지 못하다.   

똑똑한 프로그래머와 전문가 프로그래머 사이에서 나타나는 차이점 하나만 들자면, 전문가 프로그래머는 **명료함이 최고**라는 사실을 이해한다. 전문가 프로그래머는 자신의 능력을 좋은 방향으로 사용해 남들이 이해하는 코드를 내놓는다.

## 🎃 클래스 이름
클래스 이름과 객체 이름은 명사나 명사구가 적합하다. `Customer`, `WikiPage`, `Account`, `AddressParser` 등은 좋은 예다. `Manager`, `Processor`, `Data`, `Info` 등과 같은 단어는 피하고, 동사는 사용하지 않는다.

## 🎃 메서드 이름
메서드 이름은 동사나 동사구가 적합하다. `postPayment`, `deletePage`, `save` 등이 좋은 예다. 접근자, 변경자, 조건자는 `javabean` 표준에 따라 값 앞에 `get`, `set`, `is`를 붙인다.

```java
String name = employee.getName();
customer.setName("mike");
if (paycheck.isPosted()) // ...
```

생성자(Constructor)를 중복정의(overload)할 때는 정적 팩토리 메서드를 사용한다. 메서드는 인수를 설명하는 이름을 사용한다. 예를 들어, 다음 두 예제를 살펴보자.

```java
Complex fulcrumPoint = Complex.FromRealNumber(23.0);
```

위 코드가 아래 코드보다 좋다.

```java
Complex fulcrumPoint = new Complex(23.0);
```

생성자 사용을 제한하려면 해당 생성자를 `private`로 선언한다.

## 🎃 기발한 이름은 피하라
`HolyHandGrenade`라는 함수가 무엇을 하는지 알곘는가? 기발한 이름이지만 `DeleteItems`가 더 좋다. 재미난 이름보다 명로한 이름을 선택하라.   

특정 문화에서만 사용되는 농담은 피하는 편이 좋다. 의도를 분명하고 솔직하게 표현하라.

## 🎃 한 개념에 한 단어를 사용하라
추상적인 개념 하나에 단어 하나를 선택해 이를 고수한다. 메서드 이름은 독자적이고 일관적이어야 한다. 그래야 주석을 뒤져보지 않고도 프로그래머가 올바른 메서드를 선택한다.   

마찬가지로, 동일 코드 기반에 `controller`, `manager`, `driver`를 섞어 쓰면 혼란스럽다. `DeviceManager`와 `ProtocolController`는 근본적으로 어떻게 다른가? 어째서 둘 다 `Controller`가 아닌가? 어째서 둘 다 `Manager`가 아닌가? 이름이 다르면 독자는 당연히 클래스도 다르고 타입도 다르리라 생각한다.   

일관성 있는 어휘는 코드를 사용할 프로그래머가 반갑게 여길 선물이다.

## 🎃 말장난을 하지 마라
한 단어를 두 가지 목적으로 사용하지 마라. 다른 개념에 같은 단어를 사용하면 그것은 말장난에 불과하다.   

예를 들어, 지금까지 구현한 `add` 메서드는 모두 기존 값 두 개를 더하거나 이어서 새로운 값을 만든다고 가정하자. 새로 작성한 메서드는 집합에 값을 하나를 추가한다. 이 메서드를 `add`라 불러도 괜찮을까? 새 메서드는 기존 `add` 메서드와 맥락이 다르다. 그러므로 `insert`나 `append`라는 이름이 적당하다. 새 메서드를 `add`라 부른다면 이는 말장난이다.   

프로그래머는  코드를 최대한 이해하기 쉽게 짜야 한다. 집중적인 탐구가 필요한 코드가 아니라 대충 훑어봐도 이해할 코드 작성이 목표다. 의미를 해독할 책임이 독자에게 있는 논문 모델이 아니라 의도를 밝힐 책임이 저자에게 있는 잡지 모델이 바람직하다.   

## 🎃 해법 영역에서 가져온 이름을 사용하라
코드를 읽을 사람도 프로그래머라는 사실을 명심한다. 그러므로 전산 용어, 알고리즘 이름, 패턴 이름, 수학 용어 등을 사용해도 괜찮다. 모든 이름을 문제 영역에서 가져오는 정책은 현명하지 못하다. 기술 개념에는 기술 이름이 가장 적합한 선택이다.   

## 🎃 문제 영역에서 가져온 이름을 사용하라
적절한 '프로그래머 용어'가 없다면 문제 영역에서 이름을 가져온다. 그러면 코드를 보수하는 프로그래머가 분야 전문가에게 의미를 물어 파악할 수 있다.   

우수한 프로그래머와 설계자라면 해법 영역과 문제 영역을 구분할 줄 알아야 한다. 문제 영역 개념과 관련이 깊은 코드라면 문제 영역에서 이름을 가져와야 한다.   

## 🎃 의미 있는 맥락을 추가하라
스스로 의미가 분명한 이름이 없지 않다. 하지만 대다수 이름은 그렇지 못하다. 그래서 클래스, 함수, 이름 공간에 넣어 맥락을 부여한다. 모든 방법이 실패하면 마지막 수단으로 접두어를 붙인다.   

예를 들어, `firstName`, `lastName`, `street`, `houseNumber`, `city`, `state`, `zipcode`라는 변수가 있다. 변수를 훑어보면 주소라는 사실을 금방 알아챈다. 하지만 어느 메서드가 `state`라는 변수 하나만 사용한다면? 변수 `state`가 주소의 일부라는 사실을 금방 알아챌까?   

아래 예제는 맥락이 분명한 변수다. 세 변수는 확실하게 `GuessStatisticsMessage`에 속한다. 이렇게 맥락을 개선하면 함수를 쪼개기가 쉬워지므로 알고리즘도 좀 더 명확해진다.

```java
public class GuessStatisticsMessage {
  private String number;
  private String verb;
  private String pluralModifier;

  public String make(char candidate, int count) {
    createPluralDependentMessageParts(count);

    return String.format(
      "There %s %s %s%s",
      verb, number, candidate, pluralModifier
    );
  }

  private void createPluralDependentMessageParts(int count) {
    if (count == 0) {
      thereAreNoLetters();
    } else if (count == 1) {
      thereIsOneLetter();
    } else {
      thereAreManyLetters(count);
    }
  }

  private void thereAreManyLetters(int count) {
    number = Integer.toString(count);
    verb = "are";
    pluralModifier = "s";
  }

  private void thereIsOneLetter() {
    number = "1";
    verb = "is"
    pluralModifier = "";
  }

  private void thereAreNoLetters() {
    number = "no";
    verb = "are";
    pluralModifier = "s";
  }
}
```

## 🎃 불필요한 맥락을 없애라
일반적으로 짧은 이름이 긴 이름보다 좋다. 단, 의미가 분명한 경우에 한해서다. 이름에 불필요한 맥락을 추가하지 않도록 주의한다.   

`accountAddress`와 `customerAddress`는 `Address` 클래스 인스턴스로는 좋은 이름이나 클래스 이름으로는 적합하지 못하다. `Address`는 클래스 이름으로 적합하다. 포트 주소, MAC 주소, 웹 주소를 구분해야 한다면 `PostalAddress`, `MAC`, `URI`라는 이름도 괜찮겠다. 그러면 의미가 좀 더 분명해진다. 바로 이것이 이름을 붙이는 이유가 아니던가?
