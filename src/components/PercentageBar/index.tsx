import React from 'react';
import "./style.scss";

type PercentageBarProps = {
    percentageLeft: number,
    percentageDifference?: number,
    color: string
};
const PercentageBar: React.FC<PercentageBarProps> = ({
    color, percentageLeft, percentageDifference = 0
}) => (
    <div className={`PercentageBar-${color}`} style={{ 
        gridTemplateColumns: (() => {
            const s = `${percentageLeft - percentageDifference}% ${percentageDifference}% ${100 - percentageLeft}%`;
            return s;
        })()
    }}>
        <div />
        <div />
        <div />
    </div>
);

export default PercentageBar;