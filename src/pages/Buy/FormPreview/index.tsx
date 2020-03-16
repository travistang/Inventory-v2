import React from 'react';
import { BuyOrderFormType } from "../SelectFoodPopup";
import { Icon } from '@material-ui/core';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/react-hooks';
import "./style.scss";

const FOOD_UNIT = gql`
    query getFoodUnit($food: String!) {
        food(name: $food) @client {
            unit
        }
    }
`;

type FormPreviewProps = {
    form: BuyOrderFormType, 
}
const FormPreview: React.FC<FormPreviewProps> = ({
    form: {
        selectedFood,
        amount,
        price,
        currency,
        containersCount,
        priceType,
        expiryDate
    }
}) => {

    const { data } = useQuery(FOOD_UNIT, {
        variables: {
            food: selectedFood
        }
    });

    const totalPrice = (priceType === 0) 
            ? price * containersCount 
            : price;
    return (
        <div className="FormPreview-Container">
            <div className="FormPreview-Top">
                <div className="FormPreview-TopLeft">
                    { selectedFood}
                    <Icon>kitchen</Icon>
                    <div>
                        x {containersCount}
                    </div>
                </div>
                <div className="FormPreview-TopRight">
                    {totalPrice} {currency}
                </div>
            </div>
            <div className="FormPreview-Bottom">
                <div className="FormPreview-BottomLeft">
                    Total: { amount * containersCount } {data?.food?.unit} {'  '}
                    ({amount} {data?.food?.unit} per <Icon>kitchen</Icon>)
                </div>
                <div className="FormPreview-BottomRight">
                    <Icon>today</Icon>
                    {expiryDate ? new Date(expiryDate).toDateString() : "N/A"}
                </div>
            </div>
        </div>
    );
}

export default FormPreview;