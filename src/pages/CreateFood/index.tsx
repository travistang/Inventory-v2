import React from 'react';
import { RawUnit, Food } from '../../data/typedefs';
import { toast } from 'react-toastify';
import { withHeader } from '../Header';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useHistory } from 'react-router';
import Input from '../../components/Input';
import Button from '../../components/Button';

import "../../components/Form/style.scss";

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

type FormType = {
    name: string;
    unit: string | null;
    stockLevel: number | null;
};

export const initialFormValue: FormType = {
    name: '',
    unit: null,
    stockLevel: null
};

export const isFormValid = (form: FormType, foods: Food[] | undefined) => (
    !!form.name 
        && (foods?.filter(({ name } : { name: string }) => name.toLowerCase() !== form.name.toLowerCase()))
        && (!!form.unit)
        && (!form.stockLevel || !(form.stockLevel < 0))
);

const CreateFoodPage: React.FC = () => {
    const [ form, setForm ] = React.useState({
        name: '',
        unit: null,
        stockLevel: null
    } as FormType);

    const setFormValue = (fieldName : string, value: any) => setForm({
        ...form,
        [fieldName]: value
    });

    const history = useHistory();

    const { data } = useQuery(GET_FOOD_NAMES_QUERY);
    const [updateFoodFunc] = useMutation(ADD_FOOD_QUERY);

        const onAddFood = async () => {
        await updateFoodFunc({
            variables: {
                ...form
            }
        })
        
        toast.success("Food Added.", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1000,
            onClose: () => history.goBack()
        });
    }

    return (
        <div className="Form">
            <div className="Form-Row">
                <div className="Form-Col">
                    <Input 
                        name="name" 
                        placeholder="name" 
                        iconName="edit"
                        value={form.name}
                        onChange={setFormValue.bind(null, "name")}
                    />
                </div>
            </div>
            <div className="Form-Row">
                <div className="Form-Col" style={{ flex: 4 }}>
                    <Input 
                        name="unit" 
                        type="select" options={Object.values(RawUnit)}
                        placeholder="Unit" 
                        value={form.unit}
                        onChange={setFormValue.bind(null, "unit")}
                    />
                </div>
            </div>
            <div className="Form-Row">
                <div className="Form-Col">
                    <Input 
                        name="stockLevel" type="number"
                        placeholder={`Stock Level ${ form.unit ? `(in ${form.unit})` : ''}`} 
                        iconName="edit"
                        value={form.stockLevel}
                        onChange={setFormValue.bind(null, "stockLevel")}
                    />
                </div>
            </div>
            <div style={{flex : 1}} />
            <Button color="info" 
                title="Add Food"
                icon="add"
                disabled={!isFormValid(form, data?.foods)}
                className="From-Submit"
                onClick={onAddFood}
            />
        </div>
    )
};

export default withHeader(CreateFoodPage, {
    title: "Add Food",
    withBackButton: true
});