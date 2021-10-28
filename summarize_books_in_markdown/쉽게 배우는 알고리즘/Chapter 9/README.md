# 🌈 Chapter 9: 동적 프로그래밍

## 📚 어떤 문제를 동적 프로그래밍으로 푸는가

- 동적 프로그래밍은 큰 문제의 해답에 작은 문제의 해답이 포함되어 있고, 이를 재귀호출 알고리즘으로 구현하면 지나친 중복이 발생하는 경우에 이 재귀적 중복을 해결하는 방법을 뜻한다.
- 피보나치 수는 다음과 같이 정의한다.

```
f(n) = f(n - 1) + f(n - 2)
f(1) = f(2) = 1
```

- 즉, `n`의 피보니치 수는 `n - 1`의 피보니치 수와 `n - 2`의 피보나치 수를 포함하고 있다.
- 이처럼 큰 문제의 해답에 그보다 작은 문제의 해답이 포함되어 있으면 최적 부분 구조(Optimal Substructure)를 가졌다고 한다.
- 이런 최적 부분 구조를 가진 문제의 경우에는 재귀호출을 사용해 문제를 풀 수 있다.

```
fib(n)
{
  if (n = 1 or n = 2)
    then return 1;
    else return (fib(n - 1) + fib(n - 2));
}
```

- 이러한 재귀적 알고리즘은 간명하지만 때때로 엄청난 비효울을 초래할 수 있다. `n`의 피보나치 수를 구하는 앞의 재귀적 알고리즘은 지수 함수에 비례하는 시간이 든다.
- 예를 들어, `fib(7)`을 구하는 과정에서 `fib(5)`는 2번, `fib(4)`는 3번, `fib(3)`은 5번, `fib(2)`는 8번이나 호출된다. 문제의 크기가 커짐에 따라 중복 호출이 증가하는 정도를 보인다.
- 증가 속도는 Ω(2<sup>2/n</sup>), 즉 적어도 2<sup>2/n</sup> 이상의 비율로 증가해 지수 함수적이다.
- 해결하는 방법으론 어딘가에 결과를 저장해두고 나중에 필요하면 저장한 것을 사용하는 식으로 해결할 수 있다. (이런 식으로 부분 결과를 저장하면서 해를 구해나가는 것이 동적 프로그래밍의 핵심이다.) 이렇게 재귀적으로 구현했을 때 중복 호출로 심각한 비효율이 발생하는 경우가 동적 프로그래밍을 사용하기 적합한 두 번째 조건이다.

> 1. 최적 부분 구조를 이룬다.
> 2. 재귀적으로 구현했을 때 중복 호출로 심각한 비효율이 발생한다.

- 피보나치 수는 아래와 같이 아래에서 위로 구하면 선형 시간에 구해진다. 즉, 작은 것부터 배열에 저장해가면서 계산하는 방식이다.

```
fibonacci(n)
{
  f[1] <- f[2] <- 1;
  for i <- 3 to n
    f[i] <- f[i - 1] + f[i - 2];
  return f[n];
}
```

- `for` 루프가 한 번 돌 떄마다 앞에서 구해 저장해놓은 피보나치 수 두 개를 배열에서 가져다 더하기만 하면 된다. 이렇게 선형 시간에 해결할 수 있는 것을 재귀적으로 구현하니 지수 함수 시간이 든 것이다.
- 재귀적 구현에 다음과 같은 장치를 하여 비효율을 제거할 수도 있다.

```
// 배열 f[]의 모든 원소는 0으로 초기화
// f[i]값이 0이면 fib(i)가 아직도 한 번도 수행되지 않았음을 의미한다.

fib(n)
{
  if (f[n] != 0) then return f[n];
  else {
    if (n = 1 or n = 2)
      then f[n] <- 1;
      else f[n] <- fib(n - 1) + fib(n - 2);
    return f[n];
  }
}
```

#### 👉 JavaScript 피보나치 DP 예제

```js
// 재귀를 사용하지 않는 DP 피보나치
function fibonacci(n) {
  const dp = Array.from({ length: n + 1 }, () => 0);

  dp[1] = 1;
  dp[2] = 1;

  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }

  return dp[n];
}

// 재귀를 사용한 DP 피보나치
function fibonacci(n) {
  const dp = Array.from({ length: n + 1 }, () => 0);

  function fibo(value) {
    if (dp[value] !== 0) {
      return dp[value];
    }

    if (value === 1 || value === 2) {
      dp[value] = 1;
    } else {
      dp[value] = fibo(value - 1) + fibo(value - 2);
    }

    return dp[value];
  }

  return fibo(n);
}
```

## 📚 행렬 경로 문제
- 행렬의 왼쪽 위에서 시작해 한 칸씩 이동해 오른쪽 아래까지 도달한다. 이 과정에서 방문한 칸에 있는 수들을 더한 값이 이 경로의 합이다.
- 이동 규칙은 다음과 같다

> 1. 오른쪽이나 아래쪽으로만 이동할 수 있다.
> 2. 왼쪽 위쪽, 대각선 이동은 허용하지 않는다.

- 행렬 `(i, j)`의 최적해는 문제 `(i - 1, j)`의 최적해와 문제 `(i, j - 1)`의 최적해로 설명된다. 즉, 자신의 부분 문제에 대한 최적해를 자신의 최적해를 구성하는 데 사용한다. 최적 부분 구조를 가지고 있다.
- 원소 `(i, j)`의 바로 왼쪽 원소에 이르는 최고 점수와 원소 `(i, j)`의 바로 위쪽 원소에 이르는 최고 점수 중 큰 것에 원소 `(i, j)`의 값을 더한 것이 원소 `(i, j)`에 이르는 최고 점수다.
- 다음은 재귀호출로 구현한 것이다.

```
matrixPath(i, j)
// (i, j)에 이르는 최고 점수
{
  if (i = 0 or j = 0) then return 0;
  else return (m(i, j) + (max(matrixPath(i - 1, j), matrixPath(i, j - 1))));
}
```

- 위와 같은 구현은 행렬 경로 문제의 최적 부분 구조와 재귀적 구현에서 중복 호출을 확인할 수 있다. 동적 프로그래밍의 좋은 대상이 된다.
- 아래의 알고리즘의 수행시간은 `for`루프가 지배하고, 배열의 두 원소 중 큰 것을 고르는 작업과 덧셈이므로 상수 시간이 든다. 그러므로 알고리즘의 총 수행 시간은 ɵ(n<sup>2</sup>) 이다.

```
matrixPath(n)
// (n, n)에 이르는 최고 점수
{
  for i <- 0 to n
    c[i, 0] <- 0;
  for j <- 1 to n
    c[0, j] <- 0;
  for i <- 1 to n
    for j <- 1 to n
      c[i, j] <- m(i, j) + max(c[i - 1, j], c[i, j - 1]);
  return c[n, n];
}
```

#### 👉 JavaScript 행렬 경로 DP 예제

```js
function matrix(arr) {
  const { length } = arr;
  const dp = Array.from({ length: length + 1 }, () => Array(length + 1).fill(0));

  for (let i = 1; i <= length; i++) {
    for (let j = 1; j <= length; j++) {
      dp[i][j] = arr[i - 1][j - 1] + Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  return dp[length][length];
}
```

## 📚 돌 놓기 문제
- `3 x n` 테이블의 각 칸에 숫자가 쓰여 있다. 테이블의 각 칸 중 일부에 제한조건을 만족하는 방법으로 돌을 놓아 돌이 놓인 곳에 있는 수의 합을 최대로 하는 문제다.
- 돌을 놓는 제한조건은 다음과 같다.

> 1. 가로나 세로로 인접한 두 칸에 동시에 돌이 놓일 수 없다.
> 2. 각 열에는 적어도 하나 이상의 돌을 놓는다.

- 다음은 최적 부분 구조를 가진 문제를 재귀적으로 구현한 것이다.

```
pebble(i, p)
// i열이 패턴 p로 놓일 때 최고 점수
// w[i, p]: i열 패턴 p로 놓일 때 i열에 돌이 놓인 곳의 점수 합, p 패턴 [1, 2, 3, 4]
{
  if (i = 1)
    then return w[1, p];
    else {
      max <- - ∞;
      for q <- 1 to 4
        if (패턴 q와 패턴 p와 양립) then {
          tmp <- pebble(i - 1, q);
          if (tmp > max) then max <- tmp;
        }
      return (max + w[i, p]);
    }
}
```

- 위 문제 역시 중복 호출이 일어나며, 문제가 커지면 지수 함수적으로 중복 호출이 일어난다.
- pebble(5)인 경우에 부분 문제의 총수는 20개이고 총 호출 횟수는 152번이나 일어나게 된다.
- 다음은 동적 프로그래밍을 사용한 문제 해결이다.

```
pebble(n)
// n열까지 돌을 놓을 때 최고 점수
{
  for p <- 1 to 4
    peb[1, p] <- w[1, p];
  for i <- 2 to n
    for p <- 1 to 4
      peb[i, p] <- max{peb[i - 1, q]} + w[i, p];
  return max{peb[n, p]}; // p = 1, 2, 3, 4
}
```

- 부분 문제들의 답을 `n x 4` 배열 `peb[][]`에 저장한다. 이 알고리즘의 수행 시간은 `for`루프가 지배한다. 바깥쪽 `for` 루프는 `n - 1`번 반복되고, 각 반복마다 안쪽의 `for`루프는 단지 4번만 반복되므로 중첩된 `for` 루프는 총 `4(n - 1)`번 반복된다. 반복할 때마다 `peb[i, p]`를 구하기 위해 최대 3개의 양립되는 패턴을 살펴볼 뿐이다. 그러므로 상수 시간이 소요되고 수행 시간은 ɵ(n) 이다.

#### 👉 JavaScript 돌 놓기 DP 예제

```js
const setScore = {
  1: (arr, c) => arr[0][c],
  2: (arr, c) => arr[1][c],
  3: (arr, c) => arr[2][c],
  4: (arr, c) => arr[0][c] + arr[2][c],
};

const isPossible = (p1, p2) => {
  if (p1 === p2) {
    return false;
  }

  const patterns = [[1, 4], [3, 4], [4, 1], [4, 3]];

  const isMatch = patterns.some(([x, y]) => p1 === x && p2 === y);

  if (isMatch) {
    return false;
  }

  return true;
};

function placePebbles(pebbles) {
  const dp = Array.from({ length: 5 }, () => Array(pebbles[0].length).fill(0));

  const sumPebbles = (c, previous) => {
    if (c >= pebbles[0].length) {
      return 0;
    }

    if (dp[previous][c] !== 0) {
      return dp[previous][c];
    }

    let max = Number.MIN_SAFE_INTEGER;

    for (let p = 1; p <= 4; p++) {
      if (c === 0 || isPossible(previous, p)) {
        const score = setScore[p](pebbles, c) + sumPebbles(c + 1, p);

        if (score > max) {
          max = score;
        }
      }
    }

    dp[previous][c] = max;

    return dp[previous][c];
  };

  return sumPebbles(0, 1);
}
```

## 📚 최장 공통 부분 순서 (LCS)

- 문자열 `bcdb`는 문자열 `abcdbad`의 부분 순서이다.
- 문자열 `abcbdab`와 `bdcaba`에 대하여 문자열 `bca`는 두 문자열에 공통적으로 나타나는 부분 순서(공통 부분 순서)다. `bcba`는 두 문자열에 존재하는 가장 긴 공통 부분 순서, 즉 최장 공통 부분 순서다.
- 최장 공통 부분 순서를 영어로 Longest Common Subsequence, 줄여서 LCS라고 부른다.
- LCS 문제에 존재하는 최적 부분 구조를 살펴본다.

> - x<sub>m</sub> = y<sub>n</sub> 이면 X<sub>m</sub> 과 Y<sub>n</sub>의 LCS의 길이는 X<sub>m - 1</sub>과 Y<sub>n - 1</sub>의 LCS 길이보다 1이 크다. 즉, (m, n) 크기 문제의 해가 (m - 1, n - 1) 문제의 해가 포함한다.
> - x<sub>m</sub> != y<sub>n</sub> 이면 X<sub>m</sub> 과 Y<sub>n</sub>의 LCS의 길이는 X<sub>m</sub> 과 Y<sub>n - 1</sub>의 LCS의 길이와 X<sub>m - 1</sub>과 Y<sub>n</sub>의 LCS 길이 중 큰 것과 같다. 즉, (m, n) 크기 문제의 해가 (m, n - 1) 크기 문제의 해와 (m - 1, n) 크기 문제의 해를 포함한다.

- 다음은 정리한 내용이다.

> X<sub>m</sub> = (x<sub>1</sub>x<sub>2</sub> ... x<sub>m</sub>) 과 Y<sub>n</sub> = (y<sub>1</sub>y<sub>2</sub> ... y<sub>n</sub>)의 최장 공통 부분 순서를 LCS의 길이가 k라 하자. LCS는 하나 이상 있을 수 있는데 이 중 하나를 Z<sub>k</sub> = (z<sub>1</sub>z<sub>2</sub> ... z<sub>k</sub>)라 하자.
> 1. x<sub>m</sub> = y<sub>n</sub>이면, z<sub>k</sub> = x<sub>m</sub> = y<sub>n</sub>이고 Z<sub>k - 1</sub>은 X<sub>m - 1</sub>과 Y<sub>n - 1</sub>의 LCS이다.
> 2. x<sub>m</sub> != y<sub>n</sub>이면, z<sub>k</sub> != x<sub>m</sub> 이면, Z<sub>k</sub>는 X<sub>m - 1</sub>과 Y<sub>n</sub>의 LCS이다.
> 3. x<sub>m</sub> != y<sub>n</sub>이면, z<sub>k</sub> != y<sub>n</sub> 이면, Z<sub>k</sub>는 X<sub>m</sub>과 Y<sub>n - 1</sub>의 LCS이다.

- 다음은 최장 공통 부분 순서 길이 재귀호출로 구현한 알고리즘이다.

```
LCS(m, n) // 두 문자열 Xm 과 Yn의 LCS의 길이를 구한다.
{
  if (m = 0 or n = 0) then return 0;
  else if (xm = yn) then return LCS(m - 1, n - 1) + 1;
  else return max(LCS(m - 1, n), LCS(m, n - 1));
}
```

- 이 경우에도 엄청난 중복 호출이 일어난다.
- 작은 문제들의 해를 아래부터 저장하면서 구하면 다음과 같은 동적 프로그래밍 알고리즘을 얻는다.

```
LCS(m, n) // 두 문자열 Xm 과 Yn의 LCS의 길이를 구한다.
{
  for i <- 0 to m
    C[i, 0] <- 0;
  for j <- 0 to n;
    C[0, j] <- 0;
  for i <- 1 to m
    for j <- 1 to n
      if (xi = yj) then C[i, j] <- C[i - 1, j - 1] + 1;
                   else C[i, j] <- max{C[i - 1, j], C[i, j - 1]};
  return C[m, n];
}
```

- 이차원 배열 `C[][]`에 각 부분 문제의 답을 저장하면서 풀어나가는 방식으로 배열의 총 원소는 `(m + 1)(n + 1)`개이고, `for` 루프가 총 `mn`번을 반곱하면서 원소를 하나씩 계산한다. 각 원소를 계산하는 데는 상수 시간이 든다. 따라서 총 수행 시간은 ɵ(mn)이다.

#### 👉 JavaScript를 사용한 예제

```js
function lcs(str1, str2) {
  const dp = Array.from({ length: 2000 }, () => []);
  const len1 = str1.length;
  const len2 = str2.length;

  for (let i = 0; i <= len1; i++) {
    dp[i][0] = 0;
  }

  for (let j = 0; j <= len2; j++) {
    dp[0][j] = 0;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp[len1][len2];
}
```