import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { Food } from "../../data/types";
import Routes from '../../routes';
import "./style.scss";

type FoodCardProps = {
    food: Food
}

const FoodCard: React.FC<FoodCardProps & RouteComponentProps<any>> = ({
    food, history
}) => {
    const toFoodDetailPage = () => {
        history.push(Routes.FOOD_DETAILS, { food })
    }

    return (
        <div className="FoodCard" onClick={toFoodDetailPage}>
            <div className="FoodCard-Upper">
                {food.name}
            </div>
            <div className="FoodCard-LowerContainer">
                <div className="FoodCard-LowerDescription">
                    In {food.containers.length} container(s)
                </div>
                <div
                    className="FoodCard-Lower">
                    {food.totalAmount()} {food.unit}
                </div>
            </div>
        </div>
    )
}

export default withRouter(FoodCard);