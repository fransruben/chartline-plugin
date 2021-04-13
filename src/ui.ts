// Custom libraries
import { LineChart } from './chart'
import { Line } from './line'
import * as presets from './presets'
import * as util from './utils'

// Styles
import '../node_modules/figma-plugin-ds/dist/figma-plugin-ds.css'
import './ui.css'

var chart;
var line;

document.addEventListener("DOMContentLoaded", function (event) {

  var slider_points = <HTMLInputElement>document.getElementById('nr_points');
  var slider_angle = <HTMLInputElement>document.getElementById('angle');
  var slider_smooth = <HTMLInputElement>document.getElementById('smooth');
  var type_switch = <HTMLInputElement>document.getElementById('type');

  var n = parseInt(slider_points.value)
  var a = parseFloat(slider_angle.value)
  var beta = 1 - parseFloat(slider_smooth.value)
  var type = true;

  // Chart
  document.getElementById('refresh').onclick = () => {
    chart.line = new Line(chart.line.points, chart.line.angle, chart.line.beta, chart.line.type);
    chart.drawLine();
  }

  // Tabs
  document.querySelectorAll('.tab').forEach(elm => {
    elm.addEventListener('click', () => {
      util.setActiveStyle(elm, '.tab_bar')
      util.openTab(elm, elm.innerHTML);
    })
  });

  // Open first tab
  let tab = document.querySelector('.tab_bar').children[0] // first tab
  util.openTab(tab, tab.innerHTML);


  slider_points.addEventListener('input', () => {
    let n = parseInt(slider_points.value);
    chart.updatePoints(n);
  });

  slider_angle.addEventListener('input', () => {
    let a = parseFloat(slider_angle.value);
    chart.updateAngle(parseFloat(slider_angle.value));
  });

  slider_smooth.addEventListener('input', () => {
    let beta = 1 - parseFloat(slider_smooth.value);
    chart.updateSmooth(beta);
  });

  // Radio button group
  document.querySelectorAll('input[type="radio"]').forEach(elm => {
    elm.addEventListener('click', () => {
      if(elm.id == 'curved'){
        chart.updateType(true);
        slider_smooth.disabled = false;
      } else {
        chart.updateType(false);
        slider_smooth.disabled = true;
        slider_smooth.classList.add("disabled");
        slider_smooth.value = "0.5";
        util.sliderFill(slider_smooth);
      };
    })
  });

  // Buttons
  document.getElementById('create').onclick = () => {
    let parsedLine = util.parseSVG(chart.path)
    parent.postMessage({ pluginMessage: { type: 'create-line', parsedLine } }, '*')
  }

  // Slider fill
  document.querySelectorAll('.slider').forEach(elm => {
    elm.addEventListener('input', () => {
      util.sliderFill(<HTMLInputElement>elm)
    })
  });

  line = new Line(n, a, beta, type);
  chart = new LineChart(line, '#linechart');

});



