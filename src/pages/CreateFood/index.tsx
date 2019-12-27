import React from 'react';
import { Dispatch } from 'redux';
import { connect, MapDispatchToProps } from 'react-redux';
import { Food } from '../../data/types';
import { withHeader } from '../Header';
import { ActionTypes, Action } from '../../reducers';

const mapDispatchToProps = (dispatch: Dispatch) => ({
    addFood: (food: Food) => dispatch({
        type: "ADD_FOOD",
        data: food
    })
});

const CreateFoodPage: React.FC = () => {
    return (
        <div className="Page">
            create food here
        </div>
    )
};

const CreateFoodPageWithHeader = withHeader(CreateFoodPage, {
    title: "Add Food",
    withBackButton: true
});

export default connect(null, mapDispatchToProps)(CreateFoodPageWithHeader);