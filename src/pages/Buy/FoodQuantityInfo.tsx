import React from 'react';
import Form, { FormLayout, FormValueType } from '../../components/Form';

import Button from '../../components/Button';
import { BuyOrder, RawCurrency, FoodContainer } from '../../data/typedefs';
import FoodCard from '../../components/FoodCard';
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/react-hooks";
import { Currency } from '../../data/types';
import StickyBox from 'react-sticky-box';

const FOOD_INFO_QUERY = gql`
    query FoodInfo($name: String!) {
        food(name: $name) @client {
            name
            unit
            containers {
                expiryDate
                dateOpened
            }
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
    containers: FoodContainer[],
    info: {
        totalAmount: number,
        numberOfContainers: number
    },
    style?: React.CSSProperties
};
const FoodInfoSummaryComponent: React.FC<QueryResultType> = (props) => (
    <div className="FoodQuantityInfo-Summary">
        <p>You are buying:</p>
        <FoodCard {...props} />
    </div>
);

const formLayout: FormLayout = [
    [
        {
            label: "Container Capcity", type: "number",
            name: "amount", placeholder: "Amount", iconName:"local_mall",
            required: true, flex: 2,
            validate: value => !!(value && value > 0)
        },
        {
            label: "# Containers", type: "number",
            name: "containerCount", iconName: "kitchen",
            required: true, flex: 1,
            validate: value => !!(value && value > 0)
        }
    ],
    [
        {
            label: "Price", type: "number",
            name: "price", iconName: "local_atm",
            required: true,
            validate: value => !!(value && value > 0),
            flex: 2
        },
        {
            label: "Currency", type: "select",
            name: "currency", iconName: "euro",
            flex: 1,
            options: Object.values(RawCurrency)
        }
    ],
    [
        {
            label: "Price is for...", type: "select",
            name: "priceType", iconName: "live_help",
            options: [0, 1],
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
    priceType: 0 | 1,
    expiryDate: Date | null,
}

const initialValue: FormType = {
    amount: 0,
    price: 0,
    currency: "EUR",
    containerCount: 1,
    priceType: 1,
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
    onInfoProvided,
}) => {
    const [ form, setFormValue ] = React.useState(initialValue);

    const { data, loading } = useQuery(FOOD_INFO_QUERY, {
        variables: {
            name: food
        }
    });
    if (loading) return null;
    const onSave = () => {
        const {
            amount, price, currency, containerCount, priceType, expiryDate
        } = form;
        
        const buyOrders = Array(containerCount).fill({
            amount, 
            price: {
                currency, 
                amount: (priceType === 1) ? 
                    price / containerCount : price
            },
            foodName: food as string,
            expiryDate
        } as BuyOrder);

        onInfoProvided(buyOrders);
    };

    const isFormValid = form.amount > 0 && form.containerCount > 0 && form.price >= 0;

    return (
        <div className="FoodQuantityInfo-Container">
            { !loading && (
                <StickyBox offsetTop={-16}>
                    <FoodInfoSummaryComponent 
                        {...data.food as QueryResultType}
                    />
                </StickyBox>
            )}
            
            <div className="FoodQuantityInfo-Form">
                <Form withSubmitButton={false} layout={formLayout}
                    initialValue={initialValue}
                    setFormValue={setFormValue as (form: FormValueType) => void}
                    disabledFields={computeDisabledFields}
                    />
            </div>
            <div className="FoodQuantityInfo-ButtonRow">
                <Button title="Previous" icon="navigate_before" color="secondary" onClick={onPreviousStepRequested} />
                <Button title="Next" icon="save" color="info" onClick={onSave} disabled={!isFormValid} />
            </div>
        </div>
    )
};

export default FoodQuantityInfoComponent;