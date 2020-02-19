import React from 'react';
import SelectFoodPopup from './SelectFoodPopup';

import Button from '../../components/Button';
import { BuyOrder } from '../../data/typedefs';
import "./style.scss";
import { CenterNoticeSwitch } from '../../components/CenterNotice';
import PendingOrderCard from './PendingOrderCard';
import PendingInfoSummary from './PendingInfoSummary';
import { useHeader } from '../Header';

const BuyPage: React.FC = () => {
    const [ openSelectPopup, setOpenSelectPopup] = React.useState(false);
    const [ pendingBuyOrders, setPendingBuyOrders ] = React.useState([] as BuyOrder[]);
    
    const { setNavOptions } = useHeader();
    React.useEffect(() => {
        setNavOptions({
            title: "Buy",
            navButtons: [
                {
                    iconName: "add",
                    onClick: () => setOpenSelectPopup(true)
                }
            ]
        });
    }, []);

    return (
        <>
            <SelectFoodPopup 
                open={openSelectPopup} 
                requestClose={() => setOpenSelectPopup(false)}
                onBuyOrdersAdded={orders => setPendingBuyOrders([...pendingBuyOrders, ...orders])}
            />
            <div className="BuyPage-Main">
                <CenterNoticeSwitch watch={pendingBuyOrders} 
                    iconName="shopping_cart" 
                    title="Nothing to buy yet"
                    subtitle="Click the '+' button above to add a new item">
                    {
                        pendingBuyOrders.map((order, i) => (
                            <PendingOrderCard order={order} 
                                actionButton={{
                                    iconName: 'cancel',
                                    onClick: () => setPendingBuyOrders(
                                        // remove this order from the list of pending orders
                                        pendingBuyOrders.filter((_, j) => i !== j)
                                    )
                                }}
                            />
                        ))
                    }
                </CenterNoticeSwitch>
            </div>
            {
                !openSelectPopup && (
                    <PendingInfoSummary orders={pendingBuyOrders} />
                )
            }
            <div className="BuyPage-Action">
                <Button disabled={pendingBuyOrders.length === 0} 
                    title="Buy" color="info" icon="shopping_cart" 
                    onClick={() => {}} />
            </div>
        </>
    )
}

export default BuyPage;