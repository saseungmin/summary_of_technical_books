---
sidebar_position: 4
sidebar_label: 3. 객체와 타입
---

# 🐤 Chapter 3: 객체와 타입

## 🦄 타입스크립트 변수 선언문

### 📚 타입스크립트 기본 제공 타입
- 자바스크립트와 타입스크립트의 기본 타입

|유형|자바스크립트 타입|타입스크립트 타입|
|:------:|:---:|:---:|
|수 유형|Number|number|
|불리언 타입|Boolean|boolean|
|문자열 타입|String|string|
|객체 타입|Object|object|

### 📚 let과 const 키워드
- 다음은 `let` 키워드로 변수를 선언하는 방법이다.
- `let`으로 선언한 변수는 코드에서 그 값이 수시로 변경될 수 있음을 암시한다.

```ts
let a = 1;
```

- 다음은 `const` 키워드로 변수를 선언하는 방법이다.
- `const`로 변수를 선언할 때는 반드시 **초기값을 명시해야 한다.**
- `const` 변수는 코드에서 변숫값이 절대 변하지 않는다는 것을 암시한다.

```ts
const a = 1;
```

### 📚 타입 주석
- 타입스크립트는 자바스크립트 변수 선언문을 확장해 다음과 같은 형태로 타입을 명시할 수 있다.
- 이를 **타입 주석**(**type annotation**)이라고 한다.

```ts
// let 변수 이름: 타입 [= 초깃값]
// const 변수이름: 타입 = 초깃값
let n: number = 1;
let b: boolean = true;
let s: string = 'hello';
let o: object = {};
```
- 타입스크립트는 `let`으로 선언한 변숫값은 **타입 주석으로 명시한 타입에 해당하는 값**으로만 바꿀 수 있다.

```ts
let n: number = 1;
let b: boolean = true;
let s: string = 'hello';

n = 'a'; // 타입 불일치 오류 발생
b = 1; // 타입 불일치 오류 발생
s = false; // 타입 불일치 오류 발생
```

### 📚 타입 추론
- 타입스크립트는 자바스크립트와 호환성을 위해 타입 주석 부분을 생략할 수 있다.
- 타입스크립트 컴파일러는 다음과 같은 코드를 만나면 **대입 연산자 `=` 오른쪽 값에 따라 변수의 타입을 지정**한다.
- 이를 **타입 추론**(**type inference**)이라고 한다.

```ts
let n = 1; // n의 타입을 number로 판단
let b = true; // b의 타입을 boolean으로 판단
let s = 'hello'; // s의 타입을 string으로 판단
let o = {}; // o의 타입을 object로 판단
```

- 즉, 변수 선언문에 타입 주석을 명시하지 않았지만, 컴파일러가 초깃값에 따라 타입을 추론하므로 각 변수는 초깃값에 해당하는 타입으로 지정된다. 따라서 **이후에 각 변수에는 해당 타입의 값만 지정할 수 있다.**

### 📚 any 타입
- 다음 코드에서 변수 `a`는 타입이 `any`이므로 값의 타입과 무관하게 어떤 종류의 값도 저장할 수 있다.

```ts
let a: any = 0;
a = 'hello';
a = true;
a = {};
```

### 📚 undefined 타입
- 자바스크립트에서 `undefined`는 값이다. (변수를 초기화하지 않으면)
- 그러나 타입스크립트에서 `undefined`는 타입이기도 하고 값이기도 하다.

```ts
let u: undefined = undefined;
u = 1; // Type '1' is not assignable to type 'undefined' 오류 발생
```
- 타입의 상속 관계를 보면 `any`는 **모든 타입의 루트 타입, 즉 최상위 타입**이다.
- 반면에 `undefined`는 모든 타입의 최하위 타입이다.

![typescript-type](/img/do-it-typescript/chapter3-1.png)

- [이미지 출처](https://mishka.kr/2020/03/18/TypeSctipt-3-var/)

### 📚 템플릿 문자열
- 변수에 담긴 값을 조합해 문자열을 만들 수 있게 하는 **템플릿 문자열**을 제공한다.

```ts
let count = 10, message = 'Your count';
let result = `${message} is ${count}`;
console.log(result); // Your count is 10
```

## 🦄 객체와 인터페이스
- `object` 타입은 인터페이스와 클래스의 상위 타입이다.
- `object` 타입으로 선언된 변수는 `number`, `boolean`, `string`타입의 값을 가질 수는 없지만, 다음처럼 속성 이름이 다른 객체를 모두 자유롭게 담을 수 있다.

```ts
let o: object = { name: 'Jack', age: 32 };
o = { first: 1, second: 2 };
```
- `object` 타입은 마치 객체를 대상으로 하는 `any` 타입처럼 동작한다.
- 타입스크립트의 인터페이스 구문은 이렇게 동작하지 않게 하려는 목적으로 고안되었다.
- 즉, 변수 `o`에는 항상 `name`과 `age` 속성으로 구성된 객체만 가질 수 있게 해서 다른 타입일 경우 오류를 발생하게 한다.

### 📚 인터페이스 선언문
- 타입스크립트는 객체의 타입을 정의할 수 있게 하는 `interface`라는 키워드를 제공한다.

```ts
interface IPerson {
  name: string;
  age: number;
};
```

- 인터페이스의 목적은 객체의 타입 범위를 좁히는 데 있다. 따라서 다음처럼 `IPerson` 인터페이스의 조건을 벗어나는 코드는 모두 오류가 발생한다.

```ts
interface IPerson {
  name: string;
  age: number;
};

let good: IPerson = { name: 'Jack', age: 32 };

// 'age' 속성이 '{ name: string; }' 형식에 없지만 'IPerson' 형식에서 필수입니다.
let bad1: IPerson = { name: 'Jack' };
// 'name' 속성이 '{ age: number; }' 형식에 없지만 'IPerson' 형식에서 필수입니다.
let bad2: IPerson = { age: 32 };
// '{}' 형식에 'IPerson' 형식의 name, age 속성이 없습니다.
let bad3: IPerson = {};
// 개체 리터럴은 알려진 속성만 지정할 수 있으며 'IPerson' 형식에 'etc'이(가) 없습니다.
let bad4: IPerson = { name: 'Jack', age: 32, etc: true };
```

### 📚 선택 속성 구문
- 인터페이스를 설계할 때 어떤 속성은 반드시 있어야 하지만, 어떤 속성은 있어도 되고 없어도 되는 형태로 만들고 싶을 때가 있다.
- 이러한 속성을 **선택 속성**(**optional property**)이라고 한다.

```ts
interface IPerson2 {
  name: string;
  age: number;
  etc?: boolean; // optional property
}

let good1: IPerson2 = { name: 'Jack', age: 32 };
let good2: IPerson2 = { name: 'Jack', age: 32, etc: true };
```

### 📚 익명 인터페이스
- 타입스크립트는 `interface` 키워드도 사용하지 않고 인터페이스의 이름도 없는 인터페이스를 만들 수 있다.
- 이를 **익명 인터페이스**(**anonymous interface**)라고 한다.
- 익명 인터페이스 예

```ts
let ai: {
  name: string,
  age: number,
  etc?: boolean,
} = { name: 'Jack', age: 32 };
```
- 함수에 사용된 익명 인터페이스 예

```ts
function printMe(me: { name: string, age: number, etc?: boolean }) {
  console.log(
    me.etc?
      `${me.name} ${me.age} ${me.etc}` :
      `${me.name} ${me.age}`
  );
}

printMe(ai); // Jack 32
```

## 🦄 객체와 클래스

### 📚 클래스 선언문
- 타입스크립트는 객체지향 언어에서 흔히 볼 수 있는 `class`, `private`, `public`, `protected`, `implements`, `extend`와 같은 키워드를 제공한다.
- 문법적인 차이만 약간 있을 뿐 사실상 그 의미는 다른 언어와 같다.
- 다음은 클래스 선언문 기본 형태이다.

```ts
class 클래스이름 {
  [private | protected | public] 속성 이름[?]: 속성 타입[...]
}
```

- 다음 코드는 `name`과 `age`라는 속성을 가진 클래스를 선언한다.

```ts
class Person1 {
  name: string;
  age?: number;
}
```

- 다음 코드는 `Person1` 클래스에 `new` 연산자를 적용해 `jack1`이라는 이름의 `Person1` 타입 변수를 만든다.

```ts
let jack1: Person1 = new Person1();
jack1.name = 'Jack';
jack1.age = 32;
console.log(jack1); // Person1 { name: 'Jack', age: 32 }
```

### 📚 접근 제한자
- 클래스 속성은 `public`, `private`, `protect`와 같은 접근 제한자(access modifier)를 이름 앞에 붙일 수 있다. 만약 생략하면 모두 `public`으로 간주한다.

### 📚 생성자
- 타입스크립트 클래스는 `constructor`라는 이름의 특별한 메서드를 포함하는데, 이를 **생성자**라고 한다.
- 다른 언어와 다르게 타입스크립트 클래스는 다음 코드처럼 클래스의 속성(name, age)을 선언할 수 있다.
- 즉, 앞에서 작성한 `Person1`클래스와 똑같이 동작한다. 

```ts
class Person2 {
  constructor(public name: string, public age?: number) {};
}

let jack2: Person2 = new Person2('Jack', 32);
console.log(jack2); // Person2 { name: 'Jack', age: 32 }
```

- 타입스크립트는 생성자의 매개변수에 `public`과 같은 접근 제한자를 붙이면 해당 매개변수의 이름을 가진 속성이 클래스에 선언된 것처럼 동작한다.
- 즉 다음과 같이 장황하게 구현된 것을 함축해서 구현한 것이다.

```ts
class Person3 {
  name: string;
  age?: number;
  constructor(name: string, age?: number) {
    this.name = name;
    this.age = age;
  };
}

let jack3: Person3 = new Person3('Jack', 32);
console.log(jack3); // Person3 { name: 'Jack', age: 32 }
```

### 📚 인터페이스 구현
- 타입스크립트 클래스는 인터페이스를 구현할 수 있다.
- 클래스가 인터페이스를구현할 때는 다음처럼 `implements` 키워드를 사용한다.

```ts
class 클래스이름 implements 인터페이스이름 {
  //...
}
```

- 한 가지 앞으로 기억해 둬야 할 점은 **인터페이스는 이러이러한 속성이 있어야 한다는 규약(spec)에 불과할 뿐 물리적으로 해당 속성을 만들지 않는다는 점이다.**
- 따라서 클래스 몸통에는 반드시 인터페이스가 정의하고 있는 속성을 멤버 속성으로 포함해야 한다.

```ts
interface IPerson4 {
  name: string;
  age?: number;
}

class Person4 implements IPerson4 {
  name: string;
  age: number;
}
```

- 다음 코드는 앞서 본 `Person2` 구현 방식을 인터페이스 구현에 응용한 것이다.

```ts
interface IPerson4 {
  name: string;
  age?: number;
}

class Person4 implements IPerson4 {
  constructor(public name: string, public age?: number) {};
}

export let jack4: IPerson4 = new Person4('Jack', 32);
console.log(jack4); // Person4 { name: 'Jack', age: 32 }
```

### 📚 추상 클래스
- 타입스크립트는 다른 언어처럼 `abstract` 키워드를 사용해 추상 클래스를 만들 수 있다.
- 추상 클래스는 자신의 속성이나 메서드 앞에 `abstract`를 붙여 나를 상속하는 다른 클래스에서 이 속성이나 메서드를 구현하게 한다.

```ts
abstract class 클래스이름 {
  abstract 속성이름: 속성타입;
  abstract 메서드이름() {};
}
```

- 다음 코드는 `name` 속성 앞에 `abstract`가 붙었으므로 `new` 연산자를 적용해 객체를 만들 수 없다.

```ts
abstract class AbstractPerson5 {
  abstract name: string;
  constructor(public age?: number) {}
}
```

### 📚 클래스의 상속
- 객체지향 언어는 부모 클래스를 상속받는 상속 클래스를 만들 수 있는데, 타입스크립트는 다음처럼 `extends` 키워드를 사용해 상속 클래스를 만든다.

```ts
class 상속클래스 extends 부모클래스 { /*...*/ }
```

- 다음 `Person5` 클래스는 `AbstractPerson5` 추상 클래스를 상속해 `AbstractPerson5`가 구현한 `age`를 얻고, `AbstractPerson5`를 상속받는 클래스가 구현해야 할 `name` 속성을 구현한다.
- 참고로 타입스크립트에서는 부모 클래스의 생성자를 `super` 키워드로 호출할 수 있다.

```ts
abstract class AbstractPerson5 {
  abstract name: string;
  constructor(public age?: number) {}
}

class Person5 extends AbstractPerson5 {
  constructor(public name: string, age?: number) {
    super(age);
  }
}

let jack5: Person5 = new Person5('Jack', 32);
console.log(jack5); // Person5 { name: 'Jack', age: 32 }
```

### 📚 static 속성
- 타입스크립트 클래스는 정적인 속성을 가질 수 있다.
- 클래스의 정적 속성은 다음과 같은 형태로 선언한다.

```ts
class 클래스이름 {
  static 정적속성이름: 속성타입
}
```

- 다음처럼 정적 속성은 점 표기법을 사용해 값을 얻거나 설정할 수 있다.

```ts
class A {
  static initValue = 1;
}

let initVal = A.initValue; // 1
```

## 🦄 객체의 비구조화 할당문
- 다음처럼 인터페이스나 클래스를 사용해 관련된 정보를 묶어 새로운 타입으로 표현한다.
- 이를 **구조화**(**structuring**)라고 한다.

```ts
export interface IPerson {
  name: string;
  age: number;
}

export interface ICompany {
  name: string;
  age: number;
}
```

- 코드를 이처럼 구조화 하면 다음 코드에서 보듯 비슷한 유형의 변수를 쉽게 만들 수 있다.
- 이로써 코드의 기능 확장이 수월해진다.

```ts
import { IPerson, ICompany } from "./IPerson_ICompany";

let jack: IPerson = { name: 'Jack', age: 32},
    jane: IPerson = { name: 'jane', age: 32};

let apple: ICompany = { name: 'Apple', age: 42},
    ms: ICompany = { name: 'Microsoft', age: 34};
```

### 📚 비구조화란?
- 구조화된 데이터를 분해하는 것을 **비구조화**(**destructuring**)라고 한다.

```ts
let name = jack.name;
let age = jack.age;
```

### 📚 비구조화 할당
- 비구조화 할당을 객체에 적용하려면 얻고 싶은 속성을 중괄호로 묶는다.

```ts
import { IPerson } from "./IPerson_ICompany";

let jack: IPerson = { name: 'Jack', age: 32};
let {name, age} = jack; // 비구조화 할당

console.log(name, age); // Jack 32
```

### 📚 잔여 연산자
- 점을 연이어 3개를 사용하는 `...` 연산자는 사용되는 위치에 따라 **잔여 연산자**(**rest operator**) 혹은 **전개 연산자**(**spread operator**)라고 부른다.
- 잔여 연산자 예

```ts
let address: any = {
  country: 'Korea',
  city: 'Seoul',
  address1: 'Gangnam-gu',
  address2: 'Sinsa-dong',
  address3: '123-456',
};

const { country, city, ...detail} = address;

console.log(detail); 
// { address1: 'Gangnam-gu', address2: 'Sinsa-dong', address3: '123-456' }
```

### 📚 전개 연산자
- 점 3개 연산자가 비구조화 할당문이 아닌 곳에서 사용될 때 이를 전개 연산자라고 한다.

```ts
let coord = { ...{ x: 0 }, ...{ y: 0 } };
console.log(coord); // { x: 0, y: 0 }
```

- 전개 연산자는 의미 그대로 **객체의 속성을 모두 전개해 새로운 객체로 만들어 준다.**


```ts
let part1 = { name: 'jane' };
let part2 = { age: 22 }; 
let part3 = { city: 'Seoul', country: 'Kr'};

let merged = { ...part1, ...part2, ...part3 };

console.log(merged); // { name: 'jane', age: 22, city: 'Seoul', country: 'Kr' }
```

## 🦄 객체의 타입 변환

### 📚 타입 변환
- 타입이 있는 언어들은 특정 타입의 변숫값을 다른 타입의 값으로 변환할 수 있는 기능을 제공한다.
- 이를 **타입 변환**(**type conversion**)이라고 한다.
- 다음은 `person` 변수의 타입은 `object`이다. 그런데 `object` 타입은 `name` 속성을 가지지 않으므로 오류가 발생한다.

```ts
let person: object = { name: 'Jack', age: 32 };
person.name // 'object' 형식에 'name' 속성이 없습니다.
```

- 다음은 이 오류를 타입 변환 구문을 사용해 해결한 것이다.
- `person` 변수를 일시적으로 `name` 속성이 있는 타입, 즉 `{name: string}` 타입으로 변환해 `person.name` 속성값을 얻게 했다.

```ts
let person: object = { name: 'Jack', age: 32 };

(<{name:string}>person).name;
```

### 📚 타입 단언
- 그런데 타입스크립트는 타입 변환이 아닌 **타입 단언**(**type assertion**)이라는 용어를 사용한다.
- 타입 단언문은 다음 두 가지 형태가 있다.

```ts
(<타입>객체)
(객체 as 타입)
```

- 인터페이스를 구현한 `INameable.ts` 파일을 만든다.

```ts
export default interface INameable {
  name: string
};
```

- 다음 코드는 타입 단언의 두 가지 형태이다.

```ts
import INameable from './INameable';

let obj: object = { name: 'Jack' };

let name1 = (<INameable>obj).name;
let name2 = (obj as INameable).name;

console.log(name1, name2); // Jack Jack
```
- 둘의 차이는 형태만 다를 뿐 내용상으로는 같다.
