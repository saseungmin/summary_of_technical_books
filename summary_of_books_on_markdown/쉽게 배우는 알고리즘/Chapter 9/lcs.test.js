// 최장 공통 부분 수열 JavaScript
// 백준 9251: https://www.acmicpc.net/problem/9251
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

describe('Longest Common Subsequence', () => {
  it('lcs', () => {
    expect(lcs('ACAYKP', 'CAPCAK')).toBe(4);
  });
});
