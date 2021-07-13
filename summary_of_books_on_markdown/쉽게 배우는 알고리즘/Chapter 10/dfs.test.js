function solution(board) {
  const maze = [...board];

  let result = 0;
  const len = maze.length - 1;

  const dx = [-1, 0, 1, 0];
  const dy = [0, 1, 0, -1];

  function dfs(x, y) {
    if (x === len && y === len) {
      result += 1;
      return;
    }

    for (let i = 0; i < 4; i++) {
      const newX = x + dx[i];
      const newY = y + dy[i];

      if (newX <= len && newX >= 0 && newY <= len && newY >= 0 && maze[newX][newY] === 0) {
        maze[newX][newY] = 1;

        dfs(newX, newY);

        maze[newX][newY] = 0;
      }
    }
  }

  maze[0][0] = 1;
  dfs(0, 0);

  return result;
}

describe('solution', () => {
  const board = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 1, 0, 0, 0],
    [1, 1, 0, 1, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 1],
    [1, 1, 0, 1, 1, 0, 0],
    [1, 0, 0, 0, 0, 0, 0],
  ];

  it('미로를 탈출하는 경로의 가지수를 반환한다.', () => {
    expect(solution(board)).toBe(8);
  });
});
