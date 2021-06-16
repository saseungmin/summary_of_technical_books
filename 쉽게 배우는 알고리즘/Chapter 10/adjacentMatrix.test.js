function adjacentMatrix(n, arr) {
  const graph = Array.from({ length: n + 1 }, () => Array(n + 1).fill(0));
  const dp = Array.from({ length: n + 1 }, () => false);

  let answer = 0;

  arr.forEach(([x, y]) => {
    graph[x][y] = 1; // 행렬 생성
  });

  function dfs(v) {
    if (v === n) {
      answer += 1;
      return;
    }

    for (let i = 1; i <= n; i++) {
      if (!dp[i] && graph[v][i] === 1) {
        dp[i] = true;

        dfs(i);

        dp[i] = false;
      }
    }
  }

  dp[1] = true;
  dfs(1);

  return answer;
}

describe('adjacentMatrix', () => {
  const arr = [
    [1, 2],
    [1, 3],
    [1, 4],
    [2, 1],
    [2, 3],
    [2, 5],
    [3, 4],
    [4, 2],
    [4, 5],
  ];

  it('1번 정점에서 N번 정점으로 가는 모든 경로의 가지 수를 반환한다.', () => {
    expect(adjacentMatrix(5, arr)).toBe(6);
  });
});
