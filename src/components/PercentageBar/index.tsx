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
    <div className="PercentageBar" style={{ 
        gridTemplateColumns: (() => {
            const s = `${percentageLeft - percentageDifference}% ${percentageDifference}% ${100 - percentageLeft}%`;
            console.log(s);
            return s;
        })()
    }}>
        <div />
        <div />
        <div />
    </div>
);

export default PercentageBar;