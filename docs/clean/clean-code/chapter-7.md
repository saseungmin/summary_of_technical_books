---
sidebar_position: 8
---

# 🍭 Chapter 7: 오류 처리

오류 처리는 프로그램에 반드시 필요한 요소 중 하나일 뿐이다. 입력이 이상하거나 디바이스가 실패할지도 모르기 때문이다. 간단히 말해, 뭔가 잘못될 가능성은 늘 존재한다. 뭔가 잘못되면 바로 잡을 책임은 바로 우리 프로그래머에게 있다.   

깨꿋한 코드와 오류 처리는 확실히 연관성이 있다. 상당수 코드 기반은 전적으로 오류 처리 코드에 좌우한다. 여기서 좌우된다는 표현은 코드 기반이 오류만 처리한다는 의미가 아니다. 여기저기 흩어진 오류 처리 코드 때문에 실제로 코드가 하는 일을 파악하기가 거의 불가능하다는 의미다. 오류 처리는 중요하다. 하지만 오류 처리 코드로 인해 프로그램 논리를 이해하기 어려워진다면 깨끗한 코드라 부르기 어렵다.   

## 🎃 오류 코드보다 예외를 사용하라
오류가 발생하면 예외를 던지는 편이 낫다. 그러면 호출자 코드가 더 깔끔해진다. 논리가 오류 처리 코드와 뒤섞이지 않으니까.   

```java
public class DeviceController {
  // ...
  public void sendShutDown() {
    try {
      tryToShutDown();
    } catch (DeviceShutDownError e) {
      logger.log(e);
    }
  }

  private void tryToShutDown() throws DeviceShutDownError {
    DeviceHandle handle = getHandle(DEV1);
    DeviceRecord record = retrieveDeviceRecord(handle);

    pauseDevice(handle);
    clearDeviceWorkQueue(handle);
    closeDevice(handle);
  }

  private DeviceHandle getHandle(DeviceID id) {
    // ...
    throw new DeviceShutDownError("Invalid handle for: " + id.toString());
    // ...
  }

  // ...
}
```

디바이스를 종료하는 알고리즘과 오류를 처리하는 알고리즘을 분리했다. 각 개념을 독립적으로 살펴보고 이해할 수 있다.

## 🎃 Try-Catch-Finally 문부터 작성하라
예외에서 프로그램 안에다 **범위를 정의한다**는 사실은 매우 흥미롭다. `try-catch-finally` 문에서 `try` 블록에 들어가는 코드를 실행하면 어느 시점에서든 실행이 중단된 후 `catch` 블록으로 넘어갈 수 있다.   

어떤 면에서 `try` 블록은 트랜잭션과 비슷하다. `try` 블록에서 무슨 일이 생기든지 `catch` 블록은 프로그램 상태를 일관성 있게 유지해야 한다. 그러므로 예외가 발생하는 코드를 짤 때는 `try-catch-finally` 문으로 시작하는 편이 낫다. 그러면 `try` 블록에서 무슨 일이 생기든지 호출자가 기대하는 상태를 정의하기 쉬워진다.   

다음은 파일이 없으면 예외를 던지는지 알아보는 단위 테스트다.

```java
@Test(expected = StorageException.class)
public void retrieveSectionShouldThrowOnInvalidFileName() {
  sectionStore.retrieveSection("invalid - file");
}
```

단위 테스트에 맞춰 다음 코드를 구현했다.

```java
public List<RecordedGrip> retrieveSection(String sectionName) {
  // 실제로 구현할 때까지 비어 있는 더미를 반환한다.
  return new ArrayList<RecordedGrip>();
}
```

그런데 코드가 예외를 던지지 않으므로 단위 테스트는 실패한다. 잘못된 파일 접근을 시도하게 구현을 변경하자. 아래 코드는 예외를 던진다.

```java
public List<RecordedGrip> retrieveSection(String sectionName) {
  try {
    FileInputStream stream = new FileInputStream(sectionName);
  } catch (Exception e) {
    throw new StorageException("retrieval error", e);
  }
  return new ArrayList<RecordedGrip>();
}
```

코드가 예외를 던지므로 이제는 테스트가 성공한다. 이 시점에서 리팩터링이 가능하다. `catch` 블록에서 예외 유형을 좁혀 실제로 `FileInputStream` 생성자가 던지는 `FileNotFoundException`을 잡아낸다.

```java
public List<RecordedGrip> retrieveSection(String sectionName) {
  try {
    FileInputStream stream = new FileInputStream(sectionName);
    stream.close();
  } catch (FileNotFoundException e) {
    throw new StorageException("retrieval error", e);
  }
  return new ArrayList<RecordedGrip>();
}
```

`try-catch` 구조로 범위를 정했으므로 TDD를 사용해 필요한 나머지 논리를 추가한다.   

먼저 강제로 예외를 일으키는 테스트 케이스를 작성한 후 테스트를 통과하게 코드를 작성하는 방법을 권장한다. 그러면 자연스럽게 `try` 블록의 트랜젝션 범위부터 구현하게 되므로 범위 내에서 트랜잭션 본질을 유지하기 쉬워진다.

## 🎃 미확인(unchecked) 예외를 사용하라
확인된 예외는 OCP(Open Closed Principle)를 위반한다. 메서드에서 확인된 예외를 던졌는데 `catch` 블록이 세 단계 위에 있다면 그 사이 메서드 모두가 선언부에 해당 예외를 정의해야 한다. 즉, 하위 단계에서 코드를 변경하면 상위 단계 메서드 선언부를 전부 고쳐야 한다는 말이다. 모듈과 관련된 코드가 전혀 바뀌지 않더라도 (선언부가 바뀌었으므로) 모듈을 다시 빌드한 다음 배포해야 한다는 말이다.   

`throws` 경로에 위치한 모든 함수가 최하위 함수에서 던지는 예외를 알아야 하므로 캡슐화가 깨진다. 때로는 확인된 예외도 유용하다. 아주 중요한 라이브러리를 작성한다면 모든 예외를 잡아야 한다. 하지만 일반적인 애플리케이션은 의존성이라는 비용이 이익보다 크다.

## 🎃 예외에 의미를 제공하라
예외를 던질 때는 전후 상황을 충분히 덧붙인다. 그러면 오류가 발생한 원인과 위치를 찾기가 쉬워진다. 자바는 모든 예외에 호출 스택을 제공한다. 하지만 실패한 코드의 의도를 파악하려면 호출 스택만으로 부족하다.   

오류 메시지에 정보를 담아 예외와 함께 던진다. 실패한 연산 이름과 실패 유형도 언급한다. 애플리케이션이 로깅 기능을 사용한다면 `catch` 블록에서 오류를 기록하도록 충분한 정보를 넘겨준다.

## 🎃 호출자를 고려해 예외 클래스를 정의하라
오류가 발생한 위치로 분류가 가능하다. 예를 들어, 오류가 발생한 컴포넌트로 분류한다. 아니면 유형으로도 분류가 가능하다. 예를 들어 디바이스 실패, 네트워크 실패, 프로그래밍 오류 등으로 분류한다. 하지만 애플리케이션에서 오류를 정의할 때 프로그래머에게 가장 중요한 관심사는 **오류를 잡아내는 방법**이 되어야 한다.   

흔히 예외 클래스가 하나만 있어도 충분한 코드가 많다. 예외 클래스에 포함된 정보를 오류를 구분해도 괜찮은 경우가 그렇다. 한 예외는 잡아내고 다른 예외는 무시해도 괜찮은 경우라면 여러 예외 클래스를 사용한다.

## 🎃 정상 흐름을 정의하라
외부 API를 감싸 독자적인 예외를 던지고, 코드 위에 처리기를 정의해 중단된 계산을 처리한다. 대개는 멋진 처리 방식이지만, 때로는 중단이 적합하지 않은 때도 있다.   

예제를 살펴보자. 다음은 비용 청구 애플리케이션에서 총계를 계산하는 허술한 코드다.

```java
try {
  MealExpenses expenses = expenseReportDAO.getMeals(employee.getID());
  m_total += expenses.getTotal();
} catch(MealExpensesNotFound e) {
  m_total += getMealPerDiem();
}
```

예외가 논리를 따라가기 어렵게 만든다. 특수 상황을 차리할 필요가 없다면 더 좋지 않을까? 그러면 코드가 훨씬 더 간결해지리라. 다음을 살펴보자.

```java
MealExpenses expenses = expenseReportDAO.getMeals(employee.getID());
m_total += expenses.getTotal();
```

위처럼 간결한 코드가 가능할까? 가능하다. `ExpenseReportDAO`를 고쳐 언제나 `MealExpense` 객체를 반환한다. 청구한 식비가 없다면 일일 기본 식비를 반환하는 `MealExpense` 객체를 반환한다.

```java
public class PerDiemMealExpenses implements MealExpenses {
  public int getTotal() {
    // 기본값으로 일일 기본 식비를 반환한다.
  }
}
```

이를 특수 사례 패턴(SPECIAL CASE PATTERN)이라 부른다. 클래스를 만들거나 객체를 조작해 특수 사례를 처리하는 방식이다. 그러면 클라이언트 코드가 예외적인 상황을 처리할 필요가 없어진다. 클래스나 객체가 예외적인 상황을 캡슐화해서 처리하므로.

## 🎃 null을 반환하지 마라
오류 처리를 논하는 장이라면 우리가 흔히 저지르는 바람에 오류를 유발하는데 행위도 언급해야 한다고 생각한다. 그 중 첫째가 `null`을 반환하는 습관이다. 한 줄 건너 하나씩 `null`을 확인하는 코드로 가득한 애플리케이션을 지금까지 수도 없이 봤다. 다음이 한 예다.

```java
public void registerItem(Item item) {
  if (item != null) {
    ItemRegistry registry = peristentStore.getItemRegistry();
    if (registry != null) {
      Item existing = registry.getItem(item.getID());
      if (existing.getBillingPeriod().hasRetailOwner()) {
        existing.register(item);
      }
    }
  }
}
```

`null`을 반환하는 코드는 일거리를 늘릴 뿐만 아니라 호출자에게 문제를 떠넘긴다. 누구 하나라도 `null` 확인을 빼먹는다면 애플리케이션이 통제 불능에 빠질지도 모른다.   

위 코드는 `null` 확인이 누락된 문제라 말하기 쉽다. 하지만 실상은 `null` 확인이 **너무 많아** 문제다. 메서드에서 `null`을 반환하고픈 유혹이 든다면 그 대신에 예외를 던지거나 특수 사례 객체를 반환한다. 사용하려는 외부 API가 `null`을 반환한다면 감싸기 메서드를 구현해 예외를 던지거나 특수 사례 객체를 반환하는 방식을 고려한다.   

많은 경우에 특수 사례 객체가 손쉬운 해결책이다. 다음과 같은 코드를 생각해보자.

```java
List<Employee> employees = getEmployees();
if (employees != null) {
  for (Employee e : employees) {
    totalPay += e.getPay();
  }
}
```

위 예제에서 반드시 `null`을 반환할 필요가 있을까? `getEmployees`를 변경해 빈 리스트를 반환한다면 코드가 훨씬 깔끔해진다.

```java
List<Employee> employees = getEmployees();
for(Employee e : employees) {
  totalPay += e.getPay();
}
```

다행스럽게 자바에는 `Collections.emptyList()`가 있어 미리 정의된 읽기 전용 리스트를 반환한다. 우리 목적에 적합한 리스트다.

```java
public List<Employee> getEmployees() {
  if (/* 직원이 없다면 */)
    return Collections.emptyList();
}
```

이렇게 코드를 변경하면 코드도 깔끔해질뿐더러 `NullPointerException`이 발생할 가능성도 줄어든다.

## 🎃 null을 전달하지 마라
메서드에서 `null`을 반환하는 방식도 나쁘지만 메서드로 `null`을 전달하는 방식은 더 나쁘다. 정상적인 인수로 `null`을 기대하는 API가 아니라면 메서드로 `null`을 전달하는 코드는 최대한 피한다.   

대다수 프로그래밍 언어는 호출자가 실수로 넘기는 `null`을 적절히 처리하는 방법이 없다. 그렇다면 애초에 `null`을 넘기지 못하도록 금지하는 정책이 합리적이다. 즉, 인수로 `null`이 넘어오면 코드에 문제가 있다는 말이다. 이런 정책을 따르면 그만큼 부주의한 실수를 저지를 확률도 작아진다.
