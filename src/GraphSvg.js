import React, { useState, useEffect } from 'react';
import GraphNode from './GraphNode';


function GraphSvg() {

    useEffect(() => {
        const interval = setInterval(() => {
          console.log('This will run every second!');
        }, 1000);
        return () => clearInterval(interval);
      }, []);
      
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