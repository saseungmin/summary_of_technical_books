// 1. 기본적인 재귀 피보나치
// function fibonacci(n) {
//   if (n === 1 || n === 2) {
//     return 1;
//   }

//   return fibonacci(n - 1) + fibonacci(n - 2);
// }

// 재귀를 사용하지 않는 DP 피보나치
// function fibonacci(n) {
//   const dp = Array.from({ length: n + 1 }, () => 0);

//   dp[1] = 1;
//   dp[2] = 1;

//   for (let i = 3; i <= n; i++) {
//     dp[i] = dp[i - 1] + dp[i - 2];
//   }

//   return dp[n];
// }

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

describe('fibonacci', () => {
  it('fibonacci', () => {
    expect(fibonacci(10)).toBe(55);
  });
});
