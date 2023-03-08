
function LockIcon({x,y,radius,id}) {
    const transform = "translate("+x +","+y +")"+ " scale("+radius*0.07+")" ;
    const size=50;
    const inset = 0.15*size;
    const lockWidth = size -2*inset;
    const lockHeight = size*0.4;
    const lockHandleWidth = lockWidth*0.6;
    const lockHandleY = size-inset-lockHeight;
    const handlePath = "M "+(inset+lockWidth*0.5-lockHandleWidth*0.5)+" "+(lockHandleY)+" A "+(lockHandleWidth/2)+" "+(lockHeight*0.8)+" 0 0 1 "+(inset+lockWidth*0.5+lockHandleWidth*0.5)+" "+(lockHandleY);

    
    return(
        <g transform={transform}>
            <rect id={id} class="lock-rect" x="0" y="0" width={size} height={size} fill="white" stroke="none"/>
            <rect class="lock-path" stroke="black" strokeWidth="4" fill="white" id={id} x={inset} y={size-inset-lockHeight} width={lockWidth} height={lockHeight} />
            <path class="lock-path" stroke="black" strokeWidth="4" fill="none" d={handlePath} />
        </g>
    )
}

// // <rect class="lock-path" stroke="black" strokeWidth="4" fill="white" id={id} x={inset} y="{size+inset-lockHeight+40}" width={lockWidth} height={lockHeight} />
export default LockIcon;
