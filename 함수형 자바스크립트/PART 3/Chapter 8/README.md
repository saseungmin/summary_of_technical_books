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

### 📚 비동기 로직을 프라미스로 일급화
- 함수형 프로그래밍이라면 이런 특성을 지녀야 한다.
  1. 합성과 무인수 프로그래밍을 이용한다.
  2. 중첩된 구조를 보다 선형적으로 흐르게 눌려 편다.
  3. 일시적 결합은 추상하기 때문에 개발자는 더 이상 신경 쓸 필요가 없다.
  4. 여러 콜백 대신, 단일 함수로 에러 처리 로직을 통합하여 코드 흐름을 원할하게 한다.
- 모나드에는 **프라미스(promise)** 라는 것이 존재하는데 프라미스는 오래 걸리는 계산을 모나드로 감싸는 개념이다.
- 프라미스는 **오래 걸리는 계산이 끝날 때까지 기다렸다가 미리 매핑한 함수를 실행**한다.
- 프라미스는 우직하고 투명하게 데이터를 기다리는 개념이다.
- 프라미스는 나중에 처리가 끝나는 값이나 함수를 감싼다.
- 프라미스의 상태는 언제나 **보류(pending)**, **이룸(fulfilled)**, **버림(rejected)**, **귀결(settled)** 하나이다.
- 처음은 보류(미결) 상태로 시작하고 오래 걸리는 작업 결과에 따라 이룸(resolve) 또는 버림(rejected) 상태로 분기한다.
- 프라미스가 문제없이 이루어지면 다른 객체에 데이터가 당도했음을 통보하고, 처리 도중 에러가 나면 미리 등록한 실패 콜백 함수를 호출한다. 이때 프라미스는 **귀결된 상태**라고 본다.

```js
var fetchData = new Promise(function(resolve, reject) {
  // 비동기 혹은 오래 걸리는 계산을 한다.
  if (성공하면) {
    resolve(result);
  }
  else {
    reject(new Error('error'));
  }
});
```

- 프라미스 생성자는 비동기 작업을 감싼 함수(**액션 함수**)를 받고 이 함수는 `resolve`와 `reject` 콜백 2개를 받고, 각각 프라미스가 이룸/버림 상태일 때 호출된다.

```js
var Scheduler = (function () {
  let delayedFn = _.bind(setTimeout, undefined, _, _);

  return {
    delay5: _.partial(delayedFn, _, 5000),
    delay10: _.partial(delayedFn, _, 10000),
    delay: _.partial(delayedFn, _, _),
  };
})();

var promiseDemo = new Promise(function(resolve, reject) {
  Scheduler.delay5(function () { // 오래걸리는 작업을 지연 함수로 나타낸다.
    resolve('완료!');
  });
});

promiseDemo.then(function(status) {
  console.log('5초 후 상태: '+ status); // 5초 후 프라미스가 귀결된다.
})
```

#### 🎈 미래의 메서드 체인
- 프라미스 객체는 `then` 메서드를 지니는데 프라미스에 보관된 반환값에 어떤 연산을 수행하고 다시 프라미스 형태로 되돌리는 메서드이다.
- API를 프라미스화하면 기존 콜백보다 훨씬 코드를 다루기 쉬워진다.

```js
getJSON('/students')
  .then(hide('spinner')) // 값을 반환하지 않는 함수라서 프라미스로 감싼 값은 후속 then으로 넘긴다.
  .then(R.filter(s => s.address.country == 'US'))
  .then(R.sortBy(R.prop('ssn')))
    .then(R.map(student => {
      return getJSON('/grades?ssn='+ student.ssn)
        .then(R.compose(Math.ceil,
          fork(R.divide, R.sum, R.length))) // 함수 조합기와 람다 JS 함수로 평균을 계산
          .then(grade =>
            IO.of(R.merge(student,
            { 'grade': grade })) // IO 모나드로 학생과 점수 데이터를 DOM에 표시한다.
            .map(R.props(['ssn', 'firstname', 'lastname', 'grade']))
            .map(csv)
            .map(append('#student-info')).run())
    }))
    .catch(function(error) {
      console.log('error: '+ error.message);
    });
```
- 비동기 호출을 처리하는 세부 로직을 프라미스가 대신 처리하므로 마치 각 함수를 순서대로 하나씩 실행하듯 프로그램을 작성할 수 있다.
- 이런 수준의 유연성을 **위치 투명성**이라고 한다.
- `Promise.all`을 이용하면 한 번에 여러 데이터를 내려받는 브라우저의 능력을 극대화할 수 있다.
- 이터러블 인수에 포함된 모든 프라미스가 귀결되는 즉시 결과 프라미스도 귀결된다.

#### 🎈 동기/비동기 로직을 합성
- 아래 코드에서 중요한 건 `student` 객체가 존재하면 이 객체로 프라미스가 귀결되며 그 외에는 버려진다는 사실이다.

```js
// 브라우저의 IndexedDB사용
const find = function(db, ssn) {
  let trans = db.transaction(['students'], 'readonly');
  const store = trans.objectStore('students');
  return new Promise(function(resolve, reject) {
    let request = store.run(ssn);
    request.onerror = function() {
      if(reject) {
        reject(new Error('error')); // 실패
      }
    };
    request.onsuccess = function() {
      resolve(request.result); // 성공
    }
  })
}
```

- 프라미스는 코드를 거의 고치지 않아도 미래의 함수 합성과 동등하게 **함수를 프라미스와 합성할 수 있도록 비동기 코드의 실행을 추상한다.**
- 도우미 함수를 작성한다.

```js
const fetchStudentDBAsync = R.curry(function(db, ssn) {
  return find(db, ssn);
});

// 이 함수를 합성에 포함하기 위해 저장소 객체를 커리한다.
const findStudentAsync = fetchStudentDBAsync(db);

// 데너블형에도 연산을 체이닝할 수 있게 만든다.
const then = R.curry(function (f, thenable) {
  return thenable.then(f);
});

const catchP = R.curry(function (f, promise) {
  return promise.catch(f);
});

// 콘솔에 에러 수준의 로거를 만든다.
const errorLog = _.partial(logger, 'console', 'basic', 'ShowStudentAsync', 'ERROR');
```

- `R.compose`로 묶는다.

```js
const ShowStudentAsync = R.compose(
  catchP(errorLog), // 에러는 모두 여기
  then(append('#student-info')), // then은 모나드 map과 같다
  then(csv),
  then(R.props(['ssn', 'firstname', 'lastname'])),
  chain(findStudentAsync), // 동기/비동기 코드가 서로 맞물려 굴절되는 지점
  map(checkLengthSsn),
  lift(cleanInput)
);
```
- 함수가 내부적으로 어떤 비동기 로직을 구사했는지, 어떤 콜백을 썼는지 등은 철저히 베일에 감싼 채 선언적인 포즈를 취한다.
- 따라서 동시에 실행되지 않지만 나중에 함수 조합기로서의 본색을 드러낼 함수를 서로 붙여놓은 **무인수 프로그램들을 합성하여 조정할 수 있다.**


### 📚 느긋한 데이터 생성
- **제너레이터** 함수는 `function*`라고 표기하는, 언어 수준에서 지원되는 장치이다.
- 이 함수는 `yield`를 만나면 함수 밖으로 잠시 나갔다가 자신의 보관된 콘텍스트를 찾아 다시 돌아온다.
- 제너레이터 함수의 실행 콘텍스트는 잠정 중단했다가 언제라도 재개할 수 있어서 제너레이터로 다시 돌아올 수 있다.
- 제너레이터는 함수를 호출하는 시점에 내부적으로 이터레이터 객체를 생성하여 느긋함을 부여하고, 이터레이터는 매번 `yield`를 호출할 때마다 호출자에게 데이터를 돌려준다.

#### 🎈 제너레이터와 재귀
- 제너레이터도 다른 제너레이터를 얼마든지 호출할 수 있다.
- 중첩된 객체 집합을 평평한 모양으로 만들고 싶을 때 아주 유용한 특성이다.
- 제너레이터는 `for..of` 루프문으로 반복할 수 있기 때문에 다른 제너레이터에게 위임하는 건 마치 두 컬렉션을 병합한 전체 컬렉션을 반복하는 것과 비슷하다.

```js
function* AllStudentsGenerator() {
  yield 'Church';

  yield 'Rosser';
  yield* RosserStudentGenerator(); // yield*로 다른 제너레이터에게 위임한다.

  yield 'Turing';
  yield* TuringStudentGenerator();

  yield 'Kleene';
  yield* KleeneStudentGenerator();
}

function* RosserStudentGenerator() {
  yield 'Mendelson';
  yield 'Sacks';
}

function* TuringStudentGenerator() {
  yield 'Gandy';
  yield 'Sacks';
}

function* KleeneStudentGenerator() {
  yield 'Nelson';
  yield 'Constable';
}

for (let student of AllStudentsGenerator()) {
  console.log(student);
}

// Church
// Rosser
// Mendelson
// Sacks
// Turing
// Gandy
// Sacks
// Kleene
// NelsonA
```
- 재귀로 탐색하면 다음과 같다.

```js
function* TreeTraversal(node) {
  yield node.value;
  if (node.hasChildren()) {
    for (let child of node.children) {
      yield* TreeTraversal(child); 
    }
  }
}

var root = node(new Person('Alonzo', 'Church', '111-11-1231'));

for (let person of TreeTraversal(root)) {
  console.log(person.lastname);
}

// Church
// Rosser
// Mendelson
// Sacks
// Turing
// Gandy
// Sacks
// Kleene
// NelsonA
```

#### 🎈 이터레이터 프로토콜
- 제너레이터는 **이터레이터** 와 밀접한 관계가 있는데 여느 자료구조처럼 루프로 반복시킬 수 있는 것도 이터레이터 덕분이다.
- 제너레이터 함수는 내부적으로 이터레이터 프로토콜에 따라 `yield` 키워드 값을 반환하는 `next()` 메서드가 구현된 Generator 객체를 반환한다.
- Generator 객체의 속성은 다음과 같다.
  1. `done`: 제일 마지막에 이터레이터가 전달되면 `true`, 그 외에는 `false`로 세팅된다. 즉, `false`는 이터레이터가 아직 **도중에 다른 값을 생산할 수 있음을 의미한다.**
  2. `value`: 이터레이터가 반환한 값이다.
- 다음은 range 제너레이터를 원시 형태로 구현한 코드이다.

```js
function range(start, end) {
  return {
    [Symbol.iterator]() {
      return this; // 반환된 객체가 이터러블임을 나타낸다.
    },
    next() {
      if(start < end) {
        // 더 생성할 데이터가 있으면 done에 false를 세팅
        return { value: start++, done: false };
      }
      // 없으며 done에 true를 세팅
      return { done: true, value: end };
    }
  };
}
```
- 이렇게 제너레이터를 구현하면 특정한 패턴이나 명세를 따르는 어떤 종류의 데이터라도 만들어낼 수 있다.
- 다음은 제곱수 제너레이터를 만든 것이다.

```js
function squares() {
  let n = 1;
  return {
    [Symbol.iterator]() {
      return this;
    },
    next() {
      return { value: n * n++ };
    }
  };
}
```

### 📚 RxJS를 응용한 함수형 리액티브 프로그래밍
- RxJS는 함수형 프라미스 기반과 비슷한 방식으로 작동하지만, 더 높은 수준의 추상화를 제공하며 더 강력한 연산을 제공한다.

#### 🎈 옵저버블 순차열로서의 데이터
- **옵저버블(observable)** 은 **구독(subscribe)** 가능한 모든 객체를 가리킨다.
- 애플리케이션은 파일 읽기, 웹 서비스 호출, DB 쿼리, 시스템 통지 푸시, 사용자 입력 처리, 원소 컬렉션 탐색, 단순 문자열 파싱 등으로 비롯된 비동기 이벤트를 구독할 수 있다.
- **리액티브 프로그래밍**은 모든 데이터 제공원(data provider)을 `Rx.Observable` 객체를 통해 **옵저버블 스트림(observable stream)** 이라는 단일 개념으로 일원화한다.
- 스트림이란 **시간의 흐름에 따라 발생하는 이벤트의 순차열**이다.
- 값을 추출할려면 구독은 필수이다.

```js
Rx.Observable.range(1, 3)
  .subscribe(
    x => console.log(`다음: ${x}`),
    err => console.log(`error: ${err}`),
    () => console.log('완료!'),
  );

// 다음: 1
// 다음: 2
// 다음: 3
// 완료!
```

- 제곱수 제너레이터 함수를 이용해서 값 스트립을 채운것이다.

```js
const squares = Rx.Observable.wrap(function* (n) {
  for(let i = 1; i <= n; i++) {
    return yield Observable.just(i * i);
  }
});

squares(3).subscribe(x => console.log(`다음: ${x}`));

// 다음: 1
// 다음: 4
// 다음: 9
```

- `Rx.Observable`로 어떤 옵저버블 객체라도 **감싸거나 승급하면 관찰된 값에 상이한 함수를 매핑/적용해서 원하는 출력을 얻도록 변환**할 수 있다. 결국 모나드이다.

#### 🎈 함수형 리액티브 프로그래밍
- `Rx.Observable` 객체는 함수형과 리액티브, 두 프로그래밍 세상을 하나로 묶는다.
- 이 객체는 `map`, `of`, `join` 등 최소한의 모나드 인터페이스에 해당하는 구현체와 스트림 조작에 특화된 메서드를 여럿 거느린다.

```js
Rx.Observable.of(1, 2, 3, 4, 5)
  .filter(x => x % 2 !== 0)
  .map(x => x * x)
  .subscribe(x => console.log(`다음: ${x}`));

// 다음: 1
// 다음: 9
// 다음: 25
```
- 다음은 SSN 필드 입력값이 올바른지 검증하는 예제이다.

```js
document.querySelector('#student-ssn')
  .addEventListener('change', function(event) {
    let value = event.target.value;
    value = value.replace(/^\s*|\-|\s*$/g, '');
    console.log(value.length !== 9 ? '맞음' : '틀림');
  });

// 444 맞음
// 444-44-4444 틀림
```
- `change` 이벤트가 비동기로 발생하기 때문에 어쩔 수 없이 콜백 함수 하나에 비지니스 로직을 몰아넣었다. 하지만 로직을 추가할수록 점점 복잡해진다.
- 이벤트와 함수형 두 세계를 접목시키기 위해 `Rx.Observable`로 추상화 계층을 둔다.
- 이벤트를 구독하고 비지니스 로직은 모두 순수함수로 구현하는 것이다.

```js
Rx.Observable.fromEvent(
  document.querySelector('#student-ssn'), 'change')
  .map(x => x.target.value)
  .map(cleanInput) // SSN 값을 정제한다
  .map(checkLengthSsn)
  .subscribe( // Either.Right, Either.Left 중 어느 쪽인지 체크하여 올바른지 여부를 판단한다.
    ssn => ssn.isRight ? console.log('Valid') : console.log('Invalid')
  );
```

#### 🎈 RxJS와 프라미스
- RxJS는 모든 프라미스/A+ 호환 객체를 **옵저버블 순차열로 변환**할 수 있다.
- 즉, 실행 시간이 긴 getJSON 함수를 감싸 귀결 시점에 그 값을 스트림으로 바꾼다.

```js
Rx.Observable.fromPromise(getJSON('/students'))
  // 모든 학생 객체를 대소문자 구분 없이 이름 순으로 정렬한다.
  .map(R.sortBy(R.compose(R.toLower, R.prop('firstname'))))
  // 하나의 학생 객체 배열을 옵저버블한 학생 순차열로 바꾼다.
  .flatMapLatest(student => Rx.Observable.from(student))
  // 미국에 살지 않는 학생 거르기
  .filter(R.pathEq(['address', 'country'], 'US'))
  .subscribe(
    student => console.log(student.fullname),
    err => console.log(err)
  );
```

- RxJS에 대한 자세한 정보 [참고](https://rxjs-dev.firebaseapp.com/guide/overview)
- https://xgrommx.github.io/rx-book/


### 📚 마치며
- 프라미스는 오랫동안 자바스크립트 프로그래머들의 골머리를 앓아온, 콜백 중심적인 설계를 함수형으로 해결하는 방안이다.
- "미래의" 함수를 프라미스로 합성, 체이닝하면 일시적으로 의존 관계가 형성된 코드의 잡다한 저수준 로직을 추상화할 수 있다.
- 제너레이터는 비동기 코드에 접근하는 또 다른 방안으로, 느긋한 이터레이터로 데이터를 쓸 수 있는 시점에 내어준 프로그래밍 장치이다.
- 함수형 리액티브 프로그래밍은 프로그램의 추상화 수준을 높여 이벤트를 논리적으로 독립된 단위로 다룰 수 있게 한다.