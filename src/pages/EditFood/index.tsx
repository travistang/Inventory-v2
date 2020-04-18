import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { RawUnit } from '../../data/typedefs';
import { initialFormValue, isFormValid } from '../CreateFood';
import { withHeader } from '../Header';
import { toast } from 'react-toastify';
import Routes from '../../routes';
import Input from '../../components/Input';
import Button from '../../components/Button';

import "../../components/Form/style.scss";

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

    const [ form, setForm ] = React.useState(initialFormValue);
    const setFormValue = (fieldName : string, value: any) => setForm({
        ...form,
        [fieldName]: value
    });
    
    const history  = useHistory();
    const location = useLocation();

    const originalFoodName = new URLSearchParams(location.search).get('food');
    const { loading, data } = useQuery(FOOD_LIST, {
        variables: {
            editingFood: originalFoodName
        },
        onCompleted: (data) => {
            setForm(data.food);
        }
    });
    
    const [ editFoodMutation ]  = useMutation(EDIT_FOOD);
    const onEditFood = async () => {
        await editFoodMutation({
            variables: {
                originalName: originalFoodName,
                food: form
            }
        });

        toast.success("Info updated", {
            autoClose: 1000,
            onClose: () => {
                history.push(Routes.FOOD_LIST);
            }
        });
    }

    if(loading) return null;
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
                onClick={onEditFood}
            />
        </div>
    );
};

export default withHeader(EditFoodPage, {
    title: "Edit Food Info",
    withBackButton: true
});