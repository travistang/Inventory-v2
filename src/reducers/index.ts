import { createStore, Reducer } from 'redux';
import { Food, FoodContainer, Price } from '../data/types';

export type State = {
    foods: Array<Food>,
};

export type ActionTypes = "ADD_FOOD"
    | "EDIT_FOOD"
    | "BUY_FOOD"
    | "CONSUME_FOOD";


export type Action = {
    type: ActionTypes,
    data: Food | BuyFoodOrder | EditFoodOption
}

export type EditFoodOption = {
    foodID: string,
    food: Food
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
        case "ADD_FOOD": {
            const newFood = action.data as Food;
            return {...state, foods: [...state.foods, newFood]};
        }

        case "BUY_FOOD": {
            const { foodID, quantity, price, expiryDate } = action.data as BuyFoodOrder;
            const newState = {...state};
            const food = newState.foods.find(food => food.id === foodID);

            if(!food) return state;
            food.buy(quantity, price, expiryDate);

            return newState;
        }
        case "EDIT_FOOD": {
            const { foodID, food } = action.data as EditFoodOption;
            const newState = {
                ...state,
                // get all food and map them as-is,
                // except fot the one with the same ID, update the info
                foods: state.foods.map(
                    f => {
                        if (foodID !== f.id) return f;
                        else {
                            f.updateInfo(
                                food.name,
                                food.unit,
                                food.latestTimeToConsumeAfterFirstOpen
                            );
                            return f;
                        }
                    } 
                )
            };
            return newState;
        }

        case "CONSUME_FOOD":
        default: 
            return state;
    }
}

export default createStore(rootReducers);