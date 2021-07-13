## 🌈 Chapter 3 : 특수한 컬렉션을 이용해 코드 명료성을 극대화하라.

### 🎯 객체를 이용해 정적인 키-값을 탐색하라.
- 다음 예제는 어떤 색깔의 코드인지 원래부터 알지 못하면 무슨 색을 나타내는지 알 수가 없다.

```javascript
const colors = ['#d10202', '#19d836', '$0e33d8'];
```
- 위와 같은 경우에는 키-값 컬렉션을 사용하여 정보의 의미를 잘 이해시켜줄 수 있다.
- 다음과 같이 중괄호에 키-값을 작성하는 것을 [**객체 리터럴(object literal)**](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Object_initializer)이라고 한다.

```javascript
const colors = {
    red: '#d10202',
    green: '#19d836',
    blue: '$0e33d8'
}
```
- 객체도 하나의 컬렉션으로 생각하고, 맵처럼 다른 컬렉션의 경쟁 상대로 봐보면, 객체를 기본으로 선택할 것이 아니라, 어떠한 경우에 객체를 선택하는 것이 최선일지 알아야 한다.
- 원칙적으로 객체는 **변화가 없고 구조화된 키-값 데이터를 다루는 경우에 유용하다.**
- 반면에 **자주 갱신되거나 실행되기 전에는 알 수 없는 동적인 정보**를 다루기에는 적합하지 않다.
- 이렇듯 계속해서 갱신, 반복, 대체, 정렬해야 할 정보에는 맵을 사용하는 것이 낫다.
- 그렇지만 정적인 객체도 프로그래밍적으로 정의할 수 있는데, **함수 내에서 객체를 생성하고 다른 함수에게 넘겨**줄 수 있다.
- 정보를 수집하고 전달해 다른 함수에서 사용하면 조작하거나 갱신하지 않기 때문에 정적인 정보가 되는 것이다.
- 그 비결은 데이터를 매번 같은 방식으로 설정하고 사용하는 것이기 때문에 기존의 객체를 조작하는 것이 아니라 **각각의 함수에서 새로운 객체를 생성**한다.
- 또한, 더 중요한 것은 **코드를 작성할 때 키를 알고 있다는 점**으로 변수를 이용해 키를 설정하지 않고 객체를 전달받는 함수에서 구조를 미리 알고 있다.

```javascript
function getBill(item) {
    return {
        name: item.name,
        due: twoWeeksFromNow(),
        total: calculateTotal(item.price),
    };
}

const bill = getBill({
    name: '객실 청소',
    price: 30,
});

function displayBill(bill) {
    return `${bill.name} 비용은 ${bill.total} 달러이며 납부일은 ${bill.due}입니다.`;
}
```

### 🎯 Object.assign()으로 조작 없이 객체를 생성하라.
- 객체도 배열과 마찬가지로 조작과 부수 효과로 인한 문제에 직면할 수 있으므로 주의해야 한다.
- 객체에 무심코 필드를 추가하거나 설정하면 문제를 만들 수도 있다.
- 기본값을 설정하면서, 원래의 데이터를 유지하는 새로운 객체를 생성할려면 부수 효과나 조작은 발생하지 않아야 한다.
- 아래 예제 코드는 잘못된 부분은 없지만 장황하다.
```javascript
const defaults = {
    author: '',
    title: '',
    year: 2017,
    rating: null,
};

const book = {
    author: '생텍쥐페리',
    title: 'The Little Prince',
};

function addBookDefaults(book, defaults) {
    const fields = Object.keys(defaluts);
    const updated = {};
    for(let i = 0; i < fields.length; i++){
        const field = fields[i];
        updated[field] = book[field] || defaults[field];
    }
    return updated;
}
```
- 위와 같은 문제가 자주 발생했기 때문에 ES6는 [`Object.assign()`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)을 새롭게 추가해 다른 객체의 키-값으로 객체의 필드를 생성하고 갱신할 수 있도록 했다.
- 즉, `Object.assign()`을 이용하면 다른 객체의 속성을 이용해서 객체를 갱신할 수 있다.
- `Object.assign()`의 작동 원리는 메서드는 일련의 객체를 전달받고 가장 먼저 인수로 받은 객체를 뒤이어 인수로 넘긴 객체의 키-값을 이용해서 갱신한다.
- 그러고 나서 갱신된 첫 번째 객체를 반환하는데 호출 시 인수 순서대로 적용되므로, 먼저 전달한 객체부터 적용되고 가장 나중에 전달한 객체가 맨 마지막으로 적용된다.
- 위 예제 코드의 `addBookDefaults()`를 다시 작성하면 간단하게 아래와 같아진다.

```javascript
Object.assign(defaults, book);
// {author: "생텍쥐페리", title: "The Little Prince", year: 2017, rating: null}
```
- 하지만 기본값 객체를 갱신하면서 원본 객체를 조작하게 된다.
```javascript
console.log(defaults);
// {author: "생텍쥐페리", title: "The Little Prince", year: 2017, rating: null}
```
- 이러한 문제를 피하기 위해서는 **첫 번째 객체에 빈 객체를 사용하는 것이다.**
- 이렇게 하면 빈 객체에 새로운 값이 갱신되어 반환되고 다른 객체에는 조작이 발생하지 않는다.
  
```javascript
const updated = Object.assign({} ,defaults, book);
// {author: "생텍쥐페리", title: "The Little Prince", year: 2017, rating: null}
console.log(updated);
// {author: "", title: "", year: 2017, rating: null}
console.log(defaults);
```

- `Object.assign()`을 이용한 복사에는 한 가지 문제가 있는데, **속성을 복사하면 값만 복사한다.**
- 아래의 예제는 중첩된 객체이다.

```javascript
const defaultEmployee = {
    name: {
        first: '',
        last: '',
    },
    years: 0,
};
const employee = Object.assign({}, defaultEmployee);
```
- 중첩된 객체가 있는 객체를 복사하는 것을 **깊은 복사(deep copy)** 또는 **깊은 병합(deep merge)** 이라고 한다.
- 때문에 `years` 속성은 문제없이 복사할 수 있지만, `name` 속성은 복사할 수 없다.
- 실제로 키 `name`에 할당된 독립적인 객체에 대한 **참조만 복사**되기 때문에 중첩된 객체는 해당 객체를 담고 있는 객체와 독립적으로 존재한다.
- 중첩된 객체를 담고 있는 객체가 가지고 있는 것은 **중첩된 객체에 대한 참조**뿐인 것이다.
- 그렇기 때문에 참조에 대한 복사만으로 **중첩된 객체에 깊은 복사를 적용할 수 없다.** 단지 **참조의 위치를 복사하는 것**에 불과하다.
- 따라서 원복 객체 또는 복사한 객체 중 **어디서라도 중첩된 객체의 값을 변경**하면 **원본 객체와 복사한 객체 모두 변경**된다.

```javascript
employee.name.first = 'Sa';
// {
//    name: {first: "Sa", last: ""},
//    years: 0,
// }
```
- 이러한 중첩된 객체로 인한 문제를 피하는 방법은 두 가지이다.
- 가장 간단한 방법은 **중첩된 객체를 두지 않는 것이다.**
- 두 번째 방법은 `Object.assign()`을 이용해서 중첩된 객체를 복사해야 한다.

```javascript
const employee2 = Object.assign(
    {},
    defaultEmployee,
    {
        name: Object.assign({}, defaultEmployee.name),
    },
);
employee2.name.first = 'Sa';
defaultEmployee;
// {
//     name: {first: "", last: ""},
//     years: 0,
// }
```

### 🎯 객체 펼침 연산자로 정보를 갱신하라.
- `Object.assign()`의 이점을 객체 펼침 연산자의 간단한 문법으로 대체해보자.
- 객체 펼침 연산자는 [ES2018 명세](https://github.com/tc39/proposal-object-rest-spread)에 공식적으로 포함되었다.
- 객체 펼침 연산자는 키-값 쌍을 목록에 있는 것처럼 반환한다.

```javascript
const book = {
    author: '생텍쥐페리',
    title: 'The Little Prince',
};
const update = { ...book, year: 1943 };
// {author: "생텍쥐페리", title: "The Little Prince", year: 1943}
```
- 동일한 키에 서로 다른 값을 추가하면 어떤 값이든 **가장 마지막에 선언된 값**을 사용한다.

```javascript
const book = {
    author: '생텍쥐페리',
    title: 'The Little Prince',
};
const update = { ...book, title: 'Little Prince' };
// {author: "생텍쥐페리", title: "Little Prince"}
```

- `Object.assign()`을 이용한 예제를 객체 펼침 연산자로 변경해보자.
  
```javascript
const defaults = {
    author: '',
    title: '',
    year: 2017,
    rating: null,
};

const book = {
    author: '생텍쥐페리',
    title: 'The Little Prince',
};

// const updated = Object.assign({}, defaults, book);
const bookWithDefaults = { ...defaults, ...book };
```
- `Object.assign()`에서 경험했던 깊은 병합 문제는 객체 펼침 연산자를 사용해도 여전히 발생한다.
- 그렇지만 아래와 같이 객체 펼침 연산자로 좀 더 보기 좋게 문제를 해결할 수 있다.
- 새로운 객체를 생성하려는 의도를 명확하게 전달할 수 있다.
```javascript
const employee = {
    ...defaultEmployee,
    name: {
        ...defaultEmployee.name,
    },
};
```

### 🎯 맵으로 명확하게 키-값 데이터를 갱신하라.
- 데이터 변경이 잦은 키-값 컬렉션에 맵 객체를 사용한다.
- [맵(Map)](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Map)은 특정 작업을 매우 쉽게 처리하는 특별한 종류의 컬렉션이다.
  - 키-값 쌍이 자주 추가되거나 삭제되는 경우
  - 키가 문자열이 아닌 경우
- 맵은 객체와 다르게 키-값 쌍을 자주 변경하는 경우에 적합하도록 특별히 설계되었기 때문에 인터페이스가 명확하고 메서드는 예측 가능한 이름을 가지고 있으며, 반복과 같은 동작이 내장되어 있다.
- 그렇기 때문에 맵을 사용하면 좀 더 생산성을 높일 수 있다. 
> - 맵은 좀 더 특화된 컬렉션이므로 자바스크립트 엔진 개발자들은 코드가 좀 더 빠르게 동작하도록 최적화할 수 있다.
> - 객체에서 키 탐색은 선형 시간이 소요되지만, 맵이 브라우저에 내장 구현된 경우 맵의 키 탐색은 로그 시간이 될 수 있다.
> - 즉, **큰 객체가 큰 맵보다 비용이 더 크다.**
> - 리액트 같은 몇몇 프로젝트에서 단순히 성능 개선을 목적으로 객체 대신 브라우저에 내장된 [맵으로 전환한 사례](https://github.com/facebook/react/pull/7232#issuecomment-231516712)도 있다.

- 먼저 새로운 맵 인스턴스를 생성하고 몇 가지 데이터를 추가한다.
- 맵에서는 항상 명시적으로 새로운 인스턴스를 생성해야 한다.

```javascript
let filters = new Map();
```
- 인스턴스를 생성한 후에는 `set()` 메서드를 이용해서 데이터를 추가한다.
  
```javascript
// filters.set(key, value);
filters.set('견종', '토이 푸들');
```
- 데이터를 가져오려면 `get()` 메서드를 사용한다. 인수로는 키만 전달한다.

```javascript
filters.get('견종');
// 토이 푸들
```
- 규모가 큰 맵을 만들 때는 어렵기 때문에 메서드를 차례로 연결해서 여러 값을 쉽게 추가할 수 있다.
- 새로운 인스턴스를 생성하고 바로 메서드를 연결할 수도 있다.
- 이러한 방법을 **체이닝(chaining)** 이라고 부른다.

```javascript
let filters = new Map()
    .set('견종', '토이 푸들')
    .set('크기', '소형견')
    .set('색상', '갈색');
filters.get('크기');
// 소형견
```
- 데이터를 추가하는 다른 방법으로 배열을 이용해서 정보를 추가할 수 있다.

```javascript
let filters = new Map(
    [
        ['견종', '토이 푸들'],
        ['크기', '소형견'],
        ['색상', '갈색'],
    ]
)
filters.get('색상');
// 갈색
```

- 맵에서 값을 제거할 때는 `delete()` 메서드를 사용한다.

```javascript
filters.delete('색상');
filters.get('색상'); // undefined
```

- 모든 키-값 쌍을 제거할 때는 `clear()` 메서드를 사용한다.

```javascript
filters.clear();
filters.get('색상'); // undefined
```
- 객체 대신 맵을 사용하면 코드가 훨씬 명료하게 보인다.
- 객체를 이용해서 만든 함수와 비교해보면 훨씬 큰 이점을 발견할 수 있다.
  - 맵 인스턴스에 항상 메서드를 사용한다.
  - `delete()` 메서드를 사용할 수 있기 때문에 인스턴스를 생성한 후에는 언어 수준의 연산자를 섞지 않는다.
  - `clear()` 메서드를 사용할 수 있기 때문에 새로운 인스턴스를 생성할 필요가 없다.
- 이러한 이유 때문에 정보를 자주 변경하는 경우에는 객체보다 맵을 사용하는 것이 훨씬 편리하고 모든 동작과 의도가 매우 명료하게 보인다.
- 또한, 객체의 경우 키에 사용할 수 있는 자료형에 제약이 있다.
- 가장 중요한 점은 **정수를 키로 사용할 수 없다.**

```javascript
const errors = {
    100: '이름이 잘못되었습니다.',
    110: '이름에는 문자만 입력할 수 있습니다.',
    200: '색상이 잘못되었습니다.',
};

function isDataVaild(data) {
    if(data.length < 10) {
        return errors.100
    }
}
```
- 위 예제 코드에서 실행하면 오류가 발생하는데 정수를 키로 하는 경우는 **점 표기법으로 접근할 수 없다.**
- `errors[100]`처럼 배열 표기법으로 정보에 접근할 수는 있지만 접근할 수 있는 이유는 객체를 생성했을 때 모든 정수가 문자열로 변환됐기 때문이다.
- 그리고 배열 표기법을 사용하면 탐색에 앞서 **정수가 문자열로 변경된다.**

```javascript
Object.keys(errors); // ["100", "110", "200"]
```
- 맵에는 위와 같은 문제가 없고 맵은 여러 가지 자료형을 키로 받을 수 있다.

```javascript
let errors = new Map([
    [100, '이름이 잘못되었습니다.'],
    [110, '이름에는 문자만 입력할 수 있습니다.'],
    [200, '색상이 잘못되었습니다.'],
]);
errors.get(100); // "이름이 잘못되었습니다."
```
- 맵도 객체와 마찬가지로 키만 모아서 확인할 수 있다
- 반환ㄷ뇐 값은 **맵이터레이터(MapIterator)** 라고 부른다.
- 맵이터레이터를 이용하면 데이터를 순회할 수 있다.
```javascript
errors.keys(); // MapIterator {100, 110, 200}
```

### 🎯 맵과 펼침 연산자로 키-값 데이터를 순회하라.
- 객체는 순회하기가 매우 번거롭다.
- 실제로 객체를 직접 순회할 수 있는 방법이 없다.
- 객체를 순회할 떄 `for ...in`문을 사용할 수 있지만, 객체 키 외에는 접근할 수 없다.
- 이와 대조적으로 맵은 직접 순회할 수 있다.
- 맵은 정렬과 순회에 필요한 기능이 내장되어 있고, 이 기능은 맵이터레이터의 일부로 포함되어 있다.

```javascript
const filters = new Map()
    .set('색상', '갈색')
    .set('견종', '토이 푸들');

function checkFilters(filters) {
    for(const entry of filters) {
        console.log(entry);
    }
}
// ["색상", "갈색"]
// ["견종", "토이 푸들"]
```
- 이터레이터는 키-값 쌍을 넘겨준다.
- 아래 코드를 살펴보면 맵에 있는 특별한 메서드인 `entries()` 메서드는 맵에 있는 키-값을 쌍으로 묶은 맵이터레이터를 반환한다.

```javascript
filters.entries();
// MapIterator {"색상" => "갈색", "견종" => "토이 푸들"}
```
- `entries()`는 키-값을 받을 수 있는 기능이 매우 편리하기 때문에 [ES2017부터 공식적으로 명세](https://github.com/tc39/proposal-object-values-entries)에 `Object`의 내장 메서드 `Object.entries()`로 추가되었다.
- `Object.entries()`를 사용하면 훨씬 단순하면서도 원래의 데이터 구조를 유지하는 코드를 작성할 수 있다.

```javascript
function getAppliedFilters(filters) {
    const applied = [];
    for(const [key, value] of filters) {
        applied.push(`${key}: ${value}`);
    }
    return `선택한 조건은 ${applied.join(', ')} 입니다.`;
}
// "선택한 조건은 색상: 갈색, 견종: 토이 푸들 입니다."
```

- 맵이 순서를 저장한다는 장점이 있긴하지만, 단점은 배열의 경우처럼 정렬 메서드가 내장되어 있지 않다는 점이다.
- 
```javascript
filters.sort(); // Uncaught TypeError: filters.sort is not a function
```
- 하지만 간단하게 펼침 연산자를 사용하여 해결할 수 있다.

```javascript
[...filters];
// [["색상", "갈색"], ["견종", "토이 푸들"]]
```
- 여기서는 배열의 배열을 정렬하는 것이므로 **비교 함수를 명시적으로 제공**해야 한다는 점에 주의해야 한다.
- 기본적으로 비교 함수가 키-값 쌍이 담긴 배열을 문자열로 변환해서 비교하기 때문에 반드시 필요하지는 않다. 그렇지만 비교 함수를 이용하면 코드의 의도를 좀 더 명확하게 전달할 수 있다.

```javascript
function sortByKey(a, b) {
    return a[0] > b[0] ? 1 : -1;
}

function getSortedAppliedFilters(filters) {
    const applied = [];
    for(const [key, value] of [...filters].sort(sortByKey)) {
        applied.push(`${key}:${value}`);
    }
    return `선택한 조건은 ${applied.join(', ')} 입니다.`;
}
// "선택한 조건은 견종:토이 푸들, 색상:갈색 입니다."
```
- 위의 코드를 간단하게 배열 메서드인 `map()`을 사용하여 변경할 수 있다.

```javascript
function getSortedAppliedFilters(filters) {
    const applied = [...filters]
            .sort(sortByKey)
            .map(([key, value]) => {
                return `${key}:${value}`;
            })
            .join(', ');
    return `선택한 조건은 ${applied} 입니다.`;
}
// "선택한 조건은 견종:토이 푸들, 색상:갈색 입니다."
```

### 🎯 맵 생성 시 부수 효과를 피하라.
- 맵의 인스턴스를 이용해 작업하면 몇 가지 문제가 발생할 수 있다.
  - 맵의 사본은 어떻게 생성할까?
  - 부수 효과를 피하면서 맵을 변경하려면 어떻게 해야할까?
-  사용자가 명시적으로 설정하지 않은 조건에 대해서는 기본값을 적용하고, 추가로 사용자가 적용하는 필터링 조건은 기본값을 덮어 써보자.
-  부수 효과를 신경 쓰지 않으면 맵에 `has()` 메서드를 사용해서 키가 존재하는지 확인할 수 있다. 이렇게 키가 있는지 확인하고, 없으면 키를 설정한다. 이미 존재하는 키라면 무시하도록 한다.

```javascript
function applyDefaults(map, defaults) {
    for(const [key, value] of defaults) {
        if(!map.has(key)){
            map.set(key, value);
        }
    }
}
```

- 이 방법은 기본값과 사용자 데이터를 병합하는 것이라면 성공이지만, 기본값과 사용자 데이터를 따로 보여줄 경우에는 그렇지 못하다.
- 이 문제를 우회하는 가장 간단한 방법은 맵의 사본을 만드는 것이다.
- 아래와 같이 키-값 쌍이 담긴 배열을 전달하면 새로운 맵을 생성할 수 있고, 펼침 연산자를 이용해서 키-값 쌍의 목록도 생성할 수 있다.

```javascript
function applyDefaults(map, defaults) {
    const copy = new Map([...map]);
    for(const [key, value] of defaults) {
        if(!copy.has(key)) {
            copy.set(key, value);
        }
    }
    return copy;
}
```
- 위와 같은 코드는 기본값과 사용자가 선택한 조건을 모두 포함하면서 부수 효과로부터 안전하다.
- 여기서 객체 펼침 연산자를 사용하여 개선해보자.

```javascript
function applyDefaults(map, defaults) {
    return new Map([...defaults, ...map]);
}
```

### 🎯 세트를 이용해 고윳값을 관리하라.
- [세트(Set)](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Set)는 각 고유 항목을 하나씩만 갖는 특화된 배열과 같다.
- 중복 값을 제거하는 방법에는 `for` 문을 사용하거나 `reduce()` 메서드를 쓸 수 있다.
- `for` 문 사용할 때.

```javascript
function getUnique(attributes) {
    const unique = [];
    for(const attribute of attributes) {
        if(!unique.includes(attribute)) {
            unique.push(attribute);
        }
    }
    return unique;
}
getUnique(['검정색','검정색','갈색']); // // ["검정색", "갈색"]
```
- 세트를 사용해서 고윳값만 분류할 수 있다.

```javascript
const colors = ['검정색','검정색','갈색'];
const unique = new Set(colors);
// Set(2) {"검정색", "갈색"}
```

- 하지만 우리가 필요한 것은 세트가 아니라, 고유 속성만 담긴 배열이다.
- 그렇기 때문에 맵과 마찬가지로 세트에도 펼침 연산자를 사용할 수 있는데, 맵과 다른 차이점은 **세트가 배열을 반환**한다는 것이다.
- 심지어 **인스턴스를 생성하자마자 펼침 연산자를 사용할 수도 있다.**

```javascript
function getUnique(attributes) {
    return [...new Set(attributes)];
}
getUnique(['검정색','검정색','갈색']); // ["검정색", "갈색"]
```
- 세트는 맵과 유사하게 값을 추가하고 검증하는 메서드가 있다.
- 세트의 경우 값을 추가할 때는 `add()` 메서드를, 검증할 때는 `has()` 메서드를 사용한다.
- 또한, 세트에도 맵처럼 `delete()`와 `clear()` 메서드가 있다.
- 즉, 세트에 항목을 추가할 때는 배열에 담아 한 번에 전달할 수 있지만, 반복문을 이용해서 개별적으로 추가할 수도 있다.
- 세트는 각 값을 하나씩만 보관할 수 있기 때문에 **세트에 없는 값은 추가할 수 있지만**, 이미 **세트에 존재하는 값을 추가하면 무시된다.**
- 순서도 보장되면 최초에 값이 추가된 위치가 유지되므로 **이미 존재하는 값을 다시 넣더라도 윈래 위치를 유지한다.**

```javascript
let names = new Set();
names.add('joe'); // Set(1) {"joe"}
names.add('bea'); // Set(2) {"joe", "bea"}
names.add('joe'); // Set(2) {"joe", "bea"}
```
- 이렇게 세트를 사용하면 객체 형태로 정보가 담긴 배열에서 고유한 정보를 한 번에 가져올 수 있다.
- 그렇기 때문에 고유한 항목을 찾기 위해 색상을 먼저 수집할 필요가 없어진다.

```javascript
function getUniqueColors(dogs) {
    const unique = new Set();
    for(const dog of dogs) {
        unique.add(dog.color);
    }
    return [...unique];
}
```
- 위 코드를 `reduce()` 배열 메서드를 사용해서 간단하게 작성할 수 있다.

```javascript
function getUniqueColors(dogs) {
    return [...dogs.reduce((colors, {color}) => colors.add(color), new Set())];
}
```
- 추가적으로 [위크맵(WeakMap)](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)과 [위크셋(WeakSet)](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/WeakSet)도 확인해보자.