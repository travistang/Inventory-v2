import React from 'react';
import FoodCard from '../../components/FoodCard';
import { withHeader } from '../Header';
import { useLocation } from 'react-router-dom';
import history from '../../history';
import { Food } from '../../data/typedefs';
import SearchList from '../../components/SearchList';
import { CenterNoticeSwitch } from '../../components/CenterNotice';
import Routes from '../../routes';
import { useQuery } from '@apollo/react-hooks';
import { gql } from '@apollo/client';

type FoodPageProps = {
    foods: Array<Food>
}

const QUERY = gql`
    {
        foods @client {
            name
            unit
            containers {
                expiryDate
                dateOpened
            }
            info {
                numberOfContainers
                totalAmount
            }
        }
    }
`;


const FoodPage: React.FC<FoodPageProps> = () => {
    const { loading, error, data, refetch } = useQuery(QUERY);
    // the current query, mostly is ?page=...
    const currentQuery = useLocation().search;

    React.useEffect(() => {
        refetch()
    }, [window.location.pathname]);

    if (error) {
        alert(error.message);
        return null;
    }
    if(loading) {
        return <div> loading...</div>
    }

    
    const foods = data.foods as Food[];


    return (
        <CenterNoticeSwitch watch={foods}
            iconName="fastfood"
            title="No food is added"
            subtitle="click the '+' button to add a new type of food"
        >
            <SearchList
                list={foods}
                filterFunc={
                    (food, text) => (food as Food).name.toLowerCase().includes(text.toLowerCase())
                }
                inputConfig={{
                    name: "FoodSearchInput",
                    iconName: "search",
                    placeholder: "Search for food..."
                }}
                minimumSearchLength={2}
                renderItem={food => (
                    <FoodCard {...food} 
                        onClick={() => history.replace(
                            Routes.FOOD_DETAILS + `&food=${food.name}`
                        )}
                    />
                )}
            >

            </SearchList>
        </CenterNoticeSwitch>
    );
}


export default withHeader(FoodPage, {
    title: "Food",
    navButtons: [
        {iconName: "add", onClick: () => history.push(Routes.FOOD_ADD)}
    ]
});

