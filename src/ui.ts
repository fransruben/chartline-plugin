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
  

  let slider = <HTMLInputElement>document.getElementById('nr_points')
  let field = <HTMLInputElement>document.getElementById('count')

  slider.addEventListener('input', () => {
    chart.updateData(parseInt(slider.value));
  });

  chart = new LineChart(parseInt(slider.value));
});

document.getElementById('create').onclick = () => {
  let parsedLine = parseSVG(chart.line)
  parent.postMessage({ pluginMessage: { type: 'create-line', parsedLine } }, '*')
}

