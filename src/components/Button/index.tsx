import React from 'react';
import { Icon } from '@material-ui/core';
import "./style.scss";

type ButtonProps = {
    title: string,
    icon?: string,
    color?: string,
    onClick?: () => void,
    disabled?: boolean,

    className?: string
};

const Button: React.FC<ButtonProps> = ({
    title, icon, 
    color = "primary",
    onClick,
    disabled = false,
    className
}) => {
    return (
        <div
            className={`${className} Button Button-${color} ${disabled? "Button-Disabled":""}`} 
            onClick={!disabled ? onClick: undefined}>
            {
                icon && (
                    <Icon>{icon}</Icon>
                )
            }
            {title}
        </div>
    );
}

export default Button;