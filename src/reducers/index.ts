import { createStore, Reducer } from 'redux';
import { Food, FoodContainer, Price } from '../data/types';

export type State = {
    foods: Array<Food>,
};

export type ActionTypes = "ADD_FOOD"
    | "BUY_FOOD"
    | "CONSUME_FOOD";

export type Action = {
    type: ActionTypes,
    data: Food | BuyFoodOrder
}

export type BuyFoodOrder = {
    foodID: string,
    quantity: number,
    price: Price,
    expiryDate?: Date
}

const initialState: State = { 
    foods: [] 
};

const rootReducers: Reducer<State, Action> = (state: State = initialState, action: Action) => {
    switch(action.type) {
        case "ADD_FOOD":
            const newFood = action.data as Food;
            console.log('adding food');
            console.log(newFood);
            return {...state, foods: [...state.foods, newFood]};
        case "BUY_FOOD":
            const { foodID, quantity, price, expiryDate } = action.data as BuyFoodOrder;
            const newState = {...state};
            const food = newState.foods.find(food => food.id === foodID);

            if(!food) return state;
            food.buy(quantity, price, expiryDate);

            return newState;
        case "CONSUME_FOOD":

        default: return state;
    }
}

export default createStore(rootReducers);