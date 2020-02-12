import React from 'react';
import { Icon } from '@material-ui/core';
import { BuyOrder } from '../../data/typedefs';
import FoodTypePicker from "./FoodTypePicker";
import FoodQuantityInfo from "./FoodQuantityInfo";
import Button from '../../components/Button';
import CenterNotice from '../../components/CenterNotice';
import {Motion, spring, } from 'react-motion';
import StepIndicator from './StepIndicator';
import "./style.scss";

type SelectFoodPopupProps = {
    open: boolean;
    requestClose: () => void;
    onBuyOrdersAdded: (orders: BuyOrder[]) => void;
    style?: object;
};
const SelectFoodPopup: React.FC<SelectFoodPopupProps> = ({
    open, requestClose, style, onBuyOrdersAdded
}) => {
    // number of steps the picker is picking
    const [step, setStep] = React.useState(0);

    const [selectedFood, setSelectedFood] = React.useState(null as string | null);

    React.useEffect(() => {
        setStep(0);
        setSelectedFood(null);
    }, [open]);

    if (!open)return null;

    const headerContent = () => {
        switch (step) {
            case 0:
                return "Select Food";
            case 1:
                return "Fill in Info";
            case 2:
                return "Success";
            default:
                return null;
        }
    };

    const popupContent = () => {
        switch(step) {
            case 0:
                return (
                    <FoodTypePicker 
                        onFoodSelected={food => {setSelectedFood(food); setStep(1)}} 
                    />
                );
            case 1:
                return (
                    <FoodQuantityInfo
                        food={selectedFood}
                        onPreviousStepRequested={() => setStep(0)}
                        onInfoProvided={(order: BuyOrder[]) => {
                            onBuyOrdersAdded(order)
                            setStep(2)
                        }}
                    />
                );
            case 2:
                return (
                    <>
                        <CenterNotice iconName="check_circle_outline" title="Food added to basket"
                            subtitle="You can choose 'Buy again' to add more, or 'Close' to review your basket" 
                        />
                        <div className="FoodQuantityInfo-ButtonRow">
                            <Button title="Close" icon="close" color="secondary" onClick={requestClose} />
                            <Button title="Buy Again" icon="refresh" color="info" onClick={() => setStep(0)} />
                        </div>
                    </>
                )
            default:
                return null;
        }
    }
    return (
        <div className="SelectFoodPopup-Container" style={style}>
            <div className="SelectFoodPopup-Header">
                <div className="Header">
                    <div>
                        <Icon style={{fontSize: 32}} onClick={requestClose}>
                            navigate_before
                        </Icon>
                    </div>
                    <div className="Header-NavButtonGroup">
                        { headerContent() }
                    </div>
                </div>
            </div>
            <StepIndicator step={step} totalSteps={3} />
            <div className="SelectFoodPopup-Content">
                { popupContent() }
            </div>
        </div>
    )
};

// deal with the move-up animation
const SelectFoodPopupWithMotion: React.FC<SelectFoodPopupProps> = (props) => {
    
    const style = (moveValue: number) => ({
        transform: `translateY(-${100 * moveValue}%)`
    });

    return (
        <Motion defaultStyle={{y: 0}} style={{y: spring(10) }}>
            {
                //@ts-ignore
                moveValue => <SelectFoodPopup {...props} style={style(moveValue)} /> 
            }
        </Motion>
    )
};

export default SelectFoodPopupWithMotion;