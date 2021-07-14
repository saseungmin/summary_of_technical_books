/* eslint-disable func-names */
/* eslint-disable no-plusplus */
const rj3 = {};

rj3.svg = {};

rj3.svg.line = function () {
  let getX = function (point) {
    return point[0];
  };

  let getY = function (point) {
    return point[1];
  };

  const interpolate = function (points) {
    return points.join('L');
  };

  function line(data) {
    const segments = [];
    const points = [];
    let i = -1;
    const n = data.length;
    let d;

    function segment() {
      segments.push('M', interpolate(points));
    }

    while (++i < n) {
      d = data[i];
      points.push([+getX.call(this, d, i), +getY.call(this, d, i)]);
    }

    if (points.length) {
      segment();
    }

    return segments.length ? segments.join('') : null;
  }

  line.x = function (funcToGetX) {
    if (!arguments.length) {
      return getX;
    }

    getX = funcToGetX;
    return line;
  };

  line.y = function (funcToGetY) {
    if (!arguments.length) {
      return getY;
    }

    getY = funcToGetY;
    return line;
  };

  return line;
};

export default rj3;
