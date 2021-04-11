export function parseSVG(raw_svg: string) {
    // parse SVG path format to Figma readable format
    let parsedSVG = raw_svg.replace(/,/g, ' ')
        .replace(/L/g, ' L ')
        .replace(/M/g, ' M ')
        .replace(/C/g, ' C ')
        .trim()
    return parsedSVG;
}

export function sliderFill(elm: HTMLInputElement) {
    let val = parseFloat(elm.value)
    let max = parseFloat(elm.max)
    let min = parseFloat(elm.min)
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

    elm.style.background = 'linear-gradient(to right' + st1 + st2 + st3 + st4 + st5 + st6 + ')';
}

export function updateTypeUI(elm: Element) {
    let smooth_slider = <HTMLInputElement>document.getElementById('smooth');

    if (elm.id == 'straight') {
        smooth_slider.disabled = true;
        smooth_slider.value = '0.5';
        sliderFill(smooth_slider);
    } else {
        smooth_slider.disabled = false;
    }
}

export function openTab(elm, tabname: string) {
    let tab = tabname.toLocaleLowerCase();

    // Hide all pages
    let pages = document.querySelectorAll('.page') as NodeListOf<HTMLElement>
    pages.forEach(page => {
        page.style.display = 'none';
    })

    // Show active page and tab
    document.getElementById(tab).style.display = 'block';
}

export function setActiveStyle(active_elm: Element, parent_id: string) {
    // Get all children
    var items = document.querySelectorAll(parent_id)[0].children;

    // Remove active class from all children
    for (let i = 0; i < items.length; i++) {
        items[i].className = items[i].className.replace(" active", "");
    };

    // Set active class
    active_elm.className += " active";
}