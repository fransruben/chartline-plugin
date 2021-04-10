import * as d3 from 'd3'

export class LineChart {

    // Chart area
    private chart_width = 350;
    private chart_height = 200;
    
    // Dataline parameters
    private delta = 10;
    private max_points = 25;
    public dataline;

    public points: number;
    public angle: number;
    public beta: number;
    public noise: number[];
    public type: boolean;


    // Draw chart
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
        this.angle = a;
        this.type = true;

        this.dataline = this.generateData(this.max_points, a, this.delta);
        this.initializeChart(this.dataline.slice(0,n+1), beta, this.type);
        this.drawChart();
    }

    private generateData(n: number, a: number, delta: number) {
        this.noise = d3.range(n).map(d => {
            let val = (Math.random() * 2 * delta - delta);
            return val;
        });

        let data = d3.range(n).map((d, i) => {
            let val = (this.angle * d) + this.noise[i];
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
        this.initializeChart(this.dataline.slice(0,n+1), this.beta, this.type)
        this.drawLine();
    }

    private updateAngle(a: number){
        this.angle = a
        this.dataline = d3.range(25).map((d,i) => {
            let val = (a * d) + this.noise[i];
            return { "y": val };
        });

        this.initializeChart(this.dataline.slice(0,this.points+1), this.beta, this.type)
        this.drawLine();
    }

    private updateSmooth(beta: number){
        this.beta = beta;
        this.initializeChart(this.dataline.slice(0,this.points+1), this.beta, this.type)
        this.drawLine();
    }

    private updateType(id){
        let type = (id == "curved" ? true : false);
        this.type = type;
        this.initializeChart(this.dataline.slice(0,this.points+1), this.beta, type)
        this.drawLine();
    }

    // Redraw chart line
    private drawLine(){
        this.svg = d3.select("#linechart").transition();
        this.svg.select('.line')
            .duration(50)
            .attr('d', this.line)
    }

    // Create chart functions
    private initializeChart(data: { y: number }[], beta: number = 0.5, type: boolean = true): void {
        // Use the margin convention practice 
        this.margin = { top: 36, right: 36, bottom: 36, left: 36 };
        this.width = this.chart_width - this.margin.left - this.margin.right
        this.height = this.chart_height - this.margin.top - this.margin.bottom;

        // X scale will use the index of our data
        this.xScale = d3.scaleLinear()
            .domain([0, data.length])
            .range([0, this.width]);

        // Y scale will auto-scale 
        this.yScale = d3.scaleLinear()
            .domain(d3.extent(data, d => d.y))
            .range([this.height, 0]);

        // d3's line generator
        if(type){
            var lineGenerator = d3.line<any>()
                .x((d, i) => this.xScale(i))
                .y(d => this.yScale(d.y))
                .curve(d3.curveBundle.beta(beta));
        } else {
            var lineGenerator = d3.line<any>()
                .x((d, i) => this.xScale(i))
                .y(d => this.yScale(d.y))
        }

        // Generate a vectorPath from the data
        this.line = lineGenerator(data);
    }

    private drawChart(): void {
        // Add the SVG to the page
        var svg = d3.select("#linechart").append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

        // // Draw X-axis
        // svg.append("g")
        //     .attr("class", "x axis")
        //     .attr("transform", "translate(0," + this.height + ")")
        //     .call(d3.axisBottom(this.xScale));

        // Draw Y-axis
        // svg.append("g")
        //     .attr("class", "y axis")
        //     .call(d3.axisLeft(this.yScale));

        // Append the path and call the line generator 
        svg.append("path")
            .attr("class", "line")
            .attr("d", this.line);
    }
}









