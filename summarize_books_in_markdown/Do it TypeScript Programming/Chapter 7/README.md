# 🐤 Chapter 7: Promise와 async/await 구문

## 🦄 비동기 콜백 함수

### 📚 동기와 비동기 API
- Node.js에서 파일 시스템과 관련된 기능을 모아둔 `fs` 패키지를 제공하는데, 동기 비동기 버전으로 나누어 제공한다. 예를 들어, 동기 버전인 `readFileSync`와 비동기 버전인 `readFile`로 제공한다.

```ts
import { readFileSync, readFile } from "fs";

// 동기 방식으로 읽기
const buffer: Buffer = readFileSync('./package.json');
console.log(buffer.toString());

// 비동기 방식으로 읽기
readFile('./package.json', (error: Error, buffer: Buffer) => {
  console.log(buffer.toString());
});

// Promise와 async/await 구문을 사용한 예
const readFilePromise = (filename: string): Promise<string> =>
  new Promise<string>((resolve, reject) => {
    readFile(filename, (error: Error, buffer: Buffer) => {
      if(error) {
        reject(error);
      } else {
        resolve(buffer.toString());
      }
    });
  });

(async () => {
  const content = await readFilePromise('./package.json');
  console.log(content);
})();
```

- API 함수는 일반 함수와 달리 하드디스크에 저장된 파일을 읽는 등 실행시 물리적인 시간이 소요된다.
- 따라서 파일 내용을 모두 읽을 때까지 프로그램의 동작을 잠시 멈추는 동기 방식의 API와 프로그램의 동작을 멈추지 않는 대신 결과를 콜백 함수로 얻게 하는 비동기 방식의 API를 제공한다.
- 비동기 API의 콜백 함수를 **비동기 콜백 함수**라고 한다. 비동기 콜백 함수는 일반 함수와 달리 API의 물리적인 동작 결과를 수신하는 목적으로만 사용한다.

### 📚 단일 스레드와 비동기 API
- 자바스크립트는 단일 스레드로 동작하므로 될 수 있으면 `readFileSync`와 같은 동기 API를 사용하지 말아야 한다.
- 동기 API가 실행되면, 운영체제는 동기 API의 작업 결과를 함수의 반환값으로 돌려줘야 한다. 이 때문에 운영체제는 동기 API가 실행된 코드를 일시적으로 멈춘 다음, 또 다른 스레드에서 실제 작업을 실행해 켤과를 얻으면 그때서야 잠시 멈췄던 동기 API를 실행하면서 결괏값을 반환한다. 그렇기 때문에 결과를 반환할 때까지 일시적으로 멈추는 현상이 발생한다.

### 📚 콜백 지옥
- 비동기 API를 사용하면 콜백 함수에서 또 다시 다른 비동기 API를 호출하는 코드를 만들 때 코드가 매우 복잡해진다.

```ts
import { readFile } from "fs";

readFile('./package.json', (error: Error, buffer: Buffer) => {
  if (error) {
    throw error;
  } else {
    const content: string = buffer.toString();
    console.log(content);
  }

  readFile('./tsconfig.json',(err: Error, buffer: Buffer) => {
    if (error) {
      throw error;
    } else {
      const content: string = buffer.toString();
      console.log(content);
    }
  })
});
```

- `Promise`를 사용하면 이런 콜백 지옥에 빠진 코드를 좀 더 다루기 쉬운 형태의 코드로 만들 수 있다.


## 🦄 Promise 이해하기
- 타입스크립트에서 `Promise`는 다음과 같이 제네릭 클래스 형태로 사용된다.

```ts
const numPromise: Promise<number> = new Promise<number>(콜백함수);
const strPromise: Promise<string> = new Promise<string>(콜백함수);
const arrayPromise: Promise<number[]> = new Promise<number[]>(콜벡힘수);
```

- 타입스크립트 `Promise`의 콜백 함수는 다음처럼 `resolve`와 `reject` 함수를 매개변수로 받는 형태이다.

```ts
new Promise<T>((
  resolve: (successValue: T) => void,
  reject: (any) => void,
) => {
  // 코드 구현
});
```

### 📚 resolve와 reject 함수
- 다음은 비동기 API인 `readFile`을 호출하는 내용을 프로미스로 구현한 예이다.

```ts
import { readFile } from 'fs';

export const readFilePromise = (filename: string): Promise<string> =>
  new Promise<string>((
    resolve: (value: string) => void,
    reject: (error: Error) => void) => {
      readFile(filename, (err: Error, buffer: Buffer) => {
        if(err) {
          reject(err);
        } else {
          resolve(buffer.toString());
        }
      })
    }
  )
```

- 다음 코드는 `readFilePromise` 함수가 반환하는 `Promise` 타입 객체의 `then`, `catch`, `finally` 메서드를 메서드 체인 형태로 사용한다.

```ts
import { readFilePromise } from "./readFilePromise";

readFilePromise('./package.json')
  .then((content: string) => {
    console.log(content);
    return readFilePromise('./tsconfig.json');
  })
  .then((content: string) => {
    console.log(content);
    return readFilePromise('.');
  })
  .catch((err: Error) => console.log('error: ', err.message))
  .finally(() => console.log('프로그램 종료'));
```

### 📚 Promise.resolve와 Promise.reject 메서드
- `Promise.resolve(값)` 형태로 호출하면 항상 이 갑은 `then` 메서드에서 얻을 수 있다.

```ts
Promise.resolve({ name: 'Jack', age: 32 })
  .then(value => console.log(value)); // { name: 'Jack', age: 32 }
```

- `Promise.reject(Error 타입 객체)`를 호출하면 이 Error 타입 객체는 항상 `catch` 메서드의 콜백 함수에서 얻을 수 있다.

```ts
Promise.reject(new Error('에러 발생'))
  .catch((err: Error) => console.log('error: ', err.message)); // error: 에러 발생
```

### 📚 then-체인
- `Promise` 객체에 `then` 메서드를 여러 번 호출하는 코드 형태를 `then-체인`이라고 한다.

```ts
Promise.resolve(1)
  .then((value: number) => {
    console.log(value); // 1
    return Promise.resolve(true);
  })
  .then((value: boolean) => {
    console.log(value); // true
    return [1, 2, 3];
  })
  .then((value: number[]) => {
    console.log(value); // [1, 2, 3]
    return { name: 'jack', age: 32 };
  })
  .then((value: { name: string, age: number }) => {
    console.log(value); // { name: 'jack', age: 32 }
  })
```

### 📚Promise.all 메서드
- `Promise.all` 메서드는 `Promise` 객체를 배열 형태로 받아, 모든 객체를 대상으로 `resolve`된 값들의 배열로 만들어 준다.
- `Promise.all` 메서드는 이런 내용으로 구성된 또 다른 `Promise` 객체를 반환하므로 해소된 값들의 배열은 `then` 메서드를 호출해서 얻는다.
- 만약, 배열에 담긴 `Promise` 객체 중 거절 객체가 발생하면 더 기다리지 않고 해당 거절 값을 담은 `Promise.reject` 객체를 반환한다.

```ts
const getAllResolvedResult = <T>(promises: Promise<T>[]) => Promise.all(promises);

getAllResolvedResult<any>([Promise.resolve(true), Promise.resolve('hello')])
  .then(result => console.log(result)); // [true, 'hello']

getAllResolvedResult<any>([Promise.reject(new Error('error')), Promise.resolve(1)])
  .then(result => console.log(result)) // 호출되지 않는다.
  .catch(error => console.log('error: ', error.message)); // error: error
```

### 📚 Promise.race 메서드
- `Promise.race`클래스 메서드는 배열에 담긴 프로미스 객체 중 하나라도 `resolve`되면 이 값을 담은 `Promise.resolve` 객체를 반환한다. 만일 거절 값이 가장 먼저 발생하면 `promise.reject` 객체를 반환한다.

```ts
Promise.race([Promise.resolve(true), Promise.resolve('hello')])
  .then(value => console.log(value)); // true

Promise.race([Promise.resolve(true), Promise.reject(new Error('hello'))])
  .then(value => console.log(value)) // true
  .catch(error => console.log(error.message)); // 호출되지 않는다

Promise.race([Promise.reject(new Error('error')), Promise.resolve(true)])
  .then(value => console.log(value)) // 호출되지 않는다
  .catch(error => console.log(error.message)); // error
```

## 🦄 async와 await 구문

### 📚 async 함수의 두 가지 성질
- `async` 함수 수정자가 붙은 함수는 다음과 같은 성질을 가지고 있다.

> 1. 일반 함수처럼 사용할 수 있다.
> 2. `Promise` 객체로 사용할 수 있다.

### 📚 async 함수가 반환하는 값의 의미
- `async` 함수는 값을 반환할 수 있다. 이떄 반환값은 `Promise` 형태로 변환되므로 다음처럼 `then` 메서드를 호출해 `async` 함수의 반환값을 얻어야 한다.

```ts
const asyncReturn = async() => {
  return [1, 2, 3];
}

asyncReturn()
  .then(value =>  console.log(value)); // [1, 2, 3]
```
### 📚 async 함수의 예외 처리

```ts
const asyncException = async () => {
  throw new Error('error');
}

asyncException()
  .catch(err => console.log('error: ', err.message)); // error: error
```

### 📚 async 함수와 Promise.all

```ts
import { readFilePromise } from "./readFilePromise"

const readFilesAll = async (fileNames: string[]) => {
  return await Promise.all(
    fileNames.map(fileNames => readFilePromise(fileNames))
  );
}

readFilesAll(['./package.json', './tsconfig.json'])
  .then(([packageJson, tsConfigJson]: string[]) => {
    console.log(packageJson);
    console.log(tsConfigJson);
  })
  .catch(err => console.log(err))
```
