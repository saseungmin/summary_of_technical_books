function floydWarshall(n, edges) {
  const adjMatrix = Array.from({ length: n + 1 }, () => Array(n + 1).fill(Infinity));

  edges.forEach(([from, to, weight]) => {
    adjMatrix[from][to] = weight;
  });

  for (let k = 1; k < n + 1; k++) {
    for (let i = 1; i < n + 1; i++) {
      for (let j = 1; j < n + 1; j++) {
        // 정점 i -> j로 갈 때 기존 거리값과 k를 거쳐갈 때의 거리 값 중 작은 값을 저장
        adjMatrix[i][j] = Math.min(adjMatrix[i][j], adjMatrix[i][k] + adjMatrix[k][j]);
      }
    }
  }

  // Infinity 배열 삭제
  return adjMatrix.reduce((arr, x) => {
    const filterM = x.filter((y) => y !== Infinity);

    if (!filterM.length) {
      return arr;
    }

    return [
      ...arr,
      x.filter((y) => y !== Infinity),
    ];
  }, []);
}

describe('floydWarshall', () => {
  const edges = [
    [1, 2, 4],
    [1, 3, 1],
    [2, 3, 2],
    [2, 4, 1],
    [3, 2, 1],
    [4, 1, 5],
    [4, 3, 5],
  ];

  it('floydWarshall ', () => {
    expect(floydWarshall(4, edges)).toEqual([
      [8, 2, 1, 3],
      [6, 3, 2, 1],
      [7, 1, 3, 2],
      [5, 6, 5, 7],
    ]);
  });
});
