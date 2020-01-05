import React from 'react';
import FoodCard from './foodCard';
import { withHeader } from '../Header';
import history from '../../history';
import { Food, Price } from "../../data/types";
import { State } from '../../reducers';
import { connect, MapStateToProps } from 'react-redux';
import SearchList from '../../components/SearchList';
import { CenterNoticeSwitch } from '../../components/CenterNotice';
import Routes from '../../routes';

type FoodPageProps = {
    foods: Array<Food>
}


const mapStateToProps:MapStateToProps<FoodPageProps, FoodPageProps, State> = state => ({
    foods: state.foods
})

const FoodPage: React.FC<FoodPageProps> = ({
    foods
}) => {
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
                renderItem={food => <FoodCard food={food as Food} />}
            >

            </SearchList>
        </CenterNoticeSwitch>
    );
}

const FoodPageWithHeader = withHeader(FoodPage, {
    title: "Food",
    navButtons: [
        {iconName: "add", onClick: () => history.push(Routes.FOOD_ADD)}
    ]
});

export default connect(mapStateToProps, null)(FoodPageWithHeader);

