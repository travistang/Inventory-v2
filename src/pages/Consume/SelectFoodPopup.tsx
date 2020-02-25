import React from 'react';
import Wizard from '../../components/Wizard';
import FoodTypePicker from '../../components/FoodTypePicker';
import Button from '../../components/Button';
import ContainerPicker from './ContainerPicker';
import CenterNotice from '../../components/CenterNotice';

import { FoodContainer } from '../../data/typedefs';

export type PendingConsumeOrder = {
    food: string,
    container: FoodContainer,
    amount: number
}

type SelectFoodPopupProps = {
    open: boolean;
    requestClose: () => void;
    onConsumeOrderAdded: (order: PendingConsumeOrder) => void;
}

const SelectFoodPopup: React.FC<SelectFoodPopupProps> = ({
    open, requestClose, onConsumeOrderAdded
}) => {
    const [selectedFood, setSelectedFood] = React.useState(null as string | null);
    
    const headerTitle = (step: number) => {
        switch(step) {
            case 0:
                return "Select Food";
            case 1:
                return "Select Container";
            case 2:
                return "Success";
            default:
                return "";
        }
    };

    const reportConsumeOrder = (container: FoodContainer, amount: number) => {
        onConsumeOrderAdded({
            food: selectedFood as string,
            container,
            amount
        });
    };

    const popupContent = (
        step: number,
        setStep: (step: number) => void
    ) => {
        switch(step) {
            case 0:
                return (
                    <FoodTypePicker
                        filterFood={food => food.containers.length > 0} 
                        onFoodSelected={food => {setSelectedFood(food); setStep(1)}} 
                    />
                );
            case 1:
                return (
                    <ContainerPicker 
                        food={selectedFood}
                        onToPreviousPage={() => setStep(0)}
                        onSelectContainer={(container, amount) => {
                            reportConsumeOrder(container, amount); 
                            setStep(2);
                        }}
                    />
                );
            case 2:
                return (
                    <>
                        <CenterNotice iconName="check_circle_outline" title="Record added"
                            subtitle="You can choose 'Add Another' to add another record, or 'Close' to review your consumption order." 
                        />
                        <div className="FoodQuantityInfo-ButtonRow">
                            <Button title="Close" icon="close" color="secondary" onClick={requestClose} />
                            <Button title="Add Another" icon="refresh" color="info" onClick={() => setStep(0)} />
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
            headerTitle={headerTitle}>
                {popupContent}
        </Wizard>
    );
};

export default SelectFoodPopup;
