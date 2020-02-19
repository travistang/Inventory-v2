import React from 'react';
import GenericCard, { GenericCardExtraProps } from '../../components/GenericCard';
import { BuyOrder } from '../../data/typedefs';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/react-hooks';

const FOOD_QUERY = gql`
    query GetFood($name: String!) {
        food(name: $name) @client {
            unit
        }
    }
`;
type PendingOrderCardProps = GenericCardExtraProps & {
    order: BuyOrder
};

const PendingOrderCard: React.FC<PendingOrderCardProps> = ({
    order, ...props
}) => {
    const { foodName, amount: addAmount, expiryDate } = order;

    const { loading, data, error } = useQuery(FOOD_QUERY, {
        variables: { name: foodName }
    });
    
    if (error) {
        alert(error.message);
        return null;
    }   
    if(loading) return null;
    return (
        <GenericCard 
            mainText={foodName}
            smallComponent={expiryDate ? expiryDate.toLocaleString("en-US") : "No expiry date"}
            rightComponent={<div>{`${addAmount} ${data.food.unit}`}</div>}
            {...props}
        />
    )   
};

export default PendingOrderCard;