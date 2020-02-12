import React from 'react';
import { Icon } from '@material-ui/core';
import { withRouter, RouteComponentProps } from 'react-router';
import GenericCard from '../GenericCard';

import { range } from 'lodash';

type FoodCardProps = {
    name: string,
    unit: string,
    info: {
        totalAmount: number,
        numberOfContainers: number
    },
    onClick?: () => void
}

const SmallInfo = ({ 
    icon, value, style 
}: { icon?: string, value: number | string, style?: any}) => (
    <div className="FoodCard-SmallInfo" style={style}>
        { icon && <Icon>{icon}</Icon> }
        { value }
    </div>
);

const FoodCard: React.FC<FoodCardProps & RouteComponentProps<any>> = ({
    name, unit, info, onClick
}) => {
    const rightComponent = <SmallInfo value={`${info.totalAmount} ${unit}`} style={{fontSize: 18}} />;
    const smallComponent = info.numberOfContainers ? (range(info.numberOfContainers).map(
        () => <Icon>kitchen</Icon>
    )) : "No containers left";

    return (
        <GenericCard 
            mainText={name} 
            rightComponent={rightComponent} 
            smallComponent={smallComponent} 
            onClick={onClick} 
        />
    )
}

export default withRouter(FoodCard);