import React from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/react-hooks';
import { FoodContainer, Price } from '../../data/typedefs';
import ContainerCard from '../../components/ContainerCard';
import FoodCard from '../../components/FoodCard';
import Button from '../../components/Button';
import AmountInput from './AmountInput';
import StickyBox from 'react-sticky-box';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CONTAINER_QUERY = gql`
    query getContainersForFood($food: String!) {
        food(name: $food) @client {
            name
            unit
            info {
                totalAmount
                numberOfContainers
            }

            containers {
                id
                capacity
                amount
                datePurchased
                expiryDate
                dateOpened
                price

                opened
                expired
                percentageLeft
            }
        }
    }
`;

type QueryResultType = {
    // FoodCard props
    name: string,
    unit: string,
    info: {
        totalAmount: number,
        numberOfContainers: number
    },

    // Containers list props
    containers: [{
        id: string;
        capacity: number;
        amount: number;
        datePurchased: Date;
        expiryDate?: Date;
        dateOpened?: Date;
        price: Price;

        opened: boolean;
        expired: boolean;
        percentageLeft: number;
    }]
};

type ContainerPickerProps = {
    food: string | null;
    onToPreviousPage: () => void;
    onSelectContainer: (container: FoodContainer, amount: number) => void;
};

const ContainerPicker: React.FC<ContainerPickerProps> = ({
    food: foodName, onSelectContainer, onToPreviousPage
}) => {
    
    const { loading, error, data, refetch } = useQuery(CONTAINER_QUERY, {
        variables: {
            food: foodName
        }
    });

    const [containerInd, setContainerInd] = React.useState(0);
    const [amountUsed, setAmountUsed] = React.useState(0);

    React.useEffect(() => {
        if (foodName) {
            refetch({
                food: foodName
            });
        }
        setContainerInd(0);
    }, [foodName]);

    if (loading) {
        return null;
    }

    if (error) {
        alert(error.message);
        return null;
    }

    const food = data.food as QueryResultType;

    const {
        name, unit, containers, info
    } = food;

    const selectedContainer = containers[containerInd];

    const onConfirmInfo = () => {
        onSelectContainer(selectedContainer, amountUsed);
    };

    const isAmountValid = () => {
        if(!selectedContainer) return false;
        return amountUsed > 0 && amountUsed <= selectedContainer.amount;
    }

    return (
        <div className="ContainerPicker-Container">
            <StickyBox offsetTop={-8}>
                <div style={{paddingTop: 8}}>
                    Selecting containers for:
                    <FoodCard 
                        name={name} unit={unit} 
                        containers={containers as unknown as FoodContainer[]} 
                        info={info} />
                </div>
            </StickyBox>
            Container #{containerInd + 1} of {containers.length}
            <div style={{paddingLeft: 24, paddingRight: 24}}>
                <Slider dots infinite={false} 
                    afterChange={containerId => setContainerInd(containerId)}>
                    {
                        food.containers.map(
                            (container, i) => (<ContainerCard
                                key={i} 
                                container={container} 
                                unit={food.unit} 
                            />)
                        )
                    }
                </Slider>
            </div> 
            <div className="ContainerPicker-AmountInputContainer">
                {
                    selectedContainer && (
                        <AmountInput
                            unit={food.unit}
                            amount={selectedContainer.amount} 
                            capacity={selectedContainer.capacity}
                            onAmountChosen={amount => setAmountUsed(amount)}
                        />
                    )
                }
            </div>
            <div className="ContainerPicker-ButtonRow">
                <Button title="Previous" icon="refresh" color="secondary"
                    onClick={onToPreviousPage} 
                />
                <Button title="Confirm"  icon="check" 
                    color="info"
                    disabled={!isAmountValid()}
                    onClick={onConfirmInfo}
                />
            </div>
        </div>
    );
    
}

export default ContainerPicker;