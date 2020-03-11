import React from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/react-hooks';
import CenterNotice, { CenterNoticeSwitch} from '../CenterNotice';
import FoodCard from '../FoodCard';
import { FoodContainer } from '../../data/typedefs';
import SearchList from "../../components/SearchList";
import "./style.scss";

const GET_FOOD_LIST = gql`
    query {
        foods @client {
            name
            unit
            containers {
                expiryDate
                dateOpened
            }
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
    containers: FoodContainer[],
    info: {
        totalAmount: number,
        numberOfContainers: number
    }
};

type FoodTypePickerProps = {
    onFoodSelected: (food: string) => void
    filterFood?: (food: QueryResultType) => boolean
};
const FoodTypePicker: React.FC<FoodTypePickerProps> = ({
    onFoodSelected, filterFood
}) => {

    const { loading, error, data, refetch } = useQuery(GET_FOOD_LIST);
    
    React.useEffect(() => {
        refetch();
    }, [onFoodSelected, refetch]);
    
    if (loading) {
        return (
            <CenterNotice iconName="hamburger" title="Loading Food List..." />
        )
    } else if (error) {
        alert(error.message);
        return null;
    }

    const foodOptions = data.foods as QueryResultType[];
    const finalOptions = filterFood ? 
        foodOptions.filter(filterFood) 
        : foodOptions;
    
    return (
        <div className="FoodTypePicker-Container">
            <CenterNoticeSwitch 
                watch={finalOptions} 
                iconName="hamburger" title="No food available"
                subtitle="Add some food or buy some containers for them and try again."
            >
                <SearchList list={finalOptions}
                    filterFunc={
                        (food, text) => food.name.toLowerCase().includes(text.toLowerCase())
                    }
                    inputConfig={{
                        name: "FoodSearchInput",
                        iconName: "search",
                        placeholder: "Search for food..."
                    }}
                    minimumSearchLength={1}
                    renderItem={food => (
                        <FoodCard {...food} onClick={() => onFoodSelected(food.name)} />
                    )}
                />
            </CenterNoticeSwitch>
        </div>
    )
};

export default FoodTypePicker;