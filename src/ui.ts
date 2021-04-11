// Custom libraries
import { LineChart } from './chart'
import * as presets from './presets'
import * as util from './utils'

// Styles
import '../node_modules/figma-plugin-ds/dist/figma-plugin-ds.css'
import './ui.css'

var chart;

document.addEventListener("DOMContentLoaded", function (event) {

  console.log(presets.sinus(50));

  // Tabs
  document.querySelectorAll('.tab').forEach(elm => {
    elm.addEventListener('click', () => {
      util.setActiveStyle(elm, '.tab_bar')
      util.openTab(elm, elm.innerHTML);
    })
  });

  // Open default tab
  let tab = document.querySelector('.tab_bar').children[0] // first tab
  util.openTab(tab, tab.innerHTML);

  // Sliders
  let points_slider = <HTMLInputElement>document.getElementById('nr_points');
  let angle_slider = <HTMLInputElement>document.getElementById('angle');
  let smooth_slider = <HTMLInputElement>document.getElementById('smooth');

  var n = parseInt(points_slider.value)
  var a = parseFloat(angle_slider.value)
  var beta = 1 - parseFloat(smooth_slider.value)

  points_slider.addEventListener('input', () => {
    n = parseInt(points_slider.value);
    chart.updatePoints(n);
  });

  angle_slider.addEventListener('input', () => {
    a = parseFloat(angle_slider.value);
    chart.updateAngle(parseFloat(angle_slider.value));
  });

  smooth_slider.addEventListener('input', () => {
    beta = 1 - parseFloat(smooth_slider.value);
    chart.updateSmooth(beta);
  });

  // Button group
  document.querySelectorAll('.btn-item').forEach(elm => {
    elm.addEventListener('click', () => {
      chart.updateType(elm.id);
      util.updateTypeUI(elm);
      util.setActiveStyle(elm, '.btn-group')
    })
  });

  // Buttons
  document.getElementById('create').onclick = () => {
    let parsedLine = util.parseSVG(chart.line)
    parent.postMessage({ pluginMessage: { type: 'create-line', parsedLine } }, '*')
  }

  document.getElementById('btn-refresh').onclick = () => {
    chart.refresh(n, a, beta);
  }

  // Slider fill
  document.querySelectorAll('.slider').forEach(elm => {
    elm.addEventListener('input', () => {
      util.sliderFill(<HTMLInputElement>elm)
    })
  });

  // Create chart
  chart = new LineChart(n, a, beta);

});



