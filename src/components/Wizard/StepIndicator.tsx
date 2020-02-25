import React from 'react'
import { range } from 'lodash';
import "./style.scss";

type StepIndicatorProps = {
    step: number,
    totalSteps: number
};
type StepComponentProps = {
    i: number,
    status: "passed" | "ongoing" | "pending"
};
const StepIndicator: React.FC<StepIndicatorProps> = ({
    step, totalSteps
}) => { 
    const StepComponent: React.FC<StepComponentProps> = ({ i, status }) => (
        <div className={`StepIndicator-StepComponent StepIndicator-StepComponent-${status}`}>
            <div className="StepIndicator-Line" />
            <div className="StepIndicator-Center">
                {i + 1}
            </div>
            <div className="StepIndicator-Line" />
        </div>
    );

    const getStatusFromStep = (i: number) => {
        if (i < step) return "passed";
        else if (i === step) return "ongoing";
        else return "pending";
    }
    return (
        <div className="StepIndicator-Container">
            {
                range(totalSteps).map(i => (
                    <StepComponent i={i} status={getStatusFromStep(i)} />
                ))
            }
        </div>

    )
};

export default StepIndicator;