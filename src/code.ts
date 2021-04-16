figma.showUI(__html__)
figma.ui.resize(350, 500);

figma.ui.onmessage = msg => {
  if (msg.type === 'create-line') {
    console.log(msg.type)

    const nodes = []

    const ln = figma.createVector()
    ln.vectorPaths = [{windingRule: "NONE", data: msg.parsedLine}]
    
    // Set color of line
    const color = {r:24/255, g:160/255, b:251/255 };
    let strokes = clone(ln.strokes)
    strokes[0].color = color;
    ln.strokes = strokes;

    figma.currentPage.appendChild(ln)
    nodes.push(ln)
  
    figma.viewport.scrollAndZoomIntoView(nodes)
    figma.closePlugin()

    // for (let i = 0; i < msg.count; i++) {
    //   const rect = figma.createRectangle()
    //   rect.x = i * 150
    //   rect.fills = [{type: 'SOLID', color: {r: 1, g: 0.5, b: 0}}]
    //   figma.currentPage.appendChild(rect)
    //   nodes.push(rect)
    // }

    // figma.currentPage.selection = nodes
    // figma.viewport.scrollAndZoomIntoView(nodes)
  }
}

function clone(val) {
  const type = typeof val
  if (val === null) {
    return null
  } else if (type === 'undefined' || type === 'number' ||
             type === 'string' || type === 'boolean') {
    return val
  } else if (type === 'object') {
    if (val instanceof Array) {
      return val.map(x => clone(x))
    } else if (val instanceof Uint8Array) {
      return new Uint8Array(val)
    } else {
      let o = {}
      for (const key in val) {
        o[key] = clone(val[key])
      }
      return o
    }
  }
  throw 'unknown'
}
