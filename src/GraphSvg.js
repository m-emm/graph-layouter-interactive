import GraphNode from './GraphNode';

function GraphSvg() {
    return (
        <div className="GraphSvg">
            <svg width="100%" height="100%" viewBox="0 0 100 100">
                <GraphNode
                    x={50}
                    y={30}
                /> 
                     <GraphNode
                    x={80}
                    y={50}
                /> 
            </svg>
        </div>

    )
}

export default GraphSvg;