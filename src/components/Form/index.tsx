import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory , useLocation } from 'react-router';
import { History, Location } from 'history';
import {Icon} from '@material-ui/core';
import { State } from '../../reducers';
import Button from '../Button';
import Input, { InputConfigProps, SelectConfigProps, ValueTypes, InputTypes } from '../Input';
import './style.scss';

// The representation of the form value as JSON
export type FormValueType = {[key: string]: ValueTypes};

// the config object shape
type BasicLayoutConfig = InputConfigProps & {
    label?: string,
    flex?: number,
    inputStyle?: "default" | "outlined"
};


// the combined type
type SelectInputConfig = BasicLayoutConfig & SelectConfigProps;
type FormLayoutConfig = BasicLayoutConfig | SelectInputConfig;

// the entire layout. The first array stores rows. Each row stores columns.
export type FormLayout = FormLayoutConfig[][] 
    | ((
        store:          State, 
        history:        History<any>, 
        location:       Location<any>,
        initialValues?: FormValueType) => FormLayoutConfig[][]);

//  Type of the props passed to the <Form> Component
type FormProps = {
    // connect
    initialValue?: FormValueType,
    layout: FormLayout,
    submitIconName?: string,
    submitButtonText?: string,
    onSubmit?: (form: FormValueType) => void,
    withSubmitButton?: boolean,
    disabledFields?: (form: FormValueType) => string[],
    setFormValue?: (form: FormValueType) => void
}

const FormComponent: React.FC<FormProps> = ({
    initialValue: customInitialValue,
    layout : layoutOrLayoutFunc, 
    submitIconName, submitButtonText,
    onSubmit,
    withSubmitButton = true,
    disabledFields,
    setFormValue
}) => {

    // see if the incoming layout is a function
    // if it is then pass it to the store ( for validation). Otherwise use it as-is
    const state  = useSelector(state => state, shallowEqual) as State;
    const history = useHistory();
    const location = useLocation();
    
    const layout = (typeof layoutOrLayoutFunc === 'function') 
        ? layoutOrLayoutFunc(state, history, location, customInitialValue) 
        : layoutOrLayoutFunc;
    
    // flatten all fields for easier manipulations
    const allFields = [...layout.reduce((layouts, row) => [...layouts, ...row], [])];
    // the initial values of the form
    // if the type is number, then the value would be 0. otherwise empty string
    const initialValues = customInitialValue || Object.assign({}, 
        ...allFields.map(({name, type, required}) => {
            if (!required) return null;
            switch(type) {
                case "number":
                    return { [name]: 0 }
                case "date":
                    return { [name]: new Date() }
                default:
                    return { [name]: "" }
            }
        })
    );
    
    // the form state 
    const [form, setForm] = React.useState(initialValues);
    
    React.useEffect(() => {
        setFormValue && setFormValue(form);
    }, [form, setFormValue]);


    const isAllFieldsValid = !allFields.some(({name, required, validate}) => (
        (required && !form[name]) || (validate && !validate(form[name]))
    ));

    // functions for manipulating form states
    const setField = (field: string, value: ValueTypes) => {
        const type = typeof(initialValues[field]);
        // resolve the problem of number fields when empty string is sent to the form
        if (type === 'number') {
            setForm({...form, [field]: parseFloat(value as string) || 0});
        } else {
            setForm({...form, [field]: value});
        }
    };
    
    const allDisabledFieldNames = disabledFields ? disabledFields(form) : [];
    const inputFieldProps = (field: string) => ({
        value: form[field],
        onChange: (v: ValueTypes) => setField(field, v),
        disabled: allDisabledFieldNames.includes(field)
    });

    return (
        <div className="Form">
            {
                // create all the rows
                layout.map(row => (
                    <div className="Form-Row">
                        {
                            // create all the columns
                            row.map(({
                                // here is each of the form config
                                name, 
                                flex = 1, 
                                ...inputConfigProps
                            }) => (
                                <div className="Form-Col" style={{flex}}>
                                    <Input
                                        name={name} 
                                        {...inputConfigProps} 
                                        {...inputFieldProps(name)}
                                    />
                                </div>
                            ))
                        }
                    </div>
                ))
            }
            <div style={{flex: 1}} />
            {
                withSubmitButton && (
                    <Button color="info"
                        title={submitButtonText || "Submit"}
                        icon={submitIconName}
                        onClick={onSubmit && (() => onSubmit(form))}
                        disabled={!isAllFieldsValid}
                        className="Form-Submit"
                    />
                )
            }
        </div>
    )

};

export default FormComponent;