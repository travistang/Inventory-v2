import React from 'react';
import { Icon } from '@material-ui/core';

export type ListInfoItemProps = {
    iconName: string,
    description: string,
    value: string,
    color: string,
};
const ListInfoItem: React.FC<ListInfoItemProps> = ({
    iconName, description, value, color
}) => (
    <div className="ListInfoItem-Container">
        <div className="ListInfoItem-Left">
            <Icon style={{color, fontSize: 32}}>{iconName} </Icon>
        </div>
        <div className="ListInfoItem-Right" style={{color}}>
            <div style={{color, fontSize: 18}}>{value}</div>
            <div style={{color}}>{description}</div>
        </div>
    </div>
);

export default ListInfoItem;
