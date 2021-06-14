// DP: 돌 놓기 문제
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

describe('placePebbles', () => {
  const pebbles = [
    [6, 7, 12, -5, 5, 3, 11, 3],
    [-8, 10, 14, 9, 7, 13, 8, 5],
    [11, 12, 7, 4, 8, -2, 9, 4],
  ];
  it('pebbles', () => {
    expect(placePebbles(pebbles)).toBe(106);
  });

  it('isPossible', () => {
    expect(isPossible(1, 2)).toBeTruthy();
    expect(isPossible(3, 4)).toBeFalsy();
  });
});
