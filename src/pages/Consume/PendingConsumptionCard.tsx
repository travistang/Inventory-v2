import React from 'react';
import { Icon } from '@material-ui/core';
import GenericCard from '../../components/GenericCard';
import PercentageBar from '../../components/PercentageBar';
import { Food, FoodContainer } from '../../data/typedefs';
import { PendingConsumeOrder } from './SelectFoodPopup';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/react-hooks';

const UNIT_QUERY = gql`
    query getUnit($food: String!) {
        food(name: $food) @client {
            unit
        }
    }
`;
type PendingConsumptionCardProps = PendingConsumeOrder & {
    onRemove: () => void
};

const PendingConsumptionCard: React.FC<PendingConsumptionCardProps> = ({
    food, container, amount, onRemove
}) => {
    const { loading, error, data, refetch } = useQuery(UNIT_QUERY);
    
    React.useEffect(() => {
        refetch({ food });
    }, [food]);

    if (loading) {
        return null;
    }

    if (error) {
        alert(error.message);
        return null;
    }

    const { unit } : { unit: string } = data.food;
    const RightComponent = (
        <div className="PendingConsumptionCard-Right">
            -{ amount } { unit }
        </div>
    );
    const originalPercentage = parseFloat(
        ((container.amount / container.capacity) * 100).toFixed(2)
    );

    const consumedPercentage = parseFloat(
        (amount / container.capacity * 100).toFixed(2)
    );
    const AuxComponent = (
        <div className="PendingConsumptionCard-SmallComponent">
            <div>
                {originalPercentage}% <Icon>arrow_right</Icon> {originalPercentage - consumedPercentage}%
            </div>
            <PercentageBar 
                color="orange"
                percentageLeft={originalPercentage}
                percentageDifference={consumedPercentage} 
            />
            {
                (originalPercentage - consumedPercentage) < 1 && (
                    <div className="PendingConsumptionCard-DisposeLabel">
                        To be disposed
                    </div>
                )
            }
        </div>
    );

    return (
        <GenericCard 
            mainText={food}
            rightComponent={RightComponent}
            smallComponent={AuxComponent}
            actionButton={{
                iconName: "highlight_off",
                onClick: onRemove
            }}
        />
    );
};

export default PendingConsumptionCard;