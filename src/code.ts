figma.showUI(__html__)
figma.ui.resize(400, 600);

figma.ui.onmessage = msg => {
  if (msg.type === 'create-line') {
    console.log(msg.type)

    const nodes = []

    const ln = figma.createVector()
    ln.vectorPaths = [{windingRule: "NONE", data: msg.parsedLine}]
    figma.currentPage.appendChild(ln)
    nodes.push(ln)
  
    figma.viewport.scrollAndZoomIntoView(nodes)

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

  // figma.closePlugin()
}
