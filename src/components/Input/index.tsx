import React from 'react';
import {Icon} from '@material-ui/core';
import "./style.scss";

export type InputTypes = "text" | "textarea" | "number" | "date" | "select";
export type ValueTypes = string | number | Date | null;

export type InputConfigProps = {
    name: string;
    label?: string;
    type?: InputTypes;
    iconName?: string;
    placeholder?: string;
    required?: boolean;
    validate?: (value: ValueTypes) => boolean;
    className?: string;
}

export type SelectConfigProps = {
    options: ValueTypes[];
    multiple?: boolean;
}

export type InputProps = InputConfigProps & {
    value: ValueTypes,
    onChange: (value: ValueTypes) => void,
}

const Input: React.FC<InputProps> = ({
    onChange: rawOnChange, value,
    // validation props
    required = false, validate = () => true,
    name,
    label,
    type = "text",
    placeholder,
    className,
    iconName,
    ...props
}) => {
    
    // TODO: Isolate validation component
    const [ isValid, setIsValid ] = React.useState(validate(value));
    // on change armed with validation
    const onChange = (value: ValueTypes) => {
        if((required && !value) || !validate(value)) {
            setIsValid(false);
        } else { 
            setIsValid(true);
        }
        rawOnChange(value);
    }

    const valueToDisplay: (value: ValueTypes) => string | number = value => {
        if (value instanceof Date) {
            return value.toLocaleString('en-US');
        } else {
            return value ? value: "";
        }
    }

    const finalClassNameOuter = `Input  ${!isValid ? "Invalid" : ""}`;
    const finalClassName = `Input-Inner ${className || ""}`;
    switch(type) {
        /**
         * 
         *  The Select Field
         * 
         */
        case "select":
            if(!(props as SelectConfigProps)) {
                throw new Error("Input field is `select` but not options provided.");
            }
            const { options, multiple = false, ...otherProps } = props as SelectConfigProps;
            return (
                <>
                    {label && <p>{label}</p>}
                    <div className={finalClassNameOuter}>
                        { iconName && <Icon>{iconName} </Icon>}
                        <select
                            multiple={multiple}
                            name={name}
                            {...otherProps}
                            className={finalClassName}
                            onChange={e => onChange(e.target.value)}
                            value={valueToDisplay(value)}
                        >
                            {placeholder && 
                                <option value="" selected={value === ""}>{placeholder}</option>
                            }
                            {
                                options.map(opt => (
                                    <option
                                        selected={opt === value}>
                                        {opt}
                                    </option>
                                ))
                            }
                        </select>
                        <Icon>expand_more</Icon>
                    </div>
                </>
            )
        /**
         * 
         *  The General Input Field
         * 
         */
        default:
            return (
                <>
                    {label && <p>{label}</p>}
                    <div className={finalClassNameOuter}>
                        { iconName && <Icon>{iconName} </Icon>}
                        <input
                            name={name}
                            {...props}
                            className={finalClassName}
                            placeholder={placeholder}
                            onChange={e => onChange(e.target.value)}
                            type={type}
                            value={valueToDisplay(value)}
                        />
                    </div>
                </>
            )
    }
}

export default Input;