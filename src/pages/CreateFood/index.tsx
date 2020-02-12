import React from 'react';
import { History, Location } from 'history';
import { RawUnit } from '../../data/typedefs';
import { toast } from 'react-toastify';
import Routes from '../../routes';
import { withHeader } from '../Header';
import Form, { FormLayout, FormValueType } from '../../components/Form';
import { State } from '../../reducers';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useHistory } from 'react-router';

const ADD_FOOD_QUERY = gql`
    mutation addFood($name: String!, $unit: Unit!) {
        addFood(name: $name, unit: $unit) @client {
            id
            name
        }
    }
`;

const GET_FOOD_NAMES_QUERY = gql`
    query {
        foods @client {
            name
        }
    }
`;

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
    }]
];

const CreateFoodPage: React.FC = () => {
    const history = useHistory();
    const { loading: loadingFoodList, error, data } = useQuery(GET_FOOD_NAMES_QUERY);
    
    const  [updateFoodFunc] = useMutation(ADD_FOOD_QUERY);


    const onAddFood = async (form: FormValueType) => {
        await updateFoodFunc({
            variables: {
                name: form.name,
                unit: form.unit
            }
        })
        
        toast("Food Added.", {
            position: toast.POSITION.TOP_CENTER,
            className: "ToastContainer"
        });
        // setTimeout(() => {
        //     history.push(Routes.FOOD_LIST);
        // }, 2000);
    }

    return (
        <Form
            submitButtonText="Add Food"
            onSubmit={onAddFood}
            layout={formLayout} 
        />
    )
};

export default withHeader(CreateFoodPage, {
    title: "Add Food",
    withBackButton: true
});