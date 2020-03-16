import React from 'react';
import StepIndicator from './StepIndicator';
import { Icon } from "@material-ui/core";
import "./style.scss";

type WizardProps = {
    open: boolean;
    totalSteps: number;
    requestClose: () => void;
    style?: object;
    children: (step: number, toStep: (step: number) => void) => React.ReactNode;
    headerTitle: (step: number) => string;
}
const Wizard: React.FC<WizardProps> = ({
    open, requestClose, children, style, headerTitle,
    totalSteps
}) => {
    const [step, setStep] = React.useState(0);
    
    React.useEffect(() => {
        setStep(0);
    }, [open]);

    if(!open) return null;
    
    return (
        <div className="Wizard-Container" style={style}>
            <div className="Wizard-Header">
                <div className="Header">
                    <div>
                        <Icon style={{fontSize: 32}} onClick={requestClose}>
                            navigate_before
                        </Icon>
                    </div>
                    <div className="Header-NavButtonGroup">
                        { headerTitle(step) }
                    </div>
                </div>
            </div>
            <StepIndicator step={step} totalSteps={totalSteps} />
            <div className="Wizard-Content">
                { children(step, setStep) }
            </div>
        </div>
    );
};

export default Wizard;