import React from 'react';
import { Icon } from '@material-ui/core';

import "./style.scss";

export type MetricProps = {
    iconName: string,
    value: string,
    name: string,
    className: string
}
const Metric: React.FC<MetricProps> = ({
    iconName, value, name, className = ''
}) => (
    <div className={`Metric-Container ${className}`}>
        <Icon className="Metric-Icon">{ iconName }</Icon>
        <div className="Metric-Right">
            <div className="Metric-Value"> { value }</div>
            <div className="Metric-Name"> { name }</div>
        </div>
    </div>   
);

export default Metric;