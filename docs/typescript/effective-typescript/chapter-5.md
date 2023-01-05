---
sidebar_position: 6
sidebar_label: 5. any 다루기
---

# 🐤 Chapter 5. any 다루기

## 🥕 아이템 38. `any` 타입은 가능한 한 좁은 범위에서만 사용하기

```ts
function processBar(b: Bar) { /* ... */ }

function f() {
  const x = expressionReturnFoo();
  processBar(x);
  //         ~ 'Foo' 형식의 인수는 'Bar' 형식의 매개변수에 할당될 수 없습니다.
}
```

문맥상으로 `x`라는 변수가 동시에 `Foo` 타입과 `Bar` 타입에 할당 가능하다면, 오류를 제거하는 방법은 두 가지입니다.

```ts
function f1() {
  const x: any = expressionReturnFoo(); // 이렇게 하지 맙시다.
  processBar(x);
}

function f2() {
  const x = expressionReturnFoo();
  processBar(x as any); // 이게 낫습니다.
}
```

두 가지 해결책 중에서 `f1`에 사용된 `x: any`보다 `f2`에 사용된 `x as any` 형태가 권장됩니다. 그 이유는 `any` 타입이 `processBar` 함수의 매개변수에서만 사용된 표현식이므로 다른 코드에는 영향을 미치지 않기 때문입니다.   

비슷한 관점에서, 타입스크립트가 함수의 반환 타입을 추론할 수 있는 경우에도 함수의 반환 타입을 명시하는 것이 좋습니다. 함수의 반환 타입을 명시하면 `any` 타입의 함수 바깥으로 영향을 미치는 것을 방지할 수 있습니다.   

`f1`은 오류를 제거하기 위해 `x`를 `any` 타입으로 선언했습니다. 한편 `f2`는 오류를 제거하기 위해 `x`가 사용되는 곳에 `as any` 단언문을 사용했습니다. 여기서 `@ts-ignore`를 사용하면 `any`를 사용하지 않고 오류를 제거할 수 있습니다.   

```ts
function f1() {
  const x = expressionReturnFoo();
  // @ts-ignore
  processBar(x);
  return x;
}
```

그러나 근본적인 원인을 해결한 것이 아니기 때문에 다른 곳에서 더 큰 문제가 발생할 수도 있습니다. 타입 체커가 알려 주는 오류는 문제가 될 가능성이 높은 부분이므로 근본적인 원인을 찾아 적극적으로 대처하는 것이 바람직합니다.   
이번에는 객체와 관련한 `any`의 사용법을 살펴보겠습니다. 어떤 큰 객체 안의 한 개 속성이 타입 오류를 가지는 상황을 예로 들어 보겠습니다.

```ts
const config: Config = {
  a: 1,
  b: 2,
  c: {
    key: value
  // ~~ 'foo' 속성이 'Foo' 타입에 필요하지만 'Bar' 타입에는 없습니다.
  }
};
```

단순히 생각하면 `config` 객체 전체를 `as any`로 선언해서 오류를 제거할 수 있습니다.

```ts
const config: Config = {
  a: 1,
  b: 2,
  c: {
    key: value
  }
} as any; // 이렇게 하지 맙시다!
```

객체 전체를 `any`로 단언하면 다른 속성들 역시 타입 체크가 되지 않는 부작용이 생깁니다. 그러므로 다음 코드처럼 최소한의 범위에서만 `any`를 사용하는 것이 좋습니다.

```ts
const config: Config = {
  a: 1,
  b: 2,
  c: {
    key: value as any
  }
};
```
