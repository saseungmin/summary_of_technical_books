const toEndTimeAsc = (a, b) => {
  if (a[1] === b[1]) {
    return a[0] - b[0];
  }

  return a[1] - b[1];
};

function meetingRoomAssignment(meeting) {
  const sortedMeeting = [...meeting].sort(toEndTimeAsc);
  let result = 0;
  let end = 0;

  sortedMeeting.forEach(([start, finish]) => {
    if (end <= start) {
      end = finish;
      result += 1;
    }
  });

  return result;
}

describe('meetingRoomAssignment', () => {
  it('최대 사용할 수 있는 회의 수를 반환한다.', () => {
    expect(meetingRoomAssignment([[1, 4], [2, 3], [3, 5], [4, 6], [5, 7]])).toBe(3);
    expect(meetingRoomAssignment([[3, 3], [1, 3], [2, 3]])).toBe(2);
  });
});
