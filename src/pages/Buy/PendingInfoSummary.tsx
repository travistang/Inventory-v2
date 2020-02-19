import React from 'react';
import { BuyOrder, Price } from '../../data/typedefs';

type PendingInfoSummaryProps = {
    orders: BuyOrder[]
}
const PendingInfoSummary: React.FC<PendingInfoSummaryProps> = ({
    orders
}) => {
    if (orders.length === 0) return null;

    // compute info
    const totalAmount = orders.reduce((total, order) => (
        new Price(order.price.amount, order.price.currency)
            .as("EUR")
            .add(total)
    ), new Price(0, "EUR"));

    const numDifferentFoods = Array.from(
        new Set(orders.map(order => order.foodName)).values()
    ).length;
    const numContainers = orders.length;

    return (
        <div className="BuyPage-SummaryRow">
            <div className="BuyPage-SummaryRow-Left"/>
            <div className="BuyPage-SummaryRow-Total">
                <div>{ numContainers } Container(s)</div>
                <div>
                { numDifferentFoods } Different food
                </div>
                <div className="BuyPage-SummaryRow-Sum">
                    Total: {totalAmount.amount.toFixed(2)} EUR
                </div>
            </div>
        </div>
    );
}

export default PendingInfoSummary;