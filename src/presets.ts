import { scalePoint } from 'd3-scale';
import * as math from 'mathjs'
import { Line } from './line'

interface Preset extends Line {
    name: string,
}

export class Presets {
    public preset_list: Preset[] = [];

    constructor() {
        this.preset_list.push(this.sinus());
        this.preset_list.push(this.pdf());
        this.preset_list.push(this.scurve());
        this.preset_list.push(this.tone());
    };

    private sinus() {
        let xmax = 4 * math.pi;
        let x = math.range(0, xmax, (xmax / 100), true)
        let y = x.map(xt => Math.sin(xt));
        let y_array = y.toArray() as number[];
        let y_data = y_array.map(val => { return { "y": val } })
        return { name: "sin", data: y_data, points: y_data.length }
    }

    private pdf() {
        let expression = "(1/(std*sqrt(2*pi))) * e ^ (-0.5*((x-mean)/std)^2)";
        let scope = {
            std: 1,
            mean: 0,
            x: undefined,
        };
        let x = math.range(-4, 4, 0.1, true);
        let y = x.map(xt => {
            scope.x = xt;
            return math.evaluate(expression, scope)
        });
        let y_array = y.toArray() as number[];
        let y_data = y_array.map(val => { return { "y": val } })
        return { name: "pdf", data: y_data, points: y_data.length }
    }

    private scurve(){
        let expression = "1/(1+e^(-x))"
        let scope = {
            x: undefined,
        };
        let x = math.range(-6, 6, 0.1, true);
        let y = x.map(xt => {
            scope.x = xt;
            return math.evaluate(expression, scope)
        });
        let y_array = y.toArray() as number[];
        let y_data = y_array.map(val => { return { "y": val } })
        return { name: "scurve", data: y_data, points: y_data.length }
    }

    private tone(){
        let exp_n = "(1/(std*sqrt(2*pi))) * e ^ (-0.5*((t-mean)/std)^2)";
        let scope_normal = {
            std: 1,
            mean: 5,
            t: undefined,
        };

        let t = math.range(1.5, 8.5, 0.05, true);
        let wave = t.map(tt => {
            return Math.sin(2*Math.PI*tt)
        });

        let normal = t.map(tt => {
            scope_normal.t = tt;
            return math.evaluate(exp_n, scope_normal);
        });
        
        let wave_ar = wave.toArray() as number[]
        let normal_ar = normal.toArray() as number[]

        let tone = wave_ar.map((w,i) => {
            return w * normal_ar[i]
        });

        let y_data = tone.map(val => { return { "y": val } })
        return { name: "tone", data: y_data, points: y_data.length }
    }
};




