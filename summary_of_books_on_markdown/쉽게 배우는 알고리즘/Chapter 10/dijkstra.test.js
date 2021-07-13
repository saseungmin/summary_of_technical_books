// 시작점에서부터 해당 정점까지의 거리가 제일 작은 정점의 인덱스를 dist 배열에서 뽑아내야 한다.
class PriorityQueue {
  constructor(dist) {
    this.queue = [];
    this.dist = dist;
  }

  enqueue(nodeIndex) {
    this.queue.push(nodeIndex);
  }

  dequeue() {
    let entry = 0;
    let entryIndex = this.queue[entry];

    this.queue.forEach((nodeIndex, index) => {
      if (this.dist[entryIndex] > this.dist[nodeIndex]) {
        entryIndex = nodeIndex;
        entry = index;
      }
    });

    return this.queue.splice(entry, 1);
  }
}

function dijkstra(board, n) {
  const graph = Array.from({ length: n }, () => []);

  board.forEach(([from, to, weight]) => {
    graph[from].push([to, weight]);
  });

  const dist = Array.from({ length: n }, () => Infinity);
  const visited = Array.from({ length: n }, () => false);
  const pq = new PriorityQueue(dist);

  pq.enqueue(0);
  dist[0] = 0;

  while (pq.queue.length) {
    const [v] = pq.dequeue();

    if (!visited[v]) {
      visited[v] = true;

      graph[v].forEach(([to, weight]) => {
        if (dist[v] + weight < dist[to]) {
          dist[to] = dist[v] + weight;
          pq.enqueue(to);
        }
      });
    }
  }

  return dist.reduce((acc, cur) => acc + cur, 0);
}

describe('dijkstra', () => {
  const graph = [
    [0, 1, 8],
    [0, 2, 11],
    [0, 3, 9],
    [1, 4, 10],
    [2, 6, 8],
    [2, 5, 8],
    [3, 1, 6],
    [3, 2, 3],
    [3, 4, 1],
    [4, 7, 2],
    [5, 6, 7],
    [6, 7, 5],
    [7, 5, 4],
  ];
  it('dijkstra', () => {
    expect(dijkstra(graph, 8)).toBe(85);
  });
});
