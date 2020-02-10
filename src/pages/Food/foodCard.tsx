import React from 'react';
import { Icon } from '@material-ui/core';
import { withRouter, RouteComponentProps } from 'react-router';
import "./style.scss";
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
    return (
        <div className="FoodCard" onClick={onClick}>
            <div className="FoodCard-Left">
                <div className="FoodCard-name">{name}</div>
                <div className="FoodCard-containers">
                    {
                        info.numberOfContainers ? (range(info.numberOfContainers).map(
                            () => <Icon>kitchen</Icon>
                        )) : "No containers left"
                    }
                </div>
            </div>
            
            <div className="FoodCard-Right">
                <SmallInfo value={`${info.totalAmount} ${unit}`} style={{fontSize: 18}} />
            </div>
        </div>
    )
}

export default withRouter(FoodCard);