import React from 'react';
import { Icon } from '@material-ui/core';
import { withRouter, RouteComponentProps } from 'react-router';
import GenericCard, { GenericCardExtraProps } from '../GenericCard';

import { range } from 'lodash';

type FoodCardProps = GenericCardExtraProps & {
    name: string,
    unit: string,
    info: {
        totalAmount: number,
        numberOfContainers: number
    },
    onClick?: () => void
};

const SmallInfo = ({ 
    icon, value, style 
}: { icon?: string, value: number | string, style?: any}) => (
    <div className="FoodCard-SmallInfo" style={style}>
        { icon && <Icon>{icon}</Icon> }
        { value }
    </div>
);

const FoodCard: React.FC<FoodCardProps & RouteComponentProps<any>> = ({
    name, unit, info, onClick, ...props
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
            {...props}
        />
    )
}

export default withRouter(FoodCard);