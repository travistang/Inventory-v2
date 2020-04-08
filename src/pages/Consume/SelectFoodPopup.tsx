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

type SelectFoodForm = {
    selectedFood: string | null,
    container: FoodContainer | null,
    amount: number
}

type SelectFoodPopupProps = {
    open: boolean;
    requestClose: () => void;
    onConsumeOrderAdded: (order: PendingConsumeOrder) => void;
    pendingConsumeOrders: PendingConsumeOrder[];
}

const SelectFoodPopup: React.FC<SelectFoodPopupProps> = ({
    open, requestClose, onConsumeOrderAdded, 
    pendingConsumeOrders
}) => {
    // all the ids of the containers that are added to pending orders
    const selectedContainerIds = pendingConsumeOrders.map(order => order.container.id);

    // the number of food of which containers are chosen
    const foodCounts = pendingConsumeOrders.reduce((counter, order) => ({
        ...counter,
        [order.food]: (counter[order.food] || 0) + 1
    }), {} as {[key: string]: number});

    const [ form, setForm ] = React.useState({
        selectedFood: null,
        container: null,
        amount: 0
    } as SelectFoodForm);

    const setFormField = (name: string, value : string | number) => (
        setForm({ ...form, [name]: value})
    );

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
            food: form.selectedFood as string,
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
                        foodCounts={foodCounts}
                        filterFood={food => food.containers.length > 0} 
                        onFoodSelected={food => {
                            setFormField("selectedFood", food); 
                            setStep(1);
                        }} 
                    />
                );
            case 1:
                return form.selectedFood && (
                    <ContainerPicker 
                        food={form.selectedFood}
                        onToPreviousPage={() => setStep(0)}
                        selectedContainerIds={selectedContainerIds}
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
                            <Button title="Close" icon="close" color="" onClick={requestClose} />
                            <Button title="Add Another" icon="refresh" color="" onClick={() => setStep(0)} />
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
            totalSteps={3}
            headerTitle={headerTitle}>
            {popupContent}
        </Wizard>
    );
};

export default SelectFoodPopup;
