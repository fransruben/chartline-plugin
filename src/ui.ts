// Custom libraries
import { LineChart } from './chart'

// Styles
import '../node_modules/figma-plugin-ds/dist/figma-plugin-ds.css'
import './ui.css'

var chart;

function parseSVG(raw_svg) {
  // parse SVG path format to Figma readable format
  let parsedSVG = raw_svg.replace(/,/g, ' ')
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

function updateTypeUI(elm) {
  let smooth_slider = <HTMLInputElement>document.getElementById('smooth');

  if (elm.id == 'straight') {
    smooth_slider.disabled = true;
    smooth_slider.value = '0.5';
    sliderFill(smooth_slider);
  } else {
    smooth_slider.disabled = false;
  }

  setActiveStyle(elm, '.btn-group');
}

function openTab(elm, tabname: string = 'simple'){
  let tab = tabname.toLocaleLowerCase();

  // Hide all pages
  let pages = document.querySelectorAll('.page') as NodeListOf<HTMLElement>
  pages.forEach(page => {
    page.style.display = 'none';
  })
 
  // Remove all active classes
  document.querySelectorAll('.tab').forEach(elm => {
    elm.className = elm.className.replace(" active", "");
  });

  // Show active page and tab
  document.getElementById(tab).style.display = 'inline-block';
    elm.className += ' active';
}


function setActiveStyle(active_elm: Element, parent_id:string){
  // Get all children
  var items = document.querySelectorAll(parent_id)[0].children;

  // Remove active class from all children
  for (let i = 0; i < items.length; i++){
    items[i].className = items[i].className.replace(" active", "");
  };

  // Set active class
  active_elm.className += " active";
}


document.addEventListener("DOMContentLoaded", function (event) {
  
  // Tabs
  document.querySelectorAll('.tab').forEach(elm => {
    elm.addEventListener('click', () => {
      setActiveStyle(elm, '.tab_bar')
    })
  });

  // // Open default tab
  // let tab = document.querySelector('.tab_bar').children[0] // first tab
  // openTab(tab, tab.innerHTML);

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
      updateTypeUI(elm);
    })
  });

  // Buttons
  document.getElementById('create').onclick = () => {
    let parsedLine = parseSVG(chart.line)
    parent.postMessage({ pluginMessage: { type: 'create-line', parsedLine } }, '*')
  }

  document.getElementById('btn-refresh').onclick = () => {
    chart.refresh(n, a, beta);
  }

  // Slider fill
  document.querySelectorAll('.slider').forEach(elm => {
    elm.addEventListener('input', () => {
      sliderFill(elm)
    })
  });

  // Create chart
  chart = new LineChart(n, a, beta);

});



