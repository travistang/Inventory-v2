import React from 'react';
import { useDispatch } from 'react-redux';
import { History, Location } from 'history';
import { Food, RawUnit, Unit } from '../../data/types';
import { withHeader, WithHeaderProps } from '../Header';
import withInfoAndRedirect, {ToastInfoAndRedirectConfig} from '../../components/withInfoAndRedirect';
import Form, { FormLayout, FormValueType } from '../../components/Form';
import { State } from '../../reducers';
import Route from '../../routes';
import { useHistory, useLocation } from 'react-router';
import Routes from '../../routes';

export const formLayout: FormLayout = (
    { foods }:  State, 
    history:    History<any>, 
    location:   Location<any>,
    initialValue?: FormValueType) => [

    [{  label: 'Food Name',
        name: "name", placeholder: "Name", iconName: "edit", required: true,
        // check if a food with same name exists
        validate: newName => !foods.find(
            ({name}) => {
                // things are a bit tricky here 
                /*
                    If the form is for editing,
                    then it is okay to collide with the current name (the 'name') in the initial value.
                    Otherwise this would be creating a new food
                    and the new food should not have a bane colliding with any of the existing food names
                */
                const isEditing = history.location.pathname.startsWith(Routes.FOOD_EDIT);
                if (isEditing && initialValue) {
                    if (initialValue.name?.toString().toLowerCase() === name.toLowerCase()) {
                        return false;
                    }
                }
                return (typeof newName === 'string') && (newName.toString().toLowerCase() === name.toLowerCase())
            }
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

type CreateFoodPageProps = ToastInfoAndRedirectConfig & WithHeaderProps;
const CreateFoodPage: React.FC<CreateFoodPageProps> = ({
    // ToastInfoAndRedirectConfig
    showToastAndRedirect, 
    setHeaderTitle
}) => {
    const history  = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();

    const isEditing = history.location.pathname.startsWith(Routes.FOOD_EDIT);

    React.useEffect(() => {
        if (isEditing) {
            setHeaderTitle("Edit details");
        }
    }, []);

    const initialFormValue: FormValueType | undefined = isEditing ? location.state.food as FormValueType : undefined;

    const formToFood = (form: FormValueType) => new Food(
            form.name as string, 
            form.unit as Unit, 
            form.dateToUseAfterOpen ? form.dateToUseAfterOpen as number : null
        );

    const onEditFood = (form: FormValueType) => {
        const newFood = formToFood(form);
        dispatch({
            type: "EDIT_FOOD",
            data: { foodID: initialFormValue!.id, food: newFood}
        });
        showToastAndRedirect({
            message: "Food added.",
            iconName: "info",
            color: 'green',
            state: {food: {...initialFormValue, ...newFood} as Food}

        }, Route.FOOD_DETAILS, 2000);

    }

    const onAddFood = (form: FormValueType) => {
        const food = formToFood(form);

        dispatch({
            type: "ADD_FOOD",
            data: food
        });
        showToastAndRedirect({
            message: "Food added.",
            iconName: "info",
            color: 'green'
        }, Route.FOOD_LIST, 2000);
    }
    
    const submitButtonText = isEditing ? "Update" : "Add food";
    const onSubmit = isEditing ? onEditFood : onAddFood;

    return (
        <Form
            initialValue={initialFormValue}
            submitButtonText={submitButtonText}
            onSubmit={onSubmit}
            layout={formLayout} 
        />
    )
};

const CreateFoodPageWithHeader = withHeader(CreateFoodPage, {
    title: "Add Food",
    withBackButton: true
});

export default withInfoAndRedirect(CreateFoodPageWithHeader);