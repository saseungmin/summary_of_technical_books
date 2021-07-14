/* eslint-disable func-names */
/* eslint-disable no-restricted-properties */
import rj3 from './rj.js';

rj3.svg.samples = {};

rj3.svg.samples.functionBasedLine = function functionBasedLine() {
  const firstXCoord = 10;
  const xDistanceBetweenPoints = 50;
  const svgHeight = 200;

  const lineGenerator = rj3.svg.line()
    .x((d, i) => firstXCoord + i * xDistanceBetweenPoints)
    .y(function (d) {
      return svgHeight - this.getValue(d);
    });

  return lineGenerator;
};

function pathFromFunction() {
  const yearlyPriceGrapher = {
    lineGenerator: rj3.svg.samples.functionBasedLine(),
    getValue: function getValue(year) {
      return 10 * Math.pow(1.8, year);
    },
  };

  const years = [2010, 2011, 2012, 2013, 2014, 2015];
  const path = yearlyPriceGrapher.lineGenerator(years);

  document.getElementById('pathFromFunction').setAttribute('d', path);
}

export default pathFromFunction;
