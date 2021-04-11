import * as math from 'mathjs'

export function sinus(n: number) {
    let xmax = 2 * math.pi;
    let x = math.range(0, xmax, (xmax/n), true)
    let y = x.map(xt => Math.sin(xt));
    return y
}

