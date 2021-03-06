import React from 'react';
import { History, Location } from 'history';
import { RawUnit } from '../../data/typedefs';
import { toast } from 'react-toastify';
import { withHeader } from '../Header';
import Form, { FormLayout, FormValueType } from '../../components/Form';
import { State } from '../../reducers';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/react-hooks';
import { useHistory } from 'react-router';

const ADD_FOOD_QUERY = gql`
    mutation addFood($name: String!, $unit: Unit!) {
        addFood(name: $name, unit: $unit) @client {
            id
            name
        }
    }
`;

// const GET_FOOD_NAMES_QUERY = gql`
//     query {
//         foods @client {
//             name
//         }
//     }
// `;

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
                return true;
            }
        )
    }],
    [{
        label: "Unit",
        name: "unit", placeholder: "Unit", required: true,
        flex: 4, type: "select",
        options: Object.values(RawUnit)
    }],
    [{
        label: "Expected Stock Level", type: "number",
        name: "stockLevel", placeholder: "Stock level",
        validate: v => v === null || v >= 0
    }]
];

const CreateFoodPage: React.FC = () => {
    const history = useHistory();
    
    const  [updateFoodFunc] = useMutation(ADD_FOOD_QUERY);


    const onAddFood = async (form: FormValueType) => {
        await updateFoodFunc({
            variables: {
                name: form.name,
                unit: form.unit
            }
        })
        
        toast.success("Food Added.", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1000,
            onClose: () => history.goBack()
        });
    }

    return (
        <Form
            submitButtonText="Add Food"
            submitIconName="add"
            onSubmit={onAddFood}
            layout={formLayout} 
        />
    )
};

export default withHeader(CreateFoodPage, {
    title: "Add Food",
    withBackButton: true
});