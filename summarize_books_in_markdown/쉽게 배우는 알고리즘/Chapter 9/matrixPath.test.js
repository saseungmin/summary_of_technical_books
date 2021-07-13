// 단순 재귀 호출 행렬 경로
// function matrix(arr) {
//   function matrixPath(i, j) {
//     if (i === 0 && j === 0) {
//       return arr[i][j];
//     }

//     if (i === 0) {
//       return arr[i][j] + matrixPath(0, j - 1);
//     }

//     if (j === 0) {
//       return arr[i][j] + matrixPath(i - 1, 0);
//     }

//     return arr[i][j] + Math.max(matrixPath(i - 1, j), matrixPath(i, j - 1));
//   }

//   return matrixPath(arr.length - 1, arr[0].length - 1);
// }

// DP를 적용한 행렬 경로 문제
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

describe('matrix', () => {
  it('matrix', () => {
    expect(matrix([
      [6, 7, 12, 5],
      [5, 3, 11, 18],
      [7, 17, 3, 3],
      [8, 10, 14, 9],
    ])).toBe(68);
  });
});
