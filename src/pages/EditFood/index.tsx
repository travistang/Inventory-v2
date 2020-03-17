import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { formLayout } from '../CreateFood';
import Form, { FormValueType } from '../../components/Form';
import { withHeader } from '../Header';
import { toast } from 'react-toastify';
import Routes from '../../routes';

const FOOD_LIST = gql`
    query getFoodName($editingFood: String!) {
        foods @client {
            name
        }
        food(name: $editingFood) @client {
            name
            unit
            stockLevel
        }
    }
`;

const EDIT_FOOD = gql`
    mutation editFood($originalName: String!, $food: Food!) {
        editFood(originalName: $originalName, newData: $food) @client {
            name
        }
    }
`;

const EditFoodPage: React.FC = () => {
    const [ showToast, setShowToast ] = React.useState(false);

    const history  = useHistory();
    const location = useLocation();
    const originalFoodName = new URLSearchParams(location.search).get('food');
    const { data: foodListData, loading } = useQuery(FOOD_LIST, {
        variables: {
            editingFood: originalFoodName
        }
    });

    const [ editFoodMutation ]  = useMutation(EDIT_FOOD);
    const onEditFood = async (form: FormValueType) => {
        await editFoodMutation({
            variables: {
                originalName: originalFoodName,
                food: form
            }
        });

        toast.success("Info updated", {
            autoClose: 1000,
            onClose: () => {
                setShowToast(false);
                history.push(Routes.FOOD_LIST);
            }
        });
    }

    if(loading) return null;
    return (
        <Form 
            layout={formLayout}
            initialValue={foodListData?.food}
            onSubmit={onEditFood}
            disableSubmitButton={showToast}
        />
    );
};

export default withHeader(EditFoodPage, {
    title: "Edit Food Info",
    withBackButton: true
});