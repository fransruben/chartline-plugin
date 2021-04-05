// Custom libraries
import { LineChart } from './chart'

// Styles
import '../node_modules/figma-plugin-ds/dist/figma-plugin-ds.css'
import './ui.css'


function parseSVG(rsvg) {
// parse SVG path format to what figma supports
  let parsedSVG = rsvg.replace(/,/g, ' ')
    .replace(/L/g, ' L ')
    .replace(/M/g, ' M ')
    .replace(/C/g, ' C ')
    .trim() 
  return parsedSVG;
}

var chart;

document.addEventListener("DOMContentLoaded", function (event) {

  let points_slider = <HTMLInputElement>document.getElementById('nr_points');
  let angle_slider = <HTMLInputElement>document.getElementById('angle');
  let noise_slider = <HTMLInputElement>document.getElementById('noise');

  var n = parseInt(points_slider.value)
  var a = parseInt(angle_slider.value)
  var delta = parseInt(noise_slider.value)

  points_slider.addEventListener('input', () => {
    chart.updatePoints(parseInt(points_slider.value));
  });

  angle_slider.addEventListener('input', () => {
    chart.updateAngle(parseInt(angle_slider.value));
  });

  chart = new LineChart(n, a, delta);
});

document.getElementById('create').onclick = () => {
  let parsedLine = parseSVG(chart.line)
  parent.postMessage({ pluginMessage: { type: 'create-line', parsedLine } }, '*')
}

