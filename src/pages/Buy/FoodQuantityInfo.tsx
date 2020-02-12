import React from 'react';
import Form, { FormLayout, FormValueType } from '../../components/Form';

import Button from '../../components/Button';
import { BuyOrder, RawCurrency } from '../../data/typedefs';
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/react-hooks";
import { Currency } from '../../data/types';

const FOOD_INFO_QUERY = gql`
    query FoodInfo($name: String!) {
        food(name: $name) {
            name
            unit
            info {
                totalAmount
                numberOfContainers
            }
        }
    }
`;

type QueryResultType = {
    name: string,
    unit: string,
    info: {
        totalAmount: number,
        numberOfContainers: number
    }
};
const FoodInfoSummaryComponent: React.FC<QueryResultType> = ({
    name, unit, info: { totalAmount, numberOfContainers}
}) => (
    <div className="FoodQuantityInfo-Summary">
        <p>You are buying:</p>
        <div className="FoodQuantityInfo-Summary-Name">
            {name}
        </div>
    </div>
);

const formLayout: FormLayout = [
    [
        {
            label: "Container Capcity", type: "number",
            name: "amount", placeholder: "Amount", iconName:"local_mall",
            required: true, flex: 6,
            validate: value => !!(value && value > 0)
        },
        {
            label: "# Containers", type: "number",
            name: "containerCount", iconName: "kitchen",
            required: true, flex: 6,
            validate: value => !!(value && value > 0)
        }
    ],
    [
        {
            label: "Price", type: "number",
            name: "price", iconName: "local_atm",
            required: true,
            validate: value => !!(value && value > 0),
            flex: 8
        },
        {
            label: "Currency", type: "select",
            name: "currency", iconName: "euro",
            flex: 4,
            options: Object.values(RawCurrency)
        }
    ],
    [
        {
            label: "Price is for...", type: "select",
            name: "priceType", iconName: "live_help",
            options: ["Each Container", "All Containers"],
        }
    ],
    [
        {
            label: "Expiry Date", type: "date",
            name: "expiryDate", iconName: "calendar"
        }
    ]
];
const computeDisabledFields = (form: FormValueType) => {
    if((form.containerCount as number) <= 1) {
        return ["priceType"];
    }

    return [];
}
type FormType = {
    amount: number,
    price: number,
    currency: Currency,
    containerCount: number,
    priceType: "Each Container" | "All Containers",
    expiryDate: Date | null,
}

const initialValue: FormType = {
    amount: 0,
    price: 0,
    currency: "EUR",
    containerCount: 1,
    priceType: "All Containers",
    expiryDate: null
}

type FoodQuantityInfoProps = {
    food: string | null,
    onPreviousStepRequested: () => void,
    onInfoProvided: (order: BuyOrder[]) => void
};
const FoodQuantityInfoComponent: React.FC<FoodQuantityInfoProps> = ({
    food,
    onPreviousStepRequested,
    onInfoProvided
}) => {
    const { data } = useQuery(FOOD_INFO_QUERY, {
        variables: {
            name: food
        }
    });
    const [ form, setFormValue ] = React.useState(initialValue);

    React.useEffect(() => {
        console.log('data changed');
        console.log(data);
    }, [data]);
    React.useEffect(() => {
        console.log(form);
    }, [form]);

    const onSave = () => {
        const {
            amount, price, currency, containerCount, priceType, expiryDate
        } = form;
        
        const buyOrders = Array(containerCount).fill({
            amount, 
            price: {
                currency, 
                amount: (priceType === "All Containers") ? 
                    price / containerCount : price
            },
            foodName: food as string,
            expiryDate
        } as BuyOrder);

        onInfoProvided(buyOrders);
    };
    return (
        <div className="FoodQuantityInfo-Container">
            
            { !!data && <FoodInfoSummaryComponent {...data as QueryResultType} /> }
            
            <div className="FoodQuantityInfo-Form">
                <Form withSubmitButton={false} layout={formLayout}
                    initialValue={initialValue}
                    setFormValue={setFormValue as (form: FormValueType) => void}
                    disabledFields={computeDisabledFields}
                    />
            </div>
            <div className="FoodQuantityInfo-ButtonRow">
                <Button title="Previous" icon="navigate_before" color="secondary" onClick={onPreviousStepRequested} />
                <Button title="Next" icon="save" color="info" onClick={onSave} />
            </div>
        </div>
    )
};

export default FoodQuantityInfoComponent;