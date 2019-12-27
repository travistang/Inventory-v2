import React from 'react';
import { Food } from "../../data/types";
import "./style.scss";

type FoodCardProps = {
    food: Food
}

const FoodCard: React.FC<FoodCardProps> = ({
    food
}) => {
    return (
        <div className="FoodCard">
            <div className="FoodCard-Upper">
                {food.name}
            </div>
            <div className="FoodCard-LowerContainer">
                <div className="FoodCard-LowerDescription">
                    {food.containers.length} container(s)
                </div>
                <div
                    className="FoodCard-Lower">
                    {food.totalAmount()} {food.unit}
                </div>
            </div>
        </div>
    )
}

export default FoodCard;