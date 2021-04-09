import * as d3 from 'd3'

export class LineChart {

    private chart_width = 350;
    private chart_height = 200;
    private delta = 10;

    public dataline;
    public noise;
    public angle;
    public points;
    public beta;

    public svg;
    public width;
    public height;
    public margin;
    public xScale;
    public yScale;
    public line;

    constructor(n: number, a: number, beta: number) {
        this.points = n;
        this.beta = beta;
        this.dataline = this.generateData(25, a, this.delta);
        this.initializeChart(this.dataline.slice(0,n+1), beta);
        this.drawChart();
    }

    private generateData(n: number, a: number, delta: number) {
        this.noise = d3.range(n).map(d => {
            let val = (Math.random() * 2 * delta - delta);
            return val;
        });

        let data = d3.range(n).map((d, i) => {
            this.angle = (a * d);
            let val = this.angle + this.noise[i];
            return { "y": val };
        })
        return data;
    }

    private refresh(n: number, a: number, beta: number){
        this.dataline = this.generateData(25, a, this.delta);
        this.updatePoints(n);
    }
    
    // Update functions (knobs)
    private updatePoints(n: number) {
        this.points = n;
        this.initializeChart(this.dataline.slice(0,n+1), this.beta)
        this.drawLine(50);
    }

    private updateAngle(a: number){
        this.dataline = d3.range(25).map((d,i) => {
            this.angle = a * d;
            let val = this.angle + this.noise[i];
            return { "y": val };
        });

        this.initializeChart(this.dataline.slice(0,this.points+1), this.beta)
        this.drawLine(50);
    }

    private updateSmooth(beta: number){
        console.log('Beta: ' + beta)
        this.beta = beta;
        this.initializeChart(this.dataline.slice(0,this.points+1), this.beta)
        this.drawLine(50);
    }

    // Redraw chart line
    private drawLine(t: number){
        this.svg = d3.select("#linechart").transition();
        this.svg.select('.line')
            .duration(t)
            .attr('d', this.line)
    }

    // Create chart functions
    private initializeChart(data: { y: number }[], beta: number = 0.5): void {
        // Use the margin convention practice 
        this.margin = { top: 36, right: 36, bottom: 36, left: 36 };
        this.width = this.chart_width - this.margin.left - this.margin.right
        this.height = this.chart_height - this.margin.top - this.margin.bottom;

        // X scale will use the index of our data
        this.xScale = d3.scaleLinear()
            .domain([0, data.length])
            .range([0, this.width]);

        // Y scale will use the randomly generated number 
        this.yScale = d3.scaleLinear()
            .domain(d3.extent(data, d => d.y))
            .range([this.height, 0]);

        // d3's line generator
        var lineGenerator = d3.line<any>()
            .x((d, i) => this.xScale(i))
            .y(d => this.yScale(d.y))
            .curve(d3.curveBundle.beta(beta));

        // Generate a vectorPath from the data
        this.line = lineGenerator(data);
    }

    private drawChart(): void {
        // 1. Add the SVG to the page and employ #2
        var svg = d3.select("#linechart").append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

        // // 3. Call the x axis in a group tag
        // svg.append("g")
        //     .attr("class", "x axis")
        //     .attr("transform", "translate(0," + this.height + ")")
        //     .call(d3.axisBottom(this.xScale));

        // // 4. Call the y axis in a group tag
        // svg.append("g")
        //     .attr("class", "y axis")
        //     .call(d3.axisLeft(this.yScale));

        // 9. Append the path, bind the data, and call the line generator 
        svg.append("path")
            // .datum(dataset) // 10. Binds data to the line 
            .attr("class", "line") // Assign a class for styling 
            .attr("d", this.line); // 11. Calls the line generator 
    }

}









