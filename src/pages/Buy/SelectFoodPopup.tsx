import React from 'react';
import { BuyOrder, Currency } from '../../data/typedefs';
import FoodTypePicker from "../../components/FoodTypePicker";
import FoodQuantityInfo from "./FoodQuantityInfo";
import Button from '../../components/Button';
import CenterNotice from '../../components/CenterNotice';
import Wizard from '../../components/Wizard';
import "./style.scss";

type BuyOrderFormType = {
    selectedFood: string,
    price: number,
    currency: Currency,
    amount: number,
    containersCount: number,
    priceType: "Each Container" | "All Containers" | null,
    expiryDate: Date | null
};

type SelectFoodPopupProps = {
    open: boolean;
    requestClose: () => void;
    onBuyOrdersAdded: (orders: BuyOrder[]) => void;
    style?: object;
};
const SelectFoodPopup: React.FC<SelectFoodPopupProps> = ({
    open, requestClose, style, onBuyOrdersAdded
}) => {

    const initialFormValue : BuyOrderFormType = {
        selectedFood: "",
        price: 0,
        currency: "EUR",
        amount: 0,
        containersCount: 0, 
        priceType: "Each Container",
        expiryDate: null
    };
    const [selectedFood, setSelectedFood] = React.useState(null as string | null);
    const [ form, setForm ]               = React.useState(initialFormValue);

    const setFormField = (fieldName: string, value: any) => (
        setForm({...form, [fieldName]: value})
    );
    
    React.useEffect(() => {
        setForm(initialFormValue);
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
                        onFoodSelected={food => {
                            setFormField("selectedFood", food); 
                            setStep(1);
                        }} 
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