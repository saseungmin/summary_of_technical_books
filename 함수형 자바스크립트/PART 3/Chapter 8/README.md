## 🌈 Chapter 8: 비동기 이벤트와 데이터를 관리


### 📚 골칫덩이 비동기 코드
- 비차단 비동기 호출 코드를 구현하여 문제를 해결하는데 다음과 같은 문제가 발목을 잡는다.
  1. 함수 간에 일시적 의존 관계가 형성
  2. 어쩔 수 없이 콜백 피라미드 늪에 빠짐
  3. 동기/비동기 코드의 호환되지 않는 조합

#### 🎈 함수 간에 일시적 의존 관계가 형성
- **일시적 결합(temporal coupling)** (**일시적 응집 temporal cohesion**)은 어떤 함수를 논리적으로 묶어 실행할 때 발생한다.
- 데이터가 도착할 때까지, 또는 다른 함수가 실행될 때까지 어떤 함수가 **기다려야 하는 경우**이다.
- 데이터든 시간이든 어느 쪽에 의지하는 순간부터 부수효과가 발생한다.
- 원격 IO 작업은 나머지 다른 코드에 비해 속도가 느릴 수밖에 없으므로 데이터 요청 후 다시 돌아올 때까지 '대기' 가능한 비차단 프로세스에게 처리를 위임한다.
- 콜백 함수는 자바스크립트에서 많이 쓰이지만, 대량 데이터를 순차적으로 로드할 경우 확장하기가 어렵고 결국 **콜백 피라미드에 빠지게 된다.**

#### 🎈 콜백 피라미드의 늪에 빠짐
- 콜백의 주용도는 **처리 시간이 오래 걸리는 프로세스를 기다리는 도중 UI를 차단하지 않는 것**이다.
- 콜백을 받는 함수는 값을 반환하는 대신 **제어의 역전(inversion of control)**을 실천한다.

```js
var students = null;
getJSON('/students',
  function(students) {
    showStudents(students);
  },
  function(error) {
    console.log(error.message);
  },
);
```
- 그러나 이런 식의 제어의 역전 구조는 함수형 프로그래밍의 설계 사상과 정면으로 배치된다.
- 함수형 프로그램의 함수는 **서로 독립적이며, 값을 호출자에 즉시 반환**해야 한다.

#### 🎈 연속체 전달 스타일
- 중첩된 콜백 함수는 읽기도 어렵지만, **자기 스코프 및 자신이 중첩된 함수의 변수 스코프를 감싼 클로저를 만든다.**
- 어떤 함수를 다른 함수에 중첩하는 건, 그 함수가 어떤 일을 달성하기 위해 **자신의 외부 변수에 직접 접근해야 할 경우에만 의미**가 있다.
- 하지만 내부 콜백 함수는 불필요한 외부 데이터를 참조하는 레퍼런스를 가지고 있다.
- 이런 코드를 **연속체 전달 스타일(continuation-passing style, CPS)** 로 바꾸어 개선이 가능하다.

```js
var selector = document.querySelector;

selector('#search-button').addEventListener('click', handleClickEvent);

const processGrades = function (grades) {
  // 학생의 점수 리스트를 처리..
};

const handleMouseMovement = () => 
  getJSON(`/students/${info.ssn}/grades`, processGrades);

const showStudent = function (info) {
  selector('#student-info').innerHTML = info;
  selector('#student-info').addEventListener(
    'mouseover', handleMouseMovement
  );
};

const handleError = error => 
  console.log('error: ' + error.message);

const handleClickEvent = function (event) {
  event.preventDefault();

  let ssn = selector('#student-info').value;
  if(!ssn) {
    alert('잘못된 ssn!');
    return;
  }
  else {
    getJSON(`/students/${ssn}`, showStudent).fail(handleError);
  }
}
```

- CPS는 **비차단 프로그램의 조각들을 개별 컴포넌트로 분리하기 위한 프로그래밍 스타일이다.**
- 여기서 콜백 함수는 **현재 연속체(current continuation)** 라고 부르며, 이 함수 자체를 **호출자에게 반환값으로 돌려준다.**
- CPS의 중요한 강점은 **콘텍스트 스택의 효율이 좋다는 점이다.**
- 이어지는 과정에서 현재 함수의 콘텍스트를 정리하고 새 콘텍스트를 만들어 다음 함수를 지원하는 식으로 프로그램의 흐름을 계속 이어간다.
- CPS 코딩은 코드에 잔존하는 일시적 의존 관계를 척결하고, 비동기 흐름을 선형적인 함수 평가 형태로 둔갑시키는 능력이 있다.