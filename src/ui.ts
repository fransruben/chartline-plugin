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

function sliderFill(elem) {
  let val = parseFloat(elem.value)
  let max = parseFloat(elem.max)
  let min = parseFloat(elem.min)
  let perc = ((val - min) / (max - min)) * 100;

  // Calculate linear gradient stops based on the slider position
  if (perc > 50) { 
    var st1 = ', #75757566 0%';
    var st2 = ', #75757566 50%';
    var st3 = ', #050505 50%';
    var st4 = ', #050505 ' + perc + '%';
    var st5 = ', #75757566 ' + perc + '%';
    var st6 = ', #75757566 100%';
   } else {
    var st1 = ', #75757566 0%';
    var st2 = ', #75757566 ' + perc + '%';
    var st3 = ', #050505 ' + perc + '%';
    var st4 = ', #050505 50%';
    var st5 = ', #75757566 50%';
    var st6 = ', #75757566 100%';
   };

  elem.style.background = 'linear-gradient(to right' + st1 + st2 + st3 + st4 + st5 + st6 + ')';
}

var chart;

document.addEventListener("DOMContentLoaded", function (event) {

  let points_slider = <HTMLInputElement>document.getElementById('nr_points');
  let angle_slider = <HTMLInputElement>document.getElementById('angle');
  let smooth_slider = <HTMLInputElement>document.getElementById('smooth');

  var n = parseInt(points_slider.value)
  var a = parseFloat(angle_slider.value)
  var beta = 1 - parseFloat(smooth_slider.value)

  points_slider.addEventListener('input', () => {
    n = parseInt(points_slider.value);
    chart.updatePoints(n);
    sliderFill(points_slider)
  });

  angle_slider.addEventListener('input', () => {
    a = parseFloat(angle_slider.value);
    chart.updateAngle(parseFloat(angle_slider.value));
  });

  smooth_slider.addEventListener('input', () => {
    beta = 1 - parseFloat(smooth_slider.value);
    chart.updateSmooth(beta);
  });

  chart = new LineChart(n, a, beta);

  document.getElementById('create').onclick = () => {
    let parsedLine = parseSVG(chart.line)
    parent.postMessage({ pluginMessage: { type: 'create-line', parsedLine } }, '*')
  }

  document.getElementById('refresh').onclick = () => {
    chart.refresh(n, a, beta);
  }
});



