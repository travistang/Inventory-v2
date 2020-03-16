import React from 'react';
import { BuyOrder, Currency, Price } from '../../data/typedefs';
import { roundNumber } from "../../utils";
import FoodTypePicker from "../../components/FoodTypePicker";
import FoodQuantityInfo from "./FoodQuantityInfo";
import Button from '../../components/Button';
import CenterNotice from '../../components/CenterNotice';
import Wizard from '../../components/Wizard';
import QuestionStep, { Question } from './QuestionStep';
import FormPreview from './FormPreview';

import "./style.scss";

export type BuyOrderFormType = {
    selectedFood: string,
    price: number,
    currency: Currency,
    amount: number,
    containersCount: number,
    priceType: 0 | 1,
    expiryDate: Date | null
};
const QuestionStepPage = ({questions, currentPage, form, setFormField, setStep} : {
    questions: Question[],
    currentPage: number,
    form: BuyOrderFormType,
    setFormField: (name: string, value: any) => void,
    setStep: (step: number) => void

}) => (
    <>
        <FormPreview form={form} />
        <QuestionStep 
            form={form}
            questions={questions}
            onChange={setFormField}
        />
        <div style={{flex: 1}} />
        <div className="FoodQuantityInfo-ButtonRow">
            <Button title="Previous" icon="arrow_back" color="" 
                onClick={() => setStep(currentPage - 1)} 
            />
            <Button title="Next" icon="arrow_forward" color="" 
                onClick={() => setStep(currentPage + 1)} 
            />
        </div>
    </>
);
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
        priceType: 0,
        expiryDate: null
    };
    
    const [ form, setForm ] = React.useState(initialFormValue);

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
            case 5:
                return "Success";
            default:
                return "Fill in Info";
        }
    };

    const popupContent = (
        step: number, 
        setStep: (step: number) => void
    ) => {
        const onSubmitForm = () => {
            // convert the form to BuyOrder[]
            const buyOrders = Array(form.containersCount).fill({
                foodName: form.selectedFood,
                price: new Price(
                    form.priceType === 0 
                        ? form.price 
                        : roundNumber(form.price / form.containersCount, 2),
                    form.currency),
                expiryDate: form.expiryDate,
                amount: form.amount
            } as BuyOrder);
            // notify parent for buy orders 
            onBuyOrdersAdded(buyOrders);
            // reset the form here
            setForm(initialFormValue);
            // proceed to next step (show the success message)
            setStep(5);
        };

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
                    <QuestionStepPage questions={[
                            { 
                                name: "amount", type: "number", 
                                questionText: "Container Capacity"
                            },
                            { 
                                name: "containersCount", type: "number",
                                questionText: "Number of containers"
                            }
                        ]}
                        currentPage={1}
                        setStep={setStep}
                        form={form}
                        setFormField={setFormField}
                    />
                );
            case 2:
        
                return (
                    <QuestionStepPage questions={[
                            { 
                                name: "price", type: "number", 
                                questionText: "Price"
                            },
                            { 
                                name: "currency", type: "select",
                                questionText: "Currency",
                                options: [
                                    {
                                        value: "EUR", label: "€"
                                    },
                                    {
                                        value: "PLN", label: "zł"
                                    },
                                    {
                                        value: "HKD", label: "HK $"
                                    },
                                    {
                                        value: "USD", label: "US $"

                                    },
                                ]
                            },
                            {
                                name: "priceType", type: "select",
                                questionText: "Price is for...",
                                options: [
                                    {
                                        value: 0,
                                        label: "One Container",
                                        icon:  "stop"
                                    },
                                    {
                                        value: 1,
                                        label: "All Containers",
                                        icon:  "view_module"
                                    },
                                ]
                                
                            }
                        ]}
                        currentPage={2}
                        setStep={setStep}
                        form={form}
                        setFormField={setFormField}
                    />
                );
            case 3:
                return (
                    <QuestionStepPage 
                        questions={[
                            {
                                name: "expiryDate", type: "date",
                                questionText: "Expiry Date"
                            }
                        ]} 
                        currentPage={3} 
                        setStep={setStep}
                        form={form}
                        setFormField={setFormField}
                    />
                );
            case 4:
                return (
                    <>
                        <FormPreview form={form} />
                        <CenterNotice 
                            iconName="help_outline"
                            title="Is it correct?"
                            subtitle="Double check the info you provided above. If you would like to make corrections, click 'Previous' to correct"
                        />
                        <div className="FoodQuantityInfo-ButtonRow">
                            <Button title="Previous" icon="arrow_back" color="" 
                                onClick={() => setStep(3)} 
                            />
                            <Button title="Confirm" icon="check_circle_outline" color="" 
                                onClick={onSubmitForm} 
                            />
                        </div>
                    </>
                );
            case 5:
                return (
                    <>
                        <CenterNotice iconName="check_circle_outline" title="Food added to basket"
                            subtitle="You can choose 'Buy again' to add more, or 'Close' to review your basket" 
                        />
                        <div className="FoodQuantityInfo-ButtonRow">
                            <Button title="Close" icon="close" color="" onClick={requestClose} />
                            <Button title="Buy Again" icon="refresh" color="" onClick={() => setStep(0)} />
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
            totalSteps={6}
            style={style}>
            { popupContent }
        </Wizard>
    );
};

export default SelectFoodPopup;