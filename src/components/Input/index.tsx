import React from 'react';
import {Icon} from '@material-ui/core';
import "./style.scss";

export type InputConfigProps = {
    type?: "text" | "number",
    iconName?: string,
    placeholder?: string,
    [key: string]: any,
}

export type InputProps = InputConfigProps & {
    value: string | number,
    onChange: (value: string) => void,
    
}

const Input: React.FC<InputProps> = ({
    onChange, value, 
    type = "text",
    placeholder,
    className,
    iconName,
    ...props
}) => (
    <div className="Input">
        { iconName && <Icon>{iconName} </Icon>}
        <input
            {...props}
            className={`Input Input-Inner ${className || ""}`}
            placeholder={placeholder}
            onChange={e => onChange(e.target.value)}
            type={type}
            value={value}
        />
    </div>
)

export default Input;