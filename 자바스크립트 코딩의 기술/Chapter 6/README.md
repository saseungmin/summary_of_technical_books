## 🌈 Chapter 6 : 매개변수와 return 문을 정리하라.

### 🎯 매개변수 기본값을 생성하라.
- 아래 코드에서 실수로 두번째 매개변수를 빠뜨렸 때, 자바스크립트는 함수에 모든 매개변수를 전달하지 않아도 된다.
- 매개변수를 선택적으로 적용할 수 있기 때문이다. 매개변수를 누락하면 값은 `undefined`가 된다.
  
```javascript
function convertWeight(weight, ounces) {
  const oz = ounces ? ounces / 16 : 0;
  const total = weight + oz;
  return total / 2.2;
}
```
- 위 예제에서 `convertWeight(44, 8)`을 하면 `20.22727...`을 반환한다. 
- 또한, `convertWeight(6, 6)`을 실행하면 `3`이 반환될 거 같지만, 실제로는 `2.9999....`가 나온다. (저는 `2.8977272727272725` 이렇게 나옴..)
- 이러한 이유는 [**부동 소수점 연산**](https://ko.wikipedia.org/wiki/%EB%B6%80%EB%8F%99%EC%86%8C%EC%88%98%EC%A0%90) 때문이다. ([모든 컴퓨터 과학자가 알아야 할 부동 소수점 연산](https://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html))
- 반올림 처리로 부동 소수점 연산과 사용자가 예상하는 반환값이 어긋나는 경우를 보완할 수 있다.
- 반올림을 처리하기 위해 `roundToDecimalPlace`를 작성하였지만 기본값으로 소수점 두 번째 자리까지 나오게 하려먼 단순히 매개변수 roundTo가 참인지 확인하는 것만으로는 부족하다.
- 그렇기 때문에 매개변수로 아무 값도 전달되지 않아 undefined가 되지는 않는지 명시적으로 확인해 준다.

```javascript
function convertWeight(weight, ounces, roundTo) {
  const oz = ounces / 16 || 0;
  const total = weight + oz;
  const conversion = total / 2.2;
  const round = roundTo === undefined ? 2 : roundTo;
  return roundToDecimalPlace(conversion, round);
}
```

- 이렇게 코드가 점점 복잡해지는데 위의 코드는 새로운 매개변수를 추가할 때마다 기본값을 설정하기 위해 삼항 연산자나 단락 평가를 추가하게 된다.
- 그렇지만 매개변수 기본값을 사용하면 변수 검증을 위한 코드를 최소화할 수 있다.
- **매개변수 기본값을 사용하려면 매개변수명 옆에 등호로 기본값을 정의해준다.**

```javascript
function convertWeight(weight, ounces = 0, roundTo = 2) {
  const total = weight + oz;
  const conversion = total / 2.2;
  return roundToDecimalPlace(conversion, round);
}
```

- 하지만 매개변수 기본값이 완벽한 해결책은 아닌게 여전히 **매개변수 순서가 중요하기 때문이다.**
- 만약 중간의 매개변수 `ounces`가 필요하지 않는 경우에도 소수점 자릿수를 지정하려면 `ounces` 자리에 `0`을 입력해야 한다.

```javascript
convertWeight(4, 0, 2);
```
- 값을 전달하고 싶지 않은 경우, 매개변수에 `undefined`를 전달하면 함수가 매개변수 기본값을 사용한다.
- 하지만 `undefined`를 전달하게 되면 실수를 저지르기가 쉽기 때문인데 예를 들어 `null`을 전달하면 설정한 기본값이 사용되지 않는점이 있다.

```javascript
convertWeight(4, undefined, 2);
```

### 🎯 해체 할당으로 객체 속성에 접근하라.
- 다음은 객체는 사진에 대한 정보이다.

```javascript
const landscape = {
  title: 'Landscape',
  photographer: 'Seungmin',
  equipmemt: 'Cannon',
  format: 'digital',
  src: '/landscape-nm.jpg',
  location: [32.7122222, -103.1405556],
};
```
- 아래 코드는 간단한 동작에 불필요하게 수많은 객체 할당을 하고 있다.

```javascript
function displayPhoto(photo) {
  const title = photo.title;
  const photographer = photo.photographer || 'Anonymous';
  const location = photo.location;
  const url = photo.src;
  const copy = {...photo};

  delete copy.title;
  delete copy.photographer;
  delete copy.location;
  delete copy.src;
  
  const additional = Object.keys(copy).map(key => `${key}:${copy[key]}`);

  //...생략
}
```
- 하지만 자바스크립트에서는 **해체 할당이라는 과정을 통해 객체에 있는 정보를 곧바로 변수에 할당할 수 있다.**
- 해체 할당 작동 원리는 먼저 **객체에 있는 키와 같은 이름의 변수를 생성**하고, **객체에 있는 키에 연결된 값을 생성한 변수의 값으로 할당한다.**
- 아래 예제 코드는 `photographer`를 키로 갖는 객체가 있고, 이 객체를 이용해서 이름이 `photographer`인 변수를 생성한다.

```javascript
const landscape = {
  photographer: 'Seungmin',
};
const { photographer } = landscape;
photographer;
// Seungmin
```
- **값을 할당하는 변수의 이름은 객체에 있는 키와 반드시 일치해야 한다.**
- 중괄호의 의미는 **변수에 할당되는 값이 객체 있다는 것**을 나타낸다.
- 만약 객체에 키가 존재하지 않으면 값은 그저 `undefined`가 되지만, 해체 할당을 하면서 동시에 기본값을 설정할 수도 있다.

```javascript
const landscape = {};
const { photographer = 'Anonymous' title } = landscape;
photographer;
// Anonymous
title;
// undefined
```

- 만약 키 이름을 모르면?? 객체에 남아있는 정보를 가져올려면?? 그럴땐 **세개의 마침표와 변수 이름을 작성하면 이 새로운 변수에 어떠한 추가 정보라도 담을 수 있다.**
- **정보를 수집하기 위해** 마침표 세 개를 사용하는 경우에는 펼침 연산자(spread operator)라고 부르지 않고, 이때는 **나머지 매개변수(rest parameter)라고 부른다.**
- 여기선 변수이름을 키 이름과 일치할 필요없이 원하는 대로 지어도 된다.

```javascript
const landscape = {
  photographer: 'Seungmin',
  equipmemt: 'Cannon',
  format: 'digital',
};

const {
  photographer,
  ...additional
} = landscape;

additional;
// {equipmemt: "Cannon", format: "digital"}
```
- 위 예제처럼 객체에서 꺼낸 `photographer`를 제외한 나머지 키-값 쌍이 새로운 객체에 담긴다.
- 아래 예체처럼 변수 이름으로 원래의 키와 다른 이름으로 지정할 수도 있다.
- 이는 키 이름을 **이미 다른 변수에서 사용했거나 키 이름이 마음에 들지 않아서 좀 더 적절한 이름을 붙여야 할 때** 유용하다.

```javascript
const landscape = {
  src: '/landscape-nm.jpg',
};
const { src: url } = landscape;

src;
// Uncaught ReferenceError: src is not defined
url;
// "/landscape-nm.jpg"
```
- 마지막으로 **배열에도 해체 할당을 사용할 수 있는데, 한 가지 큰 예외가 있다.**
- 배열에는 **키가 없기 때문에 변수 이름을 마음대로 정할 수 있지만, 대신 배열에 담긴 순서대로 할당해야 한다는 점이다.**
- 해체 할당은 배열에 값이 쌍으로 담겨 있어서 담긴 값의 순서가 정보의 일부인 경우에도 매우 유용한 방법이다.

```javascript
const landscape = {
  location: [32.7122222, -103.1405556],
};
const { location } = landscape;
const [latitude, longitude] = location;

latitude; // 32.7122222
longitude; // -103.1405556
```
- 위의 해체 할당 과정을 한 번으로 아래와 같이 줄일 수 있다.

```javascript
const { location: [latitude, longitude] } = landscape;

latitude; // 32.7122222
longitude; // -103.1405556
```

- 처음의 예제를 해체 할당을 이용해서 아래와 같이 변경할 수 있다.

```javascript
function displayPhoto(photo) {
  const {
    title,
    photographer = 'Anonymous',
    location: [latitude, longitude],
    src: url,
    ...other
  } = photo;

  const additional = Object.keys(copy).map(key => `${key}:${other[key]}`);

  //...생략
}
```
- 해체 할당을 **매개변수에 사용하면 변수를 선언하지 않아도 마치 정보를 함수 몸체에서 할당한 것처럼 작동한다.**
- 참고로 해체 할당은 **`let`으로 변수를 할당하기 때문에 해당 변수를 재할당할 수도 있다.**

```javascript
function displayPhoto({
  title,
  photographer = 'Anonymous',
  location: [latitude, longitude],
  src: url,
  ...other
}) {
  const additional = Object.keys(copy).map(key => `${key}:${other[key]}`);

  //...생략
}
```
- 해체 할당을 사용하면 **변수 할당에 관한 문제를 해결**할 수 있을 뿐만 아니라, 매개변수로 객체를 전달하기 때문에 **키-값의 순서를 염려하지 않아도 된다.**
- 또한, 다른 **키-값 쌍을 꺼내야 하는 경우에도 해체 할당에 새로운 변수를 추가**하는 것만으로도 충분해진다. (명시적으로 `equipmemt`를 할당하려는 경우에도 변수 목록에 새 변수 이름을 추가할 뿐이다.)
- 다른 시점에서 함수를 호출하는 것도 걱정할 필요도 없어진다. (다른 객체에 `equipmemt`가 없는 경우에는 `undefined`로 처리)
- 해체 할당의 유일한 단점은 **키-값 쌍 또는 클래스의 인스턴스인 객체에서만 사용할 수 있다는 점이다.**
- 맵에서는 해체 할당을 사용할 수 없지만 해체 할당은 **함수 간에 정보를 전달하는 경우에 사용**되며, 이 경우 값을 순회하거나 재할당하지 않으므로 문제가 될 것은 없다.
- 즉, **데이터가 정적이므로 객체는 좋은 선택이다.**