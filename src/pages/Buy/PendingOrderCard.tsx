import React from 'react';
import GenericCard from '../../components/GenericCard';
import { BuyOrder } from '../../data/typedefs';

type PendingOrderCardProps = {
    order: BuyOrder
};
const PendingOrderCard: React.FC<PendingOrderCardProps> = ({
    order
}) => {
    const { foodName, amount: addAmount, expiryDate } = order;

    return (
        <GenericCard 
            mainText={foodName}
            smallComponent={expiryDate ? expiryDate.toLocaleString("en-US") : "No expiry date"}
            rightComponent={addAmount}
        />
    )   
};

export default PendingOrderCard;