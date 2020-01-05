import React from 'react';
import { useDispatch } from 'react-redux';
import { Food, RawUnit, Unit } from '../../data/types';
import { withHeader } from '../Header';
import withInfoAndRedirect, {ToastInfoAndRedirectConfig} from '../../components/withInfoAndRedirect';
import Form, { FormLayout, FormValueType } from '../../components/Form';
import { State } from '../../reducers';
import Route from '../../routes';

export const formLayout: FormLayout = ({ foods } : State) =>  [
    [{  label: 'Food Name',
        name: "name", placeholder: "Name", iconName: "edit", required: true,
        // check if a food with same name exists
        validate: newName => !foods.find(
            ({name}) => (typeof newName === 'string') && (newName.toString().toLowerCase() === name.toLowerCase())
        )
    }],
    [{  label: 'Unit',
        name: "unit", placeholder: "- Select Unit -", iconName: "fitness_center",
        type: "select", required: true, options: Object.values(RawUnit),
        flex: 8,
    }, { 
        label: 'Date to open',
        name: "dateToUseAfterOpen", type: "number", flex: 4,
        validate: num => num === null || num === undefined || num === "" || num > 0 
    }]

];

type CreateFoodPageProps = ToastInfoAndRedirectConfig;
const CreateFoodPage: React.FC<CreateFoodPageProps> = ({
    // ToastInfoAndRedirectConfig
    showToastAndRedirect, 
}) => {

    const dispatch = useDispatch();
    const addFood = (food: Food) => dispatch({
        type: "ADD_FOOD",
        data: food
    });

    const onAddFood = (form: FormValueType) => {
        const food = new Food(
            form.name as string, 
            form.unit as Unit, 
            form.dateToUseAfterOpen ? form.dateToUseAfterOpen as number : null
        );

        addFood(food);
        showToastAndRedirect({
            message: "Food added.",
            iconName: "info",
            color: 'green'
        }, Route.FOOD_LIST, 2000);
    }
    
    return (
            <Form
                submitButtonText="Add Food" 
                onSubmit={onAddFood}
                layout={formLayout} 
            />
    )
};

const CreateFoodPageWithHeader = withHeader(CreateFoodPage, {
    title: "Add Food",
    withBackButton: true
});

export default withInfoAndRedirect(CreateFoodPageWithHeader);