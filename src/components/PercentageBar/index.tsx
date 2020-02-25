import React from 'react';
import "./style.scss";


const backgroundColor = 'rgba(255, 255, 255, 0.3)';
type PercentageBarProps = {
    percentageLeft: number,
    percentageDifference?: number,
    color: string
};
const PercentageBar: React.FC<PercentageBarProps> = ({
    color, percentageLeft, percentageDifference = 0
}) => (
    <div className="PercentageBar">
        <div style={{ flexGrow: percentageLeft - percentageDifference, backgroundColor: color, height: 8 }}>

        </div>
        {
            percentageDifference ? (
                <div style={{
                    flexGrow: percentageDifference, 
                    height: 8, 
                    background: `repeating-linear-gradient(
                        -50deg,
                        transparent,
                        transparent 25%,
                        ${color} 25%,
                        ${color} 50%,
                        transparent 50%
                    ) top left fixed`,
                    backgroundSize: '30px 30px'
                }}/>
            ) : null
        }
        <div style={{ flex: 100 - percentageLeft, backgroundColor }}>

        </div>
    </div>
);

export default PercentageBar;