function bellmanFord(graph, n) {
  let answer = true;

  const distance = Array.from({ length: n }, () => Infinity);
  const predecessor = Array.from({ length: n }, () => null);

  distance[0] = 0;

  for (let i = 0; i < n - 1; i++) {
    graph.forEach(([from, to, weight]) => {
      if (distance[from] + weight < distance[to]) {
        distance[to] = distance[from] + weight;
        predecessor[to] = from;
      }
    });
  }

  graph.forEach(([from, to, weight]) => {
    if (distance[from] + weight < distance[to]) {
      answer = false;
    }
  });

  return answer ? [distance, predecessor] : answer;
}

describe('bellmanFord', () => {
  context('음의 사이클이 존재하지 않는 경우', () => {
    const graph = [
      [0, 1, 8],
      [0, 2, 9],
      [0, 3, 11],
      [1, 4, 10],
      [2, 1, -15],
      [2, 4, 1],
      [2, 3, 3],
      [3, 5, 8],
      [3, 6, 8],
      [4, 7, 2],
      [5, 2, 12],
      [5, 7, 5],
      [6, 5, -7],
      [7, 6, 4],
    ];

    it('정점들의 가중치와 간선의 정보를 반환한다.', () => {
      // const graph = [
      //   [0, 1, -1],
      //   [0, 2, 4],
      //   [1, 2, 3],
      //   [1, 3, 2],
      //   [1, 4, 2],
      //   [3, 1, 1],
      //   [3, 2, 5],
      //   [4, 3, -3],
      // ];

      expect(bellmanFord(graph, 8)).toEqual(
        [[0, -6, 9, 11, 4, 3, 10, 6], [null, 2, 0, 0, 1, 6, 7, 4]],
      );
    });
  });

  context('음의 사이클이 존재하는 경우', () => {
    const graph = [
      [0, 1, 8],
      [0, 2, 9],
      [0, 3, 11],
      [1, 4, 10],
      [2, 1, -15],
      [2, 4, 1],
      [2, 3, 3],
      [3, 5, 8],
      [3, 6, 8],
      [4, 7, 2],
      [5, 2, -12], // 음의 사이클: -12
      [5, 7, 5],
      [6, 5, -7],
      [7, 6, 4],
    ];
    it('음의 사이클이 존재하는 경우', () => {
      // const graph = [
      //   [0, 1, -1],
      //   [0, 2, 4],
      //   [1, 2, 3],
      //   [1, 3, 2],
      //   [1, 4, 2],
      //   [2, 0, -5],
      //   [3, 1, 1],
      //   [3, 2, 5],
      //   [4, 3, -3],
      // ];

      expect(bellmanFord(graph, 8)).toBeFalsy();
    });
  });
});
