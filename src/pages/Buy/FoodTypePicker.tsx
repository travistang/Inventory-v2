import React from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/react-hooks';
import CenterNotice from '../../components/CenterNotice';
import FoodCard from '../../components/FoodCard';

const GET_FOOD_LIST = gql`
    query {
        foods @client {
            name
            unit
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
    info: {
        totalAmount: number,
        numberOfContainers: number
    }
};

type FoodTypePickerProps = {
    onFoodSelected: (food: string) => void
};
const FoodTypePicker: React.FC<FoodTypePickerProps> = ({
    onFoodSelected
}) => {

    const { loading, error, data } = useQuery(GET_FOOD_LIST);
    
    if (loading) {
        return (
            <CenterNotice iconName="hamburger" title="Loading Food List..." />
        )
    } else if (error) {
        alert(error.message);
        return null;
    }

    const foodOptions = data.foods as QueryResultType[];
    return (
        <div className="FoodTypePicker-Container">
            {
                foodOptions.map(food => (
                    <FoodCard {...food} onClick={() => onFoodSelected(food.name)} />
                ))
            }
        </div>
    )
};

export default FoodTypePicker;