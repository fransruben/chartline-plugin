import './ui.css'
import '../node_modules/figma-plugin-ds/dist/figma-plugin-ds.css'
import * as d3 from 'd3'


const chart_width = 350;
const chart_height = 300;
var line = ""

function updateData() {
  // var svg = d3.select("#linechart").transition();
  // svg.select('.line')
  //     .duration(750)
  //     .attr('d', line2)
}


document.addEventListener("DOMContentLoaded", function (event) {

  // Use the margin convention practice 
  var margin = { top: 36, right: 36, bottom: 36, left: 36 }
    , width = chart_width - margin.left - margin.right
    , height = chart_height - margin.top - margin.bottom;

  // sample data
  var data = d3.range(10).map(function (d) { return { "y": d3.randomUniform(10)() } });


  // 5. X scale will use the index of our data
  var xScale = d3.scaleLinear()
    .domain([0, data.length]) // input
    .range([0, width]); // output

  // 6. Y scale will use the randomly generate number 
  var yScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.y)) // input 
    .range([height, 0]); // output 

  // 7. d3's line generator
  var lineGenerator = d3.line<any>()
    .x((d, i) => xScale(i))
    .y(d => yScale(d.y))
    .curve(d3.curveMonotoneX);

  line = lineGenerator(data);

  // 1. Add the SVG to the page and employ #2
  var svg = d3.select("#linechart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // 3. Call the x axis in a group tag
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

  // 4. Call the y axis in a group tag
  svg.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

  // 9. Append the path, bind the data, and call the line generator 
  svg.append("path")
    // .datum(dataset) // 10. Binds data to the line 
    .attr("class", "line") // Assign a class for styling 
    .attr("d", line); // 11. Calls the line generator 

});

document.getElementById('create').onclick = () => {
  let parsedLine = line.replace(/,/g, ' ')
                        .replace(/L/g, ' L ')
                        .replace(/M/g, ' M ')
                        .replace(/C/g, ' C ')
                        .trim() // parse SVG path format to what figma supports
  debugger;
  parent.postMessage({ pluginMessage: { type: 'create-line', parsedLine} }, '*')
}

document.getElementById('reset').onclick = () => {
  // reset chart
}