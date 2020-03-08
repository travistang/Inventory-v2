import React from 'react';
import { useHeader } from '../Header';
import { CenterNoticeSwitch } from '../../components/CenterNotice';
import Button from '../../components/Button';
import SelectFoodPopup, { PendingConsumeOrder } from './SelectFoodPopup';
import PendingConsumptionCard from './PendingConsumptionCard';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/react-hooks';
import { toast } from 'react-toastify';
import "./style.scss";

const CONSUME_ORDERS = gql`
    mutation consumeFoods($orders: [ConsumeOrder]!) {
        consumeFoods(consumeOrders: $orders) @client {
            id
        }
    }
`;

const ConsumePage: React.FC = () => {
    const [ openSelectPopup, setOpenSelectPopup ] = React.useState(false);
    const [ submitConsumeOrders ] = useMutation(CONSUME_ORDERS);
    const [ 
        pendingConsumeOrders, 
        setPendingConsumeOrders 
    ] = React.useState([] as PendingConsumeOrder[]);

    const [hasJustConsumed, setHasJustConsumed] = React.useState(false);

    const { setNavOptions } = useHeader();

    React.useEffect(() => {
        setNavOptions({
            title: "Consume Food",
            navButtons: [{
                iconName: "add",
                onClick: () => setOpenSelectPopup(true)
            }]
        });
    }, []);
    return (
        <>
            <SelectFoodPopup 
                open={openSelectPopup}
                requestClose={() => setOpenSelectPopup(false)}
                onConsumeOrderAdded={(order) => setPendingConsumeOrders([
                    ...pendingConsumeOrders,
                    order
                ])}
            />
            <CenterNoticeSwitch 
                watch={pendingConsumeOrders}
                iconName="whatshot"
                title="No Items added"
                subtitle="Use the '+' button above to add containers to consume."
            >
                <>
                    <div className="PendingConsumption-Container">
                        {
                            pendingConsumeOrders.map(
                                (order, i) => (
                                    <PendingConsumptionCard 
                                        {...order}
                                        onRemove={() => setPendingConsumeOrders(
                                            pendingConsumeOrders.filter((_, j) => i !== j)
                                        )}
                                    />
                                )
                            )
                        }
                    </div>
                    <Button color="info"
                        onClick={() => {
                            submitConsumeOrders({
                                variables: {
                                    orders: pendingConsumeOrders.map(order => ({
                                        __typename: "ConsumeOrder",
                                        containerID: order.container.id,
                                        amount: order.amount
                                    }))
                                }
                            });
                            toast.success("Records saved...", {
                                autoClose: 1000,
                                onOpen: () => {
                                    setHasJustConsumed(true);
                                },
                                onClose: () => {
                                    // reset the form
                                    setPendingConsumeOrders([]);
                                    setHasJustConsumed(false);
                                }
                            });
                        }}
                        disabled={pendingConsumeOrders.length === 0 || hasJustConsumed}
                        title="Consume" icon="whatshot" 
                    />
                </>
            </CenterNoticeSwitch>
        </>
    );
}

export default ConsumePage;