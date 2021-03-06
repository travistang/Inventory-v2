import React from 'react';
import SelectFoodPopup from './SelectFoodPopup';

import Button from '../../components/Button';
import { BuyOrder } from '../../data/typedefs';
import { CenterNoticeSwitch } from '../../components/CenterNotice';
import PendingOrderCard from './PendingOrderCard';
import PendingInfoSummary from './PendingInfoSummary';
import { useHeader } from '../Header';

import { gql } from '@apollo/client';
import { useMutation } from '@apollo/react-hooks';
import { toast } from 'react-toastify';
import "./style.scss";

const ADD_ORDERS = gql`
    mutation buyFoods($orders: [BuyOrder]!) {
        buyFood(buyOrders: $orders) @client {
            id
        }
    }
`;

const BuyPage: React.FC = () => {
    const [ openSelectPopup, setOpenSelectPopup] = React.useState(false);
    const [ pendingBuyOrders, setPendingBuyOrders ] = React.useState([] as BuyOrder[]);
    const [ hasJustBought, setHasJustBought] = React.useState(false);
    const { setNavOptions } = useHeader();
    React.useEffect(() => {
        setNavOptions({
            title: "Purchase Food",
            navButtons: [
                {
                    iconName: "add",
                    onClick: () => setOpenSelectPopup(true)
                }
            ]
        });
    }, [setNavOptions]);

    const [ buyFoodFunc ] = useMutation(ADD_ORDERS);

    // handler of the final buy button
    const onSubmitBuyOrders = () => {
        buyFoodFunc({
            variables: { orders: pendingBuyOrders}
        });
        toast.success("Items bought", {
            autoClose: 1000,
            onOpen: () => {
                setHasJustBought(true);
            },
            onClose: () => {
                setOpenSelectPopup(false);
                setPendingBuyOrders([]);
                setHasJustBought(false);
            }
        });
    };

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
                    <>
                        <div className="BuyPage-PendingItemContainers">
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
                        </div>
                        {
                            !openSelectPopup && (
                                <PendingInfoSummary orders={pendingBuyOrders} />
                            )
                        }
                        <Button 
                            disabled={pendingBuyOrders.length === 0 || hasJustBought} 
                            title="Buy" color="info" icon="shopping_cart" 
                            onClick={onSubmitBuyOrders} 
                        />
                    </>
                </CenterNoticeSwitch>
            </div>
            
        </>
    );
}

export default BuyPage;