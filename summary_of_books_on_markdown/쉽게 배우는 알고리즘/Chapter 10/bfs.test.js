/* eslint-disable no-restricted-syntax */
function solution(s, e) {
  const dis = Array.from({ length: 10001 }, () => 0);
  const check = Array.from({ length: 10001 }, () => false);

  const queue = [];

  queue.push(s);
  check[s] = true;

  while (queue.length) {
    const v = queue.shift();

    for (const nv of [v + 1, v - 1, v + 5]) {
      if (nv === e) {
        return dis[v] + 1;
      }

      if (nv > 0 && nv <= 10000 && !check[nv]) {
        check[nv] = true;
        queue.push(nv);
        dis[nv] = dis[v] + 1;
      }
    }
  }

  return 0;
}

describe('solution', () => {
  it('점프의 최소횟수를 반환한다.', () => {
    expect(solution(5, 14)).toBe(3);
    expect(solution(8, 3)).toBe(5);
  });
});
