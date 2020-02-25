import React from 'react';
import { ValueTypes } from '../../components/Input';
import { Icon } from '@material-ui/core';

export type AuxInfoProps = {
    title: string,
    iconName?: string,
    value: ValueTypes
}
const AuxInfo: React.FC<AuxInfoProps> = ({title, iconName, value}) => {
    return (
        <div className="AuxInfo">
            {value ? parseFloat(value.toString()).toFixed(2) : ""}
            <div className="AuxInfo-Title">
                {title}
            </div>
        </div>
    )
}

export default AuxInfo;