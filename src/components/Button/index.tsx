import React from 'react';
import { Color } from '../../data/styles';
import { Icon } from '@material-ui/core';
import "./style.scss";

type ButtonProps = {
    title: String,
    icon?: String,
    color?: Color
};

const Button: React.FC<ButtonProps> = ({
    title, icon, 
    color = "primary"
}) => {
    return (
        <div className={`Button Button-${color}`}>
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