import * as d3 from 'd3'
import { genericLine } from './line'
export class LineChart {

    // Chart area
    private chart_width = 350;
    private chart_height = 200;
    private chart_margin = 36;
    private showAxes = false;

    // Data
    public line: genericLine; // Line object
    public id; //id of chart element

    // Draw chart
    public svg;
    public width;
    public height;
    public margin;
    public xScale;
    public yScale;
    public path;

    constructor(line: genericLine, id: string) {
        this.line = line;
        this.id = id;
        this.initializeChart(line);
        this.drawChart();
    }

    private initializeChart(line: genericLine): void {
        // Use the margin convention practice 
        this.margin = { top: this.chart_margin, right: this.chart_margin, bottom: this.chart_margin, left: this.chart_margin };
        this.width = this.chart_width - this.margin.left - this.margin.right
        this.height = this.chart_height - this.margin.top - this.margin.bottom;

        // Select part of line to plot
        let line_plot = line.data.slice(0, line.points + 1);

        // X scale will use the index of our data
        this.xScale = d3.scaleLinear()
            .domain([0, line_plot.length])
            .range([0, this.width]);

        // Y scale will auto-scale 
        this.yScale = d3.scaleLinear()
            .domain(d3.extent(line_plot, d => d.y))
            .range([this.height, 0]);

        // Generate the right type of line
        if (line.type) {
            this.smoothLine(line.beta);
        } else {
            this.defaultLine();
        }
    }

    private drawChart(): void {
        // Add the SVG to the page
        var svg = d3.select(this.id).append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

        if (this.showAxes) {
            // Draw X-axis
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + this.height + ")")
                .call(d3.axisBottom(this.xScale));

            //Draw Y - axis
            svg.append("g")
                .attr("class", "y axis")
                .call(d3.axisLeft(this.yScale));
        }

        // Append the vectorPath
        svg.append("path")
            .attr("class", "line")
            .attr("d", this.path);
    }

    // Smooth line
    public smoothLine(beta: number) {
        var lineGenerator = d3.line<any>()
            .x((d, i) => this.xScale(i))
            .y(d => this.yScale(d.y))
            .curve(d3.curveBundle.beta(beta));

        this.path = lineGenerator(this.line.data.slice(0, this.line.points + 1));
    };

    // Straight line
    public defaultLine() {
        var lineGenerator = d3.line<any>()
            .x((d, i) => this.xScale(i))
            .y(d => this.yScale(d.y))

        this.path = lineGenerator(this.line.data.slice(0, this.line.points + 1));
    }

    public drawLine() {
        this.initializeChart(this.line)
        // Draw only the chartline on the canvas
        this.svg = d3.select(this.id).transition();
        this.svg.select('.line')
            .duration(50)
            .attr('d', this.path)
    }

    // Update functions
    private updatePoints(n: number) {
        this.line.points = n;
        this.initializeChart(this.line)
        this.drawLine();
    }

    private updateAngle(a: number) {
        this.line.angle = a
        this.line.data = d3.range(25).map((d, i) => {
            let val = (a * d) + this.line.noise[i];
            return { "y": val };
        });

        this.initializeChart(this.line)
        this.drawLine();
    }

    private updateSmooth(beta: number) {
        this.line.beta = beta;
        this.initializeChart(this.line)
        this.drawLine();
    }

    private updateType(type: boolean) {
        this.line.type = type;
        this.initializeChart(this.line)
        this.drawLine();
    }

}









