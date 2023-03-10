
function GraphSvg_css(nodeNameFontSize,edgeNameFontSize,nodeIdFontSize) {
    
    return `
    svg text {
        -webkit-user-select: none;
        -moz-user-select: none;
            -ms-user-select: none;
                user-select: none;
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
        stroke-width: 1.5px;
    }

    .dashed {
        stroke-dasharray: 5, 5;
    }
    `
}

export default GraphSvg_css;