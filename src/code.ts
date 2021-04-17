figma.showUI(__html__)
figma.ui.resize(350, 477);

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

    let selection = figma.currentPage.selection

    if(selection.length > 0){
      let frames = selection.filter(s => s.type === "FRAME") as FrameNode[]
      if(frames.length > 0){
        let f = frames[0]
        ln.x = f.width/2 - ln.width/2
        ln.y = f.height/2 - ln.height/2
        f.appendChild(ln)
      }
      else {
        figma.currentPage.appendChild(ln)
      }
    }
  
    // Add to page
    nodes.push(ln)
  
    figma.viewport.scrollAndZoomIntoView(nodes)
    figma.closePlugin()
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
