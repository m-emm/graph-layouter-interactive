
function GraphSvg_css(nodeNameFontSize, edgeNameFontSize, nodeIdFontSize) {

    return `
    svg text {
        -webkit-user-select: none;
        -moz-user-select: none;
            -ms-user-select: none;
                user-select: none;
        font-family: sans-serif;
    }
    svg text::selection {
        background: none;
    }

    .node-id {
        font-size: 10px;
        font-weight: regular;
        fill: #000;
        visibility: hidden;
    }

    .node-name {
        font-size: ${nodeNameFontSize}px;
        font-weight: regular;
        fill: #000;
    }

    .edge-name {
        font-size: ${edgeNameFontSize}px;
        font-weight: regular;
        fill: #000;
    }

    .node-circle {
        stroke: #000;
        stroke-width: 0.1px;
        fill: lightyellow;
    }

    .graph-edge {
        stroke: black;
        stroke-width: 2px;
    }

    .dashed {
        stroke-dasharray: 5, 5;
    }

    .node-border {
        stroke: black;
        stroke-width: 0.6px;
        fill: lightyellow;
    }

    .arrow-head-use {
        fill: black;
    }
    .arrow-head-implements {
        fill: white;
        stroke: black;
        stroke-width: 2px;
    }

    `
}

export default GraphSvg_css;