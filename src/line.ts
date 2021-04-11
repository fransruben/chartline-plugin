import * as d3 from 'd3'

export interface genericLine{
    data: { "y": number }[];
    points: number;
    angle?: number;
    beta?: number;
    type?: boolean;
    noise?: number;
}

export class Line {

    private delta = 10;
    private max_points = 25;
    public data: { "y": number }[];

    public points: number;
    public angle: number;
    public beta: number;
    public noise: number[];
    public type: boolean;

    constructor(n: number, a: number, beta: number, type: boolean) {
        this.points = n;
        this.beta = beta;
        this.angle = a;
        this.type = type;

        this.data = this.generateData(this.max_points, a, this.delta);
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

}