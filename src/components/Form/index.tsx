import React from 'react';
import { shallowEqual, useSelector } from 'react-redux'
import {Icon} from '@material-ui/core';
import { State } from '../../reducers';
import Input, { InputConfigProps, SelectConfigProps, ValueTypes, InputTypes } from '../Input';
import './style.scss';

// The representation of the form value as JSON
export type FormValueType = {[key: string]: ValueTypes};

// the config object shape
type BasicLayoutConfig = InputConfigProps & {
    label?: string,
    flex?: number,
};

// type for the select configs.
type SelectFormLayoutConfig = BasicLayoutConfig & SelectConfigProps;

// the combined type
type FormLayoutConfig = BasicLayoutConfig | SelectFormLayoutConfig;

// the entire layout. The first array stores rows. Each row stores columns.
export type FormLayout = FormLayoutConfig[][] | ((store: State) => FormLayoutConfig[][]);

//  Type of the props passed to the <Form> Component
type FormProps = {
    // connect
    initialValue?: FormValueType,
    layout: FormLayout,
    submitIconName?: string,
    submitButtonText: string,
    onSubmit?: (form: FormValueType) => void;
}

const FormComponent: React.FC<FormProps> = ({
    initialValue: customInitialValue,
    layout : layoutOrLayoutFunc, submitIconName, submitButtonText,
    onSubmit
}) => {

    // see if the incoming layout is a function
    // if it is then pass it to the store ( for validation). Otherwise use it as-is
    const state  = useSelector(state => state, shallowEqual) as State;
    const layout = (typeof layoutOrLayoutFunc === 'function') ? layoutOrLayoutFunc(state) : layoutOrLayoutFunc;
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
    
    const isAllFieldsValid = !allFields.some(({name, required, validate}) => (
        (required && !form[name]) || (validate && !validate(form[name]))
    ));

    // functions for manipulating form states
    const setField = (field: string, value: ValueTypes) => {
        setForm({...form, [field]: value});
    };

    const inputFieldProps = (field: string) => ({
        value: form[field],
        onChange: (v: ValueTypes) => setField(field, v)
    });

    return (
        <>
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
                <div onClick={(onSubmit && (isAllFieldsValid || undefined)) && (() => onSubmit(form))}
                    className={`Form-Submit ${!isAllFieldsValid? "Form-Submit-Invalid" : ""}`}
                >
                    {submitIconName && <Icon>{submitIconName}</Icon>}
                    {submitButtonText}
                </div>
            </div>
        </>
    )

};

export default FormComponent;