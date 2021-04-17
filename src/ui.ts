// Custom libraries
import { Chart } from './chart'
import { Line, RandomLine } from './line'
import { Presets } from './presets'
import * as util from './utils'

// Styles
import '../node_modules/figma-plugin-ds/dist/figma-plugin-ds.css'
import './ui.css'

var chart;
var line;
var pr = new Presets();

document.addEventListener("DOMContentLoaded", function (event) {

  var btn_refresh = document.getElementById('refresh');
  
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
    chart.line = new RandomLine(chart.line.points, chart.line.angle, chart.line.beta, chart.line.type);
    chart.drawLine(chart.line);
  }

  // Tabs
  document.querySelectorAll('.tab').forEach(elm => {
    elm.addEventListener('click', () => {
      util.setActiveStyle(elm, '.tab_bar')
      util.openTab(elm, elm.id.replace("tab_",""));
      if(elm.id === "tab_simple"){
        chart.drawLine(chart.line)
        btn_refresh.style.display = 'flex';
      } else if(elm.id === "tab_presets"){
        chart.drawLine(chart.preset_line)
        btn_refresh.style.display = 'none';
      }
    })
  });

  // Open first tab
  let tab = document.querySelector('.tab_bar').children[0] // first tab
  util.openTab(tab, tab.innerHTML);

  // Setting - Sliders
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

  // Slider fill
  document.querySelectorAll('.slider').forEach(elm => {
    elm.addEventListener('input', () => {
      util.sliderFill(<HTMLInputElement>elm)
    })
  });

  // Setting - Type
  document.querySelectorAll('input[name="type"]').forEach(elm => {
    elm.addEventListener('click', () => {
      if (elm.id == 'curved') {
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

  // Add button
  document.getElementById('create').onclick = () => {
    let parsedLine = util.parseSVG(chart.path)
    parent.postMessage({ pluginMessage: { type: 'create-line', parsedLine } }, '*')
  }

  // Presets
  document.querySelectorAll('input[name="preset_item"]').forEach(elm => {
    elm.addEventListener('click', () => {
      chart.preset_line = pr.preset_list.find(pr => pr.name === elm.id);
      chart.drawLine(chart.preset_line);
    })
  });

  line = new RandomLine(n, a, beta, type);
  chart = new Chart(line, '#linechart');
  chart.preset_line = pr.preset_list[0];

});



