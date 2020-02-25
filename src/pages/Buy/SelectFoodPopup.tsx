import React from 'react';
import { BuyOrder } from '../../data/typedefs';
import FoodTypePicker from "../../components/FoodTypePicker";
import FoodQuantityInfo from "./FoodQuantityInfo";
import Button from '../../components/Button';
import CenterNotice from '../../components/CenterNotice';
import Wizard from '../../components/Wizard';
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
    // const [step, setStep] = React.useState(0);

    const [selectedFood, setSelectedFood] = React.useState(null as string | null);
   
    React.useEffect(() => {
        // setStep(0);
        setSelectedFood(null);
    }, [open]);

    if (!open)return null;

    const headerTitle = (step: number) => {
        switch (step) {
            case 0:
                return "Select Food";
            case 1:
                return "Fill in Info";
            case 2:
                return "Success";
            default:
                return "";
        }
    };

    const popupContent = (
        step: number, 
        setStep: (step: number) => void
    ) => {
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
        <Wizard 
            open={open} 
            requestClose={requestClose}
            headerTitle={headerTitle} 
            style={style}>
            { popupContent }
        </Wizard>
    );
};

export default SelectFoodPopup;