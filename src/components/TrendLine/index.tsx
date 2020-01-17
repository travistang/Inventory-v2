import React from 'react';
import Trend from 'react-trend';
import "./style.scss";

type TrendLineProps = {
    data: Array<number>
};
const TrendLine: React.FC<TrendLineProps> = ({ data }) => {
    let ref = React.useRef(null);
    const [ componentWidth, setComponentWidth] = React.useState(200);
    
    // update the height variable on render
    React.useEffect(() => {
        if (ref && ref.current !== null) {
            //@ts-ignore
            setComponentWidth(ref.current.clientWidth);
        }
    }, []);

    return (
        <div className="TrendLineContainer" ref={ref}>
            <Trend
                smooth
                autoDraw
                width={componentWidth}
                autoDrawDuration={1000}
                autoDrawEasing="ease-out"
                data={data}
                gradient={['red', 'orange', 'yellow']}
                radius={25}
                strokeWidth={2}
                strokeLinecap={'butt'}
            />
        </div>
    )
};

export default TrendLine;